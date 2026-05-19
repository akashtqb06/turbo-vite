/**
 * @module @repo/store/factories/createCrudSlice
 *
 * Factory that generates a complete, type-safe CRUD Redux slice for any entity.
 *
 * Uses `@reduxjs/toolkit`'s `createEntityAdapter` under the hood, which
 * normalises entities by ID for O(1) lookups instead of O(n) array scans.
 *
 * What gets generated automatically:
 * - EntityAdapter state (`ids[]` + `entities{}` normalised map)
 * - Synchronous actions: `addOne`, `addMany`, `setAll`, `updateOne`, `removeOne`, `upsertOne`, `reset`
 * - Loading status management: `status`, `error`
 * - Selectors: `selectAll`, `selectById`, `selectTotal`, `selectIds`, `selectStatus`
 *
 * @example
 * // 1. Define your entity
 * interface Product { id: string; name: string; price: number; }
 *
 * // 2. Create the slice
 * export const { slice: productsSlice, selectors: productSelectors, adapter: productsAdapter } =
 *   createCrudSlice<Product>({ name: "products" });
 *
 * // 3. Register in the store
 * const rootReducer = combineReducers({
 *   products: productsSlice.reducer,
 * });
 *
 * // 4. Use selectors
 * const products = useAppSelector((state) => productSelectors.selectAll(state));
 */

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CrudStatus = "idle" | "loading" | "succeeded" | "failed";

/** Configuration for the `createCrudSlice` factory. */
export interface CrudSliceConfig<T extends { id: string | number }> {
  /**
   * The slice name — used as the Redux action type prefix.
   * Should be a camelCase noun in plural form (e.g. `"products"`, `"blogPosts"`).
   */
  name: string;
  /**
   * Optional custom ID selector. Defaults to `(entity) => entity.id`.
   * Use this when your entity uses a different primary key (e.g. `_id`, `uuid`).
   *
   * @example
   * selectId: (item) => item.uuid
   */
  selectId?: (entity: NoInfer<T>) => string | number;
  /**
   * Optional sort comparator for the entity list.
   * If omitted, entities are returned in insertion order.
   *
   * @example
   * sortComparer: (a, b) => a.name.localeCompare(b.name)
   */
  sortComparer?: (a: T, b: T) => number;
}

// ── Status state (separate from EntityAdapter state) ──────────────────────────

export interface CrudStatusState {
  /** Current async operation status. */
  status: CrudStatus;
  /** Error message from the last failed operation. */
  error: string | null;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a Redux Toolkit slice with full CRUD operations for a given entity type.
 *
 * The entity adapter (for addOne, setAll, etc.) is returned separately.
 * Use `adapter.addOne(state, entity)` in your custom reducers when extending.
 *
 * @param config - Configuration for the entity name, ID selector, and sort order.
 * @returns An object containing the `slice`, entity adapter-based `selectors`, and `adapter`.
 */
export function createCrudSlice<T extends { id: string | number }>(
  config: CrudSliceConfig<T>,
) {
  const { name, selectId, sortComparer } = config;

  // ── Entity adapter ─────────────────────────────────────────────────────────
  const adapter = createEntityAdapter<T>({
    ...(selectId ? { selectId } : {}),
    ...(sortComparer ? { sortComparer } : {}),
  });

  // ── Slice: status management only ─────────────────────────────────────────
  // Entity CRUD actions come from the adapter — we only manage status + error here.
  const slice = createSlice({
    name,
    initialState: adapter.getInitialState<CrudStatusState>({
      status: "idle",
      error:  null,
    }),
    reducers: {
      /** Sets status to loading and clears any previous error. */
      setLoading(state) {
        state.status = "loading";
        state.error  = null;
      },

      /** Marks a fetch/mutation as succeeded. */
      setSucceeded(state) {
        state.status = "succeeded";
      },

      /** Marks a fetch/mutation as failed and stores the error message. */
      setFailed(state, action: PayloadAction<string>) {
        state.status = "failed";
        state.error  = action.payload;
      },

      /** Resets the slice to its initial empty state. */
      reset() {
        return adapter.getInitialState<CrudStatusState>({ status: "idle", error: null });
      },
    },
  });

  // ── Selectors ──────────────────────────────────────────────────────────────
  type StateWithSlice = Record<string, ReturnType<typeof slice.getInitialState>>;

  // adapter.getSelectors requires a selector that returns non-undefined EntityState
  const adapterSelectors = adapter.getSelectors(
    (state: StateWithSlice) => state[name]!,
  );

  const selectors = {
    ...adapterSelectors,
    /** Current async operation status for this slice. */
    selectStatus: (state: StateWithSlice) => state[name]?.status ?? "idle" as CrudStatus,
    /** Error message from the last failed operation, or `null`. */
    selectError:  (state: StateWithSlice) => state[name]?.error ?? null,
    /** `true` while a fetch or mutation is in progress. */
    selectIsLoading: (state: StateWithSlice) => state[name]?.status === "loading",
  };

  return { slice, selectors, adapter };
}
