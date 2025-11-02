# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 2025.11.03Changed

#### 内容清理 - 移除所有技术性说明文字

**背景**：遵循 Apple 设计理念，所有开发者配置说明移至 `docs/` 文档目录，用户界面保持极致简洁。

**清理的页面**：
1. **Publications 页面** (`app/(site)/publications/publications-client.tsx`)
   - 移除："Entries are maintained via content/publications.json"
   - 改为："Conference papers, journal articles, and patent applications."

2. **Research 页面** (`app/(site)/research/page.tsx`)
   - 移除："Update field descriptions in content/research.json"
   - 移除："Projects and collaborations ordered chronologically"
   - 简化描述，提升文字可读性（text-sm → text-base）

3. **CV 页面** (`app/(site)/cv/page.tsx`)
   - 移除："Maintain this table via content/awards.json"
   - 移除："Placeholder entries; customize as needed"
   - 移除：打印提示段落（Ctrl/Cmd+P 说明）

4. **Projects 页面** (`app/(site)/projects/page.tsx`)
   - 移除："Reorder or annotate items in content/projects.json"
   - 移除重复的技术性说明
   - 保持简洁的"Recent Project Updates"区域

5. **Blog 页面** (`app/(site)/blog/page.tsx`, `app/(site)/blog/[slug]/page.tsx`)
   - 替换 "Placeholder" → "Example"
   - 移除："Replace it with an MDX loader or hardcoded content when ready"
   - 改为用户友好的描述

6. **Contact 页面** (`app/(site)/contact/page.tsx`)
   - 移除："This form is a visual placeholder and does not send messages. Please use the email link on the left or replace this block with a real service (Formspree, Resend, etc.)"
   - 改为："For the fastest response, please reach out via the email link above. I typically respond within 1-2 business days."
   - 按钮文本："Send Message (placeholder)" → "Send Message"

**新增文档**：
- 创建 `docs/CONTENT-MANAGEMENT.md` - 完整的内容管理指南
  - 所有 JSON 配置说明
  - GitHub Action 设置步骤
  - 打印优化技巧
  - 表单实现方案
  - 故障排查指南

#### 用户体验优化（Apple 风格设计）

- **字体优化**
  - 采用 Apple 系统字体栈（SF Pro, -apple-system 等）
  - 基础字号提升到 16px，改善可读性
  - 行高调整为 1.6，字间距优化为 -0.011em（Apple 风格）
  - 移除过宽的大写字母间距，提升视觉舒适度

- **Recent Updates 横向滚动**
  - 从 3 条扩展到 7 条更新
  - 改为横向滚动展示，支持触摸滑动
  - 卡片尺寸响应式：移动端全宽，平板 50%，桌面 33%
  - 添加渐变遮罩提示更多内容
  - 卡片悬停效果优化

- **Project 页面改进**
  - 添加"Recent Project Updates"专区，显示近 7 条更新
  - 更新列表采用简洁的时间轴样式，无边框设计
  - 项目描述更加用户友好

- **内容清理**
  - 移除首页各 Section 的技术性描述
  - 删除 "Project log" 重复链接
  - 所有描述面向最终用户，技术配置移至文档

#### 项目调整
- 将 `Multi-agent-RL` 从开源项目移至学术项目首位
- 更新标签为 ["Python", "RL", "MARL"]

#### 其他优化
- Footer 日期改为动态获取当前日期
- Actions 更新数量从 5 条增加到 7 条

### Added

#### 新增项目
- **学术项目**
  - `Flocking-Formation-Control` - 基于群集算法的多无人机编队控制
  - `Formation_Control_quadrangular` - 人工势场法的四边形编队控制
  - `Formation_control_Circular` - 环形拓扑的分布式编队控制

- **开源与个人项目**
  - `wiki-SICNU` - SICNU 学生知识库和资源指南
  - `Gator-Investment-Research` - 宏观经济周期分析与投资研究
  - `Visitor-Counter-Cheater` - 网页访问量测试工具
  - `Windows-Network-Icon-Fix` - Windows 10 网络图标修复工具

#### 其他新增
- Footer 添加个人主页 GitHub 仓库链接
- GitHub Actions 自动生成详细的 commit 信息，区分更新类型

### Changed

#### GitHub Actions 优化
- **定时任务时间调整** - 从 UTC 01:00 改为 UTC 23:30（北京时间 7:30-8:30）
- **智能 commit 信息** - 自动检测更改内容并生成相应的 commit 信息：
  - "update latest activities and GitHub stars" - 同时更新
  - "update latest activities" - 仅更新动态
  - "update GitHub project stars" - 仅更新 stars

#### 项目配置
- 所有新增 GitHub 项目均配置了 `stars` 字段
- 优化了项目描述，更加清晰简洁

### Fixed

#### GitHub Actions
- **GitHub Actions 权限问题修复** - 添加 `permissions: contents: write` 到 workflow 配置
- **Token 配置简化** - 直接使用 `GITHUB_TOKEN`，移除 `GH_PAT` 回退逻辑
- 修复了 403 权限错误，现在 Actions bot 可以正常 push 更改到仓库

#### 项目 Stars 同步
- 为所有 GitHub 仓库项目添加 `metrics.stars` 字段
- 新增 stars 同步支持：
  - `Raspi-ImmortalWrt` - 添加 stars 字段
  - `Dynamic-Proxy-Pool` - 添加 stars 字段
- 确保所有 GitHub 项目都能自动同步 stars 数量

#### 移动端布局优化
- **导航栏滚动优化**
  - 添加 `scrollbar-hide` CSS 类隐藏移动端导航滚动条
  - 保留滚动功能但提供更清爽的视觉体验
  
- **项目卡片响应式优化** (`components/project-card.tsx`)
  - 移动端改为垂直堆叠布局 (`flex-col`)
  - 桌面端使用水平排列 (`sm:flex-row`)
  - 优化 metrics 和链接的显示逻辑
  
- **Section 组件头部优化** (`components/section.tsx`)
  - 标题和操作按钮在移动端改为垂直堆叠
  - 使用响应式 flex 布局 (`flex-col` → `sm:flex-row`)
  - 添加 `flex-1` 确保标题区域占据合适空间
  
- **主页 CTA 按钮优化** (`app/(site)/page.tsx`)
  - 移动端改为全宽垂直堆叠
  - 添加 `justify-center` 确保按钮文字居中
  - 提升移动端触摸目标大小
  
- **出版物过滤器优化** (`app/(site)/publications/publications-client.tsx`)
  - 过滤器标签和按钮在移动端改为垂直布局
  - 添加 `shrink-0` 防止标签被压缩
  - 过滤器按钮区域使用 flex-wrap 保持灵活换行

### Changed
- `.github/workflows/update-content.yml` - 更新权限配置
- `content/projects.json` - 添加缺失的 stars 字段
- `app/globals.css` - 添加 scrollbar-hide 样式
- `components/site-header.tsx` - 应用 scrollbar-hide 到移动端导航
- `components/project-card.tsx` - 响应式布局改进
- `components/section.tsx` - 响应式布局改进
- `app/(site)/page.tsx` - 响应式布局改进
- `app/(site)/publications/publications-client.tsx` - 响应式布局改进

### Added
- `docs/mobile-optimization.md` - 移动端优化详细文档
- `verify-fixes.sh` - 自动验证修复的脚本

---

## [0.1.0] - 2025-11-02

### Added
- 初始项目结构
- Next.js 14 App Router + Tailwind CSS
- 多页面布局（Home / Research / Publications / Projects / Experience / CV / Blog / Contact）
- 明暗主题切换功能
- 打印优化样式
- 内容管理系统基于 JSON 文件
- 组件化设计：Section、Timeline、PublicationItem、ProjectCard 等
- GitHub Actions 自动刷新功能
- 响应式桌面侧边栏
- MDX 博客支持

[Unreleased]: https://github.com/Ronchy2000/ronchy2000-research-profile/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Ronchy2000/ronchy2000-research-profile/releases/tag/v0.1.0
