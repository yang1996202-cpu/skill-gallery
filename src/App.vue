<script setup lang="ts">
import { ref, computed } from 'vue';
import SkillCard from './components/SkillCard.vue';
import SkillDetail from './components/SkillDetail.vue';
import CategoryFilter from './components/CategoryFilter.vue';
import SearchBar from './components/SearchBar.vue';
import skillsData from './data/skills.json';
import type { Skill, SkillCategory } from './types/skill';

const skills = ref<Skill[]>(skillsData);
const searchQuery = ref('');
const selectedCategory = ref<SkillCategory | null>(null);
const selectedSkill = ref<Skill | null>(null);

// URL参数版本控制: v1=纯描述, v2=场景+标签(默认)
const urlParams = new URLSearchParams(window.location.search);
const viewVersion = ref(urlParams.get('v') === '1' ? 1 : 2);

function toggleVersion() {
  viewVersion.value = viewVersion.value === 1 ? 2 : 1;
  // 更新URL参数但不刷新页面
  const newUrl = new URL(window.location.href);
  if (viewVersion.value === 1) {
    newUrl.searchParams.set('v', '1');
  } else {
    newUrl.searchParams.delete('v');
  }
  window.history.replaceState({}, '', newUrl.toString());
}

// 最后更新时间（使用构建时间）
const lastUpdated = computed(() => {
  const now = new Date();
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const categories: SkillCategory[] = ['Planning', 'Building', 'Review', 'Testing', 'Shipping', 'Safety', 'Utilities'];

const categoryNames: Record<SkillCategory, string> = {
  Planning: '规划 Planning',
  Building: '构建 Building',
  Review: '评审 Review',
  Testing: '测试 Testing',
  Shipping: '发布 Shipping',
  Safety: '安全 Safety',
  Utilities: '工具 Utilities'
};

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
  return categories.map(cat => ({
    name: cat,
    displayName: categoryNames[cat],
    count: skills.value.filter(s => s.category === cat).length,
    color: getCategoryColor(cat)
  }));
});

function getCategoryColor(cat: SkillCategory): string {
  const colors: Record<SkillCategory, string> = {
    Planning: '#3b82f6',
    Building: '#10b981',
    Review: '#8b5cf6',
    Testing: '#f59e0b',
    Shipping: '#ef4444',
    Safety: '#dc2626',
    Utilities: '#6b7280'
  };
  return colors[cat];
}

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
      <p class="subtitle">36 个技能 · 点击查看详情 · 学习如何使用</p>
      <SearchBar v-model="searchQuery" />
      <div class="version-toggle">
        <button
          v-if="viewVersion === 2"
          class="toggle-btn old-version-link"
          @click="viewVersion = 1; toggleVersion()"
        >
          切换旧版
        </button>
        <button
          v-else
          class="toggle-btn old-version-link"
          @click="viewVersion = 2; toggleVersion()"
        >
          返回新版
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
      <p>共 {{ filteredSkills.length }} 个技能 | 来源：~/.claude/skills/gstack</p>
      <p class="last-updated">最后更新：{{ lastUpdated }}</p>
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

.version-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.toggle-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.old-version-link {
  text-decoration: underline;
  opacity: 0.8;
}

.footer {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.footer .last-updated {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}
</style>