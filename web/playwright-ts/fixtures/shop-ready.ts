import { test as base, type Page } from '@playwright/test';
import { waitForShopReady } from '../../shared/shop-ready';

type ShopFixtures = {
  shopReadyPage: Page;
};

export const test = base.extend<ShopFixtures>({
  shopReadyPage: async ({ page }, use) => {
    await waitForShopReady(page);
    await use(page);
  },
});
