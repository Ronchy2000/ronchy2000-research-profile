import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactClient } from "./contact-client";

import { getContactPageCopy, getProfileContent } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  return locale ? buildLocaleMetadata(locale, "/contact") : {};
}

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
