import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  headingLevel?: "h1" | "h2";
  children: ReactNode;
};

export function Section({ id, title, description, actions, headingLevel: Heading = "h2", children }: SectionProps) {
  return (
    <section id={id} className="space-y-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="min-w-0 space-y-2">
          <Heading className={`font-semibold tracking-tight text-slate-900 dark:text-slate-50 ${Heading === "h1" ? "text-3xl" : "text-xl"}`}>{title}</Heading>
          {description ? <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2 text-sm">{actions}</div> : null}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
