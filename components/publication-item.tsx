import { ExternalLinkIcon } from "@/components/icons";
import type { PublicationEntry } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";

type PublicationItemProps = {
  item: PublicationEntry;
  locale?: Locale;
};

const TYPE_LABELS = {
  en: { C: "Conference", J: "Journal", P: "Patent", S: "In submission" },
  zh: { C: "会议", J: "期刊", P: "专利", S: "投稿中" }
};

export function PublicationItem({ item, locale = "en" }: PublicationItemProps) {
  return (
    <article id={"publication-" + item.id} className="scroll-mt-48 space-y-2 py-5 first:pt-0 last:pb-0 lg:scroll-mt-24">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">{item.year}</span><span aria-hidden="true">·</span>
        <span>{TYPE_LABELS[locale][item.type]}</span>
        <span className="ml-auto text-slate-400 dark:text-slate-500">{item.id}</span>
      </div>
      <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">{item.title}</h3>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
        {item.authors.split(/(Rongqi Lu\*?|陆荣琦\*?)/).map((part, index) =>
          /^(Rongqi Lu|陆荣琦)/.test(part)
            ? <strong key={index} className="font-semibold text-slate-800 dark:text-slate-200">{part}</strong>
            : part
        )}
      </p>
      <p className="text-sm italic text-slate-700 dark:text-slate-300">{item.venue}</p>
      {item.notes ? <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{item.notes}</p> : null}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs">
        {item.tags?.length ? <span className="text-slate-500 dark:text-slate-400">{item.tags.join(" / ")}</span> : null}
        {item.links?.filter((link) => link.href && link.href !== "#").map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium dark:text-blue-400">
            {link.label}<ExternalLinkIcon className="h-3 w-3" />
          </a>
        ))}
      </div>
    </article>
  );
}
