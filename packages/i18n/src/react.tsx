/**
 * @module @repo/i18n/react
 *
 * React bindings for `@repo/i18n` — provider + hook.
 *
 * Usage:
 * ```tsx
 * // 1. Wrap app (in main.tsx, inside Redux Provider)
 * <TranslationProvider>
 *   <App />
 * </TranslationProvider>
 *
 * // 2. Use anywhere
 * const { t, language, loading } = useTranslation();
 * <button>{t("common.save", "Save")}</button>
 * ```
 */

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { ReactNode } from "react";
import { t, getCurrentLanguage, subscribeToTranslations, type TranslateOptions } from "./core.js";
import { getPreferredLanguage, ensureTranslations, bindLanguageSync } from "./loader.js";

// ── Context ───────────────────────────────────────────────────────────────────

/** Value exposed by the `TranslationContext`. */
export interface TranslationContextValue {
  /** The currently active BCP-47 language code. */
  language: string;
  /** `true` while translations are being fetched from the API. */
  loading: boolean;
  /**
   * Translates a key. Falls back to `fallback` then to the key itself.
   * Supports `{{token}}` interpolation via `options.values`.
   *
   * @param key - Translation key.
   * @param fallback - Human-readable fallback string.
   * @param options - Optional interpolation values.
   */
  t: (key: string, fallback?: string, options?: TranslateOptions) => string;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

/** Props for `TranslationProvider`. */
export interface TranslationProviderProps {
  /** The component tree that needs translation access. */
  children: ReactNode;
  /**
   * Override the initial language instead of reading from localStorage.
   * Useful for SSR or testing.
   */
  initialLanguage?: string;
}

/**
 * Provides translation context to the component tree below.
 * Automatically syncs language changes across browser tabs and reacts to
 * direct `setTranslations()` calls (e.g. loading mock data in tests/demos).
 *
 * Mount once near the root of your app, inside `<Provider>` (Redux):
 * ```tsx
 * <Provider store={store}>
 *   <TranslationProvider>
 *     <App />
 *   </TranslationProvider>
 * </Provider>
 * ```
 */
export function TranslationProvider({ children, initialLanguage }: TranslationProviderProps) {
  const [loading, setLoading] = useState(false);

  // Track language from the core store — updated by both loadLanguage() and
  // direct setTranslations() calls (e.g. from demo/testing code).
  const [language, setLanguage] = useState(initialLanguage ?? getPreferredLanguage());

  // Increment counter forces re-render when translations change so consumers
  // get fresh t() output even when language string stays the same.
  const [tick, forceUpdate] = useReducer((n: number) => n + 1, 0);

  // Keep language state in sync with the core store whenever translations are
  // swapped (handles both ensureTranslations() and direct setTranslations()).
  useEffect(() => subscribeToTranslations(() => {
    setLanguage(getCurrentLanguage());
    forceUpdate();
  }), []);

  // Load translations from API when language changes externally (cross-tab sync).
  useEffect(() => bindLanguageSync((lang) => {
    setLanguage(lang);
  }), []);

  // Fetch translations when the provider-tracked language changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    ensureTranslations(language)
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [language]);

  // Memoize context value — recompute whenever language, loading, or tick changes.
  // `tick` ensures we re-create the object even if language string is unchanged
  // (e.g. setTranslations called with same locale but different strings).
  const value = useMemo<TranslationContextValue>(
    () => ({ language: getCurrentLanguage(), loading, t }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, language, tick],
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

TranslationProvider.displayName = "TranslationProvider";

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Returns the current translation context — `{ t, language, loading }`.
 * Must be called inside a `<TranslationProvider>`.
 *
 * @returns The active translation context value.
 * @throws {Error} When called outside of `<TranslationProvider>`.
 *
 * @example
 * function SaveButton() {
 *   const { t } = useTranslation();
 *   return <button>{t("common.save", "Save")}</button>;
 * }
 */
export function useTranslation(): TranslationContextValue {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error("useTranslation must be called inside <TranslationProvider>");
  }
  return ctx;
}
