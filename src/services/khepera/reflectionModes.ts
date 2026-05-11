import type { ReflectionMode } from '@/types/khepera';

export interface ReflectionModeDefinition {
  mode: ReflectionMode;
  whenToUse: string;
  witnessInstruction: string;
  perspectiveInstruction: string;
  seedInstruction: string;
  avoid: string[];
}

export const REFLECTION_MODE_DEFINITIONS: Record<ReflectionMode, ReflectionModeDefinition> = {
  pure_witness: {
    mode: 'pure_witness',
    whenToUse: 'Use when the entry is emotionally saturated, fragmented, or overwhelmed.',
    witnessInstruction: 'Stay very close to explicit language. Keep witnessing concrete and simple.',
    perspectiveInstruction: 'Keep perspective stabilizing and minimal. Avoid widening too far.',
    seedInstruction: 'Ask one gentle opening question anchored in the present moment.',
    avoid: [
      'Do not interpret hidden meaning.',
      'Do not push for insight.',
      'Do not increase cognitive load.',
    ],
  },
  gentle_naming: {
    mode: 'gentle_naming',
    whenToUse: 'Use when the entry needs soft naming without expansion.',
    witnessInstruction: 'Name what is explicit in plain language without rephrasing theatrically.',
    perspectiveInstruction: 'Offer one calm naming move that improves clarity without direction.',
    seedInstruction: 'Ask one open question that keeps language close to what is already here.',
    avoid: [
      'Do not escalate interpretation.',
      'Do not introduce new frameworks.',
      'Do not imply a task.',
    ],
  },
  spacious_clarification: {
    mode: 'spacious_clarification',
    whenToUse: 'Use when the entry is coherent enough for gentle widening without pressure.',
    witnessInstruction: 'Reflect the core thread with concise specificity.',
    perspectiveInstruction: 'Widen slightly by naming shape, contrast, or context already present.',
    seedInstruction: 'Ask one open question that supports further clarification.',
    avoid: [
      'Do not coach.',
      'Do not prescribe action.',
      'Do not turn the response into analysis.',
    ],
  },
  ambivalence_holding: {
    mode: 'ambivalence_holding',
    whenToUse: 'Use when conflicting impulses, mixed feelings, or contradiction are explicit.',
    witnessInstruction: 'Name both sides of the tension without resolving.',
    perspectiveInstruction: 'Hold coexistence of both sides without choosing a direction.',
    seedInstruction: 'Ask one open question that makes room for both sides.',
    avoid: [
      'Do not choose for the user.',
      'Do not collapse complexity into one meaning.',
      'Do not imply the tension must be resolved now.',
    ],
  },
  self_protection_reframe: {
    mode: 'self_protection_reframe',
    whenToUse: 'Use when self-attack, harsh self-judgment, or inner criticism is dominant.',
    witnessInstruction: 'Acknowledge the burden and the strain without endorsing the attack.',
    perspectiveInstruction: 'Gently frame the harshness as a protective effort, not a failure.',
    seedInstruction: 'Ask one open question about what the protective voice may be guarding.',
    avoid: [
      'Do not diagnose.',
      'Do not correct the user.',
      'Do not sound therapeutic or instructional.',
    ],
  },
  tenderness_invitation: {
    mode: 'tenderness_invitation',
    whenToUse: 'Use when vulnerability, grief tenderness, or relational softness is present.',
    witnessInstruction: 'Stay warm and direct without sentimental language.',
    perspectiveInstruction: 'Honor tenderness as a valid form of strength and contact.',
    seedInstruction: 'Ask one open question that keeps the tone gentle and non-demanding.',
    avoid: [
      'Do not romanticize pain.',
      'Do not over-poeticize.',
      'Do not imply emotional performance.',
    ],
  },
  meaning_emergence: {
    mode: 'meaning_emergence',
    whenToUse: 'Use when coherent meaning is already forming in the entry.',
    witnessInstruction: 'Acknowledge the shape already forming in the user’s own words.',
    perspectiveInstruction: 'Deepen what is emerging without claiming authority.',
    seedInstruction: 'Ask one open question that continues the existing thread.',
    avoid: [
      'Do not overstate certainty.',
      'Do not frame insight as final truth.',
      'Do not prescribe next steps.',
    ],
  },
  movement_marking: {
    mode: 'movement_marking',
    whenToUse: 'Use when meaningful shift or movement is visible in the entry.',
    witnessInstruction: 'Mark the shift plainly and concretely.',
    perspectiveInstruction: 'Name what changed in tone, posture, or language without direction.',
    seedInstruction: 'Ask one open question that notices movement without pushing momentum.',
    avoid: [
      'Do not celebrate progress.',
      'Do not frame momentum as required.',
      'Do not imply optimization.',
    ],
  },
};

export const TEMPLATE_PHRASE_BANLIST: readonly RegExp[] = [
  /there is something in what you(?:'ve| have) written/i,
  /your willingness to let it exist/i,
  /what wants to be said/i,
  /what feels most true/i,
];
