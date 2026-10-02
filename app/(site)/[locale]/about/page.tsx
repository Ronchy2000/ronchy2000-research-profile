import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyPageRedirect } from "@/components/legacy-page-redirect";
import { normalizeLocale } from "@/lib/locale";
import { buildLocaleMetadata, buildNoIndexMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = normalizeLocale(value);
  return locale ? { ...buildLocaleMetadata(locale), ...buildNoIndexMetadata() } : {};
}

export default async function RedirectPage({ params }: PageProps) {
  const { locale: value } = await params;
  const locale = normalizeLocale(value);
  if (!locale) notFound();

  return (
    <LegacyPageRedirect
      href={"/" + locale + "#intro"}
      title={locale === "zh" ? "关于页面已整合至主页" : "Profile has moved to the home page"}
      description={locale === "zh" ? "主页集中展示个人简介与履历，并保留查看 PDF 简历的入口。" : "The home page brings together my profile and background, with a link to view the PDF CV."}
      action={locale === "zh" ? "继续前往" : "Continue"}
    />
  );
}
