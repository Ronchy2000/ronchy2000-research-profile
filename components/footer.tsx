import Link from "next/link";

import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 dark:text-slate-400">
        <div>
          © {new Date().getFullYear()} {siteConfig.name}. Crafted for academic visibility.
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href={`mailto:${siteConfig.email}`} className="hover:text-brand">
            {siteConfig.email}
          </a>
          {siteConfig.socials.map((social) => (
            <Link key={social.label} href={social.href} className="hover:text-brand" target="_blank">
              {social.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
