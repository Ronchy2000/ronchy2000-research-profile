"use client";

import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { useLocale } from "@/components/locale-provider";
import { getProjectsContent, getUpdatesContent } from "@/lib/content";

export default function ProjectsPage() {
  const { locale } = useLocale();
  const groups = getProjectsContent()[locale].groups;
  const updates = getUpdatesContent()[locale].updates.slice(0, 7);

  const copy = {
    en: {
      heroTitle: "Project Portfolio",
      heroDescription: "Academic and open-source projects showcasing multi-agent systems, robotics, and software engineering.",
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

  return (
    <div className="space-y-16">
      <section className="space-y-3 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
        <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">{t.heroTitle}</h1>
        <p className="text-base leading-relaxed text-blue-900/70 dark:text-slate-300">
          {t.heroDescription}
        </p>
      </section>

      {groups.map((group) => (
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
            {group.items.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </Section>
      ))}

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
