import { notFound } from "next/navigation";

import { ProjectsClient } from "./projects-client";

import { getProjectsContent, getProjectsPageCopy, getUpdatesContent } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const groups = getProjectsContent()[locale].groups;
  const updates = getUpdatesContent()[locale].updates.slice(0, 7);
  const copy = getProjectsPageCopy()[locale];

  return <ProjectsClient locale={locale} groups={groups} updates={updates} copy={copy} />;
}
