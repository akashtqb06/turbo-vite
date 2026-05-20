/**
 * Vitest configuration for apps/smartgrants.
 *
 * Extends the shared `@repo/vitest-config/react` preset and scopes
 * coverage to the smartgrants app source.
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
        "@": path.resolve(root, "packages/ui"),
      },
    },
    test: {
      root,
      setupFiles: [
        "@repo/vitest-config/setup",
        "./apps/smartgrants/src/__tests__/setup.ts",
      ],
      include: [
        "apps/smartgrants/src/__tests__/**/*.test.{ts,tsx}",
      ],
      coverage: {
        reportsDirectory: "./apps/smartgrants/coverage",
        reporter: ["text", "html", "lcov", "text-summary"],
        thresholds: {
          lines:      60,
          functions:  60,
          branches:   50,
          statements: 60,
        },
        include: [
          "apps/smartgrants/src/**/*.{ts,tsx}",
        ],
      },
    },
  }),
);
