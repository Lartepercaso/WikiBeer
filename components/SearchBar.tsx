import React, { useState, useEffect } from 'react';
import { SearchIcon, CloseIcon } from '../constants';

interface SearchField {
    name: string;
    placeholder: string;
}

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: Record<string, string>) => void;
  fields: SearchField[];
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose, onSearch, fields }) => {
  const initialFilters = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);

  useEffect(() => {
    // Reset filters when fields change (e.g., switching from beers to breweries)
    setFilters(initialFilters);
  }, [fields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };
  
  const handleReset = () => {
    setFilters(initialFilters);
    onSearch({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-100/95 backdrop-blur-sm z-40 p-2 sm:p-4 shadow-lg animate-slide-down">
      <div className="container mx-auto flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 items-stretch sm:items-center sm:justify-center">
        {fields.map(field => (
          <input 
            key={field.name}
            type="text" 
            name={field.name} 
            placeholder={field.placeholder}
            value={filters[field.name]}
            onChange={handleInputChange}
            className="p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none w-full sm:w-auto"
          />
        ))}
        <button 
          onClick={handleSearch} 
          className="bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition flex items-center justify-center gap-2 w-full sm:w-auto">
          <SearchIcon className="w-5 h-5"/> Cerca
        </button>
        <button 
          onClick={handleReset} 
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition w-full sm:w-auto">
          Reset
        </button>
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-amber-800 hover:text-black">
          <CloseIcon className="w-6 h-6"/>
        </button>
      </div>
      <style>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SearchBar;