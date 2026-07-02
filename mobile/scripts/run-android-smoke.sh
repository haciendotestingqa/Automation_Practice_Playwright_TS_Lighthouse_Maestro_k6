#!/usr/bin/env bash
# Android smoke: Metro + full smoke suite (same flows as smoke.sh android).
# Usage: ./mobile/scripts/run-android-smoke.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FRONTROW="$ROOT/mobile/frontrow"
SMOKE="$ROOT/mobile/scripts/smoke.sh"

if [[ ! -d "$FRONTROW" ]]; then
  echo "FrontRow not found. Clone it first:" >&2
  echo "  git clone https://github.com/majdukovic/frontrow.git mobile/frontrow" >&2
  exit 1
fi

if ! adb devices | awk 'NR>1 && $2=="device"' | grep -q .; then
  echo "No Android emulator/device connected (check 'adb devices')" >&2
  exit 1
fi

cd "$FRONTROW"
echo "→ Starting Metro (background)…"
npx expo start --dev-client >/tmp/frontrow-metro.log 2>&1 &
METRO_PID=$!
trap 'kill $METRO_PID 2>/dev/null || true' EXIT
sleep 8

exec "$SMOKE" android
