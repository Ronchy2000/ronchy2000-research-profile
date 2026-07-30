import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyPageRedirect } from "@/components/legacy-page-redirect";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata, buildNoIndexMetadata } from "@/lib/seo";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  return locale
    ? {
        ...buildLocaleMetadata(locale, "/about"),
        ...buildNoIndexMetadata()
      }
    : {};
}

export default async function ExperienceRedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const copy = locale === "zh"
    ? {
        title: "经历页面已完成整合",
        description: "正在前往“关于”页面的行业经历章节。",
        action: "继续前往"
      }
    : {
        title: "Experience has moved",
        description: "Taking you to the Industry Experience section of the consolidated About page.",
        action: "Continue"
      };

  return (
    <LegacyPageRedirect
      href={`/${locale}/about#experience`}
      title={copy.title}
      description={copy.description}
      action={copy.action}
    />
  );
}
