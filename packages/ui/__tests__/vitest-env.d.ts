/**
 * Type augmentation for vitest test files in this package.
 *
 * Activates global types for vitest (\`expect\`, \`describe\`, \`it\`, \`vi\`) and
 * @testing-library/jest-dom DOM matchers (\`toHaveTextContent\`, \`toBeInTheDocument\`, etc.)
 * without requiring imports in every test file.
 *
 * The Language Server discovers this file automatically because it sits
 * alongside the test files — no tsconfig changes needed.
 */

/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

