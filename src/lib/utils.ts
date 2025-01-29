import { Message, Citation } from '@/types';

export const formatMessages = (messages: Message[], context: string, citations: Citation[]): Message[] => {
  return [
    {
      role: 'system',
      content: `You are a helpful assistant that answers questions based on the provided context. 
                Always reference your sources using inline citations when providing information.
                Format citations like this: [citation: relevant portion of text]`,
    },
    ...messages.slice(0, -1),
    {
      role: 'user',
      content: `Context: ${context}\n\nQuestion: ${messages[messages.length - 1].content}\n\nCitations: ${citations.map(citation => citation.text).join(', ')}`,
    },
  ];
};