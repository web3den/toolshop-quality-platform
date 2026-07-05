import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../../src/fixtures/test.fixtures';

/**
 * Accessibility scans on the highest-traffic pages.
 * Policy: zero "critical" violations is a hard gate; "serious" is reported
 * in the attached JSON for trend triage (gate later once clean).
 */
async function scan(page: import('@playwright/test').Page) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('iframe')
    .analyze();
}

test.describe('Accessibility @a11y', () => {
  test('home page has no critical violations', async ({ home, page }, testInfo) => {
    await home.open();
    const results = await scan(page);
    await testInfo.attach('axe-home.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, critical.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });

  test('login page has no critical violations', async ({ loginPage, page }, testInfo) => {
    await loginPage.open();
    const results = await scan(page);
    await testInfo.attach('axe-login.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, critical.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });
});
