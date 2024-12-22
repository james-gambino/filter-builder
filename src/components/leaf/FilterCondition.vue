<!--<template>-->
<!--  <div class="filter-condition">-->
<!--    <div class="condition-content">-->
<!--      <button class="remove-button" @click="$emit('remove')">×</button>-->
<!--      <DropdownMenu-->
<!--        class="field-dropdown"-->
<!--        :options="fieldOptions"-->
<!--        v-model="localField"-->
<!--        @update:modelValue="updateField"-->
<!--      />-->
<!--      <DropdownMenu-->
<!--        class="operator-dropdown"-->
<!--        :options="operatorOptions"-->
<!--        v-model="localOperator"-->
<!--        @update:modelValue="updateOperator"-->
<!--      />-->
<!--      <component-->
<!--        :is="inputComponent"-->
<!--        v-model="localValue"-->
<!--        @update:modelValue="updateValue"-->
<!--        :field="currentField"-->
<!--        :options="fieldOptions"-->
<!--      />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import { defineComponent, ref, computed, PropType } from 'vue';-->
<!--import { IFilterLeaf, IFilterVisitor, FilterField } from '../types';-->
<!--import BaseFilterComponent from '../filter-builder/components/BaseFilterComponent.vue';-->
<!--import DropdownMenu from '../filter-builder/components/DropdownMenu.vue';-->
<!--import StringInput from '../inputs/StringInput.vue';-->
<!--import NumberInput from '../inputs/NumberInput.vue';-->
<!--import BooleanSelect from '../inputs/BooleanSelect.vue';-->

<!--export default defineComponent({-->
<!--  name: 'FilterCondition',-->
<!--  extends: BaseFilterComponent,-->
<!--  components: {-->
<!--    DropdownMenu,-->
<!--    StringInput,-->
<!--    NumberInput,-->
<!--    BooleanSelect-->
<!--  },-->
<!--  props: {-->
<!--    fields: {-->
<!--      type: Array as PropType<FilterField[]>,-->
<!--      required: true-->
<!--    },-->
<!--    initialField: {-->
<!--      type: String,-->
<!--      default: ''-->
<!--    },-->
<!--    initialOperator: {-->
<!--      type: String,-->
<!--      default: '='-->
<!--    },-->
<!--    initialValue: {-->
<!--      type: [String, Number, Boolean],-->
<!--      default: ''-->
<!--    }-->
<!--  },-->
<!--  emits: ['update', 'remove'],-->
<!--  setup(props, { emit }) {-->
<!--    const localField = ref(props.initialField);-->
<!--    const localOperator = ref(props.initialOperator);-->
<!--    const localValue = ref(props.initialValue);-->

<!--    const currentField = computed(() => -->
<!--      props.fields.find(f => f.id === localField.value)-->
<!--    );-->

<!--    const fieldOptions = computed(() => -->
<!--      props.fields.map(field => ({-->
<!--        value: field.id,-->
<!--        label: field.label-->
<!--      }))-->
<!--    );-->

<!--    const operatorOptions = computed(() => {-->
<!--      const type = currentField.value?.type || 'string';-->
<!--      return getOperatorsByType(type);-->
<!--    });-->

<!--    const inputComponent = computed(() => {-->
<!--      const type = currentField.value?.type || 'string';-->
<!--      return getInputComponentByType(type);-->
<!--    });-->

<!--    const getOperatorsByType = (type: string) => {-->
<!--      const operators: Record<string, Array<{ value: string, label: string }>> = {-->
<!--        string: [-->
<!--          { value: '=', label: 'Equals' },-->
<!--          { value: 'contains', label: 'Contains' },-->
<!--          { value: 'startsWith', label: 'Starts with' }-->
<!--        ],-->
<!--        number: [-->
<!--          { value: '=', label: 'Equals' },-->
<!--          { value: '>', label: 'Greater than' },-->
<!--          { value: '<', label: 'Less than' }-->
<!--        ],-->
<!--        boolean: [-->
<!--          { value: '=', label: 'Equals' }-->
<!--        ]-->
<!--      };-->
<!--      return operators[type] || operators.string;-->
<!--    };-->

<!--    const getInputComponentByType = (type: string) => {-->
<!--      const components: Record<string, string> = {-->
<!--        string: 'StringInput',-->
<!--        number: 'NumberInput',-->
<!--        boolean: 'BooleanSelect'-->
<!--      };-->
<!--      return components[type] || 'StringInput';-->
<!--    };-->

<!--    const updateField = () => {-->
<!--      emit('update', getValue());-->
<!--    };-->

<!--    const updateOperator = () => {-->
<!--      emit('update', getValue());-->
<!--    };-->

<!--    const updateValue = () => {-->
<!--      emit('update', getValue());-->
<!--    };-->

<!--    const getValue = () => ({-->
<!--      field: localField.value,-->
<!--      operator: localOperator.value,-->
<!--      value: localValue.value-->
<!--    });-->

<!--    const setValue = (value: any) => {-->
<!--      localField.value = value.field;-->
<!--      localOperator.value = value.operator;-->
<!--      localValue.value = value.value;-->
<!--    };-->

<!--    const accept = (visitor: IFilterVisitor) => {-->
<!--      visitor.visitCondition(getValue());-->
<!--    };-->

<!--    const clone = (): IFilterLeaf => {-->
<!--      return new FilterCondition({-->
<!--        props: {-->
<!--          id: props.id,-->
<!--          fields: props.fields,-->
<!--          initialField: localField.value,-->
<!--          initialOperator: localOperator.value,-->
<!--          initialValue: localValue.value-->
<!--        }-->
<!--      });-->
<!--    };-->

<!--    const toJSON = () => {-->
<!--      return {-->
<!--        id: props.id,-->
<!--        type: 'condition',-->
<!--        ...getValue()-->
<!--      };-->
<!--    };-->

<!--    return {-->
<!--      localField,-->
<!--      localOperator,-->
<!--      localValue,-->
<!--      currentField,-->
<!--      fieldOptions,-->
<!--      operatorOptions,-->
<!--      inputComponent,-->
<!--      updateField,-->
<!--      updateOperator,-->
<!--      updateValue,-->
<!--      getValue,-->
<!--      setValue,-->
<!--      accept,-->
<!--      clone,-->
<!--      toJSON-->
<!--    };-->
<!--  }-->
<!--});-->
<!--</script>-->

<!--<style scoped>-->
<!--.filter-condition {-->
<!--  background: white;-->
<!--  border: 1px solid #e0e0e0;-->
<!--  border-radius: 4px;-->
<!--  padding: 0.75rem;-->
<!--}-->

<!--.condition-content {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 0.75rem;-->
<!--}-->

<!--.remove-button {-->
<!--  width: 24px;-->
<!--  height: 24px;-->
<!--  border-radius: 12px;-->
<!--  border: none;-->
<!--  background: #f5f5f5;-->
<!--  color: #666;-->
<!--  cursor: pointer;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  font-size: 16px;-->
<!--}-->

<!--.remove-button:hover {-->
<!--  background: #e0e0e0;-->
<!--  color: #333;-->
<!--}-->

<!--.field-dropdown,-->
<!--.operator-dropdown {-->
<!--  min-width: 120px;-->
<!--}-->
<!--</style>-->