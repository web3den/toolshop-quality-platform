import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailPage extends BasePage {
  readonly name = this.byTestId('product-name');
  readonly unitPrice = this.byTestId('unit-price');
  readonly quantity = this.byTestId('quantity');
  readonly increaseQuantity = this.byTestId('increase-quantity');
  readonly decreaseQuantity = this.byTestId('decrease-quantity');
  readonly addToCart = this.byTestId('add-to-cart');
  readonly addToFavorites = this.byTestId('add-to-favorites');
  readonly outOfStock = this.byTestId('out-of-stock');
  /** Toast shown after cart/favorite actions. */
  readonly toast: ReturnType<Page['locator']>;

  constructor(page: Page) {
    super(page);
    this.toast = page.locator('#toast-container .toast-message, [aria-label="toast"], .toast');
  }

  async addProductToCart(qty = 1): Promise<void> {
    if (qty > 1) {
      await this.quantity.fill(String(qty));
    }
    await this.addToCart.click();
  }
}
