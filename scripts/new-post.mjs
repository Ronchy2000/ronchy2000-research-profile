import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

function getArg(flag, fallback = null) {
  const idx = args.indexOf(flag);
  if (idx === -1) return fallback;
  const value = args[idx + 1];
  if (!value || value.startsWith("-")) return fallback;
  return value;
}

function todayISO() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const locale = getArg("--locale", getArg("-l", "en"));
const slug = getArg("--slug", getArg("-s"));
const title = getArg("--title", slug);
const type = getArg("--type", "note");
const date = getArg("--date", todayISO());

if (!slug) {
  console.error("Missing --slug. Example: node scripts/new-post.mjs --locale en --slug my-first-post --title \"My First Post\"");
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
  console.error("Invalid slug. Use letters/numbers and hyphens only, e.g. my-first-post");
  process.exit(1);
}

if (locale !== "en" && locale !== "zh") {
  console.error("Invalid --locale. Use en or zh.");
  process.exit(1);
}

const blogDir = path.join(process.cwd(), "content", "blog", locale);
const filePath = path.join(blogDir, `${slug}.mdx`);

try {
  await access(filePath);
  console.error(`Post already exists: ${path.relative(process.cwd(), filePath)}`);
  process.exit(1);
} catch {
  // ok
}

await mkdir(blogDir, { recursive: true });

const template = `---\n` +
  `title: "${title ?? slug}"\n` +
  `date: "${date}"\n` +
  `summary: ""\n` +
  `tags: []\n` +
  `type: "${type}"\n` +
  `draft: true\n` +
  `---\n\n` +
  `## Notes\n\n` +
  `Write here.\n`;

await writeFile(filePath, template, "utf8");
console.log(`Created: ${path.relative(process.cwd(), filePath)}`);

