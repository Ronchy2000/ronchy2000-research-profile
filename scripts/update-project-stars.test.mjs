import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { updateProjectStars } from "./update-project-stars.mjs";

function buildFixture(stars = 1) {
  const project = {
    name: "Example",
    links: [{ label: "GitHub", href: "https://github.com/example/project" }],
    metrics: { stars }
  };

  return {
    en: { groups: [{ items: [structuredClone(project)] }] },
    zh: { groups: [{ items: [structuredClone(project)] }] }
  };
}

async function withFixture(run) {
  const fixtureDir = await mkdtemp(join(tmpdir(), "project-stars-test-"));
  const sourcePath = join(fixtureDir, "projects.json");

  try {
    await writeFile(sourcePath, `${JSON.stringify(buildFixture(), null, 2)}\n`);
    await run(sourcePath);
  } finally {
    await rm(fixtureDir, { recursive: true, force: true });
  }
}

test("fetches a shared repository once and updates both locales", async () => {
  await withFixture(async (sourcePath) => {
    let calls = 0;
    const result = await updateProjectStars({
      sourcePath,
      fetchStarCountForRepo: async () => {
        calls += 1;
        return 42;
      }
    });

    const updated = JSON.parse(await readFile(sourcePath, "utf8"));

    assert.equal(calls, 1);
    assert.equal(updated.en.groups[0].items[0].metrics.stars, 42);
    assert.equal(updated.zh.groups[0].items[0].metrics.stars, 42);
    assert.deepEqual(result, {
      repositories: 1,
      successful: 1,
      failed: 0,
      updatedItems: 2
    });
  });
});

test("keeps existing stars and fails clearly when every request fails", async () => {
  await withFixture(async (sourcePath) => {
    const before = await readFile(sourcePath, "utf8");

    await assert.rejects(
      updateProjectStars({
        sourcePath,
        fetchStarCountForRepo: async () => {
          throw new Error("rate limited");
        }
      }),
      /Unable to refresh any/
    );

    assert.equal(await readFile(sourcePath, "utf8"), before);
  });
});
