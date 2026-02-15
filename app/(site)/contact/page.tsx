"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { Callout } from "@/components/callout";
import { Section } from "@/components/section";
import { useLocale } from "@/components/locale-provider";
import { getContactPageCopy, getProfileContent } from "@/lib/content";

const ENCODED_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL_B64 ?? "";
const SUBJECT_PREFIX = process.env.NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT ?? "";

const findSocialLink = (profile: ReturnType<typeof getProfileContent>["en"], label: string) =>
  profile.social.find((item) => item.label.toLowerCase() === label.toLowerCase());

type FormFields = {
  name: string;
  replyEmail: string;
  message: string;
};

const decodeEmail = (value: string) => {
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
  // 默认主题前缀（根据语言）
  const defaultPrefix = locale === "zh" ? "来自您的个人网站" : "From your website";
  
  // 如果设置了环境变量且不为空，使用它作为所有语言的统一前缀
  // 否则使用根据语言的默认值
  const prefix = SUBJECT_PREFIX && SUBJECT_PREFIX.trim() ? SUBJECT_PREFIX : defaultPrefix;
  
  const subject = `${prefix} - ${fields.name}`;
  const body = [
    `Name: ${fields.name}`,
    `Reply email: ${fields.replyEmail}`,
    "",
    fields.message
  ].join("\n");
  
  // 手动编码，确保空格不会变成 +
  const subjectEncoded = encodeURIComponent(subject);
  const bodyEncoded = encodeURIComponent(body);
  
  return `mailto:${email}?subject=${subjectEncoded}&body=${bodyEncoded}`;
};

export default function ContactPage() {
  const { locale } = useLocale();
  const profileContent = getProfileContent();
  const profile = profileContent[locale];
  const contactEmail = useMemo(() => decodeEmail(ENCODED_CONTACT_EMAIL.trim()), []);
  const obfuscatedEmail = useMemo(() => maskEmail(contactEmail, locale === "zh" ? "尚未配置" : "Not configured"), [contactEmail, locale]);
  const t = getContactPageCopy()[locale];

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
      setError(t.feedback.emailMissing);
      return;
    }
    setRevealed(true);
  };

  const handleCopy = async () => {
    if (!contactEmail) {
      setError(t.feedback.emailMissing);
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
      setError(t.feedback.emailMissing);
      return;
    }
    if (!form.name.trim() || !form.replyEmail.trim() || !form.message.trim()) {
      setError(t.feedback.formInvalid);
      return;
    }
    setError(null);
    const mailtoHref = buildMailtoLink(contactEmail, form, locale);
    window.location.href = mailtoHref;
  };
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
            <p>{t.items.contact}: <span className="font-medium text-slate-900 dark:text-slate-100">{displayEmail}</span></p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReveal}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300 dark:hover:border-brand dark:hover:text-brand"
              >
                {t.revealButton}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300 dark:hover:border-brand dark:hover:text-brand"
              >
                {copyState === "copied" ? t.copySuccess : copyState === "error" ? t.copyError : t.copyButton}
              </button>
            </div>
            <p>{t.items.github}: <a href={githubLink} className="text-brand hover:text-brand-foreground dark:text-brand dark:hover:text-brand" target="_blank" rel="noopener noreferrer">@Ronchy2000</a></p>
            <p>{t.items.scholar}: <a href={scholarLink} className="text-brand hover:text-brand-foreground dark:text-brand dark:hover:text-brand" target="_blank" rel="noopener noreferrer">{t.scholarLabel}</a></p>
            <p>{t.items.location}: {profile.location}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {t.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <form className="space-y-4" aria-label="Message helper" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.form.nameLabel}
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleFieldChange("name")}
                placeholder={t.form.namePlaceholder}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="replyEmail" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.form.replyLabel}
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
                {t.form.messageLabel}
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={form.message}
                onChange={handleFieldChange("message")}
                placeholder={t.form.messagePlaceholder}
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
            {t.calloutPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Callout>
      </Section>
    </div>
  );
}
