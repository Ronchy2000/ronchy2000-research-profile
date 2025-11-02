import { Callout } from "@/components/callout";
import { Section } from "@/components/section";
import { getProfileContent } from "@/lib/content";

export default function ContactPage() {
  const profile = getProfileContent().en;

  return (
    <div className="space-y-16">
      <Section
        title="Contact"
        description="Reach out for collaborations, research discussions, or speaking opportunities."
        eyebrow="Connect"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Email: <a href={`mailto:${profile.email}`} className="font-medium text-brand hover:text-brand-foreground">{profile.email}</a></p>
            <p>GitHub: <a href="#" className="text-brand hover:text-brand-foreground">@Ronchy2000</a></p>
            <p>Google Scholar: <a href="#" className="text-brand hover:text-brand-foreground">scholar profile</a></p>
            <p>Location: {profile.location}</p>
          </div>
          <form className="space-y-4" aria-label="Contact form placeholder">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Introduce yourself and the collaboration idea."
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Send Message (placeholder)
            </button>
          </form>
        </div>
        <Callout title="Heads up">
          This form is a visual placeholder and does not send messages. Please use the email link on the left to contact me directly or replace this block with a real service (Formspree, Resend, etc.).
        </Callout>
      </Section>
    </div>
  );
}
