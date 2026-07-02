import type { FrameLocator, Locator, Page } from '@playwright/test';
import { getShopFrame } from '../../shared/shop-ready';
import { PRESTASHOP } from '../../shared/constants';
import { clickAddToCartWithRetry } from '../../shared/add-to-cart';

export class ProductPage {
  private readonly shop: FrameLocator;

  constructor(page: Page) {
    this.shop = getShopFrame(page);
  }

  productArticle(name: RegExp = PRESTASHOP.productName): Locator {
    return this.shop.getByRole('article').filter({ hasText: name });
  }

  productLink(name: RegExp = PRESTASHOP.productName): Locator {
    return this.productArticle(name).getByRole('link', { name }).first();
  }

  addToCartButton(name: RegExp = PRESTASHOP.productName): Locator {
    return this.shop
      .getByRole('main')
      .getByRole('button', { name: new RegExp(`add to cart.*${name.source}`, 'i') })
      .first();
  }

  async openProduct(name: RegExp = PRESTASHOP.productName): Promise<void> {
    await this.productLink(name).click();
    await this.shop
      .getByRole('heading', { level: 1 })
      .filter({ hasText: name })
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  async addToCart(name: RegExp = PRESTASHOP.productName): Promise<void> {
    await clickAddToCartWithRetry(this.shop, this.addToCartButton(name));
  }
}
