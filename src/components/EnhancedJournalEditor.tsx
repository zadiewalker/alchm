'use client';

import { useState } from 'react';

export interface EnhancedJournalEditorEntry {
  content: string;
  createdAt: Date;
}

export default function EnhancedJournalEditor({
  onSave,
  initialContent = '',
  className = '',
}: {
  onSave: (entry: EnhancedJournalEditorEntry) => void;
  initialContent?: string;
  className?: string;
}): React.JSX.Element {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSave({ content: trimmed, createdAt: new Date() });
    setContent('');
  };

  return (
    <div className={className}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        aria-label="Journal entry"
        placeholder="Write what is true right now..."
      />
      <button type="button" onClick={handleSave} disabled={!content.trim()}>
        Save entry
      </button>
    </div>
  );
}
