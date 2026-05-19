/**
 * @module @repo/query
 *
 * Public API barrel for `@repo/query`.
 *
 * Re-exports TanStack Query v5 hooks for convenience so apps don't need to
 * depend on `@tanstack/react-query` directly:
 *   import { useQuery, useMutation } from "@repo/query";
 */

// ── Client factory ────────────────────────────────────────────────────────────
export { createQueryClient }        from "./client.js";
export type { QueryClientConfig }   from "./client.js";

// ── Provider ──────────────────────────────────────────────────────────────────
export { QueryProvider }            from "./provider.js";
export type { QueryProviderProps }  from "./provider.js";

// ── Query key factory ─────────────────────────────────────────────────────────
export { createQueryKeys }          from "./queryKeys.js";

// ── TanStack Query v5 re-exports (apps don't need a direct dep on @tanstack/react-query) ──
export {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  QueryClient,
  keepPreviousData,
  infiniteQueryOptions,
  queryOptions,
}                                   from "@tanstack/react-query";
export type {
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  QueryKey,
  InfiniteData,
}                                   from "@tanstack/react-query";
