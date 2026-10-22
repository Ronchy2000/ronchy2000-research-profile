import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { getProfileContent, getUpdatesContent } from "@/lib/content";
import { LOCALES, normalizeLocale, type Locale } from "@/lib/locale";
import type { NavItem } from "@/types/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const NAV_ITEMS: Record<Locale, NavItem[]> = {
  en: [
    { label: "Home", href: "/en" },
    { label: "Research", href: "/en/research" },
    { label: "Projects", href: "/en/projects" },
    { label: "Blog", href: "/en/blog" }
  ],
  zh: [
    { label: "首页", href: "/zh" },
    { label: "研究", href: "/zh/research" },
    { label: "项目", href: "/zh/projects" },
    { label: "博客", href: "/zh/blog" }
  ]
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const profile = getProfileContent()[locale];
  const navItems = NAV_ITEMS[locale];
  const lastUpdated = getUpdatesContent()[locale]?.updates?.[0]?.date;

  return (
    <SiteShell
      navItems={navItems}
      profile={profile}
      locale={locale}
      lastUpdated={lastUpdated}
    >
      {children}
    </SiteShell>
  );
}
