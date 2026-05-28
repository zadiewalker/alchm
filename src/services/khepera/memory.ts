import { doc, getDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import type { KheperaMemory, KheperaUserContext } from '@/types/khepera';
import type { EmotionalTone, ThemeTag } from '@/types/journal';

function isThemeTag(value: unknown): value is ThemeTag {
  switch (value) {
    case 'grief_loss':
    case 'relationship_tension':
    case 'self_worth':
    case 'identity':
    case 'work_purpose':
    case 'fear_uncertainty':
    case 'anger_injustice':
    case 'body_health':
    case 'creativity_expression':
    case 'spirituality_meaning':
    case 'rest_recovery':
    case 'joy_gratitude':
    case 'transition_change':
    case 'boundary_setting':
    case 'childhood_origin':
      return true;
    default:
      return false;
  }
}

function isEmotionalTone(value: unknown): value is EmotionalTone {
  switch (value) {
    case 'processing':
    case 'grief':
    case 'anger':
    case 'anxiety':
    case 'clarity':
    case 'numbness':
    case 'tenderness':
    case 'ambivalence':
      return true;
    default:
      return false;
  }
}

function sanitizeThemes(input: unknown): ThemeTag[] {
  return Array.isArray(input)
    ? input.filter(isThemeTag)
    : [];
}

function sanitizeTone(input: unknown): EmotionalTone {
  return isEmotionalTone(input) ? input : 'processing';
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

export function sanitizeKheperaMemoryDoc(memory: unknown): KheperaMemory {
  const data = isRecord(memory) ? memory : {};
  return {
    themeTags: sanitizeThemes(data.themeTags ?? data.recurringThemes ?? data.recentThemes),
    emotionalTone: sanitizeTone(data.emotionalTone ?? data.dominantTone),
  };
}

export async function getKheperaContext(userId: string): Promise<KheperaUserContext> {
  try {
    const memorySnap = await getDoc(doc(getFirestoreDb(), 'users', userId, 'khepera', 'memory'));
    const memory: KheperaMemory = memorySnap.exists()
      ? sanitizeKheperaMemoryDoc(memorySnap.data())
      : { themeTags: [], emotionalTone: 'processing' };

    return {
      sessionCount: 0,
      recurringThemes: memory.themeTags,
      recentThemes: memory.themeTags,
      dominantTone: memory.emotionalTone,
    };
  } catch {
    return {
      sessionCount: 0,
      recurringThemes: [],
      recentThemes: [],
      dominantTone: 'processing',
    };
  }
}
