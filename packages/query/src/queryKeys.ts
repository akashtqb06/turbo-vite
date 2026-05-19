/**
 * @module @repo/query/queryKeys
 *
 * Type-safe query key factory using the `createQueryKeys` pattern.
 *
 * Problem: Raw string/array query keys are error-prone — typos are silent bugs,
 * and refactoring a key means a text-search across the codebase.
 *
 * Solution: `createQueryKeys()` returns a typed key registry where every key is
 * defined once and reused by reference. TypeScript catches mismatches at compile time.
 *
 * @example
 * export const userKeys = createQueryKeys("users", {
 *   list: (filters?: UserFilter) => [filters],
 *   detail: (id: string) => [id],
 *   profile: null,  // no params
 * });
 *
 * // Usage in queries:
 * useQuery({ queryKey: userKeys.detail("42"), queryFn: () => fetchUser("42") });
 *
 * // Usage in mutations for cache invalidation:
 * queryClient.invalidateQueries({ queryKey: userKeys.list() });
 */

// ── Types ─────────────────────────────────────────────────────────────────────

type QueryKeyDefinition =
  | null                              // no-param key: userKeys.profile → ["users", "profile"]
  | ((...args: unknown[]) => unknown[]); // parameterised key factory

type QueryKeyFactory<TDefs extends Record<string, QueryKeyDefinition>> = {
  [K in keyof TDefs]:
    TDefs[K] extends null
      ? readonly unknown[]                                  // static key (no args)
      : TDefs[K] extends (...args: infer A) => unknown[]
        ? (...args: A) => readonly unknown[]               // parameterised key factory
        : never;
} & { _base: readonly [string] };

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a type-safe query key registry for a feature domain.
 *
 * All keys are arrays starting with `scope` so that
 * `queryClient.invalidateQueries({ queryKey: [scope] })` invalidates the
 * entire feature's cache at once.
 *
 * @param scope - A unique namespace for this feature (e.g. `"users"`, `"products"`).
 * @param definitions - An object mapping key names to their param factories or `null`.
 * @returns A typed key registry where each member produces a stable query key array.
 *
 * @example
 * export const productKeys = createQueryKeys("products", {
 *   list:   (page: number, search: string) => [page, search],
 *   detail: (id: string) => [id],
 *   featured: null,
 * });
 *
 * productKeys._base            // → ["products"]
 * productKeys.featured         // → ["products", "featured"]
 * productKeys.detail("abc")    // → ["products", "detail", "abc"]
 * productKeys.list(1, "shoe")  // → ["products", "list", 1, "shoe"]
 */
export function createQueryKeys<TDefs extends Record<string, QueryKeyDefinition>>(
  scope: string,
  definitions: TDefs,
): QueryKeyFactory<TDefs> {
  const base = [scope] as const;
  const result: Record<string, unknown> = { _base: base };

  for (const [key, def] of Object.entries(definitions)) {
    if (def === null) {
      // Static key — no arguments
      result[key] = [scope, key] as const;
    } else {
      // Parameterised key — factory function
      result[key] = (...args: unknown[]) => [scope, key, ...def(...args)] as const;
    }
  }

  return result as QueryKeyFactory<TDefs>;
}
