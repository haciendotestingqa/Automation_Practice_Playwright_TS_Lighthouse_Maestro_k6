import type { FrameLocator, Page } from '@playwright/test';

export function getShopFrame(page: Page): FrameLocator {
  return page.frameLocator('iframe').first();
}

export async function waitForShopReady(page: Page, timeout = 120_000): Promise<FrameLocator> {
  await page.goto(process.env.PRESTASHOP_DEMO_URL || 'https://demo.prestashop.com/', {
    waitUntil: 'domcontentloaded',
    timeout,
  });

  const provisioning = page.getByText(/shop is on its way/i);
  if (await provisioning.isVisible().catch(() => false)) {
    await provisioning.waitFor({ state: 'hidden', timeout });
  }

  const exploreFrontOffice = page.getByRole('link', { name: /explore front office/i });
  if (await exploreFrontOffice.isVisible().catch(() => false)) {
    await exploreFrontOffice.click();
  }

  const shop = getShopFrame(page);
  await shop.getByRole('link', { name: /clothes/i }).first().waitFor({
    state: 'visible',
    timeout: 60_000,
  });

  return shop;
}
