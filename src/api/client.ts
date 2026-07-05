/**
 * Typed HTTP client over the generated OpenAPI schema.
 *
 * `openapi-fetch` gives compile-time safety for every path, parameter, and
 * response body — if the provider's contract changes, `npm run generate:types`
 * turns the drift into TypeScript errors instead of runtime surprises.
 *
 * Every client can carry an ApiLog middleware; the fixture layer wires one per
 * test so the full (redacted) HTTP transcript lands in the report.
 */
import createClient, { type Client } from 'openapi-fetch';
import type { paths } from './generated/toolshop-schema';
import { target } from '../config/env';
import type { ApiLog } from './logging';
import { redactJson } from '../utils/redact';

export type ToolshopClient = Client<paths>;

export interface ClientOptions {
  baseUrl?: string;
  token?: string;
  /** When provided, all traffic is captured (redacted) for report attachment. */
  log?: ApiLog;
}

export function createToolshopClient(options: ClientOptions = {}): ToolshopClient {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? target.apiBaseUrl,
    headers,
  });
  if (options.log) client.use(options.log.middleware());
  return client;
}

/**
 * Fails loudly with full context — API helpers should never swallow errors.
 * Error payloads are redacted: assertion messages end up in reports and CI
 * logs, which must never carry credentials or tokens.
 */
export function unwrap<T>(result: { data?: T; error?: unknown; response: Response }): T {
  if (result.error !== undefined || result.data === undefined) {
    throw new Error(
      `API call failed: ${result.response.status} ${result.response.url}\n${redactJson(result.error ?? 'empty body')}`,
    );
  }
  return result.data;
}
