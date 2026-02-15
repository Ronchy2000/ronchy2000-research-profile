import { notFound } from "next/navigation";

import { PublicationsClient } from "@/app/(site)/publications/publications-client";
import { getPublicationsContent, getPublicationsPageCopy } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

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
