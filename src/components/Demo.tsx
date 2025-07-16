import { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { AutocompleteItem } from '../types/autocomplete';
import { programmingLanguages, webTechnologies, sampleAddresses } from '../data/sampleData';

const Demo: React.FC = () => {
  const [selectedLanguages, setSelectedLanguages] = useState<AutocompleteItem[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<AutocompleteItem[]>([]);
  const [selectedAddresses, setSelectedAddresses] = useState<AutocompleteItem[]>([]);

  // Function to create new items dynamically
  const createNewLanguage = (value: string): AutocompleteItem => ({
    id: `custom-lang-${Date.now()}`,
    value: value.toLowerCase().replace(/\s+/g, '-'),
    label: value
  });

  const createNewTechnology = (value: string): AutocompleteItem => ({
    id: `custom-tech-${Date.now()}`,
    value: value.toLowerCase().replace(/\s+/g, '-'),
    label: value
  });

//   const createNewAddress = (value: string): AutocompleteItem => ({
//     id: `custom-addr-${Date.now()}`,
//     value: value.toLowerCase().replace(/\s+/g, '-'),
//     label: value
//   });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generic Autocomplete Component
        </h1>
        <p className="text-gray-600">
          Fully typed, accessible, and production-ready!
        </p>
      </div>

      {/* Example 1 - Programming Languages */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Programming Languages
        </h2>
        <p className="text-gray-600 mb-4">
          Select your favorite programming languages. You can create new ones if not found.
        </p>
        
        <Autocomplete
          items={programmingLanguages}
          selectedItems={selectedLanguages}
          onSelectionChange={setSelectedLanguages}
          onCreateItem={createNewLanguage}
          placeholder="Search programming languages..."
          aria-label="Programming languages autocomplete"
          className="mb-4"
        />
        
        <div className="text-sm text-gray-600">
          Selected: {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Example 2 - Web Technologies (max 3) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Web Technologies (Max 3)
        </h2>
        <p className="text-gray-600 mb-4">
          Select up to 3 web technologies. Custom creation is enabled.
        </p>
        
        <Autocomplete
          items={webTechnologies}
          selectedItems={selectedTechnologies}
          onSelectionChange={setSelectedTechnologies}
          onCreateItem={createNewTechnology}
          placeholder="Search web technologies..."
          maxItems={3}
          aria-label="Web technologies autocomplete"
          className="mb-4"
        />
        
        <div className="text-sm text-gray-600">
          Selected: {selectedTechnologies.length}/3 technolog{selectedTechnologies.length !== 1 ? 'ies' : 'y'}
        </div>
      </div>

      {/* Example 3 - Sample Addresses (no custom creation) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Sample Addresses
        </h2>
        <p className="text-gray-600 mb-4">
          Select addresses from predefined list. Custom creation is disabled.
        </p>
        
        <Autocomplete
          items={sampleAddresses}
          selectedItems={selectedAddresses}
          onSelectionChange={setSelectedAddresses}
          placeholder="Search addresses..."
          allowCreateNew={false}
          aria-label="Addresses autocomplete"
          className="mb-4"
        />
        
        <div className="text-sm text-gray-600">
          Selected: {selectedAddresses.length} address{selectedAddresses.length !== 1 ? 'es' : ''}
        </div>
      </div>

      {/* Features List */}
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <div className="text-sm text-gray-700">
          I hope you enjoy!
        </div>
      </div>
    </div>
  );
};

export default Demo;