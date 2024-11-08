import { pinecone } from '@/lib/pinecone';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { vector } = await req.json();
    
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME || '');
    
    const queryResult = await index.query({
      vector,
      topK: 5,
      includeMetadata: true
    });

    return NextResponse.json({ results: queryResult.matches });
  } catch (error) {
    console.error('Error searching vectors:', error);
    return NextResponse.json({ error: 'Failed to search vectors' }, { status: 500 });
  }
}