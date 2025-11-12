"use client";

import { useMemo, useState } from "react";

import { FilterToolbar } from "@/components/filter-toolbar";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { useLocale } from "@/components/locale-provider";
import { getProjectsContent, getUpdatesContent } from "@/lib/content";
import type { ProjectEntry, ProjectGroup } from "@/lib/content-types";

type ProjectLabelFilter = "all" | "ongoing" | "featured";

type ProjectDerivedMeta = {
  startYear: number | null;
  endYear: number | null;
  years: number[];
  isOngoing: boolean;
  isFeatured: boolean;
  hasStars: boolean;
  starCount: number | null;
};

type DerivedProject = ProjectEntry & {
  derived: ProjectDerivedMeta;
};

type ProjectGroupWithDerived = Omit<ProjectGroup, "items"> & {
  items: DerivedProject[];
};

type ProjectBadge = {
  label: string;
  variant?: "default" | "accent";
};

const FEATURE_THRESHOLD = 15;
const PRESENT_REGEX = /(present|至今)/i;
const ALL_FILTER_VALUE = "all" as const;

function buildYearRange(startYear: number | null, endYear: number | null, isOngoing: boolean, currentYear: number) {
  if (!startYear && !endYear) return [];
  const effectiveStart = startYear ?? endYear;
  if (!effectiveStart) return [];

  const resolvedEnd = isOngoing ? Math.max(currentYear, effectiveStart) : endYear ?? effectiveStart;
  const years: number[] = [];
  for (let year = effectiveStart; year <= resolvedEnd; year += 1) {
    years.push(year);
  }
  return years;
}

function deriveProject(project: ProjectEntry): DerivedProject {
  const yearMatches = project.period.match(/\d{4}/g)?.map(Number) ?? [];
  const startYear = yearMatches[0] ?? null;
  const endYear = yearMatches.length > 1 ? yearMatches[yearMatches.length - 1] : yearMatches[0] ?? null;
  const isOngoing = PRESENT_REGEX.test(project.period);
  const years = buildYearRange(startYear, endYear, isOngoing, new Date().getFullYear());
  const rawStars = project.metrics?.stars ?? null;
  const parsedStars = rawStars === null || rawStars === undefined ? null : Number(rawStars);
  const hasStars = typeof parsedStars === "number" && !Number.isNaN(parsedStars);
  const starCount = hasStars ? parsedStars : null;
  const isFeatured = typeof starCount === "number" && starCount >= FEATURE_THRESHOLD;

  return {
    ...project,
    derived: {
      startYear,
      endYear: endYear ?? startYear ?? null,
      years,
      isOngoing,
      isFeatured,
      hasStars,
      starCount
    }
  };
}

function compareProjects(a: DerivedProject, b: DerivedProject) {
  const endYearA = a.derived.endYear ?? a.derived.startYear ?? 0;
  const endYearB = b.derived.endYear ?? b.derived.startYear ?? 0;
  if (endYearA !== endYearB) {
    return endYearB - endYearA;
  }

  if (a.derived.isOngoing !== b.derived.isOngoing) {
    return a.derived.isOngoing ? -1 : 1;
  }

  if (a.derived.hasStars !== b.derived.hasStars) {
    return a.derived.hasStars ? -1 : 1;
  }

  if (a.derived.hasStars && b.derived.hasStars && a.derived.starCount !== b.derived.starCount) {
    return (b.derived.starCount ?? 0) - (a.derived.starCount ?? 0);
  }

  return a.name.localeCompare(b.name);
}

function decorateGroup(group: ProjectGroup): ProjectGroupWithDerived {
  return {
    ...group,
    items: group.items.map(deriveProject).sort(compareProjects)
  };
}

export default function ProjectsPage() {
  const { locale } = useLocale();
  const groups = getProjectsContent()[locale].groups;
  const updates = getUpdatesContent()[locale].updates.slice(0, 7);

  const copy = {
    en: {
      heroTitle: "Project Portfolio",
      heroDescription: "Academic and open-source projects showcasing multi-agent systems, robotics, and software engineering.",
      filters: {
        year: "Year",
        label: "Tag",
        all: "All",
        ongoing: "Ongoing",
        featured: "Featured"
      },
      badges: {
        ongoing: "Ongoing",
        featured: "Featured"
      },
      empty: "No projects match the selected filters.",
      sections: {
        updates: {
          title: "Recent Project Updates",
          eyebrow: "Activity Log"
        }
      },
      groupLabels: {
        academic: "Academic",
        "open-source": "Open Source",
        default: "Projects"
      }
    },
    zh: {
      heroTitle: "项目集锦",
      heroDescription: "汇总多智能体系统、机器人与软件工程相关的科研成果与开源项目。",
      filters: {
        year: "年份",
        label: "标签",
        all: "全部",
        ongoing: "进行中",
        featured: "精华"
      },
      badges: {
        ongoing: "进行中",
        featured: "精华"
      },
      empty: "暂无符合当前筛选条件的项目。",
      sections: {
        updates: {
          title: "项目动态",
          eyebrow: "更新记录"
        }
      },
      groupLabels: {
        academic: "学术项目",
        "open-source": "开源项目",
        default: "项目"
      }
    }
  } as const;

  const t = copy[locale];
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
    <div className="space-y-16">
      <section className="space-y-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
        <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">{t.heroTitle}</h1>
        <p className="text-base leading-relaxed text-blue-900/70 dark:text-slate-300">
          {t.heroDescription}
        </p>
      </section>

      <FilterToolbar
        groups={[
          {
            id: "year",
            label: t.filters.year,
            value: yearFilter,
            options: yearOptions.map((year) => ({
              value: year,
              label: year === ALL_FILTER_VALUE ? t.filters.all : year
            })),
            onChange: setYearFilter
          },
          {
            id: "tags",
            label: t.filters.label,
            value: labelFilter,
            options: [
              { value: ALL_FILTER_VALUE, label: t.filters.all },
              { value: "ongoing", label: t.filters.ongoing },
              { value: "featured", label: t.filters.featured }
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
                ? t.groupLabels["open-source"]
                : t.groupLabels[group.kind as keyof typeof t.groupLabels] ?? t.groupLabels.default
            }
          >
            <div className="grid gap-6 md:grid-cols-2">
              {group.items.map((project) => {
                const badges: ProjectBadge[] = [];
                if (project.derived.isFeatured) {
                  badges.push({ label: t.badges.featured, variant: "accent" });
                }
                if (project.derived.isOngoing) {
                  badges.push({ label: t.badges.ongoing, variant: "default" });
                }

                return <ProjectCard key={project.name} project={project} badges={badges} />;
              })}
            </div>
          </Section>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
          {t.empty}
        </div>
      )}

      <Section
        title={t.sections.updates.title}
        eyebrow={t.sections.updates.eyebrow}
      >
        <div className="space-y-3">
          {updates.map((update, index) => (
            <a 
              key={update.link || `${update.date}-${update.type}-${index}`}
              href={update.link}
              className="group flex items-start gap-4 py-3 px-4 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50"
            >
              <div className="flex-shrink-0 w-20 text-xs font-medium text-slate-500 dark:text-slate-400 pt-0.5">
                {update.date}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-slate-900 dark:text-slate-50 group-hover:text-brand transition-colors">
                  {update.title}
                </h3>
                <p className="mt-1 text-base text-slate-600 dark:text-slate-400">{update.summary}</p>
              </div>
              <span className="flex-shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
