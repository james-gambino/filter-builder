import { FilterOperator } from '../types';

export const LOGICAL_OPERATORS: FilterOperator[] = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' }
];

export const STRING_OPERATORS: FilterOperator[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'isBlank', label: 'Is blank' },
  { value: 'isNotBlank', label: 'Is not blank' }
];

export const NUMBER_OPERATORS: FilterOperator[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not equals' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'lessThan', label: 'Less than' },
  { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
  { value: 'lessThanOrEqual', label: 'Less than or equal' },
  { value: 'between', label: 'Between' }
];

export const DATE_OPERATORS: FilterOperator[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not equals' },
  { value: 'before', label: 'Before' },
  { value: 'after', label: 'After' },
  { value: 'between', label: 'Between' }
];

export const BOOLEAN_OPERATORS: FilterOperator[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not equals' }
]; 