
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from '@/router';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { DESIGN } from '@/lib/design';
import { addEntry, clearDraft, getDraft, saveDraft } from '@/lib/journal';
import { checkForCrisis, type CrisisCheck } from '@/lib/crisis';
import { getSettings } from '@/lib/settings';
import type { JournalEntry, PageState } from '@/lib/types';
import { recordPathwayEntry } from '@/lib/pathways';
import { NewEntryEditor } from './NewEntryEditor';
import { NewEntryReflection } from './NewEntryReflection';
import { useKheperaReflection } from './useKheperaReflection';

function makeId(): string { return `${Date.now()}_${Math.random().toString(16).slice(2)}`; }

function useDraftAutosave(args: { enabled: boolean; content: string; mood: number | undefined; tags: string; pathwayId: string | null; pathwayStep: number }) {
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (!args.enabled) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const nextTags = args.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12);
      saveDraft({ content: args.content, mood: args.mood, tags: nextTags, pathwayId: args.pathwayId || undefined, pathwayStep: args.pathwayStep });
    }, 2000);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [args.content, args.enabled, args.mood, args.pathwayId, args.pathwayStep, args.tags]);
}

export default function NewEntryClient() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [content, setContent] = useState(''); const [mood, setMood] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState(''); const [pathwayId, setPathwayId] = useState<string | null>(null); const [pathwayStep, setPathwayStep] = useState(1);
  const [savedId, setSavedId] = useState<string | null>(null); const [savedCrisis, setSavedCrisis] = useState<CrisisCheck | null>(null);
  const settings = useMemo(() => getSettings(), []);
  const { reflection, setReflection, reflectionError, setReflectionError, isReflecting, reflect } = useKheperaReflection({ preferredFramework: settings.preferredFramework });

  useEffect(() => {
    try {
      const draft = getDraft();
      if (draft?.content) setContent(String(draft.content));
      if (typeof draft?.mood === 'number') setMood(draft.mood);
      if (Array.isArray(draft?.tags)) setTags(draft.tags.join(', '));
      if (typeof draft?.pathwayId === 'string' && draft.pathwayId.trim()) setPathwayId(draft.pathwayId);
      if (typeof draft?.pathwayStep === 'number' && Number.isFinite(draft.pathwayStep)) setPathwayStep(draft.pathwayStep);
      setState('ready');
    } catch { setState('error'); }
  }, []);

  useDraftAutosave({ enabled: settings.autoSaveEnabled, content, mood, tags, pathwayId, pathwayStep });

  const onSave = useCallback(() => {
    const trimmed = content.trim(); if (!trimmed) return;
    const now = new Date().toISOString();
    const entry: JournalEntry = { id: makeId(), content: trimmed, mood, emotions: [], tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12), type: 'journal', isPrivate: true, createdAt: now, updatedAt: now, pathwayId: pathwayId || undefined, pathwayStep: pathwayId ? pathwayStep : undefined };
    if (!addEntry(entry)) { setState('error'); return; }
    clearDraft(); setSavedId(entry.id); setSavedCrisis(checkForCrisis(entry.content)); setReflection(''); setReflectionError('');
    if (pathwayId) recordPathwayEntry(entry);
  }, [content, mood, pathwayId, pathwayStep, tags, setReflection, setReflectionError]);

  const onReflect = useCallback(() => { if (savedId) reflect(savedId); }, [reflect, savedId]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <button type="button" onClick={() => router.push('/dashboard/')} aria-label="Return to dashboard" style={{ border: 'none', background: 'transparent', color: DESIGN.colors.gold, fontFamily: DESIGN.typography.sansSerif, fontSize: '15px', cursor: 'pointer', minHeight: '44px', padding: 0 }}>← Dashboard</button>
        <button type="button" onClick={() => router.push('/journal/')} aria-label="Open journal list" style={{ border: 'none', background: 'transparent', color: DESIGN.colors.gold, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer', minHeight: '44px', padding: '0 8px' }}>Journal →</button>
      </div>
      {state === 'loading' ? <LoadingState label="Preparing your page…" /> : null}
      {state === 'error' ? <ErrorState message="ALCHM couldn't open the editor. Try again." onRetry={() => router.refresh()} /> : null}
      {state === 'ready' ? (
        <>
          <NewEntryEditor content={content} setContent={setContent} mood={mood} setMood={(v) => setMood(v)} tags={tags} setTags={setTags} pathwayId={pathwayId} pathwayStep={pathwayStep} onSave={onSave} canSave={!!content.trim()} />
          <NewEntryReflection visible={!!savedId} isReflecting={isReflecting} reflection={reflection} reflectionError={reflectionError} crisis={savedCrisis} onReflect={onReflect} />
        </>
      ) : null}
    </div>
  );
}
