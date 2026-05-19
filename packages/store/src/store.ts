import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme.slice.js";
import preferencesReducer from "./slices/preferences.slice.js";
import { baseApi } from "./api/baseApi.js";

// ─── Root reducer ─────────────────────────────────────────────────────────────

const rootReducer = combineReducers({
  theme:              themeReducer,
  preferences:        preferencesReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The full Redux state tree shape.
 * Derived from the root reducer, not from the store, to avoid circular refs.
 */
export type RootState  = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof createAppStore>["dispatch"];
export type AppStore    = ReturnType<typeof createAppStore>;

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a new Redux store instance.
 *
 * Each app (e.g. apps/demo, apps/dashboard) calls this once in its entrypoint
 * and passes the result to `<Provider store={store}>`. Using a factory instead
 * of a module-level singleton allows:
 *  - Independent stores per app in the monorepo
 *  - Clean test isolation (each test creates its own store)
 *  - SSR-safe (no shared state between requests)
 *
 * @example
 * // apps/demo/src/main.tsx
 * const store = createAppStore();
 * root.render(<Provider store={store}><App /></Provider>);
 */
export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}
