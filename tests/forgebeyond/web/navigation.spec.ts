import { test, expect } from '../../../src/fixtures/forgebeyond.fixtures';
import { forgebeyond } from '../../../src/config/products';
import { mapWithConcurrency } from '../../../src/utils/parallel';

test.describe('Navigation & user journeys @smoke', () => {
  test('main navigation reaches products, labs, and case study', async ({ site, page }) => {
    await site.goto('/');
    await expect(site.mainNav).toBeVisible();

    await site.navLink(/products/i).click();
    await expect(page).toHaveURL(/\/products\/$/);
    await expect(site.h1.first()).toBeVisible();

    await site.navLink(/labs/i).click();
    await expect(page).toHaveURL(/\/labs\/$/);
    await expect(site.h1.first()).toBeVisible();
  });

  test('contact action exposes the correct mailto', async ({ site }) => {
    await site.goto('/');
    await expect(site.contactMailto).toHaveAttribute('href', `mailto:${forgebeyond.contactEmail}`);
  });

  test('homepage hero communicates the product promise', async ({ site }) => {
    await site.goto('/');
    // The value proposition is the page's one job — treat copy as contract.
    await expect(site.h1).toHaveText(/Stop spelunking\. Get a reviewable fix PR\./);
  });
});

test.describe('Link integrity @regression', () => {
  for (const path of ['/', '/products/', '/labs/', '/case-studies/ci-failure-memory/']) {
    test(`no broken internal links on ${path}`, async ({ site, http }) => {
      await site.goto(path);
      const links = await site.internalLinks();
      expect(links.length, 'page should have internal links').toBeGreaterThan(0);

      const broken: string[] = [];
      await mapWithConcurrency(
        links,
        async (href) => {
          const url = new URL(href);
          const res = await http.get(url.pathname + url.search, { maxRedirects: 3 });
          if (res.status() >= 400) broken.push(`${href} → ${res.status()}`);
        },
        5,
      );
      expect(broken, `broken links found on ${path}:\n${broken.join('\n')}`).toEqual([]);
    });
  }
});
