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

在填写 DNS 记录前，需要先分清 `A`、`AAAA` 和 `CNAME`。有时会口头说成“AAA”，但 DNS 标准记录类型中这里应写的是 **AAAA**，即四个字母 A。

#### A、AAAA、CNAME 分别是什么

DNS 的任务是把便于记忆的主机名转换为网络连接所需的信息。

| 记录类型 | 记录保存的内容 | 常见用途 | GitHub Pages 中的典型用途 |
| --- | --- | --- | --- |
| `A` | 一个 IPv4 地址，例如 `185.199.108.153` | 让主机名直接指向 IPv4 服务器 | 根域名 `example.com` 无法使用普通 CNAME 时，指向 GitHub Pages IPv4 |
| `AAAA` | 一个 IPv6 地址，例如 `2606:50c0:8000::153` | 让主机名直接指向 IPv6 服务器 | 为根域名补充 GitHub Pages IPv6 支持 |
| `CNAME` | 另一个主机名，例如 `ronchylu.github.io` | 给一个主机名创建别名 | `github.ronchylu.com` 这类子域名指向 GitHub Pages 默认域名 |

它们的关系可以简化为：

```text
A      : example.com ──→ 185.199.108.153
AAAA   : example.com ──→ 2606:50c0:8000::153
CNAME  : github.example.com ──→ username.github.io ──→ GitHub Pages IP
```

`A` 与 `AAAA` 的右侧必须是 IP 地址；`CNAME` 的右侧必须是主机名，不能填写协议、端口或路径。因此下面是错误写法：

```text
https://ronchylu.github.io
ronchylu.github.io/en/
ronchylu.github.io:443
```

正确目标只是：

```text
ronchylu.github.io
```

同一个名称如果已经存在 CNAME，通常不能再同时配置 A、AAAA 或其他互相冲突的记录。例如，`github.ronchylu.com` 使用 CNAME 后，不应再保留名称同为 `github` 的旧 A/AAAA 记录。

#### 根域名与子域名应该选哪一种

GitHub Pages 对两类自定义域名采用不同配置。

**子域名**，例如 `github.ronchylu.com`、`blog.example.com`：

```text
Type   : CNAME
Name   : github
Target : ronchylu.github.io
```

这是本项目应该使用的方式。即使绑定的是项目站点，CNAME 目标也只写 `<用户名>.github.io`，不把仓库名或 `/en/` 路径写入 DNS。

**根域名**，例如 `example.com`：可以使用 DNS 服务商提供的 ALIAS/ANAME 指向 `<用户名>.github.io`，或者使用 GitHub 官方公布的 A/AAAA 地址。当前官方地址为：

```text
# IPv4 / A
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

# IPv6 / AAAA
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

这些地址在本教程中用于根域名的 GitHub Pages 配置，并应以 GitHub 官方文档的最新值为准。对于 `github.ronchylu.com` 这样的普通子域名，不需要手工填写这些 IP，直接使用 CNAME 更清楚，也便于 GitHub 验证。

#### Cloudflare 橙云和灰云代表什么

Cloudflare 的 Proxy status 决定它只做 DNS，还是同时充当网站反向代理。

| 状态 | Cloudflare 界面 | 公共 DNS 通常返回 | HTTP 流量路径 | 对 GitHub Pages CNAME 检查的影响 |
| --- | --- | --- | --- | --- |
| Proxied | 橙色云朵，常称“橙云” | Cloudflare Anycast A/AAAA 地址 | 浏览器 → Cloudflare → GitHub Pages | GitHub 看不到原始 CNAME，可能报 `InvalidARecordError` |
| DNS only | 灰色云朵，常称“灰云” | 原始 CNAME `ronchylu.github.io` | 浏览器 → GitHub Pages | GitHub 可以直接验证 CNAME，推荐用于此配置 |

橙云并没有把 Cloudflare 控制台里的记录类型真的改成 A；它是在对外应答 DNS 查询时隐藏并扁平化 CNAME，返回 Cloudflare 自己的代理 IP。于是会出现一种看似矛盾的情况：

```text
Cloudflare 控制台：CNAME → ronchylu.github.io
公共 DNS 查询：A → 104.21.x.x / 172.67.x.x
GitHub Pages 判断：这是 A 记录，不是要求的 CNAME
```

这正是下面报错的典型原因：

```text
github.ronchylu.com is improperly configured
InvalidARecordError
```

灰云则只使用 Cloudflare 的权威 DNS 服务，不经过 Cloudflare HTTP 代理。GitHub Pages 本身已经提供 CDN 和 HTTPS，因此这里保持灰云是简单、稳定的方案。不要在 GitHub 检查通过后立即切回橙云，否则 DNS Check、证书签发或后续续期仍可能重新受到影响。

#### `github.ronchylu.com` 的最终正确配置

Cloudflare 中应保留一条记录：

| 字段 | 值 |
| --- | --- |
| Type | `CNAME` |
| Name | `github` |
| Target | `ronchylu.github.io` |
| Proxy status | `DNS only`（灰云） |
| TTL | `Auto` |

同时确认：

- 没有名称同为 `github` 的旧 A 或 AAAA 记录；
- 没有为这条记录单独启用 CNAME Flattening；
- Cloudflare DNS Settings 中没有启用 **CNAME flattening for all CNAME records**；
- GitHub 仓库 **Settings → Pages → Custom domain** 填写的是 `github.ronchylu.com`。

Cloudflare 默认只需要在根域名执行 CNAME Flattening。如果开启“Flatten all CNAME records”，即使已经切成灰云，外部仍可能只看到最终 A/AAAA 地址，导致 GitHub 无法完成 CNAME 检查。

#### 推荐配置顺序

为了降低子域名被他人抢占的风险，GitHub 建议先在 Pages 中声明自定义域名，再修改 DNS：

1. 在仓库 **Settings → Pages → Custom domain** 填写 `github.ronchylu.com` 并保存；
2. 在 Cloudflare 创建或修改 `github` 的 CNAME；
3. Target 填写 `ronchylu.github.io`；
4. 将 Proxy status 切换为 **DNS only（灰云）**；
5. 保存后检查是否存在同名 A/AAAA 记录；
6. 等待公共 DNS 返回正确 CNAME；
7. 回到 GitHub Pages 点击 **Check again**；
8. DNS Check 成功后等待 GitHub 签发 TLS 证书；
9. **Enforce HTTPS** 可用后勾选它。

使用 GitHub Actions 发布 Pages 时，不要求仓库中存在 `CNAME` 文件；GitHub 会保存 Pages 设置中的 Custom domain。不要为了修复 DNS 检查而手工向构建产物添加一个不必要的 `CNAME` 文件。

#### 如何验证 DNS，而不是盲目等待

先检查 Cloudflare 和 Google 公共解析器：

```bash
dig @1.1.1.1 github.ronchylu.com CNAME +short
dig @8.8.8.8 github.ronchylu.com CNAME +short
```

两者都应该返回：

```text
ronchylu.github.io.
```

也可以查看完整答案：

```bash
dig github.ronchylu.com CNAME +noall +answer
```

预期结构为：

```text
github.ronchylu.com.  300  IN  CNAME  ronchylu.github.io.
```

如果 CNAME 查询为空，而 A 查询返回 `104.21.*`、`172.67.*` 或 `2606:4700:*` 等 Cloudflare 地址，说明橙云或 CNAME Flattening 仍在生效。此时继续等待不会自行变成正确 CNAME，应先修改 Cloudflare 配置。

#### 本项目的实际排障结果

本项目最初在 Cloudflare 中已经填写：

```text
CNAME github → ronchylu.github.io
```

但 Proxy status 为橙云。GitHub Pages 因而显示：

```text
DNS check unsuccessful
InvalidARecordError
```

把同一条记录切换为灰云并保存后，公共解析器立即返回正确 CNAME，GitHub Pages 的检查也直接变为：

```text
DNS check successful
```

这说明当时的首要问题是 Cloudflare 代理隐藏了 CNAME，而不是必须等待很久的缓存。

#### 缓存与等待时间

DNS 修改后确实存在缓存，但应该先区分“配置尚未正确”和“配置正确、正在传播”：

- 权威 DNS 仍返回 Cloudflare IP：配置问题，不是单纯缓存；
- 权威 DNS 已返回 CNAME，但某些公共解析器仍返回旧值：递归 DNS 缓存；
- 公共解析器都返回 CNAME，但 GitHub 页面仍显示旧错误：GitHub 检查结果可能尚未刷新。

Cloudflare 的 Proxied 记录通常使用约 300 秒的自动 TTL，因此切换灰云后常见等待时间是 5–15 分钟；本项目实际是切换后立即检查成功。不同递归解析器可能保留旧值更久，GitHub 官方提示 DNS 传播最长可能需要 24 小时。

HTTPS 是下一阶段：DNS Check 成功后，GitHub 还需要签发证书。**Enforce HTTPS** 可能在一小时左右可用，官方仍建议为异常情况预留最多 24 小时。如果 DNS 已正确但 HTTPS 长时间没有开始签发，可以在 Pages 设置中移除后重新添加 Custom domain，以重新触发证书流程。

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
- [GitHub Pages：管理自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages：排查自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)
- [Next.js：Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- [Vercel：Next.js 部署](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [EdgeOne Pages：框架与构建配置](https://pages.edgeone.ai/document/framework-overview)
- [Cloudflare：Proxied 与 DNS only](https://developers.cloudflare.com/dns/proxy-status/)
- [Cloudflare：CNAME Flattening](https://developers.cloudflare.com/dns/cname-flattening/set-up-cname-flattening/)
