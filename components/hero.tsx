import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/data/site";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Hero() {
  return (
    <section id="about" className="flex flex-col gap-8 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-6">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {siteConfig.researchKeywords.join(" · ")}
        </span>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">
            {siteConfig.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{siteConfig.tagline}</p>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {siteConfig.shortBio}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={siteConfig.resume}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Download CV
          </Link>
          <a
            href={`mailto:${siteConfig.email}`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600"
          >
            Contact
          </a>
          {siteConfig.socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-brand dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600"
            >
              {social.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-center lg:w-auto">
        <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-slate-200 shadow-subtle dark:border-slate-800">
          {siteConfig.avatar ? (
            <Image
              src={siteConfig.avatar}
              alt={siteConfig.name}
              fill
              className="object-cover"
              sizes="176px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-4xl font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {getInitials(siteConfig.name)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
