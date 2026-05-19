/**
 * Tests for `packages/ui/hooks/use-mobile`.
 *
 * Since `useIsMobile` now delegates to `@repo/hooks/useMediaQuery`,
 * we mock matchMedia's `matches` property and trigger the listener
 * via a proper MediaQueryListEvent, not window.innerWidth.
 */

import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "../use-mobile";

function MobileState() {
  const isMobile = useIsMobile();
  return <div data-testid="mobile-state">{String(isMobile)}</div>;
}

describe("packages/ui/hooks/use-mobile", () => {
  let capturedListener: ((e: Partial<MediaQueryListEvent>) => void) | undefined;

  beforeEach(() => {
    capturedListener = undefined;

    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn((_event: string, fn: (e: Partial<MediaQueryListEvent>) => void) => {
          capturedListener = fn;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  it("returns false when matchMedia.matches is false (desktop)", () => {
    render(<MobileState />);
    expect(screen.getByTestId("mobile-state")).toHaveTextContent("false");
  });

  it("returns true when matchMedia.matches is true (mobile)", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: true, // simulate mobile viewport
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );

    render(<MobileState />);
    expect(screen.getByTestId("mobile-state")).toHaveTextContent("true");
  });

  it("updates reactively when the media query listener fires", () => {
    const { unmount } = render(<MobileState />);
    expect(screen.getByTestId("mobile-state")).toHaveTextContent("false");

    // Fire the change event with matches=true (simulates viewport narrowing)
    act(() => {
      capturedListener?.({ matches: true } as Partial<MediaQueryListEvent>);
    });

    expect(screen.getByTestId("mobile-state")).toHaveTextContent("true");
    unmount();
  });
});
