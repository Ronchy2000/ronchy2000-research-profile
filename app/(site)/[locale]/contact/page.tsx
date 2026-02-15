import { notFound } from "next/navigation";

import { ContactClient } from "./contact-client";

import { getContactPageCopy, getProfileContent } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const profile = getProfileContent()[locale];
  const copy = getContactPageCopy()[locale];

  return <ContactClient locale={locale} profile={profile} copy={copy} />;
}
