/**
 * @module @repo/utils/url
 *
 * URL and query string utilities. Typed wrappers around the browser's
 * `URLSearchParams` and `URL` APIs for safe, predictable URL manipulation.
 * No React dependency.
 */

// ── parseSearchParams ─────────────────────────────────────────────────────────

/**
 * Converts a `URLSearchParams` instance (or a raw query string) into a
 * plain `Record<string, string>`.
 *
 * Multi-value keys (e.g. `?tag=a&tag=b`) are collapsed to the LAST value.
 * For multi-value support, use `parseSearchParamsMulti`.
 *
 * @param params - A `URLSearchParams`, a query string (with or without `?`), or a URL.
 * @returns A flat string-to-string map of all query parameters.
 *
 * @example
 * parseSearchParams("?page=2&limit=10");  // → { page: "2", limit: "10" }
 * parseSearchParams(new URLSearchParams("q=hello&sort=desc"));
 * // → { q: "hello", sort: "desc" }
 */
export function parseSearchParams(
  params: URLSearchParams | string,
): Record<string, string> {
  const sp =
    typeof params === "string"
      ? new URLSearchParams(params.startsWith("?") ? params.slice(1) : params)
      : params;

  const result: Record<string, string> = {};
  sp.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// ── parseSearchParamsMulti ────────────────────────────────────────────────────

/**
 * Like `parseSearchParams`, but preserves multi-value keys as arrays.
 *
 * @param params - A `URLSearchParams` or query string.
 * @returns A map where each key holds an array of its values.
 *
 * @example
 * parseSearchParamsMulti("tag=a&tag=b&page=1");
 * // → { tag: ["a", "b"], page: ["1"] }
 */
export function parseSearchParamsMulti(
  params: URLSearchParams | string,
): Record<string, string[]> {
  const sp =
    typeof params === "string"
      ? new URLSearchParams(params.startsWith("?") ? params.slice(1) : params)
      : params;

  const result: Record<string, string[]> = {};
  sp.forEach((value, key) => {
    if (!result[key]) result[key] = [];
    result[key].push(value);
  });
  return result;
}

// ── buildQueryString ──────────────────────────────────────────────────────────

/**
 * Serialises a plain object into a URL query string (without the leading `?`).
 * `null` and `undefined` values are omitted. Arrays are expanded into repeated keys.
 *
 * @param obj - The parameters to serialise.
 * @returns A query string (e.g. `"page=2&sort=name"`).
 *
 * @example
 * buildQueryString({ page: 2, sort: "name", tag: ["a", "b"] });
 * // → "page=2&sort=name&tag=a&tag=b"
 *
 * buildQueryString({ q: "hello", empty: null });
 * // → "q=hello"
 */
export function buildQueryString(
  obj: Record<string, string | number | boolean | null | undefined | (string | number)[]>,
): string {
  const sp = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      for (const v of value) {
        sp.append(key, String(v));
      }
    } else {
      sp.set(key, String(value));
    }
  }

  return sp.toString();
}

// ── joinPaths ─────────────────────────────────────────────────────────────────

/**
 * Joins URL path segments, normalising slashes between them.
 * Does not touch the protocol or query string.
 *
 * @param segments - Path segments to join.
 * @returns A single `/`-separated path string.
 *
 * @example
 * joinPaths("/api", "users/", "/profile"); // → "/api/users/profile"
 */
export function joinPaths(...segments: string[]): string {
  return segments
    .map((s) => s.replace(/^\/+|\/+$/g, "")) // strip leading/trailing slashes
    .filter(Boolean)
    .join("/");
}
