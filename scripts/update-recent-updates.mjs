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

const defaultIgnoredAuthors = [
  "github-actions[bot]",
  "dependabot[bot]",
  "router auto backup"
];

const defaultIgnoredEmails = [
  "41898282+github-actions[bot]@users.noreply.github.com",
  "router@local"
];

const defaultIgnoredMessageKeywords = [
  "auto update",
  "auto backup on",
  "update latest activities",
  "update github project stars",
  "update github stars"
];

function readListFromEnv(key) {
  return (process.env[key] || "")
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

const ignoredAuthors = new Set(
  [...defaultIgnoredAuthors, ...readListFromEnv("IGNORED_COMMIT_AUTHORS")]
    .map((value) => value.toLowerCase())
);

const ignoredEmails = new Set(
  [...defaultIgnoredEmails, ...readListFromEnv("IGNORED_COMMIT_EMAILS")]
    .map((value) => value.toLowerCase())
);

const ignoredMessageKeywords = [
  ...defaultIgnoredMessageKeywords,
  ...readListFromEnv("IGNORED_COMMIT_MESSAGE_KEYWORDS")
].map((value) => value.toLowerCase());

function shouldIgnoreCommit(commit) {
  const authorName = commit.commit?.author?.name ?? "";
  const committerName = commit.commit?.committer?.name ?? "";
  const authorLogin = commit.author?.login ?? "";
  const committerLogin = commit.committer?.login ?? "";
  const authorEmail = commit.commit?.author?.email ?? "";
  const committerEmail = commit.commit?.committer?.email ?? "";
  const message = commit.commit?.message ?? "";

  const normalizedNames = [authorName, committerName, authorLogin, committerLogin]
    .map((value) => value.toLowerCase())
    .filter(Boolean);

  if (normalizedNames.some((name) => ignoredAuthors.has(name))) {
    return true;
  }

  const normalizedEmails = [authorEmail, committerEmail]
    .map((value) => value.toLowerCase())
    .filter(Boolean);

  if (normalizedEmails.some((email) => ignoredEmails.has(email))) {
    return true;
  }

  const normalizedMessage = message.toLowerCase();

  if (ignoredMessageKeywords.some((keyword) => normalizedMessage.includes(keyword))) {
    return true;
  }

  return false;
}

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

  const perPage = Math.min(Math.max(limit * 4, 30), 100);
  const maxPages = 5;
  const collected = [];
  const seen = new Set();

  for (let page = 1; page <= maxPages && collected.length < limit; page += 1) {
    const searchParams = new URLSearchParams({
      per_page: String(perPage),
      page: String(page)
    });

    const response = await fetch(`https://api.github.com/repos/${repository}/commits?${searchParams.toString()}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status} ${response.statusText}`);
    }

    const commits = await response.json();

    if (!Array.isArray(commits) || commits.length === 0) {
      break;
    }

    for (const commit of commits) {
      if (seen.has(commit.sha)) {
        continue;
      }

      seen.add(commit.sha);

      if (shouldIgnoreCommit(commit)) {
        continue;
      }

      collected.push({
        date: commit.commit.author?.date?.slice(0, 10) ?? "",
        type: "Commit",
        title: commit.commit.message.split("\n")[0],
        summary: `Authored by ${commit.commit.author?.name ?? commit.author?.login ?? "unknown"}`,
        link: commit.html_url
      });

      if (collected.length >= limit) {
        break;
      }
    }

    if (commits.length < perPage) {
      break;
    }
  }

  return collected;
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
