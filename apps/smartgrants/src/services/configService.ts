/**
 * @module smartgrants/services/configService
 *
 * Application configuration service — migrated from the legacy `ConfigService.js`.
 *
 * Provides:
 *  - `getConfig(url)`  — generic GET to any config endpoint, returns typed data
 *  - `getTheme()`      — GET `/gs/theme/data/fetch`, returns the app theme config
 *
 * ### Integration with TanStack Query
 * These functions are intentionally plain async functions so they can be used
 * directly as `queryFn` in `useQuery` hooks (see `src/hooks/useConfig.ts`).
 * Direct imperative calls also work fine for one-off config reads.
 *
 * @example
 * // Imperative (e.g. in a service or main.tsx)
 * const theme = await ConfigService.getTheme();
 *
 * // Reactive (in a component via the hook)
 * const { data: theme } = useThemeConfig();
 */

import { getApiClient } from "../lib/apiClient";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape returned by GET `/gs/theme/data/fetch`. Extend as fields are discovered. */
export interface ThemeConfig {
  /** Primary brand colour (hex / CSS variable name). */
  primaryColor?: string;
  /** Logo URL or path. */
  logo?: string;
  /** Application display name override. */
  appName?: string;
  /** Any additional theme fields from the server. */
  [key: string]: unknown;
}

/** Generic config payload — typed per-call via the `T` generic. */
export type ConfigData<T = unknown> = T;

// ── Service ───────────────────────────────────────────────────────────────────

export const ConfigService = {
  /**
   * Fetch configuration from any arbitrary endpoint.
   *
   * Mirrors legacy `getConfig(url)` — resolves with `resp.data`, rejects on error.
   *
   * @param url - Absolute or relative URL to fetch config from.
   * @returns Typed config payload.
   *
   * @example
   * const featureFlags = await ConfigService.getConfig<FeatureFlags>("/gs/config/features");
   */
  async getConfig<T = unknown>(url: string): Promise<ConfigData<T>> {
    const resp = await getApiClient().get<T>(url);
    return resp.data;
  },

  /**
   * Fetch the application theme configuration.
   *
   * Mirrors legacy `getTheme()` → GET `/gs/theme/data/fetch`.
   *
   * @returns The theme config object from the server.
   *
   * @example
   * const theme = await ConfigService.getTheme();
   * document.documentElement.style.setProperty("--primary", theme.primaryColor ?? "#000");
   */
  async getTheme(): Promise<ThemeConfig> {
    const resp = await getApiClient().get<ThemeConfig>("/gs/theme/data/fetch");
    return resp.data;
  },
} as const;

export default ConfigService;
