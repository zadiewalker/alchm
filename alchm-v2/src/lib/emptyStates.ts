'use client';

export const EMPTY_STATES: Record<string, { heading: string; body: string; cta?: string }> = {
  dashboard: {
    heading: 'Your sanctuary is open.',
    body: "Your journal is quiet. That's okay. When you're ready, write.",
    cta: 'Write',
  },
  journal: {
    heading: 'Nothing here yet.',
    body: 'Your first words are waiting. One sentence is enough.',
    cta: 'Start writing',
  },
  insights: {
    heading: 'Patterns take time.',
    body: "After five entries, I'll start to see what you see.",
    cta: 'Write',
  },
  pathways: {
    heading: 'Guided paths for harder days.',
    body: "When you don't know what to write, a pathway gives you a container.",
  },
  journalSearch: {
    heading: 'Nothing matched.',
    body: "Try different words. Your entries are here. They didn't go anywhere.",
  },
};

