import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { getApiClient } from "@repo/api-client/http";

// ─── Axios base query ─────────────────────────────────────────────────────────

/**
 * RTK Query base query backed by the shared Axios instance from @repo/api-client.
 *
 * This means every RTK Query request automatically:
 * - Uses the configured baseURL (VITE_API_URL)
 * - Attaches the auth token via the request interceptor
 * - Handles 401 via the response interceptor
 */
export const axiosBaseQuery: BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig["method"];
    data?: unknown;
    params?: unknown;
    headers?: Record<string, string>;
  },
  unknown,
  {
    status?: number;
    data?: unknown;
    message: string;
  }
> = async ({ url, method = "GET", data, params, headers }) => {
  try {
    const result = await getApiClient().request({
      url,
      method,
      data,
      params,
      headers,
    });
    return { data: result.data };
  } catch (err) {
    const axiosError = err as AxiosError;
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      },
    };
  }
};

// ─── Base API ─────────────────────────────────────────────────────────────────

/**
 * The root RTK Query API. All endpoint slices extend this via `injectEndpoints`.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/code-splitting
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Theme", "Preferences"],
  endpoints: () => ({}),
});
