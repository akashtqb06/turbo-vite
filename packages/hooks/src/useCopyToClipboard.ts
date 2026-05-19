/**
 * @module @repo/hooks/useCopyToClipboard
 *
 * Clipboard copy hook with transient "copied" feedback state.
 */

import { useState, useCallback } from "react";

/** Return value of `useCopyToClipboard`. */
export interface UseCopyToClipboardReturn {
  /** The last successfully copied text, or `null` if nothing has been copied yet. */
  copiedText: string | null;
  /** `true` for `feedbackMs` after a successful copy. Use to show a "Copied!" indicator. */
  isCopied: boolean;
  /**
   * Copies the given text to the clipboard.
   * @returns A Promise that resolves to `true` on success, `false` on failure.
   */
  copy: (text: string) => Promise<boolean>;
  /** Manually resets `isCopied` and `copiedText` to their initial state. */
  reset: () => void;
}

/**
 * Provides a copy-to-clipboard function with transient feedback state.
 *
 * @param feedbackMs - How long (ms) `isCopied` stays `true` after a copy. Defaults to `2000`.
 * @returns `{ copiedText, isCopied, copy, reset }`
 *
 * @example
 * function CopyButton({ code }: { code: string }) {
 *   const { isCopied, copy } = useCopyToClipboard();
 *
 *   return (
 *     <button onClick={() => copy(code)}>
 *       {isCopied ? "✓ Copied!" : "Copy"}
 *     </button>
 *   );
 * }
 */
export function useCopyToClipboard(feedbackMs = 2000): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied]     = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      // Clipboard API not available (non-secure context / older browser)
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      // Auto-reset the "copied" indicator after the feedback window
      setTimeout(() => setIsCopied(false), feedbackMs);
      return true;
    } catch {
      return false;
    }
  }, [feedbackMs]);

  const reset = useCallback(() => {
    setCopiedText(null);
    setIsCopied(false);
  }, []);

  return { copiedText, isCopied, copy, reset };
}
