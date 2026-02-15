export type Locale = "en" | "zh";

export const LOCALES = ["en", "zh"] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh";
}

export function normalizeLocale(value: unknown): Locale | null {
  if (isLocale(value)) {
    return value;
  }
  return null;
}

