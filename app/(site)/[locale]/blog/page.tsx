import { notFound } from "next/navigation";

import { BlogClient } from "@/app/(site)/blog/blog-client";
import { getBlogPostMetas } from "@/lib/blog";
import { getBlogPageCopy } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const posts = await getBlogPostMetas(locale);
  const copy = getBlogPageCopy()[locale];

  return <BlogClient copy={copy} posts={posts} locale={locale} />;
}
