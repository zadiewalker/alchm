// Khepera Memory System - Stores user context and conversation history
// Enables personalized, contextual responses based on user's healing journey

interface UserContext {
  userId: string;
  recentEntries: Array<{
    content: string;
    moods: string[];
    timestamp: Date;
    kheperaInsights?: any;
  }>;
  emotionalPatterns: {
    primaryEmotions: string[];
    copingStrategies: string[];
    growthThemes: string[];
    concernAreas: string[];
  };
  preferences: {
    communicationStyle: 'gentle' | 'direct' | 'supportive';
    topicsToAvoid: string[];
    preferredLanguage: string;
  };
  healingJourney: {
    journeyStartDate: Date;
    milestonesReached: string[];
    currentFocus: string[];
    supportNeeded: string[];
  };
  lastUpdated: Date;
}

class KheperaMemoryService {
  private static instance: KheperaMemoryService;
  private userContexts: Map<string, UserContext> = new Map();
  
  static getInstance(): KheperaMemoryService {
    if (!KheperaMemoryService.instance) {
      KheperaMemoryService.instance = new KheperaMemoryService();
    }
    return KheperaMemoryService.instance;
  }

  // Initialize or retrieve user context
  async getUserContext(userId: string): Promise<UserContext> {
    let context = this.userContexts.get(userId);
    
    if (!context) {
      // Try to load from localStorage first
      context = this.loadFromLocalStorage(userId);
      
      if (!context) {
        // Create new user context
        context = {
          userId,
          recentEntries: [],
          emotionalPatterns: {
            primaryEmotions: [],
            copingStrategies: [],
            growthThemes: [],
            concernAreas: [],
          },
          preferences: {
            communicationStyle: 'gentle',
            topicsToAvoid: [],
            preferredLanguage: 'en',
          },
          healingJourney: {
            journeyStartDate: new Date(),
            milestonesReached: [],
            currentFocus: [],
            supportNeeded: [],
          },
          lastUpdated: new Date(),
        };
      }
      
      this.userContexts.set(userId, context);
    }
    
    return context;
  }

  // Update user context with new journal entry and insights
  async updateUserContext(
    userId: string, 
    entry: {
      content: string;
      moods: string[];
      kheperaInsights?: any;
    }
  ): Promise<void> {
    const context = await this.getUserContext(userId);
    
    // Add new entry (keep last 10 entries for context)
    const newEntry = {
      ...entry,
      timestamp: new Date(),
    };
    
    context.recentEntries.unshift(newEntry);
    context.recentEntries = context.recentEntries.slice(0, 10);
    
    // Update emotional patterns based on insights
    if (entry.kheperaInsights?.emotionalThemes) {
      this.updateEmotionalPatterns(context, entry.kheperaInsights.emotionalThemes);
    }
    
    // Update mood patterns
    if (entry.moods.length > 0) {
      this.updateMoodPatterns(context, entry.moods);
    }
    
    context.lastUpdated = new Date();
    
    // Save to localStorage and memory
    this.userContexts.set(userId, context);
    this.saveToLocalStorage(userId, context);
  }

  // Generate context-aware prompt for Khepera
  generateContextualPrompt(userId: string, currentContent: string): string {
    const context = this.userContexts.get(userId);
    
    if (!context || context.recentEntries.length === 0) {
      return ''; // No context available, use standard prompts
    }
    
    const recentThemes = this.extractRecentThemes(context);
    const journeyLength = this.calculateJourneyLength(context);
    const growthPatterns = context.emotionalPatterns.growthThemes;
    
    let contextualInfo = `\n\nCONTEXTUAL INFORMATION FOR PERSONALIZED RESPONSE:
User's Healing Journey: ${journeyLength}
Recent Emotional Themes: ${recentThemes.join(', ')}`;
    
    if (growthPatterns.length > 0) {
      contextualInfo += `\nPrevious Growth Areas: ${growthPatterns.join(', ')}`;
    }
    
    if (context.preferences.communicationStyle !== 'gentle') {
      contextualInfo += `\nPreferred Communication Style: ${context.preferences.communicationStyle}`;
    }
    
    // Add patterns from recent entries
    const recentMoods = this.getRecentMoodPatterns(context);
    if (recentMoods.length > 0) {
      contextualInfo += `\nRecent Mood Patterns: ${recentMoods.join(', ')}`;
    }
    
    contextualInfo += `\nRemember previous conversations and build upon insights already shared.
Acknowledge growth and patterns you've noticed in their journey.
Be specific about their progress and resilience you've observed.`;
    
    return contextualInfo;
  }

  // Get conversation history for context
  getConversationHistory(userId: string): Array<{ entry: string; insights: string }> {
    const context = this.userContexts.get(userId);
    if (!context) return [];
    
    return context.recentEntries
      .slice(0, 5) // Last 5 entries for context
      .map(entry => ({
        entry: entry.content.substring(0, 200) + '...', // Truncate for context
        insights: entry.kheperaInsights?.analysis?.gentleInsight || ''
      }));
  }

  private updateEmotionalPatterns(context: UserContext, themes: any): void {
    if (themes.primaryEmotions) {
      themes.primaryEmotions.forEach((emotion: string) => {
        if (!context.emotionalPatterns.primaryEmotions.includes(emotion)) {
          context.emotionalPatterns.primaryEmotions.push(emotion);
        }
      });
      
      // Keep only recent emotions (max 15)
      context.emotionalPatterns.primaryEmotions = 
        context.emotionalPatterns.primaryEmotions.slice(-15);
    }
    
    if (themes.copingStrategies) {
      themes.copingStrategies.forEach((strategy: string) => {
        if (!context.emotionalPatterns.copingStrategies.includes(strategy)) {
          context.emotionalPatterns.copingStrategies.push(strategy);
        }
      });
    }
    
    if (themes.growthIndicators) {
      themes.growthIndicators.forEach((indicator: string) => {
        if (!context.emotionalPatterns.growthThemes.includes(indicator)) {
          context.emotionalPatterns.growthThemes.push(indicator);
        }
      });
    }
  }
  
  private updateMoodPatterns(context: UserContext, moods: string[]): void {
    moods.forEach(mood => {
      if (!context.emotionalPatterns.primaryEmotions.includes(mood)) {
        context.emotionalPatterns.primaryEmotions.push(mood);
      }
    });
  }

  private extractRecentThemes(context: UserContext): string[] {
    const themes = new Set<string>();
    
    context.recentEntries.slice(0, 3).forEach(entry => {
      if (entry.kheperaInsights?.emotionalThemes?.primaryEmotions) {
        entry.kheperaInsights.emotionalThemes.primaryEmotions.forEach((emotion: string) => {
          themes.add(emotion);
        });
      }
      
      entry.moods.forEach(mood => themes.add(mood));
    });
    
    return Array.from(themes).slice(0, 5); // Top 5 recent themes
  }

  private calculateJourneyLength(context: UserContext): string {
    const daysSinceStart = Math.floor(
      (new Date().getTime() - context.healingJourney.journeyStartDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceStart < 7) return `${daysSinceStart} days of journaling`;
    if (daysSinceStart < 30) return `${Math.floor(daysSinceStart / 7)} weeks of reflection`;
    return `${Math.floor(daysSinceStart / 30)} months of healing journey`;
  }

  private getRecentMoodPatterns(context: UserContext): string[] {
    const moodCounts: { [mood: string]: number } = {};
    
    context.recentEntries.slice(0, 5).forEach(entry => {
      entry.moods.forEach(mood => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      });
    });
    
    return Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([mood, count]) => `${mood} (${count}x)`);
  }

  private loadFromLocalStorage(userId: string): UserContext | null {
    // Server-side: localStorage not available, skip loading
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const stored = localStorage.getItem(`khepera_memory_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.healingJourney.journeyStartDate = new Date(parsed.healingJourney.journeyStartDate);
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.recentEntries = parsed.recentEntries.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        return parsed;
      }
    } catch (error) {
      console.error('Error loading Khepera memory from localStorage:', error);
    }
    return null;
  }

  private saveToLocalStorage(userId: string, context: UserContext): void {
    // Server-side: localStorage not available, skip saving
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem(`khepera_memory_${userId}`, JSON.stringify(context));
    } catch (error) {
      console.error('Error saving Khepera memory to localStorage:', error);
    }
  }

  // Clear user memory (for privacy/reset purposes)
  async clearUserMemory(userId: string): Promise<void> {
    this.userContexts.delete(userId);
    localStorage.removeItem(`khepera_memory_${userId}`);
  }

  // Get memory insights for user (for transparency)
  getUserMemoryInsights(userId: string): any {
    const context = this.userContexts.get(userId);
    if (!context) return null;
    
    return {
      journeyLength: this.calculateJourneyLength(context),
      totalEntries: context.recentEntries.length,
      primaryEmotions: context.emotionalPatterns.primaryEmotions.slice(-5),
      growthThemes: context.emotionalPatterns.growthThemes,
      copingStrategies: context.emotionalPatterns.copingStrategies,
    };
  }
}

export const kheperaMemory = KheperaMemoryService.getInstance();
export type { UserContext };