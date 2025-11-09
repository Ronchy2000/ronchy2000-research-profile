"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { Callout } from "@/components/callout";
import { Section } from "@/components/section";
import { useLocale } from "@/components/locale-provider";
import { getProfileContent } from "@/lib/content";

const ENCODED_ALIAS = process.env.NEXT_PUBLIC_CONTACT_ALIAS_B64 ?? "";
const SUBJECT_PREFIX = process.env.NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT ?? "";

const findSocialLink = (profile: ReturnType<typeof getProfileContent>["en"], label: string) =>
  profile.social.find((item) => item.label.toLowerCase() === label.toLowerCase());

type FormFields = {
  name: string;
  replyEmail: string;
  message: string;
};

const decodeAlias = (value: string) => {
  if (!value) {
    return "";
  }
  const decoder =
    (typeof window !== "undefined" && typeof window.atob === "function" && window.atob.bind(window)) ||
    (typeof globalThis !== "undefined" && typeof globalThis.atob === "function" && globalThis.atob.bind(globalThis));
  if (!decoder) {
    return "";
  }
  try {
    return decoder(value);
  } catch {
    return "";
  }
};

const maskEmail = (value: string, fallback: string) => {
  if (!value) {
    return fallback;
  }
  return value.replace(/(.{2}).+(@.+)/, "$1***$2");
};

const buildMailtoLink = (email: string, fields: FormFields, locale: "en" | "zh") => {
  const prefix = SUBJECT_PREFIX || (locale === "zh" ? "来自个人主页的留言" : "Message from research profile");
  const subject = `${prefix} - ${fields.name}`;
  const body = [
    `Name: ${fields.name}`,
    `Reply email: ${fields.replyEmail}`,
    "",
    fields.message
  ].join("\n");
  const params = new URLSearchParams({ subject, body });
  return `mailto:${email}?${params.toString()}`;
};

export default function ContactPage() {
  const { locale } = useLocale();
  const profileContent = getProfileContent();
  const profile = profileContent[locale];
  const contactEmail = useMemo(() => decodeAlias(ENCODED_ALIAS.trim()), []);
  const obfuscatedEmail = useMemo(() => maskEmail(contactEmail, locale === "zh" ? "尚未配置" : "Not configured"), [contactEmail, locale]);

  const copy = {
    en: {
      title: "Contact",
      description: "Share a short note below. Your device will open the default mail app so that no third-party service stores the message.",
      eyebrow: "Connect",
      revealButton: "Reveal email alias",
      copyButton: "Copy address",
      copySuccess: "Copied",
      copyError: "Unable to copy",
      submit: "Open mail client",
      items: {
        contact: "Email alias",
        github: "GitHub",
        scholar: "Google Scholar",
        location: "Location"
      },
      notes: [
        "Alias rotates frequently, so scraping an old deployment won't expose the real inbox.",
        "Include affiliation or project links inside the message for faster routing."
      ],
      feedback: {
        aliasMissing: "Set NEXT_PUBLIC_CONTACT_ALIAS_B64 before deploying so the alias can be revealed.",
        formInvalid: "Fill out all fields before opening your mail client."
      },
      calloutTitle: "How this protects your inbox",
      calloutPoints: [
        "Email address never appears in the generated HTML until you deliberately reveal it.",
        "Visitors craft the final message locally via mailto, so no third-party relay captures the content.",
        "Reuse different aliases per hosting provider to trace where spam originates."
      ]
    },
    zh: {
      title: "联系我",
      description: "简单填写下方信息后，将在本地打开默认邮件客户端发送邮件，全程不依赖任何第三方表单服务。",
      eyebrow: "联系",
      revealButton: "点击显示邮箱别名",
      copyButton: "复制地址",
      copySuccess: "已复制",
      copyError: "复制失败",
      submit: "打开邮件客户端",
      items: {
        contact: "邮箱别名",
        github: "GitHub",
        scholar: "谷歌学术",
        location: "常驻城市"
      },
      notes: [
        "别名会定期轮换，即使旧版本页面被爬取也无法长期利用。",
        "留言时可附上机构或项目链接，便于我快速了解背景。"
      ],
      feedback: {
        aliasMissing: "请在部署前设置 NEXT_PUBLIC_CONTACT_ALIAS_B64，否则无法显示邮箱。",
        formInvalid: "请完整填写表单再打开邮件客户端。"
      },
      calloutTitle: "邮箱防爬虫策略",
      calloutPoints: [
        "在你主动点击前，网页不会输出真实邮箱。",
        "邮件内容由你的设备直接生成，不经过任何第三方。",
        "可以针对不同托管环境配置不同别名，用来追踪垃圾来源。"
      ]
    }
  } as const;

  const [form, setForm] = useState<FormFields>({ name: "", replyEmail: "", message: "" });
  const [revealed, setRevealed] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const githubLink = findSocialLink(profileContent.en, "GitHub")?.href ?? findSocialLink(profileContent.zh, "GitHub")?.href ?? "#";
  const scholarLink = findSocialLink(profileContent.en, "Google Scholar")?.href ?? findSocialLink(profileContent.zh, "Google Scholar")?.href ?? "#";

  const handleFieldChange = (field: keyof FormFields) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setError(null);
  };

  const handleReveal = () => {
    if (!contactEmail) {
      setError(copy[locale].feedback.aliasMissing);
      return;
    }
    setRevealed(true);
  };

  const handleCopy = async () => {
    if (!contactEmail) {
      setError(copy[locale].feedback.aliasMissing);
      return;
    }
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactEmail) {
      setError(copy[locale].feedback.aliasMissing);
      return;
    }
    if (!form.name.trim() || !form.replyEmail.trim() || !form.message.trim()) {
      setError(copy[locale].feedback.formInvalid);
      return;
    }
    setError(null);
    const mailtoHref = buildMailtoLink(contactEmail, form, locale);
    window.location.href = mailtoHref;
  };

  const t = copy[locale];
  const displayEmail = revealed ? contactEmail : obfuscatedEmail;

  return (
    <div className="space-y-16">
      <Section
        title={t.title}
        description={t.description}
        eyebrow={t.eyebrow}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-base text-slate-600 dark:text-slate-300">
            <p>{t.items.contact}: <span className="font-medium text-brand dark:text-brand-foreground">{displayEmail}</span></p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReveal}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200"
              >
                {t.revealButton}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:text-slate-200"
              >
                {copyState === "copied" ? t.copySuccess : copyState === "error" ? t.copyError : t.copyButton}
              </button>
            </div>
            <p>{t.items.github}: <a href={githubLink} className="text-brand hover:text-brand-foreground" target="_blank" rel="noopener noreferrer">@Ronchy2000</a></p>
            <p>{t.items.scholar}: <a href={scholarLink} className="text-brand hover:text-brand-foreground" target="_blank" rel="noopener noreferrer">{locale === "zh" ? "学术主页" : "Scholar profile"}</a></p>
            <p>{t.items.location}: {profile.location}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-500 dark:text-slate-400">
              {t.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <form className="space-y-4" aria-label="Message helper" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {locale === "zh" ? "姓名" : "Name"}
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleFieldChange("name")}
                placeholder={locale === "zh" ? "例如：张三" : "Your name"}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="replyEmail" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {locale === "zh" ? "回复邮箱" : "Reply email"}
              </label>
              <input
                id="replyEmail"
                type="email"
                required
                value={form.replyEmail}
                onChange={handleFieldChange("replyEmail")}
                placeholder="you@example.com"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {locale === "zh" ? "留言" : "Message"}
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={form.message}
                onChange={handleFieldChange("message")}
                placeholder={locale === "zh" ? "简单介绍合作意向" : "Introduce yourself and the idea"}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {t.submit}
            </button>
            {error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-700 dark:border-rose-400/60 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            ) : null}
          </form>
        </div>
        <Callout title={t.calloutTitle}>
          <ul className="list-disc space-y-2 pl-5">
            {copy[locale].calloutPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Callout>
      </Section>
    </div>
  );
}
