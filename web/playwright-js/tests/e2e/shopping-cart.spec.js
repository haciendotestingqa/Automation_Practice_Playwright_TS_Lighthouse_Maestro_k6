const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/shop-ready');
const { getShopFrame } = require('../../../shared/shop-ready');
const { PRESTASHOP } = require('../../../shared/constants');
const { HomePage } = require('../../pages/HomePage');
const { ProductPage } = require('../../pages/ProductPage');
const { CartPage } = require('../../pages/CartPage');

test.describe('Shopping cart', () => {
  test('guest can browse category, add product to cart and start checkout', async ({
    shopReadyPage: page,
  }) => {
    const shop = getShopFrame(page);
    const home = new HomePage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    await home.openCategory();
    await expect(shop.getByRole('heading', { level: 1 })).toContainText(/clothes/i);

    await product.openProduct();
    await expect(shop.getByRole('heading', { level: 1 })).toContainText(
      PRESTASHOP.productName
    );

    await product.addToCart();
    await cart.openCart();

    await expect(cart.productLine()).toBeVisible();
    await expect(cart.itemCountSummary()).toBeVisible();

    await cart.proceedToCheckout();
    await expect(
      shop.getByRole('heading', { name: /personal information|order as a guest/i })
    ).toBeVisible();
  });
});
