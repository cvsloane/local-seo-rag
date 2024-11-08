export interface SearchResult {
  id: string;
  score: number;
  metadata: {
    text: string;
    title?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
}