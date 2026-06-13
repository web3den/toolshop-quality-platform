/**
 * Typed HTTP client over the generated OpenAPI schema.
 *
 * `openapi-fetch` gives compile-time safety for every path, parameter, and
 * response body — if the provider's contract changes, `npm run generate:types`
 * turns the drift into TypeScript errors instead of runtime surprises.
 */
import createClient, { type Client } from 'openapi-fetch';
import type { paths } from './generated/toolshop-schema';
import { target } from '../config/env';

export type ToolshopClient = Client<paths>;

export interface ClientOptions {
  baseUrl?: string;
  token?: string;
}

export function createToolshopClient(options: ClientOptions = {}): ToolshopClient {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  return createClient<paths>({
    baseUrl: options.baseUrl ?? target.apiBaseUrl,
    headers,
  });
}

/** Fails loudly with full context — API helpers should never swallow errors. */
export function unwrap<T>(result: { data?: T; error?: unknown; response: Response }): T {
  if (result.error !== undefined || result.data === undefined) {
    throw new Error(
      `API call failed: ${result.response.status} ${result.response.url}\n${JSON.stringify(result.error ?? 'empty body', null, 2)}`,
    );
  }
  return result.data;
}
