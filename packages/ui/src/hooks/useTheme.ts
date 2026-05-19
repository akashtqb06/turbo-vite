/**
 * useTheme — Re-exported from @repo/store for convenience.
 *
 * Reads theme state from the Redux store and returns typed action dispatchers.
 * Must be used inside a Redux <Provider>.
 *
 * @example
 * import { useTheme } from "@repo/ui/hooks/useTheme";
 * const { activeTheme, mode, setTheme, toggleMode } = useTheme();
 */
export { useTheme } from "@repo/store";
