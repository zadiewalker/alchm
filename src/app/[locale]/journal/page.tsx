'use client'

import { useState } from 'react'

const DEFAULT_TITLE = 'Journal'

interface JournalPageProps {
  messages: {
    title?: string
    contentPlaceholder?: string
  }
}

export default function JournalPage({ messages }: JournalPageProps) {
  const [content, setContent] = useState('')
  const [reflection, setReflection] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReflect() {
    setLoading(true)
    const res = await fetch('/api/khepera', {
      method: 'POST',
      body: JSON.stringify({ prompt: content }),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    setReflection(data.message)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {messages?.title || DEFAULT_TITLE}
      </h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={messages?.contentPlaceholder || "What's on your heart today?"}
        className="w-full mt-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleReflect}
        className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
      >
        {loading ? 'Khepera is thinking...' : 'Reflect with Khepera'}
      </button>

      {reflection && (
        <div className="mt-6 p-4 bg-black text-white border border-gray-600 rounded">
          <h2 className="text-lg font-semibold mb-2">Khepera Reflects:</h2>
          <p>{reflection}</p>
        </div>
      )}
    </div>
  )
}
