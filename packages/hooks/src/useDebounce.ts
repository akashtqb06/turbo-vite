/**
 * @module @repo/hooks/useDebounce
 *
 * Debounces a value, delaying updates until `delay` ms of inactivity has passed.
 * Useful for search inputs, auto-save, and any high-frequency update scenarios.
 */

import { useState, useEffect } from "react";

/**
 * Returns a debounced version of `value` that only updates after `delay` ms
 * of inactivity. If `value` changes before the delay expires, the timer resets.
 *
 * @param value - The value to debounce. Can be any type.
 * @param delay - Delay in milliseconds. Defaults to `300`.
 * @returns The debounced value (lags behind `value` by up to `delay` ms).
 *
 * @example
 * function SearchInput() {
 *   const [query, setQuery] = useState("");
 *   const debouncedQuery = useDebounce(query, 400);
 *
 *   useEffect(() => {
 *     if (debouncedQuery) fetchResults(debouncedQuery);
 *   }, [debouncedQuery]);
 *
 *   return <input value={query} onChange={e => setQuery(e.target.value)} />;
 * }
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cleanup: cancel the pending timer if value or delay changes before it fires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
