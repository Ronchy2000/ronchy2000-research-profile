import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicationsClient } from "@/app/(site)/publications/publications-client";
import { getPublicationsContent, getPublicationsPageCopy } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  return locale ? buildLocaleMetadata(locale, "/publications") : {};
}

export default async function PublicationsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const entries = getPublicationsContent()[locale].entries;
  const copy = getPublicationsPageCopy()[locale];

  return <PublicationsClient entries={entries} locale={locale} copy={copy} />;
}
