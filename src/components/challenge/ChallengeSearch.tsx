import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface ChallengeSearchProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const ChallengeSearch: React.FC<ChallengeSearchProps> = ({
  onSearchChange,
  placeholder = 'Tìm kiếm...',
  debounceMs = 500,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Call parent callback when debounced query changes
  useEffect(() => {
    onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
      <input
        className='text-black p-[14px] pl-10 border border-[#919EAB52] rounded-[10px] w-full my-2'
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default ChallengeSearch;
