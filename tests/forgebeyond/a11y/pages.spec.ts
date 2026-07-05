import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../../src/fixtures/forgebeyond.fixtures';
import { KNOWN_A11Y_ISSUES } from './known-issues';

const PAGES = ['/', '/products/', '/labs/', '/case-studies/ci-failure-memory/'];

/**
 * Gate policy (self-owned site → strict bar):
 *  - critical + serious violations fail the run…
 *  - …unless registered in known-issues.ts (documented product debt);
 *  - a registered issue that stops reproducing ALSO fails, forcing the
 *    register to shrink as fixes land — the gate can never go vacuous.
 */
test.describe('Accessibility @a11y', () => {
  for (const path of PAGES) {
    test(`${path} has no unregistered critical/serious violations`, async ({ site, page }, testInfo) => {
      await site.goto(path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      await testInfo.attach(`axe${path.replaceAll('/', '-')}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

      const known = KNOWN_A11Y_ISSUES[path] ?? [];
      const gating = results.violations.filter(
        (v) => (v.impact === 'critical' || v.impact === 'serious') && !known.includes(v.id),
      );
      expect(
        gating.map((v) => `${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} nodes)`),
        'no critical/serious a11y violations outside the known-issues register',
      ).toEqual([]);

      // Register hygiene: a fixed issue must be removed from known-issues.ts.
      const stillPresent = results.violations.map((v) => v.id);
      const stale = known.filter((id) => !stillPresent.includes(id));
      expect(
        stale,
        `these registered issues no longer reproduce on ${path} — remove them from known-issues.ts`,
      ).toEqual([]);
    });
  }
});
