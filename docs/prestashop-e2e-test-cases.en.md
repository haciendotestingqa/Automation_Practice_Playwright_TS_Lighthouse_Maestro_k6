# Test cases — PrestaShop Demo e-commerce flow

10 Playwright flow test cases (`shopping-cart.spec.ts`); priority on the **executed happy path**.

| Field | Value |
|-------|-------|
| **SUT** | [PrestaShop Demo](https://demo.prestashop.com/) |
| **User** | Guest |
| **Product** | Hummingbird printed t-shirt · Clothes category |
| **Spec** | `web/playwright-ts/tests/e2e/shopping-cart.spec.ts` |
| **Command** | `cd web/playwright-ts && npx playwright test tests/e2e/shopping-cart.spec.ts` |

---

## Executed case (happy path)

| | |
|---|---|
| **ID** | **TC-PS-07** |
| **Priority** | P1 (Critical) |
| **Code name** | `guest can browse category, add product to cart and start checkout` |
| **Scope** | Demo → iframe → Clothes → Hummingbird → add to cart → cart (1 item) → guest checkout |
| **Status** | ✅ **EXECUTED** — PASS (~20–25 s) |

The flow does **not** complete payment or order confirmation; it ends at *Personal information* / *Order as a guest*.

---

## Index (10 cases)

| # | ID | Title | Priority | Auto | In TC-PS-07 |
|---|-----|--------|----------|------|-------------|
| 1 | TC-PS-01 | Provision store and load catalog in iframe | P1 (Critical) | Partial | ✅ Setup |
| 2 | TC-PS-02 | Navigate to Clothes category | P1 (Critical) | Yes | ✅ |
| 3 | TC-PS-03 | Open Hummingbird printed t-shirt detail | P1 (Critical) | Yes | ✅ |
| 4 | TC-PS-04 | Add product to cart | P1 (Critical) | Yes | ✅ |
| 5 | TC-PS-05 | View cart with 1 item | P1 (Critical) | Yes | ✅ |
| 6 | TC-PS-06 | Start guest checkout | P1 (Critical) | Yes | ✅ (end) |
| 7 | **TC-PS-07** | **Full guest E2E flow** | **P1 (Critical)** | **Yes** | **✅ EXECUTED** |
| 8 | TC-PS-08 | Retry on intermittent Add to cart | P1 (Critical) | Yes | TC-PS-04 helper |
| 9 | TC-PS-09 | Post-add modal does not block cart | P1 (Critical) | Yes | TC-PS-05 helper |
| 10 | TC-PS-10 | Checkout with empty cart | P2 (Important) | No | Negative |

---

## Legend

| **Priority** | P1 (Critical) · P2 (Important) |
| **Auto** | Yes · Partial · No |
| **In TC-PS-07** | Included in the executed Playwright test |

---

## TC-PS-01 — Provision store and load catalog in iframe

`Part of TC-PS-07` · P1 (Critical) · Smoke · Auto: Partial

**Priority:** P1 (Critical)

**Preconditions:** Internet access.

**Steps**

1. Open `https://demo.prestashop.com/`
2. Wait for “Shop is on its way” if shown
3. Click “Explore front office” if applicable
4. Verify store inside the iframe

**Expected result:** Catalog visible; **Clothes** link in menu.

---

## TC-PS-02 — Navigate to Clothes category

`Part of TC-PS-07` · P1 (Critical) · Functional · Auto: Yes

**Priority:** P1 (Critical)

**Preconditions:** TC-PS-01 completed.

**Steps**

1. Click **Clothes** from home (iframe)

**Expected result:** Clothes listing; H1 contains **Clothes**.

---

## TC-PS-03 — Open Hummingbird printed t-shirt detail

`Part of TC-PS-07` · P1 (Critical) · Functional · Auto: Yes

**Priority:** P1 (Critical)

**Preconditions:** TC-PS-02 completed.

**Steps**

1. Click **Hummingbird printed t-shirt** in the listing

**Expected result:** H1 with product name; **Add to cart** button visible in `main`.

---

## TC-PS-04 — Add product to cart

`Part of TC-PS-07` · P1 (Critical) · Functional · Auto: Yes

**Priority:** P1 (Critical)

**Preconditions:** TC-PS-03 completed.

**Steps**

1. Click **Add to cart** on the product page

**Expected result:** Confirmation (modal, text, or badge); cart with **1** item.

---

## TC-PS-05 — View cart with 1 item

`Part of TC-PS-07` · P1 (Critical) · Functional · Auto: Yes

**Priority:** P1 (Critical)

**Preconditions:** TC-PS-04 completed.

**Steps**

1. Open cart (modal → Proceed to checkout, or View cart)
2. Review contents

**Expected result:** **Shopping cart**; **Hummingbird** line item; **1 item** summary.

---

## TC-PS-06 — Start guest checkout

`Part of TC-PS-07 (last automated step)` · P1 (Critical) · Smoke · Auto: Yes

**Priority:** P1 (Critical)

**Preconditions:** TC-PS-05 completed.

**Steps**

1. Click **Proceed to checkout** in the cart

**Expected result:** **Personal information** or **Order as a guest** screen.

---

## TC-PS-07 — Full guest E2E flow ✅ EXECUTED

Chains TC-PS-01 through TC-PS-06 · P1 (Critical) · Smoke · E2E · Auto: Yes

**Priority:** P1 (Critical)

**Preconditions:** Internet access. Guest user.

**Steps**

1. Open `https://demo.prestashop.com/`, wait for provisioning, and verify store in iframe (TC-PS-01)
2. Click **Clothes** from home (TC-PS-02)
3. Click **Hummingbird printed t-shirt** in the listing (TC-PS-03)
4. Click **Add to cart** on the product page (TC-PS-04)
5. Open cart and verify **Hummingbird** line item with **1 item** summary (TC-PS-05)
6. Click **Proceed to checkout** in the cart (TC-PS-06)

**Expected result:** **Personal information** or **Order as a guest** screen; cart with **1** item. The flow does **not** complete payment or order confirmation.

**Obtained result**

Single test in spec `shopping-cart.spec.ts`. Chains TC-PS-01 through TC-PS-06 in one run.

| Field | Value |
|-------|-------|
| **Priority** | P1 (Critical) |
| **Type** | Smoke · E2E |
| **Code** | `guest can browse category, add product to cart and start checkout` |
| **Status** | ✅ Executed — PASS (~20–25 s) |

| Step | Action | Assert |
|------|--------|--------|
| 1 | `shopReadyPage` — store in iframe | Clothes visible |
| 2 | Open **Clothes** | H1 = Clothes |
| 3 | Open **Hummingbird** | H1 = product |
| 4 | **Add to cart** | Success (retry helper) |
| 5 | Open cart | Product + **1 item** |
| 6 | **Proceed to checkout** | Guest screen |

```bash
cd web/playwright-ts && npx playwright test tests/e2e/shopping-cart.spec.ts
```

---

## TC-PS-08 — Retry on intermittent Add to cart

Related to TC-PS-04 / TC-PS-07 · P1 (Critical) · Regression · Auto: Yes

**Priority:** P1 (Critical)

**Steps**

1. Run add to cart when the demo responds slowly

**Expected result:** Up to 3 attempts (`clickAddToCartWithRetry`); explicit success or failure signal.

---

## TC-PS-09 — Post-add modal does not block cart

Related to TC-PS-05 / TC-PS-07 · P1 (Critical) · UI · Auto: Yes

**Priority:** P1 (Critical)

**Steps**

1. After add to cart, use `CartPage.openCart()` flow with `#blockcart-modal`

**Expected result:** Reach Shopping cart without overlay blocking the header.

---

## TC-PS-10 — Checkout with empty cart

P2 (Important) · Negative · Auto: No

**Priority:** P2 (Important)

**Steps**

1. Go to cart with no products
2. Try **Proceed to checkout**

**Expected result:** Does not advance to order form; empty cart or controlled redirect.

---

## TC-PS-07 matrix (executed)

| Step | Page Object | Helper |
|------|-------------|--------|
| Iframe setup | — | `waitForShopReady` |
| Clothes | `HomePage` | `getShopFrame` |
| Product | `ProductPage` | — |
| Add to cart | `ProductPage` | `clickAddToCartWithRetry` |
| Cart | `CartPage` | Modal / View cart |
| Checkout | `CartPage` | — |

---

## Test data

| Data | Value |
|------|-------|
| URL | `https://demo.prestashop.com/` |
| Category | Clothes |
| Product | Hummingbird printed t-shirt |
| User | Guest |
| Cart items | 1 |
