"use client"

import * as React from "react"

import {
  bindTranslationLanguageSync,
  ensureTranslations,
  getCurrentLanguage,
  getPreferredLanguage,
  subscribeToTranslations,
  t,
} from "../../lib/i18n"

type TranslationContextValue = {
  language: string
  loading: boolean
  t: (key: string, fallback?: string) => string
}

const TranslationContext = React.createContext<TranslationContextValue | null>(null)

function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState(getPreferredLanguage())
  const [loading, setLoading] = React.useState(language !== "en")
  const [, forceUpdate] = React.useReducer((value) => value + 1, 0)

  React.useEffect(() => {
    let cancelled = false

    setLoading(language !== "en")

    void ensureTranslations(language)
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [language])

  React.useEffect(() => subscribeToTranslations(() => forceUpdate()), [])
  React.useEffect(() => bindTranslationLanguageSync(setLanguage), [])

  const value = React.useMemo(
    () => ({
      language: getCurrentLanguage(),
      loading,
      t,
    }),
    [loading]
  )

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

function useTranslation() {
  const context = React.useContext(TranslationContext)

  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider")
  }

  return context
}

export { TranslationProvider, useTranslation }
