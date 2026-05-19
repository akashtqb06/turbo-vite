/**
 * @module @repo/store/slices/modal
 *
 * Redux slice for the global modal/drawer registry.
 *
 * Problem solved:
 * Without a centralised modal registry, modals require prop-drilling their
 * `open` state and `onClose` callback through component trees. This slice
 * provides an application-wide modal stack — any component can open or close
 * any modal type without being in the same subtree.
 *
 * Usage pattern:
 * ```tsx
 * // Opening a modal from anywhere in the tree
 * const { open } = useModal("deleteConfirm");
 * open({ itemId: "123", itemName: "Product X" });
 *
 * // In the modal component
 * const { isOpen, props, close } = useModal("deleteConfirm");
 * if (!isOpen) return null;
 * // props.itemId, props.itemName are now typed via the generic
 * ```
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ── Types ─────────────────────────────────────────────────────────────────────

/** A single entry in the modal stack. */
export interface ModalEntry {
  /** Unique identifier for this modal type (e.g. "deleteConfirm", "userEdit"). */
  id: string;
  /**
   * Arbitrary props passed to the modal. The `useModal<T>` generic narrows this
   * to the correct type at the call site.
   */
  props: Record<string, unknown>;
}

export interface ModalState {
  /**
   * The current modal stack. Multiple modals can be open simultaneously
   * (e.g. a drawer opens a confirmation dialog). The last element is "on top".
   */
  stack: ModalEntry[];
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const modalSlice = createSlice({
  name: "modal",
  initialState: { stack: [] } as ModalState,
  reducers: {
    /**
     * Opens a modal by pushing it onto the stack.
     * If a modal with the same `id` is already open, its props are updated.
     *
     * @example
     * dispatch(openModal({ id: "deleteConfirm", props: { itemId: "42" } }));
     */
    openModal(state, action: PayloadAction<ModalEntry>) {
      const existing = state.stack.findIndex((m) => m.id === action.payload.id);
      if (existing !== -1) {
        // Update props in place rather than duplicating the modal
        state.stack[existing] = action.payload;
      } else {
        state.stack.push(action.payload);
      }
    },

    /**
     * Closes (removes) a specific modal by its ID.
     *
     * @example
     * dispatch(closeModal("deleteConfirm"));
     */
    closeModal(state, action: PayloadAction<string>) {
      state.stack = state.stack.filter((m) => m.id !== action.payload);
    },

    /**
     * Closes all open modals at once.
     * Useful on navigation or global error scenarios.
     *
     * @example
     * dispatch(closeAllModals());
     */
    closeAllModals(state) {
      state.stack = [];
    },
  },
});

// ── Exports ───────────────────────────────────────────────────────────────────

export const modalActions = modalSlice.actions;
export const { openModal, closeModal, closeAllModals } = modalSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export interface RootStateWithModal {
  modal: ModalState;
}

/**
 * Returns the modal entry for a given ID, or `undefined` if not open.
 * Used internally by `useModal()` in hooks.ts.
 */
export const selectModalById = (id: string) =>
  (state: RootStateWithModal): ModalEntry | undefined =>
    state.modal.stack.find((m) => m.id === id);

/** Returns `true` if a modal with the given ID is currently open. */
export const selectIsModalOpen = (id: string) =>
  (state: RootStateWithModal): boolean =>
    state.modal.stack.some((m) => m.id === id);

/** The full modal stack (read-only). */
export const selectModalStack = (state: RootStateWithModal): ModalEntry[] => state.modal.stack;

export default modalSlice.reducer;
