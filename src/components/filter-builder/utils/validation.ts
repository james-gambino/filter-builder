import { Filter, FilterGroup, FilterField } from '../types';
import { isValidOperatorForType } from './operators';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateFilter(filter: Filter, fields: FilterField[]): ValidationResult {
  const errors: string[] = [];

  // Проверка наличия поля
  if (!filter.field) {
    errors.push('Field is required');
  }

  // Проверка существования поля в списке доступных полей
  const field = fields.find(f => f.id === filter.field);
  if (!field) {
    errors.push('Selected field does not exist');
  }

  // Проверка наличия оператора
  if (!filter.operator) {
    errors.push('Operator is required');
  }

  // Проверка соответствия оператора типу поля
  if (field && filter.operator && !isValidOperatorForType(filter.operator, field.type)) {
    errors.push('Invalid operator for selected field type');
  }

  // Проверка значения
  if (filter.value === undefined || filter.value === '') {
    errors.push('Value is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateFilterGroup(group: FilterGroup, fields: FilterField[]): ValidationResult {
  const errors: string[] = [];

  // Проверка оператора группы
  if (!group.operator || !['AND', 'OR'].includes(group.operator)) {
    errors.push('Invalid group operator');
  }

  // Проверка условий
  const conditionResults = group.conditions.map(condition => 
    validateFilter(condition, fields)
  );

  // Проверка вложенных групп
  const groupResults = group.groups.map(subGroup => 
    validateFilterGroup(subGroup, fields)
  );

  // Сбор всех ошибок
  const allErrors = [
    ...errors,
    ...conditionResults.flatMap(result => result.errors),
    ...groupResults.flatMap(result => result.errors)
  ];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

export function createValidationRule(fields: FilterField[]) {
  return (value: Filter): string | null => {
    const result = validateFilter(value, fields);
    return result.isValid ? null : result.errors[0] || null;
  };
} 