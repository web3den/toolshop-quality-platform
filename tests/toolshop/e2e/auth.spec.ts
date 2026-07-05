import { test, expect } from '../../../src/fixtures/test.fixtures';
import { buildUser } from '../../../src/data/factories/user.factory';
import { unwrap } from '../../../src/api/client';
import { registerFreshUser } from '../../../src/api/auth';
import { adminStatePath } from '../../../src/fixtures/auth.paths';

test.describe('Authentication UI', () => {
  test('valid login redirects to account @smoke', async ({ loginPage, page, customerCreds }) => {
    await loginPage.open();
    await loginPage.loginAs(customerCreds.email, customerCreds.password);
    await expect(page).toHaveURL(/\/account/);
  });

  test('invalid credentials show an error, not a redirect @smoke', async ({ loginPage, page }) => {
    // Disposable account: failed logins lock shared accounts on this SUT.
    const disposable = await registerFreshUser();
    await loginPage.open();
    await loginPage.loginAs(disposable.email, 'wrong-password-123');
    await expect(loginPage.error).toBeVisible();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('user registered via API can sign in through the UI @regression', async ({ api, loginPage, page }) => {
    // Arrange through the API (fast), assert through the UI (the behavior under test).
    const user = buildUser();
    unwrap(await api.POST('/users/register', { body: user }));

    await loginPage.open();
    await loginPage.loginAs(user.email!, user.password!);
    await expect(page).toHaveURL(/\/account/);
  });
});

test.describe('Admin RBAC in the UI', () => {
  test.use({ storageState: adminStatePath });

  test('admin reaches the dashboard and has admin navigation @regression', async ({ page, header }) => {
    await page.goto('/admin/dashboard');
    // Route guard lets the admin through to the dashboard content.
    await expect(page.getByRole('heading', { name: /sales over the years/i })).toBeVisible();
    // Admin links live inside the user dropdown menu.
    await header.navMenu.click();
    await expect(page.getByTestId('nav-admin-products')).toBeVisible();
  });
});
