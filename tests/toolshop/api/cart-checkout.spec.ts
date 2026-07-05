import { test, expect } from '../../../src/fixtures/test.fixtures';
import { unwrap } from '../../../src/api/client';
import { InvoiceBuilder } from '../../../src/data/builders/invoice.builder';
import { resolveBillingAddress } from '../../../src/data/factories/address.factory';
import { pollUntil } from '../../../src/utils/poller';
import { loginToken, registerFreshUser } from '../../../src/api/auth';
import { createToolshopClient } from '../../../src/api/client';

interface CartView {
  cart_items?: Array<{ quantity: number; product?: { id: string; price: number } }>;
}

test.describe('Cart & Checkout API', () => {
  test('creates a cart and adds products in parallel @smoke', async ({ data, api }) => {
    const cart = await data.seedCart(3, 2);
    const view = unwrap(
      await api.GET('/carts/{cartId}', { params: { path: { cartId: cart.cartId } } }),
    ) as CartView;
    expect(view.cart_items).toHaveLength(3);
    for (const item of view.cart_items!) {
      expect(item.quantity).toBe(2);
    }
  });

  test('completes checkout with cash-on-delivery and invoice appears in account @regression', async ({
    data,
    apiAsCustomer,
  }) => {
    const cart = await data.seedCart(2, 1);

    const invoice = new InvoiceBuilder()
      .forCart(cart.cartId)
      .withBillingAddress(await resolveBillingAddress())
      .payByCashOnDelivery()
      .build();

    const created = unwrap(await apiAsCustomer.POST('/invoices', { body: invoice })) as {
      id?: string;
      invoice_number?: string;
      total?: number;
    };
    expect(created.id).toBeTruthy();
    expect(created.invoice_number, 'invoice number must follow the INV-<digits> scheme').toMatch(
      /^INV-\d+$/,
    );

    const expectedTotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    expect(created.total).toBeCloseTo(expectedTotal, 1);

    // Eventually-consistent read side: poll the account's invoice list.
    const found = await pollUntil(
      async () => {
        const page = unwrap(
          await apiAsCustomer.GET('/invoices', { params: { query: {} } }),
        ) as { data?: Array<{ id: string; invoice_number?: string }> };
        return page.data?.find((inv) => inv.id === created.id);
      },
      { timeoutMs: 15_000, description: `invoice ${created.id} visible in account list` },
    );
    expect(found.invoice_number).toBe(created.invoice_number);
  });

  test('checkout with credit card payment details @regression', async ({ data, apiAsCustomer }) => {
    const cart = await data.seedCart(1, 1);
    const invoice = new InvoiceBuilder()
      .forCart(cart.cartId)
      .withBillingAddress(await resolveBillingAddress())
      .payByCreditCard()
      .build();
    const created = unwrap(await apiAsCustomer.POST('/invoices', { body: invoice })) as {
      id?: string;
      total?: number;
    };
    expect(created.id).toBeTruthy();
    // Oracle: the cart we seeded, not the response itself — a checkout that
    // charges the wrong amount must fail here. (The invoice endpoints do not
    // expose payment_method, so the method itself has no readable oracle.)
    const expectedTotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    expect(created.total, 'invoice total must equal seeded cart total').toBeCloseTo(expectedTotal, 1);

    const persisted = unwrap(
      await apiAsCustomer.GET('/invoices/{invoiceId}', {
        params: { path: { invoiceId: created.id! } },
      }),
    ) as { status?: string; total?: number };
    expect(persisted.status, 'fresh card-paid invoice must await fulfillment').toBe(
      'AWAITING_FULFILLMENT',
    );
    expect(persisted.total).toBeCloseTo(expectedTotal, 1);
  });

  test('rejects checkout for an anonymous caller @regression', async ({ data, api }) => {
    const cart = await data.seedCart(1, 1);
    const invoice = new InvoiceBuilder().forCart(cart.cartId).payByCashOnDelivery().build();
    const res = await api.POST('/invoices', { body: invoice });
    expect(res.response.status).toBe(401);
  });

  test('a customer cannot read another user\'s invoices (tenant isolation) @regression', async ({
    apiAsCustomer,
  }) => {
    // Freshly registered "other" user: guaranteed distinct from whichever
    // customer identity the lockout-aware resolver picked for this run.
    const otherCreds = await registerFreshUser();
    const otherToken = await loginToken(otherCreds.email, otherCreds.password);
    const other = createToolshopClient({ token: otherToken });

    const mine = unwrap(
      await apiAsCustomer.GET('/invoices', { params: { query: {} } }),
    ) as { data?: Array<{ id: string }> };
    test.skip(!mine.data || mine.data.length === 0, 'needs at least one invoice for the main customer');

    const target_invoice = mine.data![0]!;
    const res = await other.GET('/invoices/{invoiceId}', {
      params: { path: { invoiceId: target_invoice.id } },
    });
    expect([401, 403, 404]).toContain(res.response.status);
  });
});
