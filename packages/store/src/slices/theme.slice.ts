import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getThemes } from "@repo/api-client/services/theme";
import type { Theme } from "@repo/api-client/services/theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_THEME = "app_theme_id";
const STORAGE_KEY_MODE  = "app_theme_mode";
const DEFAULT_THEME_ID  = "default";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark";

export interface ThemeState {
  /** All themes fetched from the API */
  themes: Theme[];
  /** ID of the currently active theme */
  activeThemeId: string;
  /** Current colour mode */
  mode: ThemeMode;
  /** Fetch status of the themes list */
  status: "idle" | "loading" | "succeeded" | "failed";
  /** Error message if fetch failed */
  error: string | null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

function resolveInitialMode(defaultMode?: ThemeMode): ThemeMode {
  if (typeof window === "undefined") return defaultMode ?? "light";
  const stored = localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null;
  if (stored === "light" || stored === "dark") return stored;
  if (defaultMode) return defaultMode;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveInitialThemeId(defaultThemeId = DEFAULT_THEME_ID): string {
  if (typeof window === "undefined") return defaultThemeId;
  return localStorage.getItem(STORAGE_KEY_THEME) ?? defaultThemeId;
}

const initialState: ThemeState = {
  themes: [],
  activeThemeId: resolveInitialThemeId(),
  mode: resolveInitialMode(),
  status: "idle",
  error: null,
};

// ─── Async thunk — fetch themes ───────────────────────────────────────────────

/**
 * Fetches all themes from the API (or falls back to bundled data).
 * Dispatch this once on app startup from ThemeProvider.
 */
export const fetchThemes = createAsyncThunk<Theme[], void, { rejectValue: string }>(
  "theme/fetchThemes",
  async (_, { rejectWithValue }) => {
    try {
      return await getThemes();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load themes";
      return rejectWithValue(message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    /**
     * Switch to a named theme by ID and persist to localStorage.
     */
    setActiveTheme(state, action: PayloadAction<string>) {
      state.activeThemeId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_THEME, action.payload);
      }
    },

    /**
     * Set light or dark mode and persist to localStorage.
     */
    setMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_MODE, action.payload);
      }
    },

    /**
     * Toggle between light and dark and persist.
     */
    toggleMode(state) {
      const next: ThemeMode = state.mode === "light" ? "dark" : "light";
      state.mode = next;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_MODE, next);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.themes = action.payload;
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unknown error";
      });
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const themeActions = themeSlice.actions;
export const { setActiveTheme, setMode, toggleMode } = themeSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export interface RootStateWithTheme {
  theme: ThemeState;
}

export const selectThemes        = (state: RootStateWithTheme) => state.theme.themes;
export const selectActiveThemeId = (state: RootStateWithTheme) => state.theme.activeThemeId;
export const selectThemeMode     = (state: RootStateWithTheme) => state.theme.mode;
export const selectThemeStatus   = (state: RootStateWithTheme) => state.theme.status;
export const selectActiveTheme   = (state: RootStateWithTheme) =>
  state.theme.themes.find((t) => t.id === state.theme.activeThemeId) ?? null;

export default themeSlice.reducer;
