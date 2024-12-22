import {FilterOperator} from "./types.ts";

export function getDefaultOperators(type: string): FilterOperator[] {
    const defaultOperators: Record<string, FilterOperator[]> = {
        string: [
            { value: 'contains', label: 'Contains' },
            { value: 'equals', label: 'Equals' },
        ],
        number: [
            { value: '>', label: 'Greater than' },
            { value: '<', label: 'Less than' },
        ],
        date: [
            { value: 'before', label: 'Before' },
            { value: 'after', label: 'After' },
        ],
    };
    return defaultOperators[type] || [];
}