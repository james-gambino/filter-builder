<template>
  <div class="app">
    <h1>Filter Builder Example</h1>
    <FilterBuilder
      v-model:value="filterValue"
      :fields="fields"
      :initial-operator="'AND'"
      @apply="handleApplyFilters"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FilterBuilder from './components/filter-builder/FilterBuilder.vue';
import type { FilterGroup, FilterField } from './components/filter-builder/types';

const fields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'email', label: 'Email', type: 'string' },
  { id: 'isActive', label: 'Active Status', type: 'boolean' },
  { id: 'registrationDate', label: 'Registration Date', type: 'date' }
];

const filterValue = ref<FilterGroup>({
  operator: 'AND',
  conditions: [],
  groups: [],
  children: []
});

const handleApplyFilters = (filters: FilterGroup) => {
  console.log('Applied filters:', filters);
};
</script>

<style scoped>
.app {
  padding: 2rem;
  font-family: Arial, sans-serif;
}
</style>

