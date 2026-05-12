import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("radix-ui", () => ({
  Slider: {
    Root: ({
      children,
      min,
      max,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children: React.ReactNode;
      min?: number;
      max?: number;
    }) => (
      <div data-min={String(min)} data-max={String(max)} {...props}>
        {children}
      </div>
    ),
    Track: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    Range: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    Thumb: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
  },
}));

import { Slider } from "../slider";

describe("packages/ui/components/ui/slider", () => {
  it("renders slider defaults with two thumbs when no value is provided", () => {
    render(<Slider />);

    expect(document.querySelector("[data-slot='slider']")).toHaveAttribute(
      "data-min",
      "0"
    );
    expect(document.querySelector("[data-slot='slider']")).toHaveAttribute(
      "data-max",
      "100"
    );
    expect(document.querySelectorAll("[data-slot='slider-thumb']")).toHaveLength(2);
    expect(document.querySelector("[data-slot='slider-track']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='slider-range']")).toBeInTheDocument();
  });

  it("matches the thumb count to the controlled value array", () => {
    render(<Slider max={10} min={1} value={[3]} />);

    expect(document.querySelector("[data-slot='slider']")).toHaveAttribute(
      "data-min",
      "1"
    );
    expect(document.querySelector("[data-slot='slider']")).toHaveAttribute(
      "data-max",
      "10"
    );
    expect(document.querySelectorAll("[data-slot='slider-thumb']")).toHaveLength(1);
  });
});
