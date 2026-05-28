import { EMOTIONAL_BOUNDARY_KEYWORDS } from '@/config/supportBoundaries';
import { detectCrisisSignals } from '@/services/khepera/crisisDetection';
import type { SupportBoundaryClassification } from '@/types/support';

export function classifySupportBoundary(message: string): SupportBoundaryClassification {
  const normalized = message.toLowerCase();

  if (detectCrisisSignals(message) || normalized.includes('988')) {
    return 'crisis_boundary';
  }

  if (EMOTIONAL_BOUNDARY_KEYWORDS.some(keyword => normalized.includes(keyword))) {
    return 'emotional_boundary';
  }

  return 'standard';
}
