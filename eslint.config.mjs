import { config as reactConfig } from "@repo/eslint-config/react-internal";
import { config as baseConfig } from "@repo/eslint-config/base";

/**
 * Root ESLint flat config for the monorepo.
 *
 * Used by lint-staged (which runs from the repo root) and IDE tooling.
 * Each workspace package also has its own eslint.config.mjs for running
 * `eslint` directly from inside that package.
 */
export default [
  // Global ignores — applied before all other configs
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/*.config.{js,mjs,cjs,ts}",
    ],
  },

  // Base config for non-React utility packages
  ...baseConfig.map((cfg) => ({
    ...cfg,
    files: [
      "packages/utils/**/*.{ts,tsx}",
      "packages/eslint-config/**/*.js",
      "packages/typescript-config/**/*.ts",
      "packages/tailwind-config/**/*.{ts,tsx}",
    ],
  })),

  // React config for apps and React packages
  ...reactConfig.map((cfg) => ({
    ...cfg,
    files: [
      "apps/**/*.{ts,tsx}",
      "packages/ui/**/*.{ts,tsx}",
      "packages/store/**/*.{ts,tsx}",
    ],
  })),
];
