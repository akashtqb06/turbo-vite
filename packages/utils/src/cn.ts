/**
 * @module @repo/utils/cn
 *
 * The `cn` utility merges Tailwind CSS class names using `clsx` for conditional
 * class application and `tailwind-merge` to resolve conflicting Tailwind utilities
 * (e.g. `cn("p-2 p-4")` → `"p-4"` not `"p-2 p-4"`).
 *
 * This is promoted to `@repo/utils` (instead of living only in `@repo/ui`) so
 * that non-UI packages and server-side code can use it without importing React.
 */

import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names with conflict resolution.
 *
 * Accepts any combination of strings, arrays, objects (conditional classes),
 * and falsy values — all forwarded to `clsx` first, then deduplicated by
 * `tailwind-merge`.
 *
 * @param inputs - Any number of class values: strings, arrays, or condition objects.
 * @returns A single, deduplicated class name string.
 *
 * @example
 * // Basic usage
 * cn("px-2 py-1", "bg-blue-500");
 * // → "px-2 py-1 bg-blue-500"
 *
 * // Conflict resolution (last wins)
 * cn("p-2", "p-4");
 * // → "p-4"
 *
 * // Conditional classes
 * cn("base-class", isActive && "active", { "disabled": !isEnabled });
 * // → "base-class active" (when isActive=true, isEnabled=true)
 *
 * // Component variant composition
 * function Button({ className, size }: Props) {
 *   return (
 *     <button className={cn(
 *       "rounded font-medium",
 *       size === "sm" ? "px-2 py-1 text-sm" : "px-4 py-2",
 *       className,
 *     )} />
 *   );
 * }
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
