"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/locale";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

function persistLocale(locale: Locale) {
  try {
    localStorage.setItem("locale", locale);
  } catch {
    // ignore
  }

  try {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
  } catch {
    // ignore
  }
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  // SSR uses `initialLocale` so the first paint matches server output.
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  useEffect(() => {
    // Client-side override: if the user has an explicit preference stored, use it.
    const savedLocale = normalizeLocale(localStorage.getItem("locale"));
    if (savedLocale && savedLocale !== locale) {
      setLocaleState(savedLocale);
      persistLocale(savedLocale);
      return;
    }

    // Otherwise, persist the initial locale so server + client stay aligned.
    persistLocale(locale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    persistLocale(newLocale);
  };

  // 始终渲染 children，避免 SSR 白屏
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
