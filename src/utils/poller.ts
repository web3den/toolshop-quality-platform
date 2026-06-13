/**
 * Deterministic polling utility for eventually-consistent backends.
 *
 * Why not `expect.poll` everywhere? `expect.poll` is great inside a test body,
 * but fixtures, factories, and API helpers also need to wait for async state
 * (e.g. "invoice appears in the account after checkout"). This poller works
 * anywhere, carries rich timeout diagnostics, and never busy-loops.
 */
export interface PollOptions {
  /** Total time budget in ms. Default 10s. */
  timeoutMs?: number;
  /** Delay between attempts in ms. Default 250ms. */
  intervalMs?: number;
  /** Multiplier applied to the interval after each attempt (capped at maxIntervalMs). */
  backoffFactor?: number;
  /** Upper bound for a single interval when backoff is enabled. */
  maxIntervalMs?: number;
  /** Human-readable label included in the timeout error. */
  description?: string;
}

export class PollTimeoutError extends Error {
  constructor(description: string, timeoutMs: number, attempts: number, lastError?: unknown) {
    const last = lastError instanceof Error ? lastError.message : String(lastError ?? 'predicate returned falsy');
    super(
      `Polling timed out after ${timeoutMs}ms (${attempts} attempts): ${description}. Last state: ${last}`,
    );
    this.name = 'PollTimeoutError';
  }
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Polls `probe` until it returns a truthy value, then returns that value.
 * Throws PollTimeoutError with attempt diagnostics when the budget is spent.
 */
export async function pollUntil<T>(
  probe: () => Promise<T | undefined | null | false>,
  options: PollOptions = {},
): Promise<T> {
  const {
    timeoutMs = 10_000,
    intervalMs = 250,
    backoffFactor = 1,
    maxIntervalMs = 2_000,
    description = 'condition',
  } = options;

  const deadline = Date.now() + timeoutMs;
  let attempts = 0;
  let delay = intervalMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    attempts += 1;
    try {
      const result = await probe();
      if (result) return result;
      lastError = undefined;
    } catch (err) {
      // Keep probing: transient API hiccups are exactly what pollers absorb.
      lastError = err;
    }
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;
    await sleep(Math.min(delay, remaining));
    delay = Math.min(delay * backoffFactor, maxIntervalMs);
  }

  throw new PollTimeoutError(description, timeoutMs, attempts, lastError);
}
