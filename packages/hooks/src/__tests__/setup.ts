/**
 * Vitest test setup for @repo/hooks.
 * Polyfills jsdom with browser APIs used by the hooks under test.
 */

import { vi } from "vitest";

// matchMedia polyfill (used by useMediaQuery / useIsMobile)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener:    vi.fn(),
    removeListener: vi.fn(),
    addEventListener:    vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent:  vi.fn(),
  })),
});
