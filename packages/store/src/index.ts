/**
 * @module @repo/store
 *
 * Public API barrel for `@repo/store`.
 *
 * Prefer subpath imports for better tree-shaking in large apps:
 *   import { useTheme }        from "@repo/store/hooks";
 *   import { authActions }     from "@repo/store/slices/auth";
 *   import { createCrudSlice } from "@repo/store/factories/createCrudSlice";
 *
 * Or import from the root for convenience:
 *   import { createAppStore, useAuth, createCrudSlice } from "@repo/store";
 */

// ── Store factory + types ─────────────────────────────────────────────────────
export { createAppStore }           from "./store.js";
export type { AppStore, RootState, AppDispatch, AppStoreConfig } from "./store.js";

// ── Typed + domain hooks ──────────────────────────────────────────────────────
export {
  useAppDispatch,
  useAppSelector,
  useTheme,
  usePreferences,
  useAuth,
  useNotifications,
  useModal,
}                                   from "./hooks.js";
export type { AuthUser, LoginCredentials, AuthTokens } from "./hooks.js";

// ── Theme slice ───────────────────────────────────────────────────────────────
export {
  themeActions, setActiveTheme, setMode, toggleMode, fetchThemes,
  selectThemes, selectActiveTheme, selectActiveThemeId, selectThemeMode, selectThemeStatus,
}                                   from "./slices/theme.slice.js";
export type { ThemeState, ThemeMode } from "./slices/theme.slice.js";

// ── Preferences slice ─────────────────────────────────────────────────────────
export {
  preferencesActions, setLanguage, setSidebarCollapsed, toggleSidebar, initPreferences,
  selectLanguageCode, selectSidebarCollapsed, selectPrefsHydrated,
}                                   from "./slices/preferences.slice.js";
export type { PreferencesState }    from "./slices/preferences.slice.js";

// ── Auth slice ────────────────────────────────────────────────────────────────
export {
  authActions, setCredentials, clearAuth, updateAccessToken, logoutThunk,
  selectUser, selectAuthToken, selectIsAuthenticated, selectAuthStatus,
}                                   from "./slices/auth.slice.js";
export type { AuthState }           from "./slices/auth.slice.js";

// ── Notifications slice ───────────────────────────────────────────────────────
export {
  notificationsActions,
  addNotification, markAsRead, markAllAsRead, removeNotification, clearNotifications,
  notificationsSelectors,
  selectNotifications, selectUnreadCount, selectUnreadNotifications,
}                                   from "./slices/notifications.slice.js";
export type { Notification, NotificationType, NewNotification } from "./slices/notifications.slice.js";

// ── Modal slice ───────────────────────────────────────────────────────────────
export {
  modalActions, openModal, closeModal, closeAllModals,
  selectModalById, selectIsModalOpen, selectModalStack,
}                                   from "./slices/modal.slice.js";
export type { ModalState, ModalEntry } from "./slices/modal.slice.js";

// ── UI slice ──────────────────────────────────────────────────────────────────
export {
  uiActions, setGlobalLoading, setPageTitle, setBreadcrumbs, resetUi,
  selectGlobalLoading, selectPageTitle, selectBreadcrumbs,
}                                   from "./slices/ui.slice.js";
export type { UiState, Breadcrumb } from "./slices/ui.slice.js";

// ── CRUD slice factory ────────────────────────────────────────────────────────
export { createCrudSlice }          from "./factories/createCrudSlice.js";
export type { CrudStatus, CrudStatusState, CrudSliceConfig } from "./factories/createCrudSlice.js";

// ── RTK Query API ─────────────────────────────────────────────────────────────
export { baseApi, axiosBaseQuery }  from "./api/baseApi.js";
export { themeApi, useGetThemesQuery, useGetThemeByIdQuery } from "./api/themeApi.js";
