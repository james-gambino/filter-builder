# Vue TypeScript Filter Builder

A powerful and flexible filter builder component built with Vue 3 and TypeScript. This component allows users to create complex filter conditions with a user-friendly interface, supporting nested groups and multiple conditions.

## Features

- 🔍 Dynamic filter creation with support for multiple conditions
- 🌳 Nested filter groups with AND/OR operators
- 🎯 Type-safe implementation using TypeScript
- 🎨 Clean and intuitive user interface
- 📦 Modular component architecture
- 🔄 Real-time updates and state management
- 🎭 Customizable operators and field types

## Installation

```bash
# Clone the repository
git clone [your-repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   └── filter-builder/
│       ├── components/
│       │   ├── BaseFilterComponent.vue    # Base component with common functionality
│       │   ├── DropdownMenu.vue          # Reusable dropdown component
│       │   ├── FilterCondition.vue       # Individual filter condition component
│       │   └── FilterGroupComposite.vue  # Group component for nested filters
│       ├── types/
│       │   └── filter.types.ts           # TypeScript interfaces and types
│       └── utils/
│           └── operators.ts              # Operator definitions and utilities
```

## Components

### FilterGroupComposite

The main container component that implements the Composite pattern. It can contain both filter conditions and nested groups.

Features:
- Add/remove conditions and groups
- Toggle between AND/OR operators
- Nested structure support
- Real-time updates

### FilterCondition

Individual filter condition component that allows users to specify:
- Field selection
- Operator selection
- Value input

### DropdownMenu

Reusable dropdown component used for operator selection and other dropdown menus in the filter builder.

## Usage

```vue
<template>
  <FilterGroupComposite
    :fields="fields"
    :initial-operator="'AND'"
    @update="handleFilterUpdate"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FilterGroupComposite } from './components/filter-builder';

export default defineComponent({
  components: {
    FilterGroupComposite
  },
  setup() {
    const fields = [
      { id: 'name', label: 'Name', type: 'string' },
      { id: 'age', label: 'Age', type: 'number' },
      // Add more fields as needed
    ];

    const handleFilterUpdate = (filter: any) => {
      console.log('Filter updated:', filter);
      // Handle filter updates
    };

    return {
      fields,
      handleFilterUpdate
    };
  }
});
</script>
```

## Type System

The project uses TypeScript interfaces to ensure type safety:

- `IFilterComponent`: Base interface for all filter components
- `IFilterComposite`: Interface for group components
- `IFilterLeaf`: Interface for condition components
- `FilterField`: Interface for field definitions
- `Filter`: Interface for individual filter conditions
- `FilterGroup`: Interface for filter groups

## Design Patterns

The project implements several design patterns:
- **Composite Pattern**: For handling nested filter structures
- **Observer Pattern**: For state updates and event handling
- **Visitor Pattern**: For traversing and operating on filter trees

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Vue.js team for the amazing framework
- TypeScript team for the type system
- All contributors who have helped with the project
