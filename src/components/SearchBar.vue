<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      placeholder="搜索技能名称或描述..."
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-bar {
  max-width: 400px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.85);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.3);
}
</style>