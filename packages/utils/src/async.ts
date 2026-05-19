/**
 * @module @repo/utils/async
 *
 * Async/Promise utilities for managing timing, retries, and timeouts.
 * All functions are pure and return typed Promises.
 * No React dependency.
 */

// ── sleep ─────────────────────────────────────────────────────────────────────

/**
 * Returns a Promise that resolves after `ms` milliseconds.
 * Useful for rate limiting, retry delays, and testing async flows.
 *
 * @param ms - Duration in milliseconds.
 * @returns A Promise that resolves (with `void`) after the delay.
 *
 * @example
 * await sleep(1000); // pauses for 1 second
 *
 * // In a retry loop:
 * for (let i = 0; i < 3; i++) {
 *   try { return await fetchData(); }
 *   catch { await sleep(500 * (i + 1)); } // exponential back-off
 * }
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── retry ─────────────────────────────────────────────────────────────────────

/**
 * Retries an async function up to `attempts` times with an optional delay between retries.
 *
 * The function stops retrying on the first success and re-throws the last error
 * if all attempts fail.
 *
 * @param fn - The async function to execute.
 * @param attempts - Total number of attempts (including the first). Must be >= 1.
 * @param delayMs - Milliseconds to wait between retries. Defaults to `0`.
 * @returns The resolved value of the first successful call.
 * @throws The error from the last failed attempt.
 *
 * @example
 * const data = await retry(() => fetchUnreliableApi(), 3, 500);
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number,
  delayMs = 0,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1 && delayMs > 0) {
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}

// ── withTimeout ───────────────────────────────────────────────────────────────

/**
 * Races a Promise against a timeout. Rejects with a `TimeoutError` if the
 * timeout expires before the Promise resolves.
 *
 * @param promise - The Promise to race.
 * @param ms - Timeout duration in milliseconds.
 * @param message - Optional custom error message. Defaults to `"Operation timed out"`.
 * @returns The resolved value if the Promise wins the race.
 * @throws `Error` with the timeout message if time expires first.
 *
 * @example
 * const data = await withTimeout(fetchHeavyData(), 5000, "Data fetch timed out");
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = "Operation timed out",
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(message));
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

// ── deferred ──────────────────────────────────────────────────────────────────

/** The resolved/rejected handle returned by {@link deferred}. */
export interface Deferred<T> {
  /** The underlying Promise. */
  promise: Promise<T>;
  /** Resolves the deferred with a value. */
  resolve: (value: T | PromiseLike<T>) => void;
  /** Rejects the deferred with a reason. */
  reject: (reason?: unknown) => void;
}

/**
 * Creates a deferred Promise — a Promise whose resolve/reject callbacks
 * are exposed for external control. Useful for coordinating async operations.
 *
 * @returns An object with `promise`, `resolve`, and `reject`.
 *
 * @example
 * const deferred = createDeferred<string>();
 * setTimeout(() => deferred.resolve("done!"), 1000);
 * const result = await deferred.promise; // → "done!"
 */
export function createDeferred<T>(): Deferred<T> {
  let resolve!: Deferred<T>["resolve"];
  let reject!: Deferred<T>["reject"];

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}
