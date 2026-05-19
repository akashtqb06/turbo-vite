/**
 * I18nPage — live showcase for @repo/i18n.
 *
 * Demonstrates:
 * - Language switching with live translation update
 * - t() with fallback
 * - t() with interpolation ({{name}} tokens)
 * - Loading state during async fetch
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { PageHeader } from "../components/PageHeader";

// Use @repo/i18n directly (not the shim in @repo/ui)
import { useTranslation, setPreferredLanguage, ensureTranslations, warmTranslationsCache, setTranslations } from "@repo/i18n";

// ── Mock translations so the demo works without a backend ────────────────────

const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    "common.save":    "Enregistrer",
    "common.cancel":  "Annuler",
    "common.hello":   "Bonjour, {{name}} !",
    "nav.home":       "Accueil",
    "nav.settings":   "Paramètres",
  },
  de: {
    "common.save":    "Speichern",
    "common.cancel":  "Abbrechen",
    "common.hello":   "Hallo, {{name}}!",
    "nav.home":       "Startseite",
    "nav.settings":   "Einstellungen",
  },
  es: {
    "common.save":    "Guardar",
    "common.cancel":  "Cancelar",
    "common.hello":   "¡Hola, {{name}}!",
    "nav.home":       "Inicio",
    "nav.settings":   "Configuración",
  },
};

const LANGUAGES = [
  { code: "en", label: "English 🇬🇧" },
  { code: "fr", label: "Français 🇫🇷" },
  { code: "de", label: "Deutsch 🇩🇪" },
  { code: "es", label: "Español 🇪🇸" },
];

const DEMO_KEYS = [
  { key: "common.save",   fallback: "Save" },
  { key: "common.cancel", fallback: "Cancel" },
  { key: "nav.home",      fallback: "Home" },
  { key: "nav.settings",  fallback: "Settings" },
];

// ── Component ─────────────────────────────────────────────────────────────────

function TranslationDemo() {
  const { t, language, loading } = useTranslation();
  const [name, setName]          = useState("Jane");
  const [activeLang, setActiveLang] = useState("en");

  const switchLanguage = async (code: string) => {
    setActiveLang(code);
    setPreferredLanguage(code);
    if (code !== "en" && MOCK_TRANSLATIONS[code]) {
      // Warm the loader cache FIRST so ensureTranslations (triggered by
      // the provider's language effect) sees it as already loaded and
      // won't attempt a network fetch that would wipe the mock data.
      warmTranslationsCache(code, MOCK_TRANSLATIONS[code]!);
      setTranslations(MOCK_TRANSLATIONS[code]!, code);
    } else {
      await ensureTranslations(code);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">@repo/i18n</Badge>
          <CardTitle className="text-base">Translation System</CardTitle>
          {loading && <Badge variant="secondary" className="animate-pulse text-xs">Loading…</Badge>}
        </div>
        <CardDescription>
          Core store + async loader + React hook — no i18next dependency, ~2 kB gzipped
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Language switcher */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Active language: <span className="text-primary">{language}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(({ code, label }) => (
              <Button
                key={code}
                size="sm"
                variant={activeLang === code ? "default" : "outline"}
                onClick={() => switchLanguage(code)}
                aria-label={`Switch to ${label}`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Translation table */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">t(key, fallback)</p>
          <div className="rounded-lg border overflow-hidden text-sm">
            <div className="grid grid-cols-3 bg-muted px-3 py-2 font-semibold text-xs text-muted-foreground">
              <span>Key</span>
              <span>Fallback (EN)</span>
              <span>Translated</span>
            </div>
            {DEMO_KEYS.map(({ key, fallback }) => (
              <div key={key} className="grid grid-cols-3 border-t px-3 py-2 font-mono text-xs">
                <span className="text-muted-foreground">{key}</span>
                <span className="text-muted-foreground">{fallback}</span>
                <span className="text-primary font-semibold">{t(key, fallback)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interpolation demo */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Interpolation — t(&apos;common.hello&apos;, &apos;Hello, <code>{'{{name}}'}</code>!&apos;, {'{ values: { name } }'})
          </p>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="Interpolation name"
              className="max-w-[200px]"
            />
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
            <p className="text-lg font-semibold text-primary">
              {t("common.hello", "Hello, {{name}}!", { values: { name } })}
            </p>
          </div>
        </div>

        {/* Missing key fallback */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Missing key fallback
          </p>
          <div className="font-mono text-xs bg-muted rounded p-3 space-y-1">
            <p>t(&apos;missing.key&apos;) → <strong className="text-primary">&quot;{t("missing.key")}&quot;</strong> (returns key)</p>
            <p>t(&apos;missing.key&apos;, &apos;Custom fallback&apos;) → <strong className="text-primary">&quot;{t("missing.key", "Custom fallback")}&quot;</strong></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function I18nPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Internationalisation (i18n)"
        description="@repo/i18n — a lightweight custom translation layer with async loading, two-tier caching, cross-tab sync, and React hooks. No i18next required."
      />
      <TranslationDemo />
    </div>
  );
}
