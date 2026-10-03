import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeClient } from "./home-client";

import { getAwardsContent, getHomePageCopy, getProfileContent, getProjectsContent, getPublicationsContent, getPublicationsPageCopy, getResearchContent, getTimelineContent } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { selectHomeProjects } from "@/lib/project-utils";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = normalizeLocale(value);
  return locale ? buildLocaleMetadata(locale, "", { xDefaultPath: "/" }) : {};
}

export default async function HomePage({ params }: PageProps) {
  const { locale: value } = await params;
  const locale = normalizeLocale(value);
  if (!locale) notFound();

  return (
    <HomeClient
      locale={locale}
      profile={getProfileContent()[locale]}
      timeline={getTimelineContent()[locale]}
      awards={getAwardsContent()[locale].awards}
      interests={getResearchContent()[locale].interests}
      publications={getPublicationsContent()[locale].entries}
      publicationsCopy={getPublicationsPageCopy()[locale]}
      projects={selectHomeProjects(getProjectsContent()[locale].groups)}
      copy={getHomePageCopy()[locale]}
    />
  );
}
