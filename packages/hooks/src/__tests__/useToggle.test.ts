/**
 * Unit tests for `@repo/hooks/useToggle`.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToggle } from "../useToggle";

describe("useToggle", () => {
  it("starts with the provided initial value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  it("defaults to false when no initial value is provided", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });

  it("toggle() flips the value", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.toggle());
    expect(result.current.value).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.value).toBe(false);
  });

  it("setTrue() sets value to true", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.setTrue());
    expect(result.current.value).toBe(true);
    // Idempotent
    act(() => result.current.setTrue());
    expect(result.current.value).toBe(true);
  });

  it("setFalse() sets value to false", () => {
    const { result } = renderHook(() => useToggle(true));
    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);
    // Idempotent
    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);
  });

  it("set() accepts an explicit boolean", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.set(true));
    expect(result.current.value).toBe(true);
    act(() => result.current.set(false));
    expect(result.current.value).toBe(false);
  });
});
