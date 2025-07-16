# Autocomplete Component

A generic React autocomplete component with multi-select and dynamic item creation.

## Quickstart

After installing, you can immediately see the component in action:

```bash
npm run storybook
```

## Features

- Predefined list of items to choose from
- Dynamic item creation when not found in suggestions
- Generic design - works with tags, addresses, or any data type
- Keyboard navigation (up/down arrows, enter)
- Visual display of selected items
- Remove selected items
- Web accessibility compliant (ARIA support)
- TypeScript support

## Installation

```bash
npm install autocomplete
```

Don't forget to import the CSS:

```tsx
import 'autocomplete/style.css';
```

## Requirements Met

**Functional Requirements:**
- ✓ Accepts predefined list of items
- ✓ Dynamic item creation when not found
- ✓ Generic implementation for various data types
- ✓ Keyboard navigation (up/down/enter)
- ✓ Selected items visible in component
- ✓ Selected items can be removed
- ✓ Web accessibility compliant

**Technical Requirements:**
- ✓ API-first design with clean props/callbacks
- ✓ Full test coverage with Vitest
- ✓ Decent styling with Tailwind CSS

## API

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `T[]` | Yes | Items to search through |
| `selectedItems` | `T[]` | Yes | Currently selected items |
| `onSelectionChange` | `(items: T[]) => void` | Yes | Selection change callback |
| `onCreateItem` | `(label: string) => void` | No | Create new item callback |
| `placeholder` | `string` | No | Input placeholder |
| `maxItems` | `number` | No | Maximum selectable items |
| `allowCreateNew` | `boolean` | No | Enable item creation |
| `disabled` | `boolean` | No | Disable component |
| `className` | `string` | No | Additional CSS classes |

### Data Type

Items must implement:

```tsx
interface AutocompleteItem {
  id: string | number;
  label: string;
}
```

## Keyboard Controls

- **Up/Down arrows** - Navigate suggestions
- **Enter** - Select highlighted item
- **Escape** - Close dropdown
- **Backspace** - Remove last selected item (empty input)

## Development

```bash
npm run dev          # Start Storybook
npm run build:lib    # Build library
npm run test         # Run tests
npm run coverage     # Test coverage
```

## Accessibility

- Full ARIA support
- Keyboard navigation
- Screen reader compatible
- Focus management
- Semantic HTML

Built with React + TypeScript + Tailwind CSS.