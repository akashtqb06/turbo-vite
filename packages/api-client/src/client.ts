/**
 * @module @repo/api-client/http
 *
 * Shared Axios HTTP client for the monorepo.
 *
 * Key design decisions:
 * - **Singleton pattern**: One shared instance per app, configured once at startup.
 * - **Interceptor-based auth**: Bearer token attached on every request automatically.
 * - **Pluggable token source**: Apps can inject `getToken` to read from Redux, memory, etc.
 * - **Centralised 401 handling**: The `onUnauthorized` callback handles session expiry.
 *
 * @example
 * // apps/my-app/src/main.tsx
 * import { configureApiClient } from "@repo/api-client";
 *
 * configureApiClient({
 *   apiBase: import.meta.env.VITE_API_URL,
 *   getToken: () => store.getState().auth.token,
 *   onUnauthorized: () => store.dispatch(clearAuth()),
 * });
 */

import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import type { ApiClientConfig } from "./types.js";

// ── Module-level state ────────────────────────────────────────────────────────

/** Shared Axios instance — lazily created on first call to `getApiClient()`. */
let _instance: AxiosInstance | null = null;

/**
 * Stored configuration callbacks — updated by `configureApiClient()`.
 * Kept separate from the instance so they survive instance recreation.
 */
let _config: Required<Pick<ApiClientConfig, "onUnauthorized" | "getToken">> = {
  onUnauthorized: () => undefined,
  getToken: () => {
    // Default: read from localStorage / sessionStorage
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  },
};

// ── Instance creation ─────────────────────────────────────────────────────────

/**
 * Attaches request and response interceptors to the given Axios instance.
 * Extracted as a separate function to avoid duplicating interceptor logic.
 *
 * @internal
 */
function attachInterceptors(instance: AxiosInstance): void {
  // ── Request interceptor: attach Authorization header ───────────────────────
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = _config.getToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error: unknown) => Promise.reject(error),
  );

  // ── Response interceptor: handle 401 globally ──────────────────────────────
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        _config.onUnauthorized();
      }
      return Promise.reject(error);
    },
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the shared Axios instance. Creates it on first call using `/api` as
 * the default base URL. Call `configureApiClient()` before first use to set the
 * real base URL and auth callbacks.
 *
 * @returns The configured `AxiosInstance` singleton.
 */
export function getApiClient(): AxiosInstance {
  if (_instance) return _instance;

  _instance = axios.create({
    baseURL: "/api",
    timeout: 15_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  attachInterceptors(_instance);
  return _instance;
}

/**
 * Configures the shared Axios client before it is first used.
 * Call this **once** at app startup (before any API calls) in `main.tsx`.
 *
 * If the instance already exists, its `baseURL` and `timeout` defaults are
 * patched in place so existing interceptors are preserved.
 *
 * @param config - Configuration options for the API client.
 *
 * @example
 * // apps/my-app/src/main.tsx
 * configureApiClient({
 *   apiBase:        import.meta.env.VITE_API_URL,
 *   timeout:        30_000,
 *   getToken:       () => store.getState().auth.token,
 *   onUnauthorized: () => { store.dispatch(clearAuth()); navigate("/login"); },
 * });
 */
export function configureApiClient(config: ApiClientConfig): void {
  // Update callbacks so interceptors pick up the latest values
  if (config.onUnauthorized) _config.onUnauthorized = config.onUnauthorized;
  if (config.getToken)       _config.getToken = config.getToken;

  if (_instance) {
    // Patch existing instance — avoids losing attached interceptors
    if (config.apiBase)  _instance.defaults.baseURL = config.apiBase;
    if (config.timeout)  _instance.defaults.timeout = config.timeout;
    return;
  }

  // Create fresh instance with all options from the start
  _instance = axios.create({
    baseURL: config.apiBase ?? "/api",
    timeout: config.timeout ?? 15_000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  attachInterceptors(_instance);
}

/**
 * Makes an HTTP request using the shared Axios instance.
 * A low-level escape hatch — prefer `request()` for GET calls or RTK Query for
 * cached/mutation-heavy flows.
 *
 * @param config - A standard `AxiosRequestConfig` object.
 * @returns The full `AxiosResponse<T>`.
 */
export function apiRequest<T = unknown>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return getApiClient().request<T>(config);
}

/**
 * Convenience helper for GET requests that returns the unwrapped response data.
 *
 * @param url - The endpoint path (relative to configured `apiBase`).
 * @param config - Optional Axios request config overrides.
 * @returns The response body data of type `T`.
 *
 * @example
 * const user = await request<User>("/users/42");
 */
export async function request<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await getApiClient().get<T>(url, config);
  return response.data;
}

export default getApiClient;
