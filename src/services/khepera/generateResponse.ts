import { analyzeEntry } from './analyzeEntry';
import { buildKheperaPrompt } from './buildKheperaPrompt';
import { detectCrisisSignals, CRISIS_RESPONSE } from './crisisDetection';
import { extractEntryAnchors } from './extractEntryAnchors';
import { generateReflection } from './generateReflection';
import { validateKheperaOutput } from './qualityGuards';
import { selectReflectionMode } from './selectReflectionMode';
import { buildStanceFallback } from './styleEngine';
import { validateGeneratedKheperaResponse } from './validateKheperaResponse';
import { buildEvaluationRetryFeedback, evaluateKheperaResponse } from './evaluateResponse';
import { requestModelText, resolveAiProviderName } from '@/services/ai/modelProvider';
import type { KheperaUserContext, KheperaResponse, ReflectionMode, ReflectionTiming, ResponseStance } from '@/types/khepera';
import type { ReflectionAnalysis } from '@/types/khepera';
import type { GuardedModelTextResponse, ModelProviderRequest } from '@/services/ai/types';
import { recordOperationalException } from '@/services/monitoring/telemetry';

// Internal generator. Canonical callers should go through ./service so
// crisis detection runs synchronously before any model call.

const DEBUG_KHEPERA_EVAL = process.env.KHEPERA_DEBUG_EVAL === '1';

export interface KheperaReviewAttempt {
  attempt: number;
  validationFailed: boolean;
  validationReason?: string;
  evaluation?: ReturnType<typeof evaluateKheperaResponse>;
}

export interface KheperaReviewReport {
  crisisBlocked: boolean;
  analysis: ReflectionAnalysis;
  stance: ResponseStance;
  mode: ReflectionMode;
  retryHappened: boolean;
  fallbackHappened: boolean;
  attempts: KheperaReviewAttempt[];
  finalResponse: KheperaResponse;
}

export type CompanionTextRequest = ModelProviderRequest;
export type CompanionTextResult = GuardedModelTextResponse;

export async function createModelText(
  request: CompanionTextRequest,
): Promise<CompanionTextResult> {
  return requestModelText(request);
}

function logKheperaDebug(event: string, details: Record<string, unknown>): void {
  if (!DEBUG_KHEPERA_EVAL) {
    return;
  }

  console.log(`[khepera-debug] ${event}`, details);
}

function hasLanguageDifferentiationFlag(flags: string[]): boolean {
  return flags.some((flag) => (
    flag === 'repeated_opening_pattern'
    || flag === 'overused_khepera_phrase'
    || flag === 'insufficient_language_differentiation'
    || flag === 'template_repetition'
  ));
}

export async function generateKheperaResponse(
  entryText: string,
  context?: KheperaUserContext,
  options: { abortSignal?: AbortSignal; createText?: typeof createModelText; reflectionTiming?: ReflectionTiming } = {}
): Promise<KheperaResponse> {
  const review = await generateKheperaReviewReport(entryText, context, options);
  return review.finalResponse;
}

export async function generateKheperaReviewReport(
  entryText: string,
  context?: KheperaUserContext,
  options: { abortSignal?: AbortSignal; createText?: typeof createModelText; reflectionTiming?: ReflectionTiming } = {}
): Promise<KheperaReviewReport> {
  const analysis = analyzeEntry(entryText, context?.dominantTone);
  const reflectionPlan = generateReflection({
    entryText,
    analysis,
    context,
  });
  const stance = reflectionPlan.stance;
  const mode = selectReflectionMode(analysis, stance);
  const attempts: KheperaReviewAttempt[] = [];
  const createText = options.createText ?? createModelText;
  const provider = resolveAiProviderName();
  const entryAnchors = extractEntryAnchors(entryText);

  try {
    if (detectCrisisSignals(entryText)) {
      return {
        crisisBlocked: true,
        analysis,
        stance,
        mode,
        retryHappened: false,
        fallbackHappened: false,
        attempts,
        finalResponse: CRISIS_RESPONSE,
      };
    }

    let bestSafeCandidate: { response: KheperaResponse; score: number } | null = null;
    let evaluationFeedback = '';

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const prompts = buildKheperaPrompt({
        entryText,
        analysis,
        mode,
        stance,
        currentThemes: reflectionPlan.currentThemes,
        memorySignal: reflectionPlan.memorySignal,
        continuityMode: reflectionPlan.continuityMode,
        styleProfile: reflectionPlan.styleProfile,
        context,
        entryAnchors,
        stricter: attempt > 0,
        evaluationFeedback,
        provider,
        reflectionTiming: options.reflectionTiming,
      });

      const response = await createText({
        inputTextForSafety: entryText,
        model: provider === 'openai'
          ? process.env.OPENAI_KHEPERA_MODEL || 'gpt-4.1-mini'
          : 'claude-sonnet-4-20250514',
        maxTokens: 460,
        temperature: 0.55,
        responseFormat: 'khepera_json',
        system: prompts.system,
        prompt: prompts.user,
        abortSignal: options.abortSignal,
      });

      if (response.blockedByCrisis) {
        return {
          crisisBlocked: true,
          analysis,
          stance,
          mode,
          retryHappened: false,
          fallbackHappened: false,
          attempts,
          finalResponse: CRISIS_RESPONSE,
        };
      }

      const parsed = parseStructuredKheperaResponse(response.text, mode);
      if (!parsed) {
        logKheperaDebug('structured_parse_failed', {
          attempt: attempt + 1,
          mode,
        });
        attempts.push({
          attempt: attempt + 1,
          validationFailed: true,
          validationReason: 'structured_parse_failed',
        });
        continue;
      }

      const quality = validateKheperaOutput(parsed, { entryAnchors });
      if (!quality.ok) {
        logKheperaDebug('quality_failed', {
          attempt: attempt + 1,
          mode,
          stance,
          flags: quality.flags,
        });
        attempts.push({
          attempt: attempt + 1,
          validationFailed: true,
          validationReason: quality.flags.join(','),
        });
        const languageRetry = hasLanguageDifferentiationFlag(quality.flags)
          ? 'The previous response followed a familiar Khepera cadence. Rewrite it with a different sentence shape while staying grounded in the current entry anchors.\nDo not reuse the same grammatical opening across Witness, Perspective, and Seed.\nKeep the seed exactly one open-ended, non-action-oriented question.'
          : '';
        const groundingRetry = quality.flags.includes('insufficient_entry_grounding')
          ? `The previous response failed quality review with flags: ${quality.flags.join(', ')}.\nThe previous response was too general. Rewrite using the current entry's specific language, tension, or contrast.\nGrounding flag: insufficient_entry_grounding.\nCurrent entry anchors:\n${entryAnchors.map((anchor) => `- ${anchor.phrase} (${anchor.kind})`).join('\n')}`
          : `The previous response failed quality review with flags: ${quality.flags.join(', ')}.\nRewrite with closer specificity, stronger stance fit, calmer language, and keep the seed as exactly one open-ended question.`;
        evaluationFeedback = [groundingRetry, languageRetry].filter(Boolean).join('\n');
        continue;
      }

      const validation = validateGeneratedKheperaResponse({
        response: parsed,
        sourceText: entryText,
        analysis,
        mode,
      });
      if (!validation.ok) {
        logKheperaDebug('validation_failed', {
          attempt: attempt + 1,
          mode,
          reason: validation.reason,
        });
        attempts.push({
          attempt: attempt + 1,
          validationFailed: true,
          validationReason: validation.reason,
        });
        evaluationFeedback = `The previous response failed validation: ${validation.reason}.\nRewrite with closer grounding and maintain the exact three-part structure.`;
        continue;
      }

      const evaluation = evaluateKheperaResponse({
        response: parsed,
        entryText,
        entryTone: analysis.emotionalTone,
      });
      logKheperaDebug('evaluation_result', {
        attempt: attempt + 1,
        mode,
        blocked: evaluation.blocked,
        shouldRetry: evaluation.shouldRetry,
        safeCandidate: evaluation.safeCandidate,
        score: evaluation.score,
        resonance: evaluation.resonance,
        specificity: evaluation.specificity,
        neutrality: evaluation.neutrality,
        reasons: evaluation.reasons,
        templateLike: evaluation.templateLike,
        derivativeMirroring: evaluation.derivativeMirroring,
        heavyToneDosageIssue: evaluation.heavyToneDosageIssue,
      });
      attempts.push({
        attempt: attempt + 1,
        validationFailed: false,
        evaluation,
      });

      if (evaluation.safeCandidate && (!bestSafeCandidate || evaluation.score > bestSafeCandidate.score)) {
        bestSafeCandidate = { response: parsed, score: evaluation.score };
      }

      if (!evaluation.shouldRetry) {
        return {
          crisisBlocked: false,
          analysis,
          stance,
          mode,
          retryHappened: attempts.length > 1,
          fallbackHappened: false,
          attempts,
          finalResponse: parsed,
        };
      }

      if (attempt === 0) {
        evaluationFeedback = buildEvaluationRetryFeedback(evaluation);
      }
    }

    if (bestSafeCandidate) {
      return {
        crisisBlocked: false,
        analysis,
        stance,
        mode,
        retryHappened: attempts.length > 1,
        fallbackHappened: false,
        attempts,
        finalResponse: bestSafeCandidate.response,
      };
    }
  } catch (error) {
    logKheperaDebug('generation_error', {
      mode,
      stance,
      message: error instanceof Error ? error.message : String(error),
      attempts: attempts.length,
    });
    recordOperationalException('model_failure', error, { state: 'khepera_generation_failed', issue: 'fallback_response' });
  }

  return {
    crisisBlocked: false,
    analysis,
    stance,
    mode,
    retryHappened: attempts.length > 1,
    fallbackHappened: true,
    attempts,
    finalResponse: buildStanceFallback(stance, entryAnchors),
  };
}

export function parseStructuredKheperaResponse(
  fullText: string,
  mode: ReflectionMode
): KheperaResponse | null {
  const jsonCandidate = extractJsonObjectCandidate(fullText);
  if (jsonCandidate) {
    try {
      const parsed = JSON.parse(jsonCandidate) as Partial<KheperaResponse>;
      if (
        typeof parsed.witness === 'string'
        && typeof parsed.perspective === 'string'
        && typeof parsed.seed === 'string'
      ) {
        return validateStructuredLengths({
          witness: parsed.witness,
          perspective: parsed.perspective,
          seed: parsed.seed,
        }, mode);
      }
    } catch {
      // Fall through to legacy label parsing.
    }
  }

  const witnessMatch = fullText.match(/WITNESS:\s*([\s\S]*?)(?=PERSPECTIVE:|SEED:|$)/i);
  const perspectiveMatch = fullText.match(/PERSPECTIVE:\s*([\s\S]*?)(?=SEED:|$)/i);
  const seedMatch = fullText.match(/SEED:\s*([\s\S]+?)$/i);
  if (!witnessMatch || !perspectiveMatch || !seedMatch) {
    return null;
  }

  const witness = witnessMatch[1].trim();
  const perspective = perspectiveMatch[1].trim();
  const seedText = seedMatch[1].trim();
  return validateStructuredLengths({
    witness,
    perspective,
    seed: seedText,
  }, mode);
}

function extractJsonObjectCandidate(fullText: string): string | null {
  const trimmed = fullText.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  return null;
}

function validateStructuredLengths(
  response: KheperaResponse,
  mode: ReflectionMode,
): KheperaResponse | null {
  const { witness, perspective, seed: seedText } = response;
  const combinedResponse = `${witness}\n\n${perspective}`;
  if (combinedResponse.length < 80 || combinedResponse.length > 460) {
    return null;
  }

  if (seedText.length < 10 || seedText.length > 120) {
    return null;
  }

  if (mode === 'pure_witness' && perspective.split(/\s+/).filter(Boolean).length > 35) {
    return null;
  }

  return response;
}
