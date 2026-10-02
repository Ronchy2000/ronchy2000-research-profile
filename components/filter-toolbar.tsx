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
        "grid gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/50",
        className
      )}
    >
      {groups.map((group) => (
        <div role="group" aria-label={group.label} key={group.id} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="min-w-10 shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
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
                      ? "bg-brand text-white shadow-sm"
                      : "border border-slate-200 text-slate-600 hover:border-brand/60 hover:text-brand dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand/70 dark:hover:text-brand"
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
