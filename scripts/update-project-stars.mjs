import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const projectsPath = join(projectRoot, "content", "projects.json");

const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "project-stars-script"
};

if (token) {
  headers.Authorization = `Bearer ${token}`;
} else {
  console.warn("[update-project-stars] No GITHUB_TOKEN provided; unauthenticated requests may be rate-limited.");
}

function extractRepo(link) {
  try {
    const url = new URL(link);
    if (url.hostname !== "github.com") return null;
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return `${owner}/${repo}`;
  } catch (error) {
    return null;
  }
}

async function fetchStarCount(repo) {
  const response = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status} ${response.statusText} for ${repo}`);
  }
  const data = await response.json();
  return data.stargazers_count ?? 0;
}

async function main() {
  const projectsContent = JSON.parse(readFileSync(projectsPath, "utf8"));
  let hasChanges = false;

  for (const group of projectsContent.groups ?? []) {
    for (const item of group.items ?? []) {
      const githubLink = item.links?.find((link) => link.href && extractRepo(link.href));
      const repo = githubLink ? extractRepo(githubLink.href) : null;
      if (!repo) continue;

      try {
        const stars = await fetchStarCount(repo);
        item.metrics = { ...(item.metrics ?? {}), stars };
        hasChanges = true;
        console.log(`[update-project-stars] ${repo} -> ${stars} stars`);
      } catch (error) {
        console.error(`[update-project-stars] Failed to update ${repo}:`, error.message);
      }
    }
  }

  if (hasChanges) {
    writeFileSync(projectsPath, `${JSON.stringify(projectsContent, null, 2)}\n`);
    console.log("[update-project-stars] content/projects.json updated");
  } else {
    console.log("[update-project-stars] No GitHub repositories found; no changes written.");
  }
}

main().catch((error) => {
  console.error("[update-project-stars] Unexpected failure:", error);
  process.exit(1);
});
