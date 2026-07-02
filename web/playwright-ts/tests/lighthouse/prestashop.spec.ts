import { test as base, chromium, type Browser, type Page } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { waitForShopReady } from '../../../shared/shop-ready';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

const LIGHTHOUSE_PORT = 9222;

export const LIGHTHOUSE_THRESHOLDS = {
  performance: 40,
  accessibility: 80,
  'best-practices': 70,
  seo: 70,
} as const;

async function launchLighthouseBrowser(): Promise<Browser> {
  return chromium.launch({
    args: [`--remote-debugging-port=${LIGHTHOUSE_PORT}`],
  });
}

async function auditPage(page: Page, reportName: string): Promise<void> {
  await playAudit({
    page,
    port: LIGHTHOUSE_PORT,
    thresholds: LIGHTHOUSE_THRESHOLDS,
    reports: {
      formats: { html: true, json: true, csv: false },
      name: reportName,
      directory: `${process.cwd()}/lighthouse-reports`,
    },
    opts: { logLevel: 'error' },
  });
}

const test = base.extend({
  lighthousePage: async ({}, use) => {
    const browser = await launchLighthouseBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await browser.close();
  },
});

test.describe('Lighthouse audits', () => {
  test('home page performance and accessibility', async ({ lighthousePage }) => {
    await waitForShopReady(lighthousePage);
    await auditPage(lighthousePage, `home-${Date.now()}`);
  });

  test('product page after browsing clothes', async ({ lighthousePage }) => {
    await waitForShopReady(lighthousePage);
    const home = new HomePage(lighthousePage);
    const product = new ProductPage(lighthousePage);
    await home.openCategory();
    await product.openProduct();
    await auditPage(lighthousePage, `product-${Date.now()}`);
  });

  test('cart page with item added', async ({ lighthousePage }) => {
    await waitForShopReady(lighthousePage);
    const home = new HomePage(lighthousePage);
    const product = new ProductPage(lighthousePage);
    const cart = new CartPage(lighthousePage);

    await home.openCategory();
    await product.openProduct();
    await product.addToCart();
    await cart.openCart();

    await auditPage(lighthousePage, `cart-${Date.now()}`);
  });
});
