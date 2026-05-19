/**
 * @module @repo/utils
 *
 * Public API barrel for the `@repo/utils` package.
 *
 * Import from subpath exports for maximum tree-shaking:
 *   import { truncate } from "@repo/utils/string";
 *   import { pick }     from "@repo/utils/object";
 *
 * Or import everything from the root (less optimal for bundle size):
 *   import { truncate, pick, formatDate } from "@repo/utils";
 */

// ── String utilities ──────────────────────────────────────────────────────────
export { truncate, slugify, capitalize, camelToKebab, stripHtml, initials } from "./string.js";

// ── Object utilities ──────────────────────────────────────────────────────────
export { pick, omit, deepClone, flattenObject } from "./object.js";

// ── Array utilities ───────────────────────────────────────────────────────────
export { groupBy, uniqueBy, chunk, sortBy, last } from "./array.js";

// ── Date utilities ────────────────────────────────────────────────────────────
export { formatDate, formatRelative, isValidDate } from "./date.js";

// ── Type guards ───────────────────────────────────────────────────────────────
export {
  isString,
  isNumber,
  isBoolean,
  isNonNullable,
  isPlainObject,
  isError,
  isPromiseLike,
} from "./guards.js";

// ── Async utilities ───────────────────────────────────────────────────────────
export { sleep, retry, withTimeout, createDeferred } from "./async.js";
export type { Deferred } from "./async.js";

// ── URL utilities ─────────────────────────────────────────────────────────────
export {
  parseSearchParams,
  parseSearchParamsMulti,
  buildQueryString,
  joinPaths,
} from "./url.js";

// ── Styling ───────────────────────────────────────────────────────────────────
export { cn } from "./cn.js";

// ── Preferences (kept from original @repo/api-client) ────────────────────────
export {
  getStoredLanguageCode,
  setStoredLanguageCode,
  clearStoredLanguageCode,
  LANGUAGE_CHANGED_EVENT,
  LANGUAGE_STORAGE_KEY,
} from "./preferences/index.js";

// ── Theme service (kept from original @repo/api-client) ──────────────────────
export { getThemes, getThemeById } from "./services/theme.service.js";
export type { Theme, ThemeTokens } from "./services/theme.service.js";
