import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("radix-ui", () => ({
  Dialog: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Close: ({ children, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; asChild?: boolean }) =>
      asChild && React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement, props)
        : <button {...props}>{children}</button>,
    Overlay: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    Content: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    Title: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) => <h2 {...props}>{children}</h2>,
    Description: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) => <p {...props}>{children}</p>,
  },
  AlertDialog: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Overlay: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    Content: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    Title: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) => <h2 {...props}>{children}</h2>,
    Description: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) => <p {...props}>{children}</p>,
    Action: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Cancel: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
  },
}));

vi.mock("vaul", () => ({
  Drawer: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Close: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Overlay: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    Content: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    Title: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) => <h2 {...props}>{children}</h2>,
    Description: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) => <p {...props}>{children}</p>,
  },
}));

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="huge-icon" {...props} />
  ),
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  Cancel01Icon: {},
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
  }) =>
    asChild && React.isValidElement(children) ? (
      React.cloneElement(children as React.ReactElement, {
        ...props,
        "data-button-variant": variant,
        "data-button-size": size,
      })
    ) : (
      <button data-button-variant={variant} data-button-size={size} {...props}>
        {children}
      </button>
    ),
}));

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../sheet";

describe("packages/ui/components/ui dialog family", () => {
  it("renders dialog content, header, footer, and close helpers", () => {
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("button", { name: "Open dialog" })).toHaveAttribute(
      "data-slot",
      "dialog-trigger"
    );
    expect(screen.getByText("Dialog title").closest("[data-slot='dialog-content']")).toBeInTheDocument();
    expect(screen.getByText("Dialog description")).toHaveAttribute(
      "data-slot",
      "dialog-description"
    );
    expect(screen.getAllByRole("button", { name: "Close" }).length).toBeGreaterThan(0);
  });

  it("renders alert dialog action and cancel wrappers through the shared button API", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open alert</AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>!</AlertDialogMedia>
            <AlertDialogTitle>Alert title</AlertDialogTitle>
            <AlertDialogDescription>Alert description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole("button", { name: "Open alert" })).toHaveAttribute(
      "data-slot",
      "alert-dialog-trigger"
    );
    expect(screen.getByText("Alert title").closest("[data-slot='alert-dialog-content']")).toHaveAttribute(
      "data-size",
      "sm"
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute(
      "data-button-variant",
      "outline"
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "data-button-variant",
      "destructive"
    );
  });

  it("renders drawer and sheet content wrappers with their direction and close controls", () => {
    render(
      <div>
        <Drawer>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent data-vaul-drawer-direction="bottom">
            <DrawerHeader>
              <DrawerTitle>Drawer title</DrawerTitle>
              <DrawerDescription>Drawer description</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>Drawer footer</DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Sheet>
          <SheetTrigger>Open sheet</SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Sheet title</SheetTitle>
              <SheetDescription>Sheet description</SheetDescription>
            </SheetHeader>
            <SheetFooter>Sheet footer</SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );

    expect(screen.getByRole("button", { name: "Open drawer" })).toHaveAttribute(
      "data-slot",
      "drawer-trigger"
    );
    expect(screen.getByText("Drawer title").closest("[data-slot='drawer-content']")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open sheet" })).toHaveAttribute(
      "data-slot",
      "sheet-trigger"
    );
    expect(screen.getByText("Sheet title").closest("[data-slot='sheet-content']")).toHaveAttribute(
      "data-side",
      "left"
    );
    expect(screen.getByText("Sheet description")).toHaveAttribute(
      "data-slot",
      "sheet-description"
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});
