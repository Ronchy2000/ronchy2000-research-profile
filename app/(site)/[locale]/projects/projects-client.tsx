"use client";

import { useMemo, useState } from "react";

import { FilterToolbar } from "@/components/filter-toolbar";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { ArrowRightIcon } from "@/components/icons";
import type { ProjectEntry, ProjectGroup, ProjectsPageCopy, UpdateEntry } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";
import { decorateGroup, type DerivedProject, type ProjectGroupWithDerived } from "@/lib/project-utils";

type ProjectLabelFilter = "all" | "ongoing" | "featured";

type ProjectBadge = {
  label: string;
  variant?: "default" | "accent";
};

type ProjectsClientProps = {
  locale: Locale;
  groups: ProjectGroup[];
  updates: UpdateEntry[];
  copy: ProjectsPageCopy[Locale];
};

const ALL_FILTER_VALUE = "all" as const;

export function ProjectsClient({ locale, groups, updates, copy }: ProjectsClientProps) {
  const [yearFilter, setYearFilter] = useState<string>(ALL_FILTER_VALUE);
  const [labelFilter, setLabelFilter] = useState<ProjectLabelFilter>(ALL_FILTER_VALUE);

  const decoratedGroups = useMemo<ProjectGroupWithDerived[]>(() => groups.map(decorateGroup), [groups]);

  const yearOptions = useMemo(() => {
    const uniqueYears = new Set<string>();
    decoratedGroups.forEach((group) => {
      group.items.forEach((item) => {
        item.derived.years.forEach((year) => uniqueYears.add(String(year)));
      });
    });

    return [ALL_FILTER_VALUE, ...Array.from(uniqueYears).sort((a, b) => Number(b) - Number(a))];
  }, [decoratedGroups]);

  const filteredGroups = useMemo(() => {
    return decoratedGroups
      .map((group) => {
        const filteredItems = group.items.filter((item) => {
          const matchesYear =
            yearFilter === ALL_FILTER_VALUE ||
            item.derived.years.some((year) => String(year) === yearFilter);

          const matchesLabel =
            labelFilter === "all" ||
            (labelFilter === "ongoing" && item.derived.isOngoing) ||
            (labelFilter === "featured" && item.derived.isFeatured);

          return matchesYear && matchesLabel;
        });

        return { ...group, items: filteredItems };
      })
      .filter((group) => group.items.length > 0);
  }, [decoratedGroups, yearFilter, labelFilter]);

  return (
    <div className="space-y-7">
      <section className="space-y-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
        <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">{copy.heroTitle}</h1>
        <p className="text-base leading-relaxed text-blue-900/70 dark:text-slate-300">
          {copy.heroDescription}
        </p>
      </section>

      <div className="space-y-6">
        <FilterToolbar
          className="shadow-[0_16px_40px_-38px_rgba(15,23,42,0.55)]"
          groups={[
            {
              id: "year",
              label: copy.filters.year,
              value: yearFilter,
              options: yearOptions.map((year) => ({
                value: year,
                label: year === ALL_FILTER_VALUE ? copy.filters.all : year
              })),
              onChange: setYearFilter
            },
            {
              id: "tags",
              label: copy.filters.label,
              value: labelFilter,
              options: [
                { value: ALL_FILTER_VALUE, label: copy.filters.all },
                { value: "ongoing", label: copy.filters.ongoing },
                { value: "featured", label: copy.filters.featured }
              ],
              onChange: (value) => setLabelFilter(value as ProjectLabelFilter)
            }
          ]}
        />

        {filteredGroups.length ? (
          filteredGroups.map((group) => (
            <Section
              key={group.title}
              title={group.title}
              eyebrow={
                group.kind === "open-source"
                  ? copy.groupLabels["open-source"]
                  : copy.groupLabels[group.kind as keyof typeof copy.groupLabels] ?? copy.groupLabels.default
              }
            >
              <div className="grid gap-6 md:grid-cols-2">
                {group.items.map((project) => {
                  const badges: ProjectBadge[] = [];
                  if (project.derived.isFeatured) {
                    badges.push({ label: copy.badges.featured, variant: "accent" });
                  }
                  if (project.derived.isOngoing) {
                    badges.push({ label: copy.badges.ongoing, variant: "default" });
                  }

                  return <ProjectCard key={project.name} project={project} badges={badges} />;
                })}
              </div>
            </Section>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            {copy.empty}
          </div>
        )}
      </div>

      <Section title={copy.sections.updates.title} eyebrow={copy.sections.updates.eyebrow}>
        <div className="space-y-3">
          {updates.map((update, index) => (
            <a
              key={update.link || `${update.date}-${update.type}-${index}`}
              href={update.link}
              className="group flex items-start gap-4 rounded-xl px-4 py-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50"
            >
              <div className="w-20 flex-shrink-0 pt-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                {update.date}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-medium text-slate-900 transition-colors group-hover:text-brand dark:text-slate-50">
                  {update.title}
                </h3>
                <p className="mt-1 text-base text-slate-600 dark:text-slate-300">{update.summary}</p>
              </div>
              <ArrowRightIcon
                aria-hidden="true"
                className="h-4 w-4 flex-shrink-0 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-300"
              />
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
