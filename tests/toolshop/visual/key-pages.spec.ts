import { test, expect } from '../../../src/fixtures/test.fixtures';

/**
 * Visual regression — layout integrity of revenue-critical pages.
 *
 * Policy:
 *  - Baselines are generated on Linux (CI runner / docker) ONLY, committed to
 *    the repo. Local macOS runs skip unless baselines exist for the platform.
 *  - Dynamic regions (product grid images can rotate) are masked; we assert
 *    chrome/layout, not content. Content is asserted functionally elsewhere.
 *  - maxDiffPixelRatio 2% absorbs font antialiasing; layout breaks exceed it.
 */
test.describe('Visual regression @visual', () => {
  test('home page layout', async ({ home, header, page }) => {
    await home.open();
    await expect(page).toHaveScreenshot('home.png', {
      fullPage: false,
      mask: [home.productImages, header.cartQuantity],
    });
  });

  test('login page layout', async ({ loginPage, page }) => {
    await loginPage.open();
    await expect(page).toHaveScreenshot('login.png', { fullPage: true });
  });

  test('contact page layout', async ({ contact, page }) => {
    await contact.open();
    await expect(page).toHaveScreenshot('contact.png', { fullPage: true });
  });
});
