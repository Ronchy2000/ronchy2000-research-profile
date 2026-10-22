"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { LOCALE_COOKIE_NAME, type Locale } from "@/lib/locale";
import type { NavItem } from "@/types/navigation";

type SiteHeaderProps = {
  navItems: NavItem[];
  profileName: string;
  currentLocale: Locale;
};

export function SiteHeader({ navItems, profileName, currentLocale }: SiteHeaderProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const currentPath = pathname.replace(/\/$/, "") || "/";

  return (
    <header className="site-header sticky top-0 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 print:hidden">
      <div className="site-container flex flex-wrap items-center justify-between gap-y-3 py-3">
        <Link href={"/" + currentLocale} className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {profileName}<span className="ml-1 text-brand" aria-hidden="true">.</span>
        </Link>
        <nav aria-label={currentLocale === "zh" ? "主导航" : "Main navigation"} className="order-last flex w-full items-center justify-between gap-1 border-t border-slate-200 pt-3 lg:order-none lg:w-auto lg:justify-start lg:border-0 lg:pt-0 dark:border-slate-800">
          {navItems.map((item) => {
            const active = item.href === "/" + currentLocale
              ? currentPath === item.href
              : currentPath === item.href || currentPath.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${active
                  ? "bg-slate-900 text-white hover:text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:text-slate-900"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <div role="group" aria-label={currentLocale === "zh" ? "语言" : "Language"} className="flex items-center rounded-full border border-slate-200 p-0.5 text-xs font-medium dark:border-slate-700">
            {(["en", "zh"] as const).map((locale) => (
              <button
                key={locale}
                type="button"
                aria-pressed={currentLocale === locale}
                onClick={() => {
                  const suffix = pathname.replace(/^\/(en|zh)(?=\/|$)/, "");
                  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
                  router.push("/" + locale + suffix + window.location.hash);
                }}
                className={`rounded-full px-2.5 py-1.5 ${currentLocale === locale
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
              >
                {locale === "en" ? "EN" : "中文"}
              </button>
            ))}
          </div>
          <ThemeToggle variant="subtle" />
        </div>
      </div>
    </header>
  );
}
