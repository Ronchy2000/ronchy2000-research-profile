import clsx from "clsx";

type TagProps = {
  label: string;
  variant?: "default" | "accent";
};

const VARIANT_STYLES = {
  default: "border-slate-200 bg-white/70 text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  accent: "border-transparent bg-blue-600 text-white shadow-sm dark:bg-blue-500 dark:text-white"
} as const;

/**
 * Small rounded label used across publications, projects, and interests.
 */
export function Tag({ label, variant = "default" }: TagProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANT_STYLES[variant]
      )}
    >
      {label}
    </span>
  );
}
