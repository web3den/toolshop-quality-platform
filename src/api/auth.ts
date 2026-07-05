/**
 * API-level authentication with self-healing customer identity.
 *
 * The public Toolshop instance is shared: seeded accounts can be locked (423)
 * by other users' failed-login attempts. A suite that depends on one shared
 * account produces false alarms, so the customer identity is resolved at
 * runtime: seeded `customer` → seeded `customer2` → a freshly registered
 * account. The resolution is persisted to .auth/ so the setup project and all
 * workers agree on one identity per run.
 *
 * House rule enforced by design: wrong-password/lockout tests must use
 * disposable registered accounts, never shared seeded ones — failed attempts
 * poison the account for everyone (see registerFreshUser).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createToolshopClient, unwrap, type ToolshopClient } from './client';
import { target } from '../config/env';
import { buildUser } from '../data/factories/user.factory';

export interface Credentials {
  email: string;
  password: string;
}

const tokenCache = new Map<string, string>();
const AUTH_DIR = path.join(process.cwd(), '.auth');
const RESOLVED_CUSTOMER_FILE = path.join(AUTH_DIR, `customer-creds-${target.name}.json`);

class AccountLockedError extends Error {
  constructor(email: string) {
    super(`Account ${email} is locked (423) on ${target.name}`);
    this.name = 'AccountLockedError';
  }
}

async function tryLogin(email: string, password: string): Promise<string> {
  const anon = createToolshopClient();
  const result = await anon.POST('/users/login', { body: { email, password } });
  if (result.response.status === 423) throw new AccountLockedError(email);
  const data = unwrap(result) as { access_token?: string };
  if (!data.access_token) {
    throw new Error(`Login for ${email} returned no access_token`);
  }
  return data.access_token;
}

export async function loginToken(email: string, password: string): Promise<string> {
  const cacheKey = `${target.name}:${email}`;
  const cached = tokenCache.get(cacheKey);
  if (cached) return cached;
  const token = await tryLogin(email, password);
  tokenCache.set(cacheKey, token);
  return token;
}

/** Registers a brand-new disposable user and returns working credentials. */
export async function registerFreshUser(): Promise<Credentials> {
  const anon = createToolshopClient();
  const user = buildUser();
  unwrap(await anon.POST('/users/register', { body: user }));
  return { email: user.email!, password: user.password! };
}

let resolvedCustomer: Credentials | null = null;

/**
 * Resolves working customer credentials, with lockout fallback.
 * Persisted across processes so setup and test workers share one identity.
 */
export async function resolveCustomerCredentials(): Promise<Credentials> {
  if (resolvedCustomer) return resolvedCustomer;

  // Another process (the setup project) may have resolved already.
  if (fs.existsSync(RESOLVED_CUSTOMER_FILE)) {
    const persisted = JSON.parse(fs.readFileSync(RESOLVED_CUSTOMER_FILE, 'utf8')) as Credentials;
    try {
      await loginToken(persisted.email, persisted.password);
      resolvedCustomer = persisted;
      return persisted;
    } catch {
      // Stale (e.g. instance reseeded) — fall through to fresh resolution.
    }
  }

  const candidates: Credentials[] = [
    target.users.customer,
    { email: 'customer2@practicesoftwaretesting.com', password: target.users.customer.password },
  ];
  for (const candidate of candidates) {
    try {
      await loginToken(candidate.email, candidate.password);
      resolvedCustomer = candidate;
      break;
    } catch (err) {
      console.warn(`[auth] seeded account unusable (${candidate.email}): ${String(err)}`);
    }
  }
  if (!resolvedCustomer) {
    console.warn('[auth] all seeded customers unusable — registering a disposable account');
    resolvedCustomer = await registerFreshUser();
    await loginToken(resolvedCustomer.email, resolvedCustomer.password);
  }

  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(RESOLVED_CUSTOMER_FILE, JSON.stringify(resolvedCustomer, null, 2));
  return resolvedCustomer;
}

export async function clientForUser(email: string, password: string): Promise<ToolshopClient> {
  const token = await loginToken(email, password);
  return createToolshopClient({ token });
}

export async function customerClient(): Promise<ToolshopClient> {
  const { email, password } = await resolveCustomerCredentials();
  return clientForUser(email, password);
}

export async function adminClient(): Promise<ToolshopClient> {
  const { email, password } = target.users.admin;
  return clientForUser(email, password);
}
