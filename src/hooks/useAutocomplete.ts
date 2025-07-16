import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { AutocompleteItem } from '../types/autocomplete';

// Custom hook for managing autocomplete state
export const useAutocomplete = <T extends AutocompleteItem>(
  items: T[],
  selectedItems: T[],
  onSelectionChange: (items: T[]) => void,
  onCreateItem?: (value: string) => T
) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  // Filter items based on query and exclude already selected items
  useEffect(() => {
    if (!query.trim()) {
      setFilteredItems([]);
      return;
    }

    const selectedIds = new Set(selectedItems.map(item => item.id));
    const filtered = items.filter(item => 
      !selectedIds.has(item.id) && 
      item.label.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredItems(filtered);
    setHighlightedIndex(-1);
  }, [query, items, selectedItems]);

  const selectItem = useCallback((item: T) => {
    if (selectedItems.find(selected => selected.id === item.id)) return;
    
    onSelectionChange([...selectedItems, item]);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [selectedItems, onSelectionChange]);

  const removeItem = useCallback((itemToRemove: T) => {
    onSelectionChange(selectedItems.filter(item => item.id !== itemToRemove.id));
  }, [selectedItems, onSelectionChange]);

  const createNewItem = useCallback(() => {
    if (!onCreateItem || !query.trim()) return;
    
    const newItem = onCreateItem(query.trim());
    selectItem(newItem);
  }, [query, onCreateItem, selectItem]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const totalOptions = filteredItems.length + (onCreateItem && query.trim() ? 1 : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < totalOptions - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : totalOptions - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          selectItem(filteredItems[highlightedIndex]);
        } else if (highlightedIndex === filteredItems.length && onCreateItem && query.trim()) {
          createNewItem();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, filteredItems, highlightedIndex, onCreateItem, query, selectItem, createNewItem]);

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    filteredItems,
    selectItem,
    removeItem,
    createNewItem,
    handleKeyDown
  };
};