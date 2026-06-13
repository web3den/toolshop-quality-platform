import { test, expect } from '../../src/fixtures/test.fixtures';
import { customerStatePath } from '../../src/fixtures/auth.paths';
import { target } from '../../src/config/env';

test.describe('Shopping journey', () => {
  test('guest browses, searches, and inspects a product @smoke', async ({ home, productDetail }) => {
    await home.open();
    await home.searchFor('pliers');

    const names = await home.visibleProductNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain('plier');
    }

    await home.openProductByName(names[0]!);
    await expect(productDetail.name).toHaveText(names[0]!);
    await expect(productDetail.addToCart).toBeEnabled();
  });

  test('sorting by price ascending is reflected in the grid @regression', async ({ home }) => {
    await home.open();
    await home.sortBy('price,asc');
    // Grid re-renders after the sorted API call resolves.
    await expect
      .poll(async () => {
        const prices = await home.visiblePrices();
        if (prices.length < 2) return false;
        return prices.every((p, i) => i === 0 || prices[i - 1]! <= p);
      }, { message: 'product grid should be sorted by ascending price' })
      .toBe(true);
  });

  test('adding to cart updates the cart badge @smoke', async ({ home, productDetail, header }) => {
    await home.open();
    await home.openFirstProduct();
    await productDetail.addProductToCart(1);
    await expect(header.cartQuantity, 'cart badge should show 1 item').toHaveText('1');
  });

  test('full checkout: cart -> sign-in -> address -> pay @regression', async ({
    home,
    productDetail,
    header,
    checkout,
  }) => {
    await home.open();
    await home.openFirstProduct();
    await productDetail.addProductToCart(1);
    await expect(header.cartQuantity).toHaveText('1');

    await header.openCart();
    await expect(checkout.proceedFromCart).toBeVisible();
    await checkout.proceedFromCart.click();

    await checkout.signInDuringCheckout(target.users.customer.email, target.users.customer.password);

    // Country + postcode + house number; the app auto-fills the rest from its
    // postcode-lookup service (free-typed city/state is rejected server-side).
    await checkout.fillBillingAddress({ country: 'US', postal_code: '78701', house_number: '141' });

    await checkout.payWithCashOnDelivery();
    await expect(checkout.paymentSuccess).toBeVisible();
  });
});

test.describe('Authenticated session via storageState', () => {
  test.use({ storageState: customerStatePath });

  test('pre-authenticated customer lands signed in (no UI login) @smoke', async ({ page, header }) => {
    await page.goto('/account');
    await expect(header.navMenu).toBeVisible();
    const display = await header.signedInName();
    expect(display.length).toBeGreaterThan(0);
    await expect(header.navSignIn).toHaveCount(0);
  });
});
