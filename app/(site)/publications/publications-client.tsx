"use client";

import { useMemo, useState } from "react";

import { FilterToolbar } from "@/components/filter-toolbar";
import { PublicationItem } from "@/components/publication-item";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import { getPublicationsPageCopy } from "@/lib/content";
import type { PublicationEntry } from "@/lib/content-types";

type Locale = "en" | "zh";

const TYPE_OPTIONS = ["All", "C", "J", "P", "S"] as const;
type TypeFilter = typeof TYPE_OPTIONS[number];

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

  const copy = getPublicationsPageCopy()[locale];

  const renderTypeLabel = (type: TypeFilter) => {
    if (type === "All") {
      return copy.filters.all;
    }
    return copy.types[type as Exclude<TypeFilter, "All">];
  };

  return (
    <div className="space-y-12">
      <Section
        title={copy.section.title}
        description={copy.section.description}
        eyebrow={copy.section.eyebrow}
        actions={<Tag label={copy.section.note} />}
      >
        <FilterToolbar
          groups={[
            {
              id: "type",
              label: copy.filters.type,
              value: typeFilter,
              options: TYPE_OPTIONS.map((type) => ({
                value: type,
                label: renderTypeLabel(type)
              })),
              onChange: (value) => setTypeFilter(value as TypeFilter)
            },
            {
              id: "year",
              label: copy.filters.year,
              value: yearFilter,
              options: years.map((year) => ({
                value: year,
                label: year === "All" ? copy.filters.all : year
              })),
              onChange: (value) => setYearFilter(value)
            }
          ]}
        />

        <div className="space-y-6">
          {filteredEntries.length ? (
            filteredEntries.map((entry) => <PublicationItem key={entry.id} item={entry} locale={locale} />)
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">{copy.empty}</p>
          )}
        </div>
      </Section>
    </div>
  );
}
