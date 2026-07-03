#!/usr/bin/env bash
# Android: Metro + Maestro smoke (or a single flow).
#
# Usage (from repo root):
#   ./mobile/scripts/run-android-smoke.sh
#   ./mobile/scripts/run-android-smoke.sh tests/maestro/events/browse.yaml
#   DEVICE=emulator-5554 ./mobile/scripts/run-android-smoke.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MOBILE_DIR="$ROOT/mobile"
FRONTROW="$MOBILE_DIR/frontrow"
SMOKE="$MOBILE_DIR/scripts/smoke.sh"
LIB="$MOBILE_DIR/scripts/lib/android-env.sh"
METRO_LOG="${METRO_LOG:-/tmp/frontrow-metro.log}"
METRO_URL="${METRO_URL:-http://localhost:8081}"
FLOW_ARG="${1:-}"

# shellcheck source=/dev/null
source "$LIB"

if ! command -v maestro >/dev/null 2>&1; then
  echo "Maestro CLI not found. Install: https://maestro.mobile.dev/docs/getting-started/installing-maestro" >&2
  exit 1
fi

if ! command -v adb >/dev/null 2>&1; then
  echo "adb not found (install Android SDK platform-tools)." >&2
  exit 1
fi

android_pick_device

if [[ ! -d "$FRONTROW" ]]; then
  echo "FrontRow not found. Clone it first:" >&2
  echo "  git clone https://github.com/majdukovic/frontrow.git mobile/frontrow" >&2
  echo "  cd mobile/frontrow && npm install" >&2
  exit 1
fi

if [[ ! -d "$FRONTROW/node_modules" ]]; then
  echo "→ Installing FrontRow dependencies…"
  (cd "$FRONTROW" && npm install)
fi

trap 'android_stop_metro_if_started' EXIT

android_stop_stale_maestro
android_prepare_adb
android_ensure_app_installed
android_ensure_metro

echo "→ Device: $DEVICE"

if [[ -n "$FLOW_ARG" ]]; then
  FLOW_PATH="$FLOW_ARG"
  if [[ "$FLOW_PATH" != /* ]]; then
    FLOW_PATH="$MOBILE_DIR/$FLOW_PATH"
  fi
  if [[ ! -f "$FLOW_PATH" ]]; then
    echo "✗ Flow not found: $FLOW_ARG" >&2
    exit 1
  fi
  echo "→ Running flow: ${FLOW_ARG#"$MOBILE_DIR"/}"
  exec maestro --device "$DEVICE" test "$FLOW_PATH"
fi

exec "$SMOKE" android
