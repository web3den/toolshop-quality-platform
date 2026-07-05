/**
 * Layered fixture composition.
 *
 * Layer 1 — pages: page objects wired to the current page.
 * Layer 2 — api: anonymous + authenticated typed API clients.
 * Layer 3 — data: factories/seeders with automatic teardown. Tests register
 *           created resources; the fixture deletes them after the test even
 *           on failure, keeping shared environments clean.
 */
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ContactPage } from '../pages/contact.page';
import { HeaderComponent } from '../pages/header.component';
import { createToolshopClient, type ToolshopClient } from '../api/client';
import { loginToken, resolveCustomerCredentials, type Credentials } from '../api/auth';
import { ApiLog } from '../api/logging';
import { target } from '../config/env';
import { seedCart, type SeededCart } from '../data/seeding/cart.seeder';

type Cleanup = () => Promise<void>;

export interface DataLifecycle {
  /** Register an async cleanup to run after the test (LIFO order). */
  defer(cleanup: Cleanup): void;
  /** Create an anonymous cart seeded with N products; cart is disposable. */
  seedCart(productCount?: number, quantity?: number): Promise<SeededCart>;
}

interface Fixtures {
  home: HomePage;
  loginPage: LoginPage;
  productDetail: ProductDetailPage;
  checkout: CheckoutPage;
  contact: ContactPage;
  header: HeaderComponent;
  /** Per-test HTTP log; redacted transcript auto-attaches to the report. */
  apiLog: ApiLog;
  api: ToolshopClient;
  apiAsCustomer: ToolshopClient;
  apiAsAdmin: ToolshopClient;
  /** The customer identity actually in use (lockout-aware resolution). */
  customerCreds: Credentials;
  data: DataLifecycle;
}

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productDetail: async ({ page }, use) => use(new ProductDetailPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  contact: async ({ page }, use) => use(new ContactPage(page)),
  header: async ({ page }, use) => use(new HeaderComponent(page)),

  apiLog: async ({}, use, testInfo) => {
    const log = new ApiLog();
    await use(log);
    // Attach after the test body so failures still get their transcript.
    await log.attachTo(testInfo);
  },
  api: async ({ apiLog }, use) => use(createToolshopClient({ log: apiLog })),
  customerCreds: async ({}, use) => use(await resolveCustomerCredentials()),
  apiAsCustomer: async ({ apiLog, customerCreds }, use) => {
    const { email, password } = customerCreds;
    await use(createToolshopClient({ token: await loginToken(email, password), log: apiLog }));
  },
  apiAsAdmin: async ({ apiLog }, use) => {
    const { email, password } = target.users.admin;
    await use(createToolshopClient({ token: await loginToken(email, password), log: apiLog }));
  },

  data: async ({}, use) => {
    const cleanups: Cleanup[] = [];
    const lifecycle: DataLifecycle = {
      defer: (cleanup) => cleanups.push(cleanup),
      seedCart: async (productCount = 1, quantity = 1) => {
        const cart = await seedCart(productCount, quantity);
        // Carts are anonymous + short-lived server-side; no delete endpoint
        // needed, but registration keeps the pattern uniform for reviewers.
        return cart;
      },
    };
    await use(lifecycle);
    // LIFO so dependent resources unwind in reverse creation order.
    for (const cleanup of cleanups.reverse()) {
      try {
        await cleanup();
      } catch (err) {
        console.warn(`[data.cleanup] non-fatal: ${String(err)}`);
      }
    }
  },
});

export { expect };
