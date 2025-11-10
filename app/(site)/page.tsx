"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// 懒加载非关键组件，减少初始 bundle 大小
const InfiniteScrollUpdates = dynamic(
  () => import("@/components/infinite-scroll-updates").then(mod => ({ default: mod.InfiniteScrollUpdates })),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100" />
      </div>
    ),
    ssr: false // 这个组件在客户端才需要交互
  }
);

import { ProjectCard } from "@/components/project-card";
import { PublicationItem } from "@/components/publication-item";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import { useLocale } from "@/components/locale-provider";
import { getAwardsContent, getProfileContent, getProjectsContent, getPublicationsContent, getUpdatesContent } from "@/lib/content";

export default function HomePage() {
  const { locale } = useLocale();
  const profileContent = getProfileContent();
  const profile = profileContent[locale];
  const projects = getProjectsContent()[locale].groups;
  const publications = [...getPublicationsContent()[locale].entries]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 2);
  const updates = getUpdatesContent()[locale].updates.slice(0, 7);
  const awards = getAwardsContent()[locale].awards.slice(0, 6);

  const copy = {
    en: {
      heroIntro:
        "I am Rongqi Lu, a Control Engineering graduate student at Xidian University. I design learning-driven coordination policies that keep heterogeneous robot teams reliable outside simulation, with a focus on resilient communication, exploration, and edge deployment.",
      buttons: {
        cv: "View CV",
        publications: "View Publications",
        projects: "Explore Projects"
      },
      highlights: {
        title: "At a Glance",
        focusLabel: "Current focus",
        focusValue: "Robust coordination for aerial–ground robot teams",
        contactLabel: "Email",
        contactValue: "Reveal email",
        locationLabel: "Based in"
      },
      sections: {
        updates: { title: "Recent Updates", eyebrow: "Activity" },
        projects: { title: "Highlighted Projects", eyebrow: "Projects", action: "All projects" },
        publications: { title: "Latest Writing", eyebrow: "Publications", action: "All entries" },
        awards: { title: "Honors & Awards", eyebrow: "Recognition", action: "Full CV" }
      }
    },
    zh: {
      heroIntro:
        "陆荣琦，西安电子科技大学控制工程专业研究生。关注多机器人协同与多智能体强化学习，帮助智能体在复杂环境中自如沟通、稳健探索。",
      buttons: {
        cv: "查看简历",
        publications: "浏览论文",
        projects: "查看项目"
      },
      highlights: {
        title: "工作速览",
        focusLabel: "研究重点",
        focusValue: "多智能体强化学习, 追逃博弈",
        contactLabel: "联系邮箱",
        contactValue: "点击显示邮箱",
        locationLabel: "常驻城市"
      },
      sections: {
        updates: { title: "近期动态", eyebrow: "动态" },
        projects: { title: "精选项目", eyebrow: "项目", action: "全部项目" },
        publications: { title: "近期写作", eyebrow: "成果", action: "查看全部" },
        awards: { title: "荣誉与奖项", eyebrow: "荣誉", action: "完整简历" }
      }
    }
  } as const;

  const t = copy[locale];
  const highlightItems = [
    { label: t.highlights.focusLabel, value: t.highlights.focusValue },
    { label: t.highlights.contactLabel, value: t.highlights.contactValue, href: "/contact" },
    { label: t.highlights.locationLabel, value: profile.location }
  ];

  return (
    <div className="space-y-16">
      <section className="space-y-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_32px_80px_-50px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900/70 print:border-none print:bg-transparent print:shadow-none">
        <div className="flex flex-wrap items-baseline gap-3 text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          <span>{profile.name}</span>
          {profile.nativeName ? <span>{profile.nativeName}</span> : null}
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t.heroIntro}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.keywords.map((keyword) => (
                <Tag key={keyword} label={keyword} />
              ))}
            </div>
            <div className="flex flex-col gap-3 text-sm font-medium sm:flex-row sm:flex-wrap">
              <Link href="/cv" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                {t.buttons.cv}
              </Link>
              <Link href="/publications" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200">
                {t.buttons.publications}
              </Link>
              <Link href="/projects" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200">
                {t.buttons.projects}
              </Link>
            </div>
          </div>
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {t.highlights.title}
            </h2>
            <dl className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {highlightItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-1 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-700">
                  <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    {item.label}
                  </dt>
                  <dd className="text-base font-medium text-slate-900 dark:text-slate-50">
                    {item.href ? (
                      <a href={item.href} className="hover:text-brand dark:hover:text-brand">
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <Section
        title={t.sections.updates.title}
        eyebrow={t.sections.updates.eyebrow}
      >
        <InfiniteScrollUpdates updates={updates} />
      </Section>

      <Section
        title={t.sections.projects.title}
        eyebrow={t.sections.projects.eyebrow}
        actions={<Link href="/projects" className="text-sm font-medium text-brand hover:text-brand-foreground">{t.sections.projects.action}</Link>}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {projects
            .flatMap((group) => group.items)
            .slice(0, 4)
            .map((item) => (
              <ProjectCard key={item.name} project={item} />
            ))}
        </div>
      </Section>

      <Section
        title={t.sections.publications.title}
        eyebrow={t.sections.publications.eyebrow}
        actions={<Link href="/publications" className="text-sm font-medium text-brand hover:text-brand-foreground">{t.sections.publications.action}</Link>}
      >
        <div className="space-y-6">
          {publications.map((entry) => (
            <PublicationItem key={entry.id} item={entry} locale={locale} />
          ))}
        </div>
      </Section>

      <Section
        title={t.sections.awards.title}
        eyebrow={t.sections.awards.eyebrow}
        actions={<Link href="/cv" className="text-sm font-medium text-brand hover:text-brand-foreground">{t.sections.awards.action}</Link>}
      >
        <ul className="space-y-2 text-base text-slate-600 dark:text-slate-300">
          {awards.map((award) => (
            <li key={`${award.title}-${award.year}`} className="leading-relaxed">
              <span className="font-medium text-slate-900 dark:text-slate-50">{award.title}</span>
              {award.issuer ? <span> · {award.issuer}</span> : null}
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400"> · {award.year}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
