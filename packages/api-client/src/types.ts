/**
 * @module @repo/api-client/types
 *
 * Shared TypeScript interfaces for the Axios HTTP client configuration.
 * Kept in a separate module so consumers can import types without pulling
 * in the full Axios instance.
 */

// ── Configuration ─────────────────────────────────────────────────────────────

/**
 * Configuration options for the shared API client.
 * Pass to `configureApiClient()` at app startup (e.g. in `main.tsx`).
 */
export interface ApiClientConfig {
  /** Base URL prepended to all relative request URLs. e.g. `"https://api.example.com"` */
  apiBase?: string;
  /** Default request timeout in milliseconds. Defaults to `15_000` (15s). */
  timeout?: number;
  /**
   * Called when the server responds with HTTP 401 (Unauthorized).
   * Use this to redirect the user to the login page or refresh the auth token.
   *
   * @example
   * configureApiClient({
   *   onUnauthorized: () => store.dispatch(clearAuth()),
   * });
   */
  onUnauthorized?: () => void;
  /**
   * Optional function to retrieve the current auth token.
   * If provided, this is called on every request instead of reading localStorage directly.
   * Useful for apps that manage tokens in memory (e.g. via Redux store).
   *
   * @example
   * configureApiClient({
   *   getToken: () => store.getState().auth.token,
   * });
   */
  getToken?: () => string | null | undefined;
}
