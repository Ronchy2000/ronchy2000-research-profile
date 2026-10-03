import Image from "next/image";
import Link from "next/link";

import { PublicationsClient } from "@/app/(site)/publications/publications-client";
import { ArrowRightIcon, ExternalLinkIcon } from "@/components/icons";
import { PageOutline } from "@/components/page-outline";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import type { AwardEntry, HomePageCopy, LocaleProfile, ProjectEntry, PublicationEntry, PublicationsPageCopy, ResearchInterest, TimelineContent } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";

type HomeClientProps = {
  locale: Locale;
  profile: LocaleProfile;
  timeline: TimelineContent[Locale];
  awards: AwardEntry[];
  interests: ResearchInterest[];
  publications: PublicationEntry[];
  publicationsCopy: PublicationsPageCopy[Locale];
  projects: ProjectEntry[];
  copy: HomePageCopy[Locale];
};

export function HomeClient({ locale, profile, timeline, awards, interests, publications, publicationsCopy, projects, copy }: HomeClientProps) {
  const base = "/" + locale;
  const outlineItems = [
    { id: "intro", label: copy.outline.intro },
    { id: "interests", label: copy.interests.title },
    { id: "publications", label: publicationsCopy.section.title },
    { id: "projects", label: copy.projects.title },
    { id: "background", label: copy.outline.background },
    { id: "honors", label: copy.outline.honors },
    { id: "skills", label: copy.outline.skills }
  ];

  return (
    <div className="reading-layout">
      <div className="reading-content">
        <section id="intro" className="space-y-6">
          <div className="flex items-start justify-between gap-5 sm:gap-8">
            <div className="min-w-0 pt-2">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{profile.affiliation}</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{profile.name}</h1>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{profile.nativeName}{profile.aka ? " · " + profile.aka : ""}</p>
              <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">{profile.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{profile.location}</p>
            </div>
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.name} width={168} height={196} priority className="h-36 w-28 shrink-0 rounded-xl object-cover object-top sm:h-44 sm:w-36" />
            ) : null}
          </div>
          <div className="max-w-[52rem] space-y-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            <p>{copy.heroIntro}</p>
            <p>{copy.beyondResearch}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <a href={profile.cvLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 hover:text-white">
              {copy.buttons.cv}<ExternalLinkIcon className="h-4 w-4" />
            </a>
            {profile.social.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-slate-600 underline-offset-4 hover:text-brand hover:underline dark:text-slate-300">{social.label}</a>
            ))}
          </div>
        </section>

        <Section id="interests" title={copy.interests.title} actions={
          <Link href={base + "/research"} className="inline-flex items-center gap-2 text-sm font-medium">{copy.buttons.research}<ArrowRightIcon className="h-4 w-4" /></Link>
        }>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {interests.map((interest) => (
              <div key={interest.title} className="space-y-2">
                <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">{interest.title}</dt>
                <dd className="text-sm leading-6 text-slate-600 dark:text-slate-300">{interest.description}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <PublicationsClient entries={publications} locale={locale} copy={publicationsCopy} sectionId="publications" />

        <Section id="projects" title={copy.projects.title} description={copy.projects.description} actions={
          <Link href={base + "/projects"} className="inline-flex items-center gap-2 text-sm font-medium">{copy.projects.all}<ArrowRightIcon className="h-4 w-4" /></Link>
        }>
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
        </Section>

        <Section id="background" title={copy.background.title}>
          <div className="grid gap-8 sm:grid-cols-2">
            <section id="education" className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.background.education}</h3>
              <Timeline items={timeline.education} detailLabel={copy.background.details} />
            </section>
            <section id="experience" className="space-y-5">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{copy.background.experience}</h3>
              <Timeline items={timeline.experience} detailLabel={copy.background.details} />
            </section>
          </div>
        </Section>

        <Section id="honors" title={copy.honors.title}>
          <ul className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {awards.map((award) => (
              <li key={award.title + award.year} className="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0">
                <span className="w-20 shrink-0 text-xs tabular-nums text-slate-500 dark:text-slate-400">{award.year}</span>
                <div className="min-w-0 text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{award.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 sm:ml-2 sm:mt-0 sm:inline dark:text-slate-400">{award.issuer}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title={copy.skills.title}>
          <dl className="space-y-3 text-sm">
            {copy.skills.rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 sm:grid-cols-[112px_1fr] sm:gap-5">
                <dt className="font-medium text-slate-800 dark:text-slate-100">{label}</dt>
                <dd className="text-slate-600 dark:text-slate-300">{value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
      <PageOutline label={copy.outline.label} items={outlineItems} locale={locale} />
    </div>
  );
}
