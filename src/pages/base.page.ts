import type { Locator, Page } from '@playwright/test';

/**
 * Base page object.
 *
 * Rules enforced across the POM layer:
 *  - selectors live in page objects only (lint guards `tests/` for raw locators),
 *  - every selector uses the app's `data-test` contract, never CSS structure,
 *  - page objects expose domain actions and queries, not Playwright plumbing.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected byTestId(id: string): Locator {
    return this.page.locator(`[data-test="${id}"]`);
  }

  async goto(path: string): Promise<void> {
    // 'domcontentloaded', not 'load': the SPA boots off the DOM, while the
    // window load event can hang on slow ad/CDN assets and time tests out.
    // Real readiness is established by web-first assertions on visible state.
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}
