/**
 * API-level authentication.
 *
 * Tokens are cached per worker per (email, target) so parallel workers never
 * re-login redundantly, and never share a mutable token across users.
 */
import { createToolshopClient, unwrap, type ToolshopClient } from './client';
import { target } from '../config/env';

const tokenCache = new Map<string, string>();

export async function loginToken(email: string, password: string): Promise<string> {
  const cacheKey = `${target.name}:${email}`;
  const cached = tokenCache.get(cacheKey);
  if (cached) return cached;

  const anon = createToolshopClient();
  const data = unwrap(
    await anon.POST('/users/login', { body: { email, password } }),
  ) as { access_token?: string };
  if (!data.access_token) {
    throw new Error(`Login for ${email} returned no access_token: ${JSON.stringify(data)}`);
  }
  tokenCache.set(cacheKey, data.access_token);
  return data.access_token;
}

export async function clientForUser(email: string, password: string): Promise<ToolshopClient> {
  const token = await loginToken(email, password);
  return createToolshopClient({ token });
}

export async function customerClient(): Promise<ToolshopClient> {
  const { email, password } = target.users.customer;
  return clientForUser(email, password);
}

export async function adminClient(): Promise<ToolshopClient> {
  const { email, password } = target.users.admin;
  return clientForUser(email, password);
}
