import { BlogClient } from "./blog-client";

import { getBlogPostMetas } from "@/lib/blog";
import { getBlogPageCopy } from "@/lib/content";
import { getRequestLocale } from "@/lib/locale.server";

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const posts = await getBlogPostMetas(locale);
  const copy = getBlogPageCopy()[locale];

  return <BlogClient copy={copy} posts={posts} />;
}
