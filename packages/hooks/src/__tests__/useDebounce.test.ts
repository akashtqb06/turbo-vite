/**
 * Unit tests for `@repo/hooks/useDebounce`.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(()  => { vi.useRealTimers(); });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update the value before the delay expires", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    expect(result.current).toBe("a"); // still the old value
  });

  it("updates the value after the delay expires", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("b");
  });

  it("resets the timer when value changes before delay expires", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(100)); // partial advance
    rerender({ value: "c" });              // value changes again — timer resets
    act(() => vi.advanceTimersByTime(200)); // not enough time after reset
    expect(result.current).toBe("a");      // still original

    act(() => vi.advanceTimersByTime(100)); // now 300ms since last change
    expect(result.current).toBe("c");
  });

  it("uses 300ms as the default delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: "start" } },
    );

    rerender({ value: "end" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("start");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("end");
  });
});
