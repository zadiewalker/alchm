async function vibrate(ms: number) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  } catch {
    // non-blocking fallback only
  }
}

export const haptics = {
  light: async () => vibrate(8),
  medium: async () => vibrate(14),
  heavy: async () => vibrate(20),
  soft: async () => vibrate(6),
  warmth: async () => vibrate(10),
  selection: async () => vibrate(8),
  success: async () => vibrate(16),
  flowNoticeShow: async () => vibrate(7),
  flowNoticeDismiss: async () => vibrate(6),
};
