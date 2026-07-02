const { getShopFrame } = require('../../shared/shop-ready');
const { PRESTASHOP } = require('../../shared/constants');

class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.shop = getShopFrame(page);
  }

  cartDialog() {
    return this.shop.locator('#blockcart-modal');
  }

  proceedToCheckoutButton() {
    return this.shop.getByRole('link', { name: /proceed to checkout/i });
  }

  async openCart() {
    const dialog = this.cartDialog();
    const modalOpen = await dialog
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);

    if (modalOpen) {
      await dialog.getByRole('link', { name: /proceed to checkout/i }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
    } else {
      await this.shop.getByRole('link', { name: /view cart/i }).click();
    }
    await this.shop.getByRole('heading', { name: /shopping cart/i }).waitFor({
      state: 'visible',
      timeout: 15_000,
    });
  }

  productLine(name = PRESTASHOP.productName) {
    return this.shop.locator('a.product-line__title').filter({ hasText: name }).first();
  }

  itemCountSummary() {
    return this.shop.getByRole('main').getByText(/\b1 item\b/i).first();
  }

  async proceedToCheckout() {
    await this.shop
      .getByRole('main')
      .getByRole('link', { name: /proceed to checkout/i })
      .click();
  }
}

module.exports = { CartPage };
