/**
 * @repo/vitest-config — Node preset
 *
 * Vitest preset for pure TypeScript packages with no React/DOM dependency.
 * Uses the `node` environment — fastest, no jsdom overhead.
 *
 * Suitable for: @repo/utils, @repo/logger, @repo/env, @repo/api-client
 *
 * @example
 * ```js
 * // packages/utils/vitest.config.ts
 * import { mergeConfig, defineConfig } from "vitest/config";
 * import { nodeConfig } from "@repo/vitest-config/node";
 *
 * export default mergeConfig(nodeConfig, defineConfig({
 *   test: { include: ["src/__tests__/**\/*.test.ts"] },
 * }));
 * ```
 */

import { defineConfig } from "vitest/config";
import { baseTestConfig } from "./base.js";

/**
 * Ready-to-merge Vitest config for pure Node / TypeScript packages.
 */
export const nodeConfig = defineConfig({
  test: {
    ...baseTestConfig,
    environment: "node",
  },
});
