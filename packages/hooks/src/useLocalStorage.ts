/**
 * @module @repo/hooks/useLocalStorage
 *
 * Typed localStorage hook with SSR safety and cross-tab synchronisation.
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Persists and reads a value from `localStorage`, returning a stateful getter
 * and setter that stay in sync with storage across the current tab.
 *
 * SSR-safe: returns `initialValue` when `window` is not available.
 * Cross-tab-safe: listens for `storage` events to sync value when another tab writes.
 *
 * @param key - The localStorage key to read from and write to.
 * @param initialValue - Value used when no stored value exists yet.
 * @returns `[storedValue, setValue]` — the same API as `useState`.
 *
 * @example
 * const [token, setToken] = useLocalStorage("auth_token", "");
 * setToken("abc123");   // persists to localStorage
 * setToken("");         // clears localStorage key
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // ── Lazy initializer: read from storage on first render ────────────────────
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // ── Setter: writes both state and localStorage atomically ──────────────────
  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== "undefined") {
          if (value === undefined || value === null || value === "") {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, JSON.stringify(value));
          }
        }
      } catch {
        // localStorage can throw in Safari private mode or when storage is full
      }
    },
    [key],
  );

  // ── Cross-tab sync: listen for storage events from other tabs ─────────────
  useEffect(() => {
    function onStorageEvent(event: StorageEvent) {
      if (event.key !== key) return;
      if (event.newValue === null) {
        setStoredValue(initialValue);
      } else {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // ignore parse errors from other tabs
        }
      }
    }
    window.addEventListener("storage", onStorageEvent);
    return () => window.removeEventListener("storage", onStorageEvent);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
