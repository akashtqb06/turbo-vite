// HTTP
export { getApiClient, configureApiClient, apiRequest, request } from "./http/axios.js";
export type { ApiClientConfig } from "./http/axios.js";

// Preferences
export {
  getStoredLanguageCode,
  setStoredLanguageCode,
  clearStoredLanguageCode,
  LANGUAGE_CHANGED_EVENT,
  LANGUAGE_STORAGE_KEY,
} from "./preferences/index.js";

// Theme service
export { getThemes, getThemeById } from "./services/theme.service.js";
export type { Theme, ThemeTokens } from "./services/theme.service.js";
