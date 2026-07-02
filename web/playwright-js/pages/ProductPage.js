const { getShopFrame } = require('../../shared/shop-ready');
const { PRESTASHOP } = require('../../shared/constants');
const { clickAddToCartWithRetry } = require('../../shared/add-to-cart');

class ProductPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.shop = getShopFrame(page);
  }

  productArticle(name = PRESTASHOP.productName) {
    return this.shop.getByRole('article').filter({ hasText: name });
  }

  productLink(name = PRESTASHOP.productName) {
    return this.productArticle(name).getByRole('link', { name }).first();
  }

  addToCartButton(name = PRESTASHOP.productName) {
    // En detalle de producto el botón NO está dentro de <article>;
    // usar main evita confundirlo con "1 other product in the same category".
    return this.shop
      .getByRole('main')
      .getByRole('button', { name: new RegExp(`add to cart.*${name.source}`, 'i') })
      .first();
  }

  async openProduct(name = PRESTASHOP.productName) {
    await this.productLink(name).click();
    await this.shop
      .getByRole('heading', { level: 1 })
      .filter({ hasText: name })
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  async addToCart(name = PRESTASHOP.productName) {
    await clickAddToCartWithRetry(this.shop, this.addToCartButton(name));
  }
}

module.exports = { ProductPage };
