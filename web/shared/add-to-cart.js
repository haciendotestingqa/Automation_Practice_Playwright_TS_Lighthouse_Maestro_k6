/** @typedef {import('@playwright/test').FrameLocator} FrameLocator */
/** @typedef {import('@playwright/test').Locator} Locator */

const ADD_TO_CART_TIMEOUT = 30_000;
const MAX_ATTEMPTS = 3;

/**
 * Espera cualquiera de las señales de éxito tras añadir al carrito.
 * @param {FrameLocator} shop
 * @param {number} [timeout]
 */
async function waitForAddToCartSuccess(shop, timeout = ADD_TO_CART_TIMEOUT) {
  await Promise.any([
    shop.locator('#blockcart-modal').waitFor({ state: 'visible', timeout }),
    shop
      .getByRole('link', { name: /view cart.*\(?1 product/i })
      .waitFor({ state: 'visible', timeout }),
    shop
      .getByRole('dialog')
      .filter({ hasText: /added to your cart|product successfully added/i })
      .waitFor({ state: 'visible', timeout }),
    shop
      .getByText(/added to your cart|product successfully added/i)
      .waitFor({ state: 'visible', timeout }),
  ]);
}

/**
 * Clic en Add to cart con reintentos y múltiples señales de confirmación.
 * @param {FrameLocator} shop
 * @param {Locator} button
 * @param {number} [maxAttempts]
 */
async function clickAddToCartWithRetry(shop, button, maxAttempts = MAX_ATTEMPTS) {
  await button.scrollIntoViewIfNeeded();
  await button.waitFor({ state: 'visible', timeout: 15_000 });

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt === 1) {
        await button.click();
      } else {
        await button.click({ force: true });
      }
      await waitForAddToCartSuccess(shop);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

module.exports = {
  ADD_TO_CART_TIMEOUT,
  MAX_ATTEMPTS,
  waitForAddToCartSuccess,
  clickAddToCartWithRetry,
};
