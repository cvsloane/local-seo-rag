'use client';

import { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => Promise<void>;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSearch(query);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your search query..."
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}