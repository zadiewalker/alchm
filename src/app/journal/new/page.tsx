'use client';

import type React from 'react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useData } from '@/hooks/useData';
import { analyzeJournalEntry } from '@/lib/api/aiAnalysisApi';
import { detectCrisisLanguage } from '@/lib/crisisDetection';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CrisisModal } from '@/components/CrisisModal';
import { DESIGN } from '@/lib/design';
import { getSettings } from '@/lib/settings';
import { getAvailableTags } from '@/lib/journalSearch';
import { canUseFollowUp, canUseKhepera, recordFollowUpUsage, recordKheperaUsage } from '@/lib/subscription';
import { UpgradePrompt } from '@/components/ui/UpgradePrompt';
import type { JournalEntry } from '@/lib/dataService';
import { appendContinuityToPrompt, getContinuityContext } from '@/lib/continuity';
import { completePathwayStep, getPathwayById } from '@/lib/pathways';
import { shareReflection } from '@/lib/community';
import { cancelReminder } from '@/lib/notifications';

const moodWords = ['anxious', 'heavy', 'numb', 'restless', 'tender', 'hopeful', 'alive', 'shattered', 'calm', 'burning'];
const promptBank = [
  "What's sitting heavy today?",
  'If your body could speak right now, what would it say?',
  'What are you pretending not to feel?',
  "What would you tell yourself if you weren't afraid to hear it?",
  'Where in your body do you feel this?',
];

export default function NewEntryPage() {
  return (
    <Suspense
      fallback={
        <SanctuaryLayout header={<SanctuaryHeader title="New Entry" showBack />}>
          <LoadingState message="Preparing your writing space..." variant="page" />
        </SanctuaryLayout>
      }
    >
      <NewEntryContent />
    </Suspense>
  );
}

function NewEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveJournalEntry, getJournalEntries } = useData();

  const [content, setContent] = useState('');
  const [moods, setMoods] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [savedTagSuggestions, setSavedTagSuggestions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingReflection, setLoadingReflection] = useState(false);
  const [error, setError] = useState('');
  const [reflection, setReflection] = useState('');
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [shareMode, setShareMode] = useState(false);
  const [shareText, setShareText] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [savedEntryId, setSavedEntryId] = useState('');

  const pathwayId = searchParams.get('pathway') || '';
  const pathwayStepIndex = Number.parseInt(searchParams.get('step') || '0', 10) || 0;
  const pathway = useMemo(() => (pathwayId ? getPathwayById(pathwayId) : null), [pathwayId]);
  const pathwayStep = pathway?.steps?.[pathwayStepIndex];

  const prompt = useMemo(() => {
    if (pathwayStep?.prompt) return pathwayStep.prompt;
    return promptBank[new Date().getDate() % promptBank.length];
  }, [pathwayStep?.prompt]);
  const settings = useMemo(() => getSettings(), []);

  useEffect(() => {
    try {
      const draft = window.localStorage.getItem('alchm-draft-entry');
      if (draft) setContent(draft);
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    getJournalEntries()
      .then((items: JournalEntry[]) => {
        if (!mounted) return;
        setSavedTagSuggestions(getAvailableTags(items || []));
      })
      .catch(() => {
        if (!mounted) return;
        setSavedTagSuggestions([]);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries]);

  useEffect(() => {
    if (!settings.autoSaveEnabled) return;
    const id = window.setInterval(() => {
      try {
        window.localStorage.setItem('alchm-draft-entry', content);
      } catch {
        // no-op
      }
    }, settings.autoSaveIntervalMs || 10000);
    return () => window.clearInterval(id);
  }, [content, settings.autoSaveEnabled, settings.autoSaveIntervalMs]);

  const addTag = (rawTag: string) => {
    const normalized = rawTag.trim().toLowerCase();
    if (!normalized) return;
    if (tags.includes(normalized)) return;
    setTags((prev) => [...prev, normalized]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const saveEntry = async () => {
    if (!content.trim()) return;

    setSaving(true);
    setError('');

    try {
      const entryId = await saveJournalEntry({
        content,
        title: '',
        mood: 5,
        emotions: moods,
        tags,
        pathwayId: pathway?.id,
        pathwayStep: pathwayStepIndex,
        isPrivate: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setSavedEntryId(entryId);

      const reflectionAccess = canUseKhepera();
      if (!reflectionAccess.allowed) {
        setUpgradeMessage(reflectionAccess.message || 'Khepera reflections are limited on your current plan.');
        return;
      }

      setLoadingReflection(true);
      const continuity = getContinuityContext();
      const continuityPrompt = appendContinuityToPrompt(
        'Use gentle continuity from prior writing without over-explaining.',
        continuity,
      );
      const ai = await analyzeJournalEntry(content, 'anonymous', entryId, {
        continuityContext: continuityPrompt,
        pathwayGuidance: pathwayStep?.kheperaGuidance,
        reflectionFocus: pathwayStep?.reflectionFocus,
      });
      setReflection(`${ai.analysis.emotionalRecognition}\n\n${ai.analysis.gentleInsight}`);
      recordKheperaUsage();
      setLoadingReflection(false);

      if (pathway?.id) {
        completePathwayStep(pathway.id, pathwayStepIndex, entryId);
      }
      cancelReminder('return').catch(() => {});

      if (detectCrisisLanguage(content)) {
        setShowCrisisModal(true);
      }

      try {
        window.localStorage.removeItem('alchm-draft-entry');
      } catch {
        // no-op
      }
    } catch {
      setError('Your entry did not save. Please try again.');
      setLoadingReflection(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="New Entry" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard>
          {pathwayStep ? (
            <SanctuaryText variant="caption" style={{ color: DESIGN.colors.textKhepera, marginBottom: DESIGN.spacing.xs }}>
              Day {pathwayStep.day}: {pathwayStep.title}
            </SanctuaryText>
          ) : null}
          <SanctuaryText variant="muted" style={{ marginBottom: DESIGN.spacing.sm }}>
            {prompt}
          </SanctuaryText>
          <div style={{ display: 'flex', gap: DESIGN.spacing.xs, overflowX: 'auto', paddingBottom: 4 }}>
            {moodWords.map((mood) => {
              const selected = moods.includes(mood);
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() =>
                    setMoods((prev) => (prev.includes(mood) ? prev.filter((item) => item !== mood) : [...prev, mood]))
                  }
                  style={{
                    borderRadius: DESIGN.radius.full,
                    border: `1px solid ${selected ? DESIGN.colors.goldDim : DESIGN.colors.border}`,
                    background: selected ? 'rgba(232,197,109,0.2)' : DESIGN.colors.cardBg,
                    color: selected ? DESIGN.colors.textKhepera : DESIGN.colors.textSecondary,
                    fontFamily: DESIGN.typography.sansSerif,
                    fontSize: DESIGN.typography.sizes.sm,
                    padding: '8px 12px',
                    whiteSpace: 'nowrap',
                    minHeight: '44px',
                  }}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        </SanctuaryCard>

        <SanctuaryCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: DESIGN.spacing.xs }}>
            <SanctuaryText variant="caption">Tags (optional)</SanctuaryText>
            <button
              type="button"
              onClick={() => setShowTagInput((prev) => !prev)}
              style={chipButtonStyle}
            >
              + Tag
            </button>
          </div>

          {showTagInput ? (
            <div style={{ display: 'flex', gap: DESIGN.spacing.xs, marginBottom: DESIGN.spacing.sm }}>
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Add a tag"
                style={tagInputStyle}
              />
              <button type="button" onClick={() => addTag(tagInput)} style={chipButtonStyle}>
                Add
              </button>
            </div>
          ) : null}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: DESIGN.spacing.xs }}>
            {tags.map((tag) => (
              <button key={tag} type="button" onClick={() => removeTag(tag)} style={selectedChipStyle}>
                #{tag} ×
              </button>
            ))}
          </div>

          {savedTagSuggestions.length > 0 ? (
            <div style={{ marginTop: DESIGN.spacing.sm, display: 'flex', gap: DESIGN.spacing.xs, flexWrap: 'wrap' }}>
              {savedTagSuggestions
                .filter((tag) => !tags.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                  <button key={tag} type="button" onClick={() => addTag(tag)} style={chipButtonStyle}>
                    #{tag}
                  </button>
                ))}
            </div>
          ) : null}
        </SanctuaryCard>

        <SanctuaryCard elevated>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write what is true right now..."
            style={{
              width: '100%',
              minHeight: 260,
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              background: 'transparent',
              color: DESIGN.colors.textPrimary,
              fontFamily: DESIGN.typography.sansSerif,
              fontSize: DESIGN.typography.sizes.base,
              lineHeight: String(DESIGN.typography.lineHeights.relaxed),
            }}
          />
          {content.length > 500 ? (
            <SanctuaryText variant="caption" style={{ marginTop: DESIGN.spacing.sm }}>
              You had a lot to say today ({content.length} characters)
            </SanctuaryText>
          ) : null}
        </SanctuaryCard>

        {error ? <ErrorState variant="inline" message={error} /> : null}

        {loadingReflection ? <LoadingState variant="khepera" message="Khepera is reflecting..." /> : null}

        {reflection ? (
          <SanctuaryCard style={{ background: DESIGN.colors.bgWarm }}>
            <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.sm }}>
              Khepera
            </SanctuaryText>
            <SanctuaryText variant="body" style={{ whiteSpace: 'pre-wrap' }}>
              {reflection}
            </SanctuaryText>
            <div style={{ display: 'flex', gap: DESIGN.spacing.sm, marginTop: DESIGN.spacing.md }}>
              <button
                type="button"
                onClick={() => {
                  const followUpAccess = canUseFollowUp();
                  if (!followUpAccess.allowed) {
                    setUpgradeMessage(followUpAccess.message || 'Follow-up exchanges require an upgrade.');
                    return;
                  }
                  recordFollowUpUsage();
                  setReflection('');
                }}
                style={secondaryButtonStyle}
              >
                Ask Khepera more
              </button>
              <button type="button" onClick={() => router.push('/journal/')} style={primaryButtonStyle}>
                Save & close
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setShareMode((value) => !value);
                setShareStatus('');
                if (!shareText.trim()) {
                  setShareText(content.slice(0, 220));
                }
              }}
              style={{ ...secondaryButtonStyle, marginTop: DESIGN.spacing.sm }}
            >
              Share a moment anonymously
            </button>
            {shareMode ? (
              <div style={{ marginTop: DESIGN.spacing.sm, display: 'grid', gap: DESIGN.spacing.sm }}>
                <textarea
                  value={shareText}
                  onChange={(event) => setShareText(event.target.value)}
                  maxLength={280}
                  placeholder="Choose a short excerpt to share"
                  style={{
                    width: '100%',
                    minHeight: 90,
                    borderRadius: DESIGN.radius.md,
                    border: `1px solid ${DESIGN.colors.border}`,
                    background: DESIGN.colors.cardBg,
                    color: DESIGN.colors.textPrimary,
                    fontFamily: DESIGN.typography.sansSerif,
                    fontSize: DESIGN.typography.sizes.sm,
                    padding: '8px 10px',
                  }}
                />
                <SanctuaryText variant="caption">
                  This will be shared anonymously. No one will know it&apos;s you.
                </SanctuaryText>
                <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
                  <button
                    type="button"
                    onClick={() => {
                      const result = shareReflection({
                        type: 'entry_excerpt',
                        content: shareText,
                        mood: moods,
                      });
                      setShareStatus(result.ok ? 'Shared. Your words may find someone who needed them.' : result.error || 'Could not share right now.');
                    }}
                    style={primaryButtonStyle}
                  >
                    Share
                  </button>
                  <button type="button" onClick={() => setShareMode(false)} style={secondaryButtonStyle}>
                    Cancel
                  </button>
                </div>
                {shareStatus ? <SanctuaryText variant="caption">{shareStatus}</SanctuaryText> : null}
              </div>
            ) : null}
            {savedEntryId && pathway?.id && pathwayStep && pathwayStepIndex + 1 >= pathway.steps.length ? (
              <SanctuaryCard style={{ marginTop: DESIGN.spacing.sm, borderColor: DESIGN.colors.goldDim }}>
                <SanctuaryText variant="khepera">You completed {pathway.title}.</SanctuaryText>
                <SanctuaryText variant="caption">
                  {pathway.steps.length} days of staying with what matters. That changes something.
                </SanctuaryText>
              </SanctuaryCard>
            ) : null}
          </SanctuaryCard>
        ) : null}

        {upgradeMessage ? (
          <UpgradePrompt
            feature="Khepera depth"
            message={upgradeMessage}
            recommendedTier="reflections"
            onClose={() => setUpgradeMessage('')}
          />
        ) : null}

        {!reflection ? (
          <button type="button" onClick={saveEntry} disabled={saving || !content.trim()} style={primaryButtonStyle}>
            {saving ? 'Saving...' : 'Done'}
          </button>
        ) : null}
      </div>
      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
    </SanctuaryLayout>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  padding: '11px 16px',
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  border: `1px solid ${DESIGN.colors.border}`,
};

const chipButtonStyle: React.CSSProperties = {
  minHeight: '32px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
  padding: '6px 10px',
};

const selectedChipStyle: React.CSSProperties = {
  ...chipButtonStyle,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  color: DESIGN.colors.textKhepera,
  background: 'rgba(232,197,109,0.14)',
};

const tagInputStyle: React.CSSProperties = {
  flex: 1,
  minHeight: '36px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
  padding: '6px 10px',
};
