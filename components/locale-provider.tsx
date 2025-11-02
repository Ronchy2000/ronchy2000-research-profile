"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Locale = "en" | "zh";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 检测用户浏览器语言
    const detectLocale = (): Locale => {
      // 1. 先检查 localStorage 中的用户偏好
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale === "en" || savedLocale === "zh") {
        return savedLocale;
      }

      // 2. 检测浏览器语言设置
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("zh")) {
        return "zh";
      }

      // 3. 默认英文
      return "en";
    };

    const detectedLocale = detectLocale();
    setLocaleState(detectedLocale);
    
    // 更新 HTML lang 属性
    document.documentElement.lang = detectedLocale;
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  // 防止服务端渲染和客户端渲染不一致
  if (!mounted) {
    return null;
  }

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
