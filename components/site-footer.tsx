import Link from "next/link";

type Locale = "en" | "zh";

type SiteFooterProps = {
  lastUpdated?: string;
  locale?: Locale;
};

/**
 * Global footer with copyright, update info, and quick links.
 */
export function SiteFooter({ lastUpdated, locale = "en" }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const copy = {
    en: {
      copyright: `© ${year} Rongqi Lu. All rights reserved.`,
      viewSource: "View source on GitHub",
      lastUpdated: "Last updated:",
      tagline: "Always improving"
    },
    zh: {
      copyright: `© ${year} 陆荣琦。保留所有权利。`,
      viewSource: "GitHub 源码仓库",
      lastUpdated: "上次更新：",
      tagline: "无限进步"
    }
  } satisfies Record<Locale, { copyright: string; viewSource: string; lastUpdated: string; tagline: string }>;
  const t = copy[locale];

  return (
    <footer className="mt-16 border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 print:hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span>{t.copyright}</span>
          <a 
            href="https://github.com/Ronchy2000/ronchy2000-research-profile" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-brand dark:text-slate-500 dark:hover:text-brand"
          >
            {t.viewSource}
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {lastUpdated ? <span>{t.lastUpdated} {lastUpdated}</span> : null}
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand/20 dark:text-brand/90">
            {t.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
