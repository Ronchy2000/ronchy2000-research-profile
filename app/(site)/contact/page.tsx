"use client";

import { Callout } from "@/components/callout";
import { Section } from "@/components/section";
import { useLocale } from "@/components/locale-provider";
import { getProfileContent } from "@/lib/content";

const findSocialLink = (profile: ReturnType<typeof getProfileContent>["en"], label: string) =>
  profile.social.find((item) => item.label.toLowerCase() === label.toLowerCase());

export default function ContactPage() {
  const { locale } = useLocale();
  const profileContent = getProfileContent();
  const profile = profileContent[locale];

  const copy = {
    en: {
      title: "Contact",
      description: "Reach out for collaborations, research discussions, or speaking opportunities.",
      eyebrow: "Connect",
      fields: {
        name: { label: "Name", placeholder: "Your name" },
        email: { label: "Email", placeholder: "you@example.com" },
        message: { label: "Message", placeholder: "Introduce yourself and the collaboration idea." }
      },
      button: "Send Message",
      calloutTitle: "Preferred Contact",
      calloutBody: "For the fastest response, please reach out via the email link above. I typically respond within 1-2 business days.",
      items: {
        email: "Email",
        github: "GitHub",
        scholar: "Google Scholar",
        location: "Location"
      }
    },
    zh: {
      title: "联系我",
      description: "欢迎就科研合作、学术交流或分享邀请与我沟通。",
      eyebrow: "联系",
      fields: {
        name: { label: "姓名", placeholder: "例如：张三" },
        email: { label: "邮箱", placeholder: "例如：you@example.com" },
        message: { label: "留言", placeholder: "简单介绍自己与想探讨的合作方向。" }
      },
      button: "发送消息",
      calloutTitle: "优先联系方式",
      calloutBody: "若希望尽快取得回复，建议直接发送邮件，我通常会在 1-2 个工作日内答复。",
      items: {
        email: "邮箱",
        github: "GitHub",
        scholar: "谷歌学术",
        location: "常驻城市"
      }
    }
  } as const;

  const t = copy[locale];
  const githubLink = findSocialLink(profileContent.en, "GitHub")?.href ?? findSocialLink(profileContent.zh, "GitHub")?.href ?? "#";
  const scholarLink = findSocialLink(profileContent.en, "Google Scholar")?.href ?? findSocialLink(profileContent.zh, "Google Scholar")?.href ?? "#";

  return (
    <div className="space-y-16">
      <Section
        title={t.title}
        description={t.description}
        eyebrow={t.eyebrow}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-base text-slate-600 dark:text-slate-300">
            <p>{t.items.email}: <a href={`mailto:${profile.email}`} className="font-medium text-brand hover:text-brand-foreground">{profile.email}</a></p>
            <p>{t.items.github}: <a href={githubLink} className="text-brand hover:text-brand-foreground" target="_blank" rel="noopener noreferrer">@Ronchy2000</a></p>
            <p>{t.items.scholar}: <a href={scholarLink} className="text-brand hover:text-brand-foreground" target="_blank" rel="noopener noreferrer">{locale === "zh" ? "学术主页" : "Scholar profile"}</a></p>
            <p>{t.items.location}: {profile.location}</p>
          </div>
          <form className="space-y-4" aria-label="Contact form placeholder">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.fields.name.label}
              </label>
              <input
                id="name"
                type="text"
                placeholder={t.fields.name.placeholder}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.fields.email.label}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t.fields.email.placeholder}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.fields.message.label}
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder={t.fields.message.placeholder}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {t.button}
            </button>
          </form>
        </div>
        <Callout title={t.calloutTitle}>
          {t.calloutBody}
        </Callout>
      </Section>
    </div>
  );
}
