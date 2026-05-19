import { createRoot }        from "react-dom/client";
import { BrowserRouter }      from "react-router-dom";
import { Provider }           from "react-redux";
import { createAppStore }     from "@repo/store";
import { configureApiClient } from "@repo/api-client/http";
import { configureLogger }    from "@repo/logger";
import { QueryProvider, createQueryClient } from "@repo/query";
import { TranslationProvider } from "@repo/i18n/react";
import { Toaster }            from "@repo/ui/components/ui/sonner";
import { ThemeProvider }      from "@repo/ui/providers/ThemeProvider";
import "./index.css";
import App from "./App.tsx";

// ── 1. Configure logger ───────────────────────────────────────────────────────
configureLogger({
  level:  (import.meta.env.VITE_LOG_LEVEL as "debug" | "info" | "warn" | "error") ?? "info",
  prefix: "demo",
});

// ── 2. Configure HTTP client ──────────────────────────────────────────────────
configureApiClient({ apiBase: import.meta.env.VITE_API_URL ?? "" });

// ── 3. Create Redux store ─────────────────────────────────────────────────────
const store = createAppStore();

// ── 4. Create TanStack Query client ──────────────────────────────────────────
const queryClient = createQueryClient();

// ── 5. Render ────────────────────────────────────────────────────────────────
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
