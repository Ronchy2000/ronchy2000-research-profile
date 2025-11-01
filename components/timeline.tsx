import type { TimelineItem } from "@/data/site";

type TimelineProps = {
  items: TimelineItem[];
};

export function Timeline({ items }: TimelineProps) {
  return (
    <ul className="space-y-8">
      {items.map((item) => (
        <li key={`${item.title}-${item.period}`} className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {item.organization}
                {item.location ? ` · ${item.location}` : ""}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {item.period}
            </span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {item.highlights.map((highlight, index) => (
              <li key={index} className="leading-relaxed">
                {highlight}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
