"use client";

import { useMemo, useState } from "react";

import { FilterToolbar } from "@/components/filter-toolbar";
import { PageOutline } from "@/components/page-outline";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { ArrowRightIcon } from "@/components/icons";
import type { ProjectGroup, ProjectsPageCopy, UpdateEntry } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";
import { compareProjectsByStars, decorateGroup, type ProjectGroupWithDerived } from "@/lib/project-utils";

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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const decoratedGroups = useMemo<ProjectGroupWithDerived[]>(() => groups.map((group) => {
    const decorated = decorateGroup(group);
    decorated.items.sort(compareProjectsByStars);
    return decorated;
  }), [groups]);

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
  const outlineItems = [
    { id: "overview", label: copy.outline.overview },
    { id: "catalogue", label: copy.outline.catalogue },
    { id: "updates", label: copy.outline.updates }
  ];

  return (
    <div className="reading-layout">
      <div className="reading-content">
        <section
          id="overview"
          className="space-y-4"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{copy.heroTitle}</h1>
          <p className="max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            {copy.heroDescription}
          </p>
        </section>

        <section id="catalogue" aria-label={copy.outline.catalogue} className="space-y-8">
          <FilterToolbar
            groups={[
              {
                id: "year",
                label: copy.filters.year,
                value: yearFilter,
                options: yearOptions.map((year) => ({
                  value: year,
                  label: year === ALL_FILTER_VALUE ? copy.filters.all : year
                })),
                onChange: (value) => { setYearFilter(value); setExpandedGroups({}); }
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
                onChange: (value) => { setLabelFilter(value as ProjectLabelFilter); setExpandedGroups({}); }
              }
            ]}
          />
          <p role="status" className="text-xs text-slate-500 dark:text-slate-400">
            {locale === "zh"
              ? "符合筛选的项目：" + filteredGroups.reduce((sum, group) => sum + group.items.length, 0)
              : filteredGroups.reduce((sum, group) => sum + group.items.length, 0) + " matching projects"}
          </p>

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
                <div id={"project-group-" + group.kind} className="grid gap-4 md:grid-cols-2">
                  {(expandedGroups[group.kind] ? group.items : group.items.slice(0, 4)).map((project) => {
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
                {group.items.length > 4 ? (
                  <button
                    type="button"
                    aria-expanded={Boolean(expandedGroups[group.kind])}
                    aria-controls={"project-group-" + group.kind}
                    onClick={() => setExpandedGroups((current) => ({ ...current, [group.kind]: !current[group.kind] }))}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-300"
                  >
                    {expandedGroups[group.kind]
                      ? copy.showLess
                      : copy.showMore + " (" + (group.items.length - 4) + ")"}
                  </button>
                ) : null}
              </Section>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
              {copy.empty}
            </div>
          )}
        </section>

        <Section id="updates" title={copy.sections.updates.title} eyebrow={copy.sections.updates.eyebrow}>
          <div className="space-y-3">
            {updates.map((update, index) => (
              <a
                key={update.link || `${update.date}-${update.type}-${index}`}
                href={update.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg py-3 hover:bg-slate-100 dark:hover:bg-slate-900/50"
              >
                <div className="w-20 flex-shrink-0 pt-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {update.date}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-medium leading-6 text-slate-900 transition-colors group-hover:text-brand dark:text-slate-50">
                    {update.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{update.summary}</p>
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

      <PageOutline label={copy.outline.label} items={outlineItems} locale={locale} />
    </div>
  );
}
