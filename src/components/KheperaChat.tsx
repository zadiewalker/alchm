'use client';

import { useState } from 'react';

export default function KheperaChat({ userInput }: { userInput: string }) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKhepera = async () => {
    setLoading(true);
    const res = await fetch('/api/khepera', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: userInput }),
    });
    const data = await res.json();
    setResponse(data.reply);
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleKhepera}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Ask Khepera
      </button>
      {loading && <p className="mt-2 text-gray-400">Khepera is thinking...</p>}
      {response && <p className="mt-2 text-green-300 italic">{response}</p>}
    </div>
  );
}
