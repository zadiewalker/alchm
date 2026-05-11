import type { KheperaResponse, ReflectionAnalysis, ReflectionMode, ResponseStance } from '@/types/khepera';
import { lintKheperaResponse } from './outputValidation';
import { selectStance } from './selectStance';

const MODE_HINTS: Record<ReflectionMode, RegExp[]> = {
  pure_witness: [/\bright now\b/i, /\bhere\b/i, /\bthis\b/i],
  gentle_naming: [/\byou describe\b/i, /\byou name\b/i, /\byou write\b/i],
  spacious_clarification: [/\bshape\b/i, /\bpattern\b/i, /\bclear\b/i],
  ambivalence_holding: [/\bboth\b/i, /\bat the same time\b/i, /\bpart of you\b/i],
  self_protection_reframe: [/\bprotect|protection|guard\b/i],
  tenderness_invitation: [/\bgentle|soft|tender\b/i],
  meaning_emergence: [/\bemerging|forming|becoming|already\b/i],
  movement_marking: [/\bshift|changed|moving|turn\b/i],
};

const STANCE_HINTS: Record<ResponseStance, RegExp[]> = {
  witnessing: [/\byou describe\b/i, /\byou write\b/i, /\bin what you wrote\b/i],
  containing: [/\bright now\b/i, /\bhere\b/i, /\byour body\b/i],
  clarifying: [/\bclear(?:er)?\b/i, /\bshape\b/i, /\bthread\b/i, /\bcontrast\b/i],
  expanding: [/\banother way\b/i, /\balso\b/i, /\bwider\b/i, /\bmore than one\b/i],
  integrating: [/\bat the same time\b/i, /\btogether\b/i, /\bbetween\b/i, /\bwhile\b/i],
  holding_ambiguity: [/\bboth\b/i, /\bunclear\b/i, /\bnot fully\b/i, /\bat the same time\b/i],
};

function countQuestions(seed: string): number {
  return (seed.match(/\?/g) || []).length;
}

function hasModeSignal(mode: ReflectionMode, response: KheperaResponse): boolean {
  const text = `${response.witness}\n${response.perspective}\n${response.seed}`;
  return MODE_HINTS[mode].some((pattern) => pattern.test(text));
}

function hasStanceSignal(stance: ResponseStance, response: KheperaResponse): boolean {
  const text = `${response.witness}\n${response.perspective}\n${response.seed}`;
  return STANCE_HINTS[stance].some((pattern) => pattern.test(text));
}

function modeRequiresSignal(mode: ReflectionMode, analysis: ReflectionAnalysis): boolean {
  if (mode === 'gentle_naming' || mode === 'spacious_clarification') return false;
  if (mode === 'pure_witness' && analysis.intensity === 'medium') return false;
  return true;
}

export function validateGeneratedKheperaResponse(params: {
  response: KheperaResponse;
  sourceText: string;
  analysis: ReflectionAnalysis;
  mode: ReflectionMode;
}): { ok: true } | { ok: false; reason: string } {
  const { response, sourceText, analysis, mode } = params;
  const stance = selectStance(analysis);
  const issues = lintKheperaResponse(response, sourceText);

  if (!response.witness.trim() || !response.perspective.trim() || !response.seed.trim()) {
    return { ok: false, reason: 'missing_sections' };
  }

  if (countQuestions(response.seed) !== 1 || !response.seed.trim().endsWith('?')) {
    return { ok: false, reason: 'seed_question_count' };
  }

  if (issues.length > 0) {
    return { ok: false, reason: issues[0].code };
  }

  if (modeRequiresSignal(mode, analysis) && !hasModeSignal(mode, response) && !hasStanceSignal(stance, response)) {
    return { ok: false, reason: 'mode_alignment' };
  }

  return { ok: true };
}
