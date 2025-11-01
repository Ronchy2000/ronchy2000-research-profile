type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  description?: string;
};

export function SectionHeading({ title, eyebrow, description }: SectionHeadingProps) {
  return (
    <header className="mb-6 space-y-3">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {description ? (
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}
    </header>
  );
}
