import type { FrameLocator, Locator } from '@playwright/test';

export const ADD_TO_CART_TIMEOUT = 30_000;
export const MAX_ATTEMPTS = 3;

export async function waitForAddToCartSuccess(
  shop: FrameLocator,
  timeout = ADD_TO_CART_TIMEOUT
): Promise<void> {
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

export async function clickAddToCartWithRetry(
  shop: FrameLocator,
  button: Locator,
  maxAttempts = MAX_ATTEMPTS
): Promise<void> {
  await button.scrollIntoViewIfNeeded();
  await button.waitFor({ state: 'visible', timeout: 15_000 });

  let lastError: unknown;
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
