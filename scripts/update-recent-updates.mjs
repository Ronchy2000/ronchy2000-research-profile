import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const contentPath = join(projectRoot, "content", "updates.json");

const repository = process.env.GITHUB_REPOSITORY || "Ronchy2000/ronchy2000-research-profile";
const token = process.env.GITHUB_TOKEN;
const limit = Number(process.env.UPDATES_LIMIT || 5);

async function fetchCommits() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "recent-updates-script"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("[update-updates] No GITHUB_TOKEN provided; falling back to unauthenticated requests (rate limited).\n" +
      "Set GITHUB_TOKEN or add a PAT secret for higher limits.");
  }

  const response = await fetch(`https://api.github.com/repos/${repository}/commits?per_page=${limit}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status} ${response.statusText}`);
  }

  const commits = await response.json();
  return commits.map((commit) => ({
    date: commit.commit.author?.date?.slice(0, 10) ?? "",
    type: "Commit",
    title: commit.commit.message.split("\n")[0],
    summary: `Authored by ${commit.commit.author?.name ?? "unknown"}`,
    link: commit.html_url
  }));
}

async function main() {
  const existing = JSON.parse(readFileSync(contentPath, "utf8"));
  const updates = await fetchCommits();
  existing.updates = updates;

  writeFileSync(contentPath, `${JSON.stringify(existing, null, 2)}\n`);
  console.log(`[update-updates] Wrote ${updates.length} entries to content/updates.json`);
}

main().catch((error) => {
  console.error("[update-updates] Failed to refresh updates:", error);
  process.exit(1);
});
