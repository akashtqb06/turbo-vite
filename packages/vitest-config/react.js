/**
 * @repo/vitest-config — React preset
 *
 * Vitest preset for React packages and apps.
 * Uses jsdom environment with @vitejs/plugin-react for JSX transform.
 *
 * Suitable for: @repo/ui, @repo/hooks, @repo/forms, and all apps/*
 *
 * @example
 * ```js
 * // packages/hooks/vitest.config.ts
 * import { mergeConfig, defineConfig } from "vitest/config";
 * import { reactConfig } from "@repo/vitest-config/react";
 *
 * export default mergeConfig(reactConfig, defineConfig({
 *   test: { include: ["src/__tests__/**\/*.test.{ts,tsx}"] },
 * }));
 * ```
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { baseTestConfig } from "./base.js";

/**
 * Ready-to-merge Vitest config for React packages and apps.
 */
export const reactConfig = defineConfig({
  plugins: [react()],
  test: {
    ...baseTestConfig,
    environment: "jsdom",
  },
});
