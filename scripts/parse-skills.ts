import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const GSTACK_SKILLS_DIR = path.join(process.env.HOME || '', '.claude/skills/gstack');

type SkillCategory =
  | 'Planning'
  | 'Building'
  | 'Review'
  | 'Testing'
  | 'Shipping'
  | 'Safety'
  | 'Utilities';

const CATEGORY_MAP: Record<string, SkillCategory> = {
  'office-hours': 'Planning',
  'autoplan': 'Planning',
  'plan-ceo-review': 'Planning',
  'plan-eng-review': 'Planning',
  'plan-design-review': 'Planning',
  'plan-devex-review': 'Planning',

  'browse': 'Building',
  'design-html': 'Building',
  'design-shotgun': 'Building',
  'design-consultation': 'Building',
  'investigate': 'Building',

  'review': 'Review',
  'devex-review': 'Review',
  'design-review': 'Review',
  'cso': 'Review',

  'qa': 'Testing',
  'qa-only': 'Testing',
  'benchmark': 'Testing',
  'canary': 'Testing',
  'health': 'Testing',

  'ship': 'Shipping',
  'land-and-deploy': 'Shipping',
  'document-release': 'Shipping',

  'guard': 'Safety',
  'careful': 'Safety',
  'freeze': 'Safety',
  'unfreeze': 'Safety',
  'checkpoint': 'Safety',

  'learn': 'Utilities',
  'retro': 'Utilities',
  'codex': 'Utilities',
  'gstack-upgrade': 'Utilities',
  'setup-browser-cookies': 'Utilities',
  'setup-deploy': 'Utilities',
  'open-gstack-browser': 'Utilities',
  'pair-agent': 'Utilities',
};

const CATEGORY_NAMES_CN: Record<SkillCategory, string> = {
  Planning: '规划',
  Building: '构建',
  Review: '评审',
  Testing: '测试',
  Shipping: '发布',
  Safety: '安全',
  Utilities: '工具',
};

const SKILL_DESC_CN: Record<string, string> = {
  'browse': '无头浏览器浏览，用于测试网站和截图。支持导航任意 URL、与元素交互、验证页面状态、对比操作前后的差异、生成带注释的截图、检查响应式布局、测试表单和上传、处理对话框、断言元素状态。每个命令约 100ms。用于测试功能、验证部署、体验用户流程或提交带证据的 bug 报告。',
  'ship': '发布流程：检测分支、运行测试、创建 PR。自动化整个发布流程，包括合并基础分支、运行测试套件、审查代码差异、更新版本号、创建 PR 并部署。',
  'review': 'PR 预发布评审，检查代码安全和结构问题。分析基础分支的 diff，检查 SQL 注入、LLM 提示注入等安全问题，验证代码结构合理性。',
  'qa': '系统化 QA 测试并修复发现的 bug。运行全面的 QA 测试，包括功能测试、边界情况检查、跨浏览器兼容性验证，并自动修复发现的问题。',
  'qa-only': 'QA 测试报告模式，只报告不修复。运行完整的 QA 测试流程，生成详细的测试报告，列出所有发现的问题但不自动修复。',
  'design-review': '设计评审：检查视觉一致性、间距问题。以设计师的视角审查 UI，发现视觉不一致、间距问题、层级问题和可访问性缺陷。',
  'design-html': '生成生产级 HTML/CSS 设计。生成符合生产标准的高质量 HTML/CSS 代码，遵循 Pretext 设计系统规范。',
  'design-shotgun': '生成多个设计变体并对比。快速生成多个 AI 设计变体，打开对比面板供用户选择，加速设计迭代过程。',
  'design-consultation': '设计咨询：创建设计系统。理解你的产品，研究行业最佳实践，提出适合你的设计系统方案。',
  'investigate': '系统化调试，根因分析。四阶段调试流程：调查、假设、验证、修复，深入定位问题根本原因。',
  'cso': '安全审计：基础设施、供应链、OWASP。首席安全官模式，优先进行基础设施安全审计，包括密钥考古、依赖项漏洞扫描、OWASP 合规检查。',
  'benchmark': '性能回归检测。使用 browse 守护进程建立页面加载时间、Core Web Vitals 和资源大小的基线。在每个 PR 上对比前后性能。追踪性能趋势。',
  'canary': '发布后监控：检查错误和性能。金丝雀监控模式，监控线上应用的 console 错误、网络请求失败、性能指标异常。',
  'health': '代码质量仪表板。封装现有项目工具（类型检查器、linter、测试运行器），生成代码健康度评分和趋势报告。',
  'office-hours': 'YC Office Hours 模式咨询。两种模式：创业模式（六个强制性问题暴露盲点）、产品模式（深度产品评审）。',
  'plan-ceo-review': 'CEO 模式计划评审。CEO/创始人视角的计划评审，重新思考问题定义，寻找 10 星级产品机会，制定产品战略。',
  'plan-eng-review': '工程经理模式计划评审。工程经理视角的计划评审，锁定执行计划——架构设计、测试策略、部署方案。',
  'plan-design-review': '设计师模式计划评审。设计师视角的计划评审，交互式评审，像 CEO 和工程评审一样深入。',
  'plan-devex-review': '开发者体验计划评审。交互式开发者体验计划评审，探索开发者角色，优化开发者工作流程。',
  'autoplan': '自动评审管道。读取完整的 CEO、设计、工程和 DX 评审技能，自动生成全面的评审计划。',
  'devex-review': '开发者体验审计。使用 browse 工具实际测试开发者体验，从用户角度评估产品可用性。',
  'land-and-deploy': '合并 PR 并部署。完整的合并和部署工作流：合并 PR、等待 CI、部署到生产环境。',
  'document-release': '发布后文档更新。发布后文档更新，读取所有项目文档，交叉引用变更，更新相关文档。',
  'learn': '管理项目学习记录。查看、搜索、清理和导出 gstack 积累的项目学习记录。',
  'retro': '周回顾：分析提交历史和工作模式。工程周回顾，分析提交历史、工作模式、代码变更趋势。',
  'codex': 'OpenAI Codex CLI 包装器。三种模式：代码评审（通过 API 的独立 diff 评审）、代码生成、代码解释。',
  'checkpoint': '保存和恢复工作状态。保存和恢复工作状态检查点，捕获 git 状态、已做决策、当前上下文。',
  'freeze': '限制文件编辑范围。限制会话期间的文件编辑范围，阻止对指定目录外的 Edit 和 Write 操作。',
  'unfreeze': '解除编辑范围限制。清除 /freeze 设置的冻结边界，允许编辑所有目录。',
  'careful': '安全护栏：警告危险命令。破坏性命令的安全护栏，在执行 rm -rf、DROP TABLE 等操作前警告。',
  'guard': '全安全模式：警告 + 范围限制。完整安全模式：破坏性命令警告 + 目录范围限制编辑。',
  'setup-deploy': '配置部署设置。为 /land-and-deploy 配置部署设置，检测你的部署目标（Vercel、Netlify、AWS 等）。',
  'setup-browser-cookies': '导入浏览器 cookies。从你的真实 Chromium 浏览器导入 cookies 到无头浏览会话。',
  'gstack-upgrade': '升级 gstack。将 gstack 升级到最新版本，检测全局安装 vs 本地安装，执行相应升级流程。',
  'open-gstack-browser': '启动 AI 控制的浏览器。启动 GStack Browser——内置侧边栏扩展的 AI 控制 Chromium。',
  'pair-agent': '配对远程 AI 代理。将一个远程 AI 代理与你的浏览器配对，一个命令生成设置密钥并启动配对流程。'
};

interface Skill {
  name: string;
  slashCommand: string;
  version: string;
  preambleTier: number;
  description: string;
  shortDescription: string;
  descriptionCn: string;
  shortDescriptionCn: string;
  allowedTools: string[];
  category: SkillCategory;
  categoryCn: string;
  sourcePath: string;
}

function parseSkillMd(filePath: string): Skill | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract YAML frontmatter
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) {
      console.warn(`No YAML frontmatter in ${filePath}`);
      return null;
    }

    const yaml = YAML.parse(yamlMatch[1]);

    const name = yaml.name || path.basename(path.dirname(filePath));
    const description = yaml.description || '';
    const shortDescription = description.split('\n')[0].trim();
    const category = CATEGORY_MAP[name] || 'Utilities';
    const descriptionCn = SKILL_DESC_CN[name] || shortDescription;

    return {
      name,
      slashCommand: `/${name}`,
      version: yaml.version || '0.0.0',
      preambleTier: yaml['preamble-tier'] || 4,
      description: description.trim(),
      shortDescription: shortDescription.length > 80
        ? shortDescription.slice(0, 80) + '...'
        : shortDescription,
      descriptionCn,
      shortDescriptionCn: descriptionCn.length > 40
        ? descriptionCn.slice(0, 40) + '...'
        : descriptionCn,
      allowedTools: yaml['allowed-tools'] || [],
      category,
      categoryCn: CATEGORY_NAMES_CN[category],
      sourcePath: filePath,
    };
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err);
    return null;
  }
}

function main() {
  const skills: Skill[] = [];

  // Find all skill directories
  const dirs = fs.readdirSync(GSTACK_SKILLS_DIR, { withFileTypes: true })
    .filter((d: fs.Dirent) => d.isDirectory() && !d.name.startsWith('.') && !d.name.startsWith('_'))
    .map((d: fs.Dirent) => d.name);

  for (const dir of dirs) {
    const skillPath = path.join(GSTACK_SKILLS_DIR, dir, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      const skill = parseSkillMd(skillPath);
      if (skill) {
        skills.push(skill);
      }
    }
  }

  // Sort by preamble-tier (lower = higher priority)
  skills.sort((a, b) => a.preambleTier - b.preambleTier);

  const outputPath = path.join(import.meta.dirname, '../src/data/skills.json');
  fs.writeFileSync(outputPath, JSON.stringify(skills, null, 2));

  console.log(`Parsed ${skills.length} skills to ${outputPath}`);
}

main();