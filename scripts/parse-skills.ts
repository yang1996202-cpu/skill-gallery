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

const SKILL_SCENARIOS_CN: Record<string, string[]> = {
  'browse': [
    '当你想测试刚部署的网站是否正常工作时',
    '当你需要截图向同事展示 bug 时',
    '当你想验证登录流程是否顺畅时',
    '当你需要检查页面在不同设备上的显示效果时'
  ],
  'ship': [
    '当你完成一个功能准备发布时',
    '当你想自动跑完测试、创建 PR 的流程时',
    '当你不确定当前分支是否可以安全合并时'
  ],
  'review': [
    '当你提交代码前想检查是否有安全问题',
    '当你想知道 PR 是否有潜在风险时',
    '当你想让代码更符合团队规范时'
  ],
  'qa': [
    '当你想全面测试网站功能时',
    '当你怀疑有 bug 但不确定在哪时',
    '当你想确保新功能不会破坏旧功能时'
  ],
  'qa-only': [
    '当你想让 AI 只报告 bug 不自动修复时',
    '当你想先了解问题范围再决定怎么修时'
  ],
  'design-review': [
    '当你觉得 UI 哪里不对劲但说不出时',
    '当你想确保设计符合规范时',
    '当你想检查响应式布局问题时'
  ],
  'design-html': [
    '当你需要把设计稿变成可运行的网页时',
    '当你想要高质量的前端代码时',
    '当你需要快速迭代设计时'
  ],
  'design-shotgun': [
    '当你不确定哪种设计方案最好时',
    '当你想快速看到多个设计方向时',
    '当你需要对比不同设计风格时'
  ],
  'design-consultation': [
    '当你从零开始搭建设计系统时',
    '当你想统一产品的视觉风格时',
    '当你不确定用什么颜色、字体时'
  ],
  'investigate': [
    '当你遇到 bug 但不知道原因时',
    '当错误信息很模糊时',
    '当你想系统化地排查问题时'
  ],
  'cso': [
    '当你想检查项目是否有安全隐患时',
    '当你担心密钥或密码泄露时',
    '当你需要安全合规审计时'
  ],
  'benchmark': [
    '当你觉得网站变慢了时',
    '当你想对比新旧版本性能时',
    '当你想建立性能基线时'
  ],
  'canary': [
    '当你刚部署完想确认是否正常时',
    '当你想监控线上错误时',
    '当你担心部署有副作用时'
  ],
  'health': [
    '当你想了解代码库整体健康状况时',
    '当你想查看测试、类型检查覆盖率时',
    '当你想追踪代码质量趋势时'
  ],
  'office-hours': [
    '当你不确定产品方向是否正确时',
    '当你想获得创业建议时',
    '当你想验证商业想法时'
  ],
  'plan-ceo-review': [
    '当你想从战略角度审视产品计划时',
    '当你不确定解决的是不是正确问题时',
    '当你想找 10 倍产品的机会时'
  ],
  'plan-eng-review': [
    '当你想完善技术架构时',
    '当你不确定技术方案是否可行时',
    '当你想评估项目风险时'
  ],
  'plan-design-review': [
    '当你想从设计角度审视产品计划时',
    '当你不确定用户体验是否合理时'
  ],
  'plan-devex-review': [
    '当你想优化开发者工作体验时',
    '当你想让团队开发效率更高时'
  ],
  'autoplan': [
    '当你想要全面的项目评审时',
    '当你想自动跑完所有评审流程时'
  ],
  'devex-review': [
    '当你想实际测试开发者体验时',
    '当你想从用户角度评估产品时'
  ],
  'land-and-deploy': [
    '当你想一键完成合并和部署时',
    '当你不想手动检查 CI 状态时'
  ],
  'document-release': [
    '当你部署完需要更新文档时',
    '当你想自动生成发布说明时'
  ],
  'learn': [
    '当你想回顾项目中学到的东西时',
    '当你想整理项目经验时'
  ],
  'retro': [
    '当你想做周回顾总结时',
    '当你想分析团队工作模式时'
  ],
  'codex': [
    '当你想用 OpenAI Codex 时',
    '当你需要第二意见评审代码时'
  ],
  'checkpoint': [
    '当你想保存当前工作状态时',
    '当你需要中断工作稍后再继续时',
    '当你想备份 git 状态和工作进度时'
  ],
  'freeze': [
    '当你想限制 AI 只修改特定目录时',
    '当你不想让 AI 改动其他文件时'
  ],
  'unfreeze': [
    '当你想解除目录编辑限制时'
  ],
  'careful': [
    '当你要执行可能有风险的操作时',
    '当你想避免误删文件时'
  ],
  'guard': [
    '当你想开启全面安全模式时',
    '当你处理敏感数据时'
  ],
  'setup-deploy': [
    '当你第一次配置部署环境时',
    '当你想自动化部署流程时'
  ],
  'setup-browser-cookies': [
    '当你需要登录态测试网站时',
    '当你想导入浏览器 cookies 时'
  ],
  'gstack-upgrade': [
    '当你想升级 gstack 到最新版本时',
    '当你想获取新功能时'
  ],
  'open-gstack-browser': [
    '当你想启动 AI 控制的浏览器时',
    '当你需要可视化操作浏览器时'
  ],
  'pair-agent': [
    '当你想和其他 AI 配对协作时',
    '当你需要远程 AI 帮助时'
  ]
};

const SKILL_TAGS_CN: Record<string, string[]> = {
  'browse': ['测试', '截图', '浏览器', 'QA', '验证', '部署检查', '网站测试', '无头浏览器', '交互测试', '响应式'],
  'ship': ['发布', 'PR', '部署', '合并', '测试', '版本控制', '自动化', 'CI/CD', 'GitHub', '工作流'],
  'review': ['代码审查', '安全', 'PR', 'SQL注入', 'LLM注入', '代码质量', '风险管理', '规范检查'],
  'qa': ['测试', 'QA', 'bug', '功能测试', '兼容性', '自动化测试', '质量保证', '修复'],
  'qa-only': ['测试', 'QA', '报告', 'bug检测', '只读模式', '诊断'],
  'design-review': ['设计', 'UI', 'UX', '审查', '视觉', '一致性', '间距', '可访问性', '排版'],
  'design-html': ['设计', 'HTML', 'CSS', '前端', '生产代码', '响应式', 'Pretext'],
  'design-shotgun': ['设计', '探索', '对比', '多方案', '创意', '视觉方向', '迭代'],
  'design-consultation': ['设计系统', '品牌', '规范', '颜色', '字体', '组件', '设计语言'],
  'investigate': ['调试', 'bug', '根因', '排查', '错误', '问题定位', '系统化'],
  'cso': ['安全', '审计', 'OWASP', '密钥', '漏洞', '合规', '供应链', '基础设施'],
  'benchmark': ['性能', '速度', '测试', 'Core Web Vitals', '基线', '对比', '优化', '加载时间'],
  'canary': ['监控', '线上', '错误', '部署', '金丝雀', '预警', '日志', '稳定性'],
  'health': ['代码质量', '仪表板', '类型检查', 'lint', '测试覆盖', '趋势', '报告'],
  'office-hours': ['YC', '咨询', '产品', '创业', '商业模式', '方向', '反馈'],
  'plan-ceo-review': ['规划', 'CEO', '战略', '产品', '愿景', '10x产品', '机会'],
  'plan-eng-review': ['规划', '工程', '架构', '技术', '执行', '风险', '方案'],
  'plan-design-review': ['规划', '设计', 'UX', '用户', '体验', '交互'],
  'plan-devex-review': ['规划', '开发者体验', '效率', '工具', '工作流', 'DX'],
  'autoplan': ['评审', '自动化', '管道', '全面', 'CEO', '设计', '工程', 'DX'],
  'devex-review': ['开发者体验', '审计', '测试', '用户视角', '可用性', '反馈'],
  'land-and-deploy': ['部署', '合并', 'CI', '自动化', '发布', '一键部署'],
  'document-release': ['文档', '发布', '更新', '说明', '变更日志', '同步'],
  'learn': ['学习', '记录', '经验', '知识管理', '搜索', '导出'],
  'retro': ['回顾', '总结', '周会', '提交历史', '工作模式', '团队', '效率'],
  'codex': ['Codex', 'OpenAI', '代码生成', '代码评审', '第二意见', 'AI'],
  'checkpoint': ['保存', '恢复', '状态', '中断', '继续', '备份', '快照'],
  'freeze': ['安全', '限制', '范围', '目录', '编辑控制', '边界'],
  'unfreeze': ['安全', '解除', '恢复', '无限制', '全部编辑'],
  'careful': ['安全', '警告', '危险命令', '确认', 'rm -rf', '保护'],
  'guard': ['安全', '全面', '警告', '限制', '危险操作', '防护'],
  'setup-deploy': ['配置', '部署', '初始化', 'Vercel', 'Netlify', 'AWS'],
  'setup-browser-cookies': ['cookies', '登录', '浏览器', '认证', '导入'],
  'gstack-upgrade': ['升级', '更新', '最新版本', 'gstack', '功能'],
  'open-gstack-browser': ['浏览器', 'AI控制', '可视化', 'Chrome', '启动'],
  'pair-agent': ['协作', '远程', '配对', 'AI代理', '团队', '共享']
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
  'careful': '安全护栏：警告危险命令。在检测到潜在危险命令时暂停并请求确认，防止数据丢失。',
  'guard': '全安全模式：警告 + 范围限制。综合安全模式，结合 careful 和 freeze 功能，提供全方位保护。',
  'setup-deploy': '配置部署设置。配置项目部署设置，支持 Vercel、Netlify 等多种部署平台。',
  'setup-browser-cookies': '导入浏览器 cookies。从本地 Chromium 浏览器导入 cookies 到 browse 会话，用于测试需要登录的页面。',
  'gstack-upgrade': '升级 gstack。检查并安装 gstack 的最新版本，获取新功能和安全更新。',
  'open-gstack-browser': '启动 AI 控制的浏览器。启动可视化浏览器，AI 可以实时查看和控制浏览器操作。',
  'pair-agent': '配对远程 AI 代理。与其他 AI 代理配对协作，实现分布式开发和代码审查。'
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
  // 新增：场景和标签
  scenarios: string[];
  tags: string[];
  targetUsers: string;
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
    const scenarios = SKILL_SCENARIOS_CN[name] || ['通用场景'];
    const tags = SKILL_TAGS_CN[name] || [category];
    const targetUsersMap: Record<string, string> = {
      'browse': '需要测试网站、截图验证的前端开发者和 QA',
      'ship': '频繁发布代码的开发者',
      'review': '注重代码质量和安全的开发者',
      'qa': '想确保产品质量的开发者和测试工程师',
      'qa-only': '只想了解问题不想自动修复的开发者',
      'design-review': '关注 UI 细节的开发者',
      'design-html': '需要高质量前端代码的开发者',
      'design-shotgun': '探索设计方案的产品设计师',
      'design-consultation': '搭建设计系统的产品团队',
      'investigate': '遇到复杂 bug 的开发者',
      'cso': '关注安全的开发者和技术负责人',
      'benchmark': '关注性能的开发者',
      'canary': '负责线上稳定性的开发者',
      'health': '关注代码质量的团队负责人',
      'office-hours': '创业者和产品经理',
      'plan-ceo-review': '产品负责人和创始人',
      'plan-eng-review': '技术负责人和架构师',
      'plan-design-review': '设计负责人',
      'plan-devex-review': '关注开发者体验的工程师',
      'autoplan': '需要全面项目评审的负责人',
      'devex-review': '关注用户体验的开发者',
      'land-and-deploy': '频繁部署的开发者',
      'document-release': '需要维护文档的开发者',
      'learn': '注重知识积累的开发者',
      'retro': '做周回顾的团队成员',
      'codex': '使用多种 AI 工具的开发者',
      'checkpoint': '需要保存工作状态的开发者',
      'freeze': '想控制 AI 编辑范围的开发者',
      'unfreeze': '想解除编辑限制的开发者',
      'careful': '执行危险操作前的开发者',
      'guard': '处理敏感操作时的开发者',
      'setup-deploy': '初次配置部署的开发者',
      'setup-browser-cookies': '需要登录态测试的开发者',
      'gstack-upgrade': '想使用最新功能的 gstack 用户',
      'open-gstack-browser': '需要可视化浏览器的用户',
      'pair-agent': '需要远程协作的开发者'
    };

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
      scenarios,
      tags,
      targetUsers: targetUsersMap[name] || 'gstack 用户'
    };
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err);
    return null;
  }
}

function main() {
  // Check if skills directory exists
  if (!fs.existsSync(GSTACK_SKILLS_DIR)) {
    console.log(`Skills directory not found: ${GSTACK_SKILLS_DIR}`);
    console.log('Skipping skill parsing - using existing skills.json if available');
    return;
  }

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