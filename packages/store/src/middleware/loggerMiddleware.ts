/**
 * @module @repo/store/middleware/loggerMiddleware
 *
 * Redux middleware that logs all dispatched actions and state diffs to the console.
 * Automatically disabled in production and test environments.
 *
 * Only active when `import.meta.env.DEV === true` (Vite dev mode).
 * Logs are formatted with collapsed groups for readability.
 */

import type { Middleware } from "@reduxjs/toolkit";

// ── Style constants ───────────────────────────────────────────────────────────

const STYLES = {
  action:    "color: #4CAF50; font-weight: bold",
  prevState: "color: #9E9E9E; font-weight: bold",
  nextState: "color: #2196F3; font-weight: bold",
  duration:  "color: #FF9800; font-weight: bold",
} as const;

// ── Middleware ────────────────────────────────────────────────────────────────

/**
 * Logs every Redux action and the resulting state change in collapsed console groups.
 * Only active in Vite's development mode (`import.meta.env.DEV`).
 *
 * Usage: add to `getDefaultMiddleware().concat(loggerMiddleware)` in `createAppStore`.
 *
 * @example
 * // Console output (collapsed by default):
 * ▶ action theme/setMode @ 14:32:01.234 (0.12 ms)
 *   prev state  { theme: { mode: "light", ... } }
 *   action      { type: "theme/setMode", payload: "dark" }
 *   next state  { theme: { mode: "dark", ... } }
 */
export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  // Guard: only log in development mode
  if (typeof import.meta === "undefined" || !(import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) {
    return next(action);
  }

  const start     = performance.now();
  const prevState = store.getState() as unknown;
  const result    = next(action);
  const duration  = (performance.now() - start).toFixed(2);
  const nextState = store.getState() as unknown;

  const actionType = typeof action === "object" && action !== null && "type" in action
    ? String((action as { type: unknown }).type)
    : "unknown";

  const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm

  // Use collapsed group to avoid overwhelming the console
  console.groupCollapsed(`%caction %c${actionType} %c@ ${timestamp} (${duration} ms)`,
    STYLES.action, "color: inherit; font-weight: normal", STYLES.duration);
  console.log("%cprev state", STYLES.prevState, prevState);
  console.log("%caction    ", STYLES.action, action);
  console.log("%cnext state", STYLES.nextState, nextState);
  console.groupEnd();

  return result;
};
