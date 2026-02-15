"use client";

import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { useLocale } from "@/components/locale-provider";
import { getExperiencePageCopy, getTimelineContent } from "@/lib/content";

export default function ExperiencePage() {
  const { locale } = useLocale();
  const { experience, education } = getTimelineContent()[locale];

  const t = getExperiencePageCopy()[locale];

  return (
    <div className="space-y-16">
      <Section
        title={t.experience.title}
        description={t.experience.description}
        eyebrow={t.experience.eyebrow}
      >
        <Timeline items={experience} />
      </Section>

      <Section
        title={t.education.title}
        description={t.education.description}
        eyebrow={t.education.eyebrow}
      >
        <Timeline items={education} />
      </Section>
    </div>
  );
}
