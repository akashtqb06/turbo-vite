/**
 * @module @repo/hooks
 *
 * Public API for `@repo/hooks` — shared React hooks.
 * All hooks follow these invariants:
 * - No Redux dependency (import from @repo/store if you need global state)
 * - SSR-safe (guarded with `typeof window !== "undefined"`)
 * - Stable callback references (useCallback with explicit deps)
 * - Full JSDoc with @example in each file
 */

export { useDebounce }          from "./useDebounce.js";
export { useLocalStorage }      from "./useLocalStorage.js";
export { useMediaQuery }        from "./useMediaQuery.js";
export { useToggle }            from "./useToggle.js";
export type { UseToggleReturn } from "./useToggle.js";
export { useInterval }          from "./useInterval.js";
export { useCopyToClipboard }   from "./useCopyToClipboard.js";
export type { UseCopyToClipboardReturn } from "./useCopyToClipboard.js";
