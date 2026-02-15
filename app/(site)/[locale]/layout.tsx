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
    { label: "Publications", href: "/en/publications" },
    { label: "Projects", href: "/en/projects" },
    { label: "Experience", href: "/en/experience" },
    { label: "CV", href: "/en/cv" },
    { label: "Blog", href: "/en/blog" },
    { label: "Contact", href: "/en/contact" }
  ],
  zh: [
    { label: "首页", href: "/zh" },
    { label: "科研概览", href: "/zh/research" },
    { label: "发表成果", href: "/zh/publications" },
    { label: "项目集锦", href: "/zh/projects" },
    { label: "经历", href: "/zh/experience" },
    { label: "简历", href: "/zh/cv" },
    { label: "博客", href: "/zh/blog" },
    { label: "联系", href: "/zh/contact" }
  ]
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
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
    <SiteShell navItems={navItems} profile={profile} locale={locale} lastUpdated={lastUpdated}>
      {children}
    </SiteShell>
  );
}
