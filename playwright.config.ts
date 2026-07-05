import { defineConfig, devices } from '@playwright/test';
import { target } from './src/config/env';
import { forgebeyond } from './src/config/products';

/**
 * Multi-product configuration. Projects are prefixed by product so lanes,
 * visual baselines, and reports never bleed across products:
 *
 *   toolshop-*     — Toolshop e-commerce app (API + UI, multi-target:
 *                    production / with-bugs / local via TARGET env var)
 *   forgebeyond-*  — forgebeyond.ai marketing site (web / a11y / visual)
 *
 * Tags stay product-agnostic filters: @smoke @regression @contract @a11y
 * @visual @seo @perf @bug-sensitive.
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
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  reporter: process.env.CI
    ? [
        ['blob'],
        ['github'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['allure-playwright', { resultsDir: 'allure-results' }],
        ['list'],
      ]
    : [
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['allure-playwright', { resultsDir: 'allure-results' }],
        ['list'],
      ],
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    // ── Toolshop ─────────────────────────────────────────────────────────
    {
      name: 'toolshop-api',
      testMatch: /tests\/toolshop\/api\/.*\.spec\.ts/,
      use: { baseURL: target.uiBaseUrl },
    },
    {
      name: 'toolshop-setup',
      testMatch: /auth\.setup\.ts/,
      testDir: './src/fixtures',
    },
    {
      name: 'toolshop-e2e',
      testMatch: /tests\/toolshop\/e2e\/.*\.spec\.ts/,
      dependencies: ['toolshop-setup'],
      use: { ...devices['Desktop Chrome'], baseURL: target.uiBaseUrl },
    },
    {
      name: 'toolshop-visual',
      testMatch: /tests\/toolshop\/visual\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: target.uiBaseUrl,
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: 'toolshop-a11y',
      testMatch: /tests\/toolshop\/a11y\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: target.uiBaseUrl },
    },

    // ── ForgeBeyond ──────────────────────────────────────────────────────
    {
      name: 'forgebeyond-web',
      testMatch: /tests\/forgebeyond\/web\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: forgebeyond.baseUrl },
    },
    {
      name: 'forgebeyond-a11y',
      testMatch: /tests\/forgebeyond\/a11y\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: forgebeyond.baseUrl },
    },
    {
      name: 'forgebeyond-visual',
      testMatch: /tests\/forgebeyond\/visual\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: forgebeyond.baseUrl,
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
});
