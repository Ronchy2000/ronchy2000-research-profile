import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { getExperiencePageCopy, getTimelineContent } from "@/lib/content";
import { normalizeLocale } from "@/lib/locale";

type PageProps = {
  params: { locale: string } | Promise<{ locale: string }>;
};

export default async function ExperiencePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) {
    notFound();
  }

  const { experience, education } = getTimelineContent()[locale];
  const copy = getExperiencePageCopy()[locale];

  return (
    <div className="space-y-16">
      <Section
        title={copy.experience.title}
        description={copy.experience.description}
        eyebrow={copy.experience.eyebrow}
      >
        <Timeline items={experience} />
      </Section>

      <Section
        title={copy.education.title}
        description={copy.education.description}
        eyebrow={copy.education.eyebrow}
      >
        <Timeline items={education} />
      </Section>
    </div>
  );
}
