import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("radix-ui", () => ({
  Popover: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children: React.ReactNode;
    }) => <button {...props}>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({
      children,
      align,
      sideOffset,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      children: React.ReactNode;
      align?: string;
      sideOffset?: number;
    }) => (
      <div
        data-align={align}
        data-side-offset={String(sideOffset)}
        {...props}
      >
        {children}
      </div>
    ),
    Anchor: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../popover";

describe("packages/ui/components/ui/popover", () => {
  it("renders trigger, content, and header helpers with the default content offsets", () => {
    render(
      <Popover>
        <PopoverAnchor>
          <span>Anchor</span>
        </PopoverAnchor>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover title</PopoverTitle>
            <PopoverDescription>Popover description</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByRole("button", { name: "Open popover" })).toHaveAttribute(
      "data-slot",
      "popover-trigger"
    );
    expect(screen.getByText("Popover title")).toHaveAttribute(
      "data-slot",
      "popover-title"
    );
    expect(screen.getByText("Popover description")).toHaveAttribute(
      "data-slot",
      "popover-description"
    );
    expect(screen.getByText("Popover title").closest("[data-slot='popover-content']")).toHaveAttribute(
      "data-align",
      "center"
    );
    expect(screen.getByText("Popover title").closest("[data-slot='popover-content']")).toHaveAttribute(
      "data-side-offset",
      "4"
    );
  });
});
