/**
 * @module @repo/ui/components/ui/translation-provider
 *
 * Re-exports `TranslationProvider` and `useTranslation` from `@repo/i18n`
 * for backwards compatibility. The implementation now lives in the dedicated
 * `@repo/i18n` package — import from there directly in new code.
 *
 * @deprecated Import from `@repo/i18n` instead.
 */
export { TranslationProvider, useTranslation } from "@repo/i18n/react";
