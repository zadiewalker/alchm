'use client';

export interface TimeContext {
  period: 'late-night' | 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night';
  greeting: string;
  kheperaModifier: string;
  ui: {
    reflectionMaxTokens: number;
    showVoiceProminent: boolean;
  };
}

export function getTimeContext(now: Date = new Date()): TimeContext {
  const hour = now.getHours();

  if (hour >= 0 && hour < 4) {
    return {
      period: 'late-night',
      greeting: "You're here.",
      kheperaModifier:
        'The user is writing between midnight and 4am. Be especially brief, warm, and gentle. Do not ask probing questions. Hold space. Respond in 2–3 sentences maximum. They may be in distress, unable to sleep, or processing something heavy. Prioritize comfort over insight.',
      ui: { reflectionMaxTokens: 300, showVoiceProminent: true },
    };
  }

  if (hour >= 4 && hour < 7) {
    return {
      period: 'early-morning',
      greeting: 'Early start.',
      kheperaModifier:
        'The user is writing in the early morning hours. They may not have slept, or they may be up early by choice. Match their energy. If the entry is heavy, be gentle. If it is reflective, be thoughtful.',
      ui: { reflectionMaxTokens: 600, showVoiceProminent: true },
    };
  }

  if (hour >= 7 && hour < 12) {
    return { period: 'morning', greeting: 'Good morning.', kheperaModifier: '', ui: { reflectionMaxTokens: 1024, showVoiceProminent: false } };
  }

  if (hour >= 12 && hour < 17) {
    return { period: 'afternoon', greeting: 'Good afternoon.', kheperaModifier: '', ui: { reflectionMaxTokens: 1024, showVoiceProminent: false } };
  }

  if (hour >= 17 && hour < 21) {
    return { period: 'evening', greeting: 'Good evening.', kheperaModifier: '', ui: { reflectionMaxTokens: 1024, showVoiceProminent: false } };
  }

  return {
    period: 'night',
    greeting: 'Evening.',
    kheperaModifier:
      'The user is writing late in the evening. They may be winding down or processing the day. Reflections can be slightly more gentle and conclusive: help them close the day, not open new threads.',
    ui: { reflectionMaxTokens: 800, showVoiceProminent: false },
  };
}

