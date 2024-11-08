import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
  throw new Error('Missing Pinecone environment variables');
}

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const index = pinecone.Index(process.env.PINECONE_INDEX);