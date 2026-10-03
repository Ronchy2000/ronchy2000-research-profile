import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { selectHomeProjects } from "../lib/project-utils.ts";

const project = (name, stars, tags = []) => ({ name, period: "2026", tags, metrics: { stars } });

test("home selects four research projects by stars without mutating the catalogue", () => {
  const groups = [
    { kind: "academic", items: [project("A", 20), project("B", 300), project("C", 10), project("D", 15)] },
    { kind: "open-source", items: [project("Game tool", 1000), project("Thesis tool", 50, ["Academic"]), project("Paper tool", 30, ["学术"])] }
  ];
  const before = structuredClone(groups);
  assert.deepEqual(selectHomeProjects(groups).map(({ name }) => name), ["B", "Thesis tool", "Paper tool", "A"]);
  assert.deepEqual(groups, before);
});

test("both home locales select the same repositories and current star snapshots", () => {
  const content = JSON.parse(readFileSync(new URL("../content/projects.json", import.meta.url), "utf8"));
  const selected = ["en", "zh"].map((locale) => selectHomeProjects(content[locale].groups));
  for (const projects of selected) {
    assert.equal(projects.length, 4);
    assert.ok(projects.every((entry) => entry.derived.hasStars));
    assert.ok(projects.every((entry, index) => index === 0 || projects[index - 1].derived.starCount >= entry.derived.starCount));
  }
  const repositories = (projects) => projects.map((entry) => ({
    url: entry.links.find((link) => link.href.startsWith("https://github.com/")).href,
    stars: entry.metrics.stars
  }));
  assert.deepEqual(repositories(selected[0]), repositories(selected[1]));
});
