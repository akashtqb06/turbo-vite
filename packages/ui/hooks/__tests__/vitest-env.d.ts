/**
 * Type augmentation for vitest test files in this package.
 *
 * This file is intentionally placed in the __tests__ directory so the
 * TypeScript Language Server discovers it alongside the test files.
 *
 * It activates two sets of global type declarations:
 *
 * 1. `vitest/globals` — types for `expect`, `describe`, `it`, `vi`, `beforeEach`
 *    etc. without needing to import them (matches `globals: true` in vitest config).
 *
 * 2. `@testing-library/jest-dom` — extends vitest's `Assertion<T>` interface
 *    with DOM matchers: `toHaveTextContent`, `toBeInTheDocument`,
 *    `toHaveClass`, `toBeVisible`, etc.
 *
 * Without this file, the Language Server sees `Assertion<HTMLElement>` from
 * vitest but not the jest-dom matchers merged into it — causing false TS errors
 * even though the tests pass at runtime.
 */

/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
