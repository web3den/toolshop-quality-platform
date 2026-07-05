/**
 * Redaction for logs, reports, and error messages.
 *
 * Anything that leaves the process — test attachments, assertion messages,
 * CI logs, triage payloads sent to an LLM — passes through here first.
 * Secrets must never depend on someone remembering to strip them at a call
 * site, so the API client and logging fixture apply this automatically.
 */

const SENSITIVE_KEY = /password|passwd|secret|token|authorization|auth[-_]?key|api[-_]?key|cookie|session[-_]?id|credit_card|cvv|account_number/i;

/** JWTs and long bearer-ish blobs embedded in plain strings. */
const JWT_PATTERN = /eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g;
const BEARER_PATTERN = /(Bearer\s+)[A-Za-z0-9._~+/-]{12,}=*/gi;

export const REDACTED = '«redacted»';

/** Keeps a hint of the value for debugging without leaking it. */
function mask(value: string): string {
  if (value.length <= 8) return REDACTED;
  return `${value.slice(0, 3)}…${REDACTED}…${value.slice(-2)} (len=${value.length})`;
}

export function redactString(input: string): string {
  return input.replace(JWT_PATTERN, (m) => mask(m)).replace(BEARER_PATTERN, (_m, p1: string) => `${p1}${REDACTED}`);
}

/**
 * Deep-redacts objects: sensitive keys are masked, embedded JWTs scrubbed,
 * long strings truncated so a single response body can't flood a report.
 */
export function redactValue(value: unknown, maxStringLength = 2_000): unknown {
  if (typeof value === 'string') {
    const scrubbed = redactString(value);
    return scrubbed.length > maxStringLength
      ? `${scrubbed.slice(0, maxStringLength)}… [truncated ${scrubbed.length - maxStringLength} chars]`
      : scrubbed;
  }
  if (Array.isArray(value)) return value.map((v) => redactValue(v, maxStringLength));
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      out[key] = SENSITIVE_KEY.test(key) && typeof v === 'string' && v.length > 0
        ? mask(v)
        : redactValue(v, maxStringLength);
    }
    return out;
  }
  return value;
}

export function redactJson(value: unknown, space = 2, maxStringLength = 2_000): string {
  return JSON.stringify(redactValue(value, maxStringLength), null, space);
}

/** Redacts header maps (Authorization, Cookie, Set-Cookie, x-api-key, ...). */
export function redactHeaders(headers: Iterable<[string, string]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of headers) {
    out[name] = SENSITIVE_KEY.test(name) ? REDACTED : redactString(value);
  }
  return out;
}
