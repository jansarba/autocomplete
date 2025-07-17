import { KeyboardEvent } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import { AutocompleteItem } from '../../types/autocomplete';

const mockItems: AutocompleteItem[] = [
  { id: '1', value: 'apple', label: 'Apple' },
  { id: '2', value: 'banana', label: 'Banana' },
  { id: '3', value: 'orange', label: 'Orange' },
  { id: '4', value: 'grape', label: 'Grape' },
];

const mockSelectedItems: AutocompleteItem[] = [
  { id: '1', value: 'apple', label: 'Apple' },
];

const mockEmptySelectedItems: AutocompleteItem[] = [];

describe('useAutocomplete Hook', () => {
  const mockOnSelectionChange = vi.fn();
  const mockOnCreateItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('initializes with correct default values', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      expect(result.current.query).toBe('');
      expect(result.current.isOpen).toBe(false);
      expect(result.current.highlightedIndex).toBe(-1);
      expect(result.current.filteredItems).toEqual([]);
    });
  });

  describe('Query and Filtering', () => {
    it('filters items based on query', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('ap');
      });

      expect(result.current.filteredItems).toEqual([
        { id: '1', value: 'apple', label: 'Apple' },
        { id: '4', value: 'grape', label: 'Grape' },
      ]);
    });

    it('excludes selected items from filtered results', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockSelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('ap');
      });

      expect(result.current.filteredItems).toEqual([
        { id: '4', value: 'grape', label: 'Grape' },
      ]);
    });

    it('returns empty array when query is empty', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('');
      });

      expect(result.current.filteredItems).toEqual([]);
    });

    it('resets highlighted index when query changes', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('ap');
      });

      act(() => {
        result.current.setHighlightedIndex(1);
      });

      expect(result.current.highlightedIndex).toBe(1);

      act(() => {
        result.current.setQuery('ban');
      });

      expect(result.current.highlightedIndex).toBe(-1);
    });
  });

  describe('Item Selection', () => {
    it('selects item and updates selection', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.selectItem(mockItems[0]);
      });

      expect(mockOnSelectionChange).toHaveBeenCalledWith([mockItems[0]]);
    });

    it('adds item to existing selection', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockSelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.selectItem(mockItems[1]);
      });

      expect(mockOnSelectionChange).toHaveBeenCalledWith([
        mockSelectedItems[0],
        mockItems[1],
      ]);
    });

    it('does not select already selected item', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockSelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.selectItem(mockSelectedItems[0]);
      });

      expect(mockOnSelectionChange).not.toHaveBeenCalled();
    });

    it('clears query and closes dropdown after selection', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('test');
        result.current.setIsOpen(true);
        result.current.selectItem(mockItems[0]);
      });

      expect(result.current.query).toBe('');
      expect(result.current.isOpen).toBe(false);
      expect(result.current.highlightedIndex).toBe(-1);
    });
  });

  describe('Item Removal', () => {
    it('removes item from selection', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockSelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.removeItem(mockSelectedItems[0]);
      });

      expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
    });

    it('removes correct item from multiple selected items', () => {
      const multipleSelected = [mockItems[0], mockItems[1]];
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, multipleSelected, mockOnSelectionChange)
      );

      act(() => {
        result.current.removeItem(mockItems[0]);
      });

      expect(mockOnSelectionChange).toHaveBeenCalledWith([mockItems[1]]);
    });
  });

  describe('Create New Item', () => {
    beforeEach(() => {
      mockOnCreateItem.mockReturnValue({ id: 'new', value: 'new-item', label: 'New Item' });
    });

    it('creates new item when query exists', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange, mockOnCreateItem)
      );

      act(() => {
        result.current.setQuery('new item');
      });

      act(() => {
        result.current.createNewItem();
      });

      expect(mockOnCreateItem).toHaveBeenCalledWith('new item');
      expect(mockOnSelectionChange).toHaveBeenCalledWith([
        { id: 'new', value: 'new-item', label: 'New Item' },
      ]);
    });

    it('does not create item when query is empty', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange, mockOnCreateItem)
      );

      act(() => {
        result.current.setQuery('');
        result.current.createNewItem();
      });

      expect(mockOnCreateItem).not.toHaveBeenCalled();
    });

    it('trims whitespace from query before creating', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange, mockOnCreateItem)
      );
      
      act(() => {
        result.current.setQuery('  new item  ');
      });

      act(() => {
        result.current.createNewItem();
      });

      expect(mockOnCreateItem).toHaveBeenCalledWith('new item');
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles arrow down navigation', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('a');
        result.current.setIsOpen(true);
      });

      const mockEvent = { key: 'ArrowDown', preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.highlightedIndex).toBe(0);
    });

    it('handles arrow up navigation', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('a');
        result.current.setIsOpen(true);
      });

      act(() => {
        result.current.setHighlightedIndex(1);
      });

      const mockEvent = { key: 'ArrowUp', preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.highlightedIndex).toBe(0);
    });

    it('wraps around at boundaries during navigation', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );
      
      act(() => {
        result.current.setQuery('ap');
        result.current.setIsOpen(true);
      });

      act(() => {
        result.current.setHighlightedIndex(1);
      });

      const mockEvent = { key: 'ArrowDown', preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.highlightedIndex).toBe(0);
    });

    it('handles Enter key to select highlighted item', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setQuery('a');
        result.current.setIsOpen(true);
      });

      act(() => {
        result.current.setHighlightedIndex(0);
      });

      const expectedItem = result.current.filteredItems[0];
      const mockEvent = { key: 'Enter', preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnSelectionChange).toHaveBeenCalledWith([expectedItem]);
    });

    it('handles Enter key to create new item', () => {
      mockOnCreateItem.mockReturnValue({ id: 'new', value: 'new item', label: 'New Item' });

      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange, mockOnCreateItem)
      );

      act(() => {
        result.current.setQuery('new item');
        result.current.setIsOpen(true);
      });
      
      const createItemIndex = result.current.filteredItems.length;
      act(() => {
        result.current.setHighlightedIndex(createItemIndex);
      });

      const mockEvent = { key: 'Enter', preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockOnCreateItem).toHaveBeenCalledWith('new item');
    });

    it('handles Escape key to close dropdown', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setIsOpen(true);
        result.current.setHighlightedIndex(1);
      });

      const mockEvent = { key: 'Escape', preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.highlightedIndex).toBe(-1);
    });

    it('ignores keyboard events when dropdown is closed', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      const mockEvent = { key: 'ArrowDown', preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(result.current.highlightedIndex).toBe(-1);
    });
  });

  describe('State Management', () => {
    it('updates isOpen state correctly', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('updates highlightedIndex state correctly', () => {
      const { result } = renderHook(() =>
        useAutocomplete(mockItems, mockEmptySelectedItems, mockOnSelectionChange)
      );

      act(() => {
        result.current.setHighlightedIndex(2);
      });

      expect(result.current.highlightedIndex).toBe(2);
    });
  });
});