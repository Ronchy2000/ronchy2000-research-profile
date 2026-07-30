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

export default async function CvRedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const copy = locale === "zh"
    ? {
        title: "网页简历已并入关于页面",
        description: "正在前往整合后的个人履历页面；PDF 简历下载入口保持不变。",
        action: "继续前往"
      }
    : {
        title: "The web CV has moved",
        description: "Taking you to the consolidated About page. The PDF download remains available there.",
        action: "Continue"
      };

  return (
    <LegacyPageRedirect
      href={`/${locale}/about`}
      title={copy.title}
      description={copy.description}
      action={copy.action}
    />
  );
}
