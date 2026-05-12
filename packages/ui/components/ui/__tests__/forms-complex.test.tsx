import React, { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@base-ui/react", () => {
  const renderMaybe = (
    renderProp: React.ReactNode | undefined,
    extraProps: Record<string, unknown>,
    children?: React.ReactNode
  ) => {
    if (React.isValidElement(renderProp)) {
      return React.cloneElement(renderProp as React.ReactElement, extraProps, children);
    }
    return <div {...extraProps}>{children}</div>;
  };

  return {
    Combobox: {
      Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Value: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => <span {...props}>{children}</span>,
      Trigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => <button {...props}>{children}</button>,
      Clear: ({ children, render, ...props }: any) => renderMaybe(render, props, children),
      Input: React.forwardRef<HTMLInputElement, any>(function MockComboboxInput(
        { render, children, ...props },
        ref
      ) {
        if (render) {
          return renderMaybe(render, props, children);
        }

        return <input ref={ref} {...props} />;
      }),
      Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Positioner: ({ children, side, align, sideOffset, alignOffset, anchor, ...props }: any) => (
        <div data-side={side} data-align={align} data-side-offset={String(sideOffset)} data-align-offset={String(alignOffset)} data-anchor={String(Boolean(anchor))} {...props}>{children}</div>
      ),
      Popup: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      List: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      Item: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      ItemIndicator: ({ children, render }: any) => renderMaybe(render, { "data-slot": "mock-item-indicator" }, children),
      Group: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      GroupLabel: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      Collection: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      Empty: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      Separator: (props: React.HTMLAttributes<HTMLHRElement>) => <hr {...props} />,
      Chips: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      Chip: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
      ChipRemove: ({ children, render, ...props }: any) => renderMaybe(render, props, children),
    },
  };
});

vi.mock("input-otp", () => {
  const OTPInputContext = React.createContext({
    slots: [
      { char: "1", hasFakeCaret: false, isActive: false },
      { char: "2", hasFakeCaret: true, isActive: true },
    ],
  });

  return {
    OTPInput: ({
      containerClassName,
      className,
      ...props
    }: React.InputHTMLAttributes<HTMLInputElement> & { containerClassName?: string }) => (
      <div className={containerClassName}>
        <input className={className} {...props} />
      </div>
    ),
    OTPInputContext,
  };
});

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="huge-icon" {...props} />
  ),
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  ArrowDown01Icon: {},
  Cancel01Icon: {},
  Tick02Icon: {},
  MinusSignIcon: {},
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

vi.mock("../input", () => ({
  Input: React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function MockInput(props, ref) {
      return <input ref={ref} {...props} />;
    }
  ),
}));

vi.mock("../textarea", () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}));

vi.mock("../label", () => ({
  Label: ({
    children,
    ...props
  }: React.LabelHTMLAttributes<HTMLLabelElement> & { children?: React.ReactNode }) => (
    <label {...props}>{children}</label>
  ),
}));

vi.mock("../separator", () => ({
  Separator: (props: React.HTMLAttributes<HTMLDivElement> & { orientation?: string }) => (
    <div data-mock-separator="" {...props} />
  ),
}));

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "../combobox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "../field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../input-otp";

function ComboboxAnchorProbe() {
  const anchorRef = useComboboxAnchor();
  const [attached, setAttached] = React.useState(false);

  React.useEffect(() => {
    setAttached(Boolean(anchorRef.current));
  }, [anchorRef]);

  return <div data-has-current={String(attached)} ref={anchorRef} />;
}

describe("packages/ui/components/ui complex form primitives", () => {
  it("renders field helpers including deduplicated and multi-error states", () => {
    render(
      <div>
        <FieldSet>
          <FieldLegend variant="label">Legend</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="field-id">Field label</FieldLabel>
              <FieldContent>
                <FieldTitle>Field title</FieldTitle>
                <FieldDescription>Helpful text</FieldDescription>
                <FieldError
                  errors={[
                    { message: "Required" },
                    { message: "Required" },
                    { message: "Invalid value" },
                  ]}
                />
              </FieldContent>
            </Field>
            <FieldSeparator>OR</FieldSeparator>
            <FieldError errors={[{ message: "Only one" }]} />
          </FieldGroup>
        </FieldSet>
      </div>
    );

    expect(screen.getByText("Legend")).toHaveAttribute("data-variant", "label");
    expect(screen.getByText("Field title")).toHaveAttribute("data-slot", "field-label");
    expect(screen.getByText("Helpful text")).toHaveAttribute(
      "data-slot",
      "field-description"
    );
    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(screen.getByText("OR")).toHaveAttribute(
      "data-slot",
      "field-separator-content"
    );
    expect(screen.getByText("Only one")).toBeInTheDocument();
    expect(screen.getAllByText("Required").length).toBe(1);
  });

  it("focuses the grouped input when clicking the addon and renders group controls", () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start">Prefix</InputGroupAddon>
        <InputGroupInput aria-label="Grouped input" />
        <InputGroupText>Hint</InputGroupText>
        <InputGroupButton size="icon-xs">Go</InputGroupButton>
      </InputGroup>
    );

    fireEvent.click(screen.getByText("Prefix"));

    expect(screen.getByLabelText("Grouped input")).toHaveFocus();
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute(
      "data-size",
      "icon-xs"
    );
    expect(screen.getByText("Hint")).toBeInTheDocument();
  });

  it("renders textarea-based input groups and input otp helpers", () => {
    render(
      <div>
        <InputGroup>
          <InputGroupTextarea aria-label="Grouped textarea" />
        </InputGroup>
        <InputOTP containerClassName="otp-container" maxLength={6} value="12" />
        <InputOTPGroup>
          <InputOTPSlot index={1} />
          <InputOTPSeparator />
        </InputOTPGroup>
      </div>
    );

    expect(screen.getByLabelText("Grouped textarea")).toHaveAttribute(
      "data-slot",
      "input-group-control"
    );
    expect(document.querySelector(".otp-container")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='input-otp-slot']")).toHaveAttribute(
      "data-active",
      "true"
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='input-otp-separator']")).toHaveAttribute(
      "role",
      "separator"
    );
  });

  it("renders combobox wrappers, portals, chips, and anchor refs", () => {
    const chipInputRef = createRef<HTMLInputElement>();

    render(
      <div>
        <Combobox>
          <ComboboxValue>Selected value</ComboboxValue>
          <ComboboxInput showClear showTrigger>
            <span>Child</span>
          </ComboboxInput>
          <ComboboxContent>
            <ComboboxList>
              <ComboboxEmpty>No results</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxLabel>Group</ComboboxLabel>
                <ComboboxCollection>
                  <ComboboxItem>Option</ComboboxItem>
                </ComboboxCollection>
              </ComboboxGroup>
              <ComboboxSeparator />
            </ComboboxList>
          </ComboboxContent>
          <ComboboxChips>
            <ComboboxChip>Chip value</ComboboxChip>
            <ComboboxChipsInput ref={chipInputRef} aria-label="Chip input" />
          </ComboboxChips>
        </Combobox>
        <ComboboxTrigger>Manual trigger</ComboboxTrigger>
        <ComboboxAnchorProbe />
      </div>
    );

    expect(screen.getByText("Selected value")).toHaveAttribute(
      "data-slot",
      "combobox-value"
    );
    expect(document.querySelector("[data-slot='combobox-trigger']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='combobox-clear']")).toBeInTheDocument();
    expect(screen.getByText("No results")).toHaveAttribute(
      "data-slot",
      "combobox-empty"
    );
    expect(screen.getByText("Option")).toHaveAttribute(
      "data-slot",
      "combobox-item"
    );
    expect(screen.getByText("Chip value")).toHaveAttribute(
      "data-slot",
      "combobox-chip"
    );
    expect(screen.getByLabelText("Chip input")).toHaveAttribute(
      "data-slot",
      "combobox-chip-input"
    );
    expect(chipInputRef.current).toBe(screen.getByLabelText("Chip input"));
    expect(document.querySelector("[data-slot='combobox-content']")).toBeInTheDocument();
    expect(document.querySelector("[data-has-current='true']")).toBeInTheDocument();
  });
});
