import { FilterOperator, DataType } from '../types';
import {
  STRING_OPERATORS,
  NUMBER_OPERATORS,
  DATE_OPERATORS,
  BOOLEAN_OPERATORS
} from '../constants';

export function getOperatorsByType(type: DataType): FilterOperator[] {
  const operatorMap: Record<DataType, FilterOperator[]> = {
    string: STRING_OPERATORS,
    number: NUMBER_OPERATORS,
    numeric: NUMBER_OPERATORS,
    date: DATE_OPERATORS,
    datetime: DATE_OPERATORS,
    boolean: BOOLEAN_OPERATORS,
    object: [],
    array: []
  };

  return operatorMap[type] || [];
}

export function isValidOperatorForType(operator: string, type: DataType): boolean {
  const operators = getOperatorsByType(type);
  return operators.some(op => op.value === operator);
}

export function getDefaultOperatorForType(type: DataType): string {
  const operators = getOperatorsByType(type);
  return operators[0]?.value || 'equals';
}

export function formatOperatorLabel(operator: string, localization: Record<string, string>): string {
  return localization[operator] || operator;
} 