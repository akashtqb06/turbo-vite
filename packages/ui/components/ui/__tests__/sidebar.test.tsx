import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useIsMobileMock = vi.hoisted(() => vi.fn());
const tooltipState = vi.hoisted(() => ({
  lastHidden: undefined as boolean | undefined,
}));

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

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: () => <svg data-testid="huge-icon" />,
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  SidebarLeftIcon: {},
}));

vi.mock("../../../hooks/use-mobile", () => ({
  useIsMobile: () => useIsMobileMock(),
}));

vi.mock("../button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("../input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock("../separator", () => ({
  Separator: () => <hr />,
}));

vi.mock("../sheet", () => ({
  Sheet: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
  }) => <div data-testid="sheet" data-open={String(Boolean(open))}>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => <div className={className} />,
}));

vi.mock("../tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({
    children,
    hidden,
  }: {
    children: React.ReactNode;
    hidden?: boolean;
  }) => {
    tooltipState.lastHidden = hidden;
    return <div>{children}</div>;
  },
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "../sidebar";

function SidebarStateConsumer() {
  const { state } = useSidebar();
  return <div data-testid="sidebar-state">{state}</div>;
}

describe("packages/ui/components/ui/sidebar", () => {
  beforeEach(() => {
    useIsMobileMock.mockReset();
    useIsMobileMock.mockReturnValue(false);
    tooltipState.lastHidden = undefined;
    document.cookie = "";
  });

  it("throws when useSidebar is called outside the provider", () => {
    function BrokenConsumer() {
      useSidebar();
      return null;
    }

    expect(() => render(<BrokenConsumer />)).toThrow(
      "useSidebar must be used within a SidebarProvider."
    );
  });

  it("toggles desktop sidebar state through the trigger and keyboard shortcut", () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <SidebarStateConsumer />
      </SidebarProvider>
    );

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");

    fireEvent.click(screen.getByRole("button", { name: /toggle sidebar/i }));
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed");
    expect(document.cookie).toContain("sidebar_state=false");

    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
  });

  it("renders mobile and non-collapsible sidebar branches", () => {
    useIsMobileMock.mockReturnValueOnce(true);

    const mobile = render(
      <SidebarProvider>
        <Sidebar>Mobile content</Sidebar>
      </SidebarProvider>
    );

    expect(mobile.getByTestId("sheet")).toHaveAttribute("data-open", "false");
    mobile.unmount();

    render(
      <SidebarProvider>
        <Sidebar collapsible="none">Desktop content</Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText("Desktop content")).toBeInTheDocument();
  });

  it("uses tooltip visibility only when collapsed on desktop and allows rail toggling", () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <SidebarMenuButton tooltip="Tip">Item</SidebarMenuButton>
        <SidebarRail />
        <SidebarStateConsumer />
      </SidebarProvider>
    );

    expect(tooltipState.lastHidden).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: /toggle sidebar/i }));
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
  });

  it("renders the remaining sidebar building blocks and icon skeleton state", () => {
    render(
      <SidebarProvider>
        <SidebarInset>Inset</SidebarInset>
        <Sidebar>
          <SidebarHeader>
            <SidebarInput aria-label="Sidebar search" />
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <span>Projects</span>
              </SidebarGroupLabel>
              <SidebarGroupAction asChild>
                <button type="button">Add</button>
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Overview</SidebarMenuButton>
                    <SidebarMenuAction showOnHover>More</SidebarMenuAction>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenu>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild size="sm" isActive>
                      <a href="/nested">Nested</a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Footer</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByText("Inset")).toHaveAttribute("data-slot", "sidebar-inset");
    expect(screen.getByLabelText("Sidebar search")).toHaveAttribute(
      "data-slot",
      "sidebar-input"
    );
    expect(screen.getByText("Projects")).toHaveAttribute(
      "data-slot",
      "sidebar-group-label"
    );
    expect(screen.getByRole("button", { name: "Add" })).toHaveAttribute(
      "data-slot",
      "sidebar-group-action"
    );
    expect(screen.getByText("Overview")).toHaveAttribute(
      "data-active",
      "true"
    );
    expect(screen.getByText("More")).toHaveAttribute(
      "data-slot",
      "sidebar-menu-action"
    );
    expect(screen.getByText("3")).toHaveAttribute(
      "data-slot",
      "sidebar-menu-badge"
    );
    expect(document.querySelector("[data-slot='sidebar-menu-skeleton']")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nested" })).toHaveAttribute(
      "data-slot",
      "sidebar-menu-sub-button"
    );
    expect(screen.getByText("Footer")).toHaveAttribute(
      "data-slot",
      "sidebar-footer"
    );
  });
});
