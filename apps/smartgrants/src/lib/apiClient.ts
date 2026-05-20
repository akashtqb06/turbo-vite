/**
 * @module smartgrants/apiClient
 *
 * Configures the shared `@repo/api-client` Axios singleton with
 * SmartGrants-specific interceptors migrated from the legacy `AxiosInstance.js`.
 *
 * Legacy behaviours preserved:
 *  - Default headers bootstrapped from localStorage at startup:
 *      · `CSRF-Token`   ← window._cft (if present at init time)
 *      · `x-useremail`  ← localStorage "email" (only on localhost:3005)
 *  - Per-request CSRF token refresh (`window._cft` re-read on every request)
 *  - Base64-encoded JSON body for POST requests flagged with `x-odp-encode: json`
 *    → transforms `req.data` to `{ payload: base64(JSON.stringify(data)) }`
 *  - `x-ref-filter` header base64-encoded when present
 *  - 401 / 403 response → redirect to `/api/login?fa=true&backUrl=<pathname>`
 *
 * Call `initApiClient()` once in `main.tsx` before any API calls are made.
 */

import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { configureApiClient, getApiClient } from "@repo/api-client/http";

// ── Window type augmentation ──────────────────────────────────────────────────

declare global {
  interface Window {
    /** CSRF token injected by the server-side template / getUserInfo response. */
    _cft?: string;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Base64-encode any JSON-serialisable value. */
function toBase64(value: unknown): string {
  return btoa(JSON.stringify(value));
}

/** True when running on the legacy localhost dev port. */
function isLocalhostDev(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const href = window.top?.location.href ?? window.location.href;
    return href.indexOf("https://localhost:3005") === 0;
  } catch {
    // Cross-origin iframe — window.top access will throw
    return false;
  }
}

// ── Bootstrap default headers from localStorage (mirrors legacy module-level setup) ──

/**
 * Reads localStorage at startup and returns the initial default headers
 * to bake into the Axios instance — replicating the legacy:
 *
 *   var headers = {
 *     'CSRF-Token': window._cft,
 *     ...(isLocalhost && email ? { 'x-useremail': email } : {}),
 *   };
 */
function buildDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  // CSRF token available at page load (server-rendered global)
  if (typeof window !== "undefined" && window._cft) {
    headers["CSRF-Token"] = window._cft;
  }

  // x-useremail — only injected on localhost:3005 (legacy dev workaround)
  if (isLocalhostDev()) {
    const email = localStorage.getItem("email");
    if (email) {
      headers["x-useremail"] = email;
    }
  }

  return headers;
}

// ── Request interceptor ───────────────────────────────────────────────────────

function applyRequestInterceptors(): void {
  const client = getApiClient();

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 1. Refresh x-useremail from localStorage on every request (legacy behaviour:
      //    the original code read it per-request via the headers object closure)
      if (isLocalhostDev()) {
        const email = localStorage.getItem("email");
        if (email) {
          config.headers.set("x-useremail", email);
        }
      }

      // 2. Base64-encode POST body when x-odp-encode: json is set
      const isPost = ["post", "POST"].includes(config.method ?? "");
      const isUpload =
        config.url?.includes("uploadContent") ||
        config.url?.includes("/gs/grant/edit") ||
        config.url?.includes("/gs/grant/new");

      if (isPost && !isUpload) {
        const encodeHeader = config.headers.get("x-odp-encode") as
          | string
          | null;

        if (encodeHeader === "json" && config.data !== undefined) {
          // Encode x-ref-filter header value if present
          const refFilter = config.headers.get("x-ref-filter");
          if (refFilter) {
            config.headers.set("x-ref-filter", toBase64(refFilter));
          }

          // Wrap body as { payload: base64(json) }
          config.data = { payload: toBase64(config.data) };
        }
      }

      // 3. Always re-read CSRF token from the global — it gets updated after
      //    getUserInfo() resolves and writes window._cft from the response header
      if (window._cft) {
        config.headers.set("CSRF-Token", window._cft);
      }

      return config;
    },
    (error: unknown) => Promise.reject(error),
  );
}

// ── Response interceptor ──────────────────────────────────────────────────────

function applyResponseInterceptors(): void {
  const client = getApiClient();

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        let backUrlPath: string;
        try {
          backUrlPath = window.top?.location.pathname ?? window.location.pathname;
          const search = window.top?.location.search ?? "";
          backUrlPath += search;
        } catch {
          backUrlPath = window.location.pathname + window.location.search;
        }

        window.location.href = `/api/login?fa=true&backUrl=${encodeURIComponent(backUrlPath)}`;
        return new Promise(() => {
          // Intentionally never resolves — navigation is in progress
        });
      }

      console.error("AXIOS ERR →", error);
      return Promise.reject(error);
    },
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Initialise the SmartGrants API client.
 * Call **once** in `main.tsx` before rendering the React tree.
 *
 * Bootstraps default headers from localStorage/window globals exactly as the
 * legacy `AxiosInstance.js` did at module-evaluation time, then wires up all
 * request/response interceptors.
 *
 * @param apiBase - Base URL for all API calls (defaults to `/api`).
 * @param getToken - Optional function returning the current auth token.
 */
export function initApiClient(
  apiBase: string = "/api",
  getToken?: () => string | null | undefined,
): void {
  const defaultHeaders = buildDefaultHeaders();

  configureApiClient({
    apiBase,
    getToken,
    // Pass default headers through the config so they're baked into
    // the Axios instance from the start (mirrors legacy var headers = {...})
    ...(Object.keys(defaultHeaders).length > 0 && {
      // Note: @repo/api-client merges headers internally via axios.create
      // We patch them after creation via defaults if needed
    }),
  });

  // Patch default headers directly onto the instance after creation
  const client = getApiClient();
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    client.defaults.headers.common[key] = value;
  });

  applyRequestInterceptors();
  applyResponseInterceptors();
}

// Re-export for convenience
export { getApiClient } from "@repo/api-client/http";

/**
 * Typed helper — POST with ODP base64 encoding enabled.
 * Sets `x-odp-encode: json` so the request interceptor wraps the body automatically.
 *
 * @example
 * const result = await postEncoded<MyResponse>("/gs/grant/submit", payload, myFilter);
 */
export async function postEncoded<TResponse = unknown>(
  url: string,
  data: unknown,
  refFilter?: unknown,
): Promise<TResponse> {
  const client = getApiClient();
  const headers: Record<string, string> = { "x-odp-encode": "json" };
  if (refFilter !== undefined) {
    headers["x-ref-filter"] = JSON.stringify(refFilter);
  }
  const resp = await client.post<TResponse>(url, data, { headers });
  return resp.data;
}

export default getApiClient;
