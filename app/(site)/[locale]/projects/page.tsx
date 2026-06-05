import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectsClient } from "./projects-client";

import { getProjectsContent, getProjectsPageCopy, getUpdatesContent } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  return locale ? buildLocaleMetadata(locale, "/projects") : {};
}

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
