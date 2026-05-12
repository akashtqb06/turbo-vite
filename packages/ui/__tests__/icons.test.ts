import { describe, expect, it } from "vitest";

import {
  DEFAULT_ICON_NAME,
  getSuggestedIconDefinitions,
  resolveIconDefinition,
  searchIconDefinitions,
  TOTAL_ICON_COUNT,
} from "../lib/icons";

describe("packages/ui/lib/icons", () => {
  it("resolves icons from direct names, aliases, and token fragments", () => {
    expect(DEFAULT_ICON_NAME).toBe("Circle");
    expect(resolveIconDefinition("Users")?.name).toBe("Users");
    expect(resolveIconDefinition("fa-users")?.name).toBe("Users");
    expect(resolveIconDefinition("team dashboard")?.name).toBeTruthy();
    expect(resolveIconDefinition("definitely-not-an-icon")).toBeNull();
  });

  it("returns suggested icons within the requested limit", () => {
    const suggestions = getSuggestedIconDefinitions(5);

    expect(TOTAL_ICON_COUNT).toBeGreaterThan(0);
    expect(suggestions).toHaveLength(5);
    expect(new Set(suggestions.map((definition) => definition.name)).size).toBe(5);
  });

  it("searches icons by normalized keywords and honors the limit", () => {
    const results = searchIconDefinitions("user", 3);

    expect(results).toHaveLength(3);
    expect(results.some((definition) => definition.name === "Users")).toBe(true);
  });
});
