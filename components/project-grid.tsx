import type { Project } from "@/data/site";

type ProjectGridProps = {
  items: Project[];
};

export function ProjectGrid({ items }: ProjectGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((project) => (
        <article
          key={project.name}
          className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{project.name}</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {project.organization}
              {project.role ? ` · ${project.role}` : ""}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{project.period}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{project.description}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {project.highlights.map((highlight, index) => (
              <li key={index}>• {highlight}</li>
            ))}
          </ul>
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              className="mt-4 inline-flex text-sm font-medium text-brand hover:text-brand-foreground"
            >
              View repository →
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
