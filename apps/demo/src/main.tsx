import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { configureApiClient } from "@repo/api-client/http";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { ThemeProvider } from "@repo/ui/components/ui/theme-provider";
import { TranslationProvider } from "@repo/ui/components/ui/translation-provider";
import "./index.css";
import App from "./App.tsx";

configureApiClient({
  apiBase: import.meta.env.VITE_API_URL,
});

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
      <TranslationProvider>
        <BrowserRouter>
            <App />
            <Toaster richColors position="top-right" />
        </BrowserRouter>
      </TranslationProvider>
    </ThemeProvider>
);
