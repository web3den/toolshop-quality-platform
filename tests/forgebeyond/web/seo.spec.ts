import { test, expect } from '../../../src/fixtures/forgebeyond.fixtures';
import { forgebeyond } from '../../../src/config/products';

/**
 * SEO & discoverability. For a marketing site these ARE the acceptance
 * criteria: every page must be indexable, canonicalized, and render one
 * clear h1 with a SERP-worthy description.
 */
const CONTENT_PAGES = [
  { path: '/', titlePattern: /ForgeBeyond/ },
  { path: '/products/', titlePattern: /ForgeBeyond/ },
  { path: '/labs/', titlePattern: /Labs/ },
  { path: '/case-studies/ci-failure-memory/', titlePattern: /Case Study/i },
];

test.describe('SEO fundamentals @smoke @seo', () => {
  for (const { path, titlePattern } of CONTENT_PAGES) {
    test(`${path} has canonical, description, single h1, title`, async ({ site, page }) => {
      await site.goto(path);
      await expect(page).toHaveTitle(titlePattern);
      await site.expectSeoBasics(path);
    });
  }

  test('demo page is reachable and titled', async ({ site, page }) => {
    await site.goto('/demo.html');
    await expect(page).toHaveTitle(/ForgeBeyond/);
  });
});

test.describe('Crawler contract @seo @regression', () => {
  test('robots.txt allows crawling and points to the sitemap', async ({ http }) => {
    const res = await http.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Allow: /');
    expect(body).toContain(`Sitemap: ${forgebeyond.canonicalOrigin}/sitemap.xml`);
    expect(body, 'nothing should be disallowed on a marketing site').not.toMatch(/Disallow:\s*\/\S/);
  });

  test('sitemap lists exactly the expected pages (drift gate)', async ({ http }) => {
    const res = await http.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]!).pathname)
      .sort();
    // Exact match on purpose: a page added without updating the registry (or
    // silently dropped from the sitemap) should fail loudly, not drift.
    expect(locs).toEqual([...forgebeyond.sitemapPaths].sort());
  });

  test('every sitemap URL returns 200 with HTML', async ({ http }) => {
    for (const path of forgebeyond.sitemapPaths) {
      const res = await http.get(path);
      expect(res.status(), `${path} must be live`).toBe(200);
      expect(res.headers()['content-type'], `${path} content type`).toContain('text/html');
    }
  });

  test('social preview assets resolve (og:image, favicon)', async ({ http }) => {
    for (const asset of ['/og-image.svg', '/favicon.svg']) {
      const res = await http.get(asset);
      expect(res.status(), `${asset} must resolve`).toBe(200);
      expect(res.headers()['content-type']).toContain('svg');
    }
  });
});
