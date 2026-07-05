import { expect, type Locator, type Page } from '@playwright/test';
import { forgebeyond } from '../../config/products';

/**
 * ForgeBeyond marketing site (static Astro on CloudFront).
 *
 * A content site has no data-test contract, so locators anchor on the
 * accessibility tree (roles, aria-labels, headings) — the same surface real
 * users and assistive tech consume, and the most change-resistant layer of a
 * static site.
 */
export class ForgeBeyondSite {
  readonly mainNav: Locator;
  readonly h1: Locator;
  readonly canonical: Locator;
  readonly metaDescription: Locator;
  readonly contactMailto: Locator;
  /** Head scripts that block rendering (no async/defer/module). */
  readonly renderBlockingScripts: Locator;

  constructor(readonly page: Page) {
    this.mainNav = page.getByRole('navigation', { name: 'Main navigation' });
    this.h1 = page.locator('h1');
    this.canonical = page.locator('link[rel="canonical"]');
    this.metaDescription = page.locator('meta[name="description"]');
    this.contactMailto = page.locator('a[href^="mailto:"]').first();
    this.renderBlockingScripts = page.locator(
      'head script[src]:not([async]):not([defer]):not([type="module"])',
    );
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  navLink(name: string | RegExp): Locator {
    return this.mainNav.getByRole('link', { name });
  }

  /** All same-origin hrefs on the current page (for link-integrity checks). */
  async internalLinks(): Promise<string[]> {
    const hrefs = await this.page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).href),
    );
    const origin = new URL(forgebeyond.canonicalOrigin).origin;
    return [...new Set(hrefs.filter((h) => h.startsWith(origin)))];
  }

  async expectSeoBasics(expectedCanonicalPath: string): Promise<void> {
    await expect(this.canonical, 'canonical URL must be absolute and correct').toHaveAttribute(
      'href',
      `${forgebeyond.canonicalOrigin}${expectedCanonicalPath}`,
    );
    const description = await this.metaDescription.getAttribute('content');
    expect(description, 'meta description must exist').toBeTruthy();
    expect(
      description!.length,
      `meta description should be 50–160 chars for SERP display, got ${description!.length}`,
    ).toBeGreaterThanOrEqual(50);
    expect(description!.length).toBeLessThanOrEqual(180);
    await expect(this.h1.first(), 'page needs a visible h1').toBeVisible();
    expect(await this.h1.count(), 'exactly one h1 per page').toBe(1);
  }
}
