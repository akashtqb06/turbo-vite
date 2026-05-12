import { request } from "@repo/api-client/http"
import {
  getStoredLanguageCode,
  LANGUAGE_CHANGED_EVENT,
} from "@repo/api-client/preferences"

export const TRANSLATION_CACHE_PREFIX = "translations."

type TranslationMap = Record<string, string>

type TranslationListener = () => void

let currentLanguage = "en"
let translations: TranslationMap = {}
const listeners = new Set<TranslationListener>()
const memoryCache = new Map<string, TranslationMap>()

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function emitChange() {
  listeners.forEach((listener) => listener())
}

function getStorageKey(languageCode: string) {
  return `${TRANSLATION_CACHE_PREFIX}${languageCode}`
}

function readCachedTranslations(languageCode: string): TranslationMap | null {
  if (memoryCache.has(languageCode)) {
    return memoryCache.get(languageCode) ?? null
  }

  if (!canUseStorage()) {
    return null
  }

  const raw = window.localStorage.getItem(getStorageKey(languageCode))

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as TranslationMap
    memoryCache.set(languageCode, parsed)
    return parsed
  } catch {
    return null
  }
}

function writeCachedTranslations(languageCode: string, nextTranslations: TranslationMap) {
  memoryCache.set(languageCode, nextTranslations)

  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(
    getStorageKey(languageCode),
    JSON.stringify(nextTranslations)
  )
}

export function setTranslations(data: TranslationMap, language = currentLanguage) {
  currentLanguage = language
  translations = data
  emitChange()
}

export function t(key: string, fallback?: string) {
  return translations[key] || fallback || key
}

export function getCurrentLanguage() {
  return currentLanguage
}

export function subscribeToTranslations(listener: TranslationListener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export async function ensureTranslations(languageCode: string | null | undefined) {
  const normalizedLanguage = languageCode?.trim().toLowerCase() || "en"

  if (normalizedLanguage === currentLanguage && Object.keys(translations).length > 0) {
    return
  }

  if (normalizedLanguage === "en") {
    setTranslations({}, "en")
    return
  }

  const cachedTranslations = readCachedTranslations(normalizedLanguage)

  if (cachedTranslations) {
    setTranslations(cachedTranslations, normalizedLanguage)
    return
  }

  const payload = await request(`/api/translations/${encodeURIComponent(normalizedLanguage)}`)
  const nextTranslations =
    typeof payload === "object" &&
    payload !== null &&
    "translations" in payload &&
    typeof payload.translations === "object" &&
    payload.translations !== null
      ? (payload.translations as TranslationMap)
      : {}

  writeCachedTranslations(normalizedLanguage, nextTranslations)
  setTranslations(nextTranslations, normalizedLanguage)
}

export function getPreferredLanguage() {
  return getStoredLanguageCode() || "en"
}

export function bindTranslationLanguageSync(onChange: (languageCode: string) => void) {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === "language.code") {
      onChange(getPreferredLanguage())
    }
  }

  const handleLanguageChanged = () => {
    onChange(getPreferredLanguage())
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChanged)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChanged)
  }
}
