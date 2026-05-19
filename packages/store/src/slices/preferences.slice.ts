import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getStoredLanguageCode } from "@repo/utils/preferences";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY_SIDEBAR = "app_sidebar_collapsed";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PreferencesState {
  /** BCP-47 language code, e.g. "en", "fr", "de" */
  languageCode: string;
  /** Whether the sidebar is collapsed */
  sidebarCollapsed: boolean;
  /** Whether user preferences have been hydrated from storage */
  hydrated: boolean;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: PreferencesState = {
  languageCode: "en",
  sidebarCollapsed: false,
  hydrated: false,
};

// ─── Async thunk — hydrate from storage ──────────────────────────────────────

/**
 * Reads stored preferences from localStorage and hydrates the slice.
 * Dispatch once on app startup from TranslationProvider or root layout.
 */
export const initPreferences = createAsyncThunk<PreferencesState, void>(
  "preferences/init",
  async () => {
    const languageCode = getStoredLanguageCode() ?? "en";
    const sidebarCollapsed =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY_SIDEBAR) === "true"
        : false;

    return { languageCode, sidebarCollapsed, hydrated: true };
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    /**
     * Set the active language and persist to localStorage.
     */
    setLanguage(state, action: PayloadAction<string>) {
      state.languageCode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("language.code", action.payload);
        // Notify other tabs / listeners
        window.dispatchEvent(new Event("app:language-changed"));
      }
    },

    /**
     * Explicitly set sidebar collapsed state and persist.
     */
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_SIDEBAR, String(action.payload));
      }
    },

    /**
     * Toggle sidebar open/closed.
     */
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_SIDEBAR, String(state.sidebarCollapsed));
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initPreferences.fulfilled, (state, action) => {
      state.languageCode     = action.payload.languageCode;
      state.sidebarCollapsed = action.payload.sidebarCollapsed;
      state.hydrated         = true;
    });
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const preferencesActions = preferencesSlice.actions;
export const { setLanguage, setSidebarCollapsed, toggleSidebar } = preferencesSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export interface RootStateWithPreferences {
  preferences: PreferencesState;
}

export const selectLanguageCode     = (state: RootStateWithPreferences) => state.preferences.languageCode;
export const selectSidebarCollapsed = (state: RootStateWithPreferences) => state.preferences.sidebarCollapsed;
export const selectPrefsHydrated    = (state: RootStateWithPreferences) => state.preferences.hydrated;

export default preferencesSlice.reducer;
