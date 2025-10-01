export const lines = {
  // Core messaging
  clarity: "Trauma-informed AI journaling. Private. Ritual, not therapy.",
  hero: "The World's First Identity OS.",
  sub_privacy: "Private by design. Encrypted by default.",
  
  // Nudges and prompts
  nudge1: "Write the first line. Let it be imperfect.",
  nudge2: "Small notes become receipts of growth.",
  nudge3: "Pause is part of the ritual.",
  
  // Safety and crisis
  crisis: "Therapeutic, not therapy. In crisis? 988 (US/CA), 111 (UK).",
  
  // Onboarding journey
  onboarding_claim: "The World's First Identity OS.",
  onboarding_claim_body: "Not therapy. Not vibes. Receipts of growth.",
  onboarding_promise: "Your story is sacred. Your growth is yours.",
  onboarding_contract: "A Sacred Contract",
  onboarding_contract_body: "Therapeutic—not therapy. Your ritual. Your rules. Your words stay yours.",
  
  // Dashboard
  dashboard_welcome: "Welcome back.",
  dashboard_subtitle: "Your ritual lives here.",
  
  // Journal
  journal_hero: "The World's First Identity OS.",
  journal_subtitle: "Private by design. Encrypted by default.",
  
  // Actions
  cta_start: "Start Your Streak",
  cta_continue: "Continue",
  cta_begin: "Begin your first reflection",
  cta_start_writing: "Start Writing",
  cta_view_entries: "View Entries",
  cta_explore: "Explore Pathways",
  
  // Status messages
  status_encrypted: "Private & encrypted",
  status_streak: (days: number) => `Still here ${days} day${days !== 1 ? 's' : ''}`,
  status_last_entry: (relative: string) => `Last entry ${relative}`,
  
  // Privacy
  privacy_yours: "Your words stay yours.",
  privacy_export: "Export",
  privacy_delete: "Delete"
} as const;