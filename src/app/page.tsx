'use client';

import { useState } from 'react';
import SearchForm from '@/components/search-form';
import SearchResults from '@/components/search-results';
import type { SearchResult } from '@/types';

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async (query: string) => {
    try {
      // First, get the embedding for the search query
      const embedResponse = await fetch('/api/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });
      
      const { embedding } = await embedResponse.json();

      // Then, search for similar vectors in Pinecone
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vector: embedding }),
      });

      const { results } = await searchResponse.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
      alert('Failed to perform search');
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Semantic Search with Pinecone</h1>
      <SearchForm onSearch={handleSearch} />
      <SearchResults results={searchResults} />
    </main>
  );
}
