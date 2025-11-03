"use client";

import Link from "next/link";

import { Section } from "@/components/section";
import { Tag } from "@/components/tag";
import { useLocale } from "@/components/locale-provider";

const POSTS = {
  en: [
    {
      slug: "sample-research-note",
      title: "Sample Research Note",
      date: "2025-02-01",
      summary: "An example of research notes and technical documentation.",
      tags: ["Research", "Example"]
    },
    {
      slug: "reading-notes",
      title: "Reading Notes on Multi-agent Exploration",
      date: "2024-12-15",
      summary: "Insights from recent papers on decentralized coordination strategies.",
      tags: ["Notes"]
    }
  ],
  zh: [
    {
      slug: "sample-research-note",
      title: "示例研究手记",
      date: "2025-02-01",
      summary: "演示如何整理实验记录、技术笔记与思考框架。",
      tags: ["研究", "示例"]
    },
    {
      slug: "reading-notes",
      title: "多智能体探索阅读札记",
      date: "2024-12-15",
      summary: "梳理近期关于分布式协同与探索策略的论文要点。",
      tags: ["阅读笔记"]
    }
  ]
} as const;

const COPY = {
  en: {
    title: "Blog",
    description: "Long-form research notes, project retrospectives, and reading summaries.",
    eyebrow: "Writing"
  },
  zh: {
    title: "博客",
    description: "记录研究手记、项目复盘与阅读体会。",
    eyebrow: "写作"
  }
} as const;

export default function BlogPage() {
  const { locale } = useLocale();
  const posts = POSTS[locale];
  const t = COPY[locale];

  return (
    <div className="space-y-16">
      <Section
        title={t.title}
        description={t.description}
        eyebrow={t.eyebrow}
      >
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-slate-200 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
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
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
