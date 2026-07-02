# Web — PrestaShop automation

[Español](README.md)

Web practices on the public [PrestaShop](https://demo.prestashop.com/) demo: E2E with Playwright (JavaScript and TypeScript), Lighthouse audits, and K6 load tests.

## Structure

```text
web/
├── playwright-js/   → JavaScript E2E
├── playwright-ts/   → TypeScript E2E + Lighthouse
├── shared/          → Shared constants and helpers (JS + TS)
└── k6/              → HTTP load test scripts
```

## Modules

| Module | Description | README |
|--------|-------------|--------|
| `playwright-js/` | Same E2E flow in JavaScript | [README.en.md](playwright-js/README.en.md) |
| `playwright-ts/` | TypeScript E2E + Lighthouse audits | [README.en.md](playwright-ts/README.en.md) |
| `shared/` | `shop-ready`, `add-to-cart`, `constants` | — |
| `k6/` | Conservative smoke and browse load | [README.en.md](k6/README.en.md) |

## Covered E2E flow

1. Wait for demo store provisioning (`waitForShopReady`)
2. Navigate to **Clothes** category
3. Open **Hummingbird printed t-shirt**
4. Add to cart (with anti-flaky retries)
5. Verify cart and start guest checkout

JS and TS suites share the same logic; helpers live in `shared/`.

## Quick commands

```bash
# JavaScript E2E
cd web/playwright-js && npm install && npx playwright install chromium && npm test

# TypeScript E2E
cd web/playwright-ts && npm install && npx playwright install chromium && npm test

# Lighthouse only (workers=1)
cd web/playwright-ts && npm run test:lighthouse

# K6 (from repo root)
k6 run web/k6/prestashop-smoke.js
k6 run web/k6/prestashop-browse.js
```

## Related documentation

| Español | English |
|---------|---------|
| [Casos E2E PrestaShop](../docs/prestashop-e2e-test-cases.es.md) | [PrestaShop E2E test cases](../docs/prestashop-e2e-test-cases.en.md) |
| [Análisis Lighthouse](../docs/lighthouse-analisis.es.md) | [Lighthouse analysis](../docs/lighthouse-analisis.en.md) |
| [Análisis K6](../docs/k6-analisis.es.md) | [K6 analysis](../docs/k6-analisis.en.md) |

## Notes

- The demo store runs inside an **iframe**; locators use `getShopFrame(page)`.
- Lighthouse reports are saved in `playwright-ts/lighthouse-reports/` (not versioned).
- K6 hits the root URL via HTTP; it does not replace UI E2E tests.
