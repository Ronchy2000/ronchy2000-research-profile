"use client";

import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import type { BlogPostMeta } from "@/lib/blog-types";
import type { HomePageCopy, LocaleProfile, ProjectEntry } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";

type HomeClientProps = {
  locale: Locale;
  profile: LocaleProfile;
  highlightProjects: ProjectEntry[];
  posts: BlogPostMeta[];
  copy: HomePageCopy[Locale];
};

export function HomeClient({
  locale,
  profile,
  highlightProjects,
  posts,
  copy
}: HomeClientProps) {
  const base = `/${locale}`;

  const highlightItems = [
    { label: copy.highlights.focusLabel, value: copy.highlights.focusValue },
    { label: copy.highlights.contactLabel, value: copy.highlights.contactValue, href: `${base}/contact` },
    { label: copy.highlights.locationLabel, value: profile.location }
  ];

  const exploreItems = [
    {
      title: copy.sections.explore.research.title,
      description: copy.sections.explore.research.description,
      href: `${base}/research`
    },
    {
      title: copy.sections.explore.projects.title,
      description: copy.sections.explore.projects.description,
      href: `${base}/projects`
    },
    {
      title: copy.sections.explore.blog.title,
      description: copy.sections.explore.blog.description,
      href: `${base}/blog`
    }
  ];

  return (
    <div className="space-y-16">
      <section
        id="intro"
        className="space-y-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_32px_80px_-50px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900/70 print:border-none print:bg-transparent print:shadow-none"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-50">{profile.name}</span>
          {profile.nativeName ? <span className="text-slate-500 dark:text-slate-400">{profile.nativeName}</span> : null}
          {profile.pronouns ? <span className="text-slate-500 dark:text-slate-400">{profile.pronouns}</span> : null}
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {copy.heroIntro}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.keywords.map((keyword) => (
                <Tag key={keyword} label={keyword} />
              ))}
            </div>
            <div className="flex flex-col gap-3 text-sm font-medium sm:flex-row sm:flex-wrap">
              <Link
                href={`${base}/research` as any}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 hover:text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:text-slate-900"
              >
                {copy.buttons.research}
              </Link>
              <Link
                href={`${base}/projects` as any}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200"
              >
                {copy.buttons.projects}
              </Link>
              <a
                href={profile.cvLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-slate-700 hover:border-slate-400 hover:text-brand dark:border-slate-600 dark:text-slate-200"
              >
                {copy.buttons.cv}
              </a>
            </div>
          </div>
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">
              {copy.highlights.title}
            </h2>
            <dl className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {highlightItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-700"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300">
                    {item.label}
                  </dt>
                  <dd className="text-base font-medium text-slate-900 dark:text-slate-50">
                    {item.href ? (
                      <Link href={item.href as any} className="hover:text-brand dark:hover:text-brand">
                        {item.value}
                      </Link>
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
        id="explore"
        title={copy.sections.explore.title}
        eyebrow={copy.sections.explore.eyebrow}
        description={copy.sections.explore.description}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {exploreItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white/90 p-6 text-slate-700 shadow-[0_20px_45px_-38px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:border-brand/40 hover:text-slate-900 hover:shadow-[0_24px_50px_-36px_rgba(37,99,235,0.35)] dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-brand/50 dark:hover:text-white"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
              <ArrowRightIcon aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="projects"
        title={copy.sections.projects.title}
        eyebrow={copy.sections.projects.eyebrow}
        actions={
          <Link href={`${base}/projects` as any} className="text-sm font-medium text-brand hover:text-brand-foreground">
            {copy.sections.projects.action}
          </Link>
        }
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {highlightProjects.map((item) => (
            <ProjectCard key={item.name} project={item} />
          ))}
        </div>
      </Section>

      <Section
        id="writing"
        title={copy.sections.writing.title}
        eyebrow={copy.sections.writing.eyebrow}
        actions={
          <Link href={`${base}/blog` as any} className="text-sm font-medium text-brand hover:text-brand-foreground">
            {copy.sections.writing.action}
          </Link>
        }
      >
        {posts.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`${base}/blog/${post.slug}` as any}
                className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white/90 p-6 text-slate-700 transition hover:border-brand/40 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-brand/50 dark:hover:text-white"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    {post.date}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand dark:text-white">
                    {post.title}
                  </h3>
                  {post.summary ? (
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.summary}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Tag key={`${post.slug}-${tag}`} label={tag} />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">{copy.sections.writing.empty}</p>
        )}
      </Section>

      <section
        id="contact"
        className="flex flex-col gap-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand">{copy.sections.contact.eyebrow}</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{copy.sections.contact.title}</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {copy.sections.contact.description}
          </p>
        </div>
        <Link
          href={`${base}/contact` as any}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-foreground hover:text-white"
        >
          {copy.sections.contact.action}
          <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
