import { Tag } from "@/components/tag";
import type { ProjectEntry } from "@/lib/content-types";

type ProjectCardProps = {
  project: ProjectEntry;
};

/**
 * Card layout for projects with summary text, tags, and action buttons.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const otherMetrics = project.metrics
    ? Object.entries(project.metrics).filter(([key]) => key !== "stars")
    : [];

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.45)] transition duration-150 hover:-translate-y-1 hover:shadow-[0_25px_45px_-35px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900/60">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          {project.period}
        </p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{project.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{project.summary}</p>
      </div>
      {project.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {project.metrics?.stars !== undefined ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
              <span aria-hidden="true">★</span>
              <span>{project.metrics.stars}</span>
            </div>
          ) : null}
          {otherMetrics.length ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {otherMetrics.map(([key, value]) => `${key}: ${value}`).join(" · ")}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {(project.links ?? [{ label: "Repository", href: "#" }]).map((link) => {
            // 检测是否为外部链接
            const isExternal = link.href.startsWith("http") || link.href.startsWith("//");
            
            return (
              <a
                key={link.label}
                href={link.href}
                {...(isExternal && {
                  target: "_blank",
                  rel: "noopener noreferrer"
                })}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
}
