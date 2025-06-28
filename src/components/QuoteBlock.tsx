'use client';

import { useState } from 'react';
import { saveJournalEntry } from '../lib/saveJournalEntry'; // ✅ Adjust if the file is actually firestore.ts

type QuoteBlockProps = {
  messages: {
    quotePlaceholder: string;
    quoteSaveButton: string;
    quoteSuccessMessage: string;
    quoteErrorMessage: string;
  };
};

export default function QuoteBlock({ messages }: QuoteBlockProps) {
  const [quote, setQuote] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSaveQuote = async () => {
    setStatus('saving');
    try {
      const id = await saveJournalEntry('quote', quote);
      console.log('✅ Quote saved with ID:', id);
      setQuote('');
      setStatus('saved');
    } catch (error) {
      console.error('❌ Could not save quote:', error);
      setStatus('error');
    }
  };

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Favorite Quote</h2>
      <textarea
        className="w-full border p-2 rounded"
        rows={3}
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder={messages.quotePlaceholder}
      />
      <button
        className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
        onClick={handleSaveQuote}
      >
        {messages.quoteSaveButton}
      </button>

      {status === 'saved' && (
        <p className="text-green-600 mt-2">{messages.quoteSuccessMessage}</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 mt-2">{messages.quoteErrorMessage}</p>
      )}
    </div>
  );
}
