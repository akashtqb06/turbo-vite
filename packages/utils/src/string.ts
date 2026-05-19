/**
 * @module @repo/utils/string
 *
 * String manipulation utilities — pure functions, no side-effects, no React dependency.
 * All functions are fully typed and tree-shakeable.
 */

// ── truncate ──────────────────────────────────────────────────────────────────

/**
 * Truncates a string to the specified maximum character length,
 * appending an ellipsis character if the string was shortened.
 *
 * @param str - The input string to truncate.
 * @param max - Maximum number of characters before truncation occurs.
 * @param ellipsis - The suffix appended when truncation happens. Defaults to `"…"`.
 * @returns The (possibly truncated) string.
 *
 * @example
 * truncate("Hello, world!", 5);       // → "Hello…"
 * truncate("Short", 100);             // → "Short"
 * truncate("Test", 4, "...");         // → "Test"
 */
export function truncate(str: string, max: number, ellipsis = "…"): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + ellipsis;
}

// ── slugify ───────────────────────────────────────────────────────────────────

/**
 * Converts a string into a URL-safe slug.
 * Strips accents, lowercases, replaces spaces/special chars with hyphens,
 * and removes consecutive or leading/trailing hyphens.
 *
 * @param str - The string to slugify (e.g. a page title or product name).
 * @returns A lowercase, hyphen-separated slug safe for use in URLs.
 *
 * @example
 * slugify("Hello World!");        // → "hello-world"
 * slugify("Ångström & Physics");  // → "angstrom-physics"
 * slugify("  --Multiple---  ");   // → "multiple"
 */
export function slugify(str: string): string {
  return str
    .normalize("NFD")                   // decompose accented chars (é → e + ́)
    .replace(/[\u0300-\u036f]/g, "")    // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")      // keep only alphanumeric, spaces, hyphens
    .trim()
    .replace(/[\s_-]+/g, "-")          // collapse whitespace/underscores to single hyphen
    .replace(/^-+|-+$/g, "");          // strip leading/trailing hyphens
}

// ── capitalize ────────────────────────────────────────────────────────────────

/**
 * Capitalizes the first character of a string. Does not modify the rest.
 *
 * @param str - The input string.
 * @returns The string with its first character uppercased.
 *
 * @example
 * capitalize("hello world");  // → "Hello world"
 * capitalize("HELLO");        // → "HELLO"
 * capitalize("");             // → ""
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── camelToKebab ─────────────────────────────────────────────────────────────

/**
 * Converts a camelCase or PascalCase string to kebab-case.
 *
 * @param str - A camelCase or PascalCase string.
 * @returns The kebab-case equivalent.
 *
 * @example
 * camelToKebab("myVariableName");  // → "my-variable-name"
 * camelToKebab("APIResponse");     // → "api-response"
 */
export function camelToKebab(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")  // handle sequences: APIResponse → API-Response
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")        // handle boundaries: myVar → my-Var
    .toLowerCase();
}

// ── stripHtml ─────────────────────────────────────────────────────────────────

/**
 * Strips all HTML tags from a string, returning plain text.
 * Does NOT sanitize against XSS — use a proper sanitizer if rendering HTML.
 *
 * @param html - A string potentially containing HTML markup.
 * @returns The string with all HTML tags removed.
 *
 * @example
 * stripHtml("<p>Hello <b>World</b></p>");  // → "Hello World"
 * stripHtml("No tags here");               // → "No tags here"
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// ── initials ──────────────────────────────────────────────────────────────────

/**
 * Extracts initials from a full name string (up to `max` characters).
 *
 * @param name - A full name, e.g. `"Jane Doe"` or `"Alice B. Cooper"`.
 * @param max - Maximum number of initials to return. Defaults to `2`.
 * @returns The uppercase initials string.
 *
 * @example
 * initials("Jane Doe");          // → "JD"
 * initials("Alice B. Cooper");   // → "AC"
 * initials("Single");            // → "S"
 * initials("Alice Bob Charlie", 3); // → "ABC"
 */
export function initials(name: string, max = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
