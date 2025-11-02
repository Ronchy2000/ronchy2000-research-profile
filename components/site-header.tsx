"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import type { NavItem } from "@/types/navigation";

type Locale = "en" | "zh";

type SiteHeaderProps = {
  navItems: NavItem[];
  profileName?: string;
  onToggleLocale?: (locale: Locale) => void;
  currentLocale?: Locale;
};

const typeSafeHref = (href: NavItem["href"]) => href;

/**
 * Global horizontal navigation bar with language toggle and theme switcher.
 * Sticks to the top across desktop and mobile.
 */
export function SiteHeader({ navItems, profileName, onToggleLocale, currentLocale = "en" }: SiteHeaderProps) {
  const pathname = usePathname();

  const renderLink = (item: NavItem, variant: "desktop" | "mobile") => {
    const active = pathname === item.href;
    const baseClasses =
      variant === "desktop"
        ? "rounded-full px-4 py-2 text-sm font-medium transition-colors"
        : "whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-colors";

    const activeClasses =
      variant === "desktop"
        ? "bg-slate-900 text-white shadow-sm hover:bg-slate-900 hover:text-white dark:bg-white dark:text-slate-900 dark:hover:bg-white dark:hover:text-slate-900"
        : "bg-slate-900 text-white hover:bg-slate-900 hover:text-white dark:bg-white dark:text-slate-900 dark:hover:bg-white dark:hover:text-slate-900";

    const inactiveClasses =
      variant === "desktop"
        ? "text-slate-600/80 hover:bg-slate-200/80 hover:text-slate-900 dark:text-slate-200/80 dark:hover:bg-white/10 dark:hover:text-white"
        : "text-slate-600/80 hover:bg-slate-200/80 dark:text-slate-200/80 dark:hover:bg-white/10";

    return (
      <Link
        key={item.href}
        href={typeSafeHref(item.href)}
        className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 text-slate-700 shadow-[0_10px_40px_-30px_rgba(15,23,42,0.4)] backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-600/80 hover:text-slate-900 dark:text-slate-200/80 dark:hover:text-white">
            {profileName ?? "Rongqi Lu"}
          </Link>
          <nav className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => renderLink(item, "desktop"))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {onToggleLocale ? (
            <div className="flex items-center gap-1 rounded-full border border-slate-300 bg-white/70 p-1 text-xs font-semibold text-slate-600/80 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-200/80">
              {(
                [
                  { label: "EN", value: "en" as Locale },
                  { label: "中文", value: "zh" as Locale }
                ] as const
              ).map((option) => {
                const active = currentLocale === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggleLocale(option.value)}
                    className={`rounded-full px-2.5 py-1 transition ${
                      active
                        ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                        : "text-slate-600/80 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          <ThemeToggle variant="subtle" />
        </div>
      </div>
      <nav className="flex items-center gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 scrollbar-hide md:hidden dark:border-slate-800">
        {navItems.map((item) => renderLink(item, "mobile"))}
      </nav>
    </header>
  );
}
