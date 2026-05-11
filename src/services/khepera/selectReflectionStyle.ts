import type { RenderingConstraints, TextStructureFeatures } from '@/types/khepera';

const IMAGERY_WORDS = [
  'shadow',
  'storm',
  'weight',
  'edge',
  'echo',
  'hollow',
  'glow',
  'pull',
  'drift',
  'burn',
  'shape',
  'quiet',
];

export function computeTextStructureFeatures(entryText: string): TextStructureFeatures {
  const trimmed = entryText.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean) : [];
  const sentenceParts = trimmed
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const punctuationMatches = trimmed.match(/[!?,;:()[\]—-]/g) ?? [];
  const lineBreakCount = (trimmed.match(/\n/g) ?? []).length;
  const fragmentCount = sentenceParts.filter((part) => part.split(/\s+/).filter(Boolean).length <= 4).length;
  const hasListStructure = trimmed
    .split('\n')
    .some((line) => /^\s*(?:[-*•]|\d+[.)])\s+/.test(line));
  const lowerText = trimmed.toLowerCase();
  const hasImageryLanguage = IMAGERY_WORDS.some((word) => lowerText.includes(word));

  return {
    wordCount: words.length,
    sentenceCount: sentenceParts.length,
    averageSentenceLength: sentenceParts.length > 0 ? words.length / sentenceParts.length : words.length,
    fragmentRatio: sentenceParts.length > 0 ? fragmentCount / sentenceParts.length : 0,
    punctuationDensity: words.length > 0 ? punctuationMatches.length / words.length : 0,
    lineBreakCount,
    hasListStructure,
    hasImageryLanguage,
  };
}

export function deriveRenderingConstraints(features: TextStructureFeatures): RenderingConstraints {
  const fragmented =
    features.fragmentRatio >= 0.5
    || features.averageSentenceLength <= 6
    || features.lineBreakCount >= 3;

  const structured =
    features.hasListStructure
    || features.lineBreakCount >= 2
    || features.averageSentenceLength >= 18;

  const style: RenderingConstraints['style'] = fragmented
    ? 'fragmented'
    : structured
    ? 'structured'
    : 'quiet';

  return {
    style,
    maxWitnessSentences: fragmented ? 1 : 2,
    maxPerspectiveSentences: features.wordCount <= 40 ? 1 : 2,
    preferEntryPhrasing: features.wordCount <= 140 || features.hasListStructure,
    allowMetaphorMirroring: features.hasImageryLanguage && !features.hasListStructure,
    phrasingProximity: fragmented || features.wordCount <= 80 ? 'close' : 'standard',
    seedFocus: features.hasListStructure
      ? 'present'
      : features.averageSentenceLength >= 18
      ? 'temporal'
      : 'relational',
  };
}

export function selectReflectionStyle(entryText: string): RenderingConstraints {
  return deriveRenderingConstraints(computeTextStructureFeatures(entryText));
}
