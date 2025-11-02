import type { TimelineEntry } from "@/lib/content-types";

type TimelineProps = {
  items: TimelineEntry[];
};

/**
 * Vertical timeline used for education and professional experience.
 */
export function Timeline({ items }: TimelineProps) {
  return (
    <ul className="relative space-y-8 pl-4 sm:pl-6">
      <span className="pointer-events-none absolute left-1 top-2 bottom-2 hidden w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden="true" />
      {items.map((item, index) => (
        <li key={`${item.title}-${item.period}`} className="relative pl-6 sm:pl-9">
          <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-brand/80 shadow-[0_0_0_6px_rgba(37,99,235,0.15)] dark:shadow-[0_0_0_6px_rgba(37,99,235,0.25)] sm:left-[-2px]" aria-hidden="true" />
          {index < items.length - 1 ? (
            <span className="pointer-events-none absolute left-[3px] top-4 bottom-[-2rem] hidden w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden="true" />
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{item.title}</h3>
              {item.location ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.location}</p>
              ) : null}
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              {item.period}
            </span>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {item.details.map((detail, idx) => (
              <li key={idx} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
