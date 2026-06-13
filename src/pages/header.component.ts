import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

/** Site-wide navigation header (component object, present on every page). */
export class HeaderComponent extends BasePage {
  readonly navCart = this.byTestId('nav-cart');
  readonly cartQuantity = this.byTestId('cart-quantity');
  readonly navSignIn = this.byTestId('nav-sign-in');
  readonly navMenu = this.byTestId('nav-menu');
  readonly navMyAccount = this.byTestId('nav-my-account');
  readonly navMyFavorites = this.byTestId('nav-my-favorites');
  readonly navMyInvoices = this.byTestId('nav-my-invoices');
  readonly navSignOut = this.byTestId('nav-sign-out');
  readonly navHome = this.byTestId('nav-home');

  constructor(page: Page) {
    super(page);
  }

  /** Displayed name of the signed-in user (the nav-menu dropdown toggle). */
  async signedInName(): Promise<string> {
    return ((await this.navMenu.textContent()) ?? '').trim();
  }

  async openCart(): Promise<void> {
    await this.navCart.click();
  }
}
