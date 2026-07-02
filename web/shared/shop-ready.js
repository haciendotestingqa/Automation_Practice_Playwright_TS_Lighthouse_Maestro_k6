/**
 * PrestaShop demo embeds the storefront inside an iframe.
 * @param {import('@playwright/test').Page} page
 */
function getShopFrame(page) {
  return page.frameLocator('iframe').first();
}

/**
 * Waits for PrestaShop demo provisioning and returns the active shop frame.
 * @param {import('@playwright/test').Page} page
 * @param {number} [timeout]
 */
async function waitForShopReady(page, timeout = 120_000) {
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

module.exports = { getShopFrame, waitForShopReady };
