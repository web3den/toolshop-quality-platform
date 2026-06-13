/**
 * InvoiceBuilder — fluent builder for checkout/invoice payloads.
 *
 * Builders shine where payload shape depends on choices (payment method →
 * payment_details discriminated union). The builder makes each variation
 * intent-revealing in the test body and impossible to mis-assemble.
 */
import { faker } from '@faker-js/faker';

export type PaymentMethod =
  | 'bank-transfer'
  | 'cash-on-delivery'
  | 'credit-card'
  | 'buy-now-pay-later'
  | 'gift-card';

export interface InvoicePayload {
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_postal_code: string;
  payment_method: PaymentMethod;
  payment_details: Record<string, unknown>;
  cart_id: string;
}

export class InvoiceBuilder {
  // Fixed geo-consistent default: the API cross-validates city/state/country,
  // so randomized faker addresses are rejected with 422. Tests that care about
  // address variation use withBillingAddress() with another real address.
  private payload: InvoicePayload = {
    billing_street: '123 Congress Ave',
    billing_city: 'Austin',
    billing_state: 'TX',
    billing_country: 'US',
    billing_postal_code: '78701',
    payment_method: 'cash-on-delivery',
    payment_details: {},
    cart_id: '',
  };

  forCart(cartId: string): this {
    this.payload.cart_id = cartId;
    return this;
  }

  withBillingAddress(address: Partial<Pick<InvoicePayload,
    'billing_street' | 'billing_city' | 'billing_state' | 'billing_country' | 'billing_postal_code'
  >>): this {
    Object.assign(this.payload, address);
    return this;
  }

  payByCashOnDelivery(): this {
    this.payload.payment_method = 'cash-on-delivery';
    this.payload.payment_details = {};
    return this;
  }

  payByBankTransfer(details?: { bank_name?: string; account_name?: string; account_number?: string }): this {
    this.payload.payment_method = 'bank-transfer';
    this.payload.payment_details = {
      bank_name: details?.bank_name ?? 'TestBank',
      account_name: details?.account_name ?? faker.person.fullName().replace(/[^a-zA-Z ]/g, ''),
      account_number: details?.account_number ?? faker.string.numeric(9),
    };
    return this;
  }

  payByCreditCard(details?: {
    credit_card_number?: string;
    expiration_date?: string;
    cvv?: string;
    card_holder_name?: string;
  }): this {
    const future = faker.date.future({ years: 3 });
    const mm = String(future.getMonth() + 1).padStart(2, '0');
    this.payload.payment_method = 'credit-card';
    this.payload.payment_details = {
      credit_card_number: details?.credit_card_number ?? '4111-1111-1111-1111',
      expiration_date: details?.expiration_date ?? `${mm}/${future.getFullYear()}`,
      cvv: details?.cvv ?? faker.string.numeric(3),
      card_holder_name: details?.card_holder_name ?? faker.person.fullName().replace(/[^a-zA-Z ]/g, ''),
    };
    return this;
  }

  payByGiftCard(details?: { gift_card_number?: string; validation_code?: string }): this {
    this.payload.payment_method = 'gift-card';
    this.payload.payment_details = {
      gift_card_number: details?.gift_card_number ?? faker.string.alphanumeric(10),
      validation_code: details?.validation_code ?? faker.string.alphanumeric(6),
    };
    return this;
  }

  payByBuyNowPayLater(installments: 3 | 6 | 9 | 12 = 6): this {
    this.payload.payment_method = 'buy-now-pay-later';
    this.payload.payment_details = { monthly_installments: String(installments) };
    return this;
  }

  build(): InvoicePayload {
    if (!this.payload.cart_id) {
      throw new Error('InvoiceBuilder: forCart(cartId) is required before build()');
    }
    return structuredClone(this.payload);
  }
}
