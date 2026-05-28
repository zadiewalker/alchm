'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeAsync } from '@/hooks/useSafeAsync';
import { useJournal } from '@/hooks/useJournal';
import { useContainer } from '@/hooks/useContainer';
import { useAuth } from '@/hooks/useAuth';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';
import { useFirstEntryExperience } from '@/hooks/useFirstEntryExperience';
import { useOperationalEvents } from '@/hooks/useOperationalEvents';
import { useSubmissionErrorMessage } from '@/hooks/useSubmissionErrorMessage';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { KheperaReceivingView } from '@/components/journal/KheperaReceivingView';
import { OpenTransformationButton } from '@/components/subscriptions/OpenTransformationButton';
import { resolveSubmissionTone } from '@/utils/journalTone';
import { getResurfacingToneCopy } from '@/utils/resurfacingTone';
import type {
  EmotionalCheckIn,
  JournalFlowProps,
  JournalPhase,
} from '@/types/journal';

export function JournalFlow({
  onComplete,
  containerPrompt,
  somaticAnchor,
  thresholdQuestion,
  completionContext,
  containerOriginContext,
  quickStartContext,
  returnContext,
}: JournalFlowProps): React.JSX.Element | null {
  const router = useRouter();
  const { navigate } = useInternalNavigation();
  const auth = useAuth();
  const userId = auth.user?.uid;
  const { activeContainer, containerContext } = useContainer();
  const { view, entryText, result, error, setEntryText, submit, reset } = useJournal();
  useSafeAsync();
  const prefersReducedMotion = useReducedMotionPreference();
  const recordEvent = useOperationalEvents();
  const getErrorMessage = useSubmissionErrorMessage();

  const [phase, setPhase] = useState<JournalPhase>('writing');
  const [checkIn, setCheckIn] = useState<EmotionalCheckIn | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showKheperaCard, setShowKheperaCard] = useState(false);
  const [receivingInteractive, setReceivingInteractive] = useState(false);
  const isFirstEntryExperience = useFirstEntryExperience();
  const hasRecordedStart = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  void completionContext;
  void somaticAnchor;

  const isReturnEntry = Boolean(returnContext);
  const isContainerEntry = Boolean(containerPrompt || containerOriginContext);
  const isQuickStartEntry = Boolean(quickStartContext);
  const leadContext = containerOriginContext
    ? { kind: 'container' as const }
    : returnContext
    ? { kind: 'return' as const }
    : quickStartContext
    ? { kind: 'quickstart' as const }
    : null;

  useEffect(() => {
    if (phase !== 'writing') return;

    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 300);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (view === 'loading' && phase === 'writing') {
      setPhase('pause');
    }
  }, [view, phase]);

  useEffect(() => {
    if (view !== 'receiving' || phase !== 'pause') return;

    if (prefersReducedMotion || result?.isCrisis || result?.submissionState !== 'completed') {
      setPhase('receiving');
      return;
    }

    const pauseTimer = window.setTimeout(() => {
      setPhase('receiving');
    }, isFirstEntryExperience ? 760 : 520);

    return () => {
      window.clearTimeout(pauseTimer);
    };
  }, [view, phase, isFirstEntryExperience, prefersReducedMotion, result]);

  useEffect(() => {
    if (phase === 'receiving' && result) {
      if (prefersReducedMotion || result.isCrisis || result.submissionState !== 'completed') {
        setShowKheperaCard(true);
        setReceivingInteractive(true);
        return;
      }

      setShowKheperaCard(false);
      setReceivingInteractive(false);

      const revealTimer = window.setTimeout(() => setShowKheperaCard(true), isFirstEntryExperience ? 120 : 90);
      const readyTimer = window.setTimeout(() => setReceivingInteractive(true), isFirstEntryExperience ? 760 : 620);

      return () => {
        window.clearTimeout(revealTimer);
        window.clearTimeout(readyTimer);
      };
    }

    setShowKheperaCard(false);
    setReceivingInteractive(false);
  }, [phase, result, isFirstEntryExperience, prefersReducedMotion]);

  const promptContext = containerPrompt ?? containerContext?.todayPrompt ?? quickStartContext?.prompt;
  const writingPrompt = promptContext
    ?? (isFirstEntryExperience ? 'Write what is here.' : thresholdQuestion ?? 'Start where this feels most alive.');

  const writingTitle = isReturnEntry
    ? 'Begin from what came back.'
    : isContainerEntry
    ? 'Enter today’s writing.'
    : isQuickStartEntry
    ? 'Begin with this opening.'
    : 'Write what is here.';

  const writingSupport = isReturnEntry
    ? 'Not a reminder. A return. This can stay with the earlier words, or stand on its own.'
    : isContainerEntry
    ? 'Let this stay with the thread you are already in.'
    : isQuickStartEntry
    ? 'Use the prompt if it helps. Leave it if it does not.'
    : 'There is no right way to begin.';

  const pauseCopy = result?.isCrisis
    ? 'What is here is being met directly.'
    : isFirstEntryExperience
    ? 'Letting the words settle.'
    : 'Reflecting what’s here.';

  const pauseWhisper = result?.isCrisis
    ? null
    : isFirstEntryExperience
    ? 'Khepera is listening.'
    : 'Khepera will stay close to the shape of this.';

  const receivingOrientation = isFirstEntryExperience
    ? 'What came back is here in three parts.'
    : 'What came back is here in three parts.';

  const leadContextCard = leadContext ? (
    <AppCard className="journal-status-card journal-lead-context-card">
      {leadContext.kind === 'container' && containerOriginContext ? (
        <>
          <AppText variant="caption" as="p" className="journal-status-card-copy">
            {containerOriginContext.name}
            {containerOriginContext.dayLabel ? ` · ${containerOriginContext.dayLabel}` : ''}
          </AppText>
          <AppText variant="body" as="p" className="journal-status-card-copy">
            This entry can stay close to what is here today. It will stand as its own writing.
          </AppText>
          {containerOriginContext.prompt ? (
            <AppText variant="caption" as="p" className="journal-status-card-copy">
              {containerOriginContext.prompt}
            </AppText>
          ) : null}
        </>
      ) : null}
      {leadContext.kind === 'return' && returnContext ? (
        <>
          <AppText variant="caption" as="p" className="journal-status-card-copy">
            This came back
          </AppText>
          <AppText variant="body" as="p" className="journal-status-card-copy">
            {returnContext.detail || 'Not a reminder. A return. This can stand on its own.'}
          </AppText>
          {returnContext.resurfacingTone ? (
            <AppText variant="caption" as="p" className="journal-status-card-copy">
              {getResurfacingToneCopy(returnContext.resurfacingTone)}
            </AppText>
          ) : null}
          {returnContext.excerpt && !returnContext.isUnavailable ? (
            <AppText variant="caption" as="p" className="journal-status-card-copy">
              {returnContext.excerpt}
            </AppText>
          ) : null}
        </>
      ) : null}
      {leadContext.kind === 'quickstart' && quickStartContext ? (
        <>
          <AppText variant="caption" as="p" className="journal-status-card-copy">
            A place to begin
          </AppText>
          <AppText variant="body" as="p" className="journal-status-card-copy">
            {quickStartContext.prompt}
          </AppText>
          <AppText variant="caption" as="p" className="journal-status-card-copy">
            You can stay with this invitation, or let it open into something nearby.
          </AppText>
        </>
      ) : null}
    </AppCard>
  ) : null;

  const writingContextStrip = leadContext ? (
    <AppText variant="caption" as="p" className="journal-status-card-copy">
      {leadContext.kind === 'container'
        ? 'Writing inside this container.'
        : leadContext.kind === 'return'
        ? 'Writing after a return.'
        : 'Writing from an opening.'}
    </AppText>
  ) : null;

  const handleSubmit = useCallback(async () => {
    if (!entryText.trim() || entryText.trim().length < 3) return;

    await submit({
      userId: userId ?? null,
      sessionCount: 0,
      recurringThemes: [],
      dominantTone: resolveSubmissionTone(checkIn),
      containerId: activeContainer?.definition.id,
      userContainerId: activeContainer?.userContainerId,
      containerName: activeContainer?.definition.name,
      containerContext: containerContext ?? undefined,
      containerDay: activeContainer?.currentDay,
      containerClinicalIntent: containerContext?.clinicalIntent,
      containerPhase: containerContext?.phase,
      containerPhaseNote: containerContext?.phaseArcNote,
      todayPrompt: promptContext,
      kheperaIntent: containerContext?.kheperaIntent,
      thresholdQuestion,
    });
  }, [activeContainer, checkIn, containerContext, entryText, submit, thresholdQuestion, userId, promptContext]);

  if (phase === 'writing') {
    return (
      <div className="journal-writing-screen">
        <div className="journal-writing-intro">
          <AppText variant="title" as="h1" className="journal-writing-title">
            {writingTitle}
          </AppText>
          <AppText variant="secondary" as="p" className="journal-writing-support">
            {writingSupport}
          </AppText>
        </div>

        {leadContextCard}
        {writingContextStrip}

        <div
          className={['journal-input-shell', isInputFocused ? 'is-focused' : ''].filter(Boolean).join(' ')}
        >
          <textarea
            ref={textareaRef}
            className="journal-textarea"
            id="journal-entry-input"
            value={entryText}
            onChange={(event) => {
              if (!hasRecordedStart.current && event.target.value.trim().length > 0) {
                if (isFirstEntryExperience) {
                  hasRecordedStart.current = true;
                  recordEvent('first_write_started', { source: 'journal_new' });
                }
              }
              setEntryText(event.target.value);
            }}
            aria-label="Journal entry"
            aria-multiline="true"
            placeholder={writingPrompt}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
        </div>

        <div className="journal-writing-shelf">
          {view === 'error' && error ? (
            <AppCard className="journal-status-card journal-writing-status-card">
              <AppText variant="caption" as="p" className="journal-status-card-copy">
                {getErrorMessage(error)}
              </AppText>
            </AppCard>
          ) : null}

          <button
            type="button"
            className="btn-primary journal-primary-cta"
            style={{ opacity: entryText.trim().length < 3 ? 0.35 : 1 }}
            onClick={handleSubmit}
            disabled={view === 'loading' || entryText.trim().length < 3}
          >
            See what comes back
          </button>

          <div className="journal-writing-support-link">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                recordEvent('crisis_resources_opened', { source: 'journal_new' });
                navigate('/emergency', { source: 'journal_writing_crisis_resources', surface: 'journal_limit' });
              }}
            >
              In crisis? Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'pause') {
    return (
      <div className="journal-pause-screen">
          <AppCard className="journal-status-card journal-pause-card">
            <AppText variant="body" as="p" className="journal-pause-copy">
              {pauseCopy}
            </AppText>
            {pauseWhisper ? (
              <AppText variant="caption" as="p" className="journal-pause-whisper">
                {pauseWhisper}
              </AppText>
            ) : null}
          </AppCard>
        </div>
      );
  }

  if (phase === 'receiving' && result?.submissionState === 'reflection_limit') {
    return (
      <div className="journal-receiving-screen">
        <AppCard className="journal-status-card journal-reflection-limit-card">
          <div className="journal-reflection-limit-accent" aria-hidden="true" />
          <AppText variant="title" as="h2" className="journal-reflection-limit-title">
            You’ve reached the Sanctuary reflection limit.
          </AppText>
          <AppText variant="secondary" as="p" className="journal-reflection-limit-copy">
            Transformation includes unlimited Khepera reflections.
          </AppText>
          <OpenTransformationButton
            surface="journal_limit"
            source="journal_limit_transformation"
            route="/journal/new"
            className="btn-primary journal-primary-cta"
            label="Open Transformation"
          />
        </AppCard>
      </div>
    );
  }

  if (phase === 'receiving' && result?.submissionState === 'delayed_return') {
    return (
      <div className="journal-receiving-screen">
        <AppCard className="journal-status-card journal-reflection-limit-card">
          <div className="journal-reflection-limit-accent" aria-hidden="true" />
          <AppText variant="title" as="h2" className="journal-reflection-limit-title">
            The entry is here.
          </AppText>
          <AppText variant="secondary" as="p" className="journal-reflection-limit-copy">
            Something may return.
          </AppText>
          <button
            type="button"
            className="btn-primary journal-primary-cta"
            onClick={() => {
              reset();
              onComplete?.();
            }}
          >
            Return to your space
          </button>
        </AppCard>
      </div>
    );
  }

  if (phase === 'receiving' && result) {
    return (
      <KheperaReceivingView
        result={{
          witness: result.witness ?? '',
          perspective: result.perspective ?? '',
          seed: result.seed,
        }}
        checkIn={checkIn}
        onCheckInChange={setCheckIn}
        interactive={receivingInteractive}
        reveal={showKheperaCard}
        prefersReducedMotion={prefersReducedMotion}
        orientation={receivingOrientation}
        statusNote={
          completionContext ? (
            <>
              {completionContext.detail}
            </>
          ) : null
        }
        returnLabel={completionContext?.ctaLabel || 'Return to your space'}
        onReturn={() => {
          reset();
          onComplete?.();
        }}
      />
    );
  }

  return null;
}
