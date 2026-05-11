import type { ResponseStance } from '@/types/khepera';

export interface ResponseStanceDefinition {
  stance: ResponseStance;
  whenToUse: string;
  pacing: string;
  sentenceShape: string;
  abstractionLevel: 'close' | 'measured' | 'wide';
  emotionalDistance: 'close' | 'steady' | 'slightly-wider';
  witnessInstruction: string;
  perspectiveInstruction: string;
  seedInstruction: string;
  languageBehaviors: string[];
  avoid: string[];
}

export const RESPONSE_STANCE_DEFINITIONS: Record<ResponseStance, ResponseStanceDefinition> = {
  witnessing: {
    stance: 'witnessing',
    whenToUse: 'Use when the entry most needs to be seen clearly without being widened or organized too quickly.',
    pacing: 'Close and immediate.',
    sentenceShape: 'One grounded witness sentence and one observational perspective sentence with minimal lift.',
    abstractionLevel: 'close',
    emotionalDistance: 'close',
    witnessInstruction: 'Stay close to the user’s concrete language and explicit emotional texture.',
    perspectiveInstruction: 'Notice what is visible in the wording without stepping ahead of it.',
    seedInstruction: 'Ask one open question that stays near what is already on the page.',
    languageBehaviors: [
      'Prefer concrete nouns and present-tense contact.',
      'Keep the witness plainspoken instead of lyrical.',
      'Let the perspective feel adjacent to the entry, not above it.',
    ],
    avoid: [
      'Do not widen the frame too quickly.',
      'Do not introduce hidden meaning.',
      'Do not smooth over the roughness of the entry.',
    ],
  },
  containing: {
    stance: 'containing',
    whenToUse: 'Use when the entry is emotionally intense, disorganized, or flooded and needs steadier holding.',
    pacing: 'Slow and stabilizing.',
    sentenceShape: 'Shorter clauses, fewer turns, lower interpretive reach.',
    abstractionLevel: 'close',
    emotionalDistance: 'steady',
    witnessInstruction: 'Reflect only what is unmistakably present and keep the language simple.',
    perspectiveInstruction: 'Offer a smaller, steadier observation that reduces cognitive load rather than expanding it.',
    seedInstruction: 'Ask one gentle question anchored in what feels nearest right now.',
    languageBehaviors: [
      'Use shorter sentences than usual.',
      'Favor body, moment, or immediate environment over narrative meaning.',
      'Reduce contrast-stacking and avoid layered tensions.',
    ],
    avoid: [
      'Do not intensify the entry.',
      'Do not create more emotional momentum.',
      'Do not widen into theory, symbolism, or lessons.',
    ],
  },
  clarifying: {
    stance: 'clarifying',
    whenToUse: 'Use when the entry is searching, distanced, or diffuse and needs gentle organization without pressure.',
    pacing: 'Measured and lightly organizing.',
    sentenceShape: 'Let the witness anchor one thread, then let the perspective name one visible shape or contrast.',
    abstractionLevel: 'measured',
    emotionalDistance: 'steady',
    witnessInstruction: 'Anchor one clear thread from the entry rather than repeating everything that is present.',
    perspectiveInstruction: 'Name one visible pattern, contrast, or organizing thread without claiming certainty.',
    seedInstruction: 'Ask one open question that helps the entry become a little more legible, not more solved.',
    languageBehaviors: [
      'Use one quiet naming move rather than multiple insights.',
      'Allow a touch more distance than witnessing, but keep the language observational.',
      'Prefer clarity over poetry.',
    ],
    avoid: [
      'Do not sound explanatory or authoritative.',
      'Do not collapse ambiguity into a single meaning.',
      'Do not imply a next step.',
    ],
  },
  expanding: {
    stance: 'expanding',
    whenToUse: 'Use when the entry is reflective and stable enough to hold a slightly wider frame without losing contact.',
    pacing: 'Open and gently widening.',
    sentenceShape: 'Witness stays grounded, perspective widens one notch to introduce another nearby frame.',
    abstractionLevel: 'wide',
    emotionalDistance: 'slightly-wider',
    witnessInstruction: 'Keep the witness rooted in the entry before widening the frame.',
    perspectiveInstruction: 'Offer one alternative frame, contrast, or angle that is already implicit in the entry.',
    seedInstruction: 'Ask one open question that widens reflection without steering it.',
    languageBehaviors: [
      'Use a little more conceptual range without sounding interpretive.',
      'Let the perspective breathe more than in containing or clarifying.',
      'Keep the widening tied to explicit wording from the entry.',
    ],
    avoid: [
      'Do not over-interpret.',
      'Do not sound revelatory or insightful for its own sake.',
      'Do not drift away from the user’s own language.',
    ],
  },
  integrating: {
    stance: 'integrating',
    whenToUse: 'Use when the entry already shows readiness to connect threads, shifts, or tensions into a fuller shape.',
    pacing: 'Connected and composed.',
    sentenceShape: 'Allow the perspective to connect two explicit threads without closing them down.',
    abstractionLevel: 'measured',
    emotionalDistance: 'steady',
    witnessInstruction: 'Name the most grounded thread or shift that the user has already made visible.',
    perspectiveInstruction: 'Connect explicit strands, contrasts, or movement that already coexist in the entry.',
    seedInstruction: 'Ask one open question that keeps those strands in contact without turning them into a conclusion.',
    languageBehaviors: [
      'Use connective language sparingly and explicitly.',
      'Honor movement without celebrating it.',
      'Let the entry feel more whole, not solved.',
    ],
    avoid: [
      'Do not force synthesis.',
      'Do not present integration as progress.',
      'Do not resolve the entry into a takeaway.',
    ],
  },
  holding_ambiguity: {
    stance: 'holding_ambiguity',
    whenToUse: 'Use when the entry is contradictory, ambivalent, or unclear in a way that should stay open.',
    pacing: 'Spacious and unresolved.',
    sentenceShape: 'Let the witness hold the tension plainly and let the perspective preserve uncertainty rather than organize it away.',
    abstractionLevel: 'measured',
    emotionalDistance: 'steady',
    witnessInstruction: 'Name the visible tension, contradiction, or uncertainty without deciding between its parts.',
    perspectiveInstruction: 'Keep both sides in view and resist resolving them into one meaning.',
    seedInstruction: 'Ask one open question that leaves the ambiguity intact.',
    languageBehaviors: [
      'Allow uncertainty words when they are grounded in the entry.',
      'Use contrast carefully and explicitly.',
      'Let the response remain open rather than convergent.',
    ],
    avoid: [
      'Do not tidy the contradiction.',
      'Do not pick a side for the user.',
      'Do not imply the ambiguity should resolve soon.',
    ],
  },
};

