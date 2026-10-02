import type { TimelineEntry } from "@/lib/content-types";

type TimelineProps = {
  items: TimelineEntry[];
  detailLabel: string;
};

export function Timeline({ items, detailLabel }: TimelineProps) {
  return (
    <ul className="space-y-6 border-l border-slate-200 dark:border-slate-700">
      {items.map((item) => (
        <li key={item.title + item.period} className="relative pl-5">
          <span className="absolute -left-[3px] top-1.5 h-[5px] w-[5px] rounded-full bg-slate-400 dark:bg-slate-500" aria-hidden="true" />
          <p className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{item.period}</p>
          <h4 className="mt-1.5 text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">{item.title}</h4>
          {item.location ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.location}</p> : null}
          {item.details.length ? (
            <details className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              <summary className="w-fit cursor-pointer text-xs text-brand dark:text-blue-400">{detailLabel}</summary>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-6">
                {item.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </details>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
