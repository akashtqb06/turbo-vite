import { defineConfig } from "eslint/config";
import reactRefresh from "eslint-plugin-react-refresh";
import { config as reactInternalConfig } from "@repo/eslint-config/react-internal";

export default defineConfig([
  ...reactInternalConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactRefresh.configs.vite.rules,
    },
  },
  {
    ignores: ["dist/**", "coverage/**"],
  },
]);
