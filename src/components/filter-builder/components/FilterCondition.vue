<template>
  <div class="filter-condition">
    <button class="remove-button" @click="$emit('remove')">×</button>
    <select v-model="field" class="field-select" @change="updateValue">
      <option value="">Select field</option>
      <option v-for="f in fields" :key="f.id" :value="f.id">{{ f.label }}</option>
    </select>
    <select v-model="operator" class="operator-select" @change="updateValue">
      <option value="">Select operator</option>
      <option v-for="op in operators" :key="op.value" :value="op.value">{{ op.label }}</option>
    </select>
    <input v-model="value" type="text" class="value-input" @input="updateValue" placeholder="Enter value" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { FilterField, IFilterComponent, IFilterVisitor } from '../types';
import { getOperatorsByType } from '../utils/operators';

export default defineComponent({
  name: 'FilterCondition',
  props: {
    id: {
      type: String,
      required: true
    },
    fields: {
      type: Array as () => FilterField[],
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    const field = ref('');
    const operator = ref('=');
    const value = ref('');

    const currentField = computed(() => 
      props.fields.find(f => f.id === field.value)
    );

    const operators = computed(() => 
      getOperatorsByType(currentField.value?.type || 'string')
    );

    const updateValue = () => {
      emit('update', {
        id: props.id,
        type: 'condition',
        field: field.value,
        operator: operator.value,
        value: value.value
      }, props.index);
    };

    // Initial update to set default values
    updateValue();

    const accept = (visitor: IFilterVisitor) => {
      visitor.visitCondition({
        field: field.value,
        operator: operator.value,
        value: value.value
      });
    };

    const clone = (): IFilterComponent => ({
      id: props.id,
      operator: operator.value,
      accept,
      clone,
      toJSON: () => ({
        type: 'condition',
        field: field.value,
        operator: operator.value,
        value: value.value
      })
    });

    return {
      field,
      operator,
      value,
      operators,
      updateValue,
      accept,
      clone
    };
  }
});
</script>

<style scoped>
.filter-condition {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-button {
  padding: 4px 8px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
}

.field-select,
.operator-select,
.value-input {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.value-input {
  flex: 1;
}
</style> 