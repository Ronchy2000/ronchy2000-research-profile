import Link from "next/link";

type SiteFooterProps = {
  lastUpdated?: string;
};

/**
 * Global footer with copyright, update info, and quick links.
 */
export function SiteFooter({ lastUpdated }: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 print:hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} Rongqi Lu. All rights reserved.</div>
        <div className="flex flex-wrap items-center gap-4">
          {lastUpdated ? <span>Last updated: {lastUpdated}</span> : null}
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Always improving
          </span>
        </div>
      </div>
    </footer>
  );
}
