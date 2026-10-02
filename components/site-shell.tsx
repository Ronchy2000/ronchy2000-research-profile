import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { LocaleProfile } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";
import type { NavItem } from "@/types/navigation";

type SiteShellProps = {
  children: ReactNode;
  navItems: NavItem[];
  profile: LocaleProfile;
  locale: Locale;
  lastUpdated?: string;
};

export function SiteShell({ children, navItems, profile, locale, lastUpdated }: SiteShellProps) {
  return (
    <div id="site-top" lang={locale === "zh" ? "zh-CN" : "en"} className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3 dark:focus:bg-slate-900">
        {locale === "zh" ? "跳至正文" : "Skip to content"}
      </a>
      <SiteHeader navItems={navItems} profileName={profile.name} currentLocale={locale} />
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <main id="main-content" tabIndex={-1} className="min-w-0 scroll-mt-48 outline-none lg:scroll-mt-24">
          {children}
        </main>
        <SiteFooter lastUpdated={lastUpdated} locale={locale} />
      </div>
    </div>
  );
}
