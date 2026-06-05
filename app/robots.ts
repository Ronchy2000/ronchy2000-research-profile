import type { MetadataRoute } from "next";

import { getCanonicalUrl, seoSiteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: seoSiteConfig.indexable ? getCanonicalUrl("/sitemap.xml") : undefined
  };
}
