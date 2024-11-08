'use client';

import { SearchResult } from '@/types';

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4 mt-8">
      {results.map((result) => (
        <div
          key={result.id}
          className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
        >
          {result.metadata.title && (
            <h3 className="font-bold mb-2">{result.metadata.title}</h3>
          )}
          <p>{result.metadata.text}</p>
          <p className="text-sm text-gray-500 mt-2">
            Similarity score: {result.score.toFixed(3)}
          </p>
        </div>
      ))}
    </div>
  );
}