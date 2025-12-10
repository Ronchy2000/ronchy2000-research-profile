"use client";

import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";
import { useLocale } from "@/components/locale-provider";
import { getProfileContent } from "@/lib/content";
import type { NavItem } from "@/types/navigation";

const NAV_ITEMS: Record<"en" | "zh", NavItem[]> = {
  en: [
    { label: "Home", href: "/" },
    { label: "Research", href: "/research" },
    { label: "Publications", href: "/publications" },
    { label: "Projects", href: "/projects" },
    { label: "CV", href: "/cv" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" }
  ],
  zh: [
    { label: "首页", href: "/" },
    { label: "科研概览", href: "/research" },
    { label: "发表成果", href: "/publications" },
    { label: "项目集锦", href: "/projects" },
    { label: "简历", href: "/cv" },
    { label: "博客", href: "/blog" },
    { label: "联系", href: "/contact" }
  ]
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  const profileContent = getProfileContent();
  const { locale, setLocale } = useLocale();
  const profile = profileContent[locale];
  const navItems = NAV_ITEMS[locale];

  return (
    <SiteShell navItems={navItems} profile={profile} locale={locale} onToggleLocale={setLocale}>
      {children}
    </SiteShell>
  );
}
