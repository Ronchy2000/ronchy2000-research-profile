# Content Management Guide

This site is intentionally content-driven: most routine updates are done in `content/` (JSON + Markdown/MDX) without touching TS/TSX.

Each `content/*.json` file contains a `_meta` section describing the current schema. Prefer following `_meta` over old examples you might find online.

## Quick Edit Map

- Profile: `content/profile.json`
- Page copy (titles/buttons/labels): `content/pages/*.json`
- Research: `content/research.json`
- Publications & patents: `content/publications.json`
- Projects: `content/projects.json`
- Education/industry timeline: `content/timeline.json`
- Awards: `content/awards.json`
- Homepage recent updates: `content/updates.json` (typically automated)
- Blog posts: `content/blog/{en,zh}/*.{md,mdx}`

## Profile (`content/profile.json`)

File shape:

```json
{
  "en": { "...": "..." },
  "zh": { "...": "..." }
}
```

Common fields (per locale):

- `name`: Primary display name.
- `nativeName`: Optional secondary name (e.g. Chinese name on English page).
- `aka`: Optional preferred name. Currently rendered as `Call me {aka}!` under the avatar on English pages only.
- `title`, `affiliation`, `location`: Short strings used in the sidebar and pages.
- `keywords`: Array of short research keywords.
- `social`: Array of `{ label, href }` links.
- `avatar`: Optional path under `public/` (e.g. `/images/profile.jpeg`).
- `cvLink`: Relative URL to a PDF under `public/` (e.g. `/files/Ronchy_CV.pdf`).

Where it appears:

- Desktop sidebar profile card
- Header brand text
- Home hero header line

## Page Copy (`content/pages/*.json`)

These files control per-page copy such as headings, descriptions, button labels, and section titles.

If you only want to adjust wording, start here instead of editing TSX.

## Projects (`content/projects.json`)

Projects are organized as `groups`, each with `title`, `kind`, and `items`.

A project item typically contains:

- `name`, `summary`, `period`, `role`
- `tags`: Array of short labels
- `links`: Array of `{ label, href }`
- `metrics`: Optional stats (e.g. `stars`)

### GitHub Stars Automation

`scripts/update-project-stars.mjs` scans each project item for a GitHub link and writes `metrics.stars`.

The scheduled workflow can run this daily:

- Workflow file: `.github/workflows/update-content.yml`
- Schedule: `30 23 * * *` (23:30 UTC)
- Required secret: `GH_PAT` (used for checkout, GitHub API calls, and pushing updates)

## Publications (`content/publications.json`)

Publications live in `entries`.

Key fields:

- `id`: Short identifier (e.g. `C.1`)
- `type`: One of `C|J|P|S` (Conference/Journal/Patent/In Submission)
- `title`, `authors`, `venue`, `year`
- Optional: `tags`, `links`, `notes`

## Research (`content/research.json`)

- `interests`: Cards on the Research page (`title`, `description`).
- `experiences`: A timeline-like list of research experiences (`title`, `period`, `role`, optional `advisor`/`funding`, `summary`, `bullets`, optional `tags`).

## Timeline (`content/timeline.json`)

Used for Experience/CV pages.

- `education`: Array of timeline entries
- `experience`: Array of timeline entries

Each entry has:

- `title`, `period`, optional `location`
- `details`: Bullet strings

## Awards (`content/awards.json`)

Awards live in `awards`.

Each item has:

- `title`, `issuer`, `year`
- Optional: `notes`

## Recent Updates (`content/updates.json`)

This feed is designed to be automated.

- `scripts/update-recent-updates.mjs` overwrites `en.updates` and `zh.updates` with recent commits.
- If you want manual curation, disable the workflow or adjust the script to merge your own entries.

## Blog Posts (`content/blog/{en,zh}`)

File-driven blog:

- English: `content/blog/en/*.md` or `content/blog/en/*.mdx`
- Chinese: `content/blog/zh/*.md` or `content/blog/zh/*.mdx`

The filename becomes the slug.

Example: `content/blog/en/my-first-post.mdx` renders at `/en/blog/my-first-post` (and Chinese posts under `/zh/blog/...`).

### Recommended Frontmatter

```yaml
---
title: "My First Post"
date: "2026-02-15"
summary: "One-line summary shown in the blog list."
tags: ["Notes"]
type: "note" # or "research"
draft: false
---
```

### Math (KaTeX)

Math is supported via KaTeX. Use `$...$` or `$$...$$`:

- Inline: `$E=mc^2$`
- Block:

```md
$$
\nabla \cdot \mathbf{E} = \rho / \varepsilon_0
$$
```

Tip: wrap LaTeX in `$...$` / `$$...$$` when writing MDX.

### Create a New Post

```bash
npm run new:post -- --locale en --slug my-first-post --title "My First Post"
```

## Release Checklist

Before deploying:

- `npm run lint`
- `npm run build`

Last updated: 2026-02-15
