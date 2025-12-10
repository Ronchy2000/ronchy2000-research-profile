"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Locale = "en" | "zh";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // 使用默认语言 "en" 进行 SSR，避免返回 null
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // 客户端挂载后检测用户语言偏好
    const detectLocale = (): Locale => {
      // 1. 先检查 localStorage 中的用户偏好
      if (typeof window !== "undefined") {
        const savedLocale = localStorage.getItem("locale");
        if (savedLocale === "en" || savedLocale === "zh") {
          return savedLocale;
        }

        // 2. 检测浏览器语言设置
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("zh")) {
          return "zh";
        }
      }

      // 3. 默认英文
      return "en";
    };

    const detectedLocale = detectLocale();
    
    // 只在检测到的语言与当前不同时才更新
    if (detectedLocale !== locale) {
      setLocaleState(detectedLocale);
    }
    
    // 更新 HTML lang 属性
    if (typeof document !== "undefined") {
      document.documentElement.lang = detectedLocale;
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
    }
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
