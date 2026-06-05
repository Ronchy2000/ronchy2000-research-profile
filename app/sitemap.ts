import type { MetadataRoute } from "next";

import { getCanonicalUrl, getSitemapPaths, seoSiteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!seoSiteConfig.indexable) {
    return [];
  }

  const paths = await getSitemapPaths();

  return paths.map((path) => ({
    url: getCanonicalUrl(path)
  }));
}
