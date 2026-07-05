import { test, expect } from '../../../src/fixtures/forgebeyond.fixtures';
import { forgebeyond } from '../../../src/config/products';

/** Redirect & error-handling contract of the CDN/site infrastructure. */
test.describe('Routing & redirects @regression', () => {
  test('http upgrades to https with a permanent redirect', async ({ http }) => {
    const res = await http.get(forgebeyond.canonicalOrigin.replace('https://', 'http://'), {
      maxRedirects: 0,
    });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe(`${forgebeyond.canonicalOrigin}/`);
  });

  test('directory URLs without trailing slash redirect to canonical form', async ({ http }) => {
    const res = await http.get('/products', { maxRedirects: 0 });
    expect([301, 302]).toContain(res.status());
    // Location may be relative (RFC 7231 §7.1.2); resolve before comparing.
    const location = new URL(res.headers()['location'] ?? '', forgebeyond.canonicalOrigin).href;
    expect(location).toBe(`${forgebeyond.canonicalOrigin}/products/`);
  });

  test('www serves content that canonicalizes to the apex domain', async ({ http }) => {
    const res = await http.get('https://www.forgebeyond.ai/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain(`rel="canonical" href="${forgebeyond.canonicalOrigin}/"`);
  });

  test('unknown paths return a real 404 status, not a soft 200 @smoke', async ({ http }) => {
    const res = await http.get('/this-page-does-not-exist-42');
    // Soft 404s poison search indexing and monitoring — status must be honest.
    expect(res.status()).toBe(404);
  });
});
