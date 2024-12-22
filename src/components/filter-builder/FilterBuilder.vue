<template>
  <div class="filter-builder">
    <FilterGroupComposite
      :id="rootId"
      :initial-operator="initialOperator"
      :fields="[
        { id: 'name', label: 'Name', type: 'string' },
        { id: 'age', label: 'Age', type: 'number' },
        { id: 'active', label: 'Active', type: 'boolean' }
      ]"
      @update="handleUpdate"
      ref="rootGroup"
    />
    <div class="filter-actions">
      <button class="action-button" @click="clearAll">Clear All</button>
      <button class="action-button primary" @click="applyFilters">Apply Filters</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import FilterGroupComposite from './components/FilterGroupComposite.vue';
import { IFilterComponent, FilterGroup } from '../types.ts';
import ValidationDecorator from '../decorators/ValidationDecorator.vue';

export default defineComponent({
  name: 'FilterBuilder',
  components: {
    FilterGroupComposite,
    ValidationDecorator
  },
  props: {
    initialOperator: {
      type: String as PropType<'AND' | 'OR'>,
      default: 'AND'
    },
    fields: {
      type: Array,
      required: true
    },
    value: {
      type: Object as () => FilterGroup,
      default: () => ({
        operator: 'AND',
        children: []
      })
    }
  },
  emits: ['update:value', 'apply'],
  setup(props, { emit }) {
    const rootId = ref(uuidv4());
    const rootGroup = ref<InstanceType<typeof FilterGroupComposite> | null>(null);

    onMounted(() => {
      if (props.value && Object.keys(props.value).length > 0) {
        initializeFromValue(props.value);
      }
    });

    const initializeFromValue = (value: FilterGroup) => {
      console.log('initializeFromValue', value);
      if (rootGroup.value) {
        // Implementation of initialization from existing value
        // This would involve recursively creating the filter structure
      }
    };

    const handleUpdate = () => {
      if (rootGroup.value) {
        const value = rootGroup.value.toJSON();
        emit('update:value', value);
      }
    };

    const clearAll = () => {
      if (rootGroup.value) {
        rootGroup.value.getChildren().forEach((_, index) => {
          rootGroup.value?.removeChild(index);
        });
        handleUpdate();
      }
    };

    const applyFilters = () => {
      if (rootGroup.value) {
        const value = rootGroup.value.toJSON();
        emit('apply', value);
      }
    };

    // Example validation rules
    const createValidationRules = () => [
      (value: any) => {
        if (!value.field) return 'Field is required';
        if (!value.operator) return 'Operator is required';
        if (value.value === undefined || value.value === '') return 'Value is required';
        return null;
      }
    ];

    // Helper to create a validated component
    const createValidatedComponent = (component: IFilterComponent) => {
      return new ValidationDecorator({
        props: {
          component,
          validationRules: createValidationRules()
        }
      });
    };

    return {
      rootId,
      rootGroup,
      handleUpdate,
      clearAll,
      applyFilters,
      createValidatedComponent
    };
  }
});
</script>

<style scoped>
.filter-builder {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.action-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #f0f0f0;
}

.action-button.primary {
  background: #007bff;
  color: white;
  border-color: #0056b3;
}

.action-button.primary:hover {
  background: #0056b3;
}
</style> 