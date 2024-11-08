'use client';

import { useState } from 'react';
import { Message, Citation } from '@/types';

function CitationTooltip({ citation }: { citation: Citation }) {
  return (
    <div className="absolute bottom-full left-0 mb-2 p-2 bg-white shadow-lg rounded border w-64 z-10">
      <p className="text-sm">{citation.text}</p>
      {citation.metadata?.fileName && (
        <p className="text-xs text-gray-500 mt-1">
          Source: {citation.metadata.fileName}
        </p>
      )}
    </div>
  );
}

function MessageContent({ content, citations }: { content: string; citations?: Citation[] }) {
  const [hoveredCitation, setHoveredCitation] = useState<Citation | null>(null);

  if (!citations) {
    return <p>{content}</p>;
  }

  // Find citation markers in the content and replace them with clickable spans
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  const citationRegex = /\[citation: (.*?)\]/g;
  let match;

  while ((match = citationRegex.exec(content)) !== null) {
    // Add text before the citation
    if (match.index > lastIndex) {
      elements.push(content.slice(lastIndex, match.index));
    }

    // Find the corresponding citation
    const citedText = match[1];
    const citation = citations.find(c => c.text.includes(citedText));

    if (citation) {
      elements.push(
        <span
          key={match.index}
          className="relative text-blue-600 cursor-pointer hover:text-blue-800"
          onMouseEnter={() => setHoveredCitation(citation)}
          onMouseLeave={() => setHoveredCitation(null)}
        >
          [{citedText}]
          {hoveredCitation === citation && <CitationTooltip citation={citation} />}
        </span>
      );
    } else {
      elements.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < content.length) {
    elements.push(content.slice(lastIndex));
  }

  return <p>{elements}</p>;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const newMessage: Message = { role: 'user', content: input, file };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setFile(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, query: input, fileName: file?.name }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        console.error('Chat error:', data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result as string;

      try {
        const response = await fetch('/api/embed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content,
            fileName: file.name,
          }),
        });

        const data = await response.json();
        if (!data.success) {
          console.error('File upload error:', data.error);
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".txt,.md,.csv"
          className="mb-4"
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg min-h-[400px] mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <MessageContent content={msg.content} citations={msg.citations} />
          </div>
        ))}
        {loading && <div className="text-gray-500">Loading...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}