# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

## [0.1.0] - 2025-02-20

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
