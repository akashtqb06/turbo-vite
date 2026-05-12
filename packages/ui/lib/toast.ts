import { toast } from "sonner";

export const APP_TOAST_EVENT = "repo-toast";

export type AppToastType = "success" | "error" | "info" | "warning" | "loading";

export interface AppToastDetail {
  type?: AppToastType;
  title?: string;
  description?: string;
  duration?: number;
}

export function showToast({
  type = "info",
  title,
  description,
  duration,
}: AppToastDetail) {
  const message = title ?? description ?? "Notification";
  const options = title && description ? { description, duration } : { duration };

  switch (type) {
    case "success":
      toast.success(message, options);
      return;
    case "error":
      toast.error(message, options);
      return;
    case "warning":
      toast.warning(message, options);
      return;
    case "loading":
      toast.loading(message, options);
      return;
    case "info":
    default:
      toast.info(message, options);
      return;
  }
}

export function emitAppToast(detail: AppToastDetail) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<AppToastDetail>(APP_TOAST_EVENT, { detail }));
    return;
  }

  showToast(detail);
}

export { toast };
