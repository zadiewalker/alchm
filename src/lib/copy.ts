/**
 * ALCHM Microcopy - Warm, minimal, human tone
 * One sentence maximum. Generous and dignified language.
 */

export const copy = {
  // Welcome Flow
  welcome: {
    headline: "You've entered a digital sanctuary.",
    subhead: "This isn't about fixing yourself. It's about remembering who you are.",
    continue: "Continue",
    skipIntro: "Skip introduction"
  },

  // Values Screen
  values: {
    title: "Built with intention",
    privacy: {
      title: "Private by design",
      description: "Your words stay yours, encrypted and secure."
    },
    ai: {
      title: "AI as witness",
      description: "Khepera reflects you back to yourself, never judges."
    },
    growth: {
      title: "Your own pace",
      description: "No streaks to maintain, just gentle invitation to return."
    }
  },

  // Sacred Contract
  contract: {
    title: "A sacred contract",
    disclaimer: "ALCHM is a space for reflection, not therapy. Your privacy is absolute—we encrypt everything and never access your personal entries.",
    crisis: "If you are in crisis, please reach out now:",
    crisisUs: "Call or Text 988 (US/Canada)",
    crisisUk: "Call 111 (UK)",
    crisisIntl: "Crisis Text Line: Text HOME to 741741",
    accept: "I understand and accept"
  },

  // Meet Khepera
  khepera: {
    title: "Meet Khepera",
    body: "I'm not here to fix you—nothing about you is broken. I'm here to reflect you back to yourself, to help you see the wisdom you already carry.",
    begin: "Begin your first reflection"
  },

  // Editor
  editor: {
    placeholder: "What is rising in you today?",
    saveLabel: "Save reflection",
    savingLabel: "Saving...",
    savedLabel: "Saved",
    voiceLabel: "Voice input",
    attachLabel: "Attach image",
    draftLabel: "Save as draft",
    characterCount: "{count} characters",
    autoSaved: "Your words are safe—we save as you write."
  },

  // AI Response
  aiResponse: {
    thinking: "Khepera is reflecting...",
    pinLabel: "Save to Growth Portfolio",
    pinnedLabel: "Saved to portfolio",
    markTender: "Mark as tender",
    markedTender: "Marked as tender",
    helpful: "This resonated",
    notQuite: "Not quite right",
    feedbackThanks: "Thank you—this helps Khepera grow."
  },

  // Pathways
  pathways: {
    title: "Choose your path",
    invite: "These pathways are invitations, not obligations. Start where your heart calls.",
    next: "Take the next step",
    progress: "{completed} of {total} reflections",
    complete: "You've completed this pathway. How does it feel to have honored this part of your journey?"
  },

  // PWA Install
  install: {
    title: "Keep ALCHM close",
    description: "Add to your home screen for a more intimate experience.",
    accept: "Add to home screen",
    dismiss: "Maybe later",
    installed: "ALCHM is now on your home screen."
  },

  // Offline
  offline: {
    title: "You're offline",
    description: "Your sanctuary travels with you. Continue reflecting—we'll sync when you reconnect.",
    cachedPrompts: "Here are some gentle prompts to explore:",
    reconnected: "You're back online. Welcome back to your sanctuary."
  },

  // Errors (Graceful)
  error: {
    generic: "Something's not quite right. Take a breath—your words are safe.",
    network: "Can't connect right now. Your reflection is saved locally.",
    retry: "Try again",
    support: "Need help? Reach out at sanctuary@alchm.co"
  }
} as const;

// Type helper for accessing copy keys
export type CopyKey = keyof typeof copy;
export type NestedCopyKey<T> = T extends object ? keyof T : never;