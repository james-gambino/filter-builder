<template>
  <div class="filter-field">
    <select v-model="localFilter.field" @change="updateFilter">
      <option v-for="field in fields" :key="field.id" :value="field.id">
        {{ field.label }}
      </option>
    </select>
    <select v-model="localFilter.operator" @change="updateFilter">
      <option v-for="operator in operators" :key="operator.value" :value="operator.value">
        {{ operator.label }}
      </option>
    </select>
    <component
        :is="customComponent || 'input'"
        v-model="localFilter.value"
        @input="updateFilter"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { FilterField, Filter, FilterOperator, CustomOperation } from "../../types.ts";
import { getDefaultOperators } from "../../utils.ts";

export default defineComponent({
  name: "FilterField",
  props: {
    fields: {
      type: Array as () => FilterField[],
      required: true,
    },
    value: {
      type: Object as () => Filter,
      required: true,
    },
    customOperations: {
      type: Object as () => Record<string, CustomOperation>,
      required: false,
      default: () => ({}),
    },
    localization: {
      type: Object as () => Record<string, string>,
      required: false,
      default: () => ({}),
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const localFilter = ref<Filter>({ ...props.value });

    const operators = computed<FilterOperator[]>(() => {
      const field = props.fields.find((f) => f.id === localFilter.value.field);
      const fieldType = field?.type;
      return fieldType && props.customOperations[fieldType]
          ? []
          : getDefaultOperators(fieldType || "");
    });

    const customComponent = computed(() => {
      const field = props.fields.find((f) => f.id === localFilter.value.field);
      const fieldType = field?.type;
      return fieldType ? props.customOperations[fieldType]?.render : undefined;
    });

    watch(localFilter, (newFilter) => emit("update", newFilter), { deep: true });

    const updateFilter = () => {
      emit("update", { ...localFilter.value });
    };

    return {
      localFilter,
      operators,
      customComponent,
      updateFilter,
    };
  },
});
</script>

<style scoped>
.filter-field {
  display: flex;
  gap: 0.5rem;
}
</style>