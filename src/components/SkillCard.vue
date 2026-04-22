<script setup lang="ts">
import type { Skill } from '../types/skill';

defineProps<{ skill: Skill }>();

function getTierColor(tier: number): string {
  const colors = {
    1: '#3b82f6', // blue - highest priority
    2: '#10b981', // green
    3: '#f59e0b', // yellow
    4: '#6b7280', // gray - lowest priority
  };
  return colors[tier as keyof typeof colors] || '#6b7280';
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Planning: '#3b82f6',
    Building: '#10b981',
    Review: '#8b5cf6',
    Testing: '#f59e0b',
    Shipping: '#ef4444',
    Safety: '#dc2626',
    Utilities: '#6b7280'
  };
  return colors[category] || '#6b7280';
}
</script>

<template>
  <div
    class="skill-card"
    :style="{ borderColor: getTierColor(skill.preambleTier) }"
  >
    <div class="tier-badge" :style="{ backgroundColor: getTierColor(skill.preambleTier) }">
      T{{ skill.preambleTier }}
    </div>

    <h3 class="skill-name">
      <code>{{ skill.slashCommand }}</code>
    </h3>

    <p class="skill-description-cn">{{ skill.shortDescriptionCn }}</p>
    <p class="skill-description-en">{{ skill.shortDescription }}</p>

    <div class="tags-list" v-if="skill.tags?.length">
      <span v-for="tag in skill.tags.slice(0, 3)" :key="tag" class="tag-badge">
        {{ tag }}
      </span>
    </div>

    <div class="skill-meta">
      <span class="version">v{{ skill.version }}</span>
      <span
        class="category-badge"
        :style="{ backgroundColor: getCategoryColor(skill.category), color: 'white' }"
      >
        {{ skill.categoryCn }}
      </span>
    </div>

    <div class="tools-preview">
      <span class="tool-count">{{ skill.allowedTools.length }} 工具</span>
    </div>
  </div>
</template>

<style scoped>
.skill-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 2px solid;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.tier-badge {
  position: absolute;
  top: -8px;
  right: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.skill-name {
  margin: 0.5rem 0;
}

.skill-name code {
  font-size: 1.25rem;
  color: #1e3a8a;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.skill-description-cn {
  color: #1f2937;
  margin: 0.5rem 0;
  font-size: 0.95rem;
  line-height: 1.4;
  font-weight: 500;
}

.skill-description-en {
  color: #6b7280;
  margin: 0.25rem 0;
  font-size: 0.8rem;
  line-height: 1.3;
}

.skill-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
}

.version {
  color: #9ca3af;
  font-size: 0.8rem;
}

.category-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.tools-preview {
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.8rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.tag-badge {
  padding: 2px 6px;
  background: #e5e7eb;
  border-radius: 4px;
  font-size: 0.7rem;
  color: #4b5563;
}
</style>