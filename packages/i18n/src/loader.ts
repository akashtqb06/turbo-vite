/**
 * @module @repo/i18n/loader
 *
 * Async translation loader with two-tier caching:
 *   1. In-memory Map — survives navigation within the same session
 *   2. localStorage — survives page refresh (cleared on version bump)
 *
 * Uses `@repo/api-client` for HTTP requests and `@repo/utils/preferences`
 * for reading/writing the stored language preference.
 *
 * Binds to cross-tab language changes via the `LANGUAGE_CHANGED_EVENT`
 * from `@repo/utils/preferences` so all open tabs stay in sync.
 */

import { request } from "@repo/api-client/http";
import {
  getStoredLanguageCode,
  setStoredLanguageCode,
  LANGUAGE_CHANGED_EVENT,
} from "@repo/utils/preferences";
import { setTranslations, getCurrentLanguage, type TranslationMap } from "./core.js";

// Re-export so consumers can load translations without importing core directly
export { setTranslations } from "./core.js";

// ── Constants ──────────────────────────────────────────────────────────────────

/** localStorage key prefix for cached translation maps. */
const CACHE_PREFIX = "i18n.translations.";

// ── In-memory cache (reset on page unload naturally) ─────────────────────────
const _memoryCache = new Map<string, TranslationMap>();

// ── Helpers ───────────────────────────────────────────────────────────────────

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCached(lang: string): TranslationMap | null {
  if (_memoryCache.has(lang)) return _memoryCache.get(lang) ?? null;
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(`${CACHE_PREFIX}${lang}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as TranslationMap;
    _memoryCache.set(lang, parsed);
    return parsed;
  } catch {
    return null;
  }
}

function writeCached(lang: string, data: TranslationMap): void {
  _memoryCache.set(lang, data);
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(`${CACHE_PREFIX}${lang}`, JSON.stringify(data));
  } catch {
    // Ignore QuotaExceededError in Safari private mode
  }
}

/**
 * Warms the loader's in-memory cache with translations that were loaded by
 * other means (e.g. bundled JSON, mock data, SSR payload). Call this before
 * `setTranslations()` so the loader won't attempt a network fetch afterward.
 *
 * @param lang - BCP-47 language code.
 * @param data - The pre-loaded translation map.
 *
 * @example
 * // In a demo/test — skip the network, load inline:
 * warmTranslationsCache("fr", MOCK_FR_TRANSLATIONS);
 * setTranslations(MOCK_FR_TRANSLATIONS, "fr");
 */
export function warmTranslationsCache(lang: string, data: TranslationMap): void {
  writeCached(lang, data);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Reads the user's stored language preference from localStorage.
 * Falls back to `"en"` when nothing is stored.
 *
 * @returns BCP-47 language code, defaulting to `"en"`.
 *
 * @example
 * const lang = getPreferredLanguage(); // → "de"
 */
export function getPreferredLanguage(): string {
  return getStoredLanguageCode() ?? "en";
}

/**
 * Persists the user's language choice and triggers a cross-tab sync event.
 *
 * @param code - BCP-47 language code to store (e.g. `"fr"`, `"de"`).
 *
 * @example
 * setPreferredLanguage("fr"); // persists + notifies other tabs
 */
export function setPreferredLanguage(code: string): void {
  setStoredLanguageCode(code);
}

/**
 * Ensures the given language's translations are loaded and active.
 *
 * - If `lang` is already the current language with a non-empty map → no-op.
 * - If translations are cached → loads from cache instantly.
 * - Otherwise → fetches from `GET /api/translations/:lang` and caches.
 *
 * English (`"en"`) is a special case: it always uses the empty map because
 * English strings are the keys themselves (no translation needed).
 *
 * @param lang - BCP-47 language code to activate.
 *
 * @example
 * await ensureTranslations("fr");
 * t("common.save"); // → "Enregistrer"
 */
export async function ensureTranslations(lang: string | null | undefined): Promise<void> {
  const code = lang?.trim().toLowerCase() || "en";

  // No-op if already active:
  // - For "en": always use empty map, only skip if already on "en"
  // - For others: skip if memory cache OR localStorage cache already has this lang
  //   (covers the case where setTranslations was called directly via warmTranslationsCache)
  if (code === getCurrentLanguage() && code === "en") return;
  if (code === getCurrentLanguage() && (_memoryCache.has(code) || readCached(code) !== null)) return;

  // English uses the empty map — keys are the strings themselves
  if (code === "en") {
    setTranslations({}, "en");
    return;
  }

  const cached = readCached(code);
  if (cached) {
    setTranslations(cached, code);
    return;
  }

  // Fetch from API
  try {
    const payload = await request<{ translations: TranslationMap }>(
      `/api/translations/${encodeURIComponent(code)}`
    );
    const data: TranslationMap =
      payload?.translations && typeof payload.translations === "object"
        ? payload.translations
        : {};
    writeCached(code, data);
    setTranslations(data, code);
  } catch {
    // If the API call fails, fall back to an empty map so the app stays usable
    setTranslations({}, code);
  }
}

/**
 * Binds a callback to language change events from any tab.
 * Listens to both `storage` events (cross-tab) and the `LANGUAGE_CHANGED_EVENT`
 * custom event (same tab, dispatched by `setStoredLanguageCode`).
 *
 * @param onChange - Called with the new language code whenever it changes.
 * @returns Cleanup function to remove both event listeners.
 *
 * @example
 * const cleanup = bindLanguageSync((lang) => setLanguage(lang));
 * // In React: call cleanup in useEffect cleanup
 */
export function bindLanguageSync(onChange: (lang: string) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === "language.code") {
      onChange(getPreferredLanguage());
    }
  };
  const onChanged = () => onChange(getPreferredLanguage());

  window.addEventListener("storage", onStorage);
  window.addEventListener(LANGUAGE_CHANGED_EVENT, onChanged);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LANGUAGE_CHANGED_EVENT, onChanged);
  };
}
