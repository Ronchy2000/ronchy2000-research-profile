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

### Routing (i18n)
The site uses locale-prefixed routes for best performance and caching:
- English: `/en/*`
- Chinese: `/zh/*`

Requests to `/` (and legacy paths like `/research`) are redirected to `/{locale}`. In middleware-capable builds this is handled by `proxy.ts`; in static-export builds it is handled by pages under `app/(redirects)` (client-side redirect).

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

### SEO / Multi-domain Deployment Contract
- **Google canonical domain**: `https://ronchylu.com`
- **China-facing mirror**: `https://ronchy2000.top`
- **Other duplicate deployments** (for example `cv.ronchy2000.top`): keep them reachable, but do not let them compete for indexing

The project now uses two SEO env vars:

| Variable | Purpose | Default |
| --- | --- | --- |
| `SITE_CANONICAL_ORIGIN` | Canonical origin used by canonical tags, sitemap, and `hreflang` | `https://ronchylu.com` |
| `SITE_INDEXABLE` | Whether the current deployment should be indexable; `0` / `false` / `no` / `off` emits `noindex,follow` | `1` |

Recommended per platform:
- **Cloudflare Pages (`ronchylu.com`)**: default values are already correct; if you prefer explicit config, set `SITE_CANONICAL_ORIGIN=https://ronchylu.com` and `SITE_INDEXABLE=1`
- **EdgeOne Pages (`ronchy2000.top`)**: `edgeone.json` is pinned to mirror mode and builds with `SITE_CANONICAL_ORIGIN=https://ronchylu.com` plus `SITE_INDEXABLE=0`
- **Vercel mirror (`cv.ronchy2000.top`)**: add `SITE_INDEXABLE=0` in Project Settings → Environment Variables; keep `SITE_CANONICAL_ORIGIN=https://ronchylu.com`

This yields:
- `.com` emits the canonical, `hreflang`, `robots.txt`, and `sitemap.xml` signals as the single Google-facing site
- `.top` / `cv` remain accessible, but emit `noindex,follow` while pointing canonical back to `.com`
- `robots.txt` always allows crawling; mirror deployments exit indexing via page-level `noindex`, not via `Disallow`

### Contact Email Anti-scraping (Zero Third-party)
> The contact email is decoded locally in the browser only after user interaction (no third-party form service).

1. Base64-encode your public email: `echo -n "hi@example.com" | base64`
2. Set env vars (see `.env.example`):
    - `NEXT_PUBLIC_CONTACT_EMAIL_B64`
    - (Optional) `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT`
3. The contact page decodes and shows the email only after clicking “Reveal email”, and opens `mailto:` locally.

<div align="center">
  <sub>Thanks for visiting this project</sub><br />
  <a href="https://hits.sh/github.com/Ronchy2000/ronchy2000-research-profile/">
    <img alt="Visits" src="https://hits.sh/github.com/Ronchy2000/ronchy2000-research-profile.svg?style=flat-square&label=visits&color=0A7EA4" />
  </a>
</div>
