import Link from "next/link";

import { InfiniteScrollUpdates } from "@/components/infinite-scroll-updates";
import { ProjectCard } from "@/components/project-card";
import { PublicationItem } from "@/components/publication-item";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import { getAwardsContent, getProfileContent, getProjectsContent, getPublicationsContent, getUpdatesContent } from "@/lib/content";

export default function HomePage() {
  const profile = getProfileContent().en;
  const projects = getProjectsContent().groups;
  const publications = [...getPublicationsContent().entries]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 2);
  const updates = getUpdatesContent().updates.slice(0, 7);
  const awards = getAwardsContent().awards.slice(0, 6);

  return (
    <div className="space-y-16">
      <section className="space-y-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_32px_80px_-50px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900/70 print:border-none print:bg-transparent print:shadow-none">
        <div className="flex flex-wrap items-baseline gap-3 text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          <span>{profile.name}</span>
          {profile.nativeName ? <span>{profile.nativeName}</span> : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 lg:text-4xl">
          Designing Reliable Multi-agent Intelligence for Autonomous Robot Teams.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
          I’m Rongqi Lu (陆荣琦), a graduate student in Control Engineering at Xidian University.
          My research focuses on learning-driven coordination strategies for multi-robot and multi-agent systems, emphasizing stability, robustness, and real-world deployment on embedded aerial and ground platforms.
          I enjoy bridging reinforcement learning theory with practical robotics, building systems that remain reliable outside simulation.
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.keywords.map((keyword) => (
            <Tag key={keyword} label={keyword} />
          ))}
        </div>
        <div className="flex flex-col gap-3 text-sm font-medium sm:flex-row sm:flex-wrap">
          <Link href="/cv" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            View CV
          </Link>
          <Link href="/publications" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200">
            View Publications
          </Link>
          <Link href="/projects" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200">
            Explore Projects
          </Link>
        </div>
      </section>

      <Section
        title="Recent Updates"
        eyebrow="Activity"
      >
        <InfiniteScrollUpdates updates={updates} />
      </Section>

      <Section
        title="Highlighted Projects"
        eyebrow="Projects"
        actions={<Link href="/projects" className="text-sm font-medium text-brand hover:text-brand-foreground">All projects</Link>}
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
        title="Latest Writing"
        eyebrow="Publications"
        actions={<Link href="/publications" className="text-sm font-medium text-brand hover:text-brand-foreground">All entries</Link>}
      >
        <div className="space-y-6">
          {publications.map((entry) => (
            <PublicationItem key={entry.id} item={entry} />
          ))}
        </div>
      </Section>

      <Section
        title="Honors & Awards"
        eyebrow="Recognition"
        actions={<Link href="/cv" className="text-sm font-medium text-brand hover:text-brand-foreground">Full CV</Link>}
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
