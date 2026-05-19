/**
 * @module @repo/hooks/useInterval
 *
 * Safe `setInterval` hook that cleans up automatically on unmount.
 * Supports pausing the interval by passing `null` as the delay.
 */

import { useEffect, useRef } from "react";

/**
 * Calls `callback` repeatedly with the given `delay` in milliseconds.
 * The interval is automatically cleared when the component unmounts.
 *
 * Pass `null` as `delay` to pause the interval without unmounting.
 * The `callback` ref is always up-to-date — no stale closure issues.
 *
 * @param callback - Function to call on each interval tick.
 * @param delay - Interval duration in ms, or `null` to pause.
 *
 * @example
 * // Counts up every second
 * const [count, setCount] = useState(0);
 * useInterval(() => setCount(c => c + 1), 1000);
 *
 * // Pausable interval
 * const [paused, setPaused] = useState(false);
 * useInterval(() => tick(), paused ? null : 500);
 */
export function useInterval(callback: () => void, delay: number | null): void {
  // Keep a stable ref to the latest callback to avoid stale closures
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return; // paused — do not start interval

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
