/**
 * @module @repo/i18n
 *
 * Lightweight translation system for the monorepo.
 *
 * Architecture:
 * - `core.ts`   — Pure in-memory store: `t()`, `setTranslations()`, `subscribeToTranslations()`
 * - `loader.ts` — Async fetch + two-tier cache (memory + localStorage)
 * - `react.tsx` — React bindings: `<TranslationProvider>`, `useTranslation()`
 *
 * Typical setup in `main.tsx`:
 * ```tsx
 * import { TranslationProvider } from "@repo/i18n/react";
 *
 * root.render(
 *   <Provider store={store}>
 *     <TranslationProvider>
 *       <App />
 *     </TranslationProvider>
 *   </Provider>
 * );
 * ```
 *
 * Typical usage in a component:
 * ```tsx
 * import { useTranslation } from "@repo/i18n";
 *
 * function SaveButton() {
 *   const { t } = useTranslation();
 *   return <button>{t("common.save", "Save")}</button>;
 * }
 * ```
 */

// ── Core (no React) ───────────────────────────────────────────────────────────
export { t, getCurrentLanguage, setTranslations, subscribeToTranslations } from "./core.js";
export type { TranslationMap, TranslationListener, TranslateOptions } from "./core.js";

// ── Loader ────────────────────────────────────────────────────────────────────
export {
  getPreferredLanguage,
  setPreferredLanguage,
  ensureTranslations,
  bindLanguageSync,
  warmTranslationsCache,
} from "./loader.js";

// ── React bindings ────────────────────────────────────────────────────────────
export { TranslationProvider, useTranslation } from "./react.js";
export type { TranslationContextValue, TranslationProviderProps } from "./react.js";
