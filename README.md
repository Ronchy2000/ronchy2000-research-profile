## Ronchy2000 Research Profile

Modern academic site for **Rongqi Lu** built with Next.js 14 + Tailwind CSS. Multi页面布局包含 Home / Research / Publications / Projects / Experience / CV / Blog / Contact 等板块，内容全部来自 `content/*.json` 文件，便于维护与部署。

### ✨ Highlights
- Next.js 14 App Router + Tailwind CSS，桌面端左侧名片 + 右侧正文，移动端顶部导航
- 明暗主题切换、打印优化（隐藏导航/侧栏，黑白输出）
- 所有数据均在 `content/` 中维护（profile、research、publications、projects、timeline、awards、updates）
- 页面组件化：Section、Timeline、PublicationItem、ProjectCard、Callout 等可复用模块
- 提供博客（MDX 占位）、CV 页面（在线预览 + 下载）、Contact 表单 UI 占位
- `scripts/update-recent-updates.mjs` / `scripts/update-project-stars.mjs` 通过 GitHub Actions 自动刷新首页动态和 GitHub star 数

### 🛠️ Getting Started
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
The site runs at `http://localhost:3000`. Edit files in `content/`, `app/(site)/*`, and `components/`; hot reload updates the preview instantly.

### 🧱 Content Structure
Key content files:

| 文件 | 说明 |
| --- | --- |
| `content/profile.json` | 双语名称、职称、关键词、社交/头像路径、CV 路径 |
| `content/research.json` | 研究兴趣卡片 + 研究经历时间线 |
| `content/publications.json` | 论文/专利列表（类型、标签、链接、备注） |
| `content/projects.json` | 学术项目与开源项目分组，保持开源仓库条目可见 |
| `content/timeline.json` | 教育与实习时间线 |
| `content/awards.json` | 荣誉列表（首页、CV 共用） |
| `content/updates.json` | 首页「Recent Updates」模块 |
| `blog/sample-post.mdx` | 博客示例文章，可替换或扩展 |

所有读取逻辑在 `lib/content.ts` 中，目前为 JSON 占位，可按需替换为 YAML/MDX 解析。
GitHub stars 会在 workflow 中调用 `scripts/update-project-stars.mjs` 自动更新。

### 📂 Assets
- Place a square profile image at `public/images/profile.jpg`（建议 600×600）
- Drop a PDF CV at `public/files/cv.pdf`，主页/CV/侧栏共用

### 🚀 Deploying to Vercel
1. Push the repository to GitHub.
2. Create a new project on [vercel.com](https://vercel.com) and import the repo.
3. Use the default Next.js build command (`npm run build`) and output directory (`.next`).
4. Set up a custom domain if desired, then trigger a deploy.

Vercel automatically enables preview deployments on each pull request and production deploys from the default branch.

- **GitHub 邮箱隐私**：在 GitHub Settings → Emails 勾选 “Keep my email addresses private” 和 “Block command line pushes that expose my email”，并改用 `username@users.noreply.github.com` 作为提交邮箱，避免仓库历史泄露真实邮箱。
- **公开邮箱建议**：使用邮箱提供商的别名/子地址（如 `name+site@outlook.com`），并在收件规则里将该别名的邮件自动归档或标记，便于批量拦截垃圾信息。

### 🛡 Contact Alias (Zero Third-party)
> 联系方式只在浏览器本地解码，没有任何外部表单或邮件代理。

1. **创建别名并编码**：任选一个公开邮箱别名（建议开启自动过滤），运行 `echo -n "hi+site@example.com" | base64` 得到 Base64 字符串。
2. **配置变量**：在 `.env` / Vercel / 国内托管平台里设置
   - `NEXT_PUBLIC_CONTACT_ALIAS_B64`：上一步生成的字符串。
   - （可选）`NEXT_PUBLIC_CONTACT_MAILTO_SUBJECT`：自定义邮件主题前缀。
3. **部署即可**：`contact/page.tsx` 会在用户点击“显示邮箱”后本地解码别名，并通过 `mailto:` 打开访客设备上的邮件客户端。真实邮箱不会出现在静态 HTML 或 JS bundle 中。
4. **多站点追踪**：可为 Vercel、国内镜像等不同托管环境配置不同的别名，以识别垃圾来源；切换别名只需更新环境变量并重新部署。

- 导航：在 `app/(site)/layout.tsx` 的 `navItems` 数组维护。
- 样式：调节 `tailwind.config.ts`（brand 色）、`app/globals.css`（背景/打印样式）。

- 导航：在 `app/(site)/layout.tsx` 的 `navItems` 数组维护。
- 样式：调节 `tailwind.config.ts`（brand 色）、`app/globals.css`（背景/打印样式）。
- 组件：`Section`、`Timeline`、`ProjectCard` 等均有简洁 props 注释，方便快速复用。
- 如果需要新增页面或模块，先在 `content/` 增加数据，再在 `lib/content.ts` & `app/(site)` 中接入。
- Workflow (`.github/workflows/update-content.yml`) 每日运行，需仓库具有推送权限；可在 Secrets 中配置 `GH_PAT` 以避免速率限制。工作流内使用 `npm install --no-audit` 安装依赖，适合无 `npm ci` 锁文件的情况。

### 🧪 Recommended Next Steps
- Run `npm run lint` to verify code style before committing.
- Add integration with analytics (e.g., Umami, Plausible) if you need traffic insights.

Enjoy your new academic site! 内容驱动、双主题、易于维护。
