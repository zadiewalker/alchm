import type { EmotionalCheckIn, ExerciseType, ExerciseRouting } from '@/types/journal';

// The routing engine selects which exercise to offer first
// based on the user's emotional check-in and entry tone.
// Clinical rationale: match the modality to the emotional state.

export const EXERCISE_ROUTING: Record<EmotionalCheckIn, ExerciseRouting> = {
  heavy: {
    checkIn: 'heavy',
    // Heavy = psychodynamic or somatic first — not CBT (too cognitive for this state)
    primaryExercise: 'the_body',
    alternateExercises: ['the_younger_self', 'the_letter', 'the_witness'],
  },
  anxious: {
    checkIn: 'anxious',
    // Anxious = body first (ground), then cognitive
    primaryExercise: 'the_body',
    alternateExercises: ['the_witness', 'the_reframe', 'the_values'],
  },
  numb: {
    checkIn: 'numb',
    // Numb = gentle activation before insight work
    primaryExercise: 'the_opposite',
    alternateExercises: ['the_body', 'the_younger_self', 'the_letter'],
  },
  tender: {
    checkIn: 'tender',
    // Tender = compassion-based, stay with the feeling
    primaryExercise: 'the_letter',
    alternateExercises: ['the_younger_self', 'the_witness', 'the_unsent'],
  },
  angry: {
    checkIn: 'angry',
    // Anger = needs movement/expression before reframe
    primaryExercise: 'the_unsent',
    alternateExercises: ['the_body', 'the_values', 'the_reframe'],
  },
  searching: {
    checkIn: 'searching',
    // Searching = values clarification or narrative
    primaryExercise: 'the_values',
    alternateExercises: ['the_witness', 'the_reframe', 'the_opposite'],
  },
  okay: {
    checkIn: 'okay',
    // Okay = lighter exercises, or deeper insight when they're resourced
    primaryExercise: 'the_witness',
    alternateExercises: ['the_reframe', 'the_values', 'the_opposite'],
  },
};

export function getRoutedExercise(
  checkIn: EmotionalCheckIn,
  entryThemes: string[] = []
): ExerciseType {
  const routing = EXERCISE_ROUTING[checkIn];

  // If grief-related themes present, override toward compassion
  const griefThemes = ['grief_loss', 'relationship_tension', 'childhood_origin'];
  if (entryThemes.some(t => griefThemes.includes(t))) {
    return 'the_letter';
  }

  // If self-worth themes present, offer younger self or witness
  const selfThemes = ['self_worth', 'identity'];
  if (entryThemes.some(t => selfThemes.includes(t))) {
    return checkIn === 'angry' ? 'the_younger_self' : routing.primaryExercise;
  }

  return routing.primaryExercise;
}