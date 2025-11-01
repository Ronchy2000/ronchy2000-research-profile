import type { Honor } from "@/data/site";

type HonorsListProps = {
  items: Honor[];
};

export function HonorsList({ items }: HonorsListProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((honor) => (
        <li
          key={`${honor.title}-${honor.year}`}
          className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
        >
          <p className="font-semibold text-slate-900 dark:text-slate-100">{honor.title}</p>
          <p>{honor.organization}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{honor.year}</p>
        </li>
      ))}
    </ul>
  );
}
