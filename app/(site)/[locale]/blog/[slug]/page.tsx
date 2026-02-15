import Link from "next/link";
import { notFound } from "next/navigation";

import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { compileMDX } from "next-mdx-remote/rsc";

import { Callout } from "@/components/callout";
import { MDXContent } from "@/components/mdx-content";
import { Section } from "@/components/section";
import { Table } from "@/components/table";
import { getAllBlogSlugs, getBlogPostWithFallback } from "@/lib/blog";
import { LOCALES, normalizeLocale } from "@/lib/locale";

type PageParams = { locale: string; slug: string };

type PageProps = {
  params: PageParams | Promise<PageParams>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolved = await params;
  const locale = normalizeLocale(resolved.locale);
  if (!locale) {
    notFound();
  }

  const post = await getBlogPostWithFallback(locale, resolved.slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex]
      }
    },
    components: {
      Callout,
      Table
    }
  });

  const back =
    locale === "zh"
      ? { prefix: "返回", label: "博客列表", suffix: "查看更多内容。" }
      : { prefix: "Return to the ", label: "blog index", suffix: " for more entries." };

  return (
    <div className="space-y-16">
      <Section title={post.title} description={post.summary} eyebrow={post.date}>
        <MDXContent>
          {content}
          <p className="pt-6">
            {back.prefix}
            <Link href={`/${locale}/blog` as any} className="text-brand hover:text-brand-foreground">
              {back.label}
            </Link>
            {back.suffix}
          </p>
        </MDXContent>
      </Section>
    </div>
  );
}

