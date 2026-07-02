import { expect } from '@playwright/test';
import { test } from '../../fixtures/shop-ready';
import { getShopFrame } from '../../../shared/shop-ready';
import { PRESTASHOP } from '../../../shared/constants';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

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
