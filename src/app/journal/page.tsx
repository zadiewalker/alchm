'use client';

import { useState } from 'react';
import EmotionTag from '@/components/EmotionTag';
import QuoteBlock from '@/components/QuoteBlock';

type Messages = {
  title: string;
  emotionPlaceholder: string;
  contentPlaceholder: string;
  saveButton: string;
  successMessage: string;
};

type Props = {
  messages: Messages;
};

export default function Page({ messages }: Props) {
  const [emotion, setEmotion] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    try {
      setStatus('saving');
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion, content }),
      });

      if (!res.ok) throw new Error('Save failed');

      setContent('');
      setStatus('saved');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{messages.title}</h1>

      <EmotionTag
        value={emotion}
        onChange={setEmotion}
        placeholder={messages.emotionPlaceholder}
      />

      <textarea
        className="w-full border p-2 rounded"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={messages.contentPlaceholder}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSave}
        disabled={status === 'saving'}
      >
        {messages.saveButton}
      </button>

      {status === 'saved' && (
        <p className="text-green-600">✅ {messages.successMessage}</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">❌ Something went wrong. Try again.</p>
      )}

      <QuoteBlock />
    </main>
  );
}
