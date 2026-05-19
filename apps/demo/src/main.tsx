import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createAppStore } from "@repo/store";
import { configureApiClient } from "@repo/api-client/http";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { ThemeProvider } from "@repo/ui/providers/ThemeProvider";
import { TranslationProvider } from "@repo/ui/components/ui/translation-provider";
import "./index.css";
import App from "./App.tsx";

// Configure Axios base URL from environment
configureApiClient({
  apiBase: import.meta.env.VITE_API_URL,
});

// Create the Redux store — one instance per app
const store = createAppStore();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <TranslationProvider>
        <BrowserRouter>
          <App />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </TranslationProvider>
    </ThemeProvider>
  </Provider>
);
