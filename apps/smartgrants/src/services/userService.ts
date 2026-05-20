/**
 * @module smartgrants/services/userService
 *
 * User information service — migrated from the legacy `UserService.js`.
 *
 * Key behaviours preserved:
 *  - **Fan-out queue**: concurrent `getUserInfo()` calls before the first
 *    response arrives are queued and resolved together (no duplicate requests).
 *  - **CSRF token bootstrap**: `window._cft` is written from the response
 *    `x-csrftoken` header so all subsequent Axios requests carry it.
 *  - **`isAdmin()`**: reads cached roles without a network call.
 *  - **`postRbac()`**: generic RBAC POST helper.
 */

import { getApiClient } from "../lib/apiClient";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserInfo {
  /** Display name / full name of the authenticated user. */
  name?: string;
  /** Primary email address. */
  email?: string;
  /** Roles assigned to the user (e.g. `["admin", "reviewer"]`). */
  roles: string[];
  /** Any additional server-provided fields. */
  [key: string]: unknown;
}

// ── Module state (mirrors legacy `var _userInfo`, `var infQ`, `var reqsend`) ──

let _userInfo: UserInfo | null = null;

/** Queue of resolve callbacks for concurrent `getUserInfo()` callers. */
const _infQ: Array<(info: UserInfo) => void> = [];

/** True once the first `/userinfo` request has been dispatched. */
let _reqSent = false;

// ── Service ───────────────────────────────────────────────────────────────────

export const UserService = {
  /**
   * Fetch authenticated user info from `/userinfo`.
   *
   * - Returns a cached result immediately on subsequent calls.
   * - Concurrent callers before the first response are queued and resolved
   *   together — matching the legacy fan-out pattern.
   * - Stores the `x-csrftoken` response header in `window._cft` so the
   *   Axios interceptor can attach it to every subsequent request.
   */
  getUserInfo(): Promise<UserInfo> {
    return new Promise<UserInfo>((resolve, reject) => {
      // Already cached — return after a microtask tick (legacy used setTimeout 1ms)
      if (_userInfo !== null) {
        setTimeout(() => resolve(_userInfo!), 1);
        return;
      }

      // Queue this resolver for when the in-flight request completes
      _infQ.push(resolve);

      if (!_reqSent) {
        _reqSent = true;

        getApiClient()
          .get<UserInfo>("/userinfo")
          .then((resp) => {
            _userInfo = resp.data;

            // Bootstrap CSRF token from response header (legacy: window._cft = resp.headers['x-csrftoken'])
            const csrfToken = resp.headers["x-csrftoken"] as string | undefined;
            if (csrfToken) {
              window._cft = csrfToken;
            }

            // Drain the queue — resolve all waiting callers
            while (_infQ.length > 0) {
              _infQ.splice(0, 1)[0]({ ..._userInfo });
            }
          })
          .catch((err: unknown) => {
            _reqSent = false; // Allow retry on next call
            _infQ.length = 0;
            reject(err);
          });
      }
    });
  },

  /**
   * Returns true if the cached user has the `admin` role.
   * Call after `getUserInfo()` has resolved.
   */
  isAdmin(): boolean {
    if (!_userInfo) return false;
    return _userInfo.roles.indexOf("admin") >= 0;
  },

  /**
   * Generic RBAC POST — forwards `payload` to `/<url>/<endPoint>`.
   *
   * @param url      - Top-level path segment (e.g. `"grants"`)
   * @param endPoint - Sub-path (e.g. `"submit"`)
   * @param payload  - Request body
   */
  async postRbac<TResponse = unknown>(
    url: string,
    endPoint: string,
    payload: unknown,
  ): Promise<TResponse> {
    const resp = await getApiClient().post<TResponse>(
      `/${url}/${endPoint}`,
      payload,
    );
    return resp.data;
  },

  /**
   * Clears the cached user info (useful for logout / testing).
   */
  clearCache(): void {
    _userInfo = null;
    _reqSent = false;
    _infQ.length = 0;
  },
} as const;

export default UserService;
