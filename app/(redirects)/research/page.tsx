import type { Metadata } from "next";

import { LocaleRedirect } from "@/components/locale-redirect";
import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoIndexMetadata();

export default function LegacyResearchRedirectPage() {
  return <LocaleRedirect pathAfterLocale="/research" title="Redirecting to research..." />;
}
