"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/locale-provider";
import type { Locale } from "@/lib/locale";

export function Providers({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LocaleProvider initialLocale={initialLocale}>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
