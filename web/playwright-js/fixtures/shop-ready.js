const { test: base } = require('@playwright/test');
const { waitForShopReady } = require('../../shared/shop-ready');

const test = base.extend({
  shopReadyPage: async ({ page }, use) => {
    await waitForShopReady(page);
    await use(page);
  },
});

module.exports = { test };
