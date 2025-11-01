import type { Publication } from "@/data/site";

const typeLabels: Record<Publication["type"], string> = {
  C: "Conference",
  J: "Journal",
  P: "Patent",
  S: "In Submission"
};

type PublicationListProps = {
  items: Publication[];
};

export function PublicationList({ items }: PublicationListProps) {
  return (
    <ol className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {item.id}
            </span>
            <span className="text-xs font-medium text-brand">{typeLabels[item.type]}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.year}</span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{item.authors}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {item.venue}
            {item.note ? ` · ${item.note}` : ""}
          </p>
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              className="mt-3 inline-flex text-sm font-medium text-brand hover:text-brand-foreground"
            >
              View details →
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
