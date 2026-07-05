/**
 * Fixture layer for the ForgeBeyond product.
 *
 * Separate from the Toolshop fixtures on purpose: a static marketing site and
 * a transactional web app have different needs, and cross-product coupling in
 * fixtures is how frameworks rot. Shared plumbing (redaction, poller,
 * reporting conventions) lives in src/utils and is product-agnostic.
 */
import { test as base, expect, request as playwrightRequest, type APIRequestContext } from '@playwright/test';
import { ForgeBeyondSite } from '../pages/forgebeyond/site.page';
import { forgebeyond } from '../config/products';
import { redactHeaders } from '../utils/redact';

interface FbFixtures {
  site: ForgeBeyondSite;
  /** Plain HTTP context for header/redirect/sitemap assertions (no browser). */
  http: APIRequestContext;
}

export const test = base.extend<FbFixtures>({
  site: async ({ page }, use) => use(new ForgeBeyondSite(page)),
  http: async ({}, use, testInfo) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: forgebeyond.baseUrl,
      // Static site: no auth, but keep a UA that identifies the suite in logs.
      extraHTTPHeaders: { 'user-agent': 'toolshop-quality-platform-tests/1.0' },
    });
    const calls: string[] = [];
    // Thin tracing wrapper: record redacted call lines for the report.
    const originalGet = ctx.get.bind(ctx);
    const wrapped: APIRequestContext = new Proxy(ctx, {
      get(targetObj, prop, receiver) {
        if (prop === 'get') {
          return async (url: string, options?: Parameters<typeof originalGet>[1]) => {
            const started = Date.now();
            const res = await originalGet(url, options);
            calls.push(
              `GET ${url} → ${res.status()} (${Date.now() - started}ms) ${JSON.stringify(redactHeaders(Object.entries(res.headers())))}`,
            );
            return res;
          };
        }
        return Reflect.get(targetObj, prop, receiver);
      },
    });
    await use(wrapped);
    if (calls.length > 0) {
      await testInfo.attach('http-log.txt', { body: calls.join('\n'), contentType: 'text/plain' });
    }
    await ctx.dispose();
  },
});

export { expect };
