import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Input } from "../input";

describe("packages/ui/components/ui/input", () => {
  it("renders prefix and suffix content and forwards the input ref", () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Input
        ref={ref}
        prefix={<span>Prefix</span>}
        suffix={<span>Suffix</span>}
        placeholder="Email"
        type="email"
      />
    );

    const input = screen.getByPlaceholderText("Email");

    expect(screen.getByText("Prefix")).toBeInTheDocument();
    expect(screen.getByText("Suffix")).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("type", "email");
    expect(ref.current).toBe(input);
  });
});
