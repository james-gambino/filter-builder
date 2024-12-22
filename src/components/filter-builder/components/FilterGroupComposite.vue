<template>
  <div class="filter-group-composite">
    <div class="group-header">
      <DropdownMenu
        class="operator-dropdown"
        :options="operatorOptions"
        v-model="localOperator"
        @update:modelValue="updateOperator"
      />
      <div class="group-actions">
        <button class="add-button" @click="toggleAddMenu">
          <span>+</span>
        </button>
        <button v-if="showRemoveButton" class="remove-button" @click="$emit('remove')">×</button>
        <div v-if="showAddMenu" class="add-menu">
          <button @click="addCondition">Add Condition</button>
          <button @click="addGroup">Add Group</button>
        </div>
      </div>
    </div>

    <div class="group-content">
      <TransitionGroup name="list">
        <div v-for="(child, index) in children" :key="child.id" class="filter-item">
          <template v-if="child.toJSON().type === 'condition'">
            <FilterCondition
              :id="child.id"
              :fields="fields"
              @update="handleChildUpdate"
              @remove="() => removeChild(index)"
            />
          </template>
          <template v-else>
            <FilterGroupComposite
              :id="child.id"
              :fields="fields"
              :initial-operator="child.operator as 'AND' | 'OR'"
              @update="handleChildUpdate"
              @remove="() => removeChild(index)"
            />
          </template>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { IFilterComponent, IFilterVisitor, FilterField } from '../types';
import BaseFilterComponent from './BaseFilterComponent.vue';
import DropdownMenu from './DropdownMenu.vue';
import FilterCondition from './FilterCondition.vue';

export default defineComponent({
  name: 'FilterGroupComposite',
  extends: BaseFilterComponent,
  components: {
    DropdownMenu,
    FilterCondition
  },
  props: {
    id: {
      type: String,
      required: true
    },
    initialOperator: {
      type: String as PropType<'AND' | 'OR'>,
      default: 'AND'
    },
    fields: {
      type: Array as PropType<FilterField[]>,
      required: true
    },
    showRemoveButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    const children = ref<IFilterComponent[]>([]);
    const localOperator = ref<'AND' | 'OR'>(props.initialOperator);
    const showAddMenu = ref(false);

    const operatorOptions = [
      { value: 'AND', label: 'AND' },
      { value: 'OR', label: 'OR' }
    ];

    const addCondition = () => {
      const conditionId = `condition-${Date.now()}`;
      console.log(`conditionId`)
      const newCondition: IFilterComponent = {
        id: conditionId,
        operator: '=',
        accept(visitor: IFilterVisitor) {
          visitor.visitCondition({
            field: '',
            operator: '=',
            value: ''
          });
        },
        clone() {
          return { ...this };
        },
        toJSON() {
          return {
            type: 'condition',
            field: '',
            operator: '=',
            value: ''
          };
        }
      };

      children.value.push(newCondition);
      emit('update');
      showAddMenu.value = false;
    };

    const addGroup = () => {
      const groupId = `group-${Date.now()}`;
      const newGroup: IFilterComponent = {
        id: groupId,
        operator: 'AND' as const,
        accept(visitor: IFilterVisitor) {
          visitor.visitGroup({
            operator: 'AND' as const,
            children: []
          });
        },
        clone() {
          return { ...this };
        },
        toJSON() {
          return {
            type: 'group',
            operator: 'AND' as const,
            children: []
          };
        }
      };

      children.value.push(newGroup);
      emit('update');
      showAddMenu.value = false;
    };

    const addChild = (component: IFilterComponent) => {
      children.value.push(component);
      emit('update');
    };

    const removeChild = (index: number) => {
      children.value.splice(index, 1);
      emit('update');
    };

    const getChildren = (): IFilterComponent[] => {
      return children.value;
    };

    const toggleAddMenu = () => {
      showAddMenu.value = !showAddMenu.value;
    };

    const updateOperator = () => {
      emit('update');
    };

    const handleChildUpdate = (value: any, index: number) => {
      if (!value || index < 0 || index >= children.value.length) return;
      
      const child = children.value[index];
      if (!child) return;

      if (value.type === 'condition') {
        Object.assign(child, {
          ...child,
          field: value.field || '',
          operator: value.operator || '=',
          value: value.value || '',
          type: 'condition'
        });
      } else {
        Object.assign(child, {
          ...child,
          operator: value.operator || 'AND',
          children: value.children || [],
          type: 'group'
        });
      }
      emit('update');
    };

    const accept = (visitor: IFilterVisitor) => {
      visitor.visitGroup({
        operator: localOperator.value,
        children: children.value.map(child => child.toJSON())
      });
      children.value.forEach(child => child.accept(visitor));
    };

    const clone = (): IFilterComponent => {
      const clonedChildren = children.value.map(child => child.clone());
      return {
        id: props.id,
        operator: localOperator.value,
        children: clonedChildren,
        accept,
        clone,
        toJSON,
        addChild,
        removeChild,
        getChildren
      } as IFilterComponent;
    };

    const toJSON = () => {
      return {
        id: props.id,
        type: 'group',
        operator: localOperator.value,
        children: children.value.map(child => child.toJSON())
      };
    };

    return {
      children,
      localOperator,
      operatorOptions,
      showAddMenu,
      addChild,
      removeChild,
      getChildren,
      toggleAddMenu,
      updateOperator,
      handleChildUpdate,
      accept,
      clone,
      toJSON,
      addCondition,
      addGroup
    };
  }
});
</script>

<style scoped>
.filter-group-composite {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  margin: 0.5rem 0;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.group-actions {
  position: relative;
}

.add-button {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.add-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 150px;
}

.add-menu button {
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
}

.add-menu button:hover {
  background: #f5f5f5;
}

.group-content {
  margin-left: 1rem;
}

.filter-item {
  margin: 0.5rem 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.remove-button {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-left: 8px;
}

.remove-button:hover {
  background: #f5f5f5;
  color: #ff4444;
}
</style> 