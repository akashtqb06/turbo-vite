/**
 * Unit tests for `@repo/utils/string` utilities.
 */

import { describe, it, expect } from "vitest";
import { truncate, slugify, capitalize, initials, camelToKebab, stripHtml } from "../string";

describe("truncate", () => {
  it("returns the string unchanged when it fits within max", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates to max chars and appends ellipsis", () => {
    expect(truncate("Hello, world!", 5)).toBe("Hello…");
  });

  it("uses a custom ellipsis", () => {
    expect(truncate("Hello, world!", 5, "...")).toBe("Hello...");
  });

  it("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  it("handles max === string length (no truncation)", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});

describe("slugify", () => {
  it("converts spaces to hyphens and lowercases", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("foo  --  bar")).toBe("foo-bar");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  Hello  ")).toBe("hello");
  });
});

describe("capitalize", () => {
  it("uppercases the first character", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("leaves already-capitalized strings unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("initials", () => {
  it("returns first letter of each word (up to 2)", () => {
    expect(initials("Jane Doe")).toBe("JD");
  });

  it("returns first letter for single word", () => {
    expect(initials("Jane")).toBe("J");
  });

  it("handles empty string", () => {
    expect(initials("")).toBe("");
  });

  it("uppercases initials", () => {
    expect(initials("john smith")).toBe("JS");
  });
});

describe("camelToKebab", () => {
  it("converts camelCase to kebab-case", () => {
    expect(camelToKebab("myVariableName")).toBe("my-variable-name");
  });

  it("handles single word", () => {
    expect(camelToKebab("hello")).toBe("hello");
  });
});

describe("stripHtml", () => {
  it("removes HTML tags", () => {
    expect(stripHtml("<p>Hello <b>World</b></p>")).toBe("Hello World");
  });

  it("returns plain text unchanged", () => {
    expect(stripHtml("Hello World")).toBe("Hello World");
  });
});
