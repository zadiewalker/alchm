import type { Exercise } from '@/types/journal';

export const EXERCISES: Record<string, Exercise> = {

  the_reframe: {
    type: 'the_reframe',
    title: 'The Reframe',
    subtitle: 'A different angle on what you\'re holding.',
    duration: '5 min',
    clinicalModality: 'CBT cognitive restructuring',
    steps: [
      {
        id: 'identify',
        type: 'reflection',
        prompt: 'From what you just wrote — what\'s the thought that keeps coming back? The one that feels most like a fact.',
        placeholder: 'The thought is...',
      },
      {
        id: 'examine',
        type: 'writing',
        prompt: 'If someone you loved was thinking this about themselves, what would you notice about it? What would you want them to know?',
        placeholder: 'I\'d want them to know...',
      },
      {
        id: 'alternative',
        type: 'writing',
        prompt: 'What\'s another way to see this — one that\'s equally honest, but comes from a different place?',
        placeholder: 'Another way to see it...',
      },
      {
        id: 'landing',
        type: 'completion',
        prompt: 'Which version of this thought do you want to carry into the rest of your day?',
        placeholder: 'I\'m choosing to hold...',
      },
    ],
  },

  the_witness: {
    type: 'the_witness',
    title: 'The Witness',
    subtitle: 'Step back. Notice. Without fixing anything.',
    duration: '3 min',
    clinicalModality: 'ACT psychological defusion',
    steps: [
      {
        id: 'breathing',
        type: 'breathing',
        prompt: 'Before we begin — three slow breaths. Breathe in for four counts. Out for six.',
        breathCount: 3,
      },
      {
        id: 'notice',
        type: 'reflection',
        prompt: 'From what you wrote: "I notice I am having the thought that..."',
        placeholder: '...I am having the thought that',
      },
      {
        id: 'observe',
        type: 'writing',
        prompt: 'Now, from a slight distance — if you were watching yourself having this thought, what would you see? Describe the person, not the thought.',
        placeholder: 'I see someone who...',
      },
      {
        id: 'return',
        type: 'completion',
        prompt: 'The thought is there. You are also here, noticing it. That distinction — between you and what you think — is available to you any time.',
        placeholder: 'Something I want to remember from this...',
      },
    ],
  },

  the_letter: {
    type: 'the_letter',
    title: 'The Letter',
    subtitle: 'Write to yourself the way you would to someone you love.',
    duration: '8 min',
    clinicalModality: 'DBT self-compassion / narrative therapy',
    steps: [
      {
        id: 'acknowledge',
        type: 'reflection',
        prompt: 'What you wrote holds something real. Before anything else — what do you most need to hear right now?',
        placeholder: 'I need to hear that...',
      },
      {
        id: 'write',
        type: 'writing',
        prompt: 'Write a letter to yourself. Begin with: "I know this has been hard. I see you." Then keep going — as long or as short as feels right.',
        placeholder: 'I know this has been hard. I see you.\n\n',
      },
      {
        id: 'closing',
        type: 'completion',
        prompt: 'Is there anything you want to add — something you almost didn\'t say?',
        placeholder: 'One more thing...',
      },
    ],
  },

  the_body: {
    type: 'the_body',
    title: 'The Body',
    subtitle: 'Follow what your body is already telling you.',
    duration: '4 min',
    clinicalModality: 'Somatic awareness / interoception',
    steps: [
      {
        id: 'settle',
        type: 'breathing',
        prompt: 'Find your feet on the floor. Feel their weight. Take two breaths. Nothing to change yet.',
        breathCount: 2,
      },
      {
        id: 'locate',
        type: 'body_scan',
        prompt: 'Scan from your feet upward. Where are you holding something right now? A tightness, a weight, an absence?',
        placeholder: 'In my body, I notice...',
      },
      {
        id: 'listen',
        type: 'writing',
        prompt: 'If that sensation in your body could speak — just one sentence — what would it say?',
        placeholder: 'It would say...',
      },
      {
        id: 'respond',
        type: 'writing',
        prompt: 'What does that part of you need from you right now? Not a solution — a gesture. What would meeting it feel like?',
        placeholder: 'It needs...',
      },
      {
        id: 'close',
        type: 'completion',
        prompt: 'Take one more breath. Notice if anything has shifted — even slightly.',
        placeholder: 'After this, I notice...',
      },
    ],
  },

  the_opposite: {
    type: 'the_opposite',
    title: 'The Opposite',
    subtitle: 'What does the other direction look like from here?',
    duration: '4 min',
    clinicalModality: 'DBT opposite action / behavioral activation',
    steps: [
      {
        id: 'name',
        type: 'reflection',
        prompt: 'From what you wrote — what are you most pulled toward doing right now? (Withdrawing, avoiding, staying small, numbing, etc.)',
        placeholder: 'Right now, I\'m pulled toward...',
      },
      {
        id: 'imagine',
        type: 'writing',
        prompt: 'The opposite of that impulse — what would it look like? Not a big change. The smallest version of the opposite.',
        placeholder: 'The smallest opposite would be...',
      },
      {
        id: 'check',
        type: 'reflection',
        prompt: 'What stops you from doing that smallest thing? Name it honestly.',
        placeholder: 'What stops me is...',
      },
      {
        id: 'choice',
        type: 'completion',
        prompt: 'Knowing all of this — what, if anything, do you want to do differently in the next hour?',
        placeholder: 'In the next hour, I want to...',
      },
    ],
  },

  the_younger_self: {
    type: 'the_younger_self',
    title: 'The Younger Self',
    subtitle: 'The version of you who first learned to feel this way.',
    duration: '6 min',
    clinicalModality: 'Psychodynamic / inner child / schema therapy',
    steps: [
      {
        id: 'locate',
        type: 'reflection',
        prompt: 'What you\'re feeling now — when did you first feel something like this? You don\'t need the exact memory. Just an age, a sense, an echo.',
        placeholder: 'This feeling takes me back to...',
      },
      {
        id: 'see',
        type: 'writing',
        prompt: 'Picture that younger version of you. What are they carrying? What do they most need someone to say?',
        placeholder: 'They needed someone to say...',
      },
      {
        id: 'speak',
        type: 'writing',
        prompt: 'Say it. Write directly to them — as the person you are now, with what you know now.',
        placeholder: 'I want to tell you...',
      },
      {
        id: 'receive',
        type: 'completion',
        prompt: 'What do you think they would say back?',
        placeholder: 'They would say...',
      },
    ],
  },

  the_values: {
    type: 'the_values',
    title: 'The Values',
    subtitle: 'What matters most to you — and what\'s getting in the way.',
    duration: '5 min',
    clinicalModality: 'ACT values clarification',
    steps: [
      {
        id: 'underneath',
        type: 'reflection',
        prompt: 'From what you wrote — what\'s being stepped on right now? What do you care about that feels threatened or unseen?',
        placeholder: 'What I care about that\'s being stepped on is...',
      },
      {
        id: 'name_value',
        type: 'writing',
        prompt: 'Give it a name: a value. Something that would be true even if no one ever knew about it.',
        placeholder: 'What I value is...',
      },
      {
        id: 'small_step',
        type: 'writing',
        prompt: 'Even in today — even in this difficult moment — what\'s one small thing you could do that would move toward that value?',
        placeholder: 'One small move toward it is...',
      },
      {
        id: 'anchor',
        type: 'completion',
        prompt: 'That value is yours. No circumstance can take it. What does it feel like to hold it right now?',
        placeholder: 'Holding it feels like...',
      },
    ],
  },

  the_unsent: {
    type: 'the_unsent',
    title: 'The Unsent',
    subtitle: 'Say what you haven\'t been able to say. It goes nowhere.',
    duration: '6 min',
    clinicalModality: 'Narrative therapy / expressive writing',
    steps: [
      {
        id: 'who',
        type: 'reflection',
        prompt: 'Who — or what — do you most need to say something to right now? A person, a situation, a version of yourself.',
        placeholder: 'I need to say something to...',
      },
      {
        id: 'write',
        type: 'writing',
        prompt: 'Write what you haven\'t been able to say. Begin with their name. Say everything. This message will never be sent.',
        placeholder: 'Dear [name],\n\n',
      },
      {
        id: 'needs',
        type: 'writing',
        prompt: 'Underneath what you just wrote — what do you actually need? From them, from this situation, from yourself?',
        placeholder: 'What I actually need is...',
      },
      {
        id: 'release',
        type: 'completion',
        prompt: 'You\'ve said it. It exists now. Is there anything you want to do differently in how you carry this?',
        placeholder: 'Going forward, I want to...',
      },
    ],
  },
};
