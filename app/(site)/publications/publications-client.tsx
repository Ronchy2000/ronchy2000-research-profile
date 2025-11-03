"use client";

import { useMemo, useState } from "react";

import { PublicationItem } from "@/components/publication-item";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import type { PublicationEntry } from "@/lib/content-types";

type Locale = "en" | "zh";

const TYPE_OPTIONS = ["All", "C", "J", "P", "S"] as const;
type TypeFilter = typeof TYPE_OPTIONS[number];

const TYPE_LABELS = {
  C: { en: "Conference", zh: "会议" },
  J: { en: "Journal", zh: "期刊" },
  P: { en: "Patent", zh: "专利" },
  S: { en: "In Submission", zh: "投稿中" }
} as const satisfies Record<Exclude<TypeFilter, "All">, Record<Locale, string>>;

const COPY = {
  en: {
    section: {
      title: "Publications & Patents",
      description: "Conference papers, journal articles, and patent applications.",
      eyebrow: "Catalogue",
      note: "* indicates student-first author"
    },
    filters: {
      type: "Type",
      year: "Year",
      all: "All"
    },
    empty: "No publications match the selected filters."
  },
  zh: {
    section: {
      title: "论文与专利",
      description: "展示已发表论文、投稿进展与专利申请情况。",
      eyebrow: "成果目录",
      note: "* 表示学生一作"
    },
    filters: {
      type: "类型",
      year: "年份",
      all: "全部"
    },
    empty: "暂无符合当前筛选条件的成果。"
  }
} satisfies Record<Locale, { section: { title: string; description: string; eyebrow: string; note: string }; filters: { type: string; year: string; all: string }; empty: string }>;

type PublicationsClientProps = {
  entries: PublicationEntry[];
  locale: Locale;
};

export function PublicationsClient({ entries, locale }: PublicationsClientProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");

  const years = useMemo(() => {
    const unique = Array.from(new Set(entries.map((entry) => entry.year))).sort((a, b) => Number(b) - Number(a));
    return ["All", ...unique];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const typeMatch = typeFilter === "All" || entry.type === typeFilter;
      const yearMatch = yearFilter === "All" || entry.year === yearFilter;
      return typeMatch && yearMatch;
    });
  }, [entries, typeFilter, yearFilter]);

  const copy = COPY[locale];

  const renderTypeLabel = (type: TypeFilter) =>
    type === "All" ? copy.filters.all : TYPE_LABELS[type as Exclude<TypeFilter, "All">][locale];

  return (
    <div className="space-y-12">
      <Section
        title={copy.section.title}
        description={copy.section.description}
        eyebrow={copy.section.eyebrow}
        actions={<Tag label={copy.section.note} />}
      >
        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 text-sm shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {copy.filters.type}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {TYPE_OPTIONS.map((type) => {
                const label = renderTypeLabel(type);
                const active = typeFilter === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow"
                        : "border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {copy.filters.year}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {years.map((year) => {
                const active = yearFilter === year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setYearFilter(year)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow"
                        : "border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {year === "All" ? copy.filters.all : year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredEntries.length ? (
            filteredEntries.map((entry) => <PublicationItem key={entry.id} item={entry} locale={locale} />)
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">{copy.empty}</p>
          )}
        </div>
      </Section>
    </div>
  );
}
