type TagProps = {
  label: string;
};

/**
 * Small rounded label used across publications, projects, and interests.
 */
export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
      {label}
    </span>
  );
}
