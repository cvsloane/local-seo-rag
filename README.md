# Next.js RAG Implementation with OpenAI and Pinecone

A complete AI Retrieval Augmented Generation (RAG) implementation using Next.js 14, OpenAI API v4, and Pinecone vector database. This application allows users to upload documents, process them into embeddings, and ask questions about the content with cited responses.

## Features

- 🚀 Built with Next.js 14 and TypeScript
- 💬 OpenAI GPT-4 Turbo integration
- 📚 Pinecone vector database for efficient retrieval
- 📝 Document upload and processing
- 🔍 Source citations in responses
- ⚡ Real-time chat interface
- 🎯 Type-safe implementation
- 🔐 Proper error handling

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.17 or later
- npm or yarn
- OpenAI API key
- Pinecone account and API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index_name
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextjs-rag
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Document Upload

1. Click the file upload button
2. Select a text file (.txt, .md, or .csv)
3. The document will be processed and stored in the vector database

### Asking Questions

1. Type your question in the chat input
2. Press Enter or click Send
3. The response will include citations from the uploaded documents
4. Hover over citations to see the source text

## Project Structure

Inside the `src` directory at the project root:

```plaintext
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   └── embed/
│   │       └── route.ts
│   └── page.tsx
├── components/
│   └── chat.tsx
├── lib/
│   ├── openai.ts
│   ├── pinecone.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── .env.local
└── package.json
```

## API Routes

### POST /api/chat

Handles chat completions with context retrieval.

Request body:

```typescript
{
  messages: Message[];
  query: string;
}
```

### POST /api/embed

Processes and stores document embeddings.

Request body:

```typescript
{
  content: string;
  fileName: string;
}
```

## Types

### Message

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
}
```

### Citation

```typescript
interface Citation {
  text: string;
  chunkId: string;
  metadata?: {
    fileName?: string;
    pageNumber?: number;
    timestamp?: string;
  };
}
```

## Configuration

### OpenAI

- Model: GPT-4 Turbo Preview
- Embeddings: text-embedding-3-small
- Temperature: 0.7
- Max tokens: 500

### Pinecone

- Dimensions: 1536 (OpenAI embeddings)
- Metric: Cosine similarity
- Top-K: 3 matches per query

## Implementation Details

### Document Processing

1. Documents are split into chunks of approximately 1000 characters
2. Each chunk is embedded using OpenAI's embedding model
3. Embeddings are stored in Pinecone with metadata

### Query Process

1. User question is embedded
2. Similar chunks are retrieved from Pinecone
3. Context is provided to GPT-4 with the question
4. Response is generated with inline citations

### Citation System

- Citations are tracked through chunk IDs
- Source metadata is preserved
- Citations are displayed as interactive elements
- Hover tooltips show source context

## Dependencies

```json
{
  "@pinecone-database/pinecone": "^2.0.1",
  "next": "14.1.0",
  "openai": "^4.28.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "zod": "^3.22.4"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues and feature requests, please open an issue in the repository.

## Acknowledgments

- OpenAI for the GPT-4 and embeddings API
- Pinecone for vector similarity search
- Next.js team for the amazing framework