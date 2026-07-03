#!/usr/bin/env bash
# Shared Android prep for Maestro smoke runs.
# shellcheck disable=SC2034
FRONTROW_APP_ID="app.frontrow.qa"
MAESTRO_DRIVER_PORT="${MAESTRO_DRIVER_PORT:-7001}"

android_pick_device() {
  DEVICE="${DEVICE:-$(adb devices | awk 'NR>1 && $2=="device" {print $1; exit}')}"
  if [[ -z "$DEVICE" ]]; then
    echo "No Android emulator/device connected. Boot one and check 'adb devices'." >&2
    return 1
  fi
  export DEVICE
}

android_stop_stale_maestro() {
  local pid cmd

  if pgrep -f 'maestro\.cli\.AppKt' >/dev/null 2>&1; then
    echo "→ Stopping stale Maestro sessions (they block port ${MAESTRO_DRIVER_PORT})…"
    pkill -f 'maestro\.cli\.AppKt' 2>/dev/null || true
    sleep 2
    pkill -9 -f 'maestro\.cli\.AppKt' 2>/dev/null || true
    sleep 1
  fi

  if command -v ss >/dev/null 2>&1; then
    pid="$(ss -tlnp 2>/dev/null | grep ":${MAESTRO_DRIVER_PORT} " | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -1 || true)"
    if [[ -n "$pid" ]]; then
      cmd="$(ps -p "$pid" -o cmd= 2>/dev/null || true)"
      if [[ "$cmd" == *maestro* ]]; then
        echo "→ Freeing Maestro driver port ${MAESTRO_DRIVER_PORT} (pid ${pid})…"
        kill -9 "$pid" 2>/dev/null || true
        sleep 1
      fi
    fi
  fi
}

android_prepare_adb() {
  echo "→ Preparing adb for ${DEVICE}…"
  adb -s "$DEVICE" wait-for-device
  adb -s "$DEVICE" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' | grep -q '^1$' || {
    echo "Waiting for emulator boot…"
    adb -s "$DEVICE" wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'
  }
  adb -s "$DEVICE" reverse --remove-all >/dev/null 2>&1 || true
  adb -s "$DEVICE" reverse "tcp:8081" "tcp:8081" >/dev/null 2>&1 || true
}

android_ensure_app_installed() {
  if adb -s "$DEVICE" shell pm list packages 2>/dev/null | grep -q "package:${FRONTROW_APP_ID}"; then
    return 0
  fi

  echo "→ Building and installing FrontRow on ${DEVICE}…"
  (
    cd "$FRONTROW"
    ANDROID_SERIAL="$DEVICE" npx expo run:android --no-bundler
  )
}

android_ensure_metro() {
  local started_here=0

  if curl -sf "${METRO_URL}/status" >/dev/null 2>&1; then
    echo "→ Metro already running at ${METRO_URL}"
    return 0
  fi

  echo "→ Starting Metro (log: ${METRO_LOG})…"
  (
    cd "$FRONTROW"
    npx expo start --dev-client >"$METRO_LOG" 2>&1 &
    echo $! >"${METRO_LOG}.pid"
  )
  started_here=1

  echo -n "→ Waiting for Metro"
  for _ in $(seq 1 60); do
    if curl -sf "${METRO_URL}/status" >/dev/null 2>&1; then
      echo " ready"
      return 0
    fi
    echo -n "."
    sleep 1
  done
  echo

  echo "✗ Metro did not start. Last log lines:" >&2
  tail -20 "$METRO_LOG" >&2 || true
  return 1
}

android_stop_metro_if_started() {
  local pid_file="${METRO_LOG}.pid"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file")"
    kill "$pid" 2>/dev/null || true
    rm -f "$pid_file"
  fi
}

android_maestro_args() {
  android_stop_stale_maestro
  android_prepare_adb
  MAESTRO_ARGS=(--device "$DEVICE")
}
