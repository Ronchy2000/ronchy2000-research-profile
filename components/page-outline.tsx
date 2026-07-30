"use client";

import { useEffect, useState } from "react";

type PageOutlineItem = {
  id: string;
  label: string;
};

type PageOutlineProps = {
  label: string;
  items: PageOutlineItem[];
};

/**
 * In-page outline for long topic pages. It becomes a horizontal index on
 * smaller screens and a sticky rail on wide screens.
 */
export function PageOutline({ label, items }: PageOutlineProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const updateFromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && items.some((item) => item.id === id)) {
        setActiveId(id);
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 0.1]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
    };
  }, [items]);

  return (
    <nav
      aria-label={label}
      className="order-first overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-[0_20px_45px_-40px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 xl:order-none xl:sticky xl:top-28 xl:p-4"
    >
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <ol className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide xl:flex-col xl:overflow-visible xl:pb-0">
        {items.map((item, index) => {
          const active = item.id === activeId;

          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                onClick={() => setActiveId(item.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white hover:text-white dark:bg-white dark:text-slate-900 dark:hover:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <span className="text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
