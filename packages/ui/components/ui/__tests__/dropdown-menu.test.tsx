import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("radix-ui", () => ({
  DropdownMenu: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      children: React.ReactNode;
    }) => <button {...props}>{children}</button>,
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
    Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Item: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    CheckboxItem: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    RadioGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    RadioItem: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    Label: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    Separator: (props: React.HTMLAttributes<HTMLHRElement>) => <hr {...props} />,
    ItemIndicator: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Sub: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SubTrigger: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    SubContent: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: () => <svg data-testid="huge-icon" />,
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  Tick02Icon: {},
  ArrowRight01Icon: {},
}));

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../dropdown-menu";

describe("packages/ui/components/ui/dropdown-menu", () => {
  it("renders menu wrappers, indicators, and submenu content with the expected defaults", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem inset variant="destructive">
              Delete
              <DropdownMenuShortcut>Del</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>Pin</DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value="light">
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>Sub content</DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "data-slot",
      "dropdown-menu-trigger"
    );
    expect(screen.getByText("Delete")).toHaveAttribute(
      "data-variant",
      "destructive"
    );
    expect(screen.getByText("Delete")).toHaveAttribute("data-inset", "true");
    expect(screen.getByText("Del")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-shortcut"
    );
    expect(screen.getByText("Actions")).toHaveAttribute("data-inset", "true");
    expect(screen.getByText("Delete").closest("[data-slot='dropdown-menu-content']")).toHaveAttribute(
      "data-align",
      "start"
    );
    expect(screen.getByText("Delete").closest("[data-slot='dropdown-menu-content']")).toHaveAttribute(
      "data-side-offset",
      "4"
    );
    expect(screen.getByText("Sub content")).toHaveAttribute(
      "data-slot",
      "dropdown-menu-sub-content"
    );
    expect(screen.getAllByTestId("huge-icon").length).toBeGreaterThan(0);
  });
});
