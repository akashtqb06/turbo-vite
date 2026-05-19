"use client";

import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThemes, selectActiveTheme, selectThemeMode } from "@repo/store/slices/theme";
import type { AppDispatch } from "@repo/store/store";
import type { ThemeMode } from "@repo/store/slices/theme";
import type { Theme } from "@repo/api-client/services/theme";

// ─── Legacy context shim ──────────────────────────────────────────────────────
// Kept for backward compatibility — prefer useTheme() from @repo/store instead.
export const ThemeContext = createContext<null>(null);

// ─── DOM side-effect: apply token map to :root ────────────────────────────────

/**
 * Writes the active theme's token map onto `document.documentElement` as CSS
 * custom properties. This is a pure DOM side-effect — intentionally outside
 * Redux because CSS custom properties are not serialisable state.
 */
function applyTokens(theme: Theme, mode: ThemeMode): void {
  const root   = document.documentElement;
  const tokens = mode === "dark" ? theme.dark : theme.light;

  for (const [property, value] of Object.entries(tokens)) {
    root.style.setProperty(property, value);
  }

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

// ─── Token applier ────────────────────────────────────────────────────────────

function ThemeTokenApplier() {
  const activeTheme = useSelector(selectActiveTheme);
  const mode        = useSelector(selectThemeMode);

  useEffect(() => {
    if (!activeTheme) return;
    applyTokens(activeTheme, mode);
  }, [activeTheme, mode]);

  return null;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Ignored — initial state is now read from the Redux theme slice. */
  defaultTheme?: string;
  defaultMode?: ThemeMode;
}

/**
 * ThemeProvider — fetches themes via Redux and applies CSS custom properties.
 *
 * **Must** be rendered inside a Redux `<Provider store={store}>`.
 *
 * Switch themes from anywhere in the tree:
 * ```ts
 * const { setTheme, toggleMode } = useTheme(); // from @repo/store
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    void dispatch(fetchThemes());
  }, [dispatch]);

  return (
    <>
      <ThemeTokenApplier />
      {children}
    </>
  );
}
