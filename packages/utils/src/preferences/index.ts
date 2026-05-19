/**
 * Preferences module — manages user-scoped settings such as language choice.
 *
 * The `LANGUAGE_CHANGED_EVENT` custom event is dispatched whenever the stored
 * language code changes, allowing UI components to re-render reactively.
 */

export const LANGUAGE_CHANGED_EVENT = "app:language-changed";
export const LANGUAGE_STORAGE_KEY   = "language.code";

/**
 * Read the user's stored language code from localStorage.
 * Returns `null` when running outside a browser or when no preference is saved.
 */
export function getStoredLanguageCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LANGUAGE_STORAGE_KEY);
}

/**
 * Persist the user's language choice and notify listeners.
 */
export function setStoredLanguageCode(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT));
}

/**
 * Clear the stored language preference and notify listeners.
 */
export function clearStoredLanguageCode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT));
}
