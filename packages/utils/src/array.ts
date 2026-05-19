/**
 * @module @repo/utils/array
 *
 * Type-safe array utilities. All functions are pure (no mutation) and
 * preserve generic TypeScript types. No React dependency.
 */

// ── groupBy ───────────────────────────────────────────────────────────────────

/**
 * Groups an array of objects by a string key, returning a `Map` of groups.
 *
 * @param arr - The array to group.
 * @param getKey - A function that returns the group key for each item.
 * @returns A `Map` where each key maps to an array of matching items.
 *
 * @example
 * const users = [{ role: "admin", name: "A" }, { role: "user", name: "B" }];
 * const byRole = groupBy(users, u => u.role);
 * byRole.get("admin");  // → [{ role: "admin", name: "A" }]
 */
export function groupBy<T>(arr: T[], getKey: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of arr) {
    const key = getKey(item);
    const existing = map.get(key) ?? [];
    map.set(key, [...existing, item]);
  }
  return map;
}

// ── uniqueBy ──────────────────────────────────────────────────────────────────

/**
 * Returns a new array with duplicates removed, using a key function to
 * determine uniqueness. First occurrence wins.
 *
 * @param arr - The input array (not mutated).
 * @param getKey - A function returning a comparable key for each item.
 * @returns A new array containing only unique items (by key).
 *
 * @example
 * uniqueBy([{ id: 1, v: "a" }, { id: 1, v: "b" }, { id: 2, v: "c" }], x => x.id);
 * // → [{ id: 1, v: "a" }, { id: 2, v: "c" }]
 */
export function uniqueBy<T>(arr: T[], getKey: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  return arr.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── chunk ─────────────────────────────────────────────────────────────────────

/**
 * Splits an array into sub-arrays ("chunks") of the given size.
 * The last chunk may be smaller than `size` if the array length is not evenly divisible.
 *
 * @param arr - The input array.
 * @param size - The maximum size of each chunk. Must be a positive integer.
 * @returns An array of chunks.
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2);  // → [[1, 2], [3, 4], [5]]
 * chunk([], 3);                // → []
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) throw new RangeError("chunk: size must be a positive integer");
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ── sortBy ────────────────────────────────────────────────────────────────────

/**
 * Returns a sorted copy of an array, ordering items by a derived key.
 * Does NOT mutate the original array.
 *
 * @param arr - The input array.
 * @param getKey - A function returning the sort key for each item.
 * @param direction - Sort direction: `"asc"` (default) or `"desc"`.
 * @returns A new, sorted array.
 *
 * @example
 * sortBy([{ name: "Charlie" }, { name: "Alice" }], x => x.name);
 * // → [{ name: "Alice" }, { name: "Charlie" }]
 *
 * sortBy([{ age: 20 }, { age: 30 }], x => x.age, "desc");
 * // → [{ age: 30 }, { age: 20 }]
 */
export function sortBy<T>(
  arr: T[],
  getKey: (item: T) => string | number,
  direction: "asc" | "desc" = "asc",
): T[] {
  return [...arr].sort((a, b) => {
    const keyA = getKey(a);
    const keyB = getKey(b);
    if (keyA < keyB) return direction === "asc" ? -1 : 1;
    if (keyA > keyB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

// ── last ──────────────────────────────────────────────────────────────────────

/**
 * Returns the last element of an array, or `undefined` if the array is empty.
 *
 * @param arr - The input array.
 * @returns The last element, or `undefined`.
 *
 * @example
 * last([1, 2, 3]);  // → 3
 * last([]);          // → undefined
 */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
