import { test, expect } from '../../src/fixtures/test.fixtures';
import { unwrap } from '../../src/api/client';
import { buildUser } from '../../src/data/factories/user.factory';
import { target } from '../../src/config/env';

test.describe('Auth & Users API', () => {
  test('registers a new user from factory data @smoke', async ({ api }) => {
    const user = buildUser();
    const created = unwrap(await api.POST('/users/register', { body: user })) as {
      id?: string;
      email?: string;
    };
    expect(created.id).toBeTruthy();
    expect(created.email).toBe(user.email);

    // New credentials must immediately work for login.
    const token = unwrap(
      await api.POST('/users/login', {
        body: { email: user.email, password: user.password! },
      }),
    ) as { access_token?: string };
    expect(token.access_token).toBeTruthy();
  });

  test('rejects registration with an already-used email @regression', async ({ api }) => {
    const seeded = target.users.customer.email;
    const res = await api.POST('/users/register', { body: buildUser({ email: seeded }) });
    // API returns 409 Conflict for duplicates (validated against the live spec).
    expect(res.response.status).toBe(409);
  });

  test('rejects login with wrong password @smoke', async ({ api }) => {
    const res = await api.POST('/users/login', {
      body: { email: target.users.customer.email, password: 'definitely-wrong' },
    });
    expect(res.response.status).toBe(401);
  });

  test('/users/me requires authentication @smoke @contract', async ({ api, apiAsCustomer }) => {
    const anon = await api.GET('/users/me');
    expect(anon.response.status).toBe(401);

    const me = unwrap(await apiAsCustomer.GET('/users/me')) as { email?: string };
    expect(me.email).toBe(target.users.customer.email);
  });

  test('customer cannot list all users (RBAC boundary) @regression', async ({ apiAsCustomer, apiAsAdmin }) => {
    const asCustomer = await apiAsCustomer.GET('/users', { params: { query: {} } });
    expect([401, 403]).toContain(asCustomer.response.status);

    const asAdmin = await apiAsAdmin.GET('/users', { params: { query: {} } });
    expect(asAdmin.response.status).toBe(200);
  });

  test('password policy rejects weak passwords @regression', async ({ api }) => {
    const res = await api.POST('/users/register', { body: buildUser({ password: 'weak' }) });
    expect(res.response.status).toBe(422);
  });
});
