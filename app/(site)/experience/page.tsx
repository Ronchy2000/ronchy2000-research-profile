import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { getTimelineContent } from "@/lib/content";

export default function ExperiencePage() {
  const { experience, education } = getTimelineContent();

  return (
    <div className="space-y-16">
      <Section
        title="Professional Experience"
        description="Internships and industry collaborations that inform my research practice."
        eyebrow="Experience"
      >
        <Timeline items={experience} />
      </Section>

      <Section
        title="Academic Training"
        description="Formal education chronology."
        eyebrow="Education"
      >
        <Timeline items={education} />
      </Section>
    </div>
  );
}
