import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Checkout wizard: Cart → Sign in → Billing address → Payment.
 * One page object for the wizard keeps step transitions explicit.
 */
export class CheckoutPage extends BasePage {
  // Step 1 — cart
  readonly cartTotal = this.byTestId('cart-total');
  readonly productTitles = this.byTestId('product-title');
  readonly productQuantities = this.byTestId('product-quantity');
  readonly proceedFromCart = this.byTestId('proceed-1');

  // Step 2 — sign in
  readonly loginEmail = this.byTestId('email');
  readonly loginPassword = this.byTestId('password');
  readonly loginSubmit = this.byTestId('login-submit');
  readonly proceedFromSignIn = this.byTestId('proceed-2');

  // Step 3 — billing address (street/city/state auto-fill from postcode lookup)
  readonly street = this.byTestId('street');
  readonly city = this.byTestId('city');
  readonly state = this.byTestId('state');
  readonly country = this.byTestId('country');
  readonly houseNumber = this.byTestId('house_number');
  readonly postalCode = this.byTestId('postal_code');
  readonly proceedFromAddress = this.byTestId('proceed-3');

  // Step 4 — payment
  readonly paymentMethod = this.byTestId('payment-method');
  readonly finish = this.byTestId('finish');
  readonly paymentSuccess = this.byTestId('payment-success-message');
  readonly paymentError = this.byTestId('payment-error-message');

  constructor(page: Page) {
    super(page);
  }

  async openCart(): Promise<void> {
    await this.goto('/checkout');
    await this.cartTotal.waitFor({ state: 'visible' });
  }

  async signInDuringCheckout(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginSubmit.click();
    await this.proceedFromSignIn.waitFor({ state: 'visible' });
    await this.proceedFromSignIn.click();
  }

  /**
   * The billing form derives street/city/state from the app's postcode-lookup
   * service: the user only picks a country and enters postcode + house number.
   * Free-typing city/state would be rejected server-side (AddressMatchesCountry
   * rule), so the page object mirrors the product's actual input contract.
   */
  async fillBillingAddress(address: {
    country: string; postal_code: string; house_number: string;
  }): Promise<void> {
    await this.country.selectOption(address.country);
    await this.postalCode.fill(address.postal_code);
    await this.houseNumber.fill(address.house_number);
    // Auto-fill is complete once the lookup response populates the city.
    await expect(this.city).not.toHaveValue('', { timeout: 15_000 });
    await this.proceedFromAddress.click();
  }

  async payWithCashOnDelivery(): Promise<void> {
    await this.paymentMethod.selectOption('cash-on-delivery');
    await this.finish.click();
  }
}
