/**
 * @module @repo/store/middleware/errorMiddleware
 *
 * Redux middleware that catches and logs unhandled errors thrown by reducers.
 * In production, errors are reported to the logger instead of crashing silently.
 */

import type { Middleware } from "@reduxjs/toolkit";

/**
 * Catches errors thrown during action dispatch or reducer execution,
 * logs them with context, and re-throws so error boundaries can catch them.
 *
 * @example
 * // In createAppStore:
 * middleware: (getDefaultMiddleware) =>
 *   getDefaultMiddleware().concat(errorMiddleware),
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware: Middleware = (_store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    const actionType = typeof action === "object" && action !== null && "type" in action
      ? String((action as { type: unknown }).type)
      : "unknown";

    // Log with full context — @repo/logger cannot be imported here to avoid
    // circular deps, so we use console.error (this is infrastructure code, not app code)
    console.error(
      `[store] Unhandled error in reducer for action "${actionType}":`,
      err,
      "\nAction payload:", action,
    );

    // Re-throw so React Error Boundaries and Sentry can catch it
    throw err;
  }
};
