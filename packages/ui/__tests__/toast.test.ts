import { beforeEach, describe, expect, it, vi } from "vitest";

const toastFns = vi.hoisted(() => ({
  info: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  loading: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: toastFns,
}));

import { APP_TOAST_EVENT, emitAppToast, showToast } from "../lib/toast";

describe("packages/ui/lib/toast", () => {
  beforeEach(() => {
    Object.values(toastFns).forEach((fn) => fn.mockReset());
  });

  it("routes each toast type to the matching sonner helper", () => {
    showToast({ type: "success", title: "Saved", description: "Done", duration: 3000 });
    showToast({ type: "error", description: "Broken" });
    showToast({ type: "warning", description: "Heads up" });
    showToast({ type: "loading", title: "Working" });
    showToast({});

    expect(toastFns.success).toHaveBeenCalledWith("Saved", {
      description: "Done",
      duration: 3000,
    });
    expect(toastFns.error).toHaveBeenCalledWith("Broken", { duration: undefined });
    expect(toastFns.warning).toHaveBeenCalledWith("Heads up", { duration: undefined });
    expect(toastFns.loading).toHaveBeenCalledWith("Working", {
      duration: undefined,
    });
    expect(toastFns.info).toHaveBeenCalledWith("Notification", {
      duration: undefined,
    });
  });

  it("dispatches app toast events in the browser", () => {
    const listener = vi.fn();
    window.addEventListener(APP_TOAST_EVENT, listener as EventListener);

    emitAppToast({ type: "info", description: "Hello" });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(
      (listener.mock.calls[0]?.[0] as CustomEvent<{ description: string }>).detail
    ).toEqual({
      type: "info",
      description: "Hello",
    });
  });
});
