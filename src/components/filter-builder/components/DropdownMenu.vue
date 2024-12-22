<template>
  <div class="dropdown-container" @click="toggleDropdown" v-click-outside="closeDropdown">
    <div class="dropdown-header">
      <span class="selected-value">{{ getSelectedLabel }}</span>
      <span class="dropdown-arrow">▼</span>
    </div>
    <div v-if="isOpen" class="dropdown-content">
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        :class="{ 'selected': option.value === modelValue }"
        @click="selectOption(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Option {
  value: string;
  label: string;
}

const props = defineProps<{
  options: Option[];
  modelValue: string;
  label?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isOpen = ref(false);

const getSelectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected?.label || props.modelValue;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectOption = (value: string) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

// Директива для закрытия при клике вне компонента
interface ExtendedHTMLElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void;
}

const vClickOutside = {
  mounted(el: ExtendedHTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: ExtendedHTMLElement) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent);
    }
  },
};
</script>

<style scoped>
.dropdown-container {
  position: relative;
  user-select: none;
  min-width: 120px;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 12px;
  color: #666;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.selected {
  background: #e6f7ff;
  color: #1890ff;
}
</style> 