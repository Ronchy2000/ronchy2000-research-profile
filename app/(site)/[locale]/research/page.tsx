import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons";
import { PageOutline } from "@/components/page-outline";
import { Section } from "@/components/section";
import { getResearchContent, getResearchPageCopy } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = normalizeLocale(value);
  return locale ? buildLocaleMetadata(locale, "/research") : {};
}

export default async function ResearchPage({ params }: PageProps) {
  const { locale: value } = await params;
  const locale = normalizeLocale(value);
  if (!locale) notFound();

  const { experiences } = getResearchContent()[locale];
  const t = getResearchPageCopy()[locale];
  const outlineItems = [
    { id: "overview", label: t.outline.overview },
    { id: "experience", label: t.outline.experience }
  ];

  return (
    <div className="reading-layout">
      <div className="reading-content">
        <section id="overview" className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{t.heroTitle}</h1>
          <p className="max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">{t.heroDescription}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link id="interests" href={`/${locale}#interests`} className="inline-flex items-center gap-2 font-medium">{t.homeLinks.interests}<ArrowRightIcon className="h-4 w-4" /></Link>
            <Link id="publications" href={`/${locale}#publications`} className="inline-flex items-center gap-2 font-medium">{t.homeLinks.publications}<ArrowRightIcon className="h-4 w-4" /></Link>
          </div>
        </section>

        <Section id="experience" title={t.experienceTitle}>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {experiences.map((item) => (
              <article key={item.title} className="space-y-3 py-6 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{item.role}</span><span className="tabular-nums">{item.period}</span>
                </div>
                <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
                <details className="text-sm text-slate-600 dark:text-slate-300">
                  <summary className="w-fit cursor-pointer text-xs font-medium text-brand dark:text-blue-400">{t.detailsLabel}</summary>
                  <div className="mt-3 space-y-3 border-l border-slate-200 pl-4 dark:border-slate-700">
                    <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">{[item.advisor, item.funding].filter(Boolean).join(" · ")}</p>
                    <ul className="list-disc space-y-1 pl-4 leading-6">
                      {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                    {item.tags?.length ? <p className="text-xs text-slate-500 dark:text-slate-400">{item.tags.join(" / ")}</p> : null}
                  </div>
                </details>
              </article>
            ))}
          </div>
        </Section>
      </div>
      <PageOutline label={t.outline.label} items={outlineItems} locale={locale} />
    </div>
  );
}
