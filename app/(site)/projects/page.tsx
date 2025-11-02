import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { getProjectsContent, getUpdatesContent } from "@/lib/content";

export default function ProjectsPage() {
  const { groups } = getProjectsContent();
  const updates = getUpdatesContent().updates.slice(0, 7);

  return (
    <div className="space-y-16">
      <section className="space-y-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
        <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">Project Portfolio</h1>
        <p className="text-base leading-relaxed text-blue-900/70 dark:text-slate-300">
          Academic and open-source projects showcasing multi-agent systems, robotics, and software engineering.
        </p>
      </section>

      {groups.map((group) => (
        <Section
          key={group.title}
          title={group.title}
          eyebrow={group.kind === "open-source" ? "Open Source" : "Academic"}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {group.items.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </Section>
      ))}

      <Section
        title="Recent Project Updates"
        eyebrow="Activity Log"
      >
        <div className="space-y-3">
          {updates.map((update) => (
            <a 
              key={update.title}
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
