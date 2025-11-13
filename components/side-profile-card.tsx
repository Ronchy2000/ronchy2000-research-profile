import Image from "next/image";
import Link from "next/link";

import type { LocaleProfile } from "@/lib/content-types";

type SideProfileCardProps = {
  profile: LocaleProfile;
  avatarSrc?: string;
  contactHref?: string;
  contactLabel?: string;
  contactHint?: string;
};

/**
 * Profile summary shown in the desktop sidebar. Displays avatar, names,
 * affiliation, keywords, and social links.
 */
export function SideProfileCard({ profile, avatarSrc = "/images/profile.jpg", contactHref, contactLabel, contactHint }: SideProfileCardProps) {
  const imageSrc = profile.avatar ?? avatarSrc;
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 lg:flex print:hidden">
      <div className="flex flex-col gap-4">
        <div className="relative h-40 w-40 self-center overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
          <Image
            src={imageSrc}
            alt={profile.name}
            fill
            priority
            className="object-cover object-top"
            sizes="(min-width: 1024px) 200px, 160px"
          />
        </div>
        <div className="w-full space-y-1 text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{profile.name}</h1>
          {profile.nativeName && (
            <p className="text-sm text-slate-600 dark:text-slate-300">{profile.nativeName}</p>
          )}
        </div>
      </div>
      <div className="w-full space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p className="font-medium text-slate-700 dark:text-slate-200">{profile.affiliation}</p>
        <p className="text-slate-600 dark:text-slate-300">{profile.title}</p>
        <p className="text-slate-600 dark:text-slate-300">{profile.location}</p>
        {contactHref ? (
          <Link
            href={contactHref as any}
            className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
          >
            <span aria-hidden="true" className="text-base leading-none">🔒</span>
            {contactLabel ?? "Reveal email"}
          </Link>
        ) : null}
        {contactHint ? (
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {contactHint}
          </p>
        ) : null}
      </div>
      <div className="w-full space-y-2 text-sm">
        {profile.social.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-200"
          >
            <span className="text-sm font-medium">{link.label}</span>
            <span aria-hidden="true" className="text-sm opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100">
              ↗
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}
