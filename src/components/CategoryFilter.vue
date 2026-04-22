<script setup lang="ts">
import type { SkillCategory, CategoryInfo } from '../types/skill';

defineProps<{
  categories: CategoryInfo[];
  selected: SkillCategory | null;
}>();

const emit = defineEmits<{
  select: [category: SkillCategory | null];
}>();

function handleSelect(cat: SkillCategory | null) {
  emit('select', cat);
}
</script>

<template>
  <div class="category-filter">
    <button
      class="filter-btn"
      :class="{ active: selected === null }"
      @click="handleSelect(null)"
    >
      全部 ({{ categories.reduce((sum, c) => sum + c.count, 0) }})
    </button>

    <button
      v-for="cat in categories"
      :key="cat.name"
      class="filter-btn"
      :class="{ active: selected === cat.name }"
      :style="{ borderColor: cat.color }"
      @click="handleSelect(cat.name)"
    >
      <span
        class="dot"
        :style="{ backgroundColor: cat.color }"
      ></span>
      {{ cat.displayName }} ({{ cat.count }})
    </button>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f3f4f6;
}

.filter-btn.active {
  background: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>