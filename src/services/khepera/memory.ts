import { deleteField, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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

const VALID_STANCES = new Set<ResponseStance>([
  'witnessing',
  'containing',
  'clarifying',
  'expanding',
  'integrating',
  'holding_ambiguity',
]);

const VALID_STYLE_SET = new Set<KheperaStyleProfile>([
  'grounded_witness',
  'gentle_organizer',
  'perspective_opener',
  'soft_container',
  'open_field',
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
  const previousTone = typeof data.previousTone === 'string' && VALID_TONES.includes(data.previousTone as EmotionalTone)
    ? data.previousTone as EmotionalTone
    : undefined;
  const recentStances = Array.isArray(data.recentStances)
    ? data.recentStances.filter((stance): stance is ResponseStance => typeof stance === 'string' && VALID_STANCES.has(stance as ResponseStance))
    : [];
  const recentStyles = Array.isArray(data.recentStyles)
    ? data.recentStyles.filter((style): style is KheperaStyleProfile => typeof style === 'string' && VALID_STYLE_SET.has(style as KheperaStyleProfile))
    : [];
  const lastReturnType = data.lastReturnType === 'delayed' ? 'delayed' : 'immediate';

  return {
    userId: typeof data.userId === 'string' ? data.userId : '',
    sessionCount: typeof data.sessionCount === 'number' ? data.sessionCount : 0,
    recurringThemes,
    recentThemes,
    dominantTone,
    previousTone,
    recentStances,
    recentStyles,
    lastReturnType,
    lastSessionDate: null,
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
      sessionCount: memory.sessionCount || 0,
      recurringThemes: memory.recurringThemes || [],
      recentThemes: memory.recentThemes || [],
      dominantTone: memory.dominantTone || 'processing',
      previousTone: memory.previousTone,
      recentStances: memory.recentStances || [],
      recentStyles: memory.recentStyles || [],
      lastReturnType: memory.lastReturnType ?? 'immediate',
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
      // Initialize new memory document
      const newMemory: Omit<KheperaMemory, 'userId'> = {
        sessionCount: 1,
        recurringThemes: themes,
        recentThemes: themes.slice(0, 3),
        dominantTone: tone,
        previousTone: undefined,
        recentStances: metadata?.stance ? [metadata.stance] : [],
        recentStyles: metadata?.styleProfile ? [metadata.styleProfile] : [],
        lastReturnType: metadata?.lastReturnType ?? 'immediate',
        lastSessionDate: new Date(),
      };
      
      await setDoc(memoryRef, {
        ...newMemory,
        userId,
        lastSessionDate: serverTimestamp(),
      });
      
      return;
    }

    const currentMemory = sanitizeKheperaMemoryDoc(memorySnap.data());
    
    // Update session count
    const sessionCount = (currentMemory.sessionCount || 0) + 1;
    
    // Update recurring themes (weighted by recency)
    const themeFreq: Record<string, number> = {};
    
    // Count existing themes (with decay)
    (currentMemory.recurringThemes || []).forEach(theme => {
      themeFreq[theme] = (themeFreq[theme] || 0) + 0.7; // Decay factor
    });
    
    // Add new themes
    themes.forEach(theme => {
      themeFreq[theme] = (themeFreq[theme] || 0) + 1;
    });
    
    // Get top recurring themes
    const recurringThemes = Object.entries(themeFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([theme]) => theme);
    
    // Update dominant tone (recent sessions weighted more heavily)
    const dominantTone = updateDominantTone(
      (currentMemory.dominantTone as EmotionalTone | undefined) ?? 'processing',
      tone,
      sessionCount
    );
    const recentThemes = themes.slice(0, 3);
    const recentStances = metadata?.stance
      ? [...currentMemory.recentStances, metadata.stance].slice(-4)
      : currentMemory.recentStances;
    const recentStyles = metadata?.styleProfile
      ? [...currentMemory.recentStyles, metadata.styleProfile].slice(-4)
      : currentMemory.recentStyles;

    await updateDoc(memoryRef, {
      sessionCount,
      recurringThemes,
      recentThemes,
      dominantTone,
      previousTone: currentMemory.dominantTone,
      recentStances,
      recentStyles,
      lastReturnType: metadata?.lastReturnType ?? currentMemory.lastReturnType ?? 'immediate',
      lastSessionDate: serverTimestamp(),
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

function updateDominantTone(currentTone: EmotionalTone, newTone: EmotionalTone, sessionCount: number): EmotionalTone {
  if (sessionCount <= 3) {
    return newTone;
  }

  if (currentTone === newTone) {
    return currentTone;
  }

  if (sessionCount <= 10) {
    return newTone;
  }

  return currentTone;
}
