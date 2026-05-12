import { useEffect } from "react";

import { cn } from "../../lib/utils";
import { Spinner } from "./spinner";
import { useTranslation } from "./translation-provider";

const fullscreenLoadingListeners = new Set<(count: number) => void>();

let fullscreenLoadingCount = 0;

function emitFullscreenLoadingChange() {
  fullscreenLoadingListeners.forEach((listener) =>
    listener(fullscreenLoadingCount)
  );
}

function beginFullscreenLoading() {
  fullscreenLoadingCount += 1;
  emitFullscreenLoadingChange();
}

function endFullscreenLoading() {
  fullscreenLoadingCount = Math.max(0, fullscreenLoadingCount - 1);
  emitFullscreenLoadingChange();
}

export function getFullscreenLoadingCount() {
  return fullscreenLoadingCount;
}

export function subscribeToFullscreenLoading(
  listener: (count: number) => void
) {
  fullscreenLoadingListeners.add(listener);

  return () => {
    fullscreenLoadingListeners.delete(listener);
  };
}

interface LoadingScreenProps {
  active?: boolean;
  message?: string;
  fullscreen?: boolean;
  registerFullscreenActivity?: boolean;
  className?: string;
  surfaceClassName?: string;
}

export function LoadingScreen({
  active = true,
  message,
  fullscreen = true,
  registerFullscreenActivity = true,
  className,
  surfaceClassName,
}: LoadingScreenProps) {
  const { t } = useTranslation();
  const resolvedMessage = message ?? t("Loading...", "Loading...");

  useEffect(() => {
    if (!fullscreen || !registerFullscreenActivity || !active) {
      return;
    }

    beginFullscreenLoading();

    return () => {
      endFullscreenLoading();
    };
  }, [active, fullscreen, registerFullscreenActivity]);

  if (!active) {
    return null;
  }

  return (
    <div
      className={cn(
        fullscreen
          ? "fixed inset-0 z-130 flex items-center justify-center bg-background/55 px-6 backdrop-blur-[1px]"
          : "flex min-h-screen items-center justify-center px-6",
        className
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border bg-background/95 px-4 py-2 text-sm text-muted-foreground shadow-lg backdrop-blur",
          surfaceClassName
        )}
      >
        <Spinner className="h-4 w-4" />
        <span>{resolvedMessage}</span>
      </div>
    </div>
  );
}
