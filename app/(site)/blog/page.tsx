import Link from "next/link";

import { Section } from "@/components/section";
import { Tag } from "@/components/tag";

const examplePosts = [
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
];

export default function BlogPage() {
  return (
    <div className="space-y-16">
      <Section
        title="Blog"
        description="Long-form research notes, project retrospectives, and reading summaries."
        eyebrow="Writing"
      >
        <div className="space-y-6">
          {examplePosts.map((post) => (
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
