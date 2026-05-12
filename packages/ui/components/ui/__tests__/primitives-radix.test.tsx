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
  Avatar: {
    Root: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    Image: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
    Fallback: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLSpanElement> & { children: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  },
  Label: {
    Root: ({
      children,
      ...props
    }: React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }) => (
      <label {...props}>{children}</label>
    ),
  },
  Checkbox: {
    Root: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
      <button {...props}>{children}</button>
    ),
    Indicator: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLSpanElement> & { children: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  },
  Collapsible: {
    Root: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    CollapsibleTrigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    CollapsibleContent: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  HoverCard: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({ children, align, sideOffset, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; align?: string; sideOffset?: number }) => (
      <div data-align={align} data-side-offset={String(sideOffset)} {...props}>{children}</div>
    ),
  },
  RadioGroup: {
    Root: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    Item: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Indicator: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { children: React.ReactNode }) => <span {...props}>{children}</span>,
  },
  Separator: {
    Root: ({ orientation, decorative, ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: string; decorative?: boolean }) => (
      <div data-orientation={orientation} data-decorative={String(decorative)} {...props} />
    ),
  },
  Switch: {
    Root: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Thumb: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
  },
  Tabs: {
    Root: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    List: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Content: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  Tooltip: {
    Provider: ({ children, delayDuration, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; delayDuration?: number }) => (
      <div data-delay-duration={String(delayDuration)} {...props}>{children}</div>
    ),
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => <button {...props}>{children}</button>,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Content: ({ children, sideOffset, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; sideOffset?: number }) => (
      <div data-side-offset={String(sideOffset)} {...props}>{children}</div>
    ),
    Arrow: (props: React.HTMLAttributes<HTMLSpanElement>) => <span data-testid="tooltip-arrow" {...props} />,
  },
}));

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="huge-icon" {...props} />
  ),
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  Tick02Icon: {},
}));

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "../avatar";
import { Checkbox } from "../checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../hover-card";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Separator } from "../separator";
import { Switch } from "../switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

describe("packages/ui/components/ui radix wrappers", () => {
  it("renders avatar, label, checkbox, and separator helpers", () => {
    render(
      <div>
        <Avatar size="lg">
          <AvatarImage alt="Avatar image" src="/avatar.png" />
          <AvatarFallback>AD</AvatarFallback>
          <AvatarBadge>1</AvatarBadge>
        </Avatar>
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+2</AvatarGroupCount>
        </AvatarGroup>
        <Label htmlFor="field-id">Field label</Label>
        <Checkbox aria-label="Check option" />
        <Separator />
      </div>
    );

    expect(screen.getByText("AD").closest("[data-slot='avatar']")).toHaveAttribute(
      "data-size",
      "lg"
    );
    expect(screen.getByText("+2")).toHaveAttribute(
      "data-slot",
      "avatar-group-count"
    );
    expect(screen.getByText("Field label")).toHaveAttribute("data-slot", "label");
    expect(screen.getByLabelText("Check option")).toHaveAttribute(
      "data-slot",
      "checkbox"
    );
    expect(screen.getByLabelText("Check option").querySelector("[data-slot='checkbox-indicator']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='separator']")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
  });

  it("renders collapsible, hover card, radio group, switch, tabs, and tooltip wrappers", () => {
    render(
      <div>
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Hidden body</CollapsibleContent>
        </Collapsible>
        <HoverCard>
          <HoverCardTrigger>Hover trigger</HoverCardTrigger>
          <HoverCardContent>Hover content</HoverCardContent>
        </HoverCard>
        <RadioGroup>
          <RadioGroupItem aria-label="Choice A" />
        </RadioGroup>
        <Switch size="sm" aria-label="Switch control" />
        <Tabs orientation="vertical">
          <TabsList variant="line">
            <TabsTrigger>Tab one</TabsTrigger>
          </TabsList>
          <TabsContent>Tab content</TabsContent>
        </Tabs>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Tooltip trigger</TooltipTrigger>
            <TooltipContent>Tooltip body</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );

    expect(screen.getByText("Toggle")).toHaveAttribute(
      "data-slot",
      "collapsible-trigger"
    );
    expect(screen.getByText("Hidden body")).toHaveAttribute(
      "data-slot",
      "collapsible-content"
    );
    expect(screen.getByText("Hover content")).toHaveAttribute(
      "data-side-offset",
      "4"
    );
    expect(screen.getByLabelText("Choice A")).toHaveAttribute(
      "data-slot",
      "radio-group-item"
    );
    expect(screen.getByLabelText("Switch control")).toHaveAttribute(
      "data-size",
      "sm"
    );
    expect(screen.getByText("Tab one").closest("[data-slot='tabs']")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
    expect(screen.getByText("Tooltip body")).toHaveAttribute(
      "data-side-offset",
      "0"
    );
    expect(screen.getByTestId("tooltip-arrow")).toBeInTheDocument();
    expect(document.querySelector("[data-delay-duration='0']")).toBeInTheDocument();
  });
});
