/**
 * @module @repo/utils/date
 *
 * Date formatting and validation utilities built on top of `date-fns`.
 * All functions accept `Date | string | number` for maximum flexibility.
 * No React dependency.
 */

import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

// ── Internal helper ───────────────────────────────────────────────────────────

/**
 * Normalises a `Date | string | number` input to a `Date` object.
 * ISO strings are parsed with `date-fns/parseISO` for strict handling.
 *
 * @internal
 */
function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string") return parseISO(value);
  return new Date(value);
}

// ── formatDate ────────────────────────────────────────────────────────────────

/**
 * Formats a date value using a `date-fns` format string.
 *
 * @param value - A `Date`, ISO 8601 string, or Unix timestamp (ms).
 * @param fmt - A `date-fns` format pattern. Defaults to `"PPP"` (e.g. "May 19, 2026").
 * @returns The formatted date string, or `"—"` if the date is invalid.
 *
 * @see https://date-fns.org/v4/docs/format
 *
 * @example
 * formatDate(new Date("2026-05-19"));            // → "May 19th, 2026"
 * formatDate("2026-05-19", "yyyy-MM-dd");         // → "2026-05-19"
 * formatDate("2026-05-19T10:30:00", "hh:mm a");  // → "10:30 AM"
 */
export function formatDate(value: Date | string | number, fmt = "PPP"): string {
  const date = toDate(value);
  if (!isValid(date)) return "—";
  return format(date, fmt);
}

// ── formatRelative ────────────────────────────────────────────────────────────

/**
 * Returns a human-readable relative time string (e.g. "2 hours ago", "in 3 days").
 * Uses `date-fns/formatDistanceToNow` internally.
 *
 * @param value - A `Date`, ISO 8601 string, or Unix timestamp (ms).
 * @param addSuffix - Whether to append "ago" / "in". Defaults to `true`.
 * @returns A relative time string, or `"—"` if the date is invalid.
 *
 * @example
 * formatRelative(new Date(Date.now() - 7200_000));  // → "2 hours ago"
 * formatRelative(new Date(Date.now() + 86400_000)); // → "in 1 day"
 */
export function formatRelative(value: Date | string | number, addSuffix = true): string {
  const date = toDate(value);
  if (!isValid(date)) return "—";
  return formatDistanceToNow(date, { addSuffix });
}

// ── isValidDate ───────────────────────────────────────────────────────────────

/**
 * Type guard that returns `true` if the value is a valid `Date` or a string/number
 * that can be parsed into one.
 *
 * @param value - Any value to test.
 * @returns `true` if the value represents a valid date.
 *
 * @example
 * isValidDate(new Date());        // → true
 * isValidDate("2026-05-19");      // → true
 * isValidDate("not-a-date");      // → false
 * isValidDate(null);              // → false
 */
export function isValidDate(value: unknown): value is Date | string | number {
  if (value === null || value === undefined) return false;
  const date = toDate(value as Date | string | number);
  return isValid(date);
}
