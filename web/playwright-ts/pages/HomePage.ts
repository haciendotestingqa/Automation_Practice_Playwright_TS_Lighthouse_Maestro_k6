import type { FrameLocator, Page } from '@playwright/test';
import { getShopFrame } from '../../shared/shop-ready';
import { PRESTASHOP } from '../../shared/constants';

export class HomePage {
  private readonly shop: FrameLocator;

  constructor(page: Page) {
    this.shop = getShopFrame(page);
  }

  categoryLink(name: string = PRESTASHOP.category) {
    return this.shop.getByRole('link', { name: new RegExp(`^${name}$`, 'i') }).first();
  }

  async openCategory(name: string = PRESTASHOP.category): Promise<void> {
    await this.categoryLink(name).click();
  }
}
