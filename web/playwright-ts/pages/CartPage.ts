import type { FrameLocator, Locator, Page } from '@playwright/test';
import { getShopFrame } from '../../shared/shop-ready';
import { PRESTASHOP } from '../../shared/constants';

export class CartPage {
  private readonly shop: FrameLocator;

  constructor(page: Page) {
    this.shop = getShopFrame(page);
  }

  cartDialog(): Locator {
    return this.shop.locator('#blockcart-modal');
  }

  async openCart(): Promise<void> {
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

  productLine(name: RegExp = PRESTASHOP.productName): Locator {
    return this.shop.locator('a.product-line__title').filter({ hasText: name }).first();
  }

  itemCountSummary(): Locator {
    return this.shop.getByRole('main').getByText(/\b1 item\b/i).first();
  }

  async proceedToCheckout(): Promise<void> {
    await this.shop
      .getByRole('main')
      .getByRole('link', { name: /proceed to checkout/i })
      .click();
  }
}
