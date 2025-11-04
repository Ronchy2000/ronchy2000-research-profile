# 工作流优化说明

## 优化内容

### 1. ✅ 确保每天都有提交
- 添加了 **每日心跳机制**（`.github/heartbeat/.last-sync`）
- **仅在定时触发时**生成心跳文件（手动触发不会产生日更提交）
- 心跳文件放在 `.github/heartbeat/` 目录，不会被网站构建系统读取
- 即使没有其他变化，每天也会生成新的时间戳并提交
- 每天 23:30 UTC（北京时间 7:30 AM）自动执行
- 提交信息根据变更内容智能生成

### 2. 🤖 Bot 提交不显示在 Recent Updates
- Bot 的自动提交**只在 GitHub 可见**，不会出现在网站首页
- `scripts/update-recent-updates.mjs` 会自动过滤以下提交：
  - 来自 `github-actions[bot]` 的提交
  - 包含关键词的提交：`daily sync`、`update latest activities`、`update github stars` 等
  - 这些提交仍会正常推送到 GitHub，只是不在网站上展示

### 3. 📊 增强的调试信息
- 添加了 "Show working tree changes" 步骤
- 可以在 GitHub Actions 日志中清楚看到：
  - 哪些文件发生了变化
  - 变更的具体内容
  - 为什么触发或不触发提交

4. **🔧 更健壮的提交逻辑**
- 使用 `git add -A` 捕获所有变更
- 使用 `git diff --staged --quiet` 准确判断
- 提交前先 `git pull --rebase --autostash` 同步远端，降低冲突概率
- 推送失败时自动重试一次
- 智能生成不同场景的提交信息
- `fetch-depth: 0` 获取完整历史

### 5. 🔒 并发控制
- 使用 `concurrency` 配置防止多个工作流同时运行
- `cancel-in-progress: false` 确保正在运行的任务不会被取消

## 工作流执行顺序

1. **检出代码** - 获取完整 Git 历史
2. **设置 Node.js** - 版本 20
3. **安装依赖**
4. **刷新 Recent Updates** - 从 GitHub commits 获取最新活动（自动过滤 bot）
5. **刷新项目星标** - 更新 GitHub 项目的 star 数量
6. **生成每日心跳** - 仅定时触发时创建带时间戳的 `.github/heartbeat/.last-sync` 文件
7. **显示变更** - 输出调试信息
8. **提交并推送** - 如果有变更则提交（包含冲突处理和重试机制）

## 手动触发

可以在 GitHub Actions 页面手动触发工作流：
1. 进入仓库的 **Actions** 标签
2. 选择 **Refresh Recent Updates** 工作流
3. 点击 **Run workflow** 按钮

**注意**：手动触发时**不会**生成心跳文件，只会更新实际的内容数据。

## 过滤规则

Bot 提交不会显示在 Recent Updates 的原因：

### 被过滤的提交者
- `github-actions[bot]`
- `dependabot[bot]`
- `router auto backup`

### 被过滤的邮箱
- `41898282+github-actions[bot]@users.noreply.github.com`
- `router@local`

### 被过滤的提交信息关键词
- `auto update`
- `auto backup on`
- `update latest activities`
- `update github project stars`
- `update github stars`
- `refresh content data`
- `daily sync`

### 被过滤的账户类型
- `bot`

## 环境变量

工作流使用以下环境变量：
- `GITHUB_TOKEN` / `GH_PAT` - GitHub 访问令牌
- `GITHUB_REPOSITORY` - 仓库名称（自动设置）
- `UPDATES_LIMIT` - Recent Updates 显示的条目数（默认 7）

## 文件说明

- `.github/workflows/update-content.yml` - 主工作流配置
- `.github/heartbeat/.last-sync` - 每日心跳文件（自动生成，仅定时触发）
- `scripts/update-recent-updates.mjs` - 更新最近活动脚本
- `scripts/update-project-stars.mjs` - 更新项目星标脚本
- `content/updates.json` - 最近活动数据
- `content/projects.json` - 项目数据（包含星标）

**为什么心跳文件在 `.github/heartbeat/`？**
- 避免被网站构建系统读取和处理
- `.github` 目录不会被 Next.js 或静态站点生成器包含
- 保持 `content/` 目录的纯净性

## 预期行为

### 定时触发（每天 23:30 UTC）
- ✅ 更新 updates.json 和 projects.json
- ✅ 生成心跳文件 `.github/heartbeat/.last-sync`
- ✅ 提交到 GitHub（即使没有实质性变化也会有心跳提交）

### 手动触发（workflow_dispatch）
- ✅ 更新 updates.json 和 projects.json
- ❌ **不会**生成心跳文件
- ✅ 仅在有实际变更时才提交

### 有实质性内容变化时
- ✅ 提交到 GitHub
- ✅ 在网站 Recent Updates 中显示（如果是非 bot 的提交）

### 没有实质性内容变化时
- ✅ 仍然提交心跳文件到 GitHub
- ✅ 提交信息：`chore: daily sync`
- ❌ 不会在网站 Recent Updates 中显示

### Bot 的自动更新
- ✅ 提交到 GitHub（可在 commit 历史中看到）
- ❌ 不会在网站 Recent Updates 中显示

## 故障处理

### 推送冲突
工作流包含自动重试机制：
1. 首次推送失败时，会自动 `git pull --rebase --autostash`
2. 然后重新推送
3. 这可以处理大多数并发修改导致的冲突

### 并发控制
- 使用 `concurrency.group` 确保同一时间只有一个实例运行
- 如果有工作流正在运行，新触发的会等待（而不是取消）
- 防止数据竞争和提交冲突
