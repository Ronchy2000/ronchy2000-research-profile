import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Layout wrapper for page sections. Handles titles, subtitles,
 * optional eyebrow labels, and trailing action elements.
 */
export function Section({ title, description, eyebrow, actions, children }: SectionProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            {eyebrow}
          </p>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2 text-sm sm:ml-auto">{actions}</div> : null}
        </div>
        <span className="block h-px w-16 bg-gradient-to-r from-brand/50 to-transparent" aria-hidden="true" />
      </header>
      <div className="space-y-8">{children}</div>
    </section>
  );
}
