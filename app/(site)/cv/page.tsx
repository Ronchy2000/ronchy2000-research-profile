"use client";

import Link from "next/link";

import { Section } from "@/components/section";
import { Table } from "@/components/table";
import { Timeline } from "@/components/timeline";
import { useLocale } from "@/components/locale-provider";
import { getAwardsContent, getCVPageCopy, getProfileContent, getTimelineContent } from "@/lib/content";

export default function CVPage() {
  const { locale } = useLocale();
  const profileContent = getProfileContent();
  const profile = profileContent[locale];
  const timeline = getTimelineContent()[locale];
  const awards = getAwardsContent()[locale].awards;

  const t = getCVPageCopy()[locale];
  const honorsHeaders = [...t.honors.headers];
  const skillsHeaders = [...t.skills.headers];
  const skillsRows = t.skills.rows.map((row) => [...row]);

  return (
    <div className="space-y-16">
      <Section
        title={t.intro.title}
        description={t.intro.description}
        eyebrow={t.intro.eyebrow}
        actions={
          <a href={profile.cvLink} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            {t.intro.download}
          </a>
        }
      >
        <div className="space-y-3 text-base text-slate-600 dark:text-slate-300">
          <p>{profile.title}</p>
          <p>{profile.affiliation}</p>
          <p>
            {t.intro.contactLabel}: <Link href="/contact" className="text-brand hover:text-brand-foreground">{t.intro.contactAction}</Link>
          </p>
          <p>{t.intro.locationLabel}: {profile.location}</p>
        </div>
      </Section>

      <Section title={t.education.title} eyebrow={t.education.eyebrow}>
        <Timeline items={timeline.education} />
      </Section>

      <Section title={t.experience.title} eyebrow={t.experience.eyebrow}>
        <Timeline items={timeline.experience} />
      </Section>

      <Section title={t.honors.title} eyebrow={t.honors.eyebrow}>
        <Table
          headers={honorsHeaders}
          rows={awards.map((award) => [award.year, award.title, award.issuer])}
        />
      </Section>

      <Section title={t.skills.title} eyebrow={t.skills.eyebrow}>
        <Table
          headers={skillsHeaders}
          rows={skillsRows}
        />
      </Section>

      <Section title={t.links.title} eyebrow={t.links.eyebrow}>
        <ul className="space-y-2 text-base text-slate-600 dark:text-slate-300">
          <li>
            <Link href="/publications" className="text-brand hover:text-brand-foreground">
              {t.links.publications}
            </Link>
          </li>
          <li>
            <Link href="/projects" className="text-brand hover:text-brand-foreground">
              {t.links.projects}
            </Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}
