/**
 * Parallel execution helpers for test setup.
 *
 * Test seeding is the hottest path in a suite: serial setup is the #1 cause of
 * slow pipelines. These helpers make `Promise.all`-style fan-out safe:
 *  - `allSettledOrThrow` keeps the *complete* failure picture instead of
 *    `Promise.all`'s first-rejection-wins behavior (which hides root causes),
 *  - `mapWithConcurrency` fans out with a cap so we never DoS the SUT or trip
 *    rate limits in shared environments.
 */

/** Like Promise.all, but aggregates every rejection into one readable error. */
export async function allSettledOrThrow<T extends readonly unknown[] | []>(
  tasks: { [K in keyof T]: Promise<T[K]> },
  label = 'parallel setup',
): Promise<T> {
  const results = await Promise.allSettled(tasks);
  const failures = results
    .map((r, i) => (r.status === 'rejected' ? `  [task ${i}] ${String(r.reason)}` : null))
    .filter((x): x is string => x !== null);
  if (failures.length > 0) {
    throw new Error(`${label}: ${failures.length}/${results.length} tasks failed:\n${failures.join('\n')}`);
  }
  return results.map((r) => (r as PromiseFulfilledResult<unknown>).value) as unknown as T;
}

/** Maps items to async work with a concurrency cap, preserving input order. */
export async function mapWithConcurrency<TIn, TOut>(
  items: readonly TIn[],
  worker: (item: TIn, index: number) => Promise<TOut>,
  concurrency = 5,
): Promise<TOut[]> {
  const results: TOut[] = new Array(items.length);
  let cursor = 0;

  async function lane(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index] as TIn, index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, lane));
  return results;
}
