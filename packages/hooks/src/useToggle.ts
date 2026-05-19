/**
 * @module @repo/hooks/useToggle
 *
 * Boolean toggle hook — provides a value, a toggle function, and explicit setters.
 */

import { useState, useCallback } from "react";

/** Return value of `useToggle`. */
export interface UseToggleReturn {
  /** The current boolean value. */
  value: boolean;
  /** Flips the value between `true` and `false`. */
  toggle: () => void;
  /** Explicitly sets the value to `true`. */
  setTrue: () => void;
  /** Explicitly sets the value to `false`. */
  setFalse: () => void;
  /** Sets the value to any boolean. */
  set: (v: boolean) => void;
}

/**
 * Manages a boolean toggle state with stable action callbacks.
 *
 * @param initialValue - The starting value. Defaults to `false`.
 * @returns An object with `value`, `toggle`, `setTrue`, `setFalse`, and `set`.
 *
 * @example
 * const { value: isOpen, toggle, setFalse: close } = useToggle(false);
 * <Dialog open={isOpen} onClose={close} />
 * <button onClick={toggle}>Open Dialog</button>
 */
export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  const toggle  = useCallback(() => setValue((v) => !v), []);
  const setTrue  = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const set      = useCallback((v: boolean) => setValue(v), []);

  return { value, toggle, setTrue, setFalse, set };
}
