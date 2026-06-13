import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export type SortOption = 'name,asc' | 'name,desc' | 'price,asc' | 'price,desc';

/** Product overview (home) page: search, filter, sort, grid. */
export class HomePage extends BasePage {
  readonly searchInput = this.byTestId('search-query');
  readonly searchSubmit = this.byTestId('search-submit');
  readonly searchReset = this.byTestId('search-reset');
  readonly searchCaption = this.byTestId('search-caption');
  readonly sortSelect = this.byTestId('sort');
  readonly productNames = this.byTestId('product-name');
  readonly productPrices = this.byTestId('product-price');
  readonly noResults = this.byTestId('no-results');
  readonly productCards: Locator;
  /** Product card thumbnails — masked in visual tests (content rotates). */
  readonly productImages: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('a[data-test^="product-"]');
    this.productImages = page.locator('.card-img-top');
  }

  async open(): Promise<void> {
    await this.goto('/');
    // The grid renders asynchronously after the products API resolves.
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    // The caption renders before the grid swaps, so anchor on the search
    // API response instead of a UI signal that fires too early.
    const searchResponse = this.page.waitForResponse(
      (res) => res.url().includes('/products/search') && res.ok(),
    );
    await this.searchSubmit.click();
    await searchResponse;
    await this.searchCaption.waitFor({ state: 'visible' });
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async visibleProductNames(): Promise<string[]> {
    const names = await this.productNames.allTextContents();
    return names.map((n) => n.trim());
  }

  async visiblePrices(): Promise<number[]> {
    const raw = await this.productPrices.allTextContents();
    return raw.map((p) => Number.parseFloat(p.replace(/[^\d.]/g, '')));
  }

  async openProductByName(name: string): Promise<void> {
    await this.productNames.filter({ hasText: name }).first().click();
  }

  async openFirstProduct(): Promise<string> {
    const first = this.productCards.first();
    const name = (await first.locator('[data-test="product-name"]').textContent())?.trim() ?? '';
    await first.click();
    return name;
  }
}
