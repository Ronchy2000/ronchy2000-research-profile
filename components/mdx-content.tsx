"use client";

import type { ReactNode } from "react";

type MDXContentProps = {
  children: ReactNode;
};

/**
 * Lightweight typography wrapper for MDX content.
 */
export function MDXContent({ children }: MDXContentProps) {
  return (
    <article className="max-w-none space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
      {children}
    </article>
  );
}
