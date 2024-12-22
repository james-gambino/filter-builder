import {VNode} from "vue";

export interface FilterGroup {
    operator: "AND" | "OR";
    children: Array<Filter | FilterGroup>;
}

export type DataType =
    | "number"
    | "numeric"
    | "string"
    | "date"
    | "datetime"
    | "boolean"
    | "object"
    | "array";

export interface FilterField {
    id: string;
    label: string;
    type: DataType;
    format?: (value: any) => string;
}

export interface FilterOperator {
    value: string;
    label: string;
}

// Base interface for the Composite pattern
export interface IFilterComponent {
    accept(visitor: IFilterVisitor): void;
    clone(): IFilterComponent;
    toJSON(): any;
}

// Composite interface
export interface IFilterComposite extends IFilterComponent {
    addChild(component: IFilterComponent): void;
    removeChild(component: IFilterComponent): void;
    getChildren(): IFilterComponent[];
}

// Leaf interface
export interface IFilterLeaf extends IFilterComponent {
    getValue(): any;
    setValue(value: any): void;
}

// Visitor interface for operations on the filter tree
export interface IFilterVisitor {
    visitGroup(group: FilterGroup): void;
    visitCondition(condition: Filter): void;
}

export interface Filter {
    field: string;
    operator: string;
    value: any;
}

export interface CustomOperation {
    render: (field: FilterField, filter: Filter, onUpdate: (filter: Filter) => void) => VNode;
}

export interface Localization {
    [operator: string]: string;
}

// Decorator interface
export interface IFilterDecorator extends IFilterComponent {
    getWrapped(): IFilterComponent;
}

// Filter validation interface
export interface IFilterValidation {
    validate(): boolean;
    getErrors(): string[];
}

// Filter serialization interface
export interface IFilterSerialization {
    serialize(): string;
    deserialize(data: string): void;
}