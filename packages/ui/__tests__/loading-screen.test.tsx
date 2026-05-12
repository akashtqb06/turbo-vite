import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  getFullscreenLoadingCount,
  LoadingScreen,
  subscribeToFullscreenLoading,
} from "../components/ui/loading-screen";
import { TranslationProvider } from "../components/ui/translation-provider";
import { cn } from "../lib/utils";

describe("packages/ui", () => {
  it("merges tailwind classes with cn", () => {
    expect(cn("px-2", "text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("renders the loading screen and tracks fullscreen activity", async () => {
    const counts: number[] = [];
    const unsubscribe = subscribeToFullscreenLoading((count) => counts.push(count));

    const { unmount } = render(
      <TranslationProvider>
        <LoadingScreen />
      </TranslationProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(getFullscreenLoadingCount()).toBe(1);
    });

    unmount();

    await waitFor(() => {
      expect(getFullscreenLoadingCount()).toBe(0);
    });

    expect(counts).toContain(1);
    expect(counts[counts.length - 1]).toBe(0);

    unsubscribe();
  });

  it("stays inactive when disabled and supports non-fullscreen rendering", () => {
    const inactive = render(
      <TranslationProvider>
        <LoadingScreen active={false} />
      </TranslationProvider>
    );

    expect(inactive.container).toBeEmptyDOMElement();
    expect(getFullscreenLoadingCount()).toBe(0);
    inactive.unmount();

    render(
      <TranslationProvider>
        <LoadingScreen
          fullscreen={false}
          registerFullscreenActivity={false}
          message="Saving"
          className="wrapper"
          surfaceClassName="surface"
        />
      </TranslationProvider>
    );

    const message = screen.getByText("Saving");
    const surface = message.closest("div");
    const wrapper = surface?.parentElement;

    expect(surface).toHaveClass("surface");
    expect(wrapper).toHaveClass("flex", "min-h-screen", "wrapper");
    expect(wrapper).not.toHaveClass("fixed", "inset-0");
    expect(getFullscreenLoadingCount()).toBe(0);
  });
});
