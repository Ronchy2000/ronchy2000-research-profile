import type { Metadata } from "next";

import { LOCALES, type Locale } from "@/lib/locale";

const DEFAULT_CANONICAL_ORIGIN = "https://ronchylu.com";
const NOINDEX_VALUES = new Set(["0", "false", "no", "off"]);

function normalizeOrigin(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeSuffix(suffix = "") {
  if (!suffix) return "";
  return suffix.startsWith("/") ? suffix : `/${suffix}`;
}

function parseIndexable(value: string | undefined) {
  if (!value) return true;
  return !NOINDEX_VALUES.has(value.toLowerCase());
}

export const seoSiteConfig = {
  canonicalOrigin: normalizeOrigin(process.env.SITE_CANONICAL_ORIGIN ?? DEFAULT_CANONICAL_ORIGIN),
  indexable: parseIndexable(process.env.SITE_INDEXABLE)
};

export const NOINDEX_FOLLOW_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true
  }
};

export function getSiteRobotsMetadata(): NonNullable<Metadata["robots"]> {
  return seoSiteConfig.indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true
        }
      }
    : NOINDEX_FOLLOW_ROBOTS;
}

export function getCanonicalUrl(path: string) {
  return `${seoSiteConfig.canonicalOrigin}${normalizePath(path)}`;
}

export function getLocalePath(locale: Locale, suffix = "") {
  return suffix ? `/${locale}${normalizeSuffix(suffix)}` : `/${locale}`;
}

type LocaleMetadataOptions = {
  xDefaultPath?: string;
};

export function buildLocaleMetadata(
  locale: Locale,
  suffix = "",
  options: LocaleMetadataOptions = {}
): Metadata {
  const languages: Record<string, string> = {
    en: getCanonicalUrl(getLocalePath("en", suffix)),
    "zh-CN": getCanonicalUrl(getLocalePath("zh", suffix))
  };

  if (options.xDefaultPath) {
    languages["x-default"] = getCanonicalUrl(options.xDefaultPath);
  }

  return {
    alternates: {
      canonical: getCanonicalUrl(getLocalePath(locale, suffix)),
      languages
    }
  };
}

export function buildNoIndexMetadata(): Metadata {
  return {
    robots: NOINDEX_FOLLOW_ROBOTS
  };
}

export const SEO_STATIC_LOCALE_SUFFIXES = [
  "",
  "/research",
  "/publications",
  "/projects",
  "/experience",
  "/cv",
  "/blog",
  "/contact"
] as const;

export async function getSitemapPaths() {
  const { getAllBlogSlugs } = await import("@/lib/blog");

  const paths = LOCALES.flatMap((locale) =>
    SEO_STATIC_LOCALE_SUFFIXES.map((suffix) => getLocalePath(locale, suffix))
  );
  const blogSlugs = await getAllBlogSlugs();

  for (const locale of LOCALES) {
    for (const slug of blogSlugs) {
      paths.push(getLocalePath(locale, `/blog/${slug}`));
    }
  }

  return paths;
}
