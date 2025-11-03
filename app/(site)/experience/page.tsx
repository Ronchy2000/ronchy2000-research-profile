"use client";

import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { useLocale } from "@/components/locale-provider";
import { getTimelineContent } from "@/lib/content";

export default function ExperiencePage() {
  const { locale } = useLocale();
  const { experience, education } = getTimelineContent()[locale];

  const copy = {
    en: {
      experience: {
        title: "Professional Experience",
        description: "Internships and industry collaborations that inform my research practice.",
        eyebrow: "Experience"
      },
      education: {
        title: "Academic Training",
        description: "Formal education chronology.",
        eyebrow: "Education"
      }
    },
    zh: {
      experience: {
        title: "实习与合作经历",
        description: "记录支撑科研思路的企业实习与产学研合作体验。",
        eyebrow: "经历"
      },
      education: {
        title: "教育背景",
        description: "梳理从本科到研究生阶段的学习历程。",
        eyebrow: "教育"
      }
    }
  } as const;

  const t = copy[locale];

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
