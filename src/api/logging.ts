/**
 * HTTP logging for API tests — attached to every test report.
 *
 * Every request/response the typed client makes is captured, passed through
 * redaction (passwords, tokens, JWTs, sensitive headers are masked — always,
 * not best-effort), truncated to keep reports readable, and attached to the
 * test as both machine-readable JSON and a human-readable HTTP transcript.
 */
import type { Middleware } from 'openapi-fetch';
import type { TestInfo } from '@playwright/test';
import { redactHeaders, redactString, redactValue } from '../utils/redact';

export interface ApiLogEntry {
  seq: number;
  method: string;
  url: string;
  status: number;
  durationMs: number;
  requestHeaders: Record<string, string>;
  requestBody: unknown;
  responseHeaders: Record<string, string>;
  responseBody: unknown;
}

const MAX_BODY_CHARS = 4_000;

/** Headers.entries() isn't in every lib target; forEach is universal. */
function headerPairs(headers: { forEach(cb: (value: string, key: string) => void): void }): [string, string][] {
  const pairs: [string, string][] = [];
  headers.forEach((value, key) => pairs.push([key, value]));
  return pairs;
}

function parseBody(raw: string, contentType: string | null): unknown {
  if (!raw) return null;
  if (contentType?.includes('json')) {
    try {
      return redactValue(JSON.parse(raw), MAX_BODY_CHARS);
    } catch {
      /* fall through to string handling */
    }
  }
  const scrubbed = redactString(raw);
  return scrubbed.length > MAX_BODY_CHARS
    ? `${scrubbed.slice(0, MAX_BODY_CHARS)}… [truncated ${scrubbed.length - MAX_BODY_CHARS} chars]`
    : scrubbed;
}

export class ApiLog {
  readonly entries: ApiLogEntry[] = [];
  private seq = 0;
  private readonly started = new WeakMap<Request, { at: number; body: unknown }>();

  middleware(): Middleware {
    return {
      onRequest: async ({ request }) => {
        // Capture the body now — after dispatch the stream is consumed.
        let body: unknown = null;
        try {
          body = parseBody(await request.clone().text(), request.headers.get('content-type'));
        } catch {
          body = '(unreadable request body)';
        }
        this.started.set(request, { at: Date.now(), body });
        return undefined;
      },
      onResponse: async ({ request, response }) => {
        const meta = this.started.get(request) ?? { at: Date.now(), body: null };
        const startedAt = meta.at;
        const requestBody = meta.body;
        let responseBody: unknown = null;
        try {
          responseBody = parseBody(await response.clone().text(), response.headers.get('content-type'));
        } catch {
          responseBody = '(unreadable response body)';
        }
        this.entries.push({
          seq: ++this.seq,
          method: request.method,
          url: redactString(request.url),
          status: response.status,
          durationMs: Date.now() - startedAt,
          requestHeaders: redactHeaders(headerPairs(request.headers)),
          requestBody,
          responseHeaders: redactHeaders(headerPairs(response.headers)),
          responseBody,
        });
        return undefined;
      },
    };
  }

  /** Human-readable transcript, one block per exchange. */
  toTranscript(): string {
    return this.entries
      .map((e) => {
        const req = e.requestBody ? `\n${JSON.stringify(e.requestBody, null, 2)}` : '';
        const res = e.responseBody ? `\n${JSON.stringify(e.responseBody, null, 2)}` : '';
        return [
          `#${e.seq} ${e.method} ${e.url}`,
          `→ ${JSON.stringify(e.requestHeaders)}${req}`,
          `← ${e.status} (${e.durationMs}ms) ${JSON.stringify(e.responseHeaders)}${res}`,
        ].join('\n');
      })
      .join('\n\n' + '─'.repeat(72) + '\n\n');
  }

  async attachTo(testInfo: TestInfo): Promise<void> {
    if (this.entries.length === 0) return;
    await testInfo.attach('api-log.json', {
      body: JSON.stringify(this.entries, null, 2),
      contentType: 'application/json',
    });
    await testInfo.attach('api-transcript.txt', {
      body: this.toTranscript(),
      contentType: 'text/plain',
    });
  }
}
