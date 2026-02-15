import { cookies, headers } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/locale";

function detectLocaleFromAcceptLanguage(value: string | null): Locale | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  // "zh-CN,zh;q=0.9,en;q=0.8"
  if (normalized.startsWith("zh")) {
    return "zh";
  }
  if (normalized.startsWith("en")) {
    return "en";
  }
  // Fallback: if any "zh" appears, prefer zh.
  if (normalized.includes("zh")) {
    return "zh";
  }
  if (normalized.includes("en")) {
    return "en";
  }
  return null;
}

export function getRequestLocale(): Locale {
  const cookieLocale = normalizeLocale(cookies().get(LOCALE_COOKIE_NAME)?.value);
  if (cookieLocale) {
    return cookieLocale;
  }

  const headerLocale = detectLocaleFromAcceptLanguage(headers().get("accept-language"));
  return headerLocale ?? DEFAULT_LOCALE;
}

