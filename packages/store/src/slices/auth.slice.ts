/**
 * @module @repo/store/slices/auth
 *
 * Redux slice for authentication state management.
 *
 * Responsibilities:
 * - Stores the current user's profile, JWT access token, and refresh token.
 * - Persists the access token to `sessionStorage` (clears on tab close).
 * - Exposes typed actions for login, logout, and token refresh.
 * - Provides the `useAuth()` domain hook for component consumption.
 *
 * Storage strategy:
 * - `sessionStorage` by default — token is lost when the browser tab is closed.
 * - Apps that need "remember me" should move the token to `localStorage` by
 *   dispatching `setRememberMe(true)` before `loginThunk`.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  ACCESS_TOKEN:  "auth_token",
  REFRESH_TOKEN: "auth_refresh_token",
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * A minimal user profile shape. Extend this interface in your app's types
 * for domain-specific user fields (e.g. `roles`, `orgId`).
 */
export interface AuthUser {
  /** Unique user identifier. */
  id: string;
  /** User's display name. */
  name: string;
  /** User's email address. */
  email: string;
  /** Optional URL to the user's avatar image. */
  avatarUrl?: string;
}

/** Credential payload used by `loginThunk`. */
export interface LoginCredentials {
  /** User's email address. */
  email: string;
  /** User's plain-text password. */
  password: string;
  /** If true, persist token to localStorage instead of sessionStorage. */
  rememberMe?: boolean;
}

/** Shape of a successful login API response. */
export interface AuthTokens {
  /** Short-lived JWT access token. */
  accessToken: string;
  /** Long-lived refresh token. */
  refreshToken: string;
  /** The authenticated user's profile. */
  user: AuthUser;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  /** The currently authenticated user, or `null` if unauthenticated. */
  user: AuthUser | null;
  /** JWT access token, or `null` if not authenticated. */
  token: string | null;
  /** Refresh token for obtaining a new access token. */
  refreshToken: string | null;
  /** Whether the token is stored in localStorage (remember me). */
  rememberMe: boolean;
  /** Current authentication lifecycle status. */
  status: AuthStatus;
  /** Error message from the last failed auth operation. */
  error: string | null;
}

// ── Initial state ─────────────────────────────────────────────────────────────

/**
 * Restores the auth token from storage on page load.
 * Checks sessionStorage first, then localStorage (remember-me).
 *
 * @internal
 */
function resolveStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ??
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  );
}

const storedToken = resolveStoredToken();

const initialState: AuthState = {
  user:         null,
  token:        storedToken,
  refreshToken: null,
  rememberMe:   typeof window !== "undefined"
                  ? !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
                  : false,
  status:       storedToken ? "authenticated" : "unauthenticated",
  error:        null,
};

// ── Async thunks ──────────────────────────────────────────────────────────────

/**
 * Clears all auth state from storage.
 * Called by `logoutThunk` and on 401 responses via `onUnauthorized`.
 *
 * @internal
 */
function clearStoredTokens(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Persists auth tokens to the appropriate storage.
 *
 * @param tokens - The access and refresh tokens to store.
 * @param rememberMe - If `true`, uses `localStorage`; otherwise `sessionStorage`.
 *
 * @internal
 */
function persistTokens(tokens: Pick<AuthTokens, "accessToken" | "refreshToken">, rememberMe: boolean): void {
  if (typeof window === "undefined") return;
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

/**
 * Thunk for user logout. Clears tokens from storage and resets auth state.
 *
 * @example
 * const { logout } = useAuth();
 * await logout();
 */
export const logoutThunk = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    clearStoredTokens();
    // Optionally: call a backend logout endpoint here
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Sets the auth state after a successful login.
     * Persists tokens to the appropriate storage based on `rememberMe`.
     */
    setCredentials(state, action: PayloadAction<AuthTokens & { rememberMe?: boolean }>) {
      const { user, accessToken, refreshToken, rememberMe = false } = action.payload;
      state.user         = user;
      state.token        = accessToken;
      state.refreshToken = refreshToken;
      state.rememberMe   = rememberMe;
      state.status       = "authenticated";
      state.error        = null;
      persistTokens({ accessToken, refreshToken }, rememberMe);
    },

    /**
     * Clears all authentication state. Called on logout or 401.
     */
    clearAuth(state) {
      state.user         = null;
      state.token        = null;
      state.refreshToken = null;
      state.rememberMe   = false;
      state.status       = "unauthenticated";
      state.error        = null;
      clearStoredTokens();
    },

    /**
     * Updates the access token after a successful token refresh.
     */
    updateAccessToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      persistTokens(
        { accessToken: action.payload, refreshToken: state.refreshToken ?? "" },
        state.rememberMe,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user         = null;
        state.token        = null;
        state.refreshToken = null;
        state.status       = "unauthenticated";
        state.error        = null;
      });
  },
});

// ── Exports ───────────────────────────────────────────────────────────────────

export const authActions = authSlice.actions;
export const { setCredentials, clearAuth, updateAccessToken } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export interface RootStateWithAuth {
  auth: AuthState;
}

export const selectUser            = (s: RootStateWithAuth) => s.auth.user;
export const selectAuthToken       = (s: RootStateWithAuth) => s.auth.token;
export const selectIsAuthenticated = (s: RootStateWithAuth) => s.auth.status === "authenticated";
export const selectAuthStatus      = (s: RootStateWithAuth) => s.auth.status;
export const selectAuthError       = (s: RootStateWithAuth) => s.auth.error;

export default authSlice.reducer;
