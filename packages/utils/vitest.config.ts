/**
 * Vitest configuration for @repo/utils.
 * Uses the shared `node` preset — no DOM needed for pure TypeScript utilities.
 */
import { mergeConfig, defineConfig } from "vitest/config";
import { nodeConfig } from "@repo/vitest-config/node";

export default mergeConfig(nodeConfig, defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts"],
    },
  },
}));
