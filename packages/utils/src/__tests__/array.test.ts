/**
 * Unit tests for `@repo/utils/array` utilities.
 */

import { describe, it, expect } from "vitest";
import { groupBy, uniqueBy, chunk, sortBy } from "../array";

describe("groupBy", () => {
  it("groups items by a string key", () => {
    const items = [
      { role: "admin", name: "Alice" },
      { role: "user",  name: "Bob" },
      { role: "admin", name: "Carol" },
    ];
    const result = groupBy(items, (i) => i.role);
    expect(result.get("admin")).toHaveLength(2);
    expect(result.get("user")).toHaveLength(1);
  });

  it("returns an empty Map for an empty array", () => {
    const result = groupBy([], (x: string) => x);
    expect(result.size).toBe(0);
  });
});

describe("uniqueBy", () => {
  it("removes duplicates by key", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
    const result = uniqueBy(items, (x) => x.id);
    expect(result).toHaveLength(2);
    expect(result.map((x) => x.id)).toEqual([1, 2]);
  });

  it("returns all items when all keys are unique", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(uniqueBy(items, (x) => x.id)).toHaveLength(3);
  });
});

describe("chunk", () => {
  it("splits array into chunks of given size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns single chunk when size >= array length", () => {
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
  });

  it("returns empty array for empty input", () => {
    expect(chunk([], 3)).toEqual([]);
  });
});

describe("sortBy", () => {
  it("sorts ascending by a numeric key", () => {
    const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
    const result = sortBy(items, (x) => x.age);
    expect(result.map((x) => x.age)).toEqual([20, 25, 30]);
  });

  it("sorts descending by a numeric key", () => {
    const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
    const result = sortBy(items, (x) => x.age, "desc");
    expect(result.map((x) => x.age)).toEqual([30, 25, 20]);
  });

  it("does not mutate the original array", () => {
    const items = [{ v: 3 }, { v: 1 }, { v: 2 }];
    sortBy(items, (x) => x.v);
    expect(items.map((x) => x.v)).toEqual([3, 1, 2]);
  });
});
