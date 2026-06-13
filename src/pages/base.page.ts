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
    await this.page.goto(path);
  }
}
