'use client';

export interface VoiceResult {
  transcript: string;
  confidence: number;
  error: string | null;
}

export interface VoiceSession {
  stop: () => void;
  done: Promise<VoiceResult>;
}

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((ev: unknown) => void) | null;
  onerror: ((ev: unknown) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as Record<string, unknown>;
  const ctor = (w.SpeechRecognition || w.webkitSpeechRecognition) as unknown;
  return typeof ctor === 'function' ? (ctor as SpeechRecognitionCtor) : null;
}

export function isVoiceSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return getRecognitionCtor() !== null;
}

export function startListening(): VoiceSession {
  const ctor = getRecognitionCtor();

  if (!ctor) {
    return {
      stop: () => {},
      done: Promise.resolve({
        transcript: '',
        confidence: 0,
        error: 'Voice input is not available on this device.',
      }),
    };
  }

  const recognition = new ctor();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  let finalTranscript = '';
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;

  const done = new Promise<VoiceResult>((resolve) => {
    recognition.onresult = (event: unknown) => {
      // Web Speech event shape varies; keep parsing defensive.
      const ev = event as { resultIndex?: number; results?: ArrayLike<{ isFinal?: boolean; 0?: { transcript?: string } }> };
      const startAt = typeof ev.resultIndex === 'number' ? ev.resultIndex : 0;
      const results = ev.results;
      if (!results) return;

      for (let i = startAt; i < results.length; i += 1) {
        const r = results[i];
        if (!r || !r.isFinal) continue;
        const seg = r[0]?.transcript;
        if (typeof seg === 'string' && seg.trim()) finalTranscript += `${seg.trim()} `;
      }

      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => recognition.stop(), 3000);
    };

    recognition.onerror = (event: unknown) => {
      const ev = event as { error?: string };
      resolve({
        transcript: finalTranscript.trim(),
        confidence: 0,
        error:
          ev.error === 'not-allowed'
            ? 'Microphone access needed. Check your settings.'
            : 'Voice input had a problem. Your words before the error are saved.',
      });
    };

    recognition.onend = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      resolve({
        transcript: finalTranscript.trim(),
        confidence: finalTranscript.trim() ? 1 : 0,
        error: null,
      });
    };

    recognition.start();

    // Safety timeout: 5 minutes max.
    setTimeout(() => recognition.stop(), 5 * 60 * 1000);
  });

  return { stop: () => recognition.stop(), done };
}

