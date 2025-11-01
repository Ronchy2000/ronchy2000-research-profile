import Hero from "@/components/hero";
import { HonorsList } from "@/components/honors-list";
import { ProjectGrid } from "@/components/project-grid";
import { PublicationList } from "@/components/publication-list";
import { SectionHeading } from "@/components/section-heading";
import { SkillCards } from "@/components/skill-cards";
import { Timeline } from "@/components/timeline";
import {
  education,
  honors,
  internships,
  openSourceProjects,
  patents,
  publications,
  researchProjects,
  siteConfig,
  skills
} from "@/data/site";

export default function Home() {
  return (
    <div className="space-y-20 sm:space-y-24">
      <Hero />

      <section id="education">
        <SectionHeading
          title="Education"
          description="Rigorous training across control engineering, multi-agent systems, and embedded autonomy."
        />
        <Timeline items={education} />
      </section>

      <section id="research">
        <SectionHeading
          title="Research Highlights"
          description="Selected projects translating multi-agent reinforcement learning into resilient robotic systems."
        />
        <ProjectGrid items={researchProjects} />
      </section>

      <section id="publications">
        <SectionHeading
          title="Publications & Manuscripts"
          description="Peer-reviewed outputs and current manuscripts. Asterisks (*) denote student first authorship."
        />
        <PublicationList items={publications} />

        <div className="mt-10 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Patents</h3>
          <PublicationList items={patents} />
        </div>
      </section>

      <section id="projects">
        <SectionHeading
          title="Open-source Projects"
          description="Hands-on repositories that distill research ideas into reusable codebases."
        />
        <ProjectGrid items={openSourceProjects} />
      </section>

      <section id="experience">
        <SectionHeading
          title="Industry Experience"
          description="Internships pairing AI software craftsmanship with embedded systems engineering."
        />
        <Timeline items={internships} />
      </section>

      <section id="honors">
        <SectionHeading
          title="Honors & Skills"
          description={`${siteConfig.name}'s recognitions and technical stack for building autonomous systems.`}
        />
        <HonorsList items={honors} />
        <div className="mt-8">
          <SkillCards categories={skills} />
        </div>
      </section>
    </div>
  );
}
