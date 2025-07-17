import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from '../../components/Autocomplete';
import { AutocompleteItem } from '../../types/autocomplete';

// Mock the useAutocomplete hook
vi.mock('../../hooks/useAutocomplete', () => ({
  useAutocomplete: vi.fn()
}));

import { useAutocomplete } from '../../hooks/useAutocomplete';

// Mock scrollIntoView
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
});

const mockItems: AutocompleteItem[] = [
  { id: '1', value: 'apple', label: 'Apple' },
  { id: '2', value: 'banana', label: 'Banana' },
  { id: '3', value: 'orange', label: 'Orange' },
];

const mockSelectedItems: AutocompleteItem[] = [
  { id: '1', value: 'apple', label: 'Apple' }
];

const defaultMockImplementation = {
  query: '',
  setQuery: vi.fn(),
  isOpen: false,
  setIsOpen: vi.fn(),
  highlightedIndex: -1,
  setHighlightedIndex: vi.fn(),
  filteredItems: [],
  selectItem: vi.fn(),
  removeItem: vi.fn(),
  createNewItem: vi.fn(),
  handleKeyDown: vi.fn()
};

describe('Autocomplete Component', () => {
  const mockOnSelectionChange = vi.fn();
  const mockOnCreateItem = vi.fn();
  const mockedUseAutocomplete = vi.mocked(useAutocomplete);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAutocomplete.mockReturnValue(defaultMockImplementation);
  });

  afterEach(() => {
    cleanup();
  });

  describe('Basic Rendering', () => {
    it('renders input with correct placeholder', () => {
      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
          placeholder="Search items..."
        />
      );

      expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
    });

    it('applies custom className and aria attributes', () => {
      const { container } = render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
          className="custom-class"
          aria-label="Custom label"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Custom label');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Selected Items Display', () => {
    it('displays selected items as tags with remove buttons', () => {
      render(
        <Autocomplete
          items={mockItems}
          selectedItems={mockSelectedItems}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByLabelText('Remove Apple')).toBeInTheDocument();
    });

    it('calls removeItem when remove button is clicked', async () => {
      const user = userEvent.setup();
      const mockRemoveItem = vi.fn();
      
      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        removeItem: mockRemoveItem
      });

      render(
        <Autocomplete
          items={mockItems}
          selectedItems={mockSelectedItems}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      await user.click(screen.getByLabelText('Remove Apple'));
      expect(mockRemoveItem).toHaveBeenCalledWith(mockSelectedItems[0]);
    });
  });

  describe('Dropdown Behavior', () => {
    it('renders dropdown when isOpen is true with filtered items', () => {
      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        isOpen: true,
        filteredItems: mockItems
      });

      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('highlights correct item and handles clicks', async () => {
      const user = userEvent.setup();
      const mockSelectItem = vi.fn();
      const mockSetHighlightedIndex = vi.fn();

      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        isOpen: true,
        filteredItems: mockItems,
        highlightedIndex: 1,
        selectItem: mockSelectItem,
        setHighlightedIndex: mockSetHighlightedIndex
      });

      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveClass('bg-blue-100 text-blue-900');

      await user.click(options[0]);
      expect(mockSelectItem).toHaveBeenCalledWith(mockItems[0]);

      await user.hover(options[1]);
      expect(mockSetHighlightedIndex).toHaveBeenCalledWith(1);
    });
  });

  describe('Create New Item Feature', () => {
    it('shows create option when conditions are met', () => {
      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        isOpen: true,
        query: 'new item',
        filteredItems: []
      });

      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
          onCreateItem={mockOnCreateItem}
          allowCreateNew={true}
        />
      );

      expect(screen.getByText('Create:')).toBeInTheDocument();
      expect(screen.getByText('"new item"')).toBeInTheDocument();
    });

    it('calls createNewItem when create option is clicked', async () => {
      const user = userEvent.setup();
      const mockCreateNewItem = vi.fn();

      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        isOpen: true,
        query: 'new item',
        filteredItems: [],
        createNewItem: mockCreateNewItem
      });

      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
          onCreateItem={mockOnCreateItem}
          allowCreateNew={true}
        />
      );

      const createOption = screen.getByText('Create:').closest('li');
      await user.click(createOption!);
      expect(mockCreateNewItem).toHaveBeenCalled();
    });
  });

  describe('Input Behavior and Keyboard Navigation', () => {
    it('handles input focus and keyboard events', async () => {
      const user = userEvent.setup();
      const mockSetIsOpen = vi.fn();
      const mockHandleKeyDown = vi.fn();

      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        query: 'test',
        setIsOpen: mockSetIsOpen,
        handleKeyDown: mockHandleKeyDown
      });

      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      expect(mockSetIsOpen).toHaveBeenCalledWith(true);

      await user.type(input, '{arrowdown}');
      expect(mockHandleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Max Items and Disabled State', () => {
    it('disables input when max items reached', () => {
      render(
        <Autocomplete
          items={mockItems}
          selectedItems={mockSelectedItems}
          onSelectionChange={mockOnSelectionChange}
          maxItems={1}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(screen.getByPlaceholderText('Maximum 1 items selected')).toBeInTheDocument();
    });

    it('respects disabled prop', () => {
      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
          disabled={true}
        />
      );

      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Click Outside Behavior', () => {
    it('closes dropdown when clicking outside', async () => {
      const mockSetIsOpen = vi.fn();
      
      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        isOpen: true,
        setIsOpen: mockSetIsOpen
      });

      render(
        <div>
          <Autocomplete
            items={mockItems}
            selectedItems={[]}
            onSelectionChange={mockOnSelectionChange}
          />
          <div data-testid="outside">Outside element</div>
        </div>
      );

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });
  });

  describe('Accessibility', () => {
    it('sets correct aria attributes for open dropdown', () => {
      mockedUseAutocomplete.mockReturnValue({
        ...defaultMockImplementation,
        isOpen: true,
        filteredItems: mockItems,
        highlightedIndex: 0
      });

      render(
        <Autocomplete
          items={mockItems}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-expanded', 'true');

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-label', 'Autocomplete suggestions');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });
  });
});