import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import type { Locale } from "@/lib/locale";
import type { BlogPost, BlogPostMeta, BlogPostType } from "@/lib/blog-types";

export type BlogFrontmatter = {
  title?: string;
  date?: string;
  summary?: string;
  tags?: string[] | string;
  type?: BlogPostType;
  draft?: boolean;
};

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const SUPPORTED_EXTENSIONS = [".mdx", ".md"] as const;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function getLocaleDir(locale: Locale) {
  return path.join(BLOG_ROOT, locale);
}

function isSupportedPostFile(fileName: string) {
  return SUPPORTED_EXTENSIONS.some((ext) => fileName.toLowerCase().endsWith(ext));
}

function slugFromFileName(fileName: string) {
  const ext = SUPPORTED_EXTENSIONS.find((candidate) => fileName.toLowerCase().endsWith(candidate));
  if (!ext) return null;
  const slug = fileName.slice(0, -ext.length);
  if (!SLUG_REGEX.test(slug)) return null;
  return slug;
}

function normalizeTags(tags: BlogFrontmatter["tags"]) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map(String).map((tag) => tag.trim()).filter(Boolean);
  }
  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseDateToMs(value: string) {
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

async function safeReadDir(dir: string) {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const locales: Locale[] = ["en", "zh"];
  const slugs = new Set<string>();
  for (const locale of locales) {
    const files = await safeReadDir(getLocaleDir(locale));
    files.forEach((file) => {
      if (!isSupportedPostFile(file)) return;
      const slug = slugFromFileName(file);
      if (slug) slugs.add(slug);
    });
  }
  return Array.from(slugs).sort();
}

export async function getBlogPostMetas(locale: Locale): Promise<BlogPostMeta[]> {
  const files = await safeReadDir(getLocaleDir(locale));
  const metas: BlogPostMeta[] = [];

  for (const file of files) {
    if (!isSupportedPostFile(file)) continue;
    const slug = slugFromFileName(file);
    if (!slug) continue;

    const filePath = path.join(getLocaleDir(locale), file);
    const raw = await readFile(filePath, "utf8");
    const { data } = matter(raw);
    const fm = data as BlogFrontmatter;
    if (fm.draft) continue;

    const title = fm.title ? String(fm.title) : slug;
    const date = fm.date ? String(fm.date) : "1970-01-01";
    const summary = fm.summary ? String(fm.summary) : "";
    const tags = normalizeTags(fm.tags);
    const type: BlogPostType = fm.type === "research" ? "research" : "note";

    metas.push({ slug, title, date, summary, tags, type });
  }

  return metas.sort((a, b) => parseDateToMs(b.date) - parseDateToMs(a.date));
}

async function readPostFile(locale: Locale, slug: string) {
  if (!SLUG_REGEX.test(slug)) {
    return null;
  }

  for (const ext of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(getLocaleDir(locale), `${slug}${ext}`);
    try {
      return await readFile(filePath, "utf8");
    } catch {
      // keep trying
    }
  }

  return null;
}

export async function getBlogPost(locale: Locale, slug: string): Promise<BlogPost | null> {
  const raw = await readPostFile(locale, slug);
  if (!raw) return null;

  const { content, data } = matter(raw);
  const fm = data as BlogFrontmatter;
  if (fm.draft) return null;

  const title = fm.title ? String(fm.title) : slug;
  const date = fm.date ? String(fm.date) : "1970-01-01";
  const summary = fm.summary ? String(fm.summary) : "";
  const tags = normalizeTags(fm.tags);
  const type: BlogPostType = fm.type === "research" ? "research" : "note";

  return { slug, title, date, summary, tags, type, content };
}

export async function getBlogPostWithFallback(locale: Locale, slug: string): Promise<BlogPost | null> {
  const post = await getBlogPost(locale, slug);
  if (post) return post;

  const fallbackLocale: Locale = locale === "zh" ? "en" : "zh";
  return await getBlogPost(fallbackLocale, slug);
}
