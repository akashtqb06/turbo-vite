/**
 * @module smartgrants/hooks/useConfig
 *
 * TanStack Query hooks for the ConfigService.
 *
 * These replace the old pattern of:
 *   const [theme, setTheme] = useState(null);
 *   useEffect(() => { ConfigService.getTheme().then(setTheme); }, []);
 *
 * With a single hook call that gives you caching, deduplication, and
 * background refresh for free.
 */

import { useQuery }       from "@repo/query";
import { ConfigService }  from "../services/configService";
import type { ThemeConfig, ConfigData } from "../services/configService";
import { configKeys }     from "../queryKeys";

// ── useThemeConfig ────────────────────────────────────────────────────────────

/**
 * Fetches the application theme config from `/gs/theme/data/fetch`.
 *
 * - Cached for 10 minutes (theme rarely changes mid-session).
 * - Deduplicated: multiple components calling this hook share one request.
 *
 * @example
 * function AppShell() {
 *   const { data: theme, isLoading } = useThemeConfig();
 *   if (isLoading) return <LoadingScreen />;
 *   return <div style={{ "--primary": theme?.primaryColor }}>...</div>;
 * }
 */
export function useThemeConfig() {
  return useQuery<ThemeConfig>({
    queryKey: configKeys.theme,
    queryFn:  () => ConfigService.getTheme(),
    staleTime: 10 * 60_000, // 10 minutes — theme config is stable
  });
}

// ── useConfig ─────────────────────────────────────────────────────────────────

/**
 * Fetches generic config from any URL.
 * Pass `enabled: false` to defer the request until a condition is met.
 *
 * @param url     - The config endpoint to fetch (e.g. `/gs/config/features`).
 * @param options - Optional TanStack Query overrides.
 *
 * @example
 * const { data: flags } = useConfig<FeatureFlags>("/gs/config/features");
 * if (flags?.newGrantFlow) { ... }
 */
export function useConfig<T = unknown>(
  url: string,
  options?: { enabled?: boolean; staleTime?: number },
) {
  return useQuery<ConfigData<T>>({
    queryKey: configKeys.byUrl(url),
    queryFn:  () => ConfigService.getConfig<T>(url),
    enabled:  options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60_000, // 5 minutes default
  });
}
