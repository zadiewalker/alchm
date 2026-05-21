import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import type { KheperaMemory, KheperaUserContext } from '@/types/khepera';
import type { KheperaStyleProfile, ResponseStance } from '@/types/khepera';
import type { EmotionalTone, ThemeTag } from '@/types/journal';

const VALID_TONES: readonly EmotionalTone[] = [
  'processing',
  'grief',
  'anger',
  'anxiety',
  'clarity',
  'numbness',
  'tenderness',
  'ambivalence',
];

const VALID_THEME_SET = new Set<ThemeTag>([
  'grief_loss',
  'relationship_tension',
  'self_worth',
  'identity',
  'work_purpose',
  'fear_uncertainty',
  'anger_injustice',
  'body_health',
  'creativity_expression',
  'spirituality_meaning',
  'rest_recovery',
  'joy_gratitude',
  'transition_change',
  'boundary_setting',
  'childhood_origin',
]);

function sanitizeThemes(input: unknown): ThemeTag[] {
  return Array.isArray(input)
    ? input.filter((theme): theme is ThemeTag => typeof theme === 'string' && VALID_THEME_SET.has(theme as ThemeTag))
    : [];
}

export function sanitizeKheperaMemoryDoc(memory: unknown): KheperaMemory {
  const data = typeof memory === 'object' && memory !== null ? memory as Record<string, unknown> : {};
  const recurringThemes = sanitizeThemes(data.recurringThemes);
  const recentThemes = sanitizeThemes(data.recentThemes);
  const dominantTone = typeof data.dominantTone === 'string' && VALID_TONES.includes(data.dominantTone as EmotionalTone)
    ? data.dominantTone as EmotionalTone
    : 'processing';

  return {
    recurringThemes,
    recentThemes,
    dominantTone,
  };
}

export async function getKheperaContext(userId: string): Promise<KheperaUserContext> {
  try {
    const db = getFirestoreDb();
    const memoryRef = doc(db, 'users', userId, 'khepera', 'memory');
    const memorySnap = await getDoc(memoryRef);
    
    if (!memorySnap.exists()) {
      // First session — initialize minimal context
      return {
        sessionCount: 0,
        recurringThemes: [],
        recentThemes: [],
        dominantTone: 'processing',
        recentStances: [],
        recentStyles: [],
        lastReturnType: 'immediate',
      };
    }
    
    const memory = sanitizeKheperaMemoryDoc(memorySnap.data());
    
    return {
      sessionCount: 0,
      recurringThemes: memory.recurringThemes || [],
      recentThemes: memory.recentThemes || [],
      dominantTone: memory.dominantTone || 'processing',
      recentStances: [],
      recentStyles: [],
      lastReturnType: 'immediate',
    };

  } catch (error) {
    console.error('Failed to load Khepera context:', error);
    
    // Return safe defaults
    return {
      sessionCount: 0,
      recurringThemes: [],
      recentThemes: [],
      dominantTone: 'processing',
      recentStances: [],
      recentStyles: [],
      lastReturnType: 'immediate',
    };
  }
}

export async function updateKheperaMemory(
  userId: string,
  themes: ThemeTag[],
  tone: EmotionalTone,
  metadata?: {
    stance?: ResponseStance;
    styleProfile?: KheperaStyleProfile;
    lastReturnType?: 'immediate' | 'delayed';
  }
): Promise<void> {
  try {
    const db = getFirestoreDb();
    const memoryRef = doc(db, 'users', userId, 'khepera', 'memory');
    const memorySnap = await getDoc(memoryRef);
    
    if (!memorySnap.exists()) {
      const newMemory: KheperaMemory = {
        recurringThemes: themes,
        recentThemes: themes.slice(0, 3),
        dominantTone: tone,
      };
      
      await setDoc(memoryRef, newMemory);
      
      return;
    }

    const currentMemory = sanitizeKheperaMemoryDoc(memorySnap.data());
    const themeFreq: Record<string, number> = {};
    
    (currentMemory.recurringThemes || []).forEach(theme => {
      themeFreq[theme] = (themeFreq[theme] || 0) + 0.7;
    });
    
    themes.forEach(theme => {
      themeFreq[theme] = (themeFreq[theme] || 0) + 1;
    });
    
    const recurringThemes = Object.entries(themeFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([theme]) => theme as ThemeTag);
    const recentThemes = themes.slice(0, 3);

    await updateDoc(memoryRef, {
      recurringThemes,
      recentThemes,
      dominantTone: tone,
      userId: deleteField(),
      sessionCount: deleteField(),
      previousTone: deleteField(),
      recentStances: deleteField(),
      recentStyles: deleteField(),
      lastReturnType: deleteField(),
      lastSessionDate: deleteField(),
      primaryPreoccupation: deleteField(),
      openSeeds: deleteField(),
      mirrorObservation: deleteField(),
      mirrorObservationAt: deleteField(),
    });

  } catch (error) {
    console.error('Failed to update Khepera memory:', error);
    // Don't throw — memory update is not critical for user experience
  }
}
