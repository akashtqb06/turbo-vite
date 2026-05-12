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
  Separator: {
    Root: (props: React.HTMLAttributes<HTMLDivElement> & { orientation?: string; decorative?: boolean }) => (
      <div {...props} />
    ),
  },
}));

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="huge-icon" {...props} />
  ),
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  ArrowRight01Icon: {},
  MoreHorizontalCircle01Icon: {},
  ArrowLeft01Icon: {},
  ArrowRight01Icon: {},
}));

vi.mock("../button", () => ({
  Button: ({
    children,
    asChild,
    variant,
    size,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    asChild?: boolean;
    variant?: string;
    size?: string;
  }) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        ...props,
        "data-button-variant": variant,
        "data-button-size": size,
      });
    }

    return (
      <button data-button-size={size} data-button-variant={variant} {...props}>
        {children}
      </button>
    );
  },
}));

vi.mock("../../lib/icons", () => ({
  DEFAULT_ICON_NAME: "Circle",
  resolveIconDefinition: vi.fn((name?: string | null) => {
    if (name === "rocket") {
      return {
        name: "rocket",
        Icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg data-testid="rocket-icon" {...props} />
        ),
      };
    }

    if (name === "Circle") {
      return {
        name: "Circle",
        Icon: (props: React.SVGProps<SVGSVGElement>) => (
          <svg data-testid="circle-icon" {...props} />
        ),
      };
    }

    return null;
  }),
}));

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "../alert";
import { Badge } from "../badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../breadcrumb";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "../button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { DynamicIcon } from "../dynamic-icon";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../empty";
import { Kbd, KbdGroup } from "../kbd";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";
import { Skeleton } from "../skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Textarea } from "../textarea";

describe("packages/ui/components/ui layout primitives", () => {
  it("renders alert slots with the destructive variant", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Alert title</AlertTitle>
        <AlertDescription>Alert body</AlertDescription>
        <AlertAction>Retry</AlertAction>
      </Alert>
    );

    expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "alert");
    expect(screen.getByText("Alert title")).toHaveAttribute(
      "data-slot",
      "alert-title"
    );
    expect(screen.getByText("Alert body")).toHaveAttribute(
      "data-slot",
      "alert-description"
    );
    expect(screen.getByText("Retry")).toHaveAttribute(
      "data-slot",
      "alert-action"
    );
  });

  it("renders badge and breadcrumb wrappers, including asChild and ellipsis helpers", () => {
    render(
      <div>
        <Badge asChild variant="secondary">
          <a href="/status">Status</a>
        </Badge>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );

    expect(screen.getByRole("link", { name: "Status" })).toHaveAttribute(
      "data-slot",
      "badge"
    );
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toHaveAttribute(
      "data-slot",
      "breadcrumb"
    );
    expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("More")).toBeInTheDocument();
    expect(screen.getAllByTestId("huge-icon").length).toBeGreaterThan(0);
  });

  it("renders button group and card slot helpers", () => {
    render(
      <div>
        <ButtonGroup orientation="vertical">
          <ButtonGroupText asChild>
            <span>Text</span>
          </ButtonGroupText>
          <ButtonGroupSeparator />
        </ButtonGroup>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Body</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      </div>
    );

    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Card title").closest("[data-slot='card']")).toHaveAttribute(
      "data-size",
      "sm"
    );
    expect(screen.getByText("Action")).toHaveAttribute("data-slot", "card-action");
    expect(screen.getByText("Footer")).toHaveAttribute("data-slot", "card-footer");
  });

  it("renders empty, kbd, skeleton, table, and textarea helpers", () => {
    render(
      <div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <svg />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>Nothing here yet.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>Call to action</EmptyContent>
        </Empty>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <Skeleton className="h-4 w-4" />
        <Table>
          <TableCaption>Table caption</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Row value</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer value</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Textarea placeholder="Description" />
      </div>
    );

    expect(screen.getByText("No data")).toHaveAttribute("data-slot", "empty-title");
    expect(screen.getByText("Call to action")).toHaveAttribute(
      "data-slot",
      "empty-content"
    );
    expect(screen.getByText("Ctrl")).toHaveAttribute("data-slot", "kbd");
    expect(document.querySelector("[data-slot='skeleton']")).toHaveClass("animate-pulse");
    expect(screen.getByText("Table caption")).toHaveAttribute(
      "data-slot",
      "table-caption"
    );
    expect(screen.getByText("Row value")).toHaveAttribute("data-slot", "table-cell");
    expect(screen.getByPlaceholderText("Description")).toHaveAttribute(
      "data-slot",
      "textarea"
    );
  });

  it("renders pagination links and dynamic icons", () => {
    render(
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#prev" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#1" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#next" />
            </PaginationItem>
          </PaginationContent>
          <PaginationEllipsis />
        </Pagination>
        <DynamicIcon icon="rocket" aria-label="Rocket" />
        <DynamicIcon icon="missing" aria-label="Fallback" />
      </div>
    );

    expect(screen.getByRole("navigation", { name: "pagination" })).toHaveAttribute(
      "data-slot",
      "pagination"
    );
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "data-button-size",
      "default"
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByText("More pages")).toBeInTheDocument();
    expect(screen.getByLabelText("Rocket")).toHaveClass("lucide-rocket");
    expect(screen.getByLabelText("Fallback")).toHaveClass("lucide-circle");
  });
});
