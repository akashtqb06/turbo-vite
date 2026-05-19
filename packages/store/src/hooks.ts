/**
 * @module @repo/store/hooks
 *
 * Typed Redux hooks and domain-specific convenience hooks.
 *
 * - `useAppDispatch` / `useAppSelector` — typed wrappers around react-redux hooks
 * - `useTheme()` — active theme + mode + setters
 * - `usePreferences()` — language, sidebar + setters
 * - `useAuth()` — current user, auth status, credentials actions
 * - `useNotifications()` — notification list, unread count, add/mark/clear
 * - `useModal()` — typed modal open/close/props for a specific modal ID
 */

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store.js";

// ── Slice selectors ───────────────────────────────────────────────────────────
import {
  selectThemes, selectActiveTheme, selectActiveThemeId, selectThemeMode, selectThemeStatus,
  setActiveTheme, setMode, toggleMode,
} from "./slices/theme.slice.js";
import {
  selectLanguageCode, selectSidebarCollapsed, selectPrefsHydrated,
  setLanguage, setSidebarCollapsed, toggleSidebar,
} from "./slices/preferences.slice.js";
import {
  selectUser, selectIsAuthenticated, selectAuthStatus, selectAuthToken,
  setCredentials, clearAuth,
} from "./slices/auth.slice.js";
import type { AuthUser, LoginCredentials, AuthTokens } from "./slices/auth.slice.js";
import {
  selectNotifications, selectUnreadCount, selectUnreadNotifications,
  addNotification, markAsRead, markAllAsRead, removeNotification, clearNotifications,
} from "./slices/notifications.slice.js";
import type { NewNotification } from "./slices/notifications.slice.js";
import {
  selectModalById, selectIsModalOpen,
  openModal, closeModal,
} from "./slices/modal.slice.js";

// ── Re-export types for convenience ──────────────────────────────────────────
export type { AuthUser, LoginCredentials, AuthTokens };

// ── Typed Redux hooks ─────────────────────────────────────────────────────────

/**
 * Typed dispatch hook. Knows about all action types including thunks.
 * Always use this instead of the plain `useDispatch` from react-redux.
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(setMode("dark"));
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed selector hook. Auto-infers `RootState` without manual type annotation.
 * Always use this instead of the plain `useSelector` from react-redux.
 *
 * @example
 * const mode = useAppSelector(s => s.theme.mode);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ── Domain hooks ──────────────────────────────────────────────────────────────

/**
 * Returns the current theme state and actions.
 * Must be used inside a Redux `<Provider>`.
 *
 * @returns `{ themes, activeTheme, activeThemeId, mode, isLoading, setTheme, setMode, toggleMode }`
 *
 * @example
 * const { mode, toggleMode } = useTheme();
 * <button onClick={toggleMode}>{mode === "dark" ? "☀️" : "🌙"}</button>
 */
export function useTheme() {
  const dispatch = useAppDispatch();
  return {
    themes:        useAppSelector(selectThemes),
    activeTheme:   useAppSelector(selectActiveTheme),
    activeThemeId: useAppSelector(selectActiveThemeId),
    mode:          useAppSelector(selectThemeMode),
    isLoading:     useAppSelector(selectThemeStatus) === "loading",
    setTheme:      (id: string)              => dispatch(setActiveTheme(id)),
    setMode:       (m: "light" | "dark")    => dispatch(setMode(m)),
    toggleMode:    ()                        => dispatch(toggleMode()),
  };
}

/**
 * Returns user preferences state and mutators.
 *
 * @returns `{ languageCode, sidebarCollapsed, hydrated, setLanguage, setSidebarCollapsed, toggleSidebar }`
 *
 * @example
 * const { sidebarCollapsed, toggleSidebar } = usePreferences();
 */
export function usePreferences() {
  const dispatch = useAppDispatch();
  return {
    languageCode:       useAppSelector(selectLanguageCode),
    sidebarCollapsed:   useAppSelector(selectSidebarCollapsed),
    hydrated:           useAppSelector(selectPrefsHydrated),
    setLanguage:        (code: string)  => dispatch(setLanguage(code)),
    setSidebarCollapsed:(v: boolean)    => dispatch(setSidebarCollapsed(v)),
    toggleSidebar:      ()              => dispatch(toggleSidebar()),
  };
}

/**
 * Returns the current authentication state and credential actions.
 *
 * @returns `{ user, token, isAuthenticated, status, login, logout, updateToken }`
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 * if (!isAuthenticated) return <Navigate to="/login" />;
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  return {
    user:             useAppSelector(selectUser),
    token:            useAppSelector(selectAuthToken),
    isAuthenticated:  useAppSelector(selectIsAuthenticated),
    status:           useAppSelector(selectAuthStatus),
    /** Stores credentials in state and the appropriate storage. */
    login:  (tokens: AuthTokens & { rememberMe?: boolean }) => dispatch(setCredentials(tokens)),
    /** Clears all auth state and tokens from storage. */
    logout: ()                                              => dispatch(clearAuth()),
  };
}

/**
 * Returns in-app notifications and actions for managing them.
 *
 * @returns `{ notifications, unreadCount, unread, add, markRead, markAllRead, remove, clear }`
 *
 * @example
 * const { unreadCount, add } = useNotifications();
 * add({ type: "success", title: "Saved!", message: "Your changes were saved." });
 */
export function useNotifications() {
  const dispatch = useAppDispatch();
  return {
    notifications: useAppSelector(selectNotifications),
    unreadCount:   useAppSelector(selectUnreadCount),
    unread:        useAppSelector(selectUnreadNotifications),
    add:           (n: NewNotification)  => dispatch(addNotification(n)),
    markRead:      (id: string)          => dispatch(markAsRead(id)),
    markAllRead:   ()                    => dispatch(markAllAsRead()),
    remove:        (id: string)          => dispatch(removeNotification(id)),
    clear:         ()                    => dispatch(clearNotifications()),
  };
}

/**
 * Returns the open/close/props interface for a specific modal by ID.
 * Use the generic `<T>` to type the modal's props for full type safety.
 *
 * @param modalId - The unique modal identifier (e.g. `"deleteConfirm"`, `"userEdit"`).
 * @returns `{ isOpen, props, open, close }`
 *
 * @example
 * // In a button component
 * const { open } = useModal<{ itemId: string }>("deleteConfirm");
 * <button onClick={() => open({ itemId: item.id })}>Delete</button>
 *
 * // In the modal component
 * const { isOpen, props, close } = useModal<{ itemId: string }>("deleteConfirm");
 * if (!isOpen) return null;
 * // props.itemId is typed as string
 */
export function useModal<T extends Record<string, unknown> = Record<string, unknown>>(
  modalId: string,
) {
  const dispatch = useAppDispatch();
  const entry    = useAppSelector(selectModalById(modalId));
  const isOpen   = useAppSelector(selectIsModalOpen(modalId));

  return {
    isOpen,
    props:  (entry?.props ?? {}) as T,
    open:   (props: T = {} as T) => dispatch(openModal({ id: modalId, props })),
    close:  ()                   => dispatch(closeModal(modalId)),
  };
}
