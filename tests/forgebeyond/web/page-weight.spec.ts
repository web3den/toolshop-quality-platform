import { test, expect } from '../../../src/fixtures/forgebeyond.fixtures';

/**
 * Deterministic performance guardrails.
 *
 * Wall-clock timings flake on shared runners, so these budgets assert what a
 * static site fully controls: document size and render-blocking resources.
 * A regression here (bloated bundle, an accidental blocking script) fails
 * reproducibly on every run — trustworthy signal, no "perf flake" noise.
 */
const PAGES = ['/', '/products/', '/labs/', '/case-studies/ci-failure-memory/'];
const MAX_DOCUMENT_KB = 150;

test.describe('Page-weight budgets @regression @perf', () => {
  for (const path of PAGES) {
    test(`${path} document stays under ${MAX_DOCUMENT_KB}KB`, async ({ http }) => {
      const res = await http.get(path);
      const bytes = (await res.body()).byteLength;
      expect(bytes / 1024, `${path} is ${(bytes / 1024).toFixed(1)}KB`).toBeLessThan(MAX_DOCUMENT_KB);
    });
  }

  test('no render-blocking third-party scripts in <head>', async ({ site }) => {
    await site.goto('/');
    const blocking = await site.renderBlockingScripts.evaluateAll((scripts) =>
      scripts.map((s) => (s as HTMLScriptElement).src),
    );
    expect(blocking, `render-blocking scripts: ${blocking.join(', ')}`).toEqual([]);
  });
});
