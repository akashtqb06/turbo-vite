/**
 * Demo-app specific test setup.
 *
 * The shared `@repo/vitest-config/setup` already handles:
 * - @testing-library/jest-dom matchers
 * - matchMedia / ResizeObserver / IntersectionObserver polyfills
 * - afterEach cleanup + mock reset
 *
 * This file adds any demo-app-specific overrides on top.
 * Keep it minimal — prefer adding shared concerns to @repo/vitest-config/setup.
 */

// Re-assert the matchMedia mock with `vi.stubGlobal` so per-test overrides
// (e.g. in use-mobile.test.tsx) can safely call `vi.stubGlobal` themselves.
// The shared setup uses Object.defineProperty which can't be re-assigned.
import { vi } from "vitest";

vi.stubGlobal(
  "matchMedia",
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener:         vi.fn(),
    removeListener:      vi.fn(),
    addEventListener:    vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent:       vi.fn(),
  })),
);
