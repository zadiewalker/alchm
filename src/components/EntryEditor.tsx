'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TextArea } from '@/components/ui/textarea';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useUpdateJournal } from '@/hooks/useJournal';
import { JournalEntry } from '@/lib/journal-service';

interface EntryEditorProps {
  entry: JournalEntry;
  onClose: () => void;
  onSave?: () => void;
}

export default function EntryEditor({ entry, onClose, onSave }: EntryEditorProps) {
  const [content, setContent] = useState(entry.content);
  const [mood, setMood] = useState(entry.mood || 5);
  const [isEditing, setIsEditing] = useState(false);
  const { updateEntry, updating } = useUpdateJournal();

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const hasChanges = content !== entry.content || mood !== entry.mood;

  const handleSave = async () => {
    if (!hasChanges || !entry.id) return;

    try {
      await updateEntry(entry.id, {
        content,
        mood,
        isEncrypted: entry.isEncrypted // Maintain encryption status
      });
      
      setIsEditing(false);
      if (onSave) onSave();
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const handleCancel = () => {
    setContent(entry.content);
    setMood(entry.mood || 5);
    setIsEditing(false);
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-medium mb-1">
              {isEditing ? 'Edit Entry' : 'View Entry'}
            </h2>
            <p className="text-sm text-[var(--ink-mute)]">
              {formatDate(entry.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-sm underline hover:opacity-80 transition-opacity duration-base"
          >
            Close
          </button>
        </div>

        {/* Mood selector (only in edit mode) */}
        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Mood (1-10)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">😔</span>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm">😊</span>
              <span className="ml-2 text-sm font-medium w-8">{mood}</span>
            </div>
          </div>
        )}

        {/* Content */}
        {isEditing ? (
          <div className="mb-4">
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ minHeight: '300px' }}
              className="mb-2"
            />
            <div className="text-xs text-[var(--ink-mute)]">
              {wordCount} words
            </div>
          </div>
        ) : (
          <div className="mb-4">
            {entry.mood && (
              <div className="mb-3 flex items-center gap-2">
                <span>Mood: {entry.mood}/10</span>
                <span>{entry.mood <= 3 ? '😔' : entry.mood <= 6 ? '😐' : '😊'}</span>
              </div>
            )}
            <div className="whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
            <div className="mt-3 text-xs text-[var(--ink-mute)]">
              {wordCount} words {entry.isEncrypted && '• Encrypted'}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
          {isEditing ? (
            <>
              <PrimaryButton 
                onClick={handleSave}
                disabled={!hasChanges || updating}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
              <button
                onClick={handleCancel}
                className="text-sm underline decoration-[var(--terra)] hover:opacity-80 transition-opacity duration-base"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="h-12 px-6 rounded-2xl border border-[var(--line)] bg-white hover:bg-[var(--blush)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra)] transition-all duration-base"
              >
                Edit Entry
              </button>
              <div className="text-xs text-[var(--ink-mute)]">
                {entry.updatedAt && 'Last edited: ' + formatDate(entry.updatedAt)}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}