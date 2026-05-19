/**
 * @module @repo/api-client
 *
 * Public API for the `@repo/api-client` package.
 *
 * Prefer subpath imports for tree-shaking:
 *   import { getApiClient } from "@repo/api-client/http";
 *   import type { ApiClientConfig } from "@repo/api-client/types";
 */

// ── HTTP client ───────────────────────────────────────────────────────────────
export {
  getApiClient,
  configureApiClient,
  apiRequest,
  request,
} from "./client.js";

// ── Types ─────────────────────────────────────────────────────────────────────
export type { ApiClientConfig } from "./types.js";
