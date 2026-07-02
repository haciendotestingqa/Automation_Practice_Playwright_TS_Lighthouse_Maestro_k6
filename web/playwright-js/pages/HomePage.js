const { getShopFrame } = require('../../shared/shop-ready');
const { PRESTASHOP } = require('../../shared/constants');

class HomePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.shop = getShopFrame(page);
  }

  categoryLink(name = PRESTASHOP.category) {
    return this.shop.getByRole('link', { name: new RegExp(`^${name}$`, 'i') }).first();
  }

  async openCategory(name = PRESTASHOP.category) {
    await this.categoryLink(name).click();
  }
}

module.exports = { HomePage };
