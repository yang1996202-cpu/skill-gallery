# GStack Skill Gallery

[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)](https://skill-gallery.pages.dev/)
[![Skills](https://img.shields.io/badge/skills-36-blue)](https://skill-gallery.pages.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

GStack 技能可视化目录。将 [garrytan/gstack](https://github.com/garrytan/gstack) 的 36 个 Claude Code Skill 以卡片形式展示，支持分类筛选、搜索和详情查看。

**在线预览**: [https://skill-gallery.pages.dev/](https://skill-gallery.pages.dev/)

---

## 功能特性

- **分类浏览** — 7 大类别色块快速筛选：规划 / 构建 / 评审 / 测试 / 发布 / 安全 / 工具
- **实时搜索** — 支持按技能名称、描述、标签、适用场景搜索
- **详情弹窗** — 点击卡片查看完整描述、适用场景、适合人群和调用方式
- **双版本视图** —
  - v2（默认）：场景 + 标签，快速判断这个 skill 是否适合你
  - v1：纯描述视图，适合快速浏览功能概述
- **自动数据生成** — 从本地 `~/.claude/skills/gstack` 解析 SKILL.md 自动生成结构化数据

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
│   └── parse-skills.ts     # 从 gstack 解析 SKILL.md 生成 skills.json
├── src/
│   ├── main.ts             # 应用入口
│   ├── App.vue             # 根组件：筛选逻辑 + 布局
│   ├── types/
│   │   └── skill.ts        # Skill 类型定义
│   ├── data/
│   │   └── skills.json     # 生成的技能数据（37 个技能）
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

## 技能分类

| 分类 | 英文 | 技能数量 | 代表 Skill |
|------|------|---------|-----------|
| 规划 | Planning | 6 | `/office-hours`, `/autoplan`, `/plan-ceo-review` |
| 构建 | Building | 5 | `/browse`, `/design-html`, `/investigate` |
| 评审 | Review | 4 | `/review`, `/cso`, `/design-review` |
| 测试 | Testing | 5 | `/qa`, `/benchmark`, `/canary`, `/health` |
| 发布 | Shipping | 3 | `/ship`, `/land-and-deploy`, `/document-release` |
| 安全 | Safety | 5 | `/guard`, `/careful`, `/freeze`, `/checkpoint` |
| 工具 | Utilities | 8 | `/learn`, `/codex`, `/retro`, `/setup-deploy` |

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

- [garrytan/gstack](https://github.com/garrytan/gstack) — Garry Tan 的 Claude Code Skill 合集（36 个技能）
- [Claude Code](https://claude.ai/code) — Anthropic 官方 CLI 工具

---

## License

MIT
