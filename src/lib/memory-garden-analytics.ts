// ALCHM Memory Garden Analytics System
// Transforms clinical metrics into poetic growth stories
// Non-surveillance emotional data that celebrates resilience and reclamation

export interface MemoryGardenEntry {
  date: Date;
  journalEntry: boolean;
  emotionalTone: 'challenging' | 'neutral' | 'hopeful' | 'mixed' | 'celebrating';
  growthMoments: string[];
  aiThemes: string[];
  badges: Badge[];
  energyLevel: 1 | 2 | 3 | 4 | 5;
  selfCompassion: 1 | 2 | 3 | 4 | 5;
  connectionFelt: 1 | 2 | 3 | 4 | 5;
  culturalWisdom?: string;
  userReflection?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedDate: Date;
  category: 'presence' | 'resilience' | 'growth' | 'connection' | 'wisdom' | 'reclamation';
  color: 'sage' | 'terra' | 'blush' | 'healing';
  rarity: 'daily' | 'weekly' | 'milestone' | 'rare' | 'sacred';
  poeticPhrase: string;
}

export interface GrowthTrend {
  timeframe: 'week' | 'month' | 'season' | 'year';
  pattern: 'emerging' | 'deepening' | 'flowing' | 'transforming' | 'integrating';
  poeticDescription: string;
  supportiveElements: string[];
  culturalWisdom?: string;
  aiGeneratedPhrase: string;
}

export interface EmotionalTerrain {
  resilience: number;      // 0-1 scale
  clarity: number;         // 0-1 scale
  selfCompassion: number;  // 0-1 scale
  connection: number;      // 0-1 scale
  culturalGrounding: number; // 0-1 scale
  overallWellbeing: number;  // 0-1 scale
}

// ===== POETIC BADGE DEFINITIONS =====

export const SACRED_BADGES: Badge[] = [
  // Daily Presence Badges (Sage)
  {
    id: 'still-here',
    name: 'Still Here',
    description: 'Showed up for yourself today, even when it was hard',
    earnedDate: new Date(),
    category: 'presence',
    color: 'sage',
    rarity: 'daily',
    poeticPhrase: 'Your presence is a gift to the world'
  },
  
  {
    id: 'chose-softness',
    name: 'Chose Softness',
    description: 'Selected gentleness over harshness with yourself',
    earnedDate: new Date(),
    category: 'reclamation',
    color: 'blush',
    rarity: 'daily',
    poeticPhrase: 'Softness is revolutionary in a harsh world'
  },
  
  {
    id: 'didnt-spiral',
    name: "Didn't Spiral",
    description: 'Caught yourself in difficult emotions and held steady',
    earnedDate: new Date(),
    category: 'resilience',
    color: 'sage',
    rarity: 'daily',
    poeticPhrase: 'You are the calm within your own storm'
  },
  
  {
    id: 'voice-rising',
    name: 'Voice Rising',
    description: 'Expressed something authentic and true',
    earnedDate: new Date(),
    category: 'growth',
    color: 'terra',
    rarity: 'weekly',
    poeticPhrase: 'Your voice carries ancient wisdom'
  },
  
  // Weekly Growth Badges (Terra)
  {
    id: 'truth-teller',
    name: 'Truth Teller',
    description: 'Shared your authentic experience with courage',
    earnedDate: new Date(),
    category: 'growth',
    color: 'terra',
    rarity: 'weekly',
    poeticPhrase: 'Your truth illuminates the path for others'
  },
  
  {
    id: 'boundary-keeper',
    name: 'Boundary Keeper',
    description: 'Protected your energy with sacred boundaries',
    earnedDate: new Date(),
    category: 'wisdom',
    color: 'terra',
    rarity: 'weekly',
    poeticPhrase: 'Boundaries are love made visible'
  },
  
  {
    id: 'culture-holder',
    name: 'Culture Holder',
    description: 'Connected with your cultural wisdom and heritage',
    earnedDate: new Date(),
    category: 'connection',
    color: 'healing',
    rarity: 'weekly',
    poeticPhrase: 'You carry the strength of your ancestors'
  },
  
  // Self-Reclamation Badges (Blush)
  {
    id: 'joy-reclaimed',
    name: 'Joy Reclaimed',
    description: 'Found moments of genuine happiness and celebration',
    earnedDate: new Date(),
    category: 'reclamation',
    color: 'blush',
    rarity: 'weekly',
    poeticPhrase: 'Your joy is an act of resistance'
  },
  
  {
    id: 'body-friend',
    name: 'Body Friend',
    description: 'Treated your body with kindness and appreciation',
    earnedDate: new Date(),
    category: 'reclamation',
    color: 'blush',
    rarity: 'weekly',
    poeticPhrase: 'Your body is your oldest friend'
  },
  
  {
    id: 'rest-revolutionary',
    name: 'Rest Revolutionary',
    description: 'Prioritized rest as a radical act of self-care',
    earnedDate: new Date(),
    category: 'reclamation',
    color: 'blush',
    rarity: 'weekly',
    poeticPhrase: 'Rest is resistance to systems that would exhaust you'
  },
  
  // Milestone Badges (Terra)
  {
    id: 'season-keeper',
    name: 'Season Keeper',
    description: 'Journaled consistently for a full season of growth',
    earnedDate: new Date(),
    category: 'resilience',
    color: 'terra',
    rarity: 'milestone',
    poeticPhrase: 'You have witnessed your own seasons of change'
  },
  
  {
    id: 'wisdom-weaver',
    name: 'Wisdom Weaver',
    description: 'Integrated deep insights across multiple reflections',
    earnedDate: new Date(),
    category: 'wisdom',
    color: 'terra',
    rarity: 'milestone',
    poeticPhrase: 'You weave understanding from the threads of experience'
  },
  
  // Rare Sacred Badges
  {
    id: 'phoenix-rising',
    name: 'Phoenix Rising',
    description: 'Transformed through significant challenge with grace',
    earnedDate: new Date(),
    category: 'growth',
    color: 'terra',
    rarity: 'rare',
    poeticPhrase: 'From your ashes, wisdom blooms'
  },
  
  {
    id: 'ancestor-proud',
    name: 'Ancestor Proud',
    description: 'Lived in a way that honors your lineage and legacy',
    earnedDate: new Date(),
    category: 'connection',
    color: 'healing',
    rarity: 'sacred',
    poeticPhrase: 'Your ancestors dance in your courage'
  }
];

// ===== AI THEME GENERATOR =====

export class PoetryAnalytics {
  
  static generateAIThemes(entries: MemoryGardenEntry[], timeframe: 'week' | 'month' | 'season'): string[] {
    const themes = this.extractThematicPatterns(entries);
    return this.craftPoetryFromThemes(themes, timeframe);
  }
  
  private static extractThematicPatterns(entries: MemoryGardenEntry[]): any {
    const patterns = {
      resilience: 0,
      growth: 0,
      softness: 0,
      clarity: 0,
      connection: 0,
      challenge: 0,
      hope: 0,
      transformation: 0
    };
    
    entries.forEach(entry => {
      // Analyze themes from journal content
      if (entry.emotionalTone === 'hopeful' || entry.emotionalTone === 'celebrating') {
        patterns.hope += 1;
        patterns.resilience += 0.5;
      }
      
      if (entry.badges.some(b => b.category === 'reclamation')) {
        patterns.softness += 1;
      }
      
      if (entry.badges.some(b => b.category === 'growth')) {
        patterns.growth += 1;
        patterns.transformation += 0.3;
      }
      
      if (entry.connectionFelt >= 4) {
        patterns.connection += 1;
      }
      
      if (entry.selfCompassion >= 4) {
        patterns.softness += 0.5;
        patterns.clarity += 0.3;
      }
    });
    
    return patterns;
  }
  
  private static craftPoetryFromThemes(patterns: any, timeframe: string): string[] {
    const poeticPhrases: string[] = [];
    const dominant = Object.keys(patterns).reduce((a, b) => patterns[a] > patterns[b] ? a : b);
    
    const poetryTemplates = {
      resilience: [
        'Resilience blooms in the garden of your becoming',
        'Strength grows quietly in the spaces between storms',
        'Your endurance writes poetry on the pages of time'
      ],
      growth: [
        'Growth spirals upward like morning glories toward light',
        'You are becoming who you have always been',
        'Transformation whispers through each choice you make'
      ],
      softness: [
        'Softness reclaimed from a world demanding hardness',
        'Gentleness returns to its rightful throne',
        'Your tender heart leads with revolutionary courage'
      ],
      hope: [
        'Hope emerging like spring after winter\'s teaching',
        'Light gathering in the corners of possibility',
        'Tomorrow blooms in today\'s small choices'
      ],
      connection: [
        'Belonging weaves itself through authentic sharing',
        'Connection roots deep in soil of mutual witness',
        'Your voice joins the chorus of healing hearts'
      ],
      clarity: [
        'Understanding dawns soft as morning light',
        'Clarity cuts through confusion with loving precision',
        'Truth settles like snow, quiet and illuminating'
      ],
      transformation: [
        'Metamorphosis moves through you like sacred water',
        'You are both the sculptor and the sculpture',
        'Change dances with your willingness to be new'
      ]
    };
    
    // Select primary theme phrase
    if (poetryTemplates[dominant as keyof typeof poetryTemplates]) {
      const templates = poetryTemplates[dominant as keyof typeof poetryTemplates];
      poeticPhrases.push(templates[Math.floor(Math.random() * templates.length)]);
    }
    
    // Add secondary theme if significant
    const secondary = Object.keys(patterns).filter(key => key !== dominant && patterns[key] > 2);
    if (secondary.length > 0) {
      const secondaryKey = secondary[0];
      if (poetryTemplates[secondaryKey as keyof typeof poetryTemplates]) {
        const templates = poetryTemplates[secondaryKey as keyof typeof poetryTemplates];
        poeticPhrases.push(templates[Math.floor(Math.random() * templates.length)]);
      }
    }
    
    // Add timeframe-specific phrase
    const timeframePhrases = {
      week: [
        'Seven days of sacred attention to your becoming',
        'A week of tending the garden of your inner landscape'
      ],
      month: [
        'A moon cycle of growth witnessed and honored',
        'Thirty days of showing up for your own healing'
      ],
      season: [
        'A season of profound becoming and reclamation',
        'Three months of writing your story with intention'
      ]
    };
    
    const timeframeTemplates = timeframePhrases[timeframe];
    poeticPhrases.push(timeframeTemplates[Math.floor(Math.random() * timeframeTemplates.length)]);
    
    return poeticPhrases;
  }
  
  // ===== EMOTIONAL TERRAIN MAPPING =====
  
  static calculateEmotionalTerrain(entries: MemoryGardenEntry[]): EmotionalTerrain {
    if (entries.length === 0) {
      return {
        resilience: 0.5,
        clarity: 0.5,
        selfCompassion: 0.5,
        connection: 0.5,
        culturalGrounding: 0.5,
        overallWellbeing: 0.5
      };
    }
    
    // Calculate averages from recent entries
    const recentEntries = entries.slice(-14); // Last 2 weeks
    
    const resilience = this.calculateResilienceScore(recentEntries);
    const clarity = recentEntries.reduce((sum, e) => sum + (e.energyLevel / 5), 0) / recentEntries.length;
    const selfCompassion = recentEntries.reduce((sum, e) => sum + (e.selfCompassion / 5), 0) / recentEntries.length;
    const connection = recentEntries.reduce((sum, e) => sum + (e.connectionFelt / 5), 0) / recentEntries.length;
    const culturalGrounding = this.calculateCulturalGrounding(recentEntries);
    
    const overallWellbeing = (resilience + clarity + selfCompassion + connection + culturalGrounding) / 5;
    
    return {
      resilience,
      clarity,
      selfCompassion,
      connection,
      culturalGrounding,
      overallWellbeing
    };
  }
  
  private static calculateResilienceScore(entries: MemoryGardenEntry[]): number {
    let resilienceScore = 0;
    
    entries.forEach(entry => {
      // Consistency adds to resilience
      if (entry.journalEntry) resilienceScore += 0.1;
      
      // Challenging days navigated add more
      if (entry.emotionalTone === 'challenging' && entry.badges.length > 0) {
        resilienceScore += 0.2;
      }
      
      // Self-compassion during difficulty
      if (entry.emotionalTone === 'challenging' && entry.selfCompassion >= 3) {
        resilienceScore += 0.15;
      }
      
      // Growth badges indicate resilience
      entry.badges.forEach(badge => {
        if (badge.category === 'resilience') resilienceScore += 0.1;
        if (badge.id === 'didnt-spiral') resilienceScore += 0.2;
      });
    });
    
    return Math.min(resilienceScore / entries.length, 1);
  }
  
  private static calculateCulturalGrounding(entries: MemoryGardenEntry[]): number {
    let culturalScore = 0;
    
    entries.forEach(entry => {
      if (entry.culturalWisdom) culturalScore += 0.2;
      
      entry.badges.forEach(badge => {
        if (badge.category === 'connection' || badge.id === 'culture-holder') {
          culturalScore += 0.15;
        }
      });
      
      if (entry.aiThemes.some(theme => theme.includes('ancestor') || theme.includes('culture'))) {
        culturalScore += 0.1;
      }
    });
    
    return Math.min(culturalScore / entries.length, 1);
  }
  
  // ===== STREAK ANALYTICS =====
  
  static calculateJournalingStreak(entries: MemoryGardenEntry[]): {
    currentStreak: number;
    longestStreak: number;
    weeklyPattern: number[];
    streakPhase: 'building' | 'flowing' | 'deepening' | 'mastering';
  } {
    const sortedEntries = entries.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current streak (working backwards from today)
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = sortedEntries.some(entry => 
        this.isSameDay(entry.date, checkDate) && entry.journalEntry
      );
      
      if (hasEntry) {
        if (i === 0) currentStreak++; // Start counting from today
        else if (currentStreak > 0) currentStreak++; // Continue streak
      } else {
        break; // Streak broken
      }
    }
    
    // Calculate longest streak
    sortedEntries.forEach((entry, index) => {
      if (entry.journalEntry) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    
    // Weekly pattern (last 7 days)
    const weeklyPattern: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = sortedEntries.some(entry => 
        this.isSameDay(entry.date, checkDate) && entry.journalEntry
      );
      
      weeklyPattern.push(hasEntry ? 1 : 0);
    }
    
    // Determine streak phase
    let streakPhase: 'building' | 'flowing' | 'deepening' | 'mastering' = 'building';
    if (currentStreak >= 21) streakPhase = 'mastering';
    else if (currentStreak >= 14) streakPhase = 'deepening';
    else if (currentStreak >= 7) streakPhase = 'flowing';
    
    return {
      currentStreak,
      longestStreak,
      weeklyPattern,
      streakPhase
    };
  }
  
  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  // ===== MOOD TIMELINE ANALYSIS =====
  
  static generateMoodTimeline(entries: MemoryGardenEntry[], days: number = 30): {
    date: Date;
    emoji: string;
    tone: string;
    poeticMoment?: string;
  }[] {
    const timeline = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const dayEntry = entries.find(entry => this.isSameDay(entry.date, checkDate));
      
      if (dayEntry) {
        timeline.push({
          date: checkDate,
          emoji: this.getToneEmoji(dayEntry.emotionalTone),
          tone: dayEntry.emotionalTone,
          poeticMoment: this.generatePoeticMoment(dayEntry)
        });
      } else {
        timeline.push({
          date: checkDate,
          emoji: '🌱', // Resting, potential
          tone: 'resting'
        });
      }
    }
    
    return timeline;
  }
  
  private static getToneEmoji(tone: string): string {
    const emojiMap = {
      challenging: '🌊', // Waves - navigating difficulty
      neutral: '🌿',     // Leaves - steady presence
      hopeful: '🌻',     // Sunflower - turning toward light
      mixed: '🌈',       // Rainbow - complexity and beauty
      celebrating: '✨', // Sparkles - joy and achievement
      resting: '🌱'      // Seedling - potential and rest
    };
    
    return emojiMap[tone as keyof typeof emojiMap] || '🌿';
  }
  
  private static generatePoeticMoment(entry: MemoryGardenEntry): string | undefined {
    if (entry.badges.length === 0) return undefined;
    
    const momentTemplates = [
      `Today you ${entry.badges[0].name.toLowerCase()}`,
      `A moment of ${entry.badges[0].category} bloomed`,
      `Your heart chose ${entry.badges[0].description.toLowerCase()}`,
      `Grace found you in ${entry.badges[0].category}`
    ];
    
    return momentTemplates[Math.floor(Math.random() * momentTemplates.length)];
  }
}

// ===== GROWTH PORTFOLIO GENERATOR =====

export interface GrowthPortfolio {
  userInfo: {
    name: string;
    culturalContext?: string;
    portfolioDateRange: {
      start: Date;
      end: Date;
    };
  };
  journeyHighlights: {
    totalDaysJournaled: number;
    longestStreak: number;
    badgesEarned: Badge[];
    aiThemes: string[];
    growthMoments: string[];
  };
  emotionalTerrain: EmotionalTerrain;
  poeticSummary: string;
  wisdomCollected: string[];
  futureIntentions: string[];
}

export class GrowthPortfolioGenerator {
  
  static createPortfolio(
    entries: MemoryGardenEntry[],
    userInfo: any,
    timeframe: 'month' | 'semester' | 'year' = 'semester'
  ): GrowthPortfolio {
    
    const dateRange = this.getDateRange(timeframe);
    const relevantEntries = entries.filter(entry => 
      entry.date >= dateRange.start && entry.date <= dateRange.end
    );
    
    const streakData = PoetryAnalytics.calculateJournalingStreak(relevantEntries);
    const emotionalTerrain = PoetryAnalytics.calculateEmotionalTerrain(relevantEntries);
    const aiThemes = PoetryAnalytics.generateAIThemes(relevantEntries, timeframe === 'month' ? 'month' : 'season');
    
    // Collect all unique badges
    const allBadges = relevantEntries.reduce((badges, entry) => {
      entry.badges.forEach(badge => {
        if (!badges.find(b => b.id === badge.id)) {
          badges.push(badge);
        }
      });
      return badges;
    }, [] as Badge[]);
    
    // Collect growth moments
    const growthMoments = relevantEntries
      .filter(entry => entry.growthMoments.length > 0)
      .flatMap(entry => entry.growthMoments)
      .slice(0, 10); // Top 10 moments
    
    // Generate poetic summary
    const poeticSummary = this.generatePortfolioSummary(
      relevantEntries.length,
      allBadges.length,
      streakData.longestStreak,
      emotionalTerrain
    );
    
    // Collect wisdom
    const wisdomCollected = relevantEntries
      .filter(entry => entry.culturalWisdom)
      .map(entry => entry.culturalWisdom!)
      .slice(0, 5);
    
    return {
      userInfo: {
        ...userInfo,
        portfolioDateRange: dateRange
      },
      journeyHighlights: {
        totalDaysJournaled: relevantEntries.filter(e => e.journalEntry).length,
        longestStreak: streakData.longestStreak,
        badgesEarned: allBadges,
        aiThemes,
        growthMoments
      },
      emotionalTerrain,
      poeticSummary,
      wisdomCollected,
      futureIntentions: [] // To be filled by user during portfolio creation
    };
  }
  
  private static getDateRange(timeframe: string): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();
    
    switch (timeframe) {
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'semester':
        start.setMonth(end.getMonth() - 4);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    return { start, end };
  }
  
  private static generatePortfolioSummary(
    daysJournaled: number,
    badgesEarned: number,
    longestStreak: number,
    terrain: EmotionalTerrain
  ): string {
    const summaryTemplates = [
      `In ${daysJournaled} days of sacred attention, you collected ${badgesEarned} badges of growth and maintained presence for ${longestStreak} consecutive days. Your emotional landscape shows the beauty of ${terrain.overallWellbeing > 0.7 ? 'flourishing' : terrain.overallWellbeing > 0.5 ? 'steady growth' : 'tender beginning'}.`,
      
      `Your journey of ${daysJournaled} days bears witness to profound becoming. Through ${badgesEarned} moments of recognition and ${longestStreak} days of unbroken commitment, you have cultivated a garden of ${terrain.overallWellbeing > 0.7 ? 'vibrant resilience' : terrain.overallWellbeing > 0.5 ? 'gentle strength' : 'emerging wisdom'}.`,
      
      `${daysJournaled} entries, ${badgesEarned} celebrations, ${longestStreak} days of showing up - your path illuminates the poetry of persistence. In your emotional terrain, ${terrain.resilience > 0.7 ? 'resilience blooms abundantly' : 'resilience grows with each passing day'}.`
    ];
    
    return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
  }
}

// ===== EXPORT UTILITIES =====

export {
  PoetryAnalytics,
  GrowthPortfolioGenerator
};