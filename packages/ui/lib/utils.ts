/**
 * Re-exports `cn` from `@repo/utils` so that `@repo/ui` components
 * and the shadcn generated code can import from `@repo/ui/lib/utils`
 * without duplicating the clsx + tailwind-merge implementation.
 *
 * Single source of truth lives in `packages/utils/src/cn.ts`.
 */
export { cn } from "@repo/utils/cn"
