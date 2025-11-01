import type { SkillCategory } from "@/data/site";

type SkillCardsProps = {
  categories: SkillCategory[];
};

export function SkillCards({ categories }: SkillCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {categories.map((category) => (
        <div
          key={category.name}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
        >
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{category.name}</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {category.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
