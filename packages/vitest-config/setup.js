/**
 * @repo/vitest-config — global test setup
 *
 * Runs once per test worker before any test file is loaded.
 *
 * Provides:
 * 1. @testing-library/jest-dom matchers on vitest's expect
 * 2. jsdom browser API polyfills (matchMedia, ResizeObserver, etc.)
 * 3. React @testing-library cleanup after each test
 * 4. Mock reset between tests
 */

// ── 1. jest-dom matchers ──────────────────────────────────────────────────────
import "@testing-library/jest-dom/vitest";

import { vi, afterEach } from "vitest";

// ── 2. React cleanup ─────────────────────────────────────────────────────────
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cleanup } = require("@testing-library/react");
  afterEach(() => cleanup());
} catch {
  // @testing-library/react not installed in this package — skip
}

// ── 3. jsdom polyfills ────────────────────────────────────────────────────────

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener:         vi.fn(),
      removeListener:      vi.fn(),
      addEventListener:    vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent:       vi.fn(),
    })),
  });
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn(),
  }));
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn(),
    root: null, rootMargin: "", thresholds: [],
  }));
}

if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

// ── 4. Reset mocks ────────────────────────────────────────────────────────────
afterEach(() => {
  vi.clearAllMocks();
});
