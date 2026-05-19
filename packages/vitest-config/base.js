/**
 * @repo/vitest-config — base test configuration
 *
 * Base `test` options shared across all environments.
 * The `globals: true` setting makes expect/describe/it available globally.
 *
 * @type {import('vitest').InlineConfig}
 */
export const baseTestConfig = {
  globals: true,
  setupFiles: ["@repo/vitest-config/setup"],
  coverage: {
    provider: "v8",
    reporter: ["text", "html", "lcov"],
    exclude: [
      "**/*.d.ts",
      "**/*.test.*",
      "**/*.config.*",
      "**/dist/**",
      "**/node_modules/**",
      "**/__tests__/utils/**",
      "**/__tests__/setup.*",
    ],
  },
};
