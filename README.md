## Ronchy2000 Research Profile

Modern academic homepage for **Rongqi Lu** built with Next.js 16 (App Router) + Tailwind CSS.
Most routine updates (profile, publications, projects, blog posts) live in `content/` so you rarely touch TS/TSX.

### Highlights
- Next.js 16 (Turbopack) + React 19 + Tailwind CSS
- Content-driven: structured data in `content/*.json`, page copy in `content/pages/*.json`, and posts in `content/blog/{en,zh}/*.{md,mdx}`
- Light/dark theme, responsive navigation, print-friendly CV
- Blog supports Markdown/MDX + math rendering (KaTeX)
- Optional GitHub Actions automation for homepage updates and GitHub star sync

### Getting Started
```bash
npm install
npm run dev
```
Local dev server: `http://localhost:3000`

Useful commands:
```bash
npm run lint
npm run build
npm run start
```

### Content Structure

| File/Folder | What to edit |
| --- | --- |
| `content/profile.json` | Name/title/affiliation/location/keywords/social links + `avatar` + `cvLink`. `en.aka` shows `Call me ...!` under the avatar on English pages (desktop sidebar). |
| `content/pages/*.json` | Page copy (Home/Research/Publications/Projects/Experience/CV/Blog/Contact). |
| `content/research.json` | Research interests + research experience timeline. |
| `content/publications.json` | Publications & patents (supports type/year filters). |
| `content/projects.json` | Project groups + items. GitHub stars are stored in `metrics.stars`. |
| `content/timeline.json` | Education + industry timeline (Experience/CV). |
| `content/awards.json` | Honors & awards (Home/CV). |
| `content/updates.json` | Homepage "Recent Updates" feed (typically overwritten by automation). |
| `content/blog/{en,zh}/*.{md,mdx}` | Blog posts (filename = slug). |

Accessors live in `lib/content.ts` (JSON) and `lib/blog.ts` (blog parsing).

### Writing Blog Posts
- Add a post under `content/blog/en/` or `content/blog/zh/` (`.md` or `.mdx`).
- Recommended frontmatter:
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
- Math (KaTeX) examples:
  - Inline: `$E=mc^2$`
  - Block:
    ```md
    $$
    \\nabla \\cdot \\mathbf{E} = \\rho / \\varepsilon_0
    $$
    ```
  Wrap LaTeX in `$...$` / `$$...$$` when writing MDX.

Optional helper:
```bash
npm run new:post -- --locale en --slug my-first-post --title "My First Post"
```

### Assets
Defaults are configured via `content/profile.json`:
- Avatar: `public/images/profile.jpeg` (`avatar`)
- CV PDF: `public/files/Ronchy_CV.pdf` (`cvLink`)

### GitHub Actions (Optional)
The scheduled workflow `.github/workflows/update-content.yml` refreshes:
- `content/updates.json` from recent commits
- `content/projects.json` GitHub `metrics.stars`

It expects a repository secret `GH_PAT` to call GitHub APIs and push updates.

### Deploying to Vercel
1. Push the repository to GitHub.
2. Create a new project on [vercel.com](https://vercel.com) and import the repo.
3. Use the default Next.js build command (`npm run build`) and output directory (`.next`).
4. Set up a custom domain if desired, then trigger a deploy.

### Contact Email Anti-scraping (Zero Third-party)
> The contact email is decoded locally in the browser only after user interaction (no third-party form service).

1. Base64-encode your public email: `echo -n "hi@example.com" | base64`
2. Set env vars (see `.env.example`):
   - `NEXT_PUBLIC_CONTACT_EMAIL_B64`
   - (Optional) `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT`
3. The contact page decodes and shows the email only after clicking “Reveal email”, and opens `mailto:` locally.
