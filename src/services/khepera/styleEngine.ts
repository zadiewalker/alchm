import type {
  EntryAnchor,
  KheperaResponse,
  KheperaStyleDensity,
  KheperaStyleDistance,
  KheperaStylePace,
  KheperaStyleProfile,
  KheperaLanguageTexture,
  ResponseStance,
} from '@/types/khepera';

export interface KheperaStyleDefinition {
  profile: KheperaStyleProfile;
  label: string;
  distance: KheperaStyleDistance;
  pace: KheperaStylePace;
  density: KheperaStyleDensity;
  languageTexture: KheperaLanguageTexture;
  posture: string;
  sentenceBehavior: string;
  seedBehavior: string;
}

export const KHEPERA_STYLE_DEFINITIONS: Record<KheperaStyleProfile, KheperaStyleDefinition> = {
  grounded_witness: {
    profile: 'grounded_witness',
    label: 'Grounded Witness',
    distance: 'close',
    pace: 'slow',
    density: 'sparse',
    languageTexture: 'concrete',
    posture: 'Stay close to the user’s explicit wording and emotional texture.',
    sentenceBehavior: 'Use short, grounded lines with minimal interpretive lift.',
    seedBehavior: 'Ask an open question that stays near what is already present.',
  },
  gentle_organizer: {
    profile: 'gentle_organizer',
    label: 'Gentle Organizer',
    distance: 'mid',
    pace: 'steady',
    density: 'moderate',
    languageTexture: 'metaphor-light',
    posture: 'Lightly organize one visible thread without sounding instructive.',
    sentenceBehavior: 'Let witness anchor one thread, then let perspective name one shape or contrast without tidying it too quickly.',
    seedBehavior: 'Ask a question that helps the entry become more legible, not more solved.',
  },
  perspective_opener: {
    profile: 'perspective_opener',
    label: 'Perspective Opener',
    distance: 'wide',
    pace: 'fluid',
    density: 'moderate',
    languageTexture: 'metaphor-light',
    posture: 'Widen the frame one notch while staying anchored in the entry.',
    sentenceBehavior: 'Allow longer, connected sentences with one gentle widening move.',
    seedBehavior: 'Ask a question that opens another angle without steering toward action.',
  },
  soft_container: {
    profile: 'soft_container',
    label: 'Soft Container',
    distance: 'close',
    pace: 'slow',
    density: 'sparse',
    languageTexture: 'concrete',
    posture: 'Keep contact close, steady, and stabilizing.',
    sentenceBehavior: 'Use very short clauses, wider spacing, and minimal layering.',
    seedBehavior: 'Ask one gentle question that stays nearest to the present feeling or moment.',
  },
  open_field: {
    profile: 'open_field',
    label: 'Open Field',
    distance: 'wide',
    pace: 'slow',
    density: 'moderate',
    languageTexture: 'abstract-light',
    posture: 'Leave room for ambiguity and avoid closure.',
    sentenceBehavior: 'Use light structure and preserve uncertainty instead of tidying it.',
    seedBehavior: 'Ask one open question that keeps the ambiguity intact.',
  },
};

export function getStyleDefinition(profile: KheperaStyleProfile): KheperaStyleDefinition {
  return KHEPERA_STYLE_DEFINITIONS[profile];
}

function pickAnchor(
  anchors: EntryAnchor[],
  preferredKinds: EntryAnchor['kind'][] = [],
): EntryAnchor | null {
  for (const kind of preferredKinds) {
    const match = anchors.find((anchor) => anchor.kind === kind);
    if (match) {
      return match;
    }
  }
  return anchors[0] ?? null;
}

function buildAnchoredFallback(
  anchor: EntryAnchor,
  stance: ResponseStance,
): KheperaResponse {
  const phrase = anchor.phrase;

  switch (stance) {
    case 'witnessing':
      return {
        witness: `${phrase} is the clearest part of what arrived.`,
        perspective: 'The response can stay close to that fact without making a larger claim.',
        seed: `What feels most alive in ${phrase}?`,
      };
    case 'containing':
      return {
        witness: `${phrase} is here.`,
        perspective: 'The entry does not need more interpretation than that right now.',
        seed: `What feels nearest around ${phrase}?`,
      };
    case 'clarifying':
      return {
        witness: `The loop around ${phrase} gives this entry its shape.`,
        perspective: 'It can be named without a demand to solve it.',
        seed: `What feels most clear around ${phrase}?`,
      };
    case 'expanding':
      return {
        witness: `The entry centers on ${phrase}.`,
        perspective: 'That detail leaves room for more than one edge without drifting away from the entry.',
        seed: `What else feels present around ${phrase}?`,
      };
    case 'integrating':
      return {
        witness: `${phrase} sits close to the center of this entry.`,
        perspective: 'The surrounding words stay in contact with that anchor without turning it into a lesson.',
        seed: `What feels most connected around ${phrase}?`,
      };
    case 'holding_ambiguity':
      return {
        witness: `The uncertainty around ${phrase} remains open here.`,
        perspective: `This does not settle into one meaning around ${phrase}.`,
        seed: `What remains unsettled around ${phrase}?`,
      };
    default:
      break;
  }

  if (anchor.kind === 'contrast') {
    return {
      witness: `There is a clear turn around ${phrase}.`,
      perspective: 'The entry holds a moment where effort and relief meet without needing to make more of it than that.',
      seed: `What feels most alive in ${phrase}?`,
    };
  }

  if (anchor.kind === 'repetition') {
    return {
      witness: `The repetition around ${phrase} gives this a looping shape.`,
      perspective: 'The entry stays close to what keeps returning rather than moving away from it.',
      seed: 'What feels most in view inside that loop?',
    };
  }

  if (anchor.kind === 'self_language') {
    return {
      witness: `${phrase} sits near the center of this entry.`,
      perspective: 'The words stay close to how this is landing without trying to settle it too quickly.',
      seed: 'What feels closest to the center of that?'
    };
  }

  if (anchor.kind === 'body_signal') {
    return {
      witness: `${phrase} gives the entry a bodily edge.`,
      perspective: 'The body seems to be carrying part of what the words are holding here.',
      seed: 'What feels most present in that physical edge?',
    };
  }

  return {
    witness: `There is something clear around ${phrase}.`,
    perspective: stance === 'holding_ambiguity'
      ? 'The entry lets that detail stay open without forcing it into one meaning.'
      : 'That detail gives the entry a specific center of gravity.',
    seed: `What stays most alive around ${phrase}?`,
  };
}

export function buildStanceFallback(
  stance: ResponseStance,
  entryAnchors: EntryAnchor[] = [],
): KheperaResponse {
  const anchor = pickAnchor(entryAnchors, ['contrast', 'repetition', 'self_language', 'body_signal', 'emotion_word']);
  if (anchor) {
    return buildAnchoredFallback(anchor, stance);
  }

  switch (stance) {
    case 'containing':
      return {
        witness: 'This reads as tender and close to the surface.',
        perspective: 'There may not be a need to make it sharper than it is right now.',
        seed: 'What part of this feels nearest?',
      };
    case 'clarifying':
      return {
        witness: 'There is more than one thread here, and neither of them feels incidental.',
        perspective: 'The entry seems to keep one tension visible without forcing it into a single meaning.',
        seed: 'What feels most in view as you read this back?',
      };
    case 'expanding':
      return {
        witness: 'Something in this arrives with weight, but not with only one edge.',
        perspective: 'It seems to hold a wider frame than the first surface of it suggests.',
        seed: 'What else becomes visible when this is left open a little longer?',
      };
    case 'integrating':
      return {
        witness: 'More than one truth seems to be standing here at once.',
        perspective: 'The entry reads like it is holding those strands together without forcing them to settle.',
        seed: 'What feels most connected in this as it stands now?',
      };
    case 'holding_ambiguity':
      return {
        witness: 'There is space in this, but not empty space.',
        perspective: 'The entry seems willing to leave something unresolved without losing contact with it.',
        seed: 'What feels most alive inside that uncertainty?',
      };
    case 'witnessing':
    default:
      return {
        witness: 'Something in this arrives with weight, but not with a single simple name.',
        perspective: 'The entry seems to hold more than one truth at once.',
        seed: 'What feels most present in this as you read it back?',
      };
  }
}
