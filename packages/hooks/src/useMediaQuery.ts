/**
 * @module @repo/hooks/useMediaQuery
 *
 * Reactive hook that tracks whether a CSS media query matches.
 * Uses `window.matchMedia` and subscribes to change events for live updates.
 */

import { useState, useEffect } from "react";

/**
 * Returns `true` while the given CSS media query matches, `false` otherwise.
 * Re-renders automatically whenever the match status changes.
 *
 * SSR-safe: returns `false` on the server (no `window` available).
 *
 * @param query - A valid CSS media query string.
 * @returns `true` if the media query currently matches.
 *
 * @example
 * function ResponsiveLayout() {
 *   const isMobile  = useMediaQuery("(max-width: 768px)");
 *   const isDark    = useMediaQuery("(prefers-color-scheme: dark)");
 *   const isTablet  = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
 *
 *   return isMobile ? <MobileLayout /> : <DesktopLayout />;
 * }
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR guard — matchMedia is browser-only
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches); // sync in case query changed

    function onChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    // Modern API: addEventListener (Safari 14+, all other browsers)
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
