// Store factory + types
export { createAppStore } from "./store.js";
export type { AppStore, RootState, AppDispatch } from "./store.js";

// Typed hooks + domain hooks
export {
  useAppDispatch,
  useAppSelector,
  useTheme,
  usePreferences,
} from "./hooks.js";

// Theme slice
export {
  themeActions,
  setActiveTheme,
  setMode,
  toggleMode,
  fetchThemes,
  selectThemes,
  selectActiveTheme,
  selectActiveThemeId,
  selectThemeMode,
  selectThemeStatus,
} from "./slices/theme.slice.js";
export type { ThemeState, ThemeMode } from "./slices/theme.slice.js";

// Preferences slice
export {
  preferencesActions,
  setLanguage,
  setSidebarCollapsed,
  toggleSidebar,
  initPreferences,
  selectLanguageCode,
  selectSidebarCollapsed,
  selectPrefsHydrated,
} from "./slices/preferences.slice.js";
export type { PreferencesState } from "./slices/preferences.slice.js";

// RTK Query API
export { baseApi, axiosBaseQuery } from "./api/baseApi.js";
export { themeApi, useGetThemesQuery, useGetThemeByIdQuery } from "./api/themeApi.js";
