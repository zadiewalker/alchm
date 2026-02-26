import { useRouter } from '@/router';
import { useEffect, useMemo, useState } from 'react';
import { ErrorState, LoadingState } from '@/components/States';
import { LAYER_BACKGROUNDS } from '@/lib/depth.design';
import { EmotionSelector } from '@/components/depth/SelectionFlow';
import type { EmotionSelection } from '@/components/depth/SelectionFlow';
import { LayerBreadcrumb } from '@/components/depth/LayerBreadcrumb';
import { NewEntryEditor } from './NewEntryEditor';
import { PostEntryTransform } from './PostEntryTransform';
import { useDepthEntryFlow } from './useDepthEntryFlow';
import { haptics } from '@/services/haptics';
import { BodyMap } from '@/components/BodyMap';
import type { BodyLocation } from '@/services/somaticLog';
import { EMOTION_MAP, FAMILY_LABELS, type EmotionFamily } from '@/lib/emotions';
import type { BodyRegionId } from '@/lib/somatic';
import { getEntries } from '@/lib/journal';

const BODY_SUGGESTIONS: Partial<Record<BodyLocation, Array<{ family: EmotionFamily; id: string }>>> = {
  chest: [{ family: 'fear', id: 'anxious' }, { family: 'sadness', id: 'grieving' }, { family: 'anger', id: 'angry' }, { family: 'trust', id: 'loved' }],
  stomach: [{ family: 'fear', id: 'worried' }, { family: 'shame', id: 'guilty' }, { family: 'anticipation', id: 'nervous' }, { family: 'sadness', id: 'heavy' }],
  throat: [{ family: 'fear', id: 'anxious' }, { family: 'anger', id: 'frustrated' }, { family: 'sadness', id: 'sad' }, { family: 'shame', id: 'ashamed' }],
  jaw: [{ family: 'anger', id: 'angry' }, { family: 'fear', id: 'overwhelmed' }, { family: 'surprise', id: 'confused' }],
  head: [{ family: 'fear', id: 'overwhelmed' }, { family: 'surprise', id: 'confused' }, { family: 'anticipation', id: 'nervous' }],
  shoulders_left: [{ family: 'sadness', id: 'heavy' }, { family: 'anger', id: 'frustrated' }, { family: 'fear', id: 'anxious' }],
  shoulders_right: [{ family: 'sadness', id: 'heavy' }, { family: 'anger', id: 'frustrated' }, { family: 'fear', id: 'anxious' }],
  whole_body: [{ family: 'sadness', id: 'heavy' }, { family: 'fear', id: 'anxious' }, { family: 'surprise', id: 'confused' }, { family: 'joy', id: 'hopeful' }],
  nowhere_specific: [{ family: 'sadness', id: 'numb' }, { family: 'fear', id: 'anxious' }, { family: 'surprise', id: 'confused' }],
};

function toSelection(family: EmotionFamily, id: string): EmotionSelection {
  const found = EMOTION_MAP[family].find((item) => item.id === id) || null;
  if (found) return { familyId: family, specificId: id, label: found.label };
  return { familyId: family, specificId: null, label: FAMILY_LABELS[family] };
}

function mapBodyToRegion(location: BodyLocation): BodyRegionId {
  if (location === 'whole_body') return 'whole';
  if (location === 'nowhere_specific') return 'nowhere';
  if (location === 'solar_plexus') return 'stomach';
  if (location === 'shoulders_left' || location === 'shoulders_right' || location === 'upper_back' || location === 'lower_back') return 'shoulders';
  if (location === 'feet' || location === 'legs' || location === 'hips') return 'whole';
  if (location === 'hands') return 'hands';
  if (location === 'jaw') return 'face';
  if (location === 'head') return 'head';
  if (location === 'throat') return 'throat';
  if (location === 'chest') return 'chest';
  return 'stomach';
}

function bodyLabel(location: BodyLocation): string {
  if (location === 'shoulders_left' || location === 'shoulders_right') return 'shoulders';
  if (location === 'solar_plexus') return 'solar plexus';
  if (location === 'nowhere_specific') return 'body';
  if (location === 'whole_body') return 'whole body';
  return location.replaceAll('_', ' ');
}

export default function NewEntryClient() {
  const router = useRouter();
  const flow = useDepthEntryFlow();
  const journalEntryCount = useMemo(
    () => getEntries().filter((entry) => entry.type !== 'check-in' && entry.type !== 'checkin').length,
    [],
  );
  const [arrived, setArrived] = useState(flow.layer !== 'name');
  const [manualEmotionMode, setManualEmotionMode] = useState(false);
  const [showSpecificEmotionGrid, setShowSpecificEmotionGrid] = useState(false);
  const [showCustomEmotionInput, setShowCustomEmotionInput] = useState(false);
  const [customEmotionText, setCustomEmotionText] = useState('');
  const [showCompletionMoment, setShowCompletionMoment] = useState(false);
  const [bodySelection, setBodySelection] = useState<{ location: BodyLocation; sensation: string; intensity: number } | null>(null);
  const selectedEmotion = flow.emotionSelection;
  const showArrivingStage = !arrived && flow.layer === 'name' && !flow.savedId;
  const showEmotionSummary = !!selectedEmotion && !(arrived && flow.layer === 'feel' && !flow.savedId);
  const showFeelingStage = arrived && flow.layer === 'feel' && !flow.savedId;
  const showWritingStage = !flow.savedId && (flow.layer === 'write' || flow.layer === 'reflect' || flow.layer === 'explore' || flow.layer === 'closing');
  const hasUnsavedWriting = !flow.savedId && !!flow.content.trim();
  const openCanvas = showArrivingStage || showFeelingStage || showWritingStage || !!flow.savedId;
  const contextualSuggestions = useMemo(
    () => bodySelection ? (BODY_SUGGESTIONS[bodySelection.location] || BODY_SUGGESTIONS.nowhere_specific || []).map((item) => toSelection(item.family, item.id)) : [],
    [bodySelection],
  );
  const quickMoods: EmotionSelection[] = useMemo(() => ([
    { familyId: 'sadness', specificId: 'heavy', label: 'Heavy' },
    { familyId: 'fear', specificId: 'anxious', label: 'Anxious' },
    { familyId: 'surprise', specificId: null, label: 'Neutral' },
    { familyId: 'joy', specificId: 'hopeful', label: 'Hopeful' },
    { familyId: 'joy', specificId: 'peaceful', label: 'Peaceful' },
  ]), []);

  const commitCustomEmotion = () => {
    const label = customEmotionText.trim();
    if (!label) return;
    flow.setEmotionSelection({ familyId: 'surprise', specificId: null, label });
    flow.onSomaticContinue();
  };

  useEffect(() => {
    if (!showArrivingStage) return;
    setBodySelection(null);
    setShowCustomEmotionInput(false);
    setShowSpecificEmotionGrid(false);
    setCustomEmotionText('');
    flow.setEmotionSelection(null);
    flow.setSomatic(null);
  }, [showArrivingStage]);

  const onBack = () => {
    if (flow.savedId) {
      router.push('/dashboard/');
      return;
    }
    if (flow.layer === 'write' || flow.layer === 'reflect' || flow.layer === 'explore' || flow.layer === 'closing') {
      setArrived(true);
      flow.setLayer('feel');
      return;
    }
    if (flow.layer === 'feel') {
      setShowSpecificEmotionGrid(false);
      setShowCustomEmotionInput(false);
      setArrived(false);
      flow.setLayer('name');
      return;
    }
    if (showArrivingStage || flow.layer === 'name') {
      if (hasUnsavedWriting) {
        const words = flow.content.trim().split(/\s+/).filter(Boolean).length;
        if (words >= 20) {
          const discard = window.confirm('You have unsaved writing. Discard it?');
          if (!discard) return;
        }
      }
      router.push('/dashboard/');
      return;
    }
    router.back();
  };

  return (
    <div
      style={{
        padding: '22px 20px 30px',
        background: openCanvas ? 'transparent' : LAYER_BACKGROUNDS[flow.layer],
        borderRadius: openCanvas ? 0 : '22px',
        border: openCanvas ? 'none' : '1px solid var(--border-subtle)',
        boxShadow: openCanvas ? 'none' : 'inset 0 1px 0 rgba(240,243,237,0.04), 0 20px 46px rgba(45,51,42,0.24)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <button type="button" aria-label="Back" onClick={onBack} style={{ border: 'none', background: 'transparent', color: 'var(--gold-primary)', cursor: 'pointer', minHeight: '44px', padding: 0, fontSize: '13px', letterSpacing: '0.5px' }}>
          ← Back
        </button>
        <span style={{ minWidth: '44px' }} aria-hidden="true" />
      </div>

      {flow.state === 'loading' ? <LoadingState label="Preparing your page…" /> : null}
      {flow.state === 'error' ? <ErrorState message="ALCHM could not open the editor. Try again." onRetry={() => router.refresh()} /> : null}

      {flow.state === 'ready' ? (
        <>
          {showArrivingStage ? (
            <div style={{ marginTop: '30px', textAlign: 'center', padding: '30px 12px' }}>
              <p style={{ fontSize: '24px', lineHeight: 1.35, margin: 0, color: 'var(--text-primary)', fontWeight: 300, letterSpacing: '-0.02em' }}>
                Take a breath.
              </p>
              <p style={{ marginTop: '10px', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                You don&apos;t have to know what you feel yet.
              </p>
              <div className="breathing-dot" style={{ margin: '24px auto 22px' }} />
              <button
                type="button"
                className="btn-secondary"
                style={{ minWidth: '180px' }}
                onClick={() => {
                  setArrived(true);
                  setManualEmotionMode(false);
                  setShowSpecificEmotionGrid(false);
                  setShowCustomEmotionInput(false);
                  setCustomEmotionText('');
                  flow.setLayer('feel');
                  void haptics.light();
                }}
              >
                I&apos;m ready →
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  setArrived(true);
                  setManualEmotionMode(true);
                  setShowSpecificEmotionGrid(false);
                  setShowCustomEmotionInput(false);
                  setCustomEmotionText('');
                  flow.setLayer('feel');
                  void haptics.light();
                }}
              >
                I already know what I feel →
              </button>
            </div>
          ) : null}

          {showFeelingStage ? (
            <div style={{ marginTop: '16px' }}>
              {!manualEmotionMode ? (
                <>
                  <div style={{ fontSize: '22px', color: 'var(--text-primary)', lineHeight: 1.3, fontWeight: 300, letterSpacing: '-0.02em' }}>
                    Where do you feel it?
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Tap wherever something is alive in your body right now.
                  </p>
                  <BodyMap
                    onSelect={(payload) => {
                      setBodySelection(payload);
                      flow.setSomatic({ region: mapBodyToRegion(payload.location), description: payload.sensation || null });
                      void haptics.selection();
                    }}
                    onSkip={() => {
                      setManualEmotionMode(true);
                    }}
                  />
                  {bodySelection ? (
                    <div style={{ marginTop: '14px' }}>
                      <div style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Your {bodyLabel(bodySelection.location)} is {bodySelection.sensation || 'active'}.
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        That {bodySelection.sensation || 'feeling'} — does it feel more like:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {contextualSuggestions.map((option) => (
                          <button
                            key={`${option.familyId}-${option.specificId || 'family'}`}
                            type="button"
                            className="mood-chip"
                            onClick={() => {
                              flow.setEmotionSelection(option);
                              flow.onSomaticContinue();
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ marginTop: '10px' }}
                        onClick={() => {
                          setManualEmotionMode(true);
                          setShowCustomEmotionInput(true);
                        }}
                      >
                        Or something else entirely →
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {!showSpecificEmotionGrid ? (
                    <>
                      <div style={{ fontSize: '22px', color: 'var(--text-primary)', lineHeight: 1.3, fontWeight: 300, letterSpacing: '-0.02em' }}>
                        What&apos;s here with you?
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {quickMoods.map((mood) => (
                          <button
                            key={`${mood.label}`}
                            type="button"
                            className="mood-chip"
                            onClick={() => {
                              setShowCustomEmotionInput(false);
                              setCustomEmotionText('');
                              flow.setEmotionSelection(mood);
                              flow.onSomaticContinue();
                            }}
                          >
                            {mood.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ marginTop: '10px' }}
                        onClick={() => setShowSpecificEmotionGrid(true)}
                        disabled={journalEntryCount < 5}
                      >
                        {journalEntryCount < 5 ? 'More emotions unlock after a few entries' : 'Something more specific →'}
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        style={{ marginTop: '6px' }}
                        onClick={() => setShowCustomEmotionInput((prev) => !prev)}
                      >
                        Or something else entirely →
                      </button>
                      {showCustomEmotionInput ? (
                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            value={customEmotionText}
                            onChange={(event) => setCustomEmotionText(event.target.value)}
                            placeholder="Name it in your own words"
                            className="input"
                            style={{ flex: 1, minHeight: '40px' }}
                            aria-label="Custom emotion label"
                          />
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={commitCustomEmotion}
                            disabled={!customEmotionText.trim()}
                          >
                            Continue →
                          </button>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <EmotionSelector
                      value={selectedEmotion}
                      lateNight={flow.lateNight}
                      onChange={(selection) => {
                        setShowCustomEmotionInput(false);
                        setCustomEmotionText('');
                        flow.setEmotionSelection(selection);
                        flow.onSomaticContinue();
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      flow.setEmotionSelection(null);
                      flow.setLayer('write');
                    }}
                    style={{ marginTop: '10px', border: 'none', background: 'transparent', color: 'var(--text-muted)', minHeight: '44px', cursor: 'pointer' }}
                    aria-label="Skip emotion and just write"
                  >
                    Just write →
                  </button>
                </>
              )}
            </div>
          ) : null}

          {showEmotionSummary ? (
            <div style={{ marginTop: '12px', padding: '0 4px' }}>
              <LayerBreadcrumb family={selectedEmotion!.familyId} specificLabel={selectedEmotion!.specificId ? selectedEmotion!.label : null} />
            </div>
          ) : null}

          {showWritingStage ? (
            <div style={{ marginTop: '14px' }}>
              <NewEntryEditor
                content={flow.content}
                setContent={flow.setContent}
                tags={flow.tags}
                setTags={flow.setTags}
                pathwayId={flow.pathwayId}
                pathwayStep={flow.pathwayStep}
                onSave={flow.onSave}
                canSave={!flow.isSaving && !flow.savedId && !!flow.content.trim()}
                isSaving={flow.isSaving}
                writingPrompt={flow.writingPrompt}
                emotionFamily={selectedEmotion?.familyId || null}
                usedSomatic={!!flow.somatic}
                preferredFramework={flow.settings.preferredFramework}
                onBodyMapSelect={flow.setBodyMap}
                contextualPlaceholder={(() => {
                  const label = (selectedEmotion?.label || '').toLowerCase();
                  if (label === 'neutral' || label === 'numb') {
                    return 'Describe the nothing. Give it a shape, a color, a weight.';
                  }
                  if (selectedEmotion?.label || flow.somatic?.description) {
                    return `Write from that place${flow.somatic?.region ? ` in your ${flow.somatic.region}` : ''}. What feels most true there?`;
                  }
                  return 'Write what is true. One sentence is enough.';
                })()}
              />
              <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.2px' }}>Viewing through: {flow.lens}</div>
            </div>
          ) : null}

          <PostEntryTransform
            visible={!!flow.savedId}
            entryId={flow.savedId || null}
            entryText={flow.content}
            moodLabel={flow.emotionSelection?.label || null}
            pathwayStep={flow.pathwayStep}
            isReflecting={flow.isReflecting}
            reflection={flow.reflection}
            reflectionKind={flow.reflectionKind}
            reflectionError={flow.reflectionError}
            crisis={flow.savedCrisis}
            onReflect={() => {
              if (flow.savedId) void flow.reflect(flow.savedId);
            }}
            onDone={() => {
              if (flow.pathwayId && flow.pathwayStep === 21 && !showCompletionMoment) {
                setShowCompletionMoment(true);
                return;
              }
              router.push('/dashboard/');
            }}
            onReflectionComplete={flow.onReflectionComplete}
          />
          {showCompletionMoment ? (
            <div className="card" style={{ marginTop: '12px', textAlign: 'center', padding: '22px 18px' }}>
              <div style={{ fontSize: '24px', color: 'var(--text-primary)' }}>You finished something.</div>
              <div style={{ marginTop: '4px', fontSize: '16px', color: 'var(--text-secondary)' }}>That matters.</div>
              <div style={{ margin: '14px auto', width: '16px', height: '16px', borderRadius: '9999px', background: 'var(--gold-primary)' }} />
              <button type="button" className="btn-primary" onClick={() => router.push('/dashboard/')}>
                Return home →
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
