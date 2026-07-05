/**
 * Product registry — the framework tests more than one product.
 *
 * Each product declares its deployments and capabilities. Playwright projects
 * are prefixed with the product name (toolshop-api, forgebeyond-web, ...) so
 * lanes, baselines, and reports never bleed across products.
 */

export interface ForgebeyondConfig {
  /** Public production site (static Astro on CloudFront). */
  baseUrl: string;
  /** Apex origin used for canonical/redirect assertions. */
  canonicalOrigin: string;
  /** Pages expected in the sitemap; the SEO suite fails on drift. */
  sitemapPaths: string[];
  contactEmail: string;
}

export const forgebeyond: ForgebeyondConfig = {
  baseUrl: process.env.FB_BASE_URL ?? 'https://forgebeyond.ai',
  canonicalOrigin: 'https://forgebeyond.ai',
  sitemapPaths: ['/', '/case-studies/ci-failure-memory/', '/products/', '/labs/', '/demo.html'],
  contactEmail: 'den@forgebeyond.com',
};

/** Toolshop config lives in env.ts (multi-target: production/with-bugs/local). */
export { target as toolshopTarget, resolveTarget as resolveToolshopTarget } from './env';
