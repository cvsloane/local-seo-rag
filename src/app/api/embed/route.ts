import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { index } from '@/lib/pinecone';
import { formatMessages } from '@/lib/utils';
import { ChatResponse, Citation } from '@/types';
import { z } from 'zod';

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    citations: z.array(z.object({
      text: z.string(),
      chunkId: z.string(),
      metadata: z.object({
        fileName: z.string().optional(),
        pageNumber: z.number().optional(),
        timestamp: z.string().optional(),
      }).optional(),
    })).optional(),
  })),
  query: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const body = await req.json();
    const { messages, query } = chatRequestSchema.parse(body);

    // Get embeddings for the query
    const queryEmbedding = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      input: query,
    });

    // Search Pinecone
    const results = await index.query({
      vector: queryEmbedding.data[0].embedding,
      topK: 3,
      includeMetadata: true,
    });

    // Prepare citations and context
    const citations: Citation[] = results.matches.map((match) => ({
      text: String(match.metadata?.text || ''),
      chunkId: String(match.metadata?.chunkId || match.id),
      metadata: {
        fileName: typeof match.metadata?.fileName === 'string' ? match.metadata.fileName : undefined,
        timestamp: typeof match.metadata?.timestamp === 'string' ? match.metadata.timestamp : undefined,
      },
    }));

    const context = citations
      .map((citation) => citation.text)
      .join('\n');

    // Format messages with context
    const messagesWithContext = formatMessages(messages, context, citations);

    // Get completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo-preview',
      messages: messagesWithContext,
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: completion.choices[0].message.content || '',
        citations,
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      success: false,
      message: {
        role: 'assistant',
        content: 'An error occurred while processing your request.',
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}