#!/usr/bin/env bash
# Smoke suite — five critical user paths (FrontRow).
# Usage: ./mobile/scripts/smoke.sh android|ios
# QUIET=1 (default): one line per flow, no Maestro step output. QUIET=0 for verbose.
# Requires: FrontRow app installed, Metro running, flows in mobile/tests/maestro/
set -euo pipefail

QUIET="${QUIET:-1}"

PLATFORM="${1:-}"

if [[ "$PLATFORM" != "android" && "$PLATFORM" != "ios" ]]; then
  echo "Usage: ./mobile/scripts/smoke.sh [android|ios]" >&2
  exit 2
fi

MOBILE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

SMOKE_FLOWS=(
  "tests/maestro/smoke/launch.yaml"
  "tests/maestro/events/browse.yaml"
  "tests/maestro/auth/login.yaml"
  "tests/maestro/tickets/buy.yaml"
  "tests/maestro/tickets/detail-cancel.yaml"
)

for f in "${SMOKE_FLOWS[@]}"; do
  if [[ ! -f "$MOBILE_DIR/$f" ]]; then
    echo "✗ smoke flow missing: $f" >&2
    exit 1
  fi
done

if [[ "$PLATFORM" == "android" ]]; then
  DEVICE="${DEVICE:-$(adb devices | awk 'NR==2 {print $1}')}"
  if [[ -z "$DEVICE" ]]; then
    echo "no Android device connected (check 'adb devices')" >&2
    exit 1
  fi
  MAESTRO_ARGS=(--device "$DEVICE")
else
  DEVICE="${DEVICE:-$(xcrun simctl list devices booted | awk -F'[()]' '/Booted/{gsub(/^[ \t]+/, "", $2); print $2; exit}')}"
  if [[ -z "$DEVICE" ]]; then
    echo "no iOS simulator booted" >&2
    exit 1
  fi
  MAESTRO_ARGS=(--device "$DEVICE")
fi

echo "→ smoke suite (${#SMOKE_FLOWS[@]} flows, $PLATFORM):"
if [[ "$QUIET" != "1" ]]; then
  printf '    %s\n' "${SMOKE_FLOWS[@]}"
  echo
fi

run_flow() {
  local flow="$1"
  if [[ "$QUIET" == "1" ]]; then
    printf '  %-45s ' "$flow"
    if maestro "${MAESTRO_ARGS[@]}" test "$MOBILE_DIR/$flow" >/dev/null 2>&1; then
      echo "✓"
      return 0
    fi
    echo "✗"
    return 1
  fi
  echo "─── $flow ───"
  maestro "${MAESTRO_ARGS[@]}" test "$MOBILE_DIR/$flow"
}

FAILED=()
for flow in "${SMOKE_FLOWS[@]}"; do
  if ! run_flow "$flow"; then
    FAILED+=("$flow")
  fi
  [[ "$QUIET" != "1" ]] && echo
done

if [[ ${#FAILED[@]} -eq 0 ]]; then
  echo "✓ smoke passed (${#SMOKE_FLOWS[@]}/${#SMOKE_FLOWS[@]})"
  exit 0
fi

echo "✗ smoke failed (${#FAILED[@]}/${#SMOKE_FLOWS[@]}):"
printf '    %s\n' "${FAILED[@]}"
exit 1
