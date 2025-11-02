import { Tag } from "@/components/tag";
import type { PublicationEntry } from "@/lib/content-types";

type PublicationItemProps = {
  item: PublicationEntry;
};

const TYPE_LABELS: Record<PublicationEntry["type"], string> = {
  C: "Conference",
  J: "Journal",
  P: "Patent",
  S: "In Submission"
};

/**
 * Renders a single publication or patent entry with type badge,
 * author list, venue, optional notes, and links.
 */
export function PublicationItem({ item }: PublicationItemProps) {
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;

  return (
    <article className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={typeLabel} />
          <span>{item.year}</span>
        </div>
        <span className="text-slate-400">{item.id}</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{item.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {item.authors}
          {item.notes ? <span className="ml-2 text-slate-500">({item.notes})</span> : null}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{item.venue}</p>
      </div>
      {item.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      ) : null}
      {item.links?.length ? (
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          {item.links.map((link) => (
            <a key={link.label} href={link.href} className="inline-flex items-center gap-1 text-brand hover:text-brand-foreground">
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
