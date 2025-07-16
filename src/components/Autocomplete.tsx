import React, { useEffect, useRef } from 'react';
import { AutocompleteItem, AutocompleteProps } from '../types/autocomplete';
import { useAutocomplete } from '../hooks/useAutocomplete';

export const Autocomplete = <T extends AutocompleteItem>({
  items,
  selectedItems,
  onSelectionChange,
  onCreateItem,
  placeholder = 'Type to search...',
  maxItems,
  allowCreateNew = true,
  className = '',
  disabled = false,
  'aria-label': ariaLabel = 'Autocomplete input'
}: AutocompleteProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const {
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
  } = useAutocomplete(items, selectedItems, onSelectionChange, onCreateItem);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        (!listRef.current || !listRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleInputFocus = () => {
    if (query.length > 0) {
      setIsOpen(true);
    }
  };

  const canCreateNew = allowCreateNew && onCreateItem && query.trim() && 
    !filteredItems.some(item => item.label.toLowerCase() === query.toLowerCase());

  const isMaxItemsReached = maxItems && selectedItems.length >= maxItems;

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Selected items tags */}
      {selectedItems.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {selectedItems.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {item.label}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                aria-label={`Remove ${item.label}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={isMaxItemsReached ? `Maximum ${maxItems} items selected` : placeholder}
          disabled={disabled || !!isMaxItemsReached}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown list */}
      {isOpen && (filteredItems.length > 0 || canCreateNew) && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Autocomplete suggestions"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredItems.map((item, index) => (
            <li
              key={item.id}
              role="option"
              aria-selected={highlightedIndex === index}
              className={`px-3 py-2 cursor-pointer ${
                highlightedIndex === index
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => selectItem(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {item.label}
            </li>
          ))}
          
          {canCreateNew && (
            <li
              role="option"
              aria-selected={highlightedIndex === filteredItems.length}
              className={`px-3 py-2 cursor-pointer border-t border-gray-200 ${
                highlightedIndex === filteredItems.length
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              onClick={createNewItem}
              onMouseEnter={() => setHighlightedIndex(filteredItems.length)}
            >
              <span className="font-medium">Create: </span>
              <span className="text-blue-600">"{query}"</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};