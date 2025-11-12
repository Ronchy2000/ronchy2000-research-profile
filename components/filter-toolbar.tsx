import clsx from "clsx";

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

type FilterToolbarProps = {
  groups: FilterGroup[];
  className?: string;
};

/**
 * Shared pill-style toolbar for dataset filters (publications, projects, blog).
 */
export function FilterToolbar({ groups, className }: FilterToolbarProps) {
  if (!groups.length) return null;

  return (
    <div
      className={clsx(
        "grid gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-[0_18px_45px_-40px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/70 sm:gap-3 sm:px-5 sm:py-4",
        className
      )}
    >
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {group.label}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {group.options.map((option) => {
              const active = option.value === group.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => group.onChange(option.value)}
                  className={clsx(
                    "rounded-full px-3 py-1 text-xs font-semibold transition",
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
