import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ApiClientConfig {
  /** Base URL for all requests, e.g. "https://api.example.com" */
  apiBase?: string;
  /** Default request timeout in milliseconds */
  timeout?: number;
  /** Called when a 401 is received — use to redirect to login */
  onUnauthorized?: () => void;
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let _instance: AxiosInstance | null = null;
let _onUnauthorized: (() => void) | undefined;

/**
 * Returns the shared Axios instance. Creates it on first call.
 * Use `configureApiClient` to set options before the first call.
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

  // ── Request interceptor ──────────────────────────────────────────────────
  _instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token =
        typeof window !== "undefined"
          ? (localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token"))
          : null;

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    },
    (error: unknown) => Promise.reject(error)
  );

  // ── Response interceptor ─────────────────────────────────────────────────
  _instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        _onUnauthorized?.();
      }
      return Promise.reject(error);
    }
  );

  return _instance;
}

/**
 * Configure the shared API client before it is first used.
 * Call this once at app startup (e.g. in main.tsx).
 *
 * @example
 * configureApiClient({ apiBase: import.meta.env.VITE_API_URL });
 */
export function configureApiClient(config: ApiClientConfig): void {
  // If an instance already exists, patch its defaults in place
  const instance = _instance ?? null;

  _onUnauthorized = config.onUnauthorized;

  if (instance) {
    if (config.apiBase) instance.defaults.baseURL = config.apiBase;
    if (config.timeout) instance.defaults.timeout = config.timeout;
  } else {
    // Create fresh so baseURL is applied from the start
    _instance = axios.create({
      baseURL: config.apiBase ?? "/api",
      timeout: config.timeout ?? 15_000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    _instance.interceptors.request.use(
      (reqConfig: InternalAxiosRequestConfig) => {
        const token =
          typeof window !== "undefined"
            ? (localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token"))
            : null;

        if (token) {
          reqConfig.headers.set("Authorization", `Bearer ${token}`);
        }

        return reqConfig;
      },
      (error: unknown) => Promise.reject(error)
    );

    _instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          _onUnauthorized?.();
        }
        return Promise.reject(error);
      }
    );
  }
}

/** Convenience export for one-off requests */
export function apiRequest<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return getApiClient().request<T>(config);
}

/**
 * Thin helper used by service modules.
 * Makes a GET request and returns the unwrapped response data.
 *
 * @example
 * const data = await request("/api/translations/fr");
 */
export async function request<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await getApiClient().get<T>(url, config);
  return response.data;
}

export default getApiClient;
