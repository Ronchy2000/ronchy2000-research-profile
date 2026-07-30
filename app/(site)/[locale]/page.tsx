import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeClient } from "./home-client";

import {
  getHomePageCopy,
  getProfileContent,
  getProjectsContent,
} from "@/lib/content";
import { getBlogPostMetas } from "@/lib/blog";
import { normalizeLocale } from "@/lib/locale";
import { compareProjectsByStars, deriveProject } from "@/lib/project-utils";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  return locale ? buildLocaleMetadata(locale, "", { xDefaultPath: "/" }) : {};
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const profile = getProfileContent()[locale];
  const highlightProjects = getProjectsContent()[locale].groups
    .flatMap((group) => group.items)
    .map((project, index) => deriveProject(project, index))
    .sort(compareProjectsByStars)
    .slice(0, 3);
  const posts = (await getBlogPostMetas(locale)).slice(0, 2);
  const copy = getHomePageCopy()[locale];

  return (
    <HomeClient
      locale={locale}
      profile={profile}
      highlightProjects={highlightProjects}
      posts={posts}
      copy={copy}
    />
  );
}
