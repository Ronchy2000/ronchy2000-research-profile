## Ronchy2000 研究主页
[🇺🇸 English](./README_en.md) | 🇨🇳 中文文档

如果希望用这个模板，可以直接：<https://github.com/Ronchy2000/Academic-Homepage-Template> 使用此模板即可。

这是 **Rongqi Lu** 的现代学术主页，基于 Next.js 16（App Router）+ Tailwind CSS 构建。
日常更新内容（个人信息、论文、项目、博客）主要都在 `content/` 下，通常不需要修改 TS/TSX 代码。

### 特性亮点
- Next.js 16 (Turbopack) + React 19 + Tailwind CSS
- 内容驱动：结构化数据在 `content/*.json`，页面文案在 `content/pages/*.json`，博客在 `content/blog/{en,zh}/*.{md,mdx}`
- 支持明暗主题、独立页面导航、连续章节阅读、响应式目录与 PDF 简历查看
- 博客支持 Markdown/MDX + 数学公式渲染（KaTeX）
- 可选 GitHub Actions 自动化：项目动态与 GitHub Stars 同步

### 快速开始
```bash
npm install
npm run dev
```
本地开发地址：`http://localhost:3000`

常用命令：
```bash
npm run lint
npm run build
npm run test:stars
npm run start
```

### 路由（i18n）
站点使用语言前缀路由，以获得更好的性能和缓存效果：
- 英文：`/en/*`
- 中文：`/zh/*`

访问 `/`（以及 `/research` 这类旧路径）会重定向到 `/{locale}`。在支持中间件的构建中由 `proxy.ts` 处理；静态导出构建中由 `app/(redirects)` 下的页面处理（客户端跳转）。

### 页面分工

顶部保留四个独立页面：主页、研究、项目、博客。联系页由全站页脚进入。

- **主页**：个人简介、研究兴趣、完整论文与专利、四项精选科研项目，再展示教育与行业经历、荣誉、技术背景。
- **研究**：详细科研经历；方法与贡献按需展开，方向与成果链接回首页。
- **项目**：每组按 GitHub Stars 优先显示 4 项，可展开全部；年份与标签筛选始终覆盖完整数据。
- **博客 / 联系**：保持独立页面，保留 MDX、邮件显示与复制等原有功能。

主页、研究和项目采用有终点的纵向章节布局。内容区域居中，上限 1120px，窄屏时自适应收缩；大屏（≥1280px）显示右侧目录，平板与手机显示顶部横向目录，均支持顶部/底部跳转。旧的 `/about`、`/cv`、`/experience` 地址进入主页对应章节，`/publications` 进入首页的成果章节，避免重复维护。首页项目仅从 `academic` 科研分组中按 Stars 选出前四项，LaTeX 等学术工具保留在项目页，与首页共享数据和星数同步。

### 内容结构

| 文件/目录 | 主要修改内容 |
| --- | --- |
| `content/profile.json` | 姓名/标题/单位/地点/关键词/社交链接，以及 `avatar` 与 `cvLink`。`en.aka` 会在英文页姓名下显示昵称。 |
| `content/pages/*.json` | 页面文案（Home/Research/Projects/Blog/Contact，以及论文目录文案）。 |
| `content/research.json` | 研究兴趣与研究经历时间线。 |
| `content/publications.json` | 论文与专利（支持按类型/年份筛选）。 |
| `content/projects.json` | 项目分组与条目，GitHub Stars 存在 `metrics.stars`。 |
| `content/timeline.json` | 主页的教育与行业经历时间线。 |
| `content/awards.json` | 主页的荣誉与奖项。 |
| `content/updates.json` | Projects 页的近期项目动态（通常由自动化覆盖）。 |
| `content/blog/{en,zh}/*.{md,mdx}` | 博客文章（文件名即 slug）。 |

读取逻辑在 `lib/content.ts`（JSON）与 `lib/blog.ts`（博客解析）。

### 博客写作
- 在 `content/blog/en/` 或 `content/blog/zh/` 下新增文章（`.md` 或 `.mdx`）。
- 推荐 frontmatter：
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
- 数学公式（KaTeX）示例：
   - 行内：`$E=mc^2$`
   - 块级：
      ```md
      $$
      \\nabla \\cdot \\mathbf{E} = \\rho / \\varepsilon_0
      $$
      ```
   在 MDX 中请使用 `$...$` / `$$...$$` 包裹 LaTeX。

可选辅助命令：
```bash
npm run new:post -- --locale en --slug my-first-post --title "My First Post"
```

### 资源文件
默认路径在 `content/profile.json` 中配置：
- 头像：`public/images/profile-2026.jpeg`（`avatar`）
- 简历 PDF：`public/files/Ronchy_CV.pdf`（`cvLink`）

### GitHub Actions（可选）
定时工作流 `.github/workflows/update-content.yml` 会刷新：
- 从近期提交生成 `content/updates.json`
- 同步 `content/projects.json` 中的 GitHub `metrics.stars`

该流程需要仓库密钥 `GH_PAT`，用于调用 GitHub API 并推送更新。
同步脚本会按仓库去重请求并同时更新中英文项目；可用 `npm run test:stars` 做离线回归。

### 部署到 Vercel
1. 将仓库推送到 GitHub。
2. 在 [vercel.com](https://vercel.com) 新建项目并导入仓库。
3. 使用默认 Next.js 构建命令（`npm run build`）和输出目录（`.next`）。
4. 如需自定义域名，配置后重新触发部署。

### 部署到 GitHub Pages

仓库已包含 `.github/workflows/deploy-pages.yml`，会将 Next.js 静态导出自动发布到 GitHub Pages。首次使用时：

1. 打开仓库的 **Settings → Pages**。
2. 将 **Source** 改为 **GitHub Actions**（不要继续选择 “Deploy from a branch”）。
3. 推送到 `master` 或 `feat/information-architecture-rebuild`，或在 **Actions → Deploy site to GitHub Pages → Run workflow** 手动运行。

构建完成后，项目站点地址为：
`https://ronchy2000.github.io/ronchy2000-research-profile/`

GitHub Pages 是项目子路径部署，工作流会自动配置 `/ronchy2000-research-profile` 的资源路径；因此不要直接把仓库根目录作为 Pages 的分支源，否则 GitHub 会把 `README.md` 显示成首页。

### SEO / 多域名部署约定
- **Google 主收录域名**：`https://ronchylu.com`
- **国内镜像域名**：`https://ronchy2000.top`
- **其他重复部署**（例如 `cv.ronchy2000.top`）：保留访问，但不要参与收录竞争

项目内置两类 SEO 环境变量：

| 变量 | 作用 | 默认值 |
| --- | --- | --- |
| `SITE_CANONICAL_ORIGIN` | canonical / sitemap / hreflang 的主域名 | `https://ronchylu.com` |
| `SITE_INDEXABLE` | 是否允许当前部署参与收录；设为 `0`/`false`/`no`/`off` 会输出 `noindex,follow` | `1` |

推荐按平台这样配置：
- **Cloudflare Pages (`ronchylu.com`)**：可以直接使用默认值；如需显式设置，可填 `SITE_CANONICAL_ORIGIN=https://ronchylu.com`、`SITE_INDEXABLE=1`
- **EdgeOne Pages (`ronchy2000.top`)**：仓库内 `edgeone.json` 已固定为镜像模式，构建时会使用 `SITE_CANONICAL_ORIGIN=https://ronchylu.com`、`SITE_INDEXABLE=0`
- **Vercel 镜像 (`cv.ronchy2000.top`)**：在 Project Settings → Environment Variables 中添加 `SITE_INDEXABLE=0`；`SITE_CANONICAL_ORIGIN` 保持 `https://ronchylu.com`

这套约定的结果是：
- `.com` 版本输出 canonical、`hreflang`、`robots.txt`、`sitemap.xml`，作为唯一主收录站点
- `.top` / `cv` 镜像继续可访问，但页面会输出 `noindex,follow`，同时 canonical 仍指向 `.com`
- `robots.txt` 始终允许抓取；镜像站通过页面级 `noindex` 退出收录，而不是在 `robots.txt` 里屏蔽抓取

### 联系邮箱防抓取（零第三方）
> 联系邮箱只会在用户交互后于浏览器本地解码，不依赖第三方表单服务。

1. 将公开邮箱做 Base64 编码：`echo -n "hi@example.com" | base64`
2. 设置环境变量（见 `.env.example`）：
    - `NEXT_PUBLIC_CONTACT_EMAIL_B64`
    - `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT`（可选）
3. 联系页在点击“Reveal email”后才会解码并显示邮箱，并在本地打开 `mailto:`。

<div align="center">
  <sub>感谢关注这个项目</sub><br />
  <a href="https://hits.sh/github.com/Ronchy2000/ronchy2000-research-profile/">
    <img alt="Visits" src="https://hits.sh/github.com/Ronchy2000/ronchy2000-research-profile.svg?style=flat-square&label=visits&color=0A7EA4" />
  </a>
</div>
