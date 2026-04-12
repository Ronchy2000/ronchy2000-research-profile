## Ronchy2000 研究主页
[🇺🇸 English](./README_en.md) | 🇨🇳 中文文档

如果希望用这个模板，可以直接：<https://github.com/Ronchy2000/Academic-Homepage-Template> 使用此模板即可。

这是 **Rongqi Lu** 的现代学术主页，基于 Next.js 16（App Router）+ Tailwind CSS 构建。
日常更新内容（个人信息、论文、项目、博客）主要都在 `content/` 下，通常不需要修改 TS/TSX 代码。

### 特性亮点
- Next.js 16 (Turbopack) + React 19 + Tailwind CSS
- 内容驱动：结构化数据在 `content/*.json`，页面文案在 `content/pages/*.json`，博客在 `content/blog/{en,zh}/*.{md,mdx}`
- 支持明暗主题、响应式导航、打印友好的简历页面
- 博客支持 Markdown/MDX + 数学公式渲染（KaTeX）
- 可选 GitHub Actions 自动化：主页更新与 GitHub Star 同步

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
npm run start
```

### 路由（i18n）
站点使用语言前缀路由，以获得更好的性能和缓存效果：
- 英文：`/en/*`
- 中文：`/zh/*`

访问 `/`（以及 `/research` 这类旧路径）会重定向到 `/{locale}`。在支持中间件的构建中由 `proxy.ts` 处理；静态导出构建中由 `app/(redirects)` 下的页面处理（客户端跳转）。

### 内容结构

| 文件/目录 | 主要修改内容 |
| --- | --- |
| `content/profile.json` | 姓名/标题/单位/地点/关键词/社交链接，以及 `avatar` 与 `cvLink`。`en.aka` 会在英文页头像下显示 `Call me ...!`（桌面端侧栏）。 |
| `content/pages/*.json` | 页面文案（Home/Research/Publications/Projects/Experience/CV/Blog/Contact）。 |
| `content/research.json` | 研究兴趣与研究经历时间线。 |
| `content/publications.json` | 论文与专利（支持按类型/年份筛选）。 |
| `content/projects.json` | 项目分组与条目，GitHub Stars 存在 `metrics.stars`。 |
| `content/timeline.json` | 教育与工作时间线（Experience/CV）。 |
| `content/awards.json` | 荣誉与奖项（Home/CV）。 |
| `content/updates.json` | 首页“Recent Updates”动态（通常由自动化覆盖）。 |
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
- 头像：`public/images/profile.jpeg`（`avatar`）
- 简历 PDF：`public/files/Ronchy_CV.pdf`（`cvLink`）

### GitHub Actions（可选）
定时工作流 `.github/workflows/update-content.yml` 会刷新：
- 从近期提交生成 `content/updates.json`
- 同步 `content/projects.json` 中的 GitHub `metrics.stars`

该流程需要仓库密钥 `GH_PAT`，用于调用 GitHub API 并推送更新。

### 部署到 Vercel
1. 将仓库推送到 GitHub。
2. 在 [vercel.com](https://vercel.com) 新建项目并导入仓库。
3. 使用默认 Next.js 构建命令（`npm run build`）和输出目录（`.next`）。
4. 如需自定义域名，配置后重新触发部署。

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
