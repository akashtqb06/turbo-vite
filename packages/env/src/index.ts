/**
 * @module @repo/env
 *
 * Zod-based environment variable validation for Vite apps.
 *
 * Problem: `import.meta.env.VITE_API_URL` is `string | undefined` — type errors
 * only manifest at runtime when the broken feature is used. `@repo/env` validates
 * at startup and throws immediately with a helpful error listing every missing or
 * malformed variable.
 *
 * Usage pattern:
 * ```ts
 * // apps/my-app/src/env.ts
 * import { createEnvSchema } from "@repo/env";
 * import { z } from "zod";
 *
 * export const env = createEnvSchema({
 *   VITE_API_URL:   z.string().url("VITE_API_URL must be a valid URL"),
 *   VITE_APP_NAME:  z.string().min(1).default("My App"),
 *   VITE_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
 * });
 *
 * // apps/my-app/src/main.tsx  — MUST import env.ts as the FIRST line
 * import "./env";  // ← throws on startup if env vars are invalid
 * import { env } from "./env";
 *
 * configureApiClient({ apiBase: env.VITE_API_URL });
 * ```
 */

import { z } from "zod";

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Validates `import.meta.env` against the provided Zod schema shape.
 * Throws a descriptive `ZodError` at startup if any variable is missing or invalid.
 *
 * All keys in the schema shape should be `VITE_*` prefixed for Vite to expose them
 * to the browser bundle.
 *
 * @param shape - A Zod shape object where each key is an env variable name.
 * @returns A type-safe, fully validated environment object.
 *
 * @throws `ZodError` with a clear message listing all validation failures.
 *
 * @example
 * export const env = createEnvSchema({
 *   VITE_API_URL:   z.string().url(),
 *   VITE_APP_NAME:  z.string().default("My App"),
 *   VITE_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
 *   VITE_SENTRY_DSN: z.string().url().optional(),
 * });
 *
 * // env.VITE_API_URL is string (not string | undefined)
 * // env.VITE_LOG_LEVEL is "debug" | "info" | "warn" | "error"
 */
export function createEnvSchema<T extends z.ZodRawShape>(
  shape: T,
): z.infer<z.ZodObject<T>> {
  const schema = z.object(shape);

  // `import.meta.env` is only typed in Vite environments. Cast through `unknown`
  // to avoid TS2339 in non-Vite tsconfigs (e.g. packages/env/tsconfig.json).
  const importMetaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const rawEnv: Record<string, string | undefined> =
    importMetaEnv ??
    // Fallback to process.env in Node / Vitest environments
    (typeof process !== "undefined" ? (process.env as Record<string, string | undefined>) : {});

  const result = schema.safeParse(rawEnv);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `\n\n❌  Invalid environment variables detected:\n${issues}\n\n` +
      `Ensure all required variables are set in your .env.local file.\n` +
      `See .env.example for the full list of supported variables.\n`,
    );
  }

  return result.data;
}

// ── Re-export zod for convenience ─────────────────────────────────────────────
// Apps only need to install @repo/env, not zod directly, for basic schema building.
export { z } from "zod";
