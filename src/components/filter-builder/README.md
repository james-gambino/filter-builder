# Конструктор фильтров Vue TypeScript

Мощный и гибкий компонент для построения фильтров, разработанный с использованием Vue 3 и TypeScript. Позволяет пользователям создавать сложные условия фильтрации с помощью интуитивно понятного интерфейса.

## Возможности

- 🔍 Динамическое создание фильтров с поддержкой множественных условий
- 🌳 Вложенные группы фильтров с операторами И/ИЛИ
- 🎯 Типизированная реализация с использованием TypeScript
- 🎨 Чистый и интуитивно понятный интерфейс
- 📦 Модульная архитектура компонентов
- 🔄 Обновления в реальном времени
- 🎭 Настраиваемые операторы и типы полей

## Архитектура

Проект построен с использованием паттерна Компоновщик (Composite), что позволяет создавать сложные древовидные структуры фильтров.

### Основные компоненты

#### FilterGroupComposite
Основной контейнерный компонент, реализующий паттерн Компоновщик. Может содержать как условия фильтрации, так и вложенные группы.

Возможности:
- Добавление/удаление условий и групп
- Переключение между операторами И/ИЛИ
- Поддержка вложенной структуры
- Обновления в реальном времени

```vue
<FilterGroupComposite
  :fields="fields"
  :initial-operator="'AND'"
  @update="handleFilterUpdate"
/>
```

#### FilterCondition
Компонент отдельного условия фильтрации. Позволяет указать:
- Выбор поля
- Выбор оператора
- Ввод значения

```vue
<FilterCondition
  :id="conditionId"
  :fields="fields"
  :index="index"
  @update="handleUpdate"
  @remove="handleRemove"
/>
```

#### DropdownMenu
Переиспользуемый компонент выпадающ��го меню для выбора операторов и других опций.

## Типы данных

### Интерфейсы

```typescript
// Базовый интерфейс для всех компонентов фильтра
interface IFilterComponent {
  id: string;
  operator: string;
  field?: string;
  value?: any;
  type?: 'condition' | 'group';
  children?: IFilterComponent[];
  accept: (visitor: IFilterVisitor) => void;
  clone: () => IFilterComponent;
  toJSON: () => any;
}

// Интерфейс для описания поля фильтра
interface FilterField {
  id: string;
  label: string;
  type: DataType;
  format?: (value: any) => string;
}

// Типы данных для полей
type DataType =
  | 'number'
  | 'numeric'
  | 'string'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'object'
  | 'array';
```

## Использование

### Базовый пример

```vue
<template>
  <div class="filter-builder">
    <FilterGroupComposite
      :fields="fields"
      :initial-operator="'AND'"
      @update="handleFilterUpdate"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { FilterGroupComposite } from './components';
import type { FilterField } from './types';

export default defineComponent({
  components: {
    FilterGroupComposite
  },
  setup() {
    const fields: FilterField[] = [
      { id: 'name', label: 'Имя', type: 'string' },
      { id: 'age', label: 'Возраст', type: 'number' },
      { id: 'birthDate', label: 'Дата рождения', type: 'date' }
    ];

    const handleFilterUpdate = (filter: any) => {
      console.log('Фильтр обновлен:', filter);
    };

    return {
      fields,
      handleFilterUpdate
    };
  }
});
</script>
```

### Структура данных фильтра

```typescript
// Пример структуры данных фильтра
{
  type: 'group',
  operator: 'AND',
  children: [
    {
      type: 'condition',
      field: 'name',
      operator: 'contains',
      value: 'John'
    },
    {
      type: 'group',
      operator: 'OR',
      children: [
        {
          type: 'condition',
          field: 'age',
          operator: '>',
          value: 18
        },
        {
          type: 'condition',
          field: 'birthDate',
          operator: '<=',
          value: '2000-01-01'
        }
      ]
    }
  ]
}
```

## События

### update
Вызывается при любом изменении фильтра. Передает актуальное состояние фильтра.

```typescript
(filter: {
  type: 'group' | 'condition';
  operator: string;
  children?: any[];
  field?: string;
  value?: any;
}) => void
```

### remove
Вызывается при удалении группы или условия.

## Стилизация

Компонент использует CSS классы для стилизации:

```css
.filter-group-composite /* Основной контейнер группы */
.group-header /* Заголовок группы с оператором */
.group-content /* Содержимое группы */
.filter-condition /* Контейнер условия */
.add-button /* Кнопка добавления */
.remove-button /* Кнопка удаления */
```

## Паттерны проектирования

В проекте используются следующие паттерны:
- **Компоновщик**: Для организации древовидной структуры фильтров
- **Наблюдатель**: Для обработки обновлений состояния
- **Посетитель**: Для обхода и операций над деревом фильтров

## Расширение функциональности

### Добавление новых операторов

Новые операторы можно добавить несколькими способами:

1. **Через константы операторов**

```typescript
// constants/operators.ts
import { FilterOperator } from '../types';

export const CUSTOM_OPERATORS: FilterOperator[] = [
  {
    value: 'startsWith',
    label: 'Начинается с',
    types: ['string'],
    validate: (value: string) => typeof value === 'string' && value.length > 0
  },
  {
    value: 'between',
    label: 'Между',
    types: ['number', 'date'],
    validate: (value: [number, number]) => 
      Array.isArray(value) && value.length === 2 && value.every(v => !isNaN(v))
  }
];

// Регистрация операторов
export const registerOperators = (operators: FilterOperator[]) => {
  operators.forEach(operator => {
    OPERATORS_MAP.set(operator.value, operator);
  });
};
```

2. **Через утилиты операторов**

```typescript
// utils/operators.ts
import { DataType, FilterOperator } from '../types';

export function addOperatorForType(type: DataType, operator: FilterOperator) {
  const currentOperators = getOperatorsByType(type);
  operatorsByType.set(type, [...currentOperators, operator]);
}

// Пример использования
addOperatorForType('string', {
  value: 'containsIgnoreCase',
  label: 'Содержит (без учета регистра)',
  types: ['string'],
  validate: (value: string) => typeof value === 'string',
  transform: (value: string) => value.toLowerCase()
});
```

3. **Через компонент FilterGroupComposite**

```vue
<template>
  <FilterGroupComposite
    :fields="fields"
    :custom-operators="customOperators"
    @update="handleFilterUpdate"
  />
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const customOperators = {
      string: [
        {
          value: 'regex',
          label: 'Регулярное выражение',
          validate: (value: string) => {
            try {
              new RegExp(value);
              return true;
            } catch {
              return false;
            }
          }
        }
      ]
    };

    return { customOperators };
  }
});
</script>
```

### Добавление новых типов полей

1. **Определение нового типа**

```typescript
// types/filter.types.ts
export type DataType = 
  | 'string'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'array'
  | 'custom_type'; // Добавляем новый тип

// Определение интерфейса для обработчика типа
export interface TypeHandler {
  format: (value: any) => string;
  validate: (value: any) => boolean;
  component?: Component; // Опциональный компонент для ввода
  defaultOperators?: FilterOperator[]; // Операторы по умолчанию для типа
}
```

2. **Создание компонента ввода для нового типа**

```vue
// components/inputs/CustomTypeInput.vue
<template>
  <div class="custom-type-input">
    <!-- Ваш компонент ввода -->
    <input 
      v-model="localValue"
      @input="handleInput"
      :placeholder="placeholder"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'CustomTypeInput',
  props: {
    modelValue: {
      type: [String, Number, Object],
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'validate'],
  setup(props, { emit }) {
    const localValue = ref(props.modelValue);

    const handleInput = () => {
      emit('update:modelValue', localValue.value);
      // Добавьте свою логику валидации
      emit('validate', validateValue(localValue.value));
    };

    const validateValue = (value: any): boolean => {
      // Ваша логика валидации
      return true;
    };

    watch(() => props.modelValue, (newValue) => {
      localValue.value = newValue;
    });

    return {
      localValue,
      handleInput
    };
  }
});
</script>
```

3. **Регистрация нового типа**

```typescript
// utils/type-handlers.ts
import { TypeHandler, DataType } from '../types';
import CustomTypeInput from '../components/inputs/CustomTypeInput.vue';

export const typeHandlers = new Map<DataType, TypeHandler>();

export function registerTypeHandler(type: DataType, handler: TypeHandler) {
  typeHandlers.set(type, handler);
}

// Регистрация обработчика для нового типа
registerTypeHandler('custom_type', {
  component: CustomTypeInput,
  format: (value: any) => {
    // Ваша логика форматирования
    return String(value);
  },
  validate: (value: any) => {
    // Ваша логика валидации
    return true;
  },
  defaultOperators: [
    {
      value: 'equals',
      label: 'Равно',
      validate: (value: any) => true
    },
    // Другие операторы...
  ]
});
```

4. **Использование нового типа**

```vue
<template>
  <FilterGroupComposite
    :fields="fields"
    :type-handlers="customTypeHandlers"
    @update="handleFilterUpdate"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { registerTypeHandler } from './utils/type-handlers';
import CustomTypeInput from './components/inputs/CustomTypeInput.vue';

export default defineComponent({
  setup() {
    // Регистрация обработчика типа
    registerTypeHandler('custom_type', {
      component: CustomTypeInput,
      format: (value) => String(value),
      validate: (value) => true
    });

    const fields = [
      {
        id: 'customField',
        label: 'Пользовательское поле',
        type: 'custom_type'
      }
      // Другие поля...
    ];

    return { fields };
  }
});
</script>
```

### Примеры использования

1. **Добавление типа "телефонный номер"**

```typescript
// Регистрация типа
registerTypeHandler('phone', {
  format: (value: string) => {
    // Форматирование номера телефона
    return value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  },
  validate: (value: string) => {
    // Валидация номера телефона
    return /^\d{10}$/.test(value.replace(/\D/g, ''));
  },
  defaultOperators: [
    {
      value: 'equals',
      label: 'Равно',
      validate: (value: string) => /^\d{10}$/.test(value.replace(/\D/g, ''))
    },
    {
      value: 'startsWith',
      label: 'Начинается с',
      validate: (value: string) => /^\d{1,10}$/.test(value.replace(/\D/g, ''))
    }
  ]
});

// Использование в полях
const fields = [
  {
    id: 'phoneNumber',
    label: 'Телефон',
    type: 'phone'
  }
];
```

2. **Добавление типа "диапазон дат"**

```typescript
// Регистрация типа
registerTypeHandler('daterange', {
  component: DateRangeInput, // Ваш компонент выбора диапазона дат
  format: (value: [Date, Date]) => {
    return `${value[0].toLocaleDateString()} - ${value[1].toLocaleDateString()}`;
  },
  validate: (value: [Date, Date]) => {
    return Array.isArray(value) && 
           value.length === 2 && 
           value.every(v => v instanceof Date);
  },
  defaultOperators: [
    {
      value: 'within',
      label: 'В диапазоне',
      validate: (value: [Date, Date]) => {
        return Array.isArray(value) && value.length === 2;
      }
    }
  ]
});
```

### Советы по расширению

1. **Валидация**
   - Всегда добавляйте валидацию для новых типов и операторов
   - Предусматривайте обработку краевых случаев
   - Добавляйте понятные сообщения об ошибках

2. **Форматирование**
   - Реализуйте форматирование для улучшения читаемости
   - Учитывайте локализацию при форматировании
   - Добавьте возможность настройки формата

3. **Производительность**
   - Используйте мемоизацию для тяжелых операций
   - Оптимизируйте валидацию и форматирование
   - Избегайте излишних перерендеров

4. **Тестирование**
   - Тестируйте новые типы и операторы
   - Проверяйте граничные случаи
   - Тестируйте интеграцию с существующими компонентами
 