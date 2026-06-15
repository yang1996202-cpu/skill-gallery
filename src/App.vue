<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SkillCard from './components/SkillCard.vue';
import SkillDetail from './components/SkillDetail.vue';
import CategoryFilter from './components/CategoryFilter.vue';
import SearchBar from './components/SearchBar.vue';
import skillsV1 from './data/skills-v1.json';
import skillsV2 from './data/skills-v2.json';
import type { Skill, SkillCategory } from './types/skill';

// 分类方式: 1=原始流程（默认首页）, 2=Anthropic 九类
const urlParams = new URLSearchParams(window.location.search);
const viewVersion = ref(urlParams.get('v') === '2' ? 2 : 1);

const allSkills = computed<Skill[]>(() => viewVersion.value === 1 ? skillsV1 : skillsV2);
const skills = ref<Skill[]>(allSkills.value);

watch(allSkills, (newSkills) => {
  skills.value = newSkills;
  selectedCategory.value = null;
});

const searchQuery = ref('');
const selectedCategory = ref<SkillCategory | null>(null);
const selectedSkill = ref<Skill | null>(null);

function switchToV1Category() {
  viewVersion.value = 1;
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete('v');
  window.history.replaceState({}, '', newUrl.toString());
}

function switchToV2Category() {
  viewVersion.value = 2;
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('v', '2');
  window.history.replaceState({}, '', newUrl.toString());
}

// 最后更新时间（构建时生成，保持不变）
const lastUpdated = __BUILD_TIME__;

function getCategoryColor(cat: SkillCategory): string {
  const colors: Record<SkillCategory, string> = {
    // v1 流程分类颜色
    Preparation: '#84cc16',
    Thinking: '#8b5cf6',
    Planning: '#3b82f6',
    Building: '#10b981',
    Review: '#f59e0b',
    Testing: '#06b6d4',
    Shipping: '#ef4444',
    Reflection: '#64748b',
    // v2 Anthropic 九类颜色
    'Libraries & API Reference': '#6366f1',
    'Product Verification': '#10b981',
    'Data Acquisition & Analysis': '#06b6d4',
    'Business Process Automation': '#f59e0b',
    'Code Scaffolding': '#8b5cf6',
    'Code Quality & Review': '#ec4899',
    'CI/CD & Deployment': '#ef4444',
    'Operations Manual': '#14b8a6',
    'Infrastructure Operations': '#64748b'
  };
  return colors[cat] || '#6b7280';
}

function getCategoryDisplayName(cat: SkillCategory): string {
  const names: Record<string, string> = {
    // v1 流程分类
    Preparation: '准备',
    Thinking: '思考',
    Planning: '计划',
    Building: '构建',
    Review: '审查',
    Testing: '测试',
    Shipping: '发布',
    Reflection: '反思',
    // v2 Anthropic 九类分类（与来源保持一致）
    'Libraries & API Reference': '库和 API 参考',
    'Product Verification': '产品验证',
    'Data Acquisition & Analysis': '数据获取和分析',
    'Business Process Automation': '业务流程和团队自动化',
    'Code Scaffolding': '代码脚手架和模板',
    'Code Quality & Review': '代码质量和审查',
    'CI/CD & Deployment': 'CI/CD 和部署',
    'Operations Manual': '运维手册',
    'Infrastructure Operations': '基础设施运维'
  };
  return names[cat] || cat;
}

const filteredSkills = computed(() => {
  return skills.value.filter(skill => {
    const query = searchQuery.value.toLowerCase().trim();

    // 分类筛选始终生效
    if (selectedCategory.value && skill.category !== selectedCategory.value) {
      return false;
    }

    // 没有搜索词时，返回分类筛选后的结果
    if (!query) return true;

    // 搜索名称、描述
    const matchesBasic = skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.descriptionCn.toLowerCase().includes(query);

    // 搜索标签
    const matchesTags = skill.tags?.some(tag => tag.toLowerCase().includes(query)) || false;

    // 搜索场景
    const matchesScenarios = skill.scenarios?.some(scene => scene.toLowerCase().includes(query)) || false;

    return matchesBasic || matchesTags || matchesScenarios;
  });
});

const categoryStats = computed(() => {
  const uniqueCategories = [...new Set(skills.value.map(s => s.category))];
  return uniqueCategories.map(cat => ({
    name: cat,
    displayName: getCategoryDisplayName(cat),
    count: skills.value.filter(s => s.category === cat).length,
    color: getCategoryColor(cat)
  }));
});

function openDetail(skill: Skill) {
  selectedSkill.value = skill;
}

function closeDetail() {
  selectedSkill.value = null;
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>GStack 技能目录 Skill Gallery</h1>
      <p class="subtitle">
        {{ viewVersion === 1 ? '原始流程分类' : 'Anthropic 内部九类分类' }}
        · {{ skills.length }} 个技能
        · 点击查看详情
      </p>
      <SearchBar v-model="searchQuery" />
      <div class="classification-mode">
        <button
          class="mode-btn"
          :class="{ active: viewVersion === 1 }"
          @click="switchToV1Category()"
        >
          原始流程
        </button>
        <button
          class="mode-btn"
          :class="{ active: viewVersion === 2 }"
          @click="switchToV2Category()"
        >
          Anthropic 9 类
        </button>
      </div>
    </header>

    <CategoryFilter
      :categories="categoryStats"
      :selected="selectedCategory"
      @select="selectedCategory = $event"
    />

    <main class="skill-grid">
      <SkillCard
        v-for="skill in filteredSkills"
        :key="skill.name"
        :skill="skill"
        :version="viewVersion"
        @click="openDetail(skill)"
      />
    </main>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-section">
          <h4>关于项目</h4>
          <p>GStack Skill Gallery 是 <a href="https://github.com/garrytan/gstack" target="_blank" rel="noopener">garrytan/gstack</a> 技能的可视化目录。默认首页使用原始流程分类（准备 → 思考 → 计划 → 构建 → 审查 → 测试 → 发布 → 反思），覆盖 52 个技能；可切换至 Anthropic 内部九类分类法查看。支持分类筛选、搜索和详情查看。</p>
        </div>

        <div class="footer-section">
          <h4>最近更新</h4>
          <ul>
            <li>v1 增加“准备”阶段，setup/配置/升级类 skill 不再全放反思</li>
            <li>v1 流程分类：准备 → 思考 → 计划 → 构建 → 审查 → 测试 → 发布 → 反思</li>
            <li>v2 Anthropic 九类分类映射按原文定义重新校准</li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>创始人 / 来源</h4>
          <p><a href="https://github.com/garrytan" target="_blank" rel="noopener">Garry Tan</a> — <a href="https://github.com/garrytan/gstack" target="_blank" rel="noopener">gstack</a> 作者</p>
        </div>

        <div class="footer-section author-card">
          <h4>维护者</h4>
          <p class="author-name"><strong>杨京艺</strong></p>
          <p><a href="https://github.com/yang1996202-cpu" target="_blank" rel="noopener">GitHub @yang1996202-cpu</a></p>
          <p class="author-tag">AI 工具 · Agent · MCP · Skill · 知识管理</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>共 {{ filteredSkills.length }} 个技能 | 来源：~/.claude/skills/gstack</p>
        <p class="last-updated">最后更新：{{ lastUpdated }}</p>
      </div>
    </footer>

    <SkillDetail
      v-if="selectedSkill"
      :skill="selectedSkill"
      :version="viewVersion"
      @close="closeDetail"
    />
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  position: relative;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  opacity: 0.9;
  margin-bottom: 1rem;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.classification-mode {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.mode-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.mode-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #1e3a8a;
  font-weight: 500;
}

.footer {
  padding: 2rem 1rem 1rem;
  color: #374151;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
}

.footer-section h4 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #1e3a8a;
}

.footer-section p,
.footer-section li {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #4b5563;
  margin: 0.25rem 0;
}

.footer-section ul {
  padding-left: 1.2rem;
  margin: 0;
}

.footer-section a {
  color: #2563eb;
  text-decoration: none;
}

.footer-section a:hover {
  text-decoration: underline;
}

.author-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.author-name {
  font-size: 1.05rem;
}

.author-tag {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.footer-bottom {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.85rem;
  color: #6b7280;
}

.footer-bottom .last-updated {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}
</style>
