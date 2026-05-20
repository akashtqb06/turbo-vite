/**
 * @module smartgrants/hooks/useUserInfo
 *
 * TanStack Query hook for fetching the authenticated user.
 *
 * Wraps `UserService.getUserInfo()` — the underlying service still manages
 * its own fan-out queue and writes `window._cft` from the response header,
 * so this hook is safe to call from multiple components simultaneously.
 */

import { useQuery }     from "@repo/query";
import { UserService }  from "../services/userService";
import type { UserInfo } from "../services/userService";
import { userKeys }     from "../queryKeys";

/**
 * Fetches the authenticated user's info.
 *
 * - First mount triggers `GET /userinfo` (and sets `window._cft`).
 * - Subsequent calls return the cached result — no extra requests.
 * - Cached for 10 minutes; does not refetch on window focus.
 *
 * @example
 * function Header() {
 *   const { data: user, isLoading } = useUserInfo();
 *   if (isLoading) return <Skeleton />;
 *   return <span>{user?.name} {UserService.isAdmin() ? "(Admin)" : ""}</span>;
 * }
 */
export function useUserInfo() {
  return useQuery<UserInfo>({
    queryKey: userKeys.info,
    queryFn:  () => UserService.getUserInfo(),
    staleTime: 10 * 60_000, // 10 minutes
  });
}
