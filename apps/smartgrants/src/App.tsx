import { useEffect }           from "react";
import { Route, Routes }       from "react-router-dom";
import { Toaster }             from "sonner";
import { useAppSelector }      from "@repo/store";
import { APP_TOAST_EVENT, showToast } from "@repo/ui/lib/toast";
import type { AppToastDetail }        from "@repo/ui/lib/toast";
import { useUserInfo, useThemeConfig } from "./hooks";

// ── Pages (add as you migrate each section) ───────────────────────────────────
// import { DashboardPage } from "./pages/DashboardPage";

function App() {
  const mode = useAppSelector((s) => s.theme.mode);

  // Bootstrap user session — sets window._cft and caches user info.
  // On 401/403 the Axios response interceptor redirects to /api/login automatically.
  const { isError: userError } = useUserInfo();

  // Load app theme config — cached for 10 min
  const { data: theme } = useThemeConfig();

  // Apply theme CSS variables whenever theme config loads
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    if (theme.primaryColor) root.style.setProperty("--sg-primary", theme.primaryColor);
    if (theme.appName)      document.title = theme.appName;
  }, [theme]);

  // Bridge emitAppToast() event bus → Sonner Toaster
  useEffect(() => {
    function onToastEvent(e: Event) {
      showToast((e as CustomEvent<AppToastDetail>).detail ?? {});
    }
    window.addEventListener(APP_TOAST_EVENT, onToastEvent);
    return () => window.removeEventListener(APP_TOAST_EVENT, onToastEvent);
  }, []);

  // Render a minimal fallback for non-auth errors
  // (auth errors are handled by the 401/403 interceptor redirect)
  if (userError) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <p>Unable to load session. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* ── Add migrated pages here ── */}
        <Route
          path="/"
          element={
            <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
              <h1>SmartGrants</h1>
              <p>Migration in progress — add your pages here.</p>
            </div>
          }
        />
      </Routes>

      <Toaster
        theme={mode}
        position="top-right"
        richColors
        closeButton
      />
    </>
  );
}

export default App;
