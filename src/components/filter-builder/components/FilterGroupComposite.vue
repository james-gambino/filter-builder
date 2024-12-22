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
              :index="index"
              @update="(value) => handleChildUpdate(value, index)"
              @remove="() => removeChild(index)"
            />
          </template>
          <template v-else>
            <FilterGroupComposite
              :id="child.id"
              :fields="fields"
              :index="index"
              :initial-operator="child.operator as 'AND' | 'OR'"
              @update="(value) => handleChildUpdate(value, index)"
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
    },
    index: {
      type: Number,
      default: undefined
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

    const addChild = (component: IFilterComponent) => {
      console.log('Adding child:', component);
      
      // Создаем компонент с правильным методом toJSON
      const newComponent = {
        ...component,
        type: component.type,
        toJSON: () => {
          const base = {
            id: component.id,
            type: component.type
          };

          if (component.type === 'condition') {
            return {
              ...base,
              field: component.field || '',
              operator: component.operator || '=',
              value: component.value || ''
            };
          } else {
            return {
              ...base,
              operator: component.operator || 'AND',
              children: component.children || []
            };
          }
        }
      };

      children.value.push(newComponent);
      
      // Эмитим обновление с актуальным состоянием
      emit('update', {
        type: 'group',
        operator: localOperator.value,
        children: children.value.map(child => child.toJSON())
      });
    };

    const addCondition = () => {
      const conditionId = `condition-${Date.now()}`;
      const newCondition: IFilterComponent = {
        id: conditionId,
        type: 'condition',
        field: '',
        operator: '=',
        value: '',
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
            id: this.id,
            type: 'condition',
            field: this.field,
            operator: this.operator,
            value: this.value
          };
        }
      };

      addChild(newCondition);
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
            id: this.id,
            type: 'group',
            operator: 'AND' as const,
            children: []
          };
        }
      };

      addChild(newGroup);
      showAddMenu.value = false;
    };

    const removeChild = (index: number) => {
      children.value.splice(index, 1);
      emit('update', {
        type: 'group',
        operator: localOperator.value,
        children: children.value.map(child => {
          if (child.toJSON().type === 'condition') {
            return {
              ...child.toJSON(),
              id: child.id,
              type: 'condition'
            };
          } else {
            return {
              ...child.toJSON(),
              id: child.id,
              type: 'group',
              children: child.toJSON().children || []
            };
          }
        })
      });
    };

    const getChildren = (): IFilterComponent[] => {
      return children.value;
    };

    const toggleAddMenu = () => {
      showAddMenu.value = !showAddMenu.value;
    };

    const updateOperator = () => {
      const updatedGroup = {
        type: 'group',
        operator: localOperator.value,
        children: children.value.map(child => {
          const json = child.toJSON();
          return {
            ...json,
            id: child.id,
            type: json.type || (json.field ? 'condition' : 'group')
          };
        })
      };
      emit('update', updatedGroup);
    };

    const handleChildUpdate = (value: any, index: number) => {
      console.log('Child update:', value, 'at index:', index);
      
      if (index === undefined || index < 0 || index >= children.value.length) {
        console.error('Invalid index in handleChildUpdate:', index);
        return;
      }
      
      // Обновляем состояние дочернего компонента
      children.value[index] = {
        ...children.value[index],
        ...value,
        toJSON: () => ({
          id: value.id,
          type: value.type,
          ...(value.type === 'condition' 
            ? {
                field: value.field || '',
                operator: value.operator || '=',
                value: value.value || ''
              }
            : {
                operator: value.operator || 'AND',
                children: value.children || []
              }
          )
        })
      };
      
      // Эмитим обновление с актуальным состоянием
      emit('update', {
        type: 'group',
        operator: localOperator.value,
        children: children.value.map(child => child.toJSON())
      }, props.index);
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
      const json = {
        id: props.id,
        type: 'group',
        operator: localOperator.value,
        children: children.value.map(child => {
          const childJson = child.toJSON();
          if (childJson.type === 'condition') {
            return {
              ...childJson,
              id: child.id,
              type: 'condition'
            };
          } else {
            return {
              ...childJson,
              id: child.id,
              type: 'group',
              children: childJson.children || []
            };
          }
        })
      };
      console.log('Group toJSON:', json);
      return json;
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