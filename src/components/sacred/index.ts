/**
 * CRISIS-OPTIMIZED: Emergency Performance Sacred Index
 * 
 * Temporarily simplified to solve critical bundle size issues that prevent
 * users in mental health crisis from accessing the platform quickly.
 */

// EMERGENCY: Only lazy load sacred components when needed
export const SacredComponentsLazy = {
  SanctuaryShell: () => import('./SanctuaryShell').then(m => m.SanctuaryShell),
  IntentionGem: () => import('./IntentionGem').then(m => m.IntentionGem),
  ReflectionCard: () => import('./ReflectionCard').then(m => m.ReflectionCard),
};

// All other exports temporarily disabled for performance emergency
// TODO: Re-enable after bundle size optimization is complete