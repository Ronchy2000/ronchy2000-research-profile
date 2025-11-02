import Link from "next/link";

import { Section } from "@/components/section";
import { Table } from "@/components/table";
import { Timeline } from "@/components/timeline";
import { getAwardsContent, getProfileContent, getTimelineContent } from "@/lib/content";

export default function CVPage() {
  const profile = getProfileContent().en;
  const timeline = getTimelineContent();
  const awards = getAwardsContent().awards;

  return (
    <div className="space-y-16">
      <Section
        title="Curriculum Vitae"
        description="Downloadable PDF and printable view. Adjust content via the files in /content."
        eyebrow="Overview"
        actions={
          <a href={profile.cvLink} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            Download PDF
          </a>
        }
      >
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>{profile.title}</p>
          <p>{profile.affiliation}</p>
          <p>
            Email: <a href={`mailto:${profile.email}`} className="text-brand hover:text-brand-foreground">{profile.email}</a>
          </p>
          <p>Location: {profile.location}</p>
        </div>
      </Section>

      <Section title="Education" eyebrow="CV">
        <Timeline items={timeline.education} />
      </Section>

      <Section title="Professional Experience" eyebrow="CV">
        <Timeline items={timeline.experience} />
      </Section>

      <Section title="Selected Honors" eyebrow="CV">
        <Table
          headers={["Year", "Award", "Issuer"]}
          rows={awards.map((award) => [award.year, award.title, award.issuer])}
          caption="Maintain this table via content/awards.json"
        />
      </Section>

      <Section title="Skills & Coursework" eyebrow="CV" description="Placeholder entries; customize as needed.">
        <Table
          headers={["Category", "Items"]}
          rows={[
            ["Programming", "Python, C/C++, MATLAB"],
            ["Frameworks", "PyTorch, ROS, OpenCV"],
            ["Courses", "Optimal Control, Multi-agent Systems, Embedded Systems"]
          ]}
        />
        <p className="text-xs text-slate-500">
          Print tips: use the browser print dialog (Ctrl/Cmd+P). Navigation and ambient elements are hidden automatically.
        </p>
      </Section>

      <Section title="Additional Links" eyebrow="CV">
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>
            <Link href="/publications" className="text-brand hover:text-brand-foreground">
              Publications overview
            </Link>
          </li>
          <li>
            <Link href="/projects" className="text-brand hover:text-brand-foreground">
              Project portfolio
            </Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}
