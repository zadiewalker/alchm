
import { useCallback, useState } from 'react';
import { getReflection, type ReflectionResult } from '@/lib/api';
import { getEntries, updateEntry } from '@/lib/journal';
import { buildSystemPrompt, getCurrentStage } from '@/lib/khepera';
import { getAnthropicApiKey, readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';
import { extractInsights } from '@/lib/extract';
import { getStreak } from '@/lib/streaks';
import { getTimeContext } from '@/lib/timeAware';
import { isOnline } from '@/services/networkStatus';
import { queueReflection } from '@/services/offlineQueue';
import { announce } from '@/services/announce';
import { filterKheperaResponse } from '@/services/safetyFilter';
import { normalizeReflectionText } from '@/lib/reflectionText';
import { getPathwayGuidance } from '@/lib/pathways';
import { clearPendingRupture, getPendingRupture, REPAIR_RESPONSE_MODIFIER, RUPTURE_RESPONSE_MODIFIER } from '@/services/ruptureRepair';
import { evaluateSacredSilence } from '@/services/kheperaSilence';
import { getFeatureFlags } from '@/services/featureFlags';
import { getLatestPatternAnalysis } from '@/services/patternEngine';
import { buildQualityGateFixInstruction, evaluateKheperaQuality } from '@/services/kheperaQualityGate';
import { getGrowthProfile } from '@/services/growthService';
import { detectPlateau, detectTherapeuticPhase, hasDismissiveResistance, hasNumbnessLanguage, isPostBreakthroughRegression } from '@/lib/therapeuticArc';
import { buildExerciseContext } from '@/lib/postEntryExercises';

export function useKheperaReflection(args: { preferredFramework: string | null }) {
  const [reflection, setReflection] = useState('');
  const [reflectionKind, setReflectionKind] = useState<'normal' | 'silent'>('normal');
  const [reflectionError, setReflectionError] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);

  const reflect = useCallback(
    async (entryId: string) => {
      setIsReflecting(true);
      setReflectionError('');

      try {
        const entry = getEntries().find((e) => e.id === entryId) || null;
        if (!entry) {
          setReflectionError('Entry not found.');
          setIsReflecting(false);
          return;
        }

        const apiKey = getAnthropicApiKey();
        if (!apiKey) {
          const local = normalizeReflectionText(createLocalReflection(entry));
          updateEntry(entryId, { kheperaReflection: local });
          setReflection(local);
          setReflectionKind('normal');
          setIsReflecting(false);
          return;
        }

        const entryCount = getEntries().length;
        const allEntries = getEntries();
        const stage = getCurrentStage(entryCount);
        const streak = getStreak();
        const flags = getFeatureFlags();
        const pattern = flags.patternIntelligence ? getLatestPatternAnalysis() : null;
        const pendingRupture = flags.ruptureRepair ? getPendingRupture() : null;
        const preferred =
          args.preferredFramework === 'cbt' ||
          args.preferredFramework === 'ifs' ||
          args.preferredFramework === 'somatic' ||
          args.preferredFramework === 'narrative' ||
          args.preferredFramework === 'existential'
            ? args.preferredFramework
            : null;

        const time = getTimeContext();
        const entryTextRaw = entry.content || '';
        const entryText = entryTextRaw.length > 12000 ? entryTextRaw.slice(0, 12000) : entryTextRaw;
        const relationalContext = (
          flags.relationalAwareness &&
          pattern?.relationalEntities?.length
            ? getMatchedRelationalContext(entryTextRaw, pattern.relationalEntities)
            : ''
        );

        const therapeuticPhase = detectTherapeuticPhase(allEntries);
        const plateau = detectPlateau(allEntries);
        const plateauAlreadyOffered = readJsonExact<boolean>(STORAGE_KEYS.plateauReflectionOffered, false);
        const shouldOfferPlateauObservation = therapeuticPhase === 'plateau' && plateau.isPlateau && !plateauAlreadyOffered;
        const postBreakthroughGentle = isPostBreakthroughRegression(allEntries, entryId);
        const dismissiveResistance = hasDismissiveResistance(entryTextRaw);
        const numbnessSupport = hasNumbnessLanguage(entryTextRaw) || (entry.emotionSelection?.label || '').toLowerCase() === 'neutral';
        const exerciseContext = buildExerciseContext(entry.postEntryData?.exerciseResults || []);

        const systemPrompt = buildSystemPrompt({
          entryCount,
          currentStreak: Math.max(0, Number(streak.currentStreak || 0)),
          preferredFramework: preferred,
          isCheckin: false,
          therapeuticPhase,
          firstReflection: entryCount <= 1,
          forceNoQuestion: entryCount <= 7,
          plateauObservation: shouldOfferPlateauObservation
            ? "Your entries have gotten quieter lately. That can mean rest, protection, distraction, or something underneath that hasn't reached language yet. There's no wrong way to be here."
            : null,
          postBreakthroughGentle,
          dismissiveResistance,
          numbnessSupport,
          continuityContext: `Stage: ${stage.name}${
            flags.patternIntelligence && pattern?.emotionalCycles[0] ? `\nPattern context: ${pattern.emotionalCycles[0].pattern}` : ''
          }${
            relationalContext ? `\nRelational context: ${relationalContext}` : ''
          }${
            pendingRupture ? `\nRupture context: ${pendingRupture.type} (${pendingRupture.userResponse})` : ''
          }${
            exerciseContext ? `\nPost-entry exercise context: ${exerciseContext}` : ''
          }`,
          ...(flags.adaptiveContainers && entry.pathwayId && entry.pathwayStep ? (getPathwayGuidance(entry.pathwayId, entry.pathwayStep) || {}) : {}),
          depth: {
            emotionLabel: entry.emotionSelection?.label ?? null,
            emotionFamily: entry.emotionSelection?.familyId ?? null,
            emotionSpecificId: entry.emotionSelection?.specificId ?? null,
            sensation: entry.somatic ? { region: entry.somatic.region, description: entry.somatic.description } : null,
          },
        });
        if (!isOnline()) {
          queueReflection({
            entry_id: entryId,
            entry_text: entryText,
            queued_at: new Date().toISOString(),
          });
          setReflectionError("Khepera will reflect when you're back online. Your words are saved.");
          announce("Khepera will reflect when you're back online.");
          setIsReflecting(false);
          return;
        }
        const phaseId = getGrowthProfile().current_phase;
        const baseSystemPrompt = pendingRupture
          ? `${systemPrompt}\n\n${pendingRupture.type === 'explicit' ? RUPTURE_RESPONSE_MODIFIER : REPAIR_RESPONSE_MODIFIER}`
          : systemPrompt;

        const result = await generateQualityCheckedReflection({
          systemPrompt: baseSystemPrompt,
          userMessage: entryText,
          apiKey,
          maxTokens: time.ui.reflectionMaxTokens,
          phaseId,
        });

        if (result.error) {
          const authish = /can't connect right now/i.test(result.error);
          if (authish) {
            setReflectionError(result.error);
            setIsReflecting(false);
            return;
          }
          queueReflection({
            entry_id: entryId,
            entry_text: entryText,
            queued_at: new Date().toISOString(),
          });
          setReflectionError("Khepera will reflect when you're back online. Your words are saved.");
          announce("Khepera will reflect when you're back online.");
        } else if (result.text) {
          const safe = entry.pathwayId && entry.pathwayStep === 21
            ? enforceDay21ClosingStatement(result.text)
            : result.text;
          const phaseSafe = enforcePhaseFormatting(safe, { forceStatementOnly: entryCount <= 7 || postBreakthroughGentle, maxSentences: entryCount <= 1 ? 3 : undefined });
          const silence = flags.sacredSilence
            ? evaluateSacredSilence({
              entryId,
              userEntry: entryText,
              generatedReflection: phaseSafe,
              mood: entry.emotionSelection?.label || entry.extractedMood || null,
              entryCount,
            })
            : { silent: false, silenceMessage: '' };

          if (silence.silent) {
            updateEntry(entryId, {
              kheperaReflection: '',
              kheperaSilenceMessage: silence.silenceMessage,
              kheperaSilenceReason: silence.reason || null,
            });
            setReflection(silence.silenceMessage);
            setReflectionKind('silent');
          } else {
            updateEntry(entryId, { kheperaReflection: phaseSafe, kheperaSilenceMessage: null, kheperaSilenceReason: null });
            setReflection(phaseSafe);
            setReflectionKind('normal');
          }
          if (shouldOfferPlateauObservation) {
            writeJson(STORAGE_KEYS.plateauReflectionOffered, true);
          }
          if (pendingRupture) clearPendingRupture();

          // Optional extraction (cheap model) runs in the background.
          const extraction = await extractInsights(entryText, apiKey);
          if (extraction) {
            updateEntry(entryId, {
              extractedMood: extraction.suggestedMood,
              extractedThemes: extraction.themes,
              intensity: extraction.intensity,
              suggestedLens: extraction.suggestedLens,
            });
          }
        }
      } catch {
        setReflectionError('Khepera could not reflect right now. Your entry is saved.');
      } finally {
        setIsReflecting(false);
      }
    },
    [args.preferredFramework],
  );

  return { reflection, reflectionKind, setReflection, reflectionError, setReflectionError, isReflecting, reflect };
}

function enforcePhaseFormatting(text: string, args: { forceStatementOnly: boolean; maxSentences?: number }): string {
  let next = String(text || '').trim();
  if (!next) return next;

  if (typeof args.maxSentences === 'number' && args.maxSentences > 0) {
    const sentences = next.match(/[^.!?]+[.!?]+/g) || [next];
    next = sentences.slice(0, args.maxSentences).join(' ').trim();
  }

  if (args.forceStatementOnly && next.endsWith('?')) {
    next = next.replace(/\?+\s*$/, '.');
  }

  if (!/[.!]$/.test(next)) next = `${next}.`;
  return next;
}

async function generateQualityCheckedReflection(args: {
  systemPrompt: string;
  userMessage: string;
  apiKey: string;
  maxTokens: number;
  phaseId: ReturnType<typeof getGrowthProfile>['current_phase'];
}): Promise<ReflectionResult> {
  const maxRegenerations = 2;
  let revisionInstruction = '';

  for (let attempt = 0; attempt <= maxRegenerations; attempt += 1) {
    const prompt = revisionInstruction
      ? `${args.systemPrompt}\n\n${revisionInstruction}`
      : args.systemPrompt;

    const response = await getReflection({
      systemPrompt: prompt,
      userMessage: args.userMessage,
      apiKey: args.apiKey,
      maxTokens: args.maxTokens,
    });

    if (response.error || !response.text) return response;

    const safe = filterKheperaResponse(normalizeReflectionText(response.text)).filtered;
    const quality = evaluateKheperaQuality({ text: safe, phaseId: args.phaseId });
    if (quality.passed || attempt === maxRegenerations) return { text: safe, error: null };

    revisionInstruction = buildQualityGateFixInstruction(quality);
  }

  return { text: null, error: 'Unable to generate a reflection right now.' };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function getMatchedRelationalContext(
  entryText: string,
  entities: Array<{ name: string; emotionalValence: { trending: string } }>,
): string {
  const text = entryText.toLowerCase();
  const matches = entities.filter((entity) => {
    const raw = (entity.name || '').trim().toLowerCase();
    if (!raw) return false;
    const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  });
  return matches
    .slice(0, 2)
    .map((entity) => `${entity.name} (${entity.emotionalValence.trending})`)
    .join(', ');
}

function createLocalReflection(entry: { content?: string | null }): string {
  const text = String(entry.content || '').toLowerCase();

  const emotionPatterns: Record<string, string[]> = {
    anxious: ['anxious', 'worried', 'stress', 'nervous', 'overwhelm'],
    sad: ['sad', 'down', 'lonely', 'empty', 'hopeless'],
    angry: ['angry', 'mad', 'frustrated', 'furious'],
    grateful: ['grateful', 'thank', 'appreciate', 'blessed'],
    peaceful: ['calm', 'peaceful', 'quiet', 'stillness'],
    hopeful: ['hope', 'forward', 'improving', 'better'],
    confused: ['confused', 'lost', 'uncertain', 'unclear', 'mixed'],
  };

  const detected: string[] = [];
  for (const [emotion, words] of Object.entries(emotionPatterns)) {
    if (words.some((w) => text.includes(w))) detected.push(emotion);
  }

  const emotionalRecognition = detected.length
    ? `You named ${detected.slice(0, 2).join(' and ')} directly, and that clarity matters.`
    : 'There is something tender being named here, even if it still feels hard to hold.';

  const strengths: string[] = [];
  if (text.includes('try')) strengths.push('perseverance');
  if (text.includes('help') || text.includes('support')) strengths.push('seeking connection');
  if (text.includes('understand') || text.includes('notice')) strengths.push('self-awareness');
  if (String(entry.content || '').trim().split(/\\s+/).length > 40) strengths.push('thoughtful reflection');

  const strengthIdentification = strengths.length
    ? `I also notice ${pick(strengths)} in the way you wrote this.`
    : 'Writing this down is its own kind of steadiness.';

  const endings = [
    'What feels most true under that right now?',
    'What feels closest to the center of this for you?',
    'What feels present in you as you read this back?',
  ];

  return `${emotionalRecognition} ${strengthIdentification} ${pick(endings)}`;
}

function enforceDay21ClosingStatement(text: string): string {
  const trimmed = String(text || '').trim();
  if (!trimmed) return 'You finished something. That matters.';

  let next = trimmed;
  if (next.endsWith('?')) {
    const beforeQuestion = next.slice(0, -1).trim();
    const sentenceStart = Math.max(
      beforeQuestion.lastIndexOf('.'),
      beforeQuestion.lastIndexOf('!'),
    );
    const withoutLastSentence = sentenceStart >= 0 ? beforeQuestion.slice(0, sentenceStart + 1).trim() : '';
    next = withoutLastSentence || `${beforeQuestion}.`;
  }

  if (!/[.!]$/.test(next)) next = `${next}.`;
  if (!/You finished something\. That matters\./i.test(next)) {
    next = `${next} You finished something. That matters.`;
  }
  return next;
}
