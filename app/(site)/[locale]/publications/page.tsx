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
        ...buildLocaleMetadata(locale, "/research"),
        ...buildNoIndexMetadata()
      }
    : {};
}

export default async function PublicationsRedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const copy = locale === "zh"
    ? {
        title: "发表成果已并入研究页面",
        description: "正在前往“研究与成果”页面的论文与专利章节。",
        action: "继续前往"
      }
    : {
        title: "Publications have moved",
        description: "Taking you to the Publications & Patents section of the consolidated Research page.",
        action: "Continue"
      };

  return (
    <LegacyPageRedirect
      href={`/${locale}/research#publications`}
      title={copy.title}
      description={copy.description}
      action={copy.action}
    />
  );
}
