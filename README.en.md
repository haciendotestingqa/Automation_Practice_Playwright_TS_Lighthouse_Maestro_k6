# Practical Automation Lab

[Español](README.md)

Demonstration of automation practices and other testing techniques on free-access demo projects. No private environments or APIs: everything targets public sandboxes ready for hands-on practice.

## Demo targets

| Area | Project | URL |
|------|---------|-----|
| Web E2E, Lighthouse, K6 | PrestaShop Live Demo | [demo.prestashop.com](https://demo.prestashop.com/) |
| Mobile Maestro | FrontRow (React Native) | [github.com/majdukovic/frontrow](https://github.com/majdukovic/frontrow) |

## Practices included

### Web E2E — Playwright (JavaScript and TypeScript)

PrestaShop purchase flow: category → product → cart → guest checkout. Includes Page Object Model, a fixture to wait for demo store provisioning, and shared helpers in `web/shared/`.

### Lighthouse audits

Performance, accessibility, best practices, and SEO on home, product, and cart pages. Reports are generated in `lighthouse-reports/` (not versioned).

### Load testing — K6

- **Smoke:** minimal load to validate availability
- **Browse:** category and product navigation with conservative traffic

### Mobile — Maestro

FrontRow smoke suite: launch, event browsing, login, and ticket purchase. YAML lives in `mobile/tests/maestro/`; the app is cloned locally under `mobile/frontrow/` (not versioned).

## Structure

```text
web/playwright-js/   → JavaScript E2E
web/playwright-ts/   → TypeScript E2E + Lighthouse
web/shared/          → Shared constants and helpers
web/k6/              → Load test scripts
mobile/tests/maestro/ → Versioned Maestro flows
mobile/scripts/       → Execution utilities
docs/                → Test cases and run analysis
```

## Commands

```bash
# JavaScript E2E
cd web/playwright-js && npm install && npm test

# TypeScript E2E
cd web/playwright-ts && npm install && npm test

# Lighthouse (workers=1)
cd web/playwright-ts && npx playwright test tests/lighthouse --workers=1

# K6
k6 run web/k6/prestashop-smoke.js
k6 run web/k6/prestashop-browse.js

# Maestro smoke (FrontRow cloned in mobile/frontrow + emulator running)
./mobile/scripts/run-android-smoke.sh   # Android (5 flows)
./mobile/scripts/run-ios-smoke.sh       # iOS (4 flows)
```

Web setup details in [web/README.en.md](web/README.en.md). Mobile setup in [mobile/README.en.md](mobile/README.en.md).

## Documentation

| Español | English |
|---------|---------|
| [Casos E2E PrestaShop](docs/prestashop-e2e-test-cases.es.md) | [PrestaShop E2E test cases](docs/prestashop-e2e-test-cases.en.md) |
| [Análisis Lighthouse](docs/lighthouse-analisis.es.md) | [Lighthouse analysis](docs/lighthouse-analisis.en.md) |
| [Análisis K6](docs/k6-analisis.es.md) | [K6 analysis](docs/k6-analisis.en.md) |

## Notes

- The PrestaShop demo is provisioned on demand; tests wait for the store boot automatically.
- K6 and Lighthouse use conservative load against the public demo.
