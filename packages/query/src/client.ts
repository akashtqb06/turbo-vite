/**
 * @module @repo/query/client
 *
 * TanStack Query v5 client factory with production-ready defaults.
 *
 * Defaults chosen for a typical REST API with moderate request frequency:
 * - `staleTime: 60_000` — Data stays fresh for 1 minute before background refetch
 * - `gcTime: 5 * 60_000` — Unused cache entries live for 5 minutes before GC
 * - `retry: smart fn` — Retries up to 2 times, but never retries 4xx errors
 * - `refetchOnWindowFocus: false` — Prevents jarring refetches on tab switch
 */

import { QueryClient } from "@tanstack/react-query";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Configuration overrides for `createQueryClient()`. */
export interface QueryClientConfig {
  /**
   * How long (ms) fetched data is considered fresh. During this window, no
   * background refetch occurs. Defaults to `60_000` (1 minute).
   */
  staleTime?: number;
  /**
   * How long (ms) unused query data stays in cache after all subscribers unmount.
   * Defaults to `300_000` (5 minutes).
   */
  gcTime?: number;
  /**
   * Max retry attempts for failed queries. Pass `false` to disable retries.
   * Defaults to a smart function that retries up to 2 times, skipping 4xx errors.
   */
  retry?: number | false | ((failureCount: number, error: unknown) => boolean);
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a TanStack Query v5 `QueryClient` with sensible production defaults.
 *
 * Call this **once** per app in `main.tsx`:
 * ```tsx
 * const queryClient = createQueryClient();
 * root.render(<QueryProvider client={queryClient}><App /></QueryProvider>);
 * ```
 *
 * @param config - Optional overrides for default QueryClient options.
 * @returns A configured `QueryClient` instance.
 *
 * @example
 * // Default (recommended for most apps)
 * const queryClient = createQueryClient();
 *
 * // With custom stale time (e.g. for real-time-ish data):
 * const queryClient = createQueryClient({ staleTime: 10_000, retry: false });
 */
export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
  const {
    staleTime = 60_000,         // 1 minute
    gcTime    = 5 * 60_000,     // 5 minutes
    retry     = (failureCount: number, error: unknown) => {
      // Never retry client errors (4xx) — retrying won't fix a bad request
      const status = (error as { status?: number })?.status;
      if (status !== undefined && status >= 400 && status < 500) return false;
      // Retry server errors and network failures up to 2 times
      return failureCount < 2;
    },
  } = config;

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
        gcTime,
        retry,
        // Prevent refetch on tab focus — avoids jarring data changes while the user reads
        refetchOnWindowFocus: false,
        // Show stale data while fetching in background (better UX than loading spinner)
        placeholderData: (previousData: unknown) => previousData,
      },
      mutations: {
        // Retry mutations once on network failure, but not on server errors
        retry: (failureCount, error) => {
          const status = (error as { status?: number })?.status;
          if (status !== undefined) return false; // server responded → don't retry
          return failureCount < 1;
        },
      },
    },
  });
}
