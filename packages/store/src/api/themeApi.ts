import { baseApi } from "./baseApi.js";
import type { Theme } from "@repo/api-client/services/theme";

// ─── Theme API endpoints ──────────────────────────────────────────────────────

export const themeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetch all available themes.
     * Result is cached indefinitely — themes rarely change at runtime.
     * Refetch by invalidating the "Theme" tag if needed.
     */
    getThemes: builder.query<Theme[], void>({
      query: () => ({ url: "/themes" }),
      providesTags: ["Theme"],
      // Fallback: if the API is not live, RTK Query will error and the
      // theme slice's initTheme thunk falls back to bundled data.
      keepUnusedDataFor: 3600, // 1 hour cache
    }),

    /**
     * Fetch a single theme by ID.
     */
    getThemeById: builder.query<Theme, string>({
      query: (id) => ({ url: `/themes/${id}` }),
      providesTags: (_result, _err, id) => [{ type: "Theme", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetThemesQuery, useGetThemeByIdQuery } = themeApi;
