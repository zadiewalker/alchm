// PUBLIC API — these are the only exports other modules may import
export {
  generateSafeKheperaResponse,
  generateSafeOnboardingKheperaResponse,
  generateJournalKheperaResponse,
  generateOnboardingKheperaResponse,
  extractThemesForKheperaEntry,
} from './service';
export { generateMirrorObservation } from './generateMirrorObservation';
export { buildKheperaSystemPrompt } from './systemPrompt';
export { buildEnhancedKheperaSystemPrompt } from './enhancedSystemPrompt';
export { buildOnboardingSystemPrompt } from './onboardingPrompt';
export { isCrisisSignalPresent, CRISIS_RESPONSE } from './crisisDetection';
export { getKheperaContext, updateKheperaMemory } from './memory';
export { runKheperaValidation, runSingleTest } from './testValidation';
export type { KheperaUserContext, KheperaResponse, KheperaMemory } from '@/types/khepera';
