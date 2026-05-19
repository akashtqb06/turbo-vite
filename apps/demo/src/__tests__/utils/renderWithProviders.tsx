/**
 * @module test-utils/renderWithProviders
 *
 * Wraps a component with all app-level providers for integration tests.
 * Eliminates boilerplate — just call `renderWithProviders(<MyComponent />)`.
 *
 * Providers included:
 * - Redux `Provider` with a fresh store per test
 * - TanStack `QueryClientProvider` with retries disabled (tests must be deterministic)
 * - React Router `MemoryRouter` (configurable initial entries)
 *
 * @example
 * import { renderWithProviders } from "../utils/renderWithProviders";
 *
 * it("shows the user name", () => {
 *   const { getByText } = renderWithProviders(<UserCard />, {
 *     preloadedState: { auth: { user: { name: "Jane" }, token: null, isAuthenticated: false } },
 *   });
 *   expect(getByText("Jane")).toBeInTheDocument();
 * });
 */

import { render } from "@testing-library/react";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import { Provider }        from "react-redux";
import { MemoryRouter }    from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppStore }  from "@repo/store";
import type { ReactNode }  from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Options for `renderWithProviders`. */
export interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  /**
   * Partial Redux state to pre-populate the store.
   * Only the specified slices are overridden; all others use their defaults.
   */
  preloadedState?: Parameters<typeof createAppStore>[0] extends { preloadedState?: infer S }
    ? S
    : never;
  /**
   * Initial URL path for the MemoryRouter.
   * Defaults to `["/"]`.
   */
  initialEntries?: string[];
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Renders a React component inside all required app providers.
 *
 * @param ui - The React element to render.
 * @param options - Optional store state and routing config.
 * @returns Standard `@testing-library/react` render result plus `store` and `queryClient`.
 */
export function renderWithProviders(
  ui: ReactNode,
  options: RenderWithProvidersOptions = {},
): RenderResult & { store: ReturnType<typeof createAppStore>; queryClient: QueryClient } {
  const { initialEntries = ["/"], ...renderOptions } = options;

  // Fresh store per test — no shared state bleed
  const store = createAppStore();

  // Disable retries so tests don't wait for retry delays
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={initialEntries}>
            {children}
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  const result = render(ui as React.ReactElement, { wrapper: Wrapper, ...renderOptions });
  return { ...result, store, queryClient };
}
