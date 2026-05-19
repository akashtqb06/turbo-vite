/**
 * @module @repo/utils/object
 *
 * Type-safe object manipulation utilities.
 * All functions preserve TypeScript types through generics.
 * No React dependency — safe for use in reducers, services, and scripts.
 */

// ── pick ──────────────────────────────────────────────────────────────────────

/**
 * Creates a new object with only the specified keys picked from the source.
 * The return type is precisely typed as `Pick<T, K>`.
 *
 * @param obj - The source object.
 * @param keys - Array of keys to include in the result.
 * @returns A new object containing only the picked keys.
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ["a", "c"]);  // → { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

// ── omit ──────────────────────────────────────────────────────────────────────

/**
 * Creates a new object with the specified keys excluded.
 * The return type is precisely typed as `Omit<T, K>`.
 *
 * @param obj - The source object.
 * @param keys - Array of keys to exclude from the result.
 * @returns A new object without the omitted keys.
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ["b"]);  // → { a: 1, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj } as Omit<T, K>;
  for (const key of keys) {
    delete (result as Record<string, unknown>)[key as string];
  }
  return result;
}

// ── deepClone ─────────────────────────────────────────────────────────────────

/**
 * Creates a deep clone of a value using `structuredClone`.
 * Preserves the TypeScript type of the input.
 *
 * Note: Functions, Symbols, WeakMaps and DOM nodes are NOT cloneable.
 * Use only for plain data (objects, arrays, primitives, Dates, Maps, Sets).
 *
 * @param value - The value to deep clone.
 * @returns A structurally identical but reference-independent copy.
 *
 * @example
 * const original = { a: { b: 1 } };
 * const clone = deepClone(original);
 * clone.a.b = 999;
 * original.a.b;  // → 1 (unchanged)
 */
export function deepClone<T>(value: T): T {
  return structuredClone(value);
}

// ── flattenObject ─────────────────────────────────────────────────────────────

/**
 * Flattens a nested object into a dot-notation key map.
 * Useful for form initial values, URL params, and analytics events.
 *
 * @param obj - The object to flatten.
 * @param prefix - Optional prefix prepended to all keys (used in recursion).
 * @returns A flat `Record<string, unknown>` with dot-separated keys.
 *
 * @example
 * flattenObject({ a: { b: { c: 1 } }, d: 2 });
 * // → { "a.b.c": 1, "d": 2 }
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      // Recurse into nested objects
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}
