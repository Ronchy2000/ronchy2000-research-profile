"use client";

import { useEffect } from "react";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/locale";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function detectLocaleFromNavigator(): Locale {
  const language = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase();
  if (language.startsWith("zh")) return "zh";
  if (language.startsWith("en")) return "en";
  if (language.includes("zh")) return "zh";
  if (language.includes("en")) return "en";
  return DEFAULT_LOCALE;
}

type LocaleRedirectProps = {
  /**
   * Path after the locale segment.
   * Examples:
   * - "" -> "/en" or "/zh"
   * - "/research" -> "/en/research" or "/zh/research"
   */
  pathAfterLocale?: string;
  title?: string;
};

export function LocaleRedirect({
  pathAfterLocale = "",
  title = "Redirecting..."
}: LocaleRedirectProps) {
  useEffect(() => {
    const cookieLocale = normalizeLocale(readCookie(LOCALE_COOKIE_NAME));
    const locale = cookieLocale ?? detectLocaleFromNavigator();

    if (!cookieLocale) {
      document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }

    const suffix = pathAfterLocale ? (pathAfterLocale.startsWith("/") ? pathAfterLocale : `/${pathAfterLocale}`) : "";
    const target = suffix ? `/${locale}${suffix}` : `/${locale}`;
    window.location.replace(target);
  }, [pathAfterLocale]);

  const suffix = pathAfterLocale ? (pathAfterLocale.startsWith("/") ? pathAfterLocale : `/${pathAfterLocale}`) : "";
  const fallbackTarget = suffix ? `/${DEFAULT_LOCALE}${suffix}` : `/${DEFAULT_LOCALE}`;

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-slate-700 dark:text-slate-200">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        If you are not redirected automatically,{" "}
        <a className="underline underline-offset-4" href={fallbackTarget}>
          continue
        </a>
        .
      </p>
      <noscript>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          JavaScript is required for locale auto-detection on this entry route.
        </p>
      </noscript>
    </main>
  );
}
