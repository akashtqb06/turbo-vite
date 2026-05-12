import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("cmdk", () => {
  const Command = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  );

  Command.Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  );
  Command.List = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  );
  Command.Empty = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  );
  Command.Group = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  );
  Command.Separator = (props: React.HTMLAttributes<HTMLHRElement>) => <hr {...props} />;
  Command.Item = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  );

  return { Command };
});

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: () => <svg data-testid="huge-icon" />,
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  SearchIcon: {},
  Tick02Icon: {},
}));

vi.mock("../dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({
    children,
    showCloseButton,
  }: {
    children: React.ReactNode;
    showCloseButton?: boolean;
  }) => (
    <div data-testid="dialog-content" data-show-close-button={String(Boolean(showCloseButton))}>
      {children}
    </div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

vi.mock("../input-group", () => ({
  InputGroup: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  InputGroupAddon: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../command";

describe("packages/ui/components/ui/command", () => {
  it("renders the command input stack and the composable command slots", () => {
    render(
      <Command>
        <CommandInput placeholder="Search commands" />
        <CommandList>
          <CommandEmpty>No commands</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem data-checked="true">
              Open
              <CommandShortcut>Ctrl+K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>
    );

    expect(screen.getByPlaceholderText("Search commands")).toHaveAttribute(
      "data-slot",
      "command-input"
    );
    expect(screen.getByText("No commands")).toHaveAttribute(
      "data-slot",
      "command-empty"
    );
    expect(screen.getByText("Open")).toHaveAttribute("data-slot", "command-item");
    expect(screen.getByText("Ctrl+K")).toHaveAttribute(
      "data-slot",
      "command-shortcut"
    );
    expect(screen.getAllByTestId("huge-icon").length).toBeGreaterThan(0);
  });

  it("renders the command dialog with its default accessible title and description", () => {
    render(
      <CommandDialog open showCloseButton>
        <div>Palette content</div>
      </CommandDialog>
    );

    expect(screen.getByText("Command Palette")).toBeInTheDocument();
    expect(screen.getByText("Search for a command to run...")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-content")).toHaveAttribute(
      "data-show-close-button",
      "true"
    );
    expect(screen.getByText("Palette content")).toBeInTheDocument();
  });
});
