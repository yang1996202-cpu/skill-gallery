# GStack Skill Gallery

[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)](https://skill-gallery.pages.dev/)
[![Skills](https://img.shields.io/badge/skills-52-blue)](https://skill-gallery.pages.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

GStack 技能可视化目录。将 [garrytan/gstack](https://github.com/garrytan/gstack) 的 52 个 Claude Code Skill 以卡片形式展示，支持分类筛选、搜索和详情查看。

**在线预览**: [https://skill-gallery.pages.dev/](https://skill-gallery.pages.dev/)

---

## 功能特性

- **双版本视图** —
  - **v2（默认）**：52 个技能 + Anthropic 内部九类分类法，场景 + 标签，快速判断 skill 用途
  - **v1（旧版）**：36 个技能 + 原始 7 类分类，纯描述视图，保留历史展示
- **分类浏览** — 版本对应分类色块快速筛选
  - v2：库和 API 参考 / 产品验证 / 数据获取与分析 / 业务流程自动化 / 代码脚手架 / 代码质量与审查 / CI/CD 与部署 / 运维手册 / 基础设施操作
  - v1：规划 / 构建 / 评审 / 测试 / 发布 / 安全 / 工具
- **实时搜索** — 支持按技能名称、描述、标签、适用场景搜索
- **详情弹窗** — 点击卡片查看完整描述、适用场景、适合人群和调用方式
- **自动数据生成** — 从本地 `~/.claude/skills/gstack` 解析 SKILL.md 自动生成 v2 结构化数据

---

## v2 分类定义（Anthropic 内部九类法）

> 来源：[Anthropic 分享 Skills 在 Claude Code 的最佳实践](https://mp.weixin.qq.com/s/t7_DCP3Ig7hcrK7C8sRn4A)

| 分类 | 英文 | 一句话定义 |
|---|---|---|
| 库和 API 参考 | Libraries & API Reference | 教 agent 正确使用特定库、CLI、SDK 或工具 |
| 产品验证 | Product Verification | 教 agent 如何测试/验证代码或产品是否按预期工作 |
| 数据获取与分析 | Data Acquisition & Analysis | 连接数据源，提供查询、抓取、分析路径 |
| 业务流程自动化 | Business Process Automation | 把重复性工作流压缩成一条命令 |
| 代码脚手架 | Code Scaffolding | 生成框架模板、样板代码和初始结构 |
| 代码质量与审查 | Code Quality & Review | 强制代码风格、审查流程和架构标准 |
| CI/CD 与部署 | CI/CD & Deployment | 推代码、部署、监控 PR/发布 |
| 运维手册 | Operations Manual | 拿症状 → 多工具排查 → 结构化报告 |
| 基础设施操作 | Infrastructure Operations | 日常维护，对破坏性操作设护栏 |

### v2 分类与技能映射

| 分类 | 技能数量 | 代表 Skill |
|---|---|---|
| 库和 API 参考 | 9 | `/browse`, `/codex`, `/setup-gbrain`, `/scrape` |
| 产品验证 | 7 | `/qa`, `/benchmark`, `/ios-qa`, `/design-review` |
| 数据获取与分析 | 5 | `/scrape`, `/benchmark-models`, `/landing-report`, `/learn` |
| 业务流程自动化 | 6 | `/spec`, `/document-generate`, `/office-hours`, `/make-pdf` |
| 代码脚手架 | 4 | `/design-html`, `/design-shotgun`, `/design-consultation`, `/ios-sync` |
| 代码质量与审查 | 7 | `/review`, `/cso`, `/autoplan`, `/plan-ceo-review` |
| CI/CD 与部署 | 4 | `/ship`, `/land-and-deploy`, `/document-release`, `/canary` |
| 运维手册 | 3 | `/investigate`, `/ios-fix`, `/health` |
| 基础设施操作 | 7 | `/guard`, `/careful`, `/freeze`, `/setup-deploy`, `/gstack-upgrade` |

---

## v1 原始分类（36 技能）

| 分类 | 英文 | 技能数量 | 代表 Skill |
|---|---|---|---|
| 规划 | Planning | 6 | `/office-hours`, `/autoplan`, `/plan-ceo-review` |
| 构建 | Building | 5 | `/browse`, `/design-html`, `/investigate` |
| 评审 | Review | 4 | `/review`, `/cso`, `/design-review` |
| 测试 | Testing | 5 | `/qa`, `/benchmark`, `/canary`, `/health` |
| 发布 | Shipping | 3 | `/ship`, `/land-and-deploy`, `/document-release` |
| 安全 | Safety | 4 | `/guard`, `/careful`, `/freeze`, `/unfreeze` |
| 工具 | Utilities | 9 | `/learn`, `/codex`, `/retro`, `/setup-deploy` |

**注意**：v1 为历史快照，保留 36 个技能的原始 7 类展示，不再随 gstack 升级而更新。当前 gstack 已移除 `checkpoint`；`/connect-chrome` 是 `/open-gstack-browser` 的符号链接。

---

## 技术栈

- **Vue 3** + **TypeScript** + **Vite**
- 无额外 UI 框架，纯 CSS 实现响应式卡片网格
- 构建时注入时间戳，显示数据最后更新时间

---

## 本地开发

### 前置依赖

- Node.js 18+
- 本地已安装 [gstack](https://github.com/garrytan/gstack)（数据生成脚本会读取 `~/.claude/skills/gstack`）

### 安装与启动

```bash
git clone https://github.com/yang1996202-cpu/skill-gallery.git
cd skill-gallery
npm install

# 生成技能数据（解析 gstack SKILL.md）
npm run generate-data

# 启动开发服务器
npm run dev
```

### 构建

```bash
npm run build
```

输出目录：`dist/`，可直接部署到任意静态托管平台。

---

## 项目结构

```
skill-gallery/
├── index.html              # 入口 HTML
├── package.json
├── vite.config.ts          # Vite 配置
├── tsconfig.json
├── scripts/
│   └── parse-skills.ts     # 从 gstack 解析 SKILL.md 生成 skills-v2.json
├── src/
│   ├── main.ts             # 应用入口
│   ├── App.vue             # 根组件：双版本切换 + 筛选逻辑 + 布局
│   ├── types/
│   │   └── skill.ts        # Skill 类型定义（兼容 v1/v2 分类）
│   ├── data/
│   │   ├── skills-v1.json  # v1 历史数据（36 技能 / 7 类）
│   │   └── skills-v2.json  # v2 数据（52 技能 / Anthropic 九类）
│   └── components/
│       ├── SkillCard.vue   # 技能卡片（支持 v1/v2 两种视图）
│       ├── SkillDetail.vue # 详情弹窗（描述 / 场景 / 标签 / 复制命令）
│       ├── CategoryFilter.vue  # 分类筛选栏
│       └── SearchBar.vue   # 搜索框
└── styles/                 # 全局样式
```

---

## 数据来源

`scripts/parse-skills.ts` 读取本地 `~/.claude/skills/gstack` 目录下每个 skill 的 `SKILL.md` 文件，提取以下字段：

| 字段 | 来源 |
|------|------|
| 名称 / 命令 | SKILL.md 文件名与 frontmatter |
| 版本 | frontmatter `version` |
| 描述 | frontmatter `description` / `descriptionCn` |
| 分类 | 硬编码映射表（见 `CATEGORY_MAP`） |
| 场景 | 硬编码中文场景（`SKILL_SCENARIOS_CN`） |
| 标签 | 硬编码中文标签（`SKILL_TAGS_CN`） |
| 适合人群 | 硬编码（`SKILL_TARGET_USERS_CN`） |

**注意**：场景、标签、适合人群目前为硬编码补充，非自动从 SKILL.md 提取。新增 skill 时需要同步更新 `parse-skills.ts` 中的映射表。

---

## 部署

本项目使用 **Cloudflare Pages** 部署，每次 push 到 main 分支自动构建发布。

也可手动部署到任意支持静态托管的平台：

- Vercel: `vercel --prod`
- Netlify: `netlify deploy --prod --dir=dist`
- GitHub Pages: 使用 `gh-pages` 分支或 Actions

---

## 截图

![GStack Skill Gallery](https://skill-gallery.pages.dev/)

---

## 相关项目

- [garrytan/gstack](https://github.com/garrytan/gstack) — Garry Tan 的 Claude Code Skill 合集（52 个技能）
- [Claude Code](https://claude.ai/code) — Anthropic 官方 CLI 工具

---

## License

MIT
