/**
 * Project-dependency auth setup.
 *
 * Runs once per CI job before browser projects. Logs in each role VIA THE API
 * (no UI login churn), then plants the JWT into localStorage exactly where the
 * Angular app's TokenStorageService reads it (`auth-token`). Browser tests
 * start authenticated, saving one full login round-trip per test.
 */
import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import { loginToken, resolveCustomerCredentials } from '../api/auth';
import { target } from '../config/env';
import { AUTH_DIR, customerStatePath, adminStatePath } from './auth.paths';

function storageStateWithToken(token: string): unknown {
  return {
    cookies: [],
    origins: [
      {
        origin: target.uiBaseUrl,
        localStorage: [{ name: 'auth-token', value: token }],
      },
    ],
  };
}

setup('authenticate customer and admin via API', async () => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  // Customer identity is resolved with lockout fallback (shared instance).
  const customer = await resolveCustomerCredentials();
  const [customerToken, adminToken] = await Promise.all([
    loginToken(customer.email, customer.password),
    loginToken(target.users.admin.email, target.users.admin.password),
  ]);
  fs.writeFileSync(customerStatePath, JSON.stringify(storageStateWithToken(customerToken), null, 2));
  fs.writeFileSync(adminStatePath, JSON.stringify(storageStateWithToken(adminToken), null, 2));
});
