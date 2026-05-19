/**
 * @module @repo/store/store
 *
 * Root Redux store factory for the monorepo.
 *
 * Design decisions:
 * - **Factory pattern** (not module-level singleton): Each app calls `createAppStore()`
 *   once in `main.tsx`. This allows:
 *     - Independent stores per app in the monorepo
 *     - Clean test isolation (each test creates a fresh store)
 *     - SSR safety (no shared state between requests)
 * - **Middleware layering**: Logger → Error → RTK defaults (thunk, immutability check)
 * - **Dev-only logger middleware**: Auto-excluded from production bundles via tree-shaking
 */

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { Reducer } from "@reduxjs/toolkit";
import themeReducer         from "./slices/theme.slice.js";
import preferencesReducer   from "./slices/preferences.slice.js";
import authReducer          from "./slices/auth.slice.js";
import notificationsReducer from "./slices/notifications.slice.js";
import modalReducer         from "./slices/modal.slice.js";
import uiReducer            from "./slices/ui.slice.js";
import { baseApi }          from "./api/baseApi.js";
import { loggerMiddleware }  from "./middleware/loggerMiddleware.js";
import { errorMiddleware }   from "./middleware/errorMiddleware.js";

// ── Root reducer ─────────────────────────────────────────────────────────────

/**
 * The combined root reducer.
 * New slices MUST be registered here and exported from `src/index.ts`.
 */
const rootReducer = combineReducers({
  // ── Domain slices ───────────────────────────────────────────────────────────
  theme:         themeReducer,
  preferences:   preferencesReducer,
  auth:          authReducer,
  // ── UI slices ───────────────────────────────────────────────────────────────
  notifications: notificationsReducer,
  modal:         modalReducer,
  ui:            uiReducer,
  // ── RTK Query cache ─────────────────────────────────────────────────────────
  [baseApi.reducerPath]: baseApi.reducer,
});

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * The full Redux state tree.
 * Derived from `rootReducer` (not the store) to avoid circular references.
 */
export type RootState   = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof createAppStore>["dispatch"];
export type AppStore    = ReturnType<typeof createAppStore>;

// ── Store configuration ───────────────────────────────────────────────────────

/** Options for the `createAppStore` factory. */
export interface AppStoreConfig {
  /**
   * Optional pre-loaded state (e.g. from SSR, server snapshot, or tests).
   * Only the provided slice states are merged — others use their own `initialState`.
   */
  preloadedState?: Partial<RootState>;
  /**
   * App-specific extra reducers to inject into the root reducer.
   * Use this in apps that define their own slices beyond the shared ones.
   *
   * @example
   * createAppStore({
   *   extraReducers: {
   *     products: productsSlice.reducer,
   *   },
   * });
   */
  extraReducers?: Record<string, Reducer>;
  /**
   * If `true`, disables Redux DevTools Extension. Defaults to `false`.
   * Set to `true` in production or when DevTools cause performance issues.
   */
  disableDevtools?: boolean;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates and configures a new Redux store instance.
 *
 * Call this **once** at app startup in `main.tsx`:
 * ```tsx
 * const store = createAppStore();
 * root.render(<Provider store={store}><App /></Provider>);
 * ```
 *
 * @param config - Optional store configuration (preloadedState, extraReducers, etc.)
 * @returns A fully configured Redux store.
 *
 * @example
 * // With pre-loaded state (e.g. from SSR or test setup):
 * const store = createAppStore({
 *   preloadedState: { auth: { status: "authenticated", user: mockUser } },
 * });
 *
 * @example
 * // With app-specific reducers:
 * const store = createAppStore({
 *   extraReducers: { products: productsSlice.reducer },
 * });
 */
export function createAppStore(config: AppStoreConfig = {}) {
  const { preloadedState, extraReducers, disableDevtools = false } = config;

  // Merge app-specific reducers with the shared root reducer if provided
  const finalReducer = extraReducers
    ? combineReducers({ ...rootReducer({} as RootState, { type: "@@INIT" }), ...extraReducers } as Parameters<typeof combineReducers>[0])
    : rootReducer;

  return configureStore({
    reducer: finalReducer as typeof rootReducer,
    preloadedState,
    devTools: !disableDevtools,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(errorMiddleware)      // catches reducer errors, re-throws for boundaries
        .concat(loggerMiddleware)     // dev-only: action + state diff logs
        .concat(baseApi.middleware),  // RTK Query: cache invalidation, subscriptions
  });
}
