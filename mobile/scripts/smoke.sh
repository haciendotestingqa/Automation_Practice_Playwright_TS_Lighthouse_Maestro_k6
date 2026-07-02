#!/usr/bin/env bash
# Smoke suite — five critical user paths (FrontRow).
# Usage: ./mobile/scripts/smoke.sh android|ios
# Requires: FrontRow app installed, Metro running, flows in mobile/tests/maestro/
set -euo pipefail

PLATFORM="${1:-}"

if [[ "$PLATFORM" != "android" && "$PLATFORM" != "ios" ]]; then
  echo "Usage: ./mobile/scripts/smoke.sh [android|ios]" >&2
  exit 2
fi

MOBILE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

ALL_SMOKE_FLOWS=(
  "tests/maestro/smoke/launch.yaml"
  "tests/maestro/events/browse.yaml"
  "tests/maestro/auth/login.yaml"
  "tests/maestro/tickets/buy.yaml"
  "tests/maestro/tickets/detail-cancel.yaml"
)

# detail-cancel.yaml is android-only (cancel dialog not exposed to Maestro on iOS).
if [[ "$PLATFORM" == "android" ]]; then
  SMOKE_FLOWS=("${ALL_SMOKE_FLOWS[@]}")
else
  SMOKE_FLOWS=(
    "tests/maestro/smoke/launch.yaml"
    "tests/maestro/events/browse.yaml"
    "tests/maestro/auth/login.yaml"
    "tests/maestro/tickets/buy.yaml"
  )
fi

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
printf '    %s\n' "${SMOKE_FLOWS[@]}"
if [[ "$PLATFORM" == "ios" ]]; then
  echo "    (detail-cancel.yaml skipped on iOS — android-only)"
fi
echo

FAILED=()
for flow in "${SMOKE_FLOWS[@]}"; do
  echo "─── $flow ───"
  if ! maestro "${MAESTRO_ARGS[@]}" test "$MOBILE_DIR/$flow"; then
    FAILED+=("$flow")
  fi
  echo
done

if [[ ${#FAILED[@]} -eq 0 ]]; then
  echo "✓ smoke passed (${#SMOKE_FLOWS[@]}/${#SMOKE_FLOWS[@]})"
  exit 0
fi

echo "✗ smoke failed (${#FAILED[@]}/${#SMOKE_FLOWS[@]}):"
printf '    %s\n' "${FAILED[@]}"
exit 1
