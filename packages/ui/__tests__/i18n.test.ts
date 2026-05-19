/**
 * Tests for `packages/ui/lib/i18n` — the thin re-export shim.
 *
 * Since `ui/lib/i18n` now re-exports from `@repo/i18n`, these tests
 * verify that the `@repo/i18n/core` module works correctly.
 * HTTP and preferences imports are mocked at their canonical source.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

const requestMock               = vi.hoisted(() => vi.fn());
const getStoredLanguageCodeMock = vi.hoisted(() => vi.fn());

// Mock the canonical sources (not the old @repo/api-client/preferences path)
vi.mock("@repo/api-client/http", () => ({
  request: requestMock,
}));

vi.mock("@repo/utils/preferences", () => ({
  getStoredLanguageCode: getStoredLanguageCodeMock,
  setStoredLanguageCode: vi.fn(),
  LANGUAGE_CHANGED_EVENT: "app:language-changed",
}));

async function loadI18nModule() {
  vi.resetModules();
  // Import from canonical @repo/i18n package (ui/lib/i18n re-exports from here)
  return import("@repo/i18n");
}

describe("packages/ui/lib/i18n", () => {
  beforeEach(() => {
    requestMock.mockReset();
    getStoredLanguageCodeMock.mockReset();
    window.localStorage.clear();
  });

  it("uses fallbacks and notifies subscribers when translations change", async () => {
    const { setTranslations, subscribeToTranslations, t } = await loadI18nModule();
    const listener   = vi.fn();
    const unsubscribe = subscribeToTranslations(listener);

    setTranslations({ greeting: "Bonjour" }, "fr");

    expect(t("greeting", "Hello")).toBe("Bonjour");
    expect(t("missing", "Hello")).toBe("Hello");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it("uses cached translations from localStorage before requesting them", async () => {
    // @repo/i18n/loader uses "i18n.translations.<lang>" as the cache key
    window.localStorage.setItem(
      "i18n.translations.fr",
      JSON.stringify({ greeting: "Bonjour" }),
    );

    const { ensureTranslations, getCurrentLanguage, t } = await loadI18nModule();

    await ensureTranslations(" FR ");

    expect(requestMock).not.toHaveBeenCalled();
    expect(getCurrentLanguage()).toBe("fr");
    expect(t("greeting")).toBe("Bonjour");
  });

  it("requests and caches remote translations when no cache exists", async () => {
    requestMock.mockResolvedValue({ translations: { greeting: "Hola" } });

    const { ensureTranslations, t } = await loadI18nModule();

    await ensureTranslations("es");

    expect(requestMock).toHaveBeenCalledWith("/api/translations/es");
    expect(
      JSON.parse(window.localStorage.getItem("i18n.translations.es") ?? "{}"),
    ).toEqual({ greeting: "Hola" });
    expect(t("greeting")).toBe("Hola");
  });

  it("falls back to english and binds language updates from browser events", async () => {
    getStoredLanguageCodeMock.mockReturnValue("de");

    const { bindLanguageSync, ensureTranslations, getPreferredLanguage } =
      await loadI18nModule();
    const onChange = vi.fn();

    await ensureTranslations("en");
    const unsubscribe = bindLanguageSync(onChange);

    window.dispatchEvent(new StorageEvent("storage", { key: "language.code" }));
    window.dispatchEvent(new CustomEvent("app:language-changed"));

    expect(getPreferredLanguage()).toBe("de");
    expect(onChange).toHaveBeenCalledTimes(2);

    unsubscribe();
  });
});
