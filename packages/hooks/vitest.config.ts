/**
 * Vitest configuration for @repo/hooks.
 * Uses the shared `react` preset — jsdom + React plugin for renderHook tests.
 */
import { mergeConfig, defineConfig } from "vitest/config";
import { reactConfig } from "@repo/vitest-config/react";

export default mergeConfig(reactConfig, defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
    },
  },
}));
