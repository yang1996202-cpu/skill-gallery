# GStack Skill Gallery

[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)](https://skill-gallery.pages.dev/)
[![Skills](https://img.shields.io/badge/skills-52-blue)](https://skill-gallery.pages.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

GStack 技能可视化目录。将 [garrytan/gstack](https://github.com/garrytan/gstack) 的 52 个 Claude Code Skill 以卡片形式展示，支持分类筛选、搜索和详情查看。

**在线预览**: [https://skill-gallery.pages.dev/](https://skill-gallery.pages.dev/)

---

## 功能特性

- **双版本视图** —
  - **原始 7 类流程分类（默认首页）**：52 个技能，按迭代冲刺顺序排列：思考 → 计划 → 构建 → 审查 → 测试 → 发布 → 反思
  - **Anthropic 九类**：52 个技能 + Anthropic 内部九类分类法，场景 + 标签，快速判断 skill 用途
- **分类方式切换** — 顶部切换“原始 7 类 / Anthropic 9 类”，不再使用“新版/旧版”按钮
- **分类浏览** — 当前分类方式对应分类色块快速筛选
  - 原始 7 类：思考 / 计划 / 构建 / 审查 / 测试 / 发布 / 反思
  - Anthropic 9 类：库和 API 参考 / 产品验证 / 数据获取和分析 / 业务流程和团队自动化 / 代码脚手架和模板 / 代码质量和审查 / CI/CD 和部署 / 运维手册 / 基础设施运维
- **实时搜索** — 支持按技能名称、描述、标签、适用场景搜索
- **详情弹窗** — 点击卡片查看完整描述、适用场景、适合人群和调用方式
- **自动数据生成** — 从本地 `~/.claude/skills/gstack` 解析 SKILL.md 自动生成 v2 结构化数据

---

## v2 分类定义（Anthropic 内部九类法）

> 来源：Anthropic 工程师 Thariq 在 X 上分享的内部实践，中文社区总结见 [腾讯云社区](https://cloud.tencent.com/developer/article/2655476)；原始微信文章 [Anthropic 分享 Skills 在 Claude Code 的最佳实践](https://mp.weixin.qq.com/s/t7_DCP3Ig7hcrK7C8sRn4A)。
> 
> 说明：Anthropic 官方公开文档目前只介绍 Skill 编写最佳实践，未发布这 9 个分类的正式 taxonomy。以下九类来自工程师分享，作为社区分类框架使用。

| 分类 | 英文 | 一句话定义 |
|---|---|---|
| 库和 API 参考 | Libraries & API Reference | 教 agent 正确使用特定库、CLI、SDK 或工具，带代码片段和 gotchas |
| 产品验证 | Product Verification | 教 agent 如何测试/验证代码或产品是否按预期工作，常配合外部工具 |
| 数据获取和分析 | Data Acquisition & Analysis | 连接数据/监控栈，提供查询路径、dashboard ID 和工作流说明 |
| 业务流程和团队自动化 | Business Process Automation | 把重复性团队工作流压缩成一条命令，常依赖其他 skill 或 MCP |
| 代码脚手架和模板 | Code Scaffolding | 用自然语言需求生成框架模板、样板代码和初始结构 |
| 代码质量和审查 | Code Quality & Review | 强制代码风格、辅助审查流程，包含确定性脚本 |
| CI/CD 和部署 | CI/CD & Deployment | 拉取、推送、部署代码，有时引用其他 skill |
| 运维手册 | Operations Manual | 拿症状 → 多工具排查 → 结构化报告 |
| 基础设施运维 | Infrastructure Operations | 日常维护，对破坏性操作设护栏 |

### v2 分类与技能映射

| 分类 | 技能数量 | 代表 Skill |
|---|---|---|
| 库和 API 参考 | 9 | `/browse`, `/codex`, `/setup-gbrain`, `/sync-gbrain` |
| 产品验证 | 7 | `/qa`, `/benchmark`, `/ios-qa`, `/design-review` |
| 数据获取和分析 | 3 | `/scrape`, `/benchmark-models`, `/health` |
| 业务流程和团队自动化 | 8 | `/spec`, `/document-generate`, `/office-hours`, `/make-pdf`, `/learn`, `/retro` |
| 代码脚手架和模板 | 4 | `/design-html`, `/design-shotgun`, `/design-consultation`, `/ios-sync` |
| 代码质量和审查 | 7 | `/review`, `/cso`, `/autoplan`, `/plan-ceo-review` |
| CI/CD 和部署 | 5 | `/ship`, `/land-and-deploy`, `/document-release`, `/setup-deploy`, `/landing-report` |
| 运维手册 | 3 | `/investigate`, `/ios-fix`, `/canary` |
| 基础设施运维 | 6 | `/guard`, `/careful`, `/freeze`, `/unfreeze`, `/ios-clean`, `/gstack-upgrade` |

---

## v1 原始分类（52 技能）

按迭代冲刺流程排列：

| 分类 | 英文 | 技能数量 | 代表 Skill |
|---|---|---|---|
| 思考 | Thinking | 2 | `/office-hours`, `/plan-ceo-review` |
| 计划 | Planning | 5 | `/spec`, `/autoplan`, `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review` |
| 构建 | Building | 15 | `/browse`, `/codex`, `/design-html`, `/investigate`, `/scrape`, `/skillify`, `/ios-sync` |
| 审查 | Review | 5 | `/review`, `/cso`, `/design-review`, `/devex-review`, `/ios-design-review` |
| 测试 | Testing | 7 | `/qa`, `/benchmark`, `/canary`, `/health`, `/ios-qa` |
| 发布 | Shipping | 6 | `/ship`, `/land-and-deploy`, `/document-release`, `/landing-report`, `/setup-deploy`, `/ios-clean` |
| 反思 | Reflection | 12 | `/retro`, `/learn`, `/context-save`, `/context-restore`, `/setup-gbrain`, `/sync-gbrain`, `/careful`, `/freeze`, `/guard`, `/unfreeze` |

**注意**：v1 现在与 v2 一样覆盖当前 52 个技能。分类顺序按迭代冲刺流程排列：思考 → 计划 → 构建 → 审查 → 测试 → 发布 → 反思。安全类技能（`careful`、`freeze`、`guard`、`unfreeze`）作为跨流程护栏归入“反思”。

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
│   │   ├── skills-v1.json  # v1 数据（52 技能 / 原始 7 类）
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

## 更新日志

### 2026-06-15

- v1 原始分类改为按迭代冲刺流程排列：思考 → 计划 → 构建 → 审查 → 测试 → 发布 → 反思。
- 安全类技能作为跨流程护栏归入“反思”，工具类技能按使用阶段分散到各流程分类。
- 默认首页改为原始 7 类流程分类（52 技能）。
- 移除“新版/旧版”切换按钮，改为顶部分类方式选择：“原始 7 类 / Anthropic 9 类”。
- 按 Anthropic 原文定义重新校准 v2 九类映射。

### 2026-06-14

- 分类名称全面中文化：v1 / v2 的筛选栏、卡片、详情弹窗均显示中文分类名。
- 保留 v1 原始 7 类分类视图（36 技能），v2 默认展示 Anthropic 内部九类分类法（52 技能）。
- 补充 v2 Anthropic 九类分类的卡片颜色映射。

### 2026-06-12

- 上线双版本视图：v2（52 技能 + Anthropic 九类法）与 v1（36 技能 + 原始 7 类）。
- 支持分类筛选、实时搜索、详情弹窗。
- 数据生成脚本支持从本地 `~/.claude/skills/gstack` 解析 SKILL.md。

---

## 项目与维护者

- **项目**：GStack Skill Gallery —— [garrytan/gstack](https://github.com/garrytan/gstack) 的可视化技能目录。
- **创始人 / Skill 来源**：[Garry Tan](https://github.com/garrytan) —— [gstack](https://github.com/garrytan/gstack) 作者。
- **作者 / 维护者**：[杨京艺](https://github.com/yang1996202-cpu)（@yang1996202-cpu）
- **在线预览**：[https://skill-gallery.pages.dev/](https://skill-gallery.pages.dev/)

> 杨京艺：前 SaaS 销售 / 解决方案顾问，现全职探索 AI 工具、Agent、MCP、Skill、知识管理、内容与商业化。欢迎通过 GitHub 交流。

---

## License

MIT
