import type { ProjectEntry, ProjectGroup } from "@/lib/content-types";

export type ProjectDerivedMeta = {
  startYear: number | null;
  endYear: number | null;
  sortYear: number | null;
  years: number[];
  isOngoing: boolean;
  isFeatured: boolean;
  hasStars: boolean;
  starCount: number | null;
  orderIndex: number;
};

export type DerivedProject = ProjectEntry & {
  derived: ProjectDerivedMeta;
};

export type ProjectGroupWithDerived = Omit<ProjectGroup, "items"> & {
  items: DerivedProject[];
};

const FEATURE_THRESHOLD = 15;
const PRESENT_REGEX = /(present|至今)/i;

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

export function deriveProject(project: ProjectEntry, orderIndex = 0): DerivedProject {
  const yearMatches = project.period.match(/\d{4}/g)?.map(Number) ?? [];
  const startYear = yearMatches[0] ?? null;
  const endYear = yearMatches.length > 1 ? yearMatches[yearMatches.length - 1] : yearMatches[0] ?? null;
  const isOngoing = PRESENT_REGEX.test(project.period);
  const currentYear = new Date().getFullYear();
  const years = buildYearRange(startYear, endYear, isOngoing, currentYear);
  const rawStars = project.metrics?.stars ?? null;
  const parsedStars = rawStars === null || rawStars === undefined ? null : Number(rawStars);
  const hasStars = typeof parsedStars === "number" && !Number.isNaN(parsedStars);
  const starCount = hasStars ? parsedStars : null;
  const isFeatured = typeof starCount === "number" && starCount >= FEATURE_THRESHOLD;
  const sortYear = startYear ?? (isOngoing ? currentYear : endYear ?? null);

  return {
    ...project,
    derived: {
      startYear,
      endYear: endYear ?? startYear ?? null,
      sortYear,
      years,
      isOngoing,
      isFeatured,
      hasStars,
      starCount,
      orderIndex
    }
  };
}

export function compareProjects(a: DerivedProject, b: DerivedProject) {
  const sortYearA = a.derived.sortYear ?? 0;
  const sortYearB = b.derived.sortYear ?? 0;
  if (sortYearA !== sortYearB) {
    return sortYearB - sortYearA;
  }

  if (a.derived.isOngoing !== b.derived.isOngoing) {
    return a.derived.isOngoing ? -1 : 1;
  }

  const endYearA = a.derived.endYear ?? a.derived.startYear ?? 0;
  const endYearB = b.derived.endYear ?? b.derived.startYear ?? 0;
  if (endYearA !== endYearB) {
    return endYearB - endYearA;
  }

  if (a.derived.orderIndex !== b.derived.orderIndex) {
    return a.derived.orderIndex - b.derived.orderIndex;
  }

  return a.name.localeCompare(b.name);
}

export function compareProjectsByStars(a: DerivedProject, b: DerivedProject) {
  if (a.derived.hasStars !== b.derived.hasStars) {
    return a.derived.hasStars ? -1 : 1;
  }

  if (a.derived.hasStars && b.derived.hasStars && a.derived.starCount !== b.derived.starCount) {
    return (b.derived.starCount ?? 0) - (a.derived.starCount ?? 0);
  }

  return compareProjects(a, b);
}

export function decorateGroup(group: ProjectGroup): ProjectGroupWithDerived {
  return {
    ...group,
    items: group.items.map((project, index) => deriveProject(project, index)).sort(compareProjects)
  };
}
