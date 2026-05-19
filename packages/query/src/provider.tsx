/**
 * @module @repo/query/provider
 *
 * React context provider that wraps the app with TanStack Query's
 * `QueryClientProvider` and optionally mounts the ReactQueryDevtools panel.
 *
 * Devtools are only bundled and rendered in development mode (Vite's `import.meta.env.DEV`).
 * They are fully tree-shaken out of production builds.
 */

import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

// ── Lazy-load devtools ────────────────────────────────────────────────────────

/**
 * Lazily loaded ReactQueryDevtools — only evaluated in dev mode.
 * Vite's dead code elimination removes this entire branch in production.
 */
const ReactQueryDevtools =
  import.meta.env.DEV
    ? lazy(() =>
        import("@tanstack/react-query-devtools").then((m) => ({
          default: m.ReactQueryDevtools,
        }))
      )
    : null;

// ── Component ─────────────────────────────────────────────────────────────────

/** Props for the `QueryProvider` component. */
export interface QueryProviderProps {
  /** The TanStack `QueryClient` instance created by `createQueryClient()`. */
  client: QueryClient;
  /** The app component tree to wrap. */
  children: ReactNode;
}

/**
 * Wraps the application with TanStack Query's `QueryClientProvider`.
 *
 * In development, the ReactQueryDevtools panel is included automatically
 * (accessible via the floating TanStack logo in the browser).
 * In production, the devtools are excluded entirely from the bundle.
 *
 * @example
 * // apps/my-app/src/main.tsx
 * const queryClient = createQueryClient();
 *
 * root.render(
 *   <QueryProvider client={queryClient}>
 *     <App />
 *   </QueryProvider>
 * );
 */
export function QueryProvider({ client, children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={client}>
      {children}
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

QueryProvider.displayName = "QueryProvider";
