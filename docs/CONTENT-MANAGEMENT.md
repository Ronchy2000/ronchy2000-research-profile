# Content Management Guide

This guide explains how to maintain and update the content on your research profile website.

## Overview

All website content is managed through JSON files in the `content/` directory. This allows you to update information without modifying code.

---

## Content Files Reference

### 1. Profile Information (`content/profile.json`)

**Location**: `content/profile.json`

Contains your basic profile information displayed across the site.

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "affiliation": "Your Institution",
  "email": "your.email@example.com",
  "bio": "Brief biography...",
  "location": "City, Country"
}
```

**Where it appears**:
- Side profile card (all pages)
- Footer
- Contact page

---

### 2. Projects (`content/projects.json`)

**Location**: `content/projects.json`

Manages your project portfolio. Supports both open-source and academic projects.

**Structure**:
```json
{
  "openSourceProjects": [
    {
      "name": "Project Name",
      "description": "Short description",
      "technologies": ["Tech1", "Tech2"],
      "githubUrl": "https://github.com/username/repo",
      "stars": 0,  // Auto-updated by GitHub Action
      "featured": true  // Show on homepage
    }
  ],
  "academicProjects": [
    {
      "name": "Research Project",
      "description": "Academic project description",
      "affiliation": "University Name",
      "year": 2024,
      "featured": false
    }
  ]
}
```

**Key fields**:
- `stars`: Set to `0` for GitHub projects - will auto-sync daily at 7:30 AM Beijing time
- `featured`: Set to `true` to display on homepage (max 6 recommended)
- `githubUrl`: Required for star sync to work
- `technologies`: Optional tech stack tags

**Where it appears**:
- Homepage (featured projects only)
- Projects page (all projects)

---

### 3. Publications (`content/publications.json`)

**Location**: `content/publications.json`

Your publication list with filtering support.

**Structure**:
```json
[
  {
    "title": "Paper Title",
    "authors": ["Author 1", "Author 2", "You"],
    "venue": "Conference/Journal Name",
    "year": 2024,
    "type": "conference",  // or "journal", "patent"
    "status": "published",  // or "submitted", "in-review"
    "doi": "10.1234/example",
    "pdfUrl": "/files/paper.pdf",
    "abstract": "Brief abstract..."
  }
]
```

**Valid types**:
- `conference`
- `journal`
- `patent`

**Valid statuses**:
- `published`
- `submitted`
- `in-review`

**Where it appears**:
- Homepage (featured publications)
- Publications page (all, with filtering)

---

### 4. Recent Updates (`content/updates.json`)

**Location**: `content/updates.json`

News and activity feed. **Auto-maintained by GitHub Action** - do not edit manually unless necessary.

**Structure**:
```json
[
  {
    "date": "2025-02-01",
    "title": "Update Title",
    "summary": "Brief description of the update",
    "type": "github",  // or "publication", "award", "talk"
    "link": "https://example.com"
  }
]
```

**Auto-sync behavior**:
- Runs daily at 7:30 AM Beijing time (23:30 UTC)
- Fetches latest 7 updates from your GitHub activity
- Creates smart commit messages:
  - "chore: update GitHub project stars" when stars change
  - "chore: update recent GitHub activities" when new events added

**Manual additions**:
You can manually add important events (publications, awards, talks) by editing this file. The GitHub Action will preserve manual entries.

**Where it appears**:
- Homepage (horizontal scrolling cards, 7 latest)
- Projects page (timeline view, 7 latest)

---

### 5. Timeline (`content/timeline.json`)

**Location**: `content/timeline.json`

Your academic/professional timeline (education, positions, etc.)

**Structure**:
```json
[
  {
    "date": "2020 - Present",
    "title": "Position Title",
    "organization": "Institution Name",
    "description": "Brief description of role/achievements",
    "type": "education"  // or "work", "research"
  }
]
```

**Where it appears**:
- Experience page

---

### 6. Awards & Honors (`content/awards.json`)

**Location**: `content/awards.json`

Scholarships, honors, and recognition.

**Structure**:
```json
[
  {
    "year": 2024,
    "title": "Award Name",
    "organization": "Awarding Organization",
    "description": "Optional description"
  }
]
```

**Sorting**: Awards are automatically sorted by year (newest first).

**Where it appears**:
- Homepage (awards section)
- CV page (honors table)

---

### 7. Research Interests (`content/research.json`)

**Location**: `content/research.json`

Your research areas and ongoing projects.

**Structure**:
```json
{
  "interests": [
    {
      "name": "Research Area",
      "description": "What you're working on in this area",
      "icon": "🤖"  // Optional emoji
    }
  ],
  "collaborations": [
    {
      "title": "Collaboration Name",
      "partner": "Institution/Lab",
      "description": "What the collaboration is about",
      "startDate": "2024-01"
    }
  ]
}
```

**Where it appears**:
- Research page

---

## Maintenance Tips

### Adding New Projects

1. Open `content/projects.json`
2. Add to either `openSourceProjects` or `academicProjects` array
3. For GitHub projects:
   - Set `stars: 0` initially
   - Provide valid `githubUrl`
   - Stars will auto-sync next morning
4. Set `featured: true` to show on homepage
5. Save and commit

### Managing Publications

1. Open `content/publications.json`
2. Add new publication object to array
3. Use consistent author names
4. Provide DOI if available
5. Upload PDF to `public/files/` if sharing

### Updating Your Bio

1. Edit `content/profile.json`
2. Keep bio under 2-3 sentences for best display
3. Changes reflect immediately on all pages

---

## GitHub Action Setup

### Requirements

The automated content sync requires a GitHub Personal Access Token (PAT).

**Steps**:

1. **Create a PAT**:
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
   - Generate new token with `public_repo` scope
   - Copy the token (you won't see it again!)

2. **Add to Repository**:
   - Go to your repository Settings → Secrets and variables → Actions
   - Create new secret named `GH_PAT`
   - Paste your token

3. **Verify Workflow**:
   - Check `.github/workflows/update-content.yml` is present
   - Should have `permissions: contents: write`
   - Schedule: `cron: "30 23 * * *"` (7:30 AM Beijing time)

### Manual Trigger

To manually run the update:
```bash
# Go to GitHub Actions tab in your repository
# Select "Update Content" workflow
# Click "Run workflow"
```

Or use GitHub CLI:
```bash
gh workflow run update-content.yml
```

---

## Print Optimization (CV Page)

When printing your CV from the browser:

1. Use `Ctrl/Cmd + P` to open print dialog
2. Remove headers/footers for cleaner output
3. Adjust margins if needed
4. Save as PDF for sharing

The site automatically hides navigation elements in print view.

---

## Blog Management

### Current Setup

Blog posts are placeholder examples. To implement a real blog:

**Option 1: MDX Files** (Recommended)
1. Place `.mdx` files in `/blog` directory
2. Add frontmatter with title, date, summary, tags
3. Update blog pages to load from file system

**Option 2: CMS Integration**
1. Use a headless CMS (Contentful, Sanity, etc.)
2. Update blog pages to fetch from API
3. Manage content through CMS interface

**Current files**:
- `/blog/sample-post.mdx` - Example MDX post
- `app/(site)/blog/page.tsx` - Blog listing (uses placeholder data)
- `app/(site)/blog/[slug]/page.tsx` - Individual post view (placeholder)

---

## Contact Form

The contact form on `/contact` is currently a visual placeholder. To make it functional:

**Option 1: Email Service** (Easiest)
Use services like:
- [Formspree](https://formspree.io/) - Free tier available
- [Resend](https://resend.com/) - Modern email API
- [SendGrid](https://sendgrid.com/) - Robust solution

**Option 2: Custom API Route**
1. Create `app/api/contact/route.ts`
2. Handle form submission
3. Send email via nodemailer or similar
4. Return success/error response

**Recommendation**: For academic sites, email link is often sufficient. Consider form only if you receive many inquiries.

---

## Troubleshooting

### Stars not updating

**Check**:
1. GitHub Action ran successfully (check Actions tab)
2. `GH_PAT` secret is set correctly
3. Project has valid `githubUrl` in `projects.json`
4. Repository is public (or PAT has private repo access)

**Fix**:
```bash
# Manually verify the API works
curl https://api.github.com/repos/username/repo

# Should return JSON with "stargazers_count" field
```

### Updates not showing

**Check**:
1. File saved correctly (valid JSON syntax)
2. Development server restarted (`npm run dev`)
3. Browser cache cleared (hard refresh: Ctrl/Cmd + Shift + R)

**Fix**:
```bash
# Validate JSON syntax
cat content/updates.json | jq .

# If error, fix JSON syntax
```

### Layout broken after content change

**Likely causes**:
1. Missing required fields in JSON
2. Very long text causing overflow
3. Invalid data types (string vs number)

**Fix**:
1. Check browser console for errors
2. Validate JSON schema matches examples above
3. Shorten text or adjust styling in components

---

## Best Practices

1. **Keep content concise** - Respect your visitors' time
2. **Update regularly** - Fresh content shows you're active
3. **Validate JSON** - Use a linter before committing
4. **Backup first** - Git commit before major changes
5. **Test locally** - Run `npm run dev` to preview changes
6. **Mobile-first** - Check how content looks on small screens
7. **Accessibility** - Use descriptive link text, alt text for images

---

## Questions?

If you need help with content management:

1. Check this guide first
2. Review example entries in existing JSON files
3. Consult Next.js documentation for advanced customization
4. Open a GitHub issue if you discover a bug

Last updated: 2025-02-01
