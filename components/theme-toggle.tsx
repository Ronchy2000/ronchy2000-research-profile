"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07-7.07L19 5m-14 14-1.07 1.07M5 5l-1.07-1.07M19 19l1.07 1.07" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
    </svg>
  );
}

type ThemeToggleProps = {
  variant?: "default" | "subtle";
};

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const baseClasses =
    variant === "subtle"
      ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white/70 text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:text-white"
      : "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:text-brand";

  return (
    <button
      aria-label="Toggle dark mode"
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={baseClasses}
    >
      {mounted ? (
        isDark ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5 -translate-x-[1px]" />
        )
      ) : (
        <MoonIcon className="h-5 w-5 -translate-x-[1px]" />
      )}
    </button>
  );
}
