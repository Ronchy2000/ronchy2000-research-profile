"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/locale";

type PageOutlineProps = {
  label: string;
  items: { id: string; label: string }[];
  locale: Locale;
};

export function PageOutline({ label, items, locale }: PageOutlineProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const header = document.querySelector(".site-header");
    let frame = 0;

    const update = () => {
      frame = 0;
      const headerHeight = header?.getBoundingClientRect().height ?? 64;
      document.documentElement.style.setProperty("--header-height", headerHeight + "px");
      const offset = headerHeight + (window.innerWidth < 1024 ? 76 : 48);
      const reached = sections.filter((section) => section.getBoundingClientRect().top <= offset);
      const atEnd = window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      setActiveId((atEnd ? sections.at(-1) : reached.at(-1) ?? sections[0])?.id ?? "");
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    sections.forEach((section) => observer.observe(section));
    if (header) observer.observe(header);
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [items]);

  return (
    <nav aria-label={label} className="page-outline print:hidden">
      <p className="mb-4 hidden text-xs font-medium text-slate-500 lg:block dark:text-slate-400">{label}</p>
      <div className="flex items-center gap-3 lg:block">
        <ol className="flex min-w-0 flex-1 gap-1 overflow-x-auto scrollbar-hide lg:block lg:space-y-1 lg:overflow-visible lg:border-l lg:border-slate-200 dark:lg:border-slate-800">
          {items.map((item) => (
            <li key={item.id} className="shrink-0">
              <a
                href={"#" + item.id}
                aria-current={activeId === item.id ? "location" : undefined}
                className={`block whitespace-nowrap rounded-md px-3 py-2 text-xs leading-5 lg:rounded-none lg:border-l-2 lg:py-1.5 lg:text-sm lg:-ml-px ${activeId === item.id
                  ? "border-brand bg-brand/5 font-medium text-brand dark:text-blue-400 lg:bg-transparent"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
        <div className="flex shrink-0 gap-1 border-l border-slate-200 pl-2 text-xs lg:mt-5 lg:flex-col lg:gap-3 lg:border-l-0 lg:pl-3 dark:border-slate-800">
          <a href="#site-top" aria-label={locale === "zh" ? "↑ 回到顶部" : "↑ Back to top"} title={locale === "zh" ? "回到顶部" : "Back to top"} className="p-2 text-slate-500 hover:text-brand lg:p-0 dark:text-slate-400">
            ↑ <span className="hidden lg:inline">{locale === "zh" ? "回到顶部" : "Back to top"}</span>
          </a>
          <a href="#page-end" aria-label={locale === "zh" ? "↓ 直达底部" : "↓ To the bottom"} title={locale === "zh" ? "直达底部" : "To the bottom"} className="p-2 text-slate-500 hover:text-brand lg:p-0 dark:text-slate-400">
            ↓ <span className="hidden lg:inline">{locale === "zh" ? "直达底部" : "To the bottom"}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
