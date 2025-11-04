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
const SIDEBAR_WIDTH = 260;
const COLLAPSE_SCROLL_THRESHOLD = 360;
const EXPAND_SCROLL_THRESHOLD = 220;
const SCROLL_EASING = "cubic-bezier(0.38, 0, 0.22, 1)";
const SIDEBAR_TRANSITION = [
  `width 0.55s ${SCROLL_EASING}`,
  `flex-basis 0.55s ${SCROLL_EASING}`,
  `max-width 0.55s ${SCROLL_EASING}`,
  `opacity 0.3s ease`,
  `transform 0.55s ${SCROLL_EASING}`
].join(", ");
const SIDEBAR_HIDDEN_TRANSFORM = "translateX(-24px)";

/**
 * Application shell with responsive header and optional sidebar profile card.
 * On the Home page the sidebar collapses once you scroll past the hero in desktop view.
 */
export function SiteShell({ children, navItems, profile, locale, onToggleLocale }: SiteShellProps) {
  const pathname = usePathname();
  const normalizedPath = pathname?.replace(/\/$/, "") || "/";
  const sidebarDisabled = SIDEBAR_EXCLUDED_ROUTES.has(normalizedPath);
  const enableCollapsibleSidebar = !sidebarDisabled && normalizedPath === "/";

  const [homeSidebarCollapsed, setHomeSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (!enableCollapsibleSidebar) {
      setHomeSidebarCollapsed(false);
      return;
    }

    let rafId: number | null = null;

    const updateSidebar = () => {
      rafId = null;
      const isDesktop = window.innerWidth >= 1024;
      const scrollY = window.scrollY;

      setHomeSidebarCollapsed((prev) => {
        if (!isDesktop) {
          return false;
        }

        if (!prev && scrollY > COLLAPSE_SCROLL_THRESHOLD) {
          return true;
        }

        if (prev && scrollY < EXPAND_SCROLL_THRESHOLD) {
          return false;
        }

        return prev;
      });
    };

    const scheduleUpdate = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(updateSidebar);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [enableCollapsibleSidebar]);

  useEffect(() => {
    if (sidebarDisabled) {
      return;
    }

    // Reset the collapsed state when leaving the Home page so route transitions start expanded.
    if (!enableCollapsibleSidebar) {
      setHomeSidebarCollapsed(false);
    }
  }, [enableCollapsibleSidebar, sidebarDisabled]);

  const sidebarHidden = sidebarDisabled || (enableCollapsibleSidebar && homeSidebarCollapsed);

  const layoutStyles = useMemo(() => {
    const gap = sidebarHidden ? "0rem" : "2rem";
    return {
      gap,
      transition: `gap 0.5s ${SCROLL_EASING}`
    };
  }, [sidebarHidden]);

  const sidebarStyles = useMemo(() => {
    if (sidebarDisabled) {
      return {
        width: 0,
        flexBasis: "0px",
        maxWidth: "0px",
        opacity: 0,
        transform: SIDEBAR_HIDDEN_TRANSFORM,
        pointerEvents: "none" as const,
        transition: SIDEBAR_TRANSITION
      };
    }

    return {
      width: sidebarHidden ? 0 : SIDEBAR_WIDTH,
      flexBasis: sidebarHidden ? "0px" : `${SIDEBAR_WIDTH}px`,
      maxWidth: sidebarHidden ? "0px" : `${SIDEBAR_WIDTH}px`,
      opacity: sidebarHidden ? 0 : 1,
      transform: sidebarHidden ? SIDEBAR_HIDDEN_TRANSFORM : "translateX(0)",
      pointerEvents: sidebarHidden ? ("none" as const) : undefined,
      transition: SIDEBAR_TRANSITION
    };
  }, [sidebarDisabled, sidebarHidden]);

  // 获取真实的最后更新时间
  const lastUpdated = useMemo(() => {
    try {
      const updates = getUpdatesContent()[locale]?.updates ?? [];
      return updates[0]?.date || new Date().toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }, [locale]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader
        navItems={navItems}
        profileName={profile.name}
        onToggleLocale={onToggleLocale}
        currentLocale={locale}
      />
      <div
        className="mx-auto flex w-full max-w-6xl px-4 py-10 lg:px-8"
        style={layoutStyles}
      >
        <div
          className="hidden overflow-hidden lg:flex"
          style={sidebarStyles}
          aria-hidden={sidebarHidden}
        >
          {!sidebarDisabled && <SideProfileCard profile={profile} />}
        </div>
        <main className="flex-1 min-w-0 space-y-16">
          {children}
          <SiteFooter lastUpdated={lastUpdated} locale={locale} />
        </main>
      </div>
    </div>
  );
}
