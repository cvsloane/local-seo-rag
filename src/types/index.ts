export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  file?: File | null; // Add this line to include the file property
}

export interface Citation {
  text: string;
  // We'll store the chunk ID to trace back to the original source if needed
  chunkId: string;
  // Optional metadata about the source
  metadata?: {
    fileName?: string;
    pageNumber?: number;
    timestamp?: string;
  };
}

export interface ChatResponse {
  message: Message;
  success: boolean;
  error?: string;
}

export interface EmbeddingResponse {
  success: boolean;
  error?: string;
}