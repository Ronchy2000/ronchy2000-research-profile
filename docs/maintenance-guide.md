# 维护手册（自用）

本项目基于 Next.js 14 + Tailwind CSS，采用「内容文件 + 页面壳层」模式。所有文案集中在 `content/`，页面只负责排版与组件组合。以下指南便于后续维护。

## 目录结构速览

```
app/
  (site)/
    layout.tsx        # 页面壳层：顶部导航 + 侧边名片 + Footer
    page.tsx          # 首页（Hero / Updates / Projects / Publications / Honors）
    research/page.tsx
    publications/page.tsx
    projects/page.tsx
    experience/page.tsx
    cv/page.tsx
    blog/page.tsx     # 博客列表占位
    blog/[slug]/page.tsx # 博客详情占位
    contact/page.tsx
components/
  site-header.tsx     # 顶部横向导航（PC/移动共用）
  side-profile-card.tsx
  section.tsx         # 统一 Section 容器
  project-card.tsx / publication-item.tsx / timeline.tsx / tag.tsx / table.tsx / callout.tsx
  site-footer.tsx / site-shell.tsx / theme-toggle.tsx / mdx-content.tsx / providers.tsx
content/
  profile.json        # 个人信息（中英文）
  research.json       # 研究兴趣 + 经历时间线
  publications.json   # 论文 / 专利清单
  projects.json       # 学术与开源项目分组
  timeline.json       # 教育、实习时间线（Experience / CV 共用）
  awards.json         # 荣誉奖项
  updates.json        # 首页 Recent Updates 数据（可由 GitHub Action 自动刷新）
blog/sample-post.mdx  # 博客示例文章
lib/content.ts        # 从 content/ 读取占位逻辑
lib/content-types.ts  # 内容类型声明
scripts/update-recent-updates.mjs # 自动更新 Recent Updates 的脚本
.github/workflows/update-content.yml # 定时任务配置
```

## 内容维护速查表

| 模块 | 数据文件 | 说明 |
| ---- | -------- | ---- |
| Hero & 侧边名片 | `content/profile.json` | 修改姓名、职称、关键词、社交链接、头像、CV 路径；Hero 按关键词渲染 Tag。 |
| Recent Updates | `content/updates.json` | 三条最近动态；默认由 GitHub Action 脚本生成，必要时可手动编辑。 |
| Highlighted Projects | `content/projects.json` | 分组字段 `kind`= `academic` 或 `open-source`；首页取前 4 项，Projects 页完整展示。 |
| Latest Writing & Publications 页 | `content/publications.json` | `type` 取值 `C`(Conference) / `J`(Journal) / `P`(Patent) / `S`(In Submission)，会自动映射标签，支持 Type/Year 筛选；新增条目按 `year` 排序，首页自动展示最新两项。 |
| Experience / CV 页 | `content/timeline.json` | `education`、`experience` 两个数组；每项的 `details` 为 bullet。 |
| Honors | `content/awards.json` | 年份倒序，首页取前 6 条；CV 页展示全部。 |
| 博客 | `blog/*.mdx` | 使用 MDX 排版；`MDXContent` 组件提供基础排版。 |

> 所有 JSON 均带 `_meta` 字段，记录字段释义，方便回顾。

## 首页模块改动说明

### Hero 区
- 关键词来自 `profile.json` 的 `keywords`。
- 主按钮为 `View CV`（跳转 `/cv` 页面查看/下载 PDF），其余入口分别指向 Publications / Projects。
- 头像路径在 `profile.json` 中配置；尺寸在侧栏 `side-profile-card.tsx` 中调节（当前设为约 160px）。

### Recent Updates
- 数据源：`content/updates.json`。
- 自动更新：`.github/workflows/update-content.yml` 每日 01:00 UTC 运行 `scripts/update-recent-updates.mjs`。
  - 默认使用 `secrets.GITHUB_TOKEN`（具有推送权限即可）；如需更高频率请在仓库 Secrets 中新增 `GH_PAT`（repo scope）。
  - 脚本读取最新 commit，写入 `type=Commit`、`title`（提交首行）、`summary`（作者）；可自行改成抓取 Releases/Issues。
  - 脚本会自动忽略由 `github-actions[bot]`、Dependabot 以及树莓派备份脚本（`Router Auto Backup`）生成的提交；如需扩展忽略名单，可通过环境变量 `IGNORED_COMMIT_AUTHORS`、`IGNORED_COMMIT_EMAILS`、`IGNORED_COMMIT_MESSAGE_KEYWORDS` 追加。
- 手动编辑：直接修改 `updates.json` 中的 `updates` 数组，字段 `type`、`date`（YYYY-MM-DD）、`title`、`summary`、`link`。

### Highlighted Projects
- 首页取项目分组的前四个条目；排序由 `content/projects.json` 中的顺序控制。
- 如果需要展示某个具体开源仓库（如 `Multi-agent-RL`、`Raspi-ImmortalWrt`），确保其条目在 `Open-source & Personal Projects` 分组里靠前。
- GitHub star 数据由 `scripts/update-project-stars.mjs` 获取并写回 `content/projects.json`，在 `.github/workflows/update-content.yml` 中与 Recent Updates 一起运行。

### Latest Writing / Publications 页
- `PublicationItem` 组件会根据 `type` 自动生成标签（In Submission / Conference / Journal / Patent），并显示年份 + 自定义标签列表。
- 在 `content/publications.json` 中补充条目时：
  - `type` 为 `C`、`J`、`P`、`S`（示例中已包含 3 个专利条目作为模板）。
  - `tags` 用于补充主题标签，页面会显示在标题下。
  - `links` 可放 DOI、PDF、代码仓库链接，文本会附带外链箭头。
- 首页的 “Latest Writing” 自动按 `year` 倒序取最近 2 条，无需额外维护，Publications 页的 Type/Year 按钮可即时筛选当前列表（`All` 表示不过滤）。

## 顶部导航 & 响应式
- 导航定义位于 `app/(site)/layout.tsx` 中的 `navItems` 常量，使用 `satisfies NavItem[]` 保障路径正确，新增页面时在此添加即可。
- `SiteHeader` 横向排布导航；桌面端显示完整菜单，移动端在第二行横向滚动。
- 侧边名片（仅桌面端显示）由 `SideProfileCard` 渲染，已移除多余的 Download CV 按钮。

## Contact 表单说明
- `contact/page.tsx` 中的表单仅为 UI 占位，不会发送消息。页面上增加了 `Callout` 提醒：请直接使用邮箱（`profile.json` 中的 `email`）。
- 若要接入真实表单，可在该页面替换为第三方服务（Formspree、Resend 等）或自建 API。

## 样式与设计基准
- 背景、打印、焦点样式：`app/globals.css`。
- 设计 Token：间距以 8/12 的倍数为主，圆角多使用 `rounded-2xl/3xl`。
- 暗色/浅色主题通过 `theme-toggle.tsx` 切换。
- 已移除 sitemap/rss 链接；Footer 仅保留版权与更新时间。

## 自动化与部署
- `npm run build` 会执行 `postbuild`，确保 `edgeone.json` 复制到 `.next/`，便于 EdgeOne 读取重定向配置。
- GitHub Actions：
  - `update-content.yml`：每日刷新 Recent Updates，亦可手动在 Actions 列表中触发。
  - 若新增自动化脚本（例如根据 arXiv/Google Scholar 刷新 Publications），可以仿照该 workflow 添加新的 job。
- Vercel 部署：推送到主分支后自动构建，无需额外配置。若需要 GitHub Actions 推送自动提交，请确保 Vercel 的部署策略允许「外部提交触发」或使用专用 deploy hook。

## 常见修改场景
- **添加新专利/论文**：在 `content/publications.json` 追加条目，`type` 选择 `P`、`C`、`J` 或 `S`；Homepage 与 Publications 页将自动更新。
- **更新 Recent Updates**：若暂时不想依赖 GitHub Action，可手动编辑 `content/updates.json`。恢复自动化时重新触发 workflow 即可。
- **编辑 Highlighted Projects**：通过调整 `content/projects.json` 中条目的顺序/分组，控制首页与 Projects 页的展示。
- **调整导航顺序**：修改 `navItems` 数组，并确认对应页面文件存在。
- **更换头像/简历**：
  - 头像：`public/images/profile.jpg`（建议 600×600 PNG/JPG）。
  - 简历：`public/files/cv.pdf`（Hero / CV 页面共用）。

## 开发 & 本地调试
```bash
nvm use --lts
npm install
npm run dev      # http://localhost:3000
npm run lint     # 可选
npm run build    # 发布前验证（postbuild 会自动复制 edgeone.json）
```

## 常见问题
- **导航未显示/排版异常**：确认 `SiteHeader` 没有被自定义样式覆盖；移动端第二行横向滚动属于预期行为。
- **Contact 表单是否发送邮件？** 默认不会，请使用页面上的邮箱直接联系。
- **Recent Updates 没刷新**：检查 GitHub Actions 的运行记录；若提示缺少权限，请添加 `GH_PAT`（repo 权限）到仓库 Secrets，或者手动运行 `node scripts/update-recent-updates.mjs` 并提交。

如需更深度的自定义（多语言切换、MDX 解析、Arxiv API 等），可在 `lib/content.ts` 中增加对应的解析逻辑，再在页面中引入即可。

### 其他提示
- Footer 当前仅显示版权和更新时间，如需 Sitemap/RSS，可在 `components/site-footer.tsx` 恢复链接并生成文件。
- Contact 表单仍为占位；若要启用可接入 Formspree、Resend 等第三方服务或自建 API。
- `.github/workflows/update-content.yml` 每日运行更新脚本（Recent Updates + GitHub stars）；确保仓库 token 拥有推送权限，建议配置 `GH_PAT`。工作流使用 `npm install --no-audit` 安装依赖，以避免 `npm ci` 对锁文件的要求。
