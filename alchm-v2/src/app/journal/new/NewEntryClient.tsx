'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';
import type { JournalEntry, PageState } from '@/lib/types';
import { clearDraft, getDraft, addEntry } from '@/lib/journal';
import { getSettings } from '@/lib/settings';
import { checkForCrisis } from '@/lib/crisis';
import { recordPathwayEntry } from '@/lib/pathways';
import { NewEntryEditor } from './NewEntryEditor';
import { NewEntryReflection } from './NewEntryReflection';
import { useDraftAutosave } from './useDraftAutosave';
import { useKheperaReflection } from './useKheperaReflection';

function makeId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function NewEntryClient() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<string>('');
  const [pathwayId, setPathwayId] = useState<string | null>(null);
  const [pathwayStep, setPathwayStep] = useState<number>(1);
  const [savedId, setSavedId] = useState<string | null>(null);
  const settings = useMemo(() => getSettings(), []);
  const { reflection, setReflection, reflectionError, setReflectionError, isReflecting, reflect } = useKheperaReflection({
    preferredFramework: settings.preferredFramework,
  });

  useEffect(() => {
    try {
      const draft = getDraft();
      if (draft?.content) setContent(String(draft.content));
      if (typeof draft?.mood === 'number') setMood(draft.mood);
      if (Array.isArray(draft?.tags)) setTags(draft.tags.join(', '));
      if (typeof draft?.pathwayId === 'string' && draft.pathwayId.trim()) setPathwayId(draft.pathwayId);
      if (typeof draft?.pathwayStep === 'number' && Number.isFinite(draft.pathwayStep)) setPathwayStep(draft.pathwayStep);
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  const crisis = useMemo(() => checkForCrisis(content), [content]);

  useDraftAutosave({
    enabled: settings.autoSaveEnabled,
    content,
    mood,
    tags,
    pathwayId,
    pathwayStep,
  });

  const onSave = useCallback(() => {
    const trimmed = content.trim();
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: makeId(),
      content: trimmed,
      mood,
      emotions: [],
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 12),
      type: 'journal',
      isPrivate: true,
      createdAt: now,
      updatedAt: now,
      pathwayId: pathwayId || undefined,
      pathwayStep: pathwayId ? pathwayStep : undefined,
    };

    const ok = addEntry(entry);
    if (!ok) {
      setState('error');
      return;
    }

    clearDraft();
    setSavedId(entry.id);
    setReflection('');
    setReflectionError('');

    if (pathwayId) recordPathwayEntry(entry);
  }, [content, mood, pathwayId, pathwayStep, tags, setReflection, setReflectionError]);

  const onReflect = useCallback(() => {
    if (!savedId) return;
    reflect(savedId);
  }, [reflect, savedId]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={() => router.push('/dashboard/')}
          aria-label="Return to dashboard"
          style={{
            border: 'none',
            background: 'transparent',
            color: DESIGN.colors.gold,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '15px',
            cursor: 'pointer',
            minHeight: '44px',
            padding: 0,
          }}
        >
          ← Dashboard
        </button>
        <button
          type="button"
          onClick={() => router.push('/journal/')}
          aria-label="Open journal list"
          style={{
            border: 'none',
            background: 'transparent',
            color: DESIGN.colors.gold,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
            minHeight: '44px',
            padding: '0 8px',
          }}
        >
          Journal →
        </button>
      </div>

      {state === 'loading' ? <LoadingState label="Preparing your page…" /> : null}
      {state === 'error' ? <ErrorState message="ALCHM couldn't open the editor. Try again." onRetry={() => router.refresh()} /> : null}

      {state === 'ready' ? (
        <>
          <NewEntryEditor
            content={content}
            setContent={setContent}
            mood={mood}
            setMood={setMood}
            tags={tags}
            setTags={setTags}
            pathwayId={pathwayId}
            pathwayStep={pathwayStep}
            crisis={crisis}
            onSave={onSave}
            canSave={!!content.trim()}
          />

          <NewEntryReflection
            visible={!!savedId}
            isReflecting={isReflecting}
            reflection={reflection}
            reflectionError={reflectionError}
            onReflect={onReflect}
          />
        </>
      ) : null}
    </div>
  );
}
