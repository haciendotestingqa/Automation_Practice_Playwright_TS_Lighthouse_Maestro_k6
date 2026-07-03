# Mobile — FrontRow + Maestro

[Español](README.md)

Mobile automation practice with [FrontRow](https://github.com/majdukovic/frontrow). The app is cloned under `mobile/frontrow/` (not versioned); smoke flows and scripts are in this repo.

## Smoke suite (versioned)

```text
mobile/scripts/smoke.sh           → runner (android | ios)
mobile/scripts/run-android-smoke.sh
mobile/scripts/run-ios-smoke.sh
mobile/tests/maestro/
├── smoke/launch.yaml
├── events/browse.yaml
├── auth/login.yaml
├── tickets/buy.yaml
└── tickets/detail-cancel.yaml
```

| Platform | Command (setup + smoke) | Flows |
|----------|-------------------------|-------|
| Android | `./mobile/scripts/run-android-smoke.sh` | 5 |
| iOS (Mac) | `./mobile/scripts/run-ios-smoke.sh` | 5 |

If Metro and the app are already running:

```bash
./mobile/scripts/smoke.sh android
./mobile/scripts/smoke.sh ios
```

## Manual setup

```bash
git clone https://github.com/majdukovic/frontrow.git mobile/frontrow
cd mobile/frontrow && npm install
npx expo run:android   # or run:ios on Mac
npx expo start --dev-client &
```
