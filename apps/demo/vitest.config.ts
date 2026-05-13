import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname, "../.."),
  plugins: [react()],
  resolve: {
    alias: {
      "@repo/ui/components/ui/theme-provider": path.resolve(
        __dirname,
        "../../packages/ui/components/ui/theme-provider.tsx"
      ),
      "@repo/ui/components/ui/loading-screen": path.resolve(
        __dirname,
        "../../packages/ui/components/ui/loading-screen.tsx"
      ),
      "@repo/ui/components/ui/translation-provider": path.resolve(
        __dirname,
        "../../packages/ui/components/ui/translation-provider.tsx"
      ),
      "@repo/ui/lib/icons": path.resolve(
        __dirname,
        "../../packages/ui/lib/icons.ts"
      ),
      "@repo/ui/lib/toast": path.resolve(
        __dirname,
        "../../packages/ui/lib/toast.ts"
      ),
      "@repo/ui/lib/utils": path.resolve(
        __dirname,
        "../../packages/ui/lib/utils.ts"
      ),
      "@": path.resolve(__dirname, "../../packages/ui"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./apps/demo/src/__tests__/setup.ts",
    include: [
      "apps/demo/src/__tests__/**/*.test.ts?(x)",
      "packages/**/__tests__/**/*.test.ts?(x)",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      allowExternal: true,
      reportsDirectory: "./apps/demo/coverage",
      skipFull: false,
      include: [
        "apps/demo/src/**/*.{ts,tsx}",
        "packages/api-client/**/*.{ts,tsx}",
        "packages/auth/**/*.{ts,tsx}",
        "packages/desk/**/*.{ts,tsx}",
        "packages/ui/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.*",
        "**/dist/**",
        "**/node_modules/**",
      ],
    },
  },
});
