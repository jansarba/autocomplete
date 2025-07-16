// Generic interface for autocomplete items
export interface AutocompleteItem {
  id: string;
  value: string;
  label: string;
}

// Props interface for the autocomplete component
export interface AutocompleteProps<T extends AutocompleteItem> {
  items: T[];
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  onCreateItem?: (value: string) => T;
  placeholder?: string;
  maxItems?: number;
  allowCreateNew?: boolean;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}