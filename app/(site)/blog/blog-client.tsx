"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { FilterToolbar } from "@/components/filter-toolbar";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import type { BlogPostMeta, BlogPostType } from "@/lib/blog-types";
import type { BlogPageCopy } from "@/lib/content-types";
import type { Locale } from "@/lib/locale";

type BlogPostWithYear = BlogPostMeta & { year: string };

type BlogClientProps = {
  copy: BlogPageCopy[Locale];
  posts: BlogPostMeta[];
};

const ALL_FILTER_VALUE = "all" as const;

export function BlogClient({ copy, posts }: BlogClientProps) {
  const [typeFilter, setTypeFilter] = useState<string>(ALL_FILTER_VALUE);
  const [yearFilter, setYearFilter] = useState<string>(ALL_FILTER_VALUE);

  const normalizedPosts = useMemo<BlogPostWithYear[]>(() => {
    return posts
      .map((post) => ({
        ...post,
        year: new Date(post.date).getFullYear().toString()
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  const yearOptions = useMemo(() => {
    const uniqueYears = Array.from(new Set(normalizedPosts.map((post) => post.year))).sort(
      (a, b) => Number(b) - Number(a)
    );
    return [ALL_FILTER_VALUE, ...uniqueYears];
  }, [normalizedPosts]);

  const filteredPosts = useMemo(() => {
    return normalizedPosts.filter((post) => {
      const matchesType = typeFilter === ALL_FILTER_VALUE || post.type === typeFilter;
      const matchesYear = yearFilter === ALL_FILTER_VALUE || post.year === yearFilter;
      return matchesType && matchesYear;
    });
  }, [normalizedPosts, typeFilter, yearFilter]);

  const typeOptions = (Object.keys(copy.types) as BlogPostType[]).map((type) => ({
    value: type,
    label: copy.types[type]
  }));

  return (
    <div className="space-y-16">
      <Section title={copy.title} description={copy.description} eyebrow={copy.eyebrow}>
        <FilterToolbar
          groups={[
            {
              id: "type",
              label: copy.filters.type,
              value: typeFilter,
              options: [{ value: ALL_FILTER_VALUE, label: copy.filters.all }, ...typeOptions],
              onChange: setTypeFilter
            },
            {
              id: "year",
              label: copy.filters.year,
              value: yearFilter,
              options: yearOptions.map((year) => ({
                value: year,
                label: year === ALL_FILTER_VALUE ? copy.filters.all : year
              })),
              onChange: setYearFilter
            }
          ]}
        />

        <div className="mt-4 space-y-5">
          {filteredPosts.length ? (
            filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-slate-200 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{copy.types[post.type]}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                  <Link
                    href={`/blog/${post.slug}` as any}
                    className="hover:text-brand"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.summary ? <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{post.summary}</p> : null}
                {post.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Tag key={`${post.slug}-${tag}`} label={tag} />
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
              {copy.empty}
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
