"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { FilterToolbar } from "@/components/filter-toolbar";
import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import { useLocale } from "@/components/locale-provider";

type Locale = "en" | "zh";
type BlogType = "research" | "note";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  type: BlogType;
};

type BlogPostWithYear = BlogPost & { year: string };

const ALL_FILTER_VALUE = "all" as const;

const TYPE_LABELS: Record<BlogType, Record<Locale, string>> = {
  research: { en: "Research", zh: "研究" },
  note: { en: "Notes", zh: "笔记" }
};

const POSTS: Record<Locale, BlogPost[]> = {
  en: [
    {
      slug: "sample-research-note",
      title: "Sample Research Note",
      date: "2025-02-01",
      summary: "An example of research notes and technical documentation.",
      tags: ["Research", "Example"],
      type: "research"
    },
    {
      slug: "reading-notes",
      title: "Reading Notes on Multi-agent Exploration",
      date: "2024-12-15",
      summary: "Insights from recent papers on decentralized coordination strategies.",
      tags: ["Notes"],
      type: "note"
    }
  ],
  zh: [
    {
      slug: "sample-research-note",
      title: "示例研究手记",
      date: "2025-02-01",
      summary: "演示如何整理实验记录、技术笔记与思考框架。",
      tags: ["研究", "示例"],
      type: "research"
    },
    {
      slug: "reading-notes",
      title: "多智能体探索阅读札记",
      date: "2024-12-15",
      summary: "梳理近期关于分布式协同与探索策略的论文要点。",
      tags: ["阅读笔记"],
      type: "note"
    }
  ]
} as const;

const COPY = {
  en: {
    title: "Blog",
    description: "Long-form research notes, project retrospectives, and reading summaries.",
    eyebrow: "Writing",
    filters: {
      type: "Type",
      year: "Year",
      all: "All"
    },
    empty: "No posts match the selected filters."
  },
  zh: {
    title: "博客",
    description: "记录研究手记、项目复盘与阅读体会。",
    eyebrow: "写作",
    filters: {
      type: "类型",
      year: "年份",
      all: "全部"
    },
    empty: "暂无符合筛选条件的文章。"
  }
} as const;

export default function BlogPage() {
  const { locale } = useLocale();
  const posts = POSTS[locale];
  const t = COPY[locale];

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

  const typeOptions = (Object.keys(TYPE_LABELS) as BlogType[]).map((type) => ({
    value: type,
    label: TYPE_LABELS[type][locale]
  }));

  return (
    <div className="space-y-16">
      <Section
        title={t.title}
        description={t.description}
        eyebrow={t.eyebrow}
      >
        <FilterToolbar
          groups={[
            {
              id: "type",
              label: t.filters.type,
              value: typeFilter,
              options: [{ value: ALL_FILTER_VALUE, label: t.filters.all }, ...typeOptions],
              onChange: setTypeFilter
            },
            {
              id: "year",
              label: t.filters.year,
              value: yearFilter,
              options: yearOptions.map((year) => ({
                value: year,
                label: year === ALL_FILTER_VALUE ? t.filters.all : year
              })),
              onChange: setYearFilter
            }
          ]}
        />

        <div className="mt-4 space-y-5">
          {filteredPosts.length ? (
            filteredPosts.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-slate-200 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                  <Link href={`/blog/${post.slug}`} className="hover:text-brand">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{post.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Tag key={`${post.slug}-${tag}`} label={tag} />
                  ))}
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
              {t.empty}
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
