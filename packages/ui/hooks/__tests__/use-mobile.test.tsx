import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "../use-mobile";

function MobileState() {
  const isMobile = useIsMobile();
  return <div data-testid="mobile-state">{String(isMobile)}</div>;
}

describe("packages/ui/hooks/use-mobile", () => {
  beforeEach(() => {
    let listener: (() => void) | undefined;

    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn((_event: string, nextListener: () => void) => {
          listener = nextListener;
        }),
        removeEventListener: vi.fn(),
        dispatch: () => listener?.(),
      }))
    );
  });

  it("returns the current mobile state from the viewport width", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 640,
    });

    render(<MobileState />);

    expect(screen.getByTestId("mobile-state")).toHaveTextContent("true");
  });

  it("updates when the media query listener fires", () => {
    let listener: (() => void) | undefined;
    const removeEventListener = vi.fn();

    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn((_event: string, nextListener: () => void) => {
          listener = nextListener;
        }),
        removeEventListener,
      }))
    );

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });

    const { unmount } = render(<MobileState />);

    expect(screen.getByTestId("mobile-state")).toHaveTextContent("false");

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 600,
    });
    act(() => {
      listener?.();
    });

    expect(screen.getByTestId("mobile-state")).toHaveTextContent("true");

    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });
});
