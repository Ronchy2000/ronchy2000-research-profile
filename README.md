## Ronchy2000 Research Profile

Modern academic homepage for **Rongqi Lu** built with Next.js and Tailwind CSS. The site highlights research interests, publications, projects, and honors, and is ready to deploy on Vercel.

### ✨ Highlights
- Next.js 14 App Router with Tailwind CSS for a fast, responsive layout
- Dark/light mode via `next-themes`
- Content-driven sections fed from `data/site.ts`
- Ready placeholders for a profile photo and downloadable CV
- Modular components for research, publications, projects, and experience

### 🛠️ Getting Started
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
The site runs at `http://localhost:3000`. Edit files in the `app/`, `components/`, and `data/` directories; hot reload updates the preview instantly.

### 🧱 Content Structure
All profile data lives in `data/site.ts`. Update the exported objects/arrays to refresh the site:

| Section | Data source | Component |
| --- | --- | --- |
| Hero / About | `siteConfig` | `components/hero.tsx` |
| Education | `education` | `components/timeline.tsx` |
| Research Projects | `researchProjects` | `components/project-grid.tsx` |
| Publications & Patents | `publications`, `patents` | `components/publication-list.tsx` |
| Open-source Projects | `openSourceProjects` | `components/project-grid.tsx` |
| Internships | `internships` | `components/timeline.tsx` |
| Honors & Skills | `honors`, `skills` | `components/honors-list.tsx`, `components/skill-cards.tsx` |

Each item is strongly typed to help spot formatting issues early.

### 📂 Assets
- Place a square profile image at `public/images/profile.jpg`. Recommended size: 600×600px.
- Drop a PDF CV at `public/files/cv.pdf`. The "Download CV" button links to this path.

### 🚀 Deploying to Vercel
1. Push the repository to GitHub.
2. Create a new project on [vercel.com](https://vercel.com) and import the repo.
3. Use the default Next.js build command (`npm run build`) and output directory (`.next`).
4. Set up a custom domain if desired, then trigger a deploy.

Vercel automatically enables preview deployments on each pull request and production deploys from the default branch.

### 🔧 Customisation Tips
- Update navigation anchors via `siteConfig.nav`.
- Adjust theme colors and fonts in `tailwind.config.ts`.
- Add new sections by creating a component in `components/` and binding it to new data exported from `data/site.ts`.

### 🧪 Recommended Next Steps
- Run `npm run lint` to verify code style before committing.
- Add integration with analytics (e.g., Umami, Plausible) if you need traffic insights.

Enjoy your new academic homepage! Dark mode friendly, content-driven, and easy to keep current.
