import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicationsClient } from "@/app/(site)/publications/publications-client";
import { ArrowRightIcon } from "@/components/icons";
import { PageOutline } from "@/components/page-outline";
import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import {
  getPublicationsContent,
  getPublicationsPageCopy,
  getResearchContent,
  getResearchPageCopy
} from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  return locale ? buildLocaleMetadata(locale, "/research") : {};
}

export default async function ResearchPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const { interests, experiences } = getResearchContent()[locale];
  const publications = getPublicationsContent()[locale].entries;
  const publicationsCopy = getPublicationsPageCopy()[locale];
  const t = getResearchPageCopy()[locale];
  const outlineItems = [
    { id: "overview", label: t.outline.overview },
    { id: "interests", label: t.outline.interests },
    { id: "experience", label: t.outline.experience },
    { id: "publications", label: t.outline.publications }
  ];

  return (
    <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="space-y-16">
        <section
          id="overview"
          className="space-y-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40"
        >
          <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">{t.heroTitle}</h1>
          <p className="text-base leading-relaxed text-blue-900/70 dark:text-slate-300">{t.heroDescription}</p>
        </section>

        <Section id="interests" title={t.interestsTitle} eyebrow={t.interestsEyebrow}>
          <div className="grid gap-4 md:grid-cols-2">
            {interests.map((interest) => (
              <article
                key={interest.title}
                className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{interest.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300">{interest.description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="experience" title={t.experienceTitle} eyebrow={t.experienceEyebrow}>
          <Timeline
            items={experiences.map((item) => ({
              title: `${item.title} · ${item.role}`,
              period: item.period,
              location: [item.advisor, item.funding].filter(Boolean).join(" · ") || undefined,
              details: [item.summary, ...item.bullets]
            }))}
          />
        </Section>

        <PublicationsClient
          entries={publications}
          locale={locale}
          copy={publicationsCopy}
          sectionId="publications"
        />

        <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white/80 p-7 dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.collaboration}</p>
          <Link
            href={`/${locale}/contact` as any}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-foreground hover:text-white"
          >
            {t.collaborationAction}
            <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <PageOutline label={t.outline.label} items={outlineItems} />
    </div>
  );
}
