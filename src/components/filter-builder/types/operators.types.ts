export interface FilterOperator {
  value: string;
  label: string;
}

export type LogicalOperator = 'AND' | 'OR';

export type StringOperator = 
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'isBlank'
  | 'isNotBlank';

export type NumberOperator = 
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between';

export type DateOperator = 
  | 'equals'
  | 'notEquals'
  | 'before'
  | 'after'
  | 'between';

export type BooleanOperator = 
  | 'equals'
  | 'notEquals';

export type FilterOperatorType = 
  | StringOperator
  | NumberOperator
  | DateOperator
  | BooleanOperator; 