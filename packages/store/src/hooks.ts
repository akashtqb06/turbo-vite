import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store.js";
import {
  selectThemes,
  selectActiveTheme,
  selectActiveThemeId,
  selectThemeMode,
  selectThemeStatus,
  setActiveTheme,
  setMode,
  toggleMode,
} from "./slices/theme.slice.js";
import {
  selectLanguageCode,
  selectSidebarCollapsed,
  selectPrefsHydrated,
  setLanguage,
  setSidebarCollapsed,
  toggleSidebar,
} from "./slices/preferences.slice.js";

// ─── Typed Redux hooks ────────────────────────────────────────────────────────

/**
 * Typed dispatch hook — knows about all dispatched action types.
 * Use this instead of the plain `useDispatch` from react-redux.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed selector hook — auto-infers RootState.
 * Use this instead of the plain `useSelector` from react-redux.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ─── Domain hooks ─────────────────────────────────────────────────────────────

/**
 * Access the current theme state and actions.
 *
 * Replaces the old `useTheme()` Context hook.
 * Must be used inside a Redux <Provider>.
 *
 * @example
 * const { activeTheme, mode, setTheme, toggleMode } = useTheme();
 */
export function useTheme() {
  const dispatch = useAppDispatch();

  return {
    themes:        useAppSelector(selectThemes),
    activeTheme:   useAppSelector(selectActiveTheme),
    activeThemeId: useAppSelector(selectActiveThemeId),
    mode:          useAppSelector(selectThemeMode),
    isLoading:     useAppSelector(selectThemeStatus) === "loading",

    setTheme:   (id: string) => dispatch(setActiveTheme(id)),
    setMode:    (m: "light" | "dark") => dispatch(setMode(m)),
    toggleMode: () => dispatch(toggleMode()),
  };
}

/**
 * Access user preferences state and actions.
 *
 * @example
 * const { languageCode, sidebarCollapsed, setLanguage, toggleSidebar } = usePreferences();
 */
export function usePreferences() {
  const dispatch = useAppDispatch();

  return {
    languageCode:     useAppSelector(selectLanguageCode),
    sidebarCollapsed: useAppSelector(selectSidebarCollapsed),
    hydrated:         useAppSelector(selectPrefsHydrated),

    setLanguage:        (code: string)    => dispatch(setLanguage(code)),
    setSidebarCollapsed:(v: boolean)      => dispatch(setSidebarCollapsed(v)),
    toggleSidebar:      ()                => dispatch(toggleSidebar()),
  };
}
