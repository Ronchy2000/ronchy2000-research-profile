type CalloutProps = {
  title?: string;
  children: React.ReactNode;
};

/**
 * Highlighted note block for important remarks inside articles.
 */
export function Callout({ title, children }: CalloutProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm text-slate-700 dark:border-brand/30 dark:bg-brand/10 dark:text-slate-200">
      {title ? <p className="font-semibold text-brand">{title}</p> : null}
      <div>{children}</div>
    </div>
  );
}
