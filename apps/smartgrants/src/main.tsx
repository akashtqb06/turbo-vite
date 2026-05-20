import { createRoot }          from "react-dom/client";
import { BrowserRouter }        from "react-router-dom";
import { Provider }             from "react-redux";
import { createAppStore }       from "@repo/store";
import { configureLogger }      from "@repo/logger";
import { QueryProvider, createQueryClient } from "@repo/query";
import { TranslationProvider }  from "@repo/i18n/react";
import { Toaster }              from "@repo/ui/components/ui/sonner";
import { ThemeProvider }        from "@repo/ui/providers/ThemeProvider";
import { initApiClient }        from "./lib/apiClient";
import "./index.css";
import App from "./App.tsx";

// ── 1. Logger ────────────────────────────────────────────────────────────────
configureLogger({
  level:  (import.meta.env.VITE_LOG_LEVEL as "debug" | "info" | "warn" | "error") ?? "info",
  prefix: "smartgrants",
});

// ── 2. API client ─────────────────────────────────────────────────────────────
// Bootstraps default headers from localStorage/window._cft and wires up
// all SmartGrants interceptors (CSRF, ODP base64 encoding, 401/403 redirect).
initApiClient(import.meta.env.VITE_API_URL ?? "/api");

// ── 3. Redux store ────────────────────────────────────────────────────────────
const store = createAppStore();

// ── 4. TanStack Query client ──────────────────────────────────────────────────
const queryClient = createQueryClient();

// ── 5. Render ─────────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryProvider client={queryClient}>
      <ThemeProvider>
        <TranslationProvider>
          <BrowserRouter>
            <App />
            <Toaster richColors position="top-right" />
          </BrowserRouter>
        </TranslationProvider>
      </ThemeProvider>
    </QueryProvider>
  </Provider>,
);
