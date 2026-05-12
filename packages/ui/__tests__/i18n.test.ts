import { beforeEach, describe, expect, it, vi } from "vitest";

const requestMock = vi.hoisted(() => vi.fn());
const getStoredLanguageCodeMock = vi.hoisted(() => vi.fn());

vi.mock("@repo/api-client/http", () => ({
  request: requestMock,
}));

vi.mock("@repo/api-client/preferences", () => ({
  getStoredLanguageCode: getStoredLanguageCodeMock,
  LANGUAGE_CHANGED_EVENT: "app-language-changed",
}));

async function loadI18nModule() {
  vi.resetModules();
  return import("../lib/i18n");
}

describe("packages/ui/lib/i18n", () => {
  beforeEach(() => {
    requestMock.mockReset();
    getStoredLanguageCodeMock.mockReset();
    window.localStorage.clear();
  });

  it("uses fallbacks and notifies subscribers when translations change", async () => {
    const { setTranslations, subscribeToTranslations, t } = await loadI18nModule();
    const listener = vi.fn();
    const unsubscribe = subscribeToTranslations(listener);

    setTranslations({ greeting: "Bonjour" }, "fr");

    expect(t("greeting", "Hello")).toBe("Bonjour");
    expect(t("missing", "Hello")).toBe("Hello");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it("uses cached translations from local storage before requesting them again", async () => {
    window.localStorage.setItem(
      "translations.fr",
      JSON.stringify({ greeting: "Bonjour" })
    );

    const { ensureTranslations, getCurrentLanguage, t } = await loadI18nModule();

    await ensureTranslations(" FR ");

    expect(requestMock).not.toHaveBeenCalled();
    expect(getCurrentLanguage()).toBe("fr");
    expect(t("greeting")).toBe("Bonjour");
  });

  it("requests and caches remote translations when no cache exists", async () => {
    requestMock.mockResolvedValue({
      translations: {
        greeting: "Hola",
      },
    });

    const { ensureTranslations, t } = await loadI18nModule();

    await ensureTranslations("es");

    expect(requestMock).toHaveBeenCalledWith("/api/translations/es");
    expect(JSON.parse(window.localStorage.getItem("translations.es") ?? "{}")).toEqual({
      greeting: "Hola",
    });
    expect(t("greeting")).toBe("Hola");
  });

  it("falls back to english and binds language updates from browser events", async () => {
    getStoredLanguageCodeMock.mockReturnValue("de");
    const { bindTranslationLanguageSync, ensureTranslations, getPreferredLanguage } =
      await loadI18nModule();
    const onChange = vi.fn();

    await ensureTranslations("en");
    const unsubscribe = bindTranslationLanguageSync(onChange);

    window.dispatchEvent(new StorageEvent("storage", { key: "language.code" }));
    window.dispatchEvent(new CustomEvent("app-language-changed"));

    expect(getPreferredLanguage()).toBe("de");
    expect(onChange).toHaveBeenCalledTimes(2);

    unsubscribe();
  });
});
