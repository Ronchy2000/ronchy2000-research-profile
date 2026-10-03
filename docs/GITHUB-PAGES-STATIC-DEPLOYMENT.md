# 从静态导出到 GitHub Pages：以 Next.js 学术主页为例

本文以 Rongqi Lu 的 Next.js 学术主页为例，说明如何把一个原本可以部署到 Vercel、EdgeOne Pages 的项目，同时完整部署到 GitHub Pages，并解释两类 GitHub Pages 地址为什么不同：

- 用户站点：<https://ronchylu.github.io/en/>
- 项目站点：<https://ronchy2000.github.io/ronchy2000-research-profile/en/>

这两个地址目前都承载同一套主页，但它们的仓库命名、部署根路径和资源路径处理方式不同。

## 1. 先理解“静态完整部署”

Next.js 项目通常不只是若干 HTML 文件。默认执行：

```bash
npm run build
```

会生成供 Next.js 运行时使用的 `.next/`，其中可以包含服务端渲染、Middleware、API Route 等能力。Vercel 能识别并运行这些能力，因此通常不需要额外配置。

GitHub Pages 的定位不同：它只负责托管 HTML、CSS、JavaScript、图片和 PDF 等静态文件，不会替项目长期运行 Node.js 服务器。因此，部署链路需要变成：

```text
Next.js 源代码
    ↓ npm run build
静态导出目录 out/
    ↓ GitHub Actions 上传
GitHub Pages CDN
    ↓
用户浏览器
```

Next.js 通过下面的配置启用静态导出：

```js
output: "export"
```

构建完成后，每个可静态生成的路由都会对应 `out/` 中的 HTML 文件。例如：

```text
out/
├── index.html
├── en/index.html
├── zh/index.html
├── en/research/index.html
├── zh/research/index.html
├── _next/
├── images/
└── files/
```

这才是 GitHub Pages 真正需要发布的内容。直接把 Next.js 源代码目录交给 Pages，并不会自动得到完整网站。

### 静态导出的边界

静态导出适合个人主页、文档、博客和作品集，但不能在 GitHub Pages 上使用必须依赖常驻服务器的功能，例如：

- 服务端动态渲染；
- API Routes 或 Route Handlers 的运行时请求；
- Server Actions；
- ISR；
- 依赖服务器执行的 Middleware/Proxy；
- Next.js 默认图片优化服务。

本项目采用以下替代方式：

- 页面和博客在构建时生成；
- 语言判断在浏览器中完成；
- `next/image` 使用 `unoptimized: true`；
- 联系方式等交互逻辑在浏览器中运行；
- JSON、头像和 PDF 均随静态产物一起发布。

## 2. GitHub Pages 的两类域名

GitHub Pages 把站点分为“用户/组织站点”和“项目站点”。

| 类型 | 仓库名称 | 默认地址 | 是否需要子路径 |
| --- | --- | --- | --- |
| 用户站点 | 必须是 `用户名.github.io` | `https://用户名.github.io/` | 否 |
| 项目站点 | 任意普通仓库名 | `https://用户名.github.io/仓库名/` | 是 |

### 用户站点：最简洁的 github.io 地址

用户站点要求仓库所有者和仓库名完全对应。例如：

```text
GitHub 用户名：ronchylu
仓库名：ronchylu.github.io
站点根地址：https://ronchylu.github.io/
英文页面：https://ronchylu.github.io/en/
中文页面：https://ronchylu.github.io/zh/
```

因此，想获得 `https://用户名.github.io/` 这种简洁地址，关键不是配置一个普通自定义域名，而是把仓库创建或重命名为：

```text
用户名.github.io
```

注意后缀是 `github.io`，不是 `github.tio`。同一账号只能有一个这样的用户站点。

本项目的实际做法是：在账号 `ronchylu` 下 Fork 源仓库，并把 Fork 命名为 `ronchylu.github.io`。由于它部署在域名根目录，因此不设置 `basePath`。

### 项目站点：保留仓库名

原项目仓库为：

```text
Ronchy2000/ronchy2000-research-profile
```

它对应的 Pages 根地址是：

```text
https://ronchy2000.github.io/ronchy2000-research-profile/
```

英文页面则是：

```text
https://ronchy2000.github.io/ronchy2000-research-profile/en/
```

这里的 `/ronchy2000-research-profile` 是站点根路径的一部分。CSS、JavaScript、头像、PDF 和客户端跳转都必须考虑这个前缀。

## 3. 为多个托管平台保留不同构建模式

不要为了 GitHub Pages 把整个项目永久改成静态导出，否则可能无意中限制 Vercel 上可用的 Next.js 服务端能力。更稳妥的方式是通过环境变量选择构建模式：

```js
/** @type {import('next').NextConfig} */
const isStaticExportBuild =
  process.env.EDGEONE === "1" ||
  process.env.CF_PAGES === "1" ||
  process.env.GITHUB_PAGES === "1";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  images: {
    unoptimized: true
  },
  ...(isStaticExportBuild
    ? {
        output: "export",
        trailingSlash: true
      }
    : {}),
  ...(basePath ? { basePath } : {})
};

export default nextConfig;
```

各平台的行为如下：

| 平台 | 构建变量 | 构建产物 | 路径特点 |
| --- | --- | --- | --- |
| Vercel | 不设置上述静态变量 | `.next/` | 根路径，保留 Next.js 运行时能力 |
| EdgeOne Pages | `EDGEONE=1` | `out/` | 通常部署在绑定域名根路径 |
| GitHub Pages 用户站点 | `GITHUB_PAGES=1` | `out/` | 根路径，不设置 `NEXT_PUBLIC_BASE_PATH` |
| GitHub Pages 项目站点 | `GITHUB_PAGES=1` | `out/` | 设置 `NEXT_PUBLIC_BASE_PATH=/仓库名` |

这样，同一个代码库可以针对不同平台生成不同产物，而不需要把某个平台的路径写死到所有部署中。

## 4. 正确处理项目站点的 `basePath`

用户站点不需要路径前缀；项目站点需要。例如：

```yaml
env:
  GITHUB_PAGES: "1"
  NEXT_PUBLIC_BASE_PATH: /ronchy2000-research-profile
```

Next.js 的 `basePath` 会处理框架生成的脚本、样式和多数 `Link` 路径，但以下内容仍值得单独检查：

- `window.location.replace("/en")` 之类的浏览器跳转；
- 原生 `<a href="/files/example.pdf">`；
- `public/` 下图片的绝对路径；
- favicon 等手动填写的元数据地址。

可以使用一个很小的辅助函数：

```ts
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withBasePath(path: string) {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
```

然后用于浏览器跳转和静态资源：

```tsx
window.location.replace(withBasePath("/en"));

<a href={withBasePath("/files/Ronchy_CV.pdf")}>View CV</a>
```

对用户站点而言，`NEXT_PUBLIC_BASE_PATH` 为空，结果仍是 `/en`；对项目站点而言，结果则是 `/ronchy2000-research-profile/en`。

## 5. 用 GitHub Actions 构建，而不是直接发布源码

Next.js 项目应在仓库的 **Settings → Pages → Build and deployment** 中选择：

```text
Source: GitHub Actions
```

不要选择仓库根目录的 **Deploy from a branch**。后者适合仓库中已经存在可直接发布的 HTML，或者由 Jekyll 处理的内容；如果根目录只有 Next.js 源代码和 `README.md`，Pages 可能只把 README 渲染成一个简单页面，而不会执行所需的 Next.js 静态构建。

### 完整工作流

在仓库中创建 `.github/workflows/deploy-pages.yml`：

```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        run: npm run build
        env:
          GITHUB_PAGES: "1"
          SITE_CANONICAL_ORIGIN: https://ronchylu.com
          SITE_INDEXABLE: "0"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

这份示例用于 `ronchylu.github.io` 用户站点，所以没有设置 `NEXT_PUBLIC_BASE_PATH`。

若用于 `ronchy2000-research-profile` 项目站点，只需在构建环境中增加：

```yaml
NEXT_PUBLIC_BASE_PATH: /ronchy2000-research-profile
```

工作流完成四件事：

1. 获取仓库代码；
2. 安装锁定版本的依赖；
3. 执行 Next.js 静态导出并生成 `out/`；
4. 把 `out/` 作为 Pages artifact 上传并发布。

如果实际维护分支不是 `master`，应把触发分支改成真实分支。例如：

```yaml
branches:
  - feat/information-architecture-rebuild
```

应尽量只允许一个生产分支触发 Pages 部署，否则旧分支的新提交可能覆盖已经发布的新版本。

## 6. 让 `/` 根据浏览器语言进入 `/en/` 或 `/zh/`

静态托管无法依赖服务器读取请求头后再执行语言重定向，因此本项目为 `/` 生成一个真实的 `index.html`，再在浏览器中判断语言。

核心思路是：

```ts
const language = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase();
const locale = language.startsWith("zh") ? "zh" : "en";

window.location.replace(`/${locale}`);
```

项目的实际实现还会：

- 优先读取之前保存的语言 Cookie；
- 识别常见的中文和英文语言值；
- 为不支持 JavaScript 的浏览器提供 `/en/` 文本链接；
- 在项目站点中自动补上 `basePath`。

最终访问：

```text
https://ronchylu.github.io/
```

浏览器会进入：

```text
https://ronchylu.github.io/en/
```

或：

```text
https://ronchylu.github.io/zh/
```

本项目使用 `/zh/` 表示中文，不使用 `/cn/`。

## 7. 实际启用步骤

完成代码配置后，在 GitHub 仓库中执行：

1. 打开 **Actions**；
2. 如果这是 Fork，按提示启用工作流；
3. 打开 **Settings → Pages**；
4. 将 Source 设置为 **GitHub Actions**；
5. 向工作流监听的分支提交一次变更，或手动运行 `Deploy site to GitHub Pages`；
6. 等待 build 和 deploy 两个 job 都变绿；
7. 访问对应的 `github.io` 地址验证。

如果用户站点仓库的默认分支还是旧代码，而新网站在功能分支中，可以先从功能分支部署；确认无误后再合并到 `master`，并把工作流监听分支改成 `master`。

## 8. 从 GitHub Pages 延伸到其他托管平台

### Vercel

Vercel 能直接识别 Next.js。通常只需连接 Git 仓库并使用默认构建命令：

```text
Build command: npm run build
Output: 由 Vercel 自动识别
```

不要为 Vercel 设置 `GITHUB_PAGES=1` 或 `EDGEONE=1`。这样它使用正常的 `.next/` 构建，并保留 Next.js 服务端能力、预览部署和平台原生优化。

### EdgeOne Pages

本项目在 `edgeone.json` 中使用：

```json
{
  "buildCommand": "SITE_CANONICAL_ORIGIN=https://ronchylu.com SITE_INDEXABLE=0 EDGEONE=1 npm run build",
  "outputDirectory": "out"
}
```

`EDGEONE=1` 让项目进入静态导出模式，EdgeOne Pages 再发布 `out/`。如果站点绑定在域名根路径，一般不设置 GitHub 项目站点专用的 `NEXT_PUBLIC_BASE_PATH`。

### 选择平台时真正要判断的事情

| 需求 | 更适合的方案 |
| --- | --- |
| 纯静态个人主页、文档或博客 | GitHub Pages、EdgeOne Pages 等静态托管 |
| 希望使用最简单的 `用户名.github.io` 免费域名 | GitHub Pages 用户站点 |
| 需要 SSR、Server Actions、API 或 ISR | Vercel 或支持对应 Next.js 运行时的平台 |
| 希望每个 Pull Request 自动生成预览环境 | Vercel 等带 Preview Deployment 的平台 |
| 希望多个地区或网络环境都有镜像 | 同一静态产物部署到多个 CDN 平台 |

静态导出的价值在于产物高度可移植：只要平台能托管 `out/` 中的文件，就能提供完整网站。平台差异主要集中在构建触发方式、域名、CDN、缓存和是否支持服务端运行时。

## 9. 多域名部署与 SEO

同一内容部署到多个域名时，应明确一个主收录域名，避免搜索引擎把镜像当成重复页面相互竞争。

本项目约定：

```text
主收录域名：https://ronchylu.com
GitHub Pages：可访问镜像
EdgeOne/Vercel 的其他域名：按需要作为镜像
```

GitHub Pages 工作流因此设置：

```yaml
SITE_CANONICAL_ORIGIN: https://ronchylu.com
SITE_INDEXABLE: "0"
```

这让 GitHub Pages 可以正常访问，但页面输出 `noindex,follow`，canonical 仍指向主站。如果未来决定让 GitHub Pages 成为唯一主站，则应把 canonical 改成对应的 `github.io` 地址，并重新评估 `SITE_INDEXABLE`。

这和 GitHub Pages 的 URL 路径是两个独立问题：

- `basePath` 决定页面和资源从哪里加载；
- canonical / indexable 决定搜索引擎如何看待这个站点。

### GitHub Pages 自定义域名

还可以在 **Settings → Pages → Custom domain** 中给 Pages 绑定自己的域名。配置生效后，原来的 `github.io` 地址通常会重定向到自定义域名。

例如，`https://ronchylu.github.io/en/` 仍可以作为入口，但当前会由 GitHub Pages 转到 `github.ronchylu.com/en/`。这不会改变前面介绍的仓库命名和 `basePath` 规则：用户站点仍然部署在根路径，项目站点仍然部署在 `/仓库名` 下。

自定义域名需要同时完成：

1. 在域名服务商处配置 GitHub Pages 要求的 DNS 记录；
2. 在 Pages 设置中填写 Custom domain；
3. 等待 DNS 与 TLS 证书生效；
4. 证书就绪后启用 **Enforce HTTPS**。

不要通过手工下载或复制网站来实现域名切换。域名只决定用户如何访问，构建和发布仍由同一个 GitHub Actions workflow 完成。

## 10. 常见问题排查

### 打开网站只看到 README

原因通常是 Pages 仍在使用 **Deploy from a branch**，发布的是源码根目录，而不是构建后的 `out/`。

处理方式：

1. Settings → Pages；
2. Source 改为 GitHub Actions；
3. 确认工作流上传路径为 `./out`。

### 页面能开，但没有样式或 JavaScript

项目站点最常见的原因是缺少仓库路径前缀。检查生成 HTML 中的资源地址应该类似：

```text
/ronchy2000-research-profile/_next/static/...
```

而不是：

```text
/_next/static/...
```

用户站点则正好相反：不应该保留 `/ronchy2000-research-profile`。

### 首页跳转到错误地址

检查客户端重定向是否使用了 `basePath`。项目站点不能直接执行：

```ts
window.location.replace("/en");
```

否则它会离开项目子目录。用户站点使用 `/en` 则没有问题。

### 图片或 PDF 返回 404

检查 `public/` 文件是否已经进入 `out/`，并检查原生 `<a>`、`<img>` 或客户端脚本是否为项目站点补上了路径前缀。

### Workflow 没有运行

依次检查：

- Fork 是否已经启用 Actions；
- workflow 文件是否位于 `.github/workflows/`；
- 提交所在分支是否出现在 `on.push.branches` 中；
- Pages Source 是否选择 GitHub Actions；
- workflow 是否存在 YAML 缩进错误。

### 构建成功但部署失败

检查工作流权限是否包含：

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

同时检查 `deploy` job 是否依赖 `build`，上传目录是否确实存在 `index.html`。

## 11. 部署前检查清单

- [ ] `npm run build` 能完成；
- [ ] 静态模式会生成 `out/index.html`；
- [ ] `/en/` 与 `/zh/` 都有对应静态页面；
- [ ] 用户站点没有 `basePath`；
- [ ] 项目站点使用 `/仓库名` 作为 `basePath`；
- [ ] CSS、JavaScript、头像、图标和 PDF 的路径正确；
- [ ] Pages Source 为 GitHub Actions；
- [ ] workflow 只监听预期的生产分支；
- [ ] build 和 deploy job 都成功；
- [ ] 多域名部署时已经确定 canonical 和索引策略。

## 参考资料

- [GitHub Pages：用户站点与项目站点](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [GitHub Pages：创建站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [GitHub Pages：配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Next.js：Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- [Vercel：Next.js 部署](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [EdgeOne Pages：框架与构建配置](https://pages.edgeone.ai/document/framework-overview)
