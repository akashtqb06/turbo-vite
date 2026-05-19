/**
 * @module @repo/i18n/core
 *
 * Pure translation store — no React, no HTTP, no side effects.
 *
 * This module maintains the in-memory translation state and notifies
 * subscribers when translations change. It is the single source of truth
 * for the active language and translation map.
 *
 * Dependencies: none (pure TypeScript)
 */

// ── Types ─────────────────────────────────────────────────────────────────────

/** A flat key→value translation map. Values may contain `{{placeholder}}` tokens. */
export type TranslationMap = Record<string, string>;

/** Listener function called whenever the active translations change. */
export type TranslationListener = () => void;

/** Options for the `t()` function. */
export interface TranslateOptions {
  /**
   * Optional interpolation values replacing `{{key}}` tokens in the translation.
   * @example t("greeting", { name: "Jane" }) // "Hello, Jane!"
   */
  values?: Record<string, string | number>;
}

// ── Module state ──────────────────────────────────────────────────────────────

let _currentLanguage  = "en";
let _translations: TranslationMap = {};
const _listeners      = new Set<TranslationListener>();

// ── Core API ──────────────────────────────────────────────────────────────────

/**
 * Translates a key using the active translation map.
 *
 * Resolution order:
 * 1. Translation map entry for `key`
 * 2. `fallback` if provided
 * 3. `key` itself (always returns a string)
 *
 * Supports `{{token}}` interpolation when `options.values` is provided.
 *
 * @param key - The translation key to look up.
 * @param fallback - Optional human-readable fallback (shown when key is missing).
 * @param options - Optional interpolation values.
 * @returns The translated string, interpolated if values are provided.
 *
 * @example
 * // Simple
 * t("common.save")              // → "Save"
 *
 * // With fallback
 * t("missing.key", "Default")   // → "Default"
 *
 * // With interpolation  (translation: "Hello, {{name}}!")
 * t("greeting", undefined, { values: { name: "Jane" } }) // → "Hello, Jane!"
 */
export function t(key: string, fallback?: string, options?: TranslateOptions): string {
  const raw = _translations[key] ?? fallback ?? key;

  if (!options?.values) return raw;

  // Replace {{token}} placeholders with values
  return raw.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    const val = options.values?.[token];
    return val !== undefined ? String(val) : `{{${token}}}`;
  });
}

/**
 * Returns the currently active BCP-47 language code (e.g. `"en"`, `"fr"`, `"de"`).
 *
 * @returns The active language code.
 *
 * @example
 * getCurrentLanguage(); // → "en"
 */
export function getCurrentLanguage(): string {
  return _currentLanguage;
}

/**
 * Replaces the active translation map and notifies all subscribers.
 * Called by the loader after fetching translations from the API.
 *
 * @param data - The new flat translation map.
 * @param language - The BCP-47 language code for this map. Defaults to current language.
 *
 * @example
 * setTranslations({ "common.save": "Speichern" }, "de");
 */
export function setTranslations(data: TranslationMap, language = _currentLanguage): void {
  _currentLanguage = language;
  _translations    = data;
  _notifyListeners();
}

/**
 * Subscribes to translation changes. Returns an unsubscribe function.
 *
 * @param listener - Function called whenever translations are updated.
 * @returns Cleanup function that removes the subscription.
 *
 * @example
 * const unsub = subscribeToTranslations(() => forceRerender());
 * // later:
 * unsub();
 */
export function subscribeToTranslations(listener: TranslationListener): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Calls all registered listeners synchronously. @internal */
function _notifyListeners(): void {
  _listeners.forEach((fn) => fn());
}
