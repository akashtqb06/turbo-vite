/**
 * @module smartgrants/queryKeys
 *
 * Centralised TanStack Query key registry for all SmartGrants domains.
 *
 * Pattern: `createQueryKeys(scope, definitions)` from `@repo/query`.
 * Every key starts with its scope so that invalidating `[scope]` clears
 * all cached data for that domain at once.
 *
 * @example
 * // Invalidate everything config-related after a save
 * queryClient.invalidateQueries({ queryKey: configKeys._base });
 *
 * // Invalidate only the theme
 * queryClient.invalidateQueries({ queryKey: configKeys.theme });
 */

import { createQueryKeys } from "@repo/query";

// ── User ──────────────────────────────────────────────────────────────────────
export const userKeys = createQueryKeys("users", {
  /** Authenticated user info — GET /userinfo */
  info: null,
  /** RBAC POST endpoints — keyed by url + endpoint */
  rbac: (...args: unknown[]) => args,
});

// ── Config ────────────────────────────────────────────────────────────────────
export const configKeys = createQueryKeys("config", {
  /** Generic config endpoint — keyed by URL */
  byUrl: (...args: unknown[]) => args,
  /** App theme — GET /gs/theme/data/fetch */
  theme: null,
});
