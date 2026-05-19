/**
 * @module @repo/store/slices/ui
 *
 * Redux slice for global UI state that doesn't belong to a specific domain.
 *
 * Covers:
 * - `globalLoading` — full-screen loading overlay (e.g. during initial data fetch)
 * - `pageTitle`     — synced to `document.title` by the layout component
 * - `breadcrumbs`   — the current page's navigation breadcrumb trail
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ── Types ─────────────────────────────────────────────────────────────────────

/** A single breadcrumb entry in the navigation trail. */
export interface Breadcrumb {
  /** The display label for this crumb. */
  label: string;
  /** Optional link href. Omit for the last (current) crumb. */
  href?: string;
}

export interface UiState {
  /**
   * When `true`, a full-screen loading overlay is shown.
   * Use sparingly — prefer skeleton loaders or inline spinners where possible.
   */
  globalLoading: boolean;
  /** The current page title, synced to `document.title` by the layout component. */
  pageTitle: string;
  /** The breadcrumb trail for the current route. */
  breadcrumbs: Breadcrumb[];
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    globalLoading: false,
    pageTitle:     "",
    breadcrumbs:   [],
  } as UiState,
  reducers: {
    /**
     * Shows or hides the global full-screen loading overlay.
     *
     * @example
     * dispatch(setGlobalLoading(true));  // show overlay
     * dispatch(setGlobalLoading(false)); // hide overlay
     */
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },

    /**
     * Sets the current page title. Typically called in a `useEffect` at the
     * top of each page component, and the layout syncs it to `document.title`.
     *
     * @example
     * dispatch(setPageTitle("Dashboard — My App"));
     */
    setPageTitle(state, action: PayloadAction<string>) {
      state.pageTitle = action.payload;
    },

    /**
     * Sets the breadcrumb trail for the current route.
     *
     * @example
     * dispatch(setBreadcrumbs([
     *   { label: "Home", href: "/" },
     *   { label: "Settings", href: "/settings" },
     *   { label: "Profile" }, // last crumb has no href
     * ]));
     */
    setBreadcrumbs(state, action: PayloadAction<Breadcrumb[]>) {
      state.breadcrumbs = action.payload;
    },

    /**
     * Resets the UI state to its defaults.
     * Useful when navigating to a new section that doesn't set breadcrumbs.
     */
    resetUi(state) {
      state.globalLoading = false;
      state.pageTitle     = "";
      state.breadcrumbs   = [];
    },
  },
});

// ── Exports ───────────────────────────────────────────────────────────────────

export const uiActions = uiSlice.actions;
export const { setGlobalLoading, setPageTitle, setBreadcrumbs, resetUi } = uiSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export interface RootStateWithUi {
  ui: UiState;
}

export const selectGlobalLoading = (s: RootStateWithUi) => s.ui.globalLoading;
export const selectPageTitle     = (s: RootStateWithUi) => s.ui.pageTitle;
export const selectBreadcrumbs   = (s: RootStateWithUi) => s.ui.breadcrumbs;

export default uiSlice.reducer;
