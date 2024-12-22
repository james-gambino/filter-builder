<template>
  <div>
    <label :for="field.id">{{ field.label }}</label>
    <div class="string-input">
      <!-- Выбор оператора -->
      <select v-model="localOperator" @change="update">
        <option v-for="operator in stringOperators" :key="operator" :value="operator">
          {{ getLocalizedOperator(operator) }}
        </option>
      </select>

      <!-- Поле ввода значения -->
      <input
          :id="field.id"
          type="text"
          v-model="localValue"
          @input="update"
          :placeholder="'Enter ' + field.label"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import {Filter, FilterField} from "../../types.ts";

export default defineComponent({
  name: "StringInput",
  props: {
    filter: {
      type: Object as PropType<Filter>,
      required: true,
    },
    field: {
      type: Object as PropType<FilterField>,
      required: true,
    },
    localization: {
      type: Object as PropType<Record<string, string>>,
      required: false,
      default: () => ({
        contains: "Contains",
        notcontains: "Does not contain",
        startswith: "Starts with",
        endswith: "Ends with",
        "=": "Equals",
        "<>": "Not equals",
        isblank: "Is blank",
        isnotblank: "Is not blank",
      }),
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    // Операторы для строк
    const stringOperators = [
      "contains",
      "notcontains",
      "startswith",
      "endswith",
      "=",
      "<>",
      "isblank",
      "isnotblank",
    ];

    const localValue = ref(props.filter.value);
    const localOperator = ref(props.filter.operator);

    watch(
        () => props.filter,
        (newFilter) => {
          localValue.value = newFilter.value;
          localOperator.value = newFilter.operator;
        },
        { deep: true }
    );

    // Локализация оператора
    const getLocalizedOperator = (operator: string): string => {
      return props.localization[operator] || operator;
    };

    // Обновление значения фильтра
    const update = () => {
      emit("update", { ...props.filter, value: localValue.value, operator: localOperator.value });
    };

    return {
      stringOperators,
      localValue,
      localOperator,
      getLocalizedOperator,
      update,
    };
  },
});
</script>

<style scoped>
.string-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>