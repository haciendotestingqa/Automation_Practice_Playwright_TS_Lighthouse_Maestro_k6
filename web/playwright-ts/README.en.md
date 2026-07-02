# PrestaShop E2E + Lighthouse — Playwright (TypeScript)

[Español](README.md)

Same E2E suite as `playwright-js/` in TypeScript, plus Lighthouse audits on home, product, and cart pages at [demo.prestashop.com](https://demo.prestashop.com/).

## E2E flow

1. Wait for store provisioning (`waitForShopReady`)
2. Navigate to **Clothes** category
3. Open **Hummingbird printed t-shirt**
4. Add to cart (with retries)
5. Verify cart and start guest checkout

Spec: `tests/e2e/shopping-cart.spec.ts`

## Lighthouse

Audits in `tests/lighthouse/prestashop.spec.ts`:

| Page | Report |
|------|--------|
| Home | `home-*.html` / `.json` |
| Product | `product-*.html` / `.json` |
| Cart | `cart-*.html` / `.json` |

Minimum thresholds (`LIGHTHOUSE_THRESHOLDS`):

| Area | Minimum |
|------|---------|
| Performance | 40 |
| Accessibility | 80 |
| Best Practices | 70 |
| SEO | 70 |

Reports in `lighthouse-reports/` (not versioned). Run with `--workers=1`.

## Structure

```text
fixtures/shop-ready.ts
pages/HomePage.ts
pages/ProductPage.ts
pages/CartPage.ts
tests/e2e/shopping-cart.spec.ts
tests/lighthouse/prestashop.spec.ts
../shared/            → shared helpers
```

## Commands

```bash
npm install
npx playwright install chromium
npm test                              # E2E + Lighthouse
npm run test:lighthouse               # Lighthouse only
npx playwright test tests/e2e         # E2E only
npm run report                        # open HTML report
```

## Notes

- Lighthouse uses Chromium with `--remote-debugging-port=9222` via `playwright-lighthouse`.
- The store runs in an **iframe** → locators use `getShopFrame(page)`.
