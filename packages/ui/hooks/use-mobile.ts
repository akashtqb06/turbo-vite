/**
 * @module @repo/ui/hooks/use-mobile
 *
 * Delegates to `@repo/hooks/useMediaQuery` to avoid duplicating the
 * matchMedia listener logic. The single source of truth lives in
 * `packages/hooks/src/useMediaQuery.ts`.
 */
import { useMediaQuery } from "@repo/hooks";

const MOBILE_BREAKPOINT = 768;

/**
 * Returns `true` when the viewport width is below the mobile breakpoint (768 px).
 * Reactive — re-renders automatically on resize.
 *
 * @example
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileNav /> : <DesktopNav />;
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}
