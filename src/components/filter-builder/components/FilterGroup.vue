<template>
  <div class="filter-group">
    <!-- Выбор логического оператора -->
    <div class="group-header">
      <label for="logical-operator">Logical Operator:</label>
      <select id="logical-operator" v-model="group.operator" @change="updateGroup">
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
      <button @click="addFilter">Add Filter</button>
      <button @click="addGroup">Add Group</button>
    </div>

    <!-- Список фильтров и групп -->
    <div class="group-body">
      <div
          v-for="(item, index) in group.children"
          :key="index"
          class="group-item"
      >
        <!-- Если это фильтр -->
        <FilterBuilder
            v-if="isFilter(item)"
            :fields="fields"
            :filter="item"
            @update="updateFilter(index, $event)"
        />

        <!-- Если это вложенная группа -->
        <FilterGroup
            v-else
            :fields="fields"
            :group="item"
            @update="updateGroupChild(index, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent } from "vue";
import FilterBuilder from "./FilterBuilder.vue";
import {FilterField} from "../../types.ts";

export default defineComponent({
  name: "FilterGroup",
  components: { FilterBuilder  },
  props: {
    fields: {
      type: Array as () => FilterField[],
      required: true,
    },
    group: {
      type: Object,
      required: true,
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    const isFilter = (item: any) => "field" in item && "operator" in item && "value" in item;

    const updateGroup = () => {
      emit("update", props.group);
    };

    const addFilter = () => {
      props.group.children.push({
        field: props.fields[0]?.id || "",
        operator: "=",
        value: "",
      });
      updateGroup();
    };

    const addGroup = () => {
      props.group.children.push({
        operator: "AND",
        children: [],
      });
      updateGroup();
    };

    const updateFilter = (index: number, filter: any) => {
      props.group.children[index] = filter;
      updateGroup();
    };

    const updateGroupChild = (index: number, group: any) => {
      props.group.children[index] = group;
      updateGroup();
    };

    return {
      isFilter,
      addFilter,
      addGroup,
      updateFilter,
      updateGroupChild,
      updateGroup,
    };
  },
});
</script>

<style scoped>
.filter-group {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 1rem 0;
}
.group-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.group-body {
  margin-left: 1rem;
}
</style>