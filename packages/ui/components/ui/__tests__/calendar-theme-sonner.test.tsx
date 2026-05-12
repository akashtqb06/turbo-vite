import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const themeProviderMock = vi.hoisted(() => vi.fn());
const useThemeMock = vi.hoisted(() => vi.fn(() => ({ theme: "dark" })));
const sonnerMock = vi.hoisted(() => vi.fn());
const sonnerToastMock = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  loading: vi.fn(),
  info: vi.fn(),
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => {
    themeProviderMock(props);
    return <div data-testid="next-theme-provider">{children}</div>;
  },
  useTheme: () => useThemeMock(),
}));

vi.mock("react-day-picker", () => ({
  DayPicker: ({
    components,
    showOutsideDays,
    className,
    formatters,
    locale,
  }: any) => (
    <div data-testid="day-picker" data-show-outside-days={String(showOutsideDays)} className={className}>
      {components.Root({
        className: "root-class",
        rootRef: null,
        children: "Calendar root",
      })}
      {components.Chevron({ orientation: "left" })}
      {components.Chevron({ orientation: "right" })}
      {components.Chevron({ orientation: "down" })}
      {components.DayButton({
        day: { date: new Date("2026-04-13") },
        modifiers: {
          selected: true,
          range_start: false,
          range_end: false,
          range_middle: false,
          focused: false,
        },
        children: <span>13</span>,
      })}
      <span data-testid="month-name">
        {formatters.formatMonthDropdown(new Date("2026-04-13"))}
      </span>
      <span data-testid="locale-code">{locale?.code}</span>
    </div>
  ),
  getDefaultClassNames: () => ({
    root: "rdp-root",
    months: "rdp-months",
    month: "rdp-month",
    nav: "rdp-nav",
    button_previous: "rdp-prev",
    button_next: "rdp-next",
    month_caption: "rdp-caption",
    dropdowns: "rdp-dropdowns",
    dropdown_root: "rdp-dropdown-root",
    dropdown: "rdp-dropdown",
    caption_label: "rdp-caption-label",
    weekdays: "rdp-weekdays",
    weekday: "rdp-weekday",
    week: "rdp-week",
    week_number_header: "rdp-week-number-header",
    week_number: "rdp-week-number",
    day: "rdp-day",
    range_start: "rdp-range-start",
    range_middle: "rdp-range-middle",
    range_end: "rdp-range-end",
    today: "rdp-today",
    outside: "rdp-outside",
    disabled: "rdp-disabled",
    hidden: "rdp-hidden",
  }),
}));

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="huge-icon" {...props} />
  ),
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  ArrowLeftIcon: {},
  ArrowRightIcon: {},
  ArrowDownIcon: {},
  CheckmarkCircle02Icon: {},
  InformationCircleIcon: {},
  Alert02Icon: {},
  MultiplicationSignCircleIcon: {},
  Loading03Icon: {},
}));

vi.mock("../button", () => ({
  Button: React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
  >(function MockButton({ children, variant, size, ...props }, ref) {
    return (
      <button ref={ref} data-variant={variant} data-size={size} {...props}>
        {children}
      </button>
    );
  }),
  buttonVariants: ({ variant }: { variant?: string }) => `button-${variant ?? "default"}`,
}));

vi.mock("sonner", () => ({
  Toaster: (props: Record<string, unknown>) => {
    sonnerMock(props);
    return <div data-testid="sonner" />;
  },
  toast: sonnerToastMock,
}));

import { Calendar, CalendarDayButton } from "../calendar";
import { Toaster } from "../sonner";
import { ThemeProvider, THEME_STORAGE_KEY } from "../theme-provider";

describe("packages/ui/components/ui calendar theme provider and sonner", () => {
  afterEach(() => {
    themeProviderMock.mockReset();
    sonnerMock.mockReset();
    sonnerToastMock.success.mockReset();
    sonnerToastMock.error.mockReset();
    sonnerToastMock.warning.mockReset();
    sonnerToastMock.loading.mockReset();
    sonnerToastMock.info.mockReset();
  });

  it("passes the expected defaults into the theme provider", () => {
    render(
      <ThemeProvider forcedTheme="light">
        <div>child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId("next-theme-provider")).toBeInTheDocument();
    expect(themeProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: "class",
        defaultTheme: "system",
        storageKey: THEME_STORAGE_KEY,
        enableSystem: true,
        enableColorScheme: true,
        disableTransitionOnChange: true,
        forcedTheme: "light",
      })
    );
  });

  it("renders calendar defaults, locale month formatting, and calendar day buttons", () => {
    render(<Calendar locale={{ code: "en-US" }} />);

    expect(screen.getByTestId("day-picker")).toHaveAttribute(
      "data-show-outside-days",
      "true"
    );
    expect(screen.getByTestId("month-name")).toHaveTextContent("Apr");
    expect(screen.getByTestId("locale-code")).toHaveTextContent("en-US");
    expect(screen.getByText("Calendar root")).toHaveAttribute(
      "data-slot",
      "calendar"
    );
    expect(screen.getByText("13").closest("button")).toHaveAttribute(
      "data-selected-single",
      "true"
    );
    expect(screen.getAllByTestId("huge-icon").length).toBeGreaterThanOrEqual(3);
  });

  it("focuses the calendar day button when the focused modifier is true", () => {
    render(
      <CalendarDayButton
        day={{ date: new Date("2026-04-13") } as never}
        modifiers={{
          focused: true,
          selected: false,
          range_start: false,
          range_end: false,
          range_middle: false,
        } as never}
      >
        <span>14</span>
      </CalendarDayButton>
    );

    expect(screen.getByRole("button")).toHaveFocus();
    expect(screen.getByRole("button")).toHaveAttribute("data-day");
  });

  it("renders sonner with the active theme and responds to app toast events", () => {
    render(<Toaster richColors />);

    expect(screen.getByTestId("sonner")).toBeInTheDocument();
    expect(sonnerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: "dark",
        richColors: true,
        className: "toaster group",
      })
    );

    window.dispatchEvent(
      new CustomEvent("repo-toast", {
        detail: {
          type: "success",
          title: "Saved",
        },
      })
    );

    expect(sonnerToastMock.success).toHaveBeenCalledWith("Saved", {
      duration: undefined,
    });
  });
});
