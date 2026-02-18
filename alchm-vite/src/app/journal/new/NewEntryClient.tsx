
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from '@/router';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { DESIGN } from '@/lib/design';
import { addEntry, clearDraft, getDraft, saveDraft, updateEntry } from '@/lib/journal';
import { checkForCrisis, type CrisisCheck } from '@/lib/crisis';
import { getSettings } from '@/lib/settings';
import type { JournalEntry, PageState } from '@/lib/types';
import { recordPathwayEntry } from '@/lib/pathways';
import { EmotionSelector, type EmotionSelection } from '@/components/EmotionSelector';
import { SomaticCheckin } from '@/components/SomaticCheckin';
import { buildWritingPrompt } from '@/lib/depthPrompts';
import { findEmotion } from '@/lib/emotions';
import { getClosing } from '@/lib/closing';
import { buildFollowUpUserMessage, FOLLOW_UP_SYSTEM_PROMPT } from '@/lib/followUp';
import { getFollowUpQuestion } from '@/lib/api';
import type { BodySensation } from '@/lib/somatic';
import { BODY_REGIONS, type BodyRegionId } from '@/lib/somatic';
import { FollowUpCard } from '@/components/FollowUpCard';
import { ClosingLine } from '@/components/ClosingLine';
import { getAnthropicApiKey } from '@/lib/secrets';
import { NewEntryEditor } from './NewEntryEditor';
import { NewEntryReflection } from './NewEntryReflection';
import { useKheperaReflection } from './useKheperaReflection';

function makeId(): string { return `${Date.now()}_${Math.random().toString(16).slice(2)}`; }

function useDraftAutosave(args: {
  enabled: boolean;
  content: string;
  mood: number | undefined;
  tags: string;
  pathwayId: string | null;
  pathwayStep: number;
  emotionSelection: EmotionSelection | null;
  somatic: BodySensation | null;
}) {
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (!args.enabled) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const nextTags = args.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12);
      saveDraft({
        content: args.content,
        mood: args.mood,
        tags: nextTags,
        pathwayId: args.pathwayId || undefined,
        pathwayStep: args.pathwayStep,
        emotionSelection: args.emotionSelection || undefined,
        somatic: args.somatic || undefined,
      });
    }, 2000);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [args.content, args.enabled, args.mood, args.pathwayId, args.pathwayStep, args.tags, args.emotionSelection, args.somatic]);
}

export default function NewEntryClient() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [content, setContent] = useState(''); const [mood, setMood] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState(''); const [pathwayId, setPathwayId] = useState<string | null>(null); const [pathwayStep, setPathwayStep] = useState(1);
  const [emotionSel, setEmotionSel] = useState<EmotionSelection | null>(null);
  const [somatic, setSomatic] = useState<BodySensation | null>(null);
  const [layer, setLayer] = useState<'name' | 'feel' | 'write' | 'reflect' | 'explore' | 'closing'>('name');
  const [savedId, setSavedId] = useState<string | null>(null); const [savedCrisis, setSavedCrisis] = useState<CrisisCheck | null>(null);
  const [reflectionComplete, setReflectionComplete] = useState(false);
  const [followUpQ, setFollowUpQ] = useState<string | null>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [closingText, setClosingText] = useState<string | null>(null);
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
      if (draft?.emotionSelection && typeof draft.emotionSelection === 'object') setEmotionSel(draft.emotionSelection as EmotionSelection);
      if (draft?.somatic && typeof draft.somatic === 'object') setSomatic(draft.somatic as BodySensation);
      // Resume at the appropriate layer.
      if (draft?.emotionSelection) setLayer(draft?.somatic ? 'write' : 'feel');
      setState('ready');
    } catch { setState('error'); }
  }, []);

  useDraftAutosave({ enabled: settings.autoSaveEnabled, content, mood, tags, pathwayId, pathwayStep, emotionSelection: emotionSel, somatic });

  const selectedEmotion = useMemo(() => {
    if (!emotionSel) return null;
    return findEmotion({ family: emotionSel.familyId, specificId: emotionSel.specificId });
  }, [emotionSel]);

  const hintRegion = useMemo<BodyRegionId | null>(() => {
    const hint = selectedEmotion?.somatic || null;
    if (!hint) return null;
    return BODY_REGIONS.some((r) => r.id === hint) ? (hint as BodyRegionId) : null;
  }, [selectedEmotion?.somatic]);

  const writingPrompt = useMemo(() => buildWritingPrompt(selectedEmotion, somatic), [selectedEmotion, somatic]);

  const onSave = useCallback(() => {
    const trimmed = content.trim(); if (!trimmed) return;
    if (!emotionSel) return;
    const now = new Date().toISOString();
    const entry: JournalEntry = {
      id: makeId(),
      content: trimmed,
      mood,
      emotionSelection: emotionSel,
      somatic: somatic || undefined,
      emotions: [emotionSel.label],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12),
      type: 'journal',
      isPrivate: true,
      createdAt: now,
      updatedAt: now,
      pathwayId: pathwayId || undefined,
      pathwayStep: pathwayId ? pathwayStep : undefined,
    };
    if (!addEntry(entry)) { setState('error'); return; }
    clearDraft();
    setSavedId(entry.id);
    setSavedCrisis(checkForCrisis(entry.content));
    setReflection('');
    setReflectionError('');
    setReflectionComplete(false);
    setFollowUpQ(null);
    setClosingText(null);
    setLayer('reflect');
    if (pathwayId) recordPathwayEntry(entry);
  }, [content, emotionSel, mood, pathwayId, pathwayStep, somatic, tags, setReflection, setReflectionError]);

  const onReflect = useCallback(() => { if (savedId) reflect(savedId); }, [reflect, savedId]);

  const requestFollowUp = useCallback(async () => {
    if (!savedId) return;
    if (!reflection || followUpLoading || followUpQ) return;
    // Follow-up is optional and should never block.
    setFollowUpLoading(true);
    try {
      const apiKey = getAnthropicApiKey();
      if (!apiKey) { setFollowUpLoading(false); return; }
      const msg = buildFollowUpUserMessage(content.trim(), reflection);
      const res = await getFollowUpQuestion({ systemPrompt: FOLLOW_UP_SYSTEM_PROMPT, userMessage: msg, apiKey });
      if (res.text) setFollowUpQ(res.text);
    } catch {
      // silent
    } finally {
      setFollowUpLoading(false);
    }
  }, [content, followUpLoading, followUpQ, reflection, savedId]);

  const onSaveFollowUpResponse = useCallback((resp: string) => {
    if (!savedId || !followUpQ) return;
    const trimmed = resp.trim();
    if (!trimmed) return;
    // Append into the entry content for portability, and also store structured followUp.
    const appended = `${content.trim()}\n\n---\n\nKhepera asked: \"${followUpQ}\"\n\nYour response:\n${trimmed}`;
    setContent(appended);
    // Persist both.
    updateEntry(savedId, { content: appended, followUp: { question: followUpQ, response: trimmed } });
    setLayer('closing');
  }, [content, followUpQ, savedId]);

  const finishExplore = useCallback(() => {
    setLayer('closing');
  }, []);

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
          <div style={{ marginTop: '16px' }}>
            <EmotionSelector
              value={emotionSel}
              onChange={(sel) => {
                setEmotionSel(sel);
                // Move forward, but keep it optional.
                if (layer === 'name') setLayer('feel');
              }}
            />
          </div>

          {emotionSel && layer === 'feel' ? (
            <SomaticCheckin
              hintRegion={hintRegion}
              value={somatic}
              onChange={(s) => setSomatic(s)}
              onSkip={() => setLayer('write')}
              onContinue={() => setLayer('write')}
            />
          ) : null}

          {emotionSel && (layer === 'write' || layer === 'reflect' || layer === 'explore' || layer === 'closing') ? (
            <NewEntryEditor
              content={content}
              setContent={setContent}
              tags={tags}
              setTags={setTags}
              pathwayId={pathwayId}
              pathwayStep={pathwayStep}
              onSave={onSave}
              canSave={!!content.trim() && !!emotionSel}
              writingPrompt={writingPrompt}
              emotionFamily={emotionSel.familyId}
              usedSomatic={!!somatic}
              preferredFramework={settings.preferredFramework}
            />
          ) : null}

          <NewEntryReflection
            visible={!!savedId}
            isReflecting={isReflecting}
            reflection={reflection}
            reflectionError={reflectionError}
            crisis={savedCrisis}
            onReflect={onReflect}
            onReflectionComplete={() => {
              setReflectionComplete(true);
              setLayer('explore');
              if (savedId) {
                const family = emotionSel?.familyId ?? null;
                setClosingText(getClosing(family, savedId));
              }
            }}
          />

          <FollowUpCard
            visible={!!savedId && reflectionComplete && layer === 'explore'}
            question={followUpQ}
            isLoading={followUpLoading}
            onRequest={() => void requestFollowUp()}
            onSaveResponse={onSaveFollowUpResponse}
            onDone={finishExplore}
          />

          <ClosingLine text={closingText} visible={reflectionComplete && (layer === 'explore' || layer === 'closing')} />
        </>
      ) : null}
    </div>
  );
}
