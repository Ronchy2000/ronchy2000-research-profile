"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";
import { getProfileContent } from "@/lib/content";
import type { NavItem } from "@/types/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Projects", href: "/projects" },
  { label: "CV", href: "/cv" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" }
] satisfies NavItem[];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const profileContent = getProfileContent();
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const profile = locale === "zh" ? profileContent.zh : profileContent.en;

  const toggleLocale = (next: "en" | "zh") => setLocale(next);

  return (
    <SiteShell navItems={navItems} profile={profile} locale={locale} onToggleLocale={toggleLocale}>
      {children}
    </SiteShell>
  );
}
