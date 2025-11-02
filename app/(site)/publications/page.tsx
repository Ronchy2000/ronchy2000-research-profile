import { getPublicationsContent } from "@/lib/content";
import { PublicationsClient } from "./publications-client";

export default function PublicationsPage() {
  const { entries } = getPublicationsContent();

  return <PublicationsClient entries={entries} />;
}
