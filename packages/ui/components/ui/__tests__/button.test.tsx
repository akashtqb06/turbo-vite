import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("radix-ui", () => ({
  Slot: {
    Root: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) =>
      React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement, props)
        : children,
  },
}));

import { Button } from "../button";

describe("packages/ui/components/ui/button", () => {
  it("renders a native button with its data attributes and variant classes", () => {
    render(
      <Button disabled size="lg" variant="destructive">
        Delete
      </Button>
    );

    const button = screen.getByRole("button", { name: "Delete" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveAttribute("data-variant", "destructive");
    expect(button.className).toContain("bg-destructive");
  });

  it("supports asChild rendering while preserving the child element", () => {
    render(
      <Button asChild variant="link">
        <a href="/docs">Docs</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: "Docs" });

    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).toHaveAttribute("data-variant", "link");
  });
});
