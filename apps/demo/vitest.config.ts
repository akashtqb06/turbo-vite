/**
 * Vitest configuration for apps/demo.
 *
 * Extends the shared `@repo/vitest-config/react` preset and adds:
 * - Monorepo-wide `root` so tests across all packages are discovered
 * - Path aliases for `@repo/ui` subpath imports (source files reference
 *   internal paths that aren't resolved via node_modules in tests)
 * - Coverage config scoped to the packages exercised by the demo
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig } from "vitest/config";
import { reactConfig } from "@repo/vitest-config/react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, "../..");

export default mergeConfig(
  reactConfig,
  defineConfig({
    resolve: {
      alias: {
        // @repo/ui subpath imports → source files (not compiled dist)
        "@repo/ui/components/ui/theme-provider":       path.resolve(root, "packages/ui/components/ui/theme-provider.tsx"),
        "@repo/ui/components/ui/loading-screen":       path.resolve(root, "packages/ui/components/ui/loading-screen.tsx"),
        "@repo/ui/components/ui/translation-provider": path.resolve(root, "packages/ui/components/ui/translation-provider.tsx"),
        "@repo/ui/lib/icons": path.resolve(root, "packages/ui/lib/icons.ts"),
        "@repo/ui/lib/toast": path.resolve(root, "packages/ui/lib/toast.ts"),
        "@repo/ui/lib/utils": path.resolve(root, "packages/ui/lib/utils.ts"),
        // shadcn components use @/lib/utils as a path alias rooted at packages/ui
        "@":                  path.resolve(root, "packages/ui"),
      },
    },
    test: {
      root,
      // Run the shared setup first (jest-dom + polyfills), then app-specific setup
      setupFiles: [
        "@repo/vitest-config/setup",
        "./apps/demo/src/__tests__/setup.ts",
      ],
      include: [
        "apps/demo/src/__tests__/**/*.test.{ts,tsx}",
        "packages/**/__tests__/**/*.test.{ts,tsx}",
        "packages/utils/src/__tests__/**/*.test.ts",
        "packages/hooks/src/__tests__/**/*.test.{ts,tsx}",
      ],
      coverage: {
        reportsDirectory: "./apps/demo/coverage",
        // Show per-file coverage table in terminal output
        reporter: ["text", "html", "lcov", "text-summary"],
        // Thresholds — reported in the text output so developers see trends.
        // These do NOT block CI (the post-commit hook uses || true).
        // Bump these up as coverage improves.
        thresholds: {
          lines:      60,
          functions:  60,
          branches:   50,
          statements: 60,
        },
        include: [
          "apps/demo/src/**/*.{ts,tsx}",
          "packages/utils/src/**/*.ts",
          "packages/hooks/src/**/*.ts",
          "packages/store/src/**/*.ts",
          "packages/i18n/src/**/*.ts",
        ],
      },
    },
  }),
);
