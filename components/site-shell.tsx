"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SideProfileCard } from "@/components/side-profile-card";
import { SiteFooter } from "@/components/site-footer";
import { getUpdatesContent } from "@/lib/content";
import type { LocaleProfile } from "@/lib/content-types";
import type { NavItem } from "@/types/navigation";

type Locale = "en" | "zh";

type SiteShellProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  profile: LocaleProfile;
  locale: Locale;
  onToggleLocale?: (next: Locale) => void;
};

const SIDEBAR_EXCLUDED_ROUTES = new Set(["/research", "/publications", "/projects"]);

/**
 * Application shell with responsive header and optional sidebar profile card.
 * On the Home page the sidebar collapses once you scroll past the hero in desktop view.
 */
export function SiteShell({ children, navItems, profile, locale, onToggleLocale }: SiteShellProps) {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/$/, "") || "/";
  const sidebarDisabled = SIDEBAR_EXCLUDED_ROUTES.has(normalizedPath);
  const enableCollapsibleSidebar = !sidebarDisabled && normalizedPath === "/";

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!enableCollapsibleSidebar) {
      setSidebarCollapsed(false);
      return;
    }

    const handleScroll = () => {
      const shouldCollapse = window.innerWidth >= 1024 && window.scrollY > 300;
      setSidebarCollapsed(shouldCollapse);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableCollapsibleSidebar]);

  const sidebarStyles = useMemo(() => {
    if (sidebarDisabled) {
      return { width: 0, opacity: 0, pointerEvents: "none" as const };
    }

    return {
      width: sidebarCollapsed ? 0 : 260,
      opacity: sidebarCollapsed ? 0 : 1,
      transform: sidebarCollapsed ? "translateX(-24px)" : "translateX(0)",
      pointerEvents: sidebarCollapsed ? ("none" as const) : undefined
    };
  }, [sidebarCollapsed, sidebarDisabled]);

  // 获取真实的最后更新时间
  const lastUpdated = useMemo(() => {
    try {
      const updates = getUpdatesContent().updates;
      return updates[0]?.date || new Date().toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader
        navItems={navItems}
        profileName={profile.name}
        onToggleLocale={onToggleLocale}
        currentLocale={locale}
      />
      <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-10 lg:px-8">
        <div
          className="hidden overflow-hidden lg:flex"
          style={{
            ...sidebarStyles,
            transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          aria-hidden={sidebarDisabled || sidebarCollapsed}
        >
          {!sidebarDisabled && <SideProfileCard profile={profile} />}
        </div>
        <main className="flex-1 min-w-0 space-y-16">
          {children}
          <SiteFooter lastUpdated={lastUpdated} />
        </main>
      </div>
    </div>
  );
}
