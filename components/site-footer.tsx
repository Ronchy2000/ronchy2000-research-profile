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
      tagline: "Always improving",
      contact: "Get in touch",
      contactNote: "For research discussions, collaboration and project feedback.",
      icpLabel: "ICP Licensing"
    },
    zh: {
      copyright: `© ${year} 陆荣琦。保留所有权利。`,
      viewSource: "GitHub 源码仓库",
      lastUpdated: "上次更新：",
      tagline: "无限进步",
      contact: "联系我",
      contactNote: "欢迎交流研究想法、探讨合作，或分享项目反馈。",
      icpLabel: "ICP备案号"
    }
  } satisfies Record<
    Locale,
    { copyright: string; viewSource: string; lastUpdated: string; tagline: string; icpLabel: string; contact: string; contactNote: string }
  >;
  const t = copy[locale];
  const ICP_LICENSE = "晋ICP备2025068932号-1";

  const icpLabel = (
    <Link
      href="https://beian.miit.gov.cn"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-brand"
    >
      {t.icpLabel}
      {locale === "zh" ? "：" : ": "}
      {ICP_LICENSE}
    </Link>
  );

  return (
    <footer id="page-end" tabIndex={-1} className="mt-16 scroll-mt-40 border-t border-slate-200 py-8 text-xs text-slate-500 outline-none dark:border-slate-800 dark:text-slate-400 print:hidden">
      <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <Link href={`/${locale}/contact`} className="inline-flex items-center gap-2 py-2 text-base font-semibold text-slate-900 hover:text-brand dark:text-slate-100 dark:hover:text-blue-400">
          {t.contact}<span aria-hidden="true">↗</span>
        </Link>
        <p className="text-sm">{t.contactNote}</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{t.copyright}</span>
            {icpLabel}
          </span>
          <a
            href="https://github.com/Ronchy2000/ronchy2000-research-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-brand"
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
