import { getApiClient } from "@repo/api-client/http";
import themesData from "../data/themes.json" with { type: "json" };

// ─── Types ───────────────────────────────────────────────────────────────────

/** Map of CSS custom property names to their values */
export type ThemeTokens = Record<string, string>;

/** A named theme with light and dark token sets */
export interface Theme {
  id: string;
  label: string;
  description: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Fetch all available themes.
 *
 * Makes a GET /api/themes request. During development the Axios instance
 * resolves this from local placeholder data; in production it hits the real
 * backend endpoint.
 */
export async function getThemes(): Promise<Theme[]> {
  try {
    const response = await getApiClient().get<Theme[]>("/themes");
    return response.data;
  } catch {
    // Fallback to bundled placeholder data when the endpoint is not yet live
    return themesData as Theme[];
  }
}

/**
 * Fetch a single theme by its ID.
 *
 * @param id - The theme identifier (e.g. "ocean", "rose")
 */
export async function getThemeById(id: string): Promise<Theme> {
  try {
    const response = await getApiClient().get<Theme>(`/themes/${id}`);
    return response.data;
  } catch {
    // Fallback to bundled placeholder data
    const found = (themesData as Theme[]).find((t) => t.id === id);
    if (!found) {
      throw new Error(`Theme "${id}" not found`);
    }
    return found;
  }
}
