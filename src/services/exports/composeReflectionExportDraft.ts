import type {
  ReflectionExportDocument,
  ReflectionExportInput,
} from '../../types/exports';
import {
  REFLECTION_EXPORT_BOUNDARY_NOTE,
  REFLECTION_EXPORT_VERSION,
} from '../../config/exports/reflectionExportConstants';
import { getReflectionExportFramingMeta } from '../../config/exports/reflectionExportUi';
import type { EmotionalTone, ThemeTag } from '../../types/journal';
import { selectReturnExcerpt } from '../returns/returnPreview';

const THEME_LABELS: Record<ThemeTag, string> = {
  grief_loss: 'grief and loss',
  relationship_tension: 'relationship strain',
  self_worth: 'self-worth',
  identity: 'identity',
  work_purpose: 'work and purpose',
  fear_uncertainty: 'fear and uncertainty',
  anger_injustice: 'anger and injustice',
  body_health: 'body and health',
  creativity_expression: 'creativity and expression',
  spirituality_meaning: 'meaning',
  rest_recovery: 'rest and recovery',
  joy_gratitude: 'moments of gratitude',
  transition_change: 'change and transition',
  boundary_setting: 'boundaries',
  childhood_origin: 'earlier experiences',
};

const TONE_LABELS: Record<EmotionalTone, string> = {
  processing: 'processing',
  grief: 'grief',
  anger: 'anger',
  anxiety: 'anxiety',
  clarity: 'clarity',
  numbness: 'numbness',
  tenderness: 'tenderness',
  ambivalence: 'ambivalence',
};

const THEME_KEYWORDS: Array<{ tag: ThemeTag; keywords: RegExp[] }> = [
  { tag: 'grief_loss', keywords: [/\bgrief\b/i, /\bloss\b/i, /\bmissing\b/i, /\bmourning\b/i] },
  { tag: 'relationship_tension', keywords: [/\brelationship\b/i, /\bpartner\b/i, /\bfriend\b/i, /\bfamily\b/i, /\bmother\b/i, /\bfather\b/i] },
  { tag: 'self_worth', keywords: [/\bworthy\b/i, /\bworth\b/i, /\benough\b/i, /\bshame\b/i] },
  { tag: 'identity', keywords: [/\bidentity\b/i, /\bwho i am\b/i, /\bmyself\b/i] },
  { tag: 'work_purpose', keywords: [/\bwork\b/i, /\bjob\b/i, /\bpurpose\b/i, /\bcareer\b/i] },
  { tag: 'fear_uncertainty', keywords: [/\bafraid\b/i, /\bfear\b/i, /\buncertain\b/i, /\bunsure\b/i] },
  { tag: 'anger_injustice', keywords: [/\bangry\b/i, /\bresent\b/i, /\bunfair\b/i, /\binjustice\b/i] },
  { tag: 'body_health', keywords: [/\bbody\b/i, /\bpain\b/i, /\bhealth\b/i, /\btired\b/i, /\bsleep\b/i] },
  { tag: 'creativity_expression', keywords: [/\bwrite\b/i, /\bcreate\b/i, /\bpaint\b/i, /\bmusic\b/i] },
  { tag: 'spirituality_meaning', keywords: [/\bmeaning\b/i, /\bfaith\b/i, /\bspiritual\b/i] },
  { tag: 'rest_recovery', keywords: [/\brest\b/i, /\brecover\b/i, /\bpause\b/i, /\bslow\b/i] },
  { tag: 'joy_gratitude', keywords: [/\bjoy\b/i, /\bgrateful\b/i, /\bgratitude\b/i] },
  { tag: 'transition_change', keywords: [/\bchange\b/i, /\btransition\b/i, /\bending\b/i, /\bbeginning\b/i] },
  { tag: 'boundary_setting', keywords: [/\bboundary\b/i, /\bno\b/i, /\blimit\b/i] },
  { tag: 'childhood_origin', keywords: [/\bchildhood\b/i, /\byounger\b/i, /\bwhen i was little\b/i] },
];

const TONE_KEYWORDS: Array<{ tone: EmotionalTone; keywords: RegExp[] }> = [
  { tone: 'processing', keywords: [/\btrying to hold\b/i, /\bworking through\b/i, /\bprocessing\b/i] },
  { tone: 'grief', keywords: [/\bgrief\b/i, /\bloss\b/i, /\bmissing\b/i] },
  { tone: 'anger', keywords: [/\bangry\b/i, /\bfurious\b/i, /\bresentful\b/i] },
  { tone: 'anxiety', keywords: [/\banxious\b/i, /\bunsettled\b/i, /\bworried\b/i, /\brestless\b/i] },
  { tone: 'clarity', keywords: [/\bclear\b/i, /\bclarity\b/i, /\bunderstand\b/i] },
  { tone: 'numbness', keywords: [/\bnumb\b/i, /\bflat\b/i, /\bdisconnected\b/i] },
  { tone: 'tenderness', keywords: [/\btender\b/i, /\bsoft\b/i, /\bgentle\b/i] },
  { tone: 'ambivalence', keywords: [/\bambivalent\b/i, /\btorn\b/i, /\bmixed\b/i] },
];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function joinLabels(labels: string[]): string {
  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

function incrementCount(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function collectThemes(input: ReflectionExportInput): string[] {
  const counts = new Map<string, number>();

  input.themeTags?.forEach((tag) => incrementCount(counts, THEME_LABELS[tag]));

  input.selectedSources.forEach((source) => {
    THEME_KEYWORDS.forEach(({ tag, keywords }) => {
      if (keywords.some((keyword) => keyword.test(source.content))) {
        incrementCount(counts, THEME_LABELS[tag]);
      }
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([label]) => label);
}

function collectTones(input: ReflectionExportInput): string[] {
  const counts = new Map<string, number>();

  input.emotionalTones?.forEach((tone) => incrementCount(counts, TONE_LABELS[tone]));

  input.selectedSources.forEach((source) => {
    TONE_KEYWORDS.forEach(({ tone, keywords }) => {
      if (keywords.some((keyword) => keyword.test(source.content))) {
        incrementCount(counts, TONE_LABELS[tone]);
      }
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([label]) => label);
}

function buildAnchorExcerpts(input: ReflectionExportInput): string[] {
  const explicit = input.selectedExcerpts
    .slice(0, 2)
    .map((excerpt) => normalizeWhitespace(excerpt.excerpt))
    .filter(Boolean);

  if (explicit.length > 0) {
    return explicit;
  }

  return input.selectedSources
    .slice(0, 2)
    .map((source) => selectReturnExcerpt(source.content))
    .filter(Boolean);
}

function buildPurpose(input: ReflectionExportInput): string {
  const framingMeta = getReflectionExportFramingMeta(input.framing);

  switch (input.purpose) {
    case 'conversation_summary':
      return `${framingMeta.purposeLead} It stays close to what was explicitly selected.`;
    case 'session_reflection_brief':
      return `${framingMeta.purposeLead} It stays with selected material as reflection, not advice.`;
    case 'reflection_export':
    default:
      return `${framingMeta.purposeLead} It stays close to what was explicitly selected.`;
  }
}

function buildWhatHasBeenPresent(input: ReflectionExportInput, themes: string[], tones: string[], anchors: string[]): string {
  const parts: string[] = [];
  const sourceCount = input.selectedSources.length;
  const sourcePhrase = sourceCount === 1 ? 'selected entry' : 'selected material';

  if (themes.length > 0 && tones.length > 0) {
    parts.push(`Across the ${sourcePhrase}, the writing returns to ${joinLabels(themes)} with ${joinLabels(tones)} close by.`);
  } else if (themes.length > 0) {
    parts.push(`Across the ${sourcePhrase}, the writing returns to ${joinLabels(themes)}.`);
  } else if (tones.length > 0) {
    parts.push(`Across the ${sourcePhrase}, the writing stays close to ${joinLabels(tones)}.`);
  } else {
    parts.push('Across the selected material, the writing stays close to what has felt immediate, unsettled, and worth bringing into conversation.');
  }

  if (anchors.length > 0) {
    parts.push(`Moments like "${anchors[0]}" help show the tone of what has been held here.`);
  }

  return parts.join(' ');
}

function buildRecurringThreads(input: ReflectionExportInput, themes: string[], tones: string[]): string[] {
  const threads: string[] = [];
  const dates = input.selectedSources
    .map((source) => source.createdAt.slice(0, 10))
    .sort();

  if (themes.length > 0) {
    themes.slice(0, 2).forEach((theme) => {
      threads.push(`The selected material returns to ${theme} more than once.`);
    });
  }

  if (tones.length > 0) {
    threads.push(`A tone of ${joinLabels(tones.slice(0, 2))} stays present across the selected writing.`);
  }

  if (dates.length > 1) {
    threads.push(`Across entries from ${dates[0]} to ${dates[dates.length - 1]}, the same concerns continue to stay close.`);
  }

  if (threads.length === 0) {
    threads.push('The selected material stays close to one concern long enough to feel worth bringing into conversation.');
  }

  return threads.slice(0, 3);
}

function buildEmotionalLandscape(themes: string[], tones: string[], anchors: string[]): string {
  if (tones.length > 0) {
    const opening = `Across the selected material, the emotional landscape moves through ${joinLabels(tones)}.`;
    if (themes.length > 0) {
      return `${opening} It stays close to ${joinLabels(themes)} without forcing a conclusion about any of it.`;
    }
    return opening;
  }

  if (anchors.length > 0) {
    return `Across the selected material, the emotional landscape feels close to moments like "${anchors[0]}", with room for more than one feeling at a time.`;
  }

  return 'Across the selected material, the emotional landscape stays close to what feels immediate and unresolved, with room for several feelings to sit beside one another.';
}

function buildConversationOpenings(themes: string[], tones: string[], anchors: string[]): string[] {
  const openings: string[] = [];

  if (themes.length > 0) {
    openings.push(`How ${joinLabels(themes.slice(0, 2))} have been showing up across these selected entries`);
  }

  if (tones.length > 0) {
    openings.push(`What feels most important about the ${joinLabels(tones.slice(0, 2))} present in this writing`);
  }

  if (anchors.length > 0) {
    openings.push(`What still feels alive in the line "${anchors[0]}"`);
  }

  if (openings.length === 0) {
    openings.push('What feels most important to carry from this selected material into conversation');
  }

  return openings.slice(0, 3);
}

export function composeReflectionExportDraft(input: ReflectionExportInput): string {
  const themes = collectThemes(input);
  const tones = collectTones(input);
  const anchors = buildAnchorExcerpts(input);
  const framingMeta = getReflectionExportFramingMeta(input.framing);

  const document: ReflectionExportDocument = {
    documentTitle: input.documentTitle?.trim() || framingMeta.title,
    generatedAt: input.generatedAt,
    exportVersion: REFLECTION_EXPORT_VERSION,
    purpose: buildPurpose(input),
    whatHasBeenPresent: buildWhatHasBeenPresent(input, themes, tones, anchors),
    recurringThreads: buildRecurringThreads(input, themes, tones),
    emotionalLandscape: buildEmotionalLandscape(themes, tones, anchors),
    selectedExcerpts: input.selectedExcerpts.map((excerpt) => ({
      sourceId: excerpt.sourceId,
      sourceType: excerpt.sourceType,
      createdAt: excerpt.createdAt,
      excerpt: excerpt.excerpt,
    })),
    conversationOpenings: buildConversationOpenings(themes, tones, anchors),
    userNote: input.userNote?.trim() || undefined,
    boundaryNote: REFLECTION_EXPORT_BOUNDARY_NOTE,
  };

  return JSON.stringify(document, null, 2);
}
