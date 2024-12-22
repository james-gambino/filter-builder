<template>
  <div class="app">
    <h1>Filter Builder Example</h1>
    <FilterBuilder
      v-model:value="filterValue"
      :fields="fields"
      :initial-operator="'AND'"
      @update="handleFilterUpdate"
    />
    <pre>{{ JSON.stringify(filterValue, null, 2) }}</pre>
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

const handleFilterUpdate = (filter: FilterGroup) => {
  console.log('Received filter update:', filter);
  if (filter.children) {
    filterValue.value = {
      operator: filter.operator || 'AND',
      conditions: [],
      groups: [],
      children: filter.children.map(child => {
        if ('field' in child) {
          return {
            ...child,
            type: 'condition'
          };
        }
        return {
          ...child,
          type: 'group'
        };
      })
    };
  }
  console.log('Updated filterValue:', filterValue.value);
};
</script>

<style scoped>
.app {
  padding: 2rem;
  font-family: Arial, sans-serif;
}
</style>

