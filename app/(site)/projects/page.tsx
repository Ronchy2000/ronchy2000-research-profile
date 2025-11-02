import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { getProjectsContent } from "@/lib/content";

export default function ProjectsPage() {
  const { groups } = getProjectsContent();

  return (
    <div className="space-y-16">
      <section className="space-y-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
        <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">Project Portfolio</h1>
        <p className="text-sm leading-relaxed text-blue-900/70 dark:text-slate-300">
          Academic and open-source efforts are grouped below. Reorder or annotate items in <span className="font-mono text-xs">content/projects.json</span>.
        </p>
      </section>

      {groups.map((group) => (
        <Section
          key={group.title}
          title={group.title}
          description={
            group.kind === "open-source"
              ? "Open repositories maintained with reproducible setups and documentation."
              : "Academic and course projects demonstrating applied research."
          }
          eyebrow={group.kind === "open-source" ? "Open Source" : "Academic"}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {group.items.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </Section>
      ))}
    </div>
  );
}
