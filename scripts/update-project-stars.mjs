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

  // Handle both flat structure (groups) and locale structure (en.groups, zh.groups)
  const locales = projectsContent.en ? ["en", "zh"] : [null];
  
  for (const locale of locales) {
    const groups = locale ? projectsContent[locale]?.groups : projectsContent.groups;
    if (!groups) continue;

    for (const group of groups) {
      for (const item of group.items ?? []) {
        const githubLink = item.links?.find((link) => link.href && extractRepo(link.href));
        const repo = githubLink ? extractRepo(githubLink.href) : null;
        if (!repo) continue;

        try {
          const stars = await fetchStarCount(repo);
          item.metrics = { ...(item.metrics ?? {}), stars };
          hasChanges = true;
        } catch (error) {
          process.stderr.write(
            `[update-project-stars] Failed to update ${repo}: ${error instanceof Error ? error.message : String(error)}\n`
          );
        }
      }
    }
  }

  if (hasChanges) {
    writeFileSync(projectsPath, `${JSON.stringify(projectsContent, null, 2)}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(
    `[update-project-stars] Unexpected failure: ${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exit(1);
});
