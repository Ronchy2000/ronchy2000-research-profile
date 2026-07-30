import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageOutline } from "@/components/page-outline";
import { Section } from "@/components/section";
import { Table } from "@/components/table";
import { Tag } from "@/components/tag";
import { Timeline } from "@/components/timeline";
import {
  getAboutPageCopy,
  getAwardsContent,
  getProfileContent,
  getTimelineContent
} from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  return locale ? buildLocaleMetadata(locale, "/about") : {};
}

export default async function AboutPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const profile = getProfileContent()[locale];
  const timeline = getTimelineContent()[locale];
  const awards = getAwardsContent()[locale].awards;
  const copy = getAboutPageCopy()[locale];
  const outlineItems = [
    { id: "overview", label: copy.outline.overview },
    { id: "education", label: copy.outline.education },
    { id: "experience", label: copy.outline.experience },
    { id: "honors", label: copy.outline.honors },
    { id: "skills", label: copy.outline.skills }
  ];

  return (
    <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="space-y-16">
        <section
          id="overview"
          className="space-y-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand">{copy.intro.eyebrow}</p>
            <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">{copy.intro.title}</h1>
            <p className="max-w-3xl text-base leading-relaxed text-blue-900/70 dark:text-slate-300">
              {copy.intro.description}
            </p>
          </div>
          <div className="grid gap-5 rounded-2xl border border-blue-100/80 bg-white/70 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">{profile.name}</p>
              <p>{profile.title}</p>
              <p>{profile.affiliation}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <p>{profile.location}</p>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {profile.keywords.map((keyword) => (
                  <Tag key={keyword} label={keyword} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <a
              href={profile.cvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 hover:text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:text-slate-900"
            >
              {copy.intro.download}
            </a>
            <Link
              href={`/${locale}/contact` as any}
              className="rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200"
            >
              {copy.intro.contactAction}
            </Link>
          </div>
        </section>

        <Section id="education" title={copy.education.title} eyebrow={copy.education.eyebrow}>
          <Timeline items={timeline.education} />
        </Section>

        <Section id="experience" title={copy.experience.title} eyebrow={copy.experience.eyebrow}>
          <Timeline items={timeline.experience} />
        </Section>

        <Section id="honors" title={copy.honors.title} eyebrow={copy.honors.eyebrow}>
          <Table
            headers={[...copy.honors.headers]}
            rows={awards.map((award) => [award.year, award.title, award.issuer])}
          />
        </Section>

        <Section id="skills" title={copy.skills.title} eyebrow={copy.skills.eyebrow}>
          <Table
            headers={[...copy.skills.headers]}
            rows={copy.skills.rows.map((row) => [...row])}
          />
        </Section>
      </div>

      <PageOutline label={copy.outline.label} items={outlineItems} />
    </div>
  );
}
