import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useAppSelector } from "@repo/store";
import { APP_TOAST_EVENT, showToast } from "@repo/ui/lib/toast";
import type { AppToastDetail } from "@repo/ui/lib/toast";
import { AppLayout } from "./components/AppLayout";
import { OverviewPage } from "./pages/OverviewPage";
import { ButtonsPage } from "./pages/ButtonsPage";
import { InputsPage } from "./pages/InputsPage";
import { BadgesPage } from "./pages/BadgesPage";
import { OverlaysPage } from "./pages/OverlaysPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { TabsPage } from "./pages/TabsPage";
import { TablePage } from "./pages/TablePage";
import { ChartsPage } from "./pages/ChartsPage";

function App() {
  const mode = useAppSelector((s) => s.theme.mode);

  // Bridge the emitAppToast() event bus to the Sonner Toaster instance
  useEffect(() => {
    function onToastEvent(e: Event) {
      showToast((e as CustomEvent<AppToastDetail>).detail ?? {});
    }
    window.addEventListener(APP_TOAST_EVENT, onToastEvent);
    return () => window.removeEventListener(APP_TOAST_EVENT, onToastEvent);
  }, []);

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/"         element={<OverviewPage />} />
          <Route path="/buttons"  element={<ButtonsPage />} />
          <Route path="/inputs"   element={<InputsPage />} />
          <Route path="/badges"   element={<BadgesPage />} />
          <Route path="/overlays" element={<OverlaysPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/tabs"     element={<TabsPage />} />
          <Route path="/table"    element={<TablePage />} />
          <Route path="/charts"   element={<ChartsPage />} />
        </Routes>
      </AppLayout>
      <Toaster
        theme={mode}
        position="top-right"
        richColors
        closeButton
        style={{
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties}
      />
    </>
  );
}

export default App;
