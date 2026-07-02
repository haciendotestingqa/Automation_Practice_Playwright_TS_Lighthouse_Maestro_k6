#!/usr/bin/env bash
# iOS smoke: build/simulator + Metro + full smoke suite (same flows as Android where supported).
# Usage: ./mobile/scripts/run-ios-smoke.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FRONTROW="$ROOT/mobile/frontrow"
SMOKE="$ROOT/mobile/scripts/smoke.sh"

if [[ "$(uname)" != "Darwin" ]]; then
  echo "This script must run on macOS (iOS Simulator)." >&2
  exit 1
fi

if [[ ! -d "$FRONTROW" ]]; then
  echo "FrontRow not found. Clone it first:" >&2
  echo "  git clone https://github.com/majdukovic/frontrow.git mobile/frontrow" >&2
  exit 1
fi

cd "$FRONTROW"
if ! xcrun simctl list devices booted | grep -q Booted; then
  echo "Boot an iOS simulator first (Xcode or: xcrun simctl boot <udid>)" >&2
  exit 1
fi

INSTALLED_APPS="$(xcrun simctl listapps booted 2>/dev/null || true)"
if [[ "$INSTALLED_APPS" != *app.frontrow.qa* ]]; then
  echo "→ Building and installing FrontRow…"
  npx expo run:ios --no-bundler
fi

echo "→ Starting Metro (background)…"
npx expo start --dev-client >/tmp/frontrow-metro.log 2>&1 &
METRO_PID=$!
trap 'kill $METRO_PID 2>/dev/null || true' EXIT
sleep 8

exec "$SMOKE" ios
