<template>
  <div class="validation-decorator" :class="{ 'has-error': hasErrors }">
    <component
      :is="wrappedComponent"
      v-bind="$props"
      @update="handleUpdate"
      @remove="$emit('remove')"
    />
    <div v-if="hasErrors" class="error-messages">
      <div v-for="(error, index) in errors" :key="index" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import { IFilterComponent, IFilterDecorator, IFilterVisitor, IFilterValidation } from '../types';

export default defineComponent({
  name: 'ValidationDecorator',
  props: {
    component: {
      type: Object as PropType<IFilterComponent>,
      required: true
    },
    validationRules: {
      type: Array as PropType<(value: any) => string | null>,
      default: () => []
    }
  },
  emits: ['update', 'remove'],
  setup(props, { emit }) {
    const wrappedComponent = computed(() => props.component);
    const errors = ref<string[]>([]);

    const validate = (value: any): boolean => {
      errors.value = props.validationRules
        .map(rule => rule(value))
        .filter((error): error is string => error !== null);
      return errors.value.length === 0;
    };

    const hasErrors = computed(() => errors.value.length > 0);

    const handleUpdate = (value: any) => {
      const isValid = validate(value);
      emit('update', { value, isValid });
    };

    const getWrapped = (): IFilterComponent => {
      return props.component;
    };

    const accept = (visitor: IFilterVisitor): void => {
      props.component.accept(visitor);
    };

    const clone = (): IFilterComponent => {
      const clonedComponent = props.component.clone();
      return new ValidationDecorator({
        props: {
          component: clonedComponent,
          validationRules: props.validationRules
        }
      });
    };

    const toJSON = () => {
      return {
        ...props.component.toJSON(),
        validation: {
          hasErrors: hasErrors.value,
          errors: errors.value
        }
      };
    };

    return {
      wrappedComponent,
      errors,
      hasErrors,
      handleUpdate,
      getWrapped,
      accept,
      clone,
      toJSON
    };
  }
});
</script>

<style scoped>
.validation-decorator {
  position: relative;
}

.has-error {
  --error-color: #dc3545;
}

.has-error :deep(.filter-condition),
.has-error :deep(.filter-group-composite) {
  border-color: var(--error-color);
}

.error-messages {
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 0.75rem;
  color: var(--error-color);
}

.error-message {
  margin-top: 0.25rem;
}
</style> 