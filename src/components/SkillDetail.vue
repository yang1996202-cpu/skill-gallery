<script setup lang="ts">
import type { Skill } from '../types/skill';

defineProps<{ skill: Skill }>();
const emit = defineEmits<{ close: [] }>();

function copyCommand(cmd: string) {
  navigator.clipboard.writeText(cmd);
}

function getTierColor(tier: number): string {
  const colors = {
    1: '#3b82f6',
    2: '#10b981',
    3: '#f59e0b',
    4: '#6b7280',
  };
  return colors[tier as keyof typeof colors] || '#6b7280';
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal">
      <header class="modal-header">
        <div class="tier-badge" :style="{ backgroundColor: getTierColor(skill.preambleTier) }">
          Tier {{ skill.preambleTier }}
        </div>
        <h2>
          <code class="command">{{ skill.slashCommand }}</code>
        </h2>
        <span class="version">v{{ skill.version }}</span>
        <button class="close-btn" @click="emit('close')">✕</button>
      </header>

      <section class="section">
        <h3>中文描述</h3>
        <p class="desc-cn">{{ skill.descriptionCn }}</p>
      </section>

      <section class="section">
        <h3>English Description</h3>
        <p class="desc-en">{{ skill.description }}</p>
      </section>

      <section class="section invoke-section">
        <h3>如何调用</h3>
        <div class="invoke-box">
          <code class="invoke-command">{{ skill.slashCommand }}</code>
          <button class="copy-btn" @click="copyCommand(skill.slashCommand)">
            复制
          </button>
        </div>
        <p class="hint">在 Claude Code 中输入此斜杠命令即可激活技能。</p>
      </section>

      <section class="section">
        <h3>可用工具</h3>
        <div class="tools-list">
          <span v-for="tool in skill.allowedTools" :key="tool" class="tool-badge">
            {{ tool }}
          </span>
        </div>
      </section>

      <section class="section">
        <h3>分类</h3>
        <span class="category-tag">{{ skill.categoryCn }} / {{ skill.category }}</span>
      </section>

      <section class="section">
        <h3>来源</h3>
        <code class="source-path">{{ skill.sourcePath }}</code>
      </section>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tier-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: white;
}

.command {
  font-size: 1.5rem;
  color: #1e3a8a;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 6px;
}

.version {
  color: #9ca3af;
  font-size: 0.9rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  margin-left: auto;
}

.section {
  margin: 1rem 0;
}

.section h3 {
  color: #4b5563;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.desc-cn {
  color: #1f2937;
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0.5rem 0;
}

.desc-en {
  color: #6b7280;
  font-size: 0.8rem;
  line-height: 1.3;
  margin: 0.25rem 0;
}

.invoke-section {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
}

.invoke-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.invoke-command {
  font-size: 1.25rem;
  color: #1e40af;
  background: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: 2px solid #3b82f6;
}

.copy-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #2563eb;
}

.hint {
  color: #6b7280;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.tools-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tool-badge {
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #4b5563;
}

.category-tag {
  padding: 6px 14px;
  background: #1e3a8a;
  color: white;
  border-radius: 6px;
}

.source-path {
  font-size: 0.8rem;
  color: #6b7280;
  word-break: break-all;
}
</style>