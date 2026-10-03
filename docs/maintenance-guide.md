# 维护手册（自用）

本项目使用 Next.js 16 + Tailwind CSS。内容由 `content/` 下的中英文 JSON 和 MDX 驱动。

## 页面分工与阅读方式

- **主页**：个人简介、研究兴趣、完整论文与专利、四项精选科研项目，再展示教育/行业经历、荣誉、技能；保留“简历PDF”入口。
- **研究**：详细科研经历，方法与贡献可展开；研究方向和成果链接回首页。
- **项目**：学术与开源项目，保留 Stars、标签/年份筛选、项目链接与自动更新的动态。
- **博客、联系**：各自独立页面，保持原有功能；联系入口只放在全站页脚，不占顶部导航。

主导航只切换独立页面。主页、研究、项目页内的目录才使用锚点，≥1280px 的大屏固定在右侧，平板与手机固定在导航下方；上下箭头分别到顶部与底部。容器宽度随视口伸展，上限 1600px，不会随滚动改变。页面采用有限的连续章节，不做无限加载。

个人履历只在主页维护一次。旧 `/{locale}/about`、`/cv`、`/experience` 分别进入主页的 `#intro`、`#background`、`#experience`；旧 `/publications` 进入首页 `#publications`。跳转页 noindex，正式页面保留 canonical/hreflang。

## 内容维护速查表

| 内容 | 数据文件 | 展示位置 |
| --- | --- | --- |
| 姓名、头像、社交链接、PDF | `content/profile.json` | 主页；姓名用于导航 |
| 简介、章节标签、技能 | `content/pages/home.json` | 主页 |
| 教育、行业经历 | `content/timeline.json` | 主页；详细条目可展开 |
| 荣誉 | `content/awards.json` | 主页完整展示 |
| 研究方向、科研经历 | `content/research.json` | 首页展示方向，研究页展示经历 |
| 论文、专利、录用说明 | `content/publications.json` | 首页完整展示 |
| 项目与 Stars | `content/projects.json` | 首页精选；项目页完整展示 |
| 自动项目动态 | `content/updates.json` | 项目页 |
| 博客 | `content/blog/{en,zh}/*.{md,mdx}` | 博客页 |
| 各页标签文案 | `content/pages/*.json` | 对应页面 |

## 项目与 Stars

每组优先显示 Stars 最高的四项，可展开其余项目。筛选始终针对完整数据；改变筛选会重新收起长列表。项目数据与链接不因折叠而删除。只有带有效链接的项目卡片才有浮动和点击反馈。

首页从 `academic` 分组和带 `Academic` / `学术` 标签的开源工具中按 Stars 取前四项，不会因非科研项目星数更高而将其选入。仍使用同一份项目数据；`npm run test:home` 验证选取规则及中英文一致性。

`scripts/update-project-stars.mjs` 为中英文共用仓库去重请求，并写回两种语言的 `metrics.stars`。所有请求失败时保留原数据并返回错误。页面使用最近一次同步值，不在访客浏览器里请求 GitHub API。

`.github/workflows/update-content.yml` 保留每日 23:30 UTC 的同步计划，需要 `GH_PAT`。GitHub 仅自动调度默认分支中的定时工作流；要单独刷新 feat，可在 Actions 中手动选择 feat 分支运行，也可继续从 master 合并最新内容。不要把 feat 布局改动推到 master。

## 组件与排版

- `components/site-shell.tsx`：固定内容宽度，无自动伸缩侧栏。
- `components/site-header.tsx`：五页导航、中英文与主题切换。
- `components/page-outline.tsx`：章节定位、滚动高亮与上下跳转；监听尺寸变化以适应筛选和展开。
- `components/section.tsx`：简洁的标题与分隔线；页面标题使用 `headingLevel="h1"`。
- `components/timeline.tsx`：紧凑履历与展开详情。
- `app/globals.css`：响应式阅读布局、锚点偏移、减少动态效果与打印样式。

## Contact 邮箱防爬（零第三方）
- 页面仅在客户端本地解码邮箱地址，通过 `mailto:` 打开访客的系统邮件客户端，没有任何服务器或第三方转发。
- **环境变量**（见根目录 `.env.example`）：
  1. `NEXT_PUBLIC_CONTACT_EMAIL_B64`：公开邮箱的 Base64。示例：`echo -n "hi@example.com" | base64`。
  2. `NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT`（可选）：自定义邮件主题前缀（默认为中英双语文案）。
- **部署步骤**：在 Vercel 或国内托管平台的环境变量面板填入上述键值即可；静态打包内容仍不包含明文邮箱。
- **使用说明**：访客在联系页点击“显示邮箱”后才会看到真实地址，并可一键复制或通过 `mailto:` 生成邮件草稿。想更换邮箱时，更新环境变量并重新部署即可，旧页面会继续显示模糊文本。

## 样式与设计基准
- 背景、打印、焦点样式：`app/globals.css`。
- 设计 Token：间距以 8/12 的倍数为主，圆角多使用 `rounded-2xl/3xl`。
- 暗色/浅色主题通过 `theme-toggle.tsx` 切换。
- 已移除 sitemap/rss 链接；Footer 仅保留版权与更新时间。

## 自动化与部署

### SEO 主站 / 镜像约定（当前正式方案）
- **Google 主收录域名**：`https://ronchylu.com`
- **国内访问镜像**：`https://ronchy2000.top`
- **其他重复部署**（例如 `cv.ronchy2000.top`）：可访问，但不参与收录竞争
- **原则**：
  - canonical / sitemap / hreflang 一律以 `ronchylu.com` 为准
  - 镜像站不做 `robots.txt` 屏蔽，而是输出 `noindex,follow`
  - `/`、`/research`、`/projects` 这类 locale 跳转入口统一 `noindex,follow`

### SEO 环境变量
- `SITE_CANONICAL_ORIGIN`
  - 用途：控制 canonical、`metadataBase`、Open Graph URL、`sitemap.xml` 和 `hreflang` 的主域名
  - 默认值：`https://ronchylu.com`
- `SITE_INDEXABLE`
  - 用途：控制当前部署是否允许参与 Google 收录
  - 兼容值：`0`、`false`、`no`、`off` 都表示镜像模式
  - 镜像模式下：
    - 页面输出 `noindex,follow`
    - `robots.txt` 仍允许抓取
    - `sitemap.xml` 返回空列表，不再给镜像域名喂 URL

### EdgeOne Pages 部署
- **静态导出模式**：`next.config.mjs` 在 `EDGEONE=1` 或 `CF_PAGES=1` 环境变量下使用 `output: "export"` + `trailingSlash: true`，生成纯静态站点到 `out/` 目录。
- **配置文件**：
  - `edgeone.json` 的 `buildCommand` 已固定为：
    - `SITE_CANONICAL_ORIGIN=https://ronchylu.com SITE_INDEXABLE=0 EDGEONE=1 npm run build`
  - 作用：保证 `ronchy2000.top` 始终作为镜像站部署，保持访问速度，但不会与 `.com` 抢 canonical / 收录
  - 包含 308 永久重定向规则：`/en` → `/en/`，`/zh` → `/zh/`
- **路径 `/en` vs `/en/` 的坑**：（熬到我2026年2月16日2:19am...
  - 静态托管中 `/en/` 会查找 `en/index.html`（✅ 能找到）
  - 但 `/en` 会查找文件 `en` 或 `en.html`（❌ 不存在）
  - **解决方案**：在 `edgeone.json` 的 `redirects` 中添加 308 重定向，将无尾斜杠路径重定向到有尾斜杠版本
  - 这比依赖 CDN"自动补斜杠"更明确、SEO 友好，且不受平台差异影响
- **子路径为何正常**：`/en/experience` 等子路径能访问是因为它们也是目录形态（`/en/experience/` → `index.html`），部分浏览器/CDN 会自动补全

### GitHub Actions
- `update-content.yml`：每日刷新 Recent Updates，亦可手动在 Actions 列表中触发。
- 若新增自动化脚本（例如根据 arXiv/Google Scholar 刷新 Publications），可以仿照该 workflow 添加新的 job。

### Vercel 部署
- 推送到主分支后自动构建，无需额外配置。
- Vercel 不会设置 `EDGEONE=1`，因此会使用标准的 Next.js SSG 模式（输出到 `.next/`），middleware（`proxy.ts`）会正常工作。
- 若 Vercel 承担的是镜像域名（如 `cv.ronchy2000.top`），请在 Project Settings → Environment Variables 中显式设置：
  - `SITE_INDEXABLE=0`
  - `SITE_CANONICAL_ORIGIN=https://ronchylu.com`
- 若需要 GitHub Actions 推送自动提交触发部署，请确保 Vercel 的部署策略允许「外部提交触发」或使用专用 deploy hook。

### Cloudflare Pages 部署
- 当前作为 **唯一主收录站** 使用：`https://ronchylu.com`
- 本仓库默认 canonical 主域名就是 `https://ronchylu.com`，因此 Cloudflare Pages 在不额外设置 SEO 环境变量时，也会输出正确的 canonical / sitemap / hreflang。
- 建议在 Cloudflare Pages 的构建设置中显式记录：
  - `SITE_CANONICAL_ORIGIN=https://ronchylu.com`
  - `SITE_INDEXABLE=1`

## 常见修改场景
- **添加新专利/论文**：在 `content/publications.json` 追加条目，`type` 选择 `P`、`C`、`J` 或 `S`；首页的成果目录会自动更新。
- **更新 Recent Updates**：若暂时不想依赖 GitHub Action，可手动编辑 `content/updates.json`。恢复自动化时重新触发 workflow 即可。
- **编辑项目**：在 `content/projects.json` 中维护条目/分组；项目页按 Stars 排序，每组默认显示四项。
- **调整导航顺序**：修改 `navItems` 数组，并确认对应页面文件存在。
- **更换头像/简历**：优先在 `content/profile.json` 里改 `avatar` / `cvLink` 路径（对应 `public/` 下文件）。当前默认是：
  - 头像：`public/images/profile-2026.jpeg`
  - 简历：`public/files/Ronchy_CV.pdf`

## 开发 & 本地调试
```bash
nvm use --lts
npm install
npm run dev      # http://localhost:3000
npm run lint     # 可选
npm run build    # 发布前验证
```

## 常见问题
- **导航未显示/排版异常**：确认 `SiteHeader` 没有被自定义样式覆盖；移动端第二行横向滚动属于预期行为。
- **Contact 表单是否发送邮件？** 不经过服务器。表单仅在本地生成 `mailto:` 链接，真实邮箱以 Base64 形式打包，点击按钮后才会在浏览器里解码显示。
- **Recent Updates 没刷新**：检查 GitHub Actions 的运行记录；若提示缺少权限/缺少 token，请在仓库 Secrets 中设置 `GH_PAT`，或者手动运行 `node scripts/update-recent-updates.mjs` 并提交。

如需更深度的自定义（路由级 i18n、代码高亮、RSS、Arxiv API 等），可在 `lib/blog.ts` / `lib/content.ts` 中扩展解析逻辑，再在页面中引入即可。

### 其他提示
- Footer 当前仅显示版权和更新时间，如需 Sitemap/RSS，可在 `components/site-footer.tsx` 恢复链接并生成文件。
- Contact 页面采用“点击才显示邮箱 + mailto”机制，如需更换邮箱只需更新 `NEXT_PUBLIC_CONTACT_EMAIL_B64` 并重新部署。
- `.github/workflows/update-content.yml` 每日运行更新脚本（Recent Updates + GitHub stars）；需要仓库 Secrets 中的 `GH_PAT` 具备推送权限。工作流使用 `npm install --no-audit` 安装依赖，以避免 `npm ci` 对锁文件的要求。
