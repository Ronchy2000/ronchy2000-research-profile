import { siteConfig } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 sm:px-10">
        <a href="#about" className="font-semibold text-slate-900 dark:text-slate-100">
          {siteConfig.name}
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          {siteConfig.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-brand dark:hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
