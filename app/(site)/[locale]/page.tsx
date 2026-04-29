import { notFound } from "next/navigation";

import { HomeClient } from "./home-client";

import {
  getAwardsContent,
  getHomePageCopy,
  getProfileContent,
  getProjectsContent,
  getPublicationsContent,
  getUpdatesContent
} from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { compareProjectsByStars, deriveProject } from "@/lib/project-utils";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

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
    .slice(0, 4);
  const publications = [...getPublicationsContent()[locale].entries]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, 2);
  const updates = getUpdatesContent()[locale].updates.slice(0, 7);
  const awards = getAwardsContent()[locale].awards.slice(0, 6);
  const copy = getHomePageCopy()[locale];

  return (
    <HomeClient
      locale={locale}
      profile={profile}
      highlightProjects={highlightProjects}
      publications={publications}
      updates={updates}
      awards={awards}
      copy={copy}
    />
  );
}
