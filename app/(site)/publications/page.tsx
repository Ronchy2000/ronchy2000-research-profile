"use client";

import { useLocale } from "@/components/locale-provider";
import { getPublicationsContent } from "@/lib/content";
import { PublicationsClient } from "./publications-client";

export default function PublicationsPage() {
  const { locale } = useLocale();
  const entries = getPublicationsContent()[locale].entries;

  return <PublicationsClient entries={entries} locale={locale} />;
}
