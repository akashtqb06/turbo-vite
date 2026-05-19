/**
 * @deprecated Use `@repo/i18n` directly instead.
 *
 * This file is a backwards-compatibility re-export shim.
 * It was the original home of the translation system before it was extracted
 * into the standalone `@repo/i18n` package.
 *
 * Migration:
 * ```ts
 * // Before
 * import { t, setTranslations } from "@repo/ui/lib/i18n";
 *
 * // After
 * import { t, setTranslations } from "@repo/i18n";
 * ```
 */
export {
  t,
  getCurrentLanguage,
  setTranslations,
  subscribeToTranslations,
  getPreferredLanguage,
  setPreferredLanguage,
  ensureTranslations,
  bindLanguageSync,
} from "@repo/i18n";

export type {
  TranslationMap,
  TranslationListener,
  TranslateOptions,
} from "@repo/i18n";

// Legacy name aliases kept for backwards compatibility
export { bindLanguageSync as bindTranslationLanguageSync } from "@repo/i18n";
