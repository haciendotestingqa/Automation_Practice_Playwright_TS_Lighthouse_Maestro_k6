# Mobile — FrontRow + Maestro

[English](README.en.md)

Práctica de automatizacion mobile con [FrontRow](https://github.com/majdukovic/frontrow). La app se clona en `mobile/frontrow/` (no versionada); los flows y scripts de smoke sí están en este repo.

## Smoke suite (versionado)

```text
mobile/scripts/smoke.sh           → motor (android | ios)
mobile/scripts/run-android-smoke.sh
mobile/scripts/run-ios-smoke.sh
mobile/tests/maestro/
├── smoke/launch.yaml
├── events/browse.yaml
├── auth/login.yaml
├── tickets/buy.yaml
└── tickets/detail-cancel.yaml
```

| Plataforma | Comando (setup + smoke) | Flows |
|------------|-------------------------|-------|
| Android | `./mobile/scripts/run-android-smoke.sh` | 5 |
| iOS (Mac) | `./mobile/scripts/run-ios-smoke.sh` | 5 |

Si Metro y la app ya están listos:

```bash
./mobile/scripts/smoke.sh android
./mobile/scripts/smoke.sh ios
```

## Setup manual

```bash
git clone https://github.com/majdukovic/frontrow.git mobile/frontrow
cd mobile/frontrow && npm install
npx expo run:android   # o run:ios en Mac
npx expo start --dev-client &
```
