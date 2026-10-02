import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomeClient } from "./home-client";

import { getAwardsContent, getHomePageCopy, getProfileContent, getPublicationsContent, getTimelineContent } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";
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

  const latestPublication = getPublicationsContent()[locale].entries
    .filter((entry) => entry.type === "J" || entry.type === "C")
    .sort((a, b) => Number(b.year) - Number(a.year))[0];

  return (
    <HomeClient
      locale={locale}
      profile={getProfileContent()[locale]}
      timeline={getTimelineContent()[locale]}
      awards={getAwardsContent()[locale].awards}
      latestPublication={latestPublication}
      copy={getHomePageCopy()[locale]}
    />
  );
}
