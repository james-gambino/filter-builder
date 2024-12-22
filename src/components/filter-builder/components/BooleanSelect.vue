<template>
  <div>
    <label :for="field.id">{{ field.label }}</label>
    <select :id="field.id" v-model="localValue" @change="update">
      <option value="">Select...</option>
      <option :value="true">True</option>
      <option :value="false">False</option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import {Filter, FilterField} from "../../types.ts";

export default defineComponent({
  name: "BooleanSelect",
  props: {
    filter: {
      type: Object as PropType<Filter>,
      required: true,
    },
    field: {
      type: Object as PropType<FilterField>,
      required: true,
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const localValue = ref(props.filter.value);

    watch(localValue, (newValue) => {
      emit("update", newValue);
    });

    const update = () => {
      emit("update", localValue.value);
    };

    return { localValue, update };
  },
});
</script>