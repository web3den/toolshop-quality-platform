import { test, expect } from '../../../src/fixtures/forgebeyond.fixtures';

/**
 * Visual regression for the marketing site. Static content, self-owned:
 * full-page baselines with no masking — any pixel drift is intentional or
 * a bug. Baselines are Linux-rendered via the baseline workflow (ADR-0003).
 */
test.describe('Visual regression @visual', () => {
  for (const [name, path] of [
    ['home', '/'],
    ['products', '/products/'],
    ['labs', '/labs/'],
    ['case-study', '/case-studies/ci-failure-memory/'],
  ] as const) {
    test(`${name} page layout`, async ({ site, page }) => {
      await site.goto(path);
      // Ensure webfonts are settled so text renders identically across runs.
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
    });
  }
});
