import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Target host for dev proxy — mirrors legacy setupProxy.js:
 *   proxyConfigs.coreApi.host = 'https://smartgrants-dev1.kpmgspectrum.com'
 *
 * Override with VITE_PROXY_TARGET in your .env.local to point at a different env.
 */
const PROXY_TARGET =
  process.env.VITE_PROXY_TARGET ?? "https://smartgrants-dev1.kpmgspectrum.com";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../packages/ui"),
    },
  },

  server: {
    port: 3005,

    proxy: {
      // ── REST API (/api/) ────────────────────────────────────────────────────
      // Mirrors legacy: coreApi → target '/api/', host: smartgrants-dev1
      "/api": {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        // Rewrite ^/api → /api (no-op path rewrite — same as legacy pathRewrite)
        rewrite: (path) => path,
      },

      // ── WebSocket (/ws/) ────────────────────────────────────────────────────
      // Mirrors legacy: ws entry with ws: true
      "/ws": {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path,
      },
    },
  },
});
