"use client";

import Link from "next/link";
import { useEffect } from "react";

type LegacyPageRedirectProps = {
  href: string;
  title: string;
  description: string;
  action?: string;
};

export function LegacyPageRedirect({ href, title, description, action = "Continue" }: LegacyPageRedirectProps) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-8 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
      <Link href={href as any} className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 hover:text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:hover:text-slate-900">
        {action}
      </Link>
    </section>
  );
}
