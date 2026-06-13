import { defineConfig, devices } from '@playwright/test';
import { target } from './src/config/env';

/**
 * Projects are execution lanes, tags are selection filters:
 *  - api:          no browser, typed client only (fast feedback first)
 *  - setup:        API-based auth -> storageState per role
 *  - e2e-chromium: user journeys (depends on setup)
 *  - visual:       screenshot comparison, Linux-pinned baselines
 *  - a11y:         axe-core scans
 *
 * Tags: @smoke @regression @contract @a11y @visual @bug-sensitive
 * (@bug-sensitive marks assertions that MUST fail on the with-bugs build —
 *  that lane proves the suite is falsifiable, not vacuously green.)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Tolerate antialiasing, fail on layout/content drift.
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  reporter: process.env.CI
    ? [['blob'], ['github'], ['json', { outputFile: 'test-results/results.json' }], ['list']]
    : [['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }], ['list']],
  // Visual baselines are platform-pinned: generated on Linux in CI/docker only.
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  use: {
    baseURL: target.uiBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
    },
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      testDir: './src/fixtures',
    },
    {
      name: 'e2e-chromium',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testMatch: /tests\/visual\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'a11y',
      testMatch: /tests\/a11y\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
