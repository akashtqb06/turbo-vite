/**
 * @module @repo/utils/guards
 *
 * TypeScript type guard functions for runtime type narrowing.
 * Use these to eliminate `as any` casts and safely handle `unknown` values.
 * No React dependency, no side-effects.
 */

// ── Primitive guards ──────────────────────────────────────────────────────────

/**
 * Narrows `value` to `string`.
 *
 * @param value - Any value.
 * @returns `true` if `value` is a string.
 *
 * @example
 * function process(val: unknown) {
 *   if (isString(val)) return val.toUpperCase(); // val is string here
 * }
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Narrows `value` to a finite `number` (excludes `NaN` and `Infinity`).
 *
 * @param value - Any value.
 * @returns `true` if `value` is a finite number.
 *
 * @example
 * isNumber(42);       // → true
 * isNumber(NaN);      // → false
 * isNumber(Infinity); // → false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Narrows `value` to `boolean`.
 *
 * @param value - Any value.
 * @returns `true` if `value` is a boolean.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

// ── Nullability guards ────────────────────────────────────────────────────────

/**
 * Excludes `null` and `undefined` from a type.
 * Equivalent to the built-in `NonNullable<T>` but usable as a runtime guard.
 *
 * @param value - Any potentially nullable value.
 * @returns `true` if `value` is neither `null` nor `undefined`.
 *
 * @example
 * const items = [1, null, 2, undefined, 3];
 * const numbers = items.filter(isNonNullable);  // → [1, 2, 3], typed as number[]
 */
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// ── Object guards ─────────────────────────────────────────────────────────────

/**
 * Narrows `value` to a plain object (`Record<string, unknown>`).
 * Excludes arrays, `null`, class instances, and functions.
 *
 * @param value - Any value.
 * @returns `true` if `value` is a plain object literal.
 *
 * @example
 * isPlainObject({});              // → true
 * isPlainObject([]);              // → false (array)
 * isPlainObject(null);            // → false
 * isPlainObject(new MyClass());   // → false (instance)
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value) as unknown;
  return proto === Object.prototype || proto === null;
}

// ── Error guard ───────────────────────────────────────────────────────────────

/**
 * Narrows `value` to an `Error` instance.
 *
 * @param value - Any value (commonly `unknown` from a catch block).
 * @returns `true` if `value` is an instance of `Error`.
 *
 * @example
 * try { ... } catch (err) {
 *   const message = isError(err) ? err.message : "Unknown error";
 * }
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// ── Promise guard ─────────────────────────────────────────────────────────────

/**
 * Checks if a value is a thenable (duck-type Promise check).
 *
 * @param value - Any value.
 * @returns `true` if `value` has a callable `.then` property.
 */
export function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
  return isNonNullable(value) && typeof (value as Record<string, unknown>)["then"] === "function";
}
