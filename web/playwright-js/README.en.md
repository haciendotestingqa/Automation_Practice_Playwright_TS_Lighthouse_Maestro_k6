# PrestaShop E2E — Playwright (JavaScript)

[Español](README.md)

E-commerce flow on [demo.prestashop.com](https://demo.prestashop.com/) using Page Object Model and shared helpers.

## Covered flow

1. Wait for store provisioning (`waitForShopReady`)
2. Navigate to **Clothes** category
3. Open **Hummingbird printed t-shirt**
4. Add to cart (with retries)
5. Verify cart and start guest checkout

## Structure

```text
fixtures/shop-ready.js    → shopReadyPage fixture
pages/HomePage.js
pages/ProductPage.js
pages/CartPage.js
tests/e2e/shopping-cart.spec.js
../shared/shop-ready.js   → iframe + demo boot
../shared/add-to-cart.js  → anti-flaky add to cart
```

## Commands

```bash
npm install
npx playwright install chromium
npm test
npm run test:headed   # visible browser
```

## Selector notes

- The store runs inside an **iframe** → all locators use `getShopFrame(page)`.
- On the product page, the Add to cart button is in `main`, not `article` (avoids related products).
- After add to cart, open the cart via the **Proceed to checkout** modal (the header stays blocked).
