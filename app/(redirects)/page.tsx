import type { Metadata } from "next";

import { LocaleRedirect } from "@/components/locale-redirect";
import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoIndexMetadata();

export default function RootRedirectPage() {
  return <LocaleRedirect />;
}
