import type { ArcPoint, ThreadData } from '@/types/mirror';

interface GenerateObservationParams {
  userId: string;
  arc: ArcPoint[];
  dominantTone: string | null;
  recurringThemes: ThreadData[];
  openSeeds: string[];
  sessionCount: number;
  lastObservationAt: Date | null;
}

interface ObservationResult {
  observation: string;
  generatedAt: Date;
  cached: boolean;
}

export async function generateMirrorObservation(_params: GenerateObservationParams): Promise<ObservationResult> {
  return {
    observation: 'Mirror is not available in this launch build.',
    generatedAt: new Date(),
    cached: false,
  };
}
