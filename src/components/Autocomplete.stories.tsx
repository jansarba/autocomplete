import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from './Autocomplete';
import { AutocompleteItem } from '../types/autocomplete';
import { programmingLanguages, webTechnologies, sampleAddresses } from '../data/sampleData';

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      // div wrap
      <div style={{ minHeight: '200px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: { control: false },
    selectedItems: { control: false },
    onSelectionChange: { action: 'onSelectionChange' },
    onCreateItem: { action: 'onCreateItem' },
  },
  render: function Render(args) {
    const [selected, setSelected] = useState(args.selectedItems || []);

    const handleSelectionChange = (newSelection: AutocompleteItem[]) => {
      args.onSelectionChange(newSelection);
      setSelected(newSelection);
    };

    return (
      <div style={{ width: '448px' }}>
        <Autocomplete
          {...args}
          selectedItems={selected}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    );
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProgrammingLanguages: Story = {
  name: 'Languages (Creatable)',
  render: function Render(args) {
    const [currentItems, setCurrentItems] = useState(args.items);
    const [selected, setSelected] = useState(args.selectedItems || []);

    const handleCreateItem = (value: string) => {
      args.onCreateItem?.(value);
      const newItem = {
        id: `custom-lang-${Date.now()}`,
        value: value.toLowerCase().replace(/\s+/g, '-'),
        label: value,
      };
      setCurrentItems(prev => [...prev, newItem]);
      setSelected(prev => [...prev, newItem]);
      return newItem;
    };

    const handleSelectionChange = (newSelection: AutocompleteItem[]) => {
      args.onSelectionChange(newSelection);
      setSelected(newSelection);
    };

    return (
      <div style={{ width: '448px' }}>
        <Autocomplete
          {...args}
          items={currentItems}
          selectedItems={selected}
          onSelectionChange={handleSelectionChange}
          onCreateItem={handleCreateItem}
        />
      </div>
    );
  },
  args: {
    items: programmingLanguages,
    selectedItems: [],
    allowCreateNew: true,
    placeholder: 'Search programming languages...',
    'aria-label': 'Programming languages autocomplete',
    // This is required to satisfy TypeScript's static analysis
    onSelectionChange: () => {},
  },
};

export const WebTechnologies: Story = {
  name: 'Web Tech (Max 3 Items)',
  args: {
    items: webTechnologies,
    selectedItems: [webTechnologies[0]],
    maxItems: 3,
    placeholder: 'Search web technologies...',
    'aria-label': 'Web technologies autocomplete',
    // This is required to satisfy TypeScript's static analysis
    onSelectionChange: () => {},
  },
};

export const Addresses: Story = {
  name: 'Addresses (No Creation)',
  args: {
    items: sampleAddresses,
    selectedItems: [],
    allowCreateNew: false,
    placeholder: 'Search addresses...',
    'aria-label': 'Addresses autocomplete',
    // This is required to satisfy TypeScript's static analysis
    onSelectionChange: () => {},
  },
};

export const Disabled: Story = {
  name: 'Disabled State',
  args: {
    items: programmingLanguages,
    selectedItems: [programmingLanguages[0]],
    disabled: true,
    placeholder: 'This input is disabled',
    // This is required to satisfy TypeScript's static analysis
    onSelectionChange: () => {},
  },
};