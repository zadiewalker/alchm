import type {
  EntryAnchor,
  KheperaQualityFlag,
  KheperaQualityResult,
  KheperaResponse,
} from '@/types/khepera';

const DIRECTIVE_PATTERNS = [
  /\byou should\b/i,
  /\byou need to\b/i,
  /\byou must\b/i,
  /\btry to\b/i,
  /\bcould you try\b/i,
  /\bcould you\b/i,
  /\byou could\b/i,
  /\byou might\b/i,
  /\bconsider doing\b/i,
  /\bconsider\b/i,
  /\bit might help\b/i,
];

const DIAGNOSTIC_PATTERNS = [
  /\bthis (sounds|looks) like\b/i,
  /\byou (have|may have|are experiencing)\b/i,
  /\byour (anxiety|depression|ptsd|ocd|adhd|trauma|condition|disorder)\b/i,
];

const COACHING_PATTERNS = [
  /\bthe next step\b/i,
  /\bfocus on\b/i,
  /\bwork on\b/i,
  /\byour goal\b/i,
  /\bconsider doing\b/i,
  /\bstart by\b/i,
  /\byou could explore\b/i,
  /\bhelp you move forward\b/i,
];

const FAUX_THERAPY_PATTERNS = [
  /\bhonor your feelings\b/i,
  /\bhold space\b/i,
  /\bgive yourself grace\b/i,
  /\byour nervous system\b/i,
  /\binner child\b/i,
  /\bhealing journey\b/i,
  /\bsafe space\b/i,
  /\bvalid\b/i,
];

const PRODUCTIVITY_FRAMING_PATTERNS = [
  /\bprogress\b/i,
  /\bgrowth\b/i,
  /\bimprovement\b/i,
  /\bgoals?\b/i,
  /\bhabits?\b/i,
  /\bstreaks?\b/i,
  /\bconsistency\b/i,
  /\bbetter version of yourself\b/i,
];

const TEMPORAL_SURVEILLANCE_PATTERNS = [
  /\bearlier you said\b/i,
  /\blast time\b/i,
  /\bprevious entry\b/i,
  /\bas before\b/i,
  /\bpreviously you said\b/i,
];

const GENERIC_RESPONSE_PATTERNS = [
  /\bthat sounds really hard\b/i,
  /\byou(?:'re| are) carrying a lot\b/i,
  /\bit makes sense you feel this way\b/i,
  /\byou put something real on the page\b/i,
  /\byour words make the moment more visible\b/i,
  /\bthere is a lot here\b/i,
  /\bsomething feels heavy\b/i,
  /\bthis sounds difficult\b/i,
];

const TEMPLATE_OPENING_PATTERNS = [
  /^i notice\b/i,
  /^there is\b/i,
  /^it sounds like\b/i,
  /^this feels\b/i,
  /^what would it mean\b/i,
];

const OVERUSED_OPENING_PATTERNS = [
  /^something in\b/i,
  /^there is\b/i,
  /^this feels\b/i,
  /^this carries\b/i,
  /^it seems\b/i,
  /^what else\b/i,
  /^what would\b/i,
  /^where might\b/i,
];

const OVERUSED_KHEPERA_PHRASE_PATTERNS = [
  /\bsomething in (?:this|it)\b/i,
  /\bthere is a shape\b/i,
  /\bthis carries\b/i,
  /\bthis holds\b/i,
  /\bwhat else becomes visible\b/i,
  /\bthere is something here\b/i,
  /\bwhat feels most present\b/i,
  /\bleft open\b/i,
];

const VAGUE_TEMPLATE_NOUN_PATTERNS = [
  /\bsomething\b/gi,
  /\bshape\b/gi,
  /\bweight\b/gi,
  /\bspace\b/gi,
  /\bvisible\b/gi,
  /\bholds?\b/gi,
  /\bcarries\b/gi,
];

const ACTION_ORIENTED_SEED_PATTERNS = [
  /\bwill you\b/i,
  /\bcan you\b/i,
  /\bcould you\b/i,
  /\bhow can you\b/i,
  /\bwhat will you do\b/i,
  /\bhow soon\b/i,
  /\bwhat step\b/i,
];

const MULTI_QUESTION_SEED_PATTERNS = [
  /\bwhat\b[\s\S]{0,80}\band what\b/i,
  /\bhow\b[\s\S]{0,80}\band how\b/i,
  /\bwhy\b[\s\S]{0,80}\band why\b/i,
  /\bwhen\b[\s\S]{0,80}\band when\b/i,
  /\bwhere\b[\s\S]{0,80}\band where\b/i,
  /\bwhat\b[\s\S]{0,80}\bwhat\b/i,
];

function collectFlags(
  condition: boolean,
  flag: KheperaQualityFlag,
  flags: KheperaQualityFlag[],
): void {
  if (condition && !flags.includes(flag)) {
    flags.push(flag);
  }
}

function openingStem(text: string): string {
  return text.trim().toLowerCase().replace(/^[^a-z0-9']+/, '').split(/\s+/).slice(0, 2).join(' ');
}

function openingStemThree(text: string): string {
  return text.trim().toLowerCase().replace(/^[^a-z0-9']+/, '').split(/\s+/).slice(0, 3).join(' ');
}

function countPatternMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function normalizeGroundingWord(word: string): string {
  const normalized = word
    .toLowerCase()
    .replace(/^(myself|yourself|himself|herself|themself|ourselves)$/, 'self')
    .replace(/(ing|ed|ly|s)$/, '');

  if (normalized === 'happines') return 'happy';
  if (normalized === 'function') return 'working';
  return normalized;
}

function getMeaningfulAnchorTerms(phrase: string): string[] {
  const stopWords = new Set(['keep', 'with', 'that', 'this', 'from', 'into', 'over', 'under', 'very', 'really']);
  return phrase
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .map(normalizeGroundingWord)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function getKindSupportTerms(anchor: EntryAnchor): string[] {
  switch (anchor.kind) {
    case 'repetition':
      return ['replay', 'loop', 'circl', 'again'];
    case 'contrast':
      return ['contrast', 'shift', 'turn', 'finally', 'still', 'both'];
    case 'tension':
      return ['between', 'push', 'pull', 'tension', 'both'];
    case 'self_language':
      return ['self', 'distance', 'needy', 'failure', 'far'];
    case 'relationship_signal':
      return ['conversation', 'call', 'text', 'message', 'reply'];
    case 'body_signal':
      return ['body', 'chest', 'stomach', 'shoulder', 'hand', 'tight', 'soft'];
    case 'time_signal':
      return ['today', 'tonight', 'still', 'finally', 'moment'];
    case 'emotion_word':
      return getMeaningfulAnchorTerms(anchor.phrase);
    case 'image':
      return getMeaningfulAnchorTerms(anchor.phrase);
    default:
      return [];
  }
}

export function detectInsufficientEntryGrounding(
  output: KheperaResponse,
  entryAnchors: EntryAnchor[] = [],
): boolean {
  if (entryAnchors.length === 0) {
    return false;
  }

  const groundedText = `${output.witness} ${output.perspective}`.toLowerCase();
  const groundedTerms = new Set(getMeaningfulAnchorTerms(groundedText));
  let directPhraseMatch = false;
  let overlapCount = 0;

  for (const anchor of entryAnchors) {
    const phrase = anchor.phrase.toLowerCase();
    if (phrase.length >= 5 && groundedText.includes(phrase)) {
      directPhraseMatch = true;
      break;
    }

    const anchorTerms = [
      ...getMeaningfulAnchorTerms(anchor.phrase),
      ...getKindSupportTerms(anchor),
    ];
    const hasOverlap = anchorTerms.some((term) => groundedTerms.has(term));
    if (hasOverlap) {
      overlapCount += 1;
    }
  }

  return !(directPhraseMatch || overlapCount >= 2);
}

export function detectDirectiveLanguage(text: string): boolean {
  return DIRECTIVE_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectDiagnosticLanguage(text: string): boolean {
  return DIAGNOSTIC_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectGenericResponse(text: string): boolean {
  return GENERIC_RESPONSE_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectTemplateRepetition(text: string): boolean {
  const sentences = text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const genericOpenings = sentences.filter((sentence) => TEMPLATE_OPENING_PATTERNS.some((pattern) => pattern.test(sentence))).length;
  return genericOpenings >= 2;
}

export function detectRepeatedOpeningPattern(output: KheperaResponse): boolean {
  const sections = [output.witness, output.perspective, output.seed].filter((section) => section.trim().length > 0);
  const twoWordStems = sections.map(openingStem).filter(Boolean);
  const threeWordStems = sections.map(openingStemThree).filter(Boolean);
  const repeatedTwoWordStem = new Set(twoWordStems).size !== twoWordStems.length;
  const repeatedThreeWordStem = new Set(threeWordStems).size !== threeWordStems.length;
  const overusedOpenings = sections.filter((section) => OVERUSED_OPENING_PATTERNS.some((pattern) => pattern.test(section))).length;

  return repeatedTwoWordStem || repeatedThreeWordStem || overusedOpenings >= 2;
}

export function detectOverusedKheperaPhrase(text: string): boolean {
  const phraseMatches = OVERUSED_KHEPERA_PHRASE_PATTERNS.reduce(
    (count, pattern) => count + (pattern.test(text) ? 1 : 0),
    0,
  );
  return phraseMatches >= 2;
}

export function detectInsufficientLanguageDifferentiation(output: KheperaResponse): boolean {
  const combined = `${output.witness} ${output.perspective} ${output.seed}`;
  const vagueCount = VAGUE_TEMPLATE_NOUN_PATTERNS.reduce(
    (count, pattern) => count + countPatternMatches(combined, pattern),
    0,
  );
  const sections = [output.witness, output.perspective, output.seed];
  const shortGenericSections = sections.filter((section) => {
    const words = section.trim().split(/\s+/).filter(Boolean);
    return words.length <= 9 && OVERUSED_OPENING_PATTERNS.some((pattern) => pattern.test(section));
  }).length;

  return vagueCount >= 5 || (vagueCount >= 3 && shortGenericSections >= 2);
}

export function detectFauxTherapyVoice(text: string): boolean {
  return FAUX_THERAPY_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectTemporalSurveillanceLanguage(text: string): boolean {
  return TEMPORAL_SURVEILLANCE_PATTERNS.some((pattern) => pattern.test(text));
}

function detectProductivityFraming(text: string): boolean {
  return PRODUCTIVITY_FRAMING_PATTERNS.some((pattern) => pattern.test(text));
}

export function validateSeed(seed: string): KheperaQualityFlag[] {
  const flags: KheperaQualityFlag[] = [];
  const questionCount = (seed.match(/\?/g) ?? []).length;
  const hasCompoundQuestion = MULTI_QUESTION_SEED_PATTERNS.some((pattern) => pattern.test(seed));

  collectFlags(questionCount === 0 || !seed.trim().endsWith('?'), 'seed_not_question', flags);
  collectFlags(questionCount > 1 || hasCompoundQuestion, 'seed_multiple_questions', flags);
  collectFlags(ACTION_ORIENTED_SEED_PATTERNS.some((pattern) => pattern.test(seed)), 'seed_action_oriented', flags);

  return flags;
}

export function validateKheperaOutput(
  output: KheperaResponse,
  options: { entryAnchors?: EntryAnchor[] } = {},
): KheperaQualityResult {
  const flags: KheperaQualityFlag[] = [];
  const combined = `${output.witness}\n${output.perspective}\n${output.seed}`;
  const reflective = `${output.perspective}\n${output.seed}`;
  const openings = [output.witness, output.perspective, output.seed].map(openingStem).filter(Boolean);

  collectFlags(detectDirectiveLanguage(reflective), 'directive_language', flags);
  collectFlags(detectDiagnosticLanguage(combined), 'diagnostic_language', flags);
  collectFlags(COACHING_PATTERNS.some((pattern) => pattern.test(reflective)), 'coaching_language', flags);
  collectFlags(detectGenericResponse(combined), 'generic_response', flags);
  collectFlags(detectTemplateRepetition(combined) || new Set(openings).size !== openings.length, 'template_repetition', flags);
  collectFlags(detectRepeatedOpeningPattern(output), 'repeated_opening_pattern', flags);
  collectFlags(detectOverusedKheperaPhrase(combined), 'overused_khepera_phrase', flags);
  collectFlags(detectInsufficientLanguageDifferentiation(output), 'insufficient_language_differentiation', flags);
  collectFlags(detectFauxTherapyVoice(combined), 'faux_therapy_voice', flags);
  collectFlags(detectProductivityFraming(combined), 'productivity_framing', flags);
  collectFlags(detectTemporalSurveillanceLanguage(combined), 'temporal_surveillance_language', flags);
  collectFlags(
    detectInsufficientEntryGrounding(output, options.entryAnchors),
    'insufficient_entry_grounding',
    flags,
  );

  for (const seedFlag of validateSeed(output.seed)) {
    collectFlags(true, seedFlag, flags);
  }

  return {
    ok: flags.length === 0,
    flags,
  };
}
