"use client";

import { useMemo, useState } from "react";

import { PublicationItem } from "@/components/publication-item";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import type { PublicationEntry } from "@/lib/content-types";

const TYPE_LABELS: Record<string, string> = {
  All: "All",
  C: "Conference",
  J: "Journal",
  P: "Patent",
  S: "In Submission"
};

type PublicationsClientProps = {
  entries: PublicationEntry[];
};

export function PublicationsClient({ entries }: PublicationsClientProps) {
  const [typeFilter, setTypeFilter] = useState<keyof typeof TYPE_LABELS | "All">("All");
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

  return (
    <div className="space-y-12">
      <Section
        title="Publications & Patents"
        description="Filter by type or year. Entries are maintained via content/publications.json."
        eyebrow="Catalogue"
        actions={<Tag label="* indicates student-first author" />}
      >
        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 text-sm shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Type</span>
            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(TYPE_LABELS).map((type) => {
                const label = TYPE_LABELS[type] ?? type;
                const active = typeFilter === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(type as typeof typeFilter)}
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
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Year</span>
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
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredEntries.length ? (
            filteredEntries.map((entry) => <PublicationItem key={entry.id} item={entry} />)
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No publications match the selected filters.</p>
          )}
        </div>
      </Section>
    </div>
  );
}
