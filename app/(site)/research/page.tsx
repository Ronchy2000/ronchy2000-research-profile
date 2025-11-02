import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { getResearchContent } from "@/lib/content";

export default function ResearchPage() {
  const { interests, experiences } = getResearchContent();

  return (
    <div className="space-y-16">
      <section className="space-y-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-8 shadow-[0_24px_60px_-45px_rgba(30,64,175,0.45)] dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
        <h1 className="text-3xl font-semibold text-blue-900 dark:text-white">Research Overview</h1>
        <p className="text-base leading-relaxed text-blue-900/70 dark:text-slate-300">
          My work blends multi-agent reinforcement learning, distributed robotics, and embedded autonomy, focusing on reliable coordination strategies for autonomous robot teams.
        </p>
      </section>

      <Section
        title="Research Interests"
        eyebrow="Focus Areas"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {interests.map((interest) => (
            <article key={interest.title} className="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/70">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{interest.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{interest.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        title="Research Experience"
        eyebrow="Experience"
      >
        <Timeline
          items={experiences.map((item) => ({
            title: `${item.title} · ${item.role}`,
            period: item.period,
            location: [item.advisor, item.funding].filter(Boolean).join(" · ") || undefined,
            details: [item.summary, ...item.bullets]
          }))}
        />
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
          Interested in collaboration? Feel free to reach out via the Contact page.
        </p>
      </Section>
    </div>
  );
}
