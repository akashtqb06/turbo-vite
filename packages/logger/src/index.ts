/**
 * @module @repo/logger
 *
 * Lightweight structured logger for the monorepo.
 *
 * Features:
 * - 4 log levels: debug | info | warn | error
 * - Level gating: messages below the configured level are silenced
 * - Environment-aware: automatically silences all output in test environments
 * - Optional prefix: identifies which app/package produced the log
 * - Structured context: each call accepts an optional metadata object
 * - Zero external dependencies: no pino, no winston — pure browser console
 *
 * Usage:
 * ```ts
 * // 1. Configure once at app startup (main.tsx)
 * configureLogger({ level: env.VITE_LOG_LEVEL, prefix: env.VITE_APP_NAME });
 *
 * // 2. Import and use anywhere (no React dependency)
 * import { logger } from "@repo/logger";
 * logger.info("User signed in", { userId: user.id });
 * logger.error("Payment failed", { error, orderId });
 * ```
 */

// ── Types ─────────────────────────────────────────────────────────────────────

/** Available log severity levels, from least to most severe. */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** Numeric priority for each log level — used for level gating comparisons. */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info:  1,
  warn:  2,
  error: 3,
} as const;

/** Configuration for the logger instance. */
export interface LoggerConfig {
  /**
   * Minimum level to output. Messages below this level are silently dropped.
   * Defaults to `"info"` in production, `"debug"` in development.
   */
  level?: LogLevel;
  /**
   * Optional prefix prepended to all log messages in brackets.
   * Typically set to the app name (e.g. `"dashboard"`, `"admin"`).
   *
   * @example
   * configureLogger({ prefix: "dashboard" });
   * logger.info("Ready");  // → "[dashboard] Ready"
   */
  prefix?: string;
}

// ── Module-level configuration ────────────────────────────────────────────────

let _level:    LogLevel = "info";
let _prefix:   string   = "";

/** `true` when running in a Vitest test environment — silences all output. */
const IS_TEST = (() => {
  try {
    // Vitest sets import.meta.env.VITEST = "true" in both jsdom and node envs.
    // Cast through unknown so this compiles in both Vite-aware and standard tsconfigs.
    const env = (import.meta as unknown as { env?: Record<string, string> }).env;
    return env?.["VITEST"] === "true";
  } catch {
    return false;
  }
})();

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Determines whether a message at `messageLevel` should be output
 * given the current minimum log level.
 *
 * @internal
 */
function shouldLog(messageLevel: LogLevel): boolean {
  if (IS_TEST) return false;
  return LOG_LEVEL_PRIORITY[messageLevel] >= LOG_LEVEL_PRIORITY[_level];
}

/**
 * Formats the log message with optional prefix and timestamp.
 *
 * @internal
 */
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
  const prefix    = _prefix ? `[${_prefix}] ` : "";
  return `${timestamp} ${level.toUpperCase().padEnd(5)} ${prefix}${message}`;
}

// ── Logger object ─────────────────────────────────────────────────────────────

/**
 * The shared logger instance. Import and use this across the codebase.
 * Configure it with `configureLogger()` at app startup before first use.
 */
export const logger = {
  /**
   * Logs a debug message. Only output when level is set to `"debug"`.
   * Use for verbose diagnostic information during development.
   *
   * @param message - The log message.
   * @param context - Optional structured metadata to attach.
   *
   * @example
   * logger.debug("Cache miss", { key: cacheKey, ttl: 300 });
   */
  debug(message: string, context?: unknown): void {
    if (!shouldLog("debug")) return;
    console.debug(formatMessage("debug", message), ...(context !== undefined ? [context] : []));
  },

  /**
   * Logs an informational message. Use for normal application events.
   *
   * @param message - The log message.
   * @param context - Optional structured metadata.
   *
   * @example
   * logger.info("Server started", { port: 3000, env: "production" });
   */
  info(message: string, context?: unknown): void {
    if (!shouldLog("info")) return;
    console.info(formatMessage("info", message), ...(context !== undefined ? [context] : []));
  },

  /**
   * Logs a warning. Use for recoverable issues that shouldn't happen in normal operation.
   *
   * @param message - The warning message.
   * @param context - Optional structured metadata.
   *
   * @example
   * logger.warn("Slow query detected", { ms: 340, query: "/api/reports" });
   */
  warn(message: string, context?: unknown): void {
    if (!shouldLog("warn")) return;
    console.warn(formatMessage("warn", message), ...(context !== undefined ? [context] : []));
  },

  /**
   * Logs an error. Use for unrecoverable failures that need investigation.
   *
   * @param message - The error description.
   * @param context - Optional error object or structured metadata.
   *
   * @example
   * try { ... } catch (err) {
   *   logger.error("Failed to send email", { error: err, recipient });
   * }
   */
  error(message: string, context?: unknown): void {
    if (!shouldLog("error")) return;
    console.error(formatMessage("error", message), ...(context !== undefined ? [context] : []));
  },
} as const;

// ── Configuration ─────────────────────────────────────────────────────────────

/**
 * Configures the logger before first use.
 * Call this **once** at app startup in `main.tsx`.
 *
 * @param config - Logger configuration options.
 *
 * @example
 * configureLogger({
 *   level:  import.meta.env.VITE_LOG_LEVEL ?? "info",
 *   prefix: import.meta.env.VITE_APP_NAME  ?? "app",
 * });
 */
export function configureLogger(config: LoggerConfig): void {
  if (config.level)  _level  = config.level;
  if (config.prefix) _prefix = config.prefix;
}
