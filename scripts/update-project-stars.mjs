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

export function extractRepo(link) {
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

export async function fetchStarCount(repo) {
  const response = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status} ${response.statusText} for ${repo}`);
  }
  const data = await response.json();
  return data.stargazers_count ?? 0;
}

export async function updateProjectStars({
  sourcePath = projectsPath,
  fetchStarCountForRepo = fetchStarCount
} = {}) {
  const projectsContent = JSON.parse(readFileSync(sourcePath, "utf8"));
  const requests = new Map();
  const discoveredRepos = new Set();
  const successfulRepos = new Set();
  const failedRepos = new Set();
  let hasChanges = false;
  let updatedItems = 0;

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
        discoveredRepos.add(repo);

        try {
          if (!requests.has(repo)) {
            requests.set(repo, Promise.resolve(fetchStarCountForRepo(repo)));
          }

          const stars = await requests.get(repo);
          successfulRepos.add(repo);

          if (item.metrics?.stars !== stars) {
            item.metrics = { ...(item.metrics ?? {}), stars };
            hasChanges = true;
            updatedItems += 1;
          }
        } catch (error) {
          if (!failedRepos.has(repo)) {
            failedRepos.add(repo);
            process.stderr.write(
              `[update-project-stars] Failed to update ${repo}: ${error instanceof Error ? error.message : String(error)}\n`
            );
          }
        }
      }
    }
  }

  if (discoveredRepos.size > 0 && successfulRepos.size === 0) {
    throw new Error(`Unable to refresh any of the ${discoveredRepos.size} GitHub repositories`);
  }

  if (hasChanges) {
    writeFileSync(sourcePath, `${JSON.stringify(projectsContent, null, 2)}\n`);
  }

  return {
    repositories: discoveredRepos.size,
    successful: successfulRepos.size,
    failed: failedRepos.size,
    updatedItems
  };
}

if (process.argv[1] === __filename) {
  updateProjectStars().catch((error) => {
    process.stderr.write(
      `[update-project-stars] Unexpected failure: ${error instanceof Error ? error.message : String(error)}\n`
    );
    process.exit(1);
  });
}
