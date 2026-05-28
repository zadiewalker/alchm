import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import type { EmotionalTone, ThemeTag } from '@/types/journal';

export interface SessionTheme {
  sessionId: string;
  dayNumber: number;
  emotionalTone: EmotionalTone;
  themes: ThemeTag[];
  texture: {
    energyLevel: 'depleted' | 'steady' | 'activated';
    relationshipFocus: boolean;
    selfFocus: boolean;
    timeOrientation: 'past' | 'present' | 'future' | 'mixed';
    resolutionSeeking: boolean;
    processingMode: 'cognitive' | 'somatic' | 'narrative' | 'expressive';
  };
}

export const extractSessionTheme = async (
  entryText: string,
  kheperaResponse: string,
  sessionId: string,
  dayNumber: number
): Promise<SessionTheme> => {
  // This would normally call an AI service to extract themes
  // For now, implementing a basic extraction pattern
  
  const themes = await extractThemes(entryText);
  const emotionalTone = await extractEmotionalTone(entryText);
  const texture = await extractTexture(entryText);
  
  const sessionTheme: SessionTheme = {
    sessionId,
    dayNumber,
    emotionalTone,
    themes,
    texture,
  };
  
  return sessionTheme;
};

const extractThemes = async (entryText: string): Promise<ThemeTag[]> => {
  // In production, this would use Claude API to extract themes
  // This is a simplified implementation for structure
  const themes: ThemeTag[] = [];
  const text = entryText.toLowerCase();
  
  // Basic keyword matching - in production, use AI extraction
  if (text.includes('relationship') || text.includes('partner') || text.includes('friend')) {
    themes.push('relationship_tension');
  }
  if (text.includes('work') || text.includes('job') || text.includes('career')) {
    themes.push('work_purpose');
  }
  if (text.includes('anxiety') || text.includes('worry') || text.includes('fear')) {
    themes.push('fear_uncertainty');
  }
  if (text.includes('loss') || text.includes('grief') || text.includes('miss')) {
    themes.push('grief_loss');
  }
  if (text.includes('angry') || text.includes('frustrated') || text.includes('unfair')) {
    themes.push('anger_injustice');
  }
  if (text.includes('worth') || text.includes('enough') || text.includes('deserve')) {
    themes.push('self_worth');
  }
  
  return themes;
};

const extractEmotionalTone = async (entryText: string): Promise<EmotionalTone> => {
  // In production, this would use Claude API for emotional tone detection
  const text = entryText.toLowerCase();
  
  if (text.includes('angry') || text.includes('frustrated') || text.includes('rage')) {
    return 'anger';
  }
  if (text.includes('anxious') || text.includes('worry') || text.includes('scared')) {
    return 'anxiety';
  }
  if (text.includes('sad') || text.includes('loss') || text.includes('grief')) {
    return 'grief';
  }
  if (text.includes('clear') || text.includes('understand') || text.includes('realize')) {
    return 'clarity';
  }
  if (text.includes('numb') || text.includes('empty') || text.includes('nothing')) {
    return 'numbness';
  }
  if (text.includes('love') || text.includes('tender') || text.includes('soft')) {
    return 'tenderness';
  }
  if (text.includes('both') || text.includes('conflicted') || text.includes('torn')) {
    return 'ambivalence';
  }
  
  return 'processing'; // default
};

const extractTexture = async (entryText: string): Promise<SessionTheme['texture']> => {
  const text = entryText.toLowerCase();
  
  return {
    energyLevel: text.includes('tired') || text.includes('exhausted') ? 'depleted' :
                 text.includes('energy') || text.includes('excited') ? 'activated' : 'steady',
    relationshipFocus: text.includes('he ') || text.includes('she ') || text.includes('they ') ||
                      text.includes('relationship') || text.includes('friend') || text.includes('partner'),
    selfFocus: text.includes('i feel') || text.includes('i think') || text.includes('i am') ||
              text.includes('myself') || text.includes('i need'),
    timeOrientation: text.includes('yesterday') || text.includes('past') || text.includes('remember') ? 'past' :
                    text.includes('tomorrow') || text.includes('future') || text.includes('will') ? 'future' :
                    text.includes('now') || text.includes('today') || text.includes('right now') ? 'present' : 'mixed',
    resolutionSeeking: text.includes('what should') || text.includes('how do i') || text.includes('what do') ||
                      text.includes('help me') || text.includes('advice'),
    processingMode: text.includes('feel') || text.includes('body') || text.includes('physical') ? 'somatic' :
                   text.includes('think') || text.includes('understand') || text.includes('analyze') ? 'cognitive' :
                   text.includes('story') || text.includes('happened') || text.includes('tell') ? 'narrative' : 'expressive',
  };
};

export const getRecentSessionThemes = async (userId: string, limitCount: number = 10): Promise<SessionTheme[]> => {
  try {
    const db = getFirestoreDb();
    const q = query(
      collection(db, 'sessionThemes'),
      where('userId', '==', userId),
      orderBy('dayNumber', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const themes: SessionTheme[] = [];
    
    querySnapshot.forEach((doc) => {
      themes.push(doc.data() as SessionTheme);
    });
    
    return themes;
  } catch (error) {
    console.error('Error fetching session themes:', error);
    return [];
  }
};

export const findRecurringThemes = (themes: SessionTheme[]): string[] => {
  const themeCounts = new Map<string, number>();
  
  themes.forEach(session => {
    session.themes.forEach(theme => {
      themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1);
    });
  });
  
  return Array.from(themeCounts.entries())
    .filter(([_, count]) => count >= 2)
    .map(([theme, _]) => theme);
};

export const findDominantEmotionalTone = (themes: SessionTheme[]): EmotionalTone => {
  const toneCounts = new Map<EmotionalTone, number>();
  
  themes.forEach(session => {
    toneCounts.set(session.emotionalTone, (toneCounts.get(session.emotionalTone) || 0) + 1);
  });
  
  let maxCount = 0;
  let dominantTone: EmotionalTone = 'processing';
  
  toneCounts.forEach((count, tone) => {
    if (count > maxCount) {
      maxCount = count;
      dominantTone = tone;
    }
  });
  
  return dominantTone;
};

export const detectRecentToneShift = (themes: SessionTheme[]): string | null => {
  if (themes.length < 3) return null;
  
  const recent = themes.slice(0, 2);
  const previous = themes.slice(2, 4);
  
  const recentTone = recent[0]?.emotionalTone;
  const previousTone = previous[0]?.emotionalTone;
  
  if (recentTone !== previousTone) {
    return `from ${previousTone} to ${recentTone}`;
  }
  
  return null;
};
