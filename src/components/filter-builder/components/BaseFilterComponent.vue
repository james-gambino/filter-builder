<template>
  <div class="base-filter-component">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IFilterComponent, IFilterVisitor } from '../../types.ts';

export default defineComponent({
  name: 'BaseFilterComponent',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    accept(visitor: IFilterVisitor): void {
      console.log(visitor);
      throw new Error('Method accept() must be implemented');
    },
    
    clone(): IFilterComponent {
      throw new Error('Method clone() must be implemented');
    },
    
    toJSON(): any {
      throw new Error('Method toJSON() must be implemented');
    }
  }
});
</script>

<style scoped>
.base-filter-component {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style> 