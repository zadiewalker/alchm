/**
 * ALCHM Anonymous Community Challenge System
 * Building connection without competition or identity exposure
 */

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'healing' | 'growth' | 'gratitude' | 'courage' | 'kindness' | 'wisdom';
  duration: ChallengeDuration;
  participantCount: number;
  maxParticipants?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  anonymousSubmissions: AnonymousSubmission[];
  collectiveProgress: CollectiveProgress;
  challengeType: 'reflection' | 'action' | 'intention' | 'celebration';
  communityRitual?: CommunityRitual;
}

export interface ChallengeDuration {
  type: 'single_day' | 'three_days' | 'week' | 'ongoing';
  label: string;
  durationHours: number;
}

export interface AnonymousSubmission {
  id: string;
  submittedAt: Date;
  content: string;
  mood?: string;
  supportVotes: number;
  resonanceScore: number; // How much others found it meaningful
  isHighlighted: boolean; // Community moderation for sharing
  tags: string[];
  wordCount: number;
}

export interface CollectiveProgress {
  totalSubmissions: number;
  uniqueParticipants: number;
  averageWordCount: number;
  moodDistribution: Record<string, number>;
  resonantThemes: string[];
  energyLevel: 'growing' | 'flowing' | 'thriving' | 'transforming';
}

export interface CommunityRitual {
  type: 'collective_intention' | 'shared_gratitude' | 'wisdom_circle' | 'healing_presence';
  description: string;
  instruction: string;
  scheduledFor?: Date;
  participantLimit?: number;
}

export interface ParticipationRecord {
  userId: string;
  challengeId: string;
  joinedAt: Date;
  submissionId?: string;
  hasVoted: string[]; // IDs of submissions they've supported
  completedAt?: Date;
  personalReflection?: string;
}

export class CommunityChallengEngine {
  private static readonly DAILY_CHALLENGES = 1; // Never overwhelming
  private static readonly MAX_PARTICIPANTS = 100; // Intimate community size
  private static readonly VOTING_COOLDOWN = 24; // Hours between votes
  
  /**
   * Generate healing-focused community challenges
   */
  static generateDailyChallenges(
    season: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring'
  ): CommunityChallenge[] {
    const challengeTemplates = this.getChallengeTemplates(season);
    const today = new Date();
    
    return challengeTemplates.slice(0, this.DAILY_CHALLENGES).map(template => ({
      ...template,
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: template.title || 'Community Challenge',
      description: template.description || 'A healing community challenge',
      prompt: template.prompt || 'Reflect on your journey',
      category: template.category || 'healing',
      duration: template.duration || { type: 'single_day', label: '24 hours', durationHours: 24 },
      challengeType: template.challengeType || 'reflection',
      startDate: today,
      endDate: new Date(today.getTime() + (template.duration?.durationHours || 24) * 60 * 60 * 1000),
      isActive: true,
      participantCount: 0,
      maxParticipants: template.maxParticipants,
      anonymousSubmissions: [],
      collectiveProgress: this.initializeProgress(),
      communityRitual: template.communityRitual
    } as CommunityChallenge));
  }
  
  /**
   * Join a challenge anonymously
   */
  static joinChallenge(
    challengeId: string,
    userId: string
  ): {
    success: boolean;
    message: string;
    welcomeMessage?: string;
  } {
    // In real implementation, this would check database constraints
    return {
      success: true,
      message: "Welcome to the circle",
      welcomeMessage: "You're part of something beautiful. Your voice matters here, even in its anonymity."
    };
  }
  
  /**
   * Submit anonymous reflection to challenge
   */
  static submitAnonymousReflection(
    challengeId: string,
    content: string,
    mood?: string,
    tags: string[] = []
  ): {
    success: boolean;
    submission?: AnonymousSubmission;
    communityMessage: string;
  } {
    if (content.trim().length < 10) {
      return {
        success: false,
        communityMessage: "Your voice is valued. Share what feels authentic, however brief."
      };
    }
    
    const submission: AnonymousSubmission = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date(),
      content: content.trim(),
      mood,
      supportVotes: 0,
      resonanceScore: 0,
      isHighlighted: false,
      tags: [...tags, ...this.extractThemes(content)],
      wordCount: content.trim().split(/\s+/).length
    };
    
    return {
      success: true,
      submission,
      communityMessage: this.generateSubmissionMessage()
    };
  }
  
  /**
   * Support another anonymous submission (not "like" - "support")
   */
  static supportSubmission(
    submissionId: string,
    userId: string,
    supportType: 'resonance' | 'courage' | 'wisdom' | 'healing' = 'resonance'
  ): {
    success: boolean;
    message: string;
  } {
    // Anti-competition mechanics - no visible numbers
    const supportMessages = {
      resonance: "Your resonance has been felt.",
      courage: "Your recognition of courage matters.",
      wisdom: "Wisdom recognized is wisdom amplified.",
      healing: "Your acknowledgment of healing is healing itself."
    };
    
    return {
      success: true,
      message: supportMessages[supportType]
    };
  }
  
  /**
   * Get anonymized community submissions for a challenge
   */
  static getCommunitySubmissions(
    challengeId: string,
    viewerUserId?: string
  ): {
    submissions: AnonymousSubmission[];
    collectiveInsight: string;
    communityEnergy: string;
  } {
    // This would fetch real data from database
    const submissions: AnonymousSubmission[] = [];
    
    return {
      submissions,
      collectiveInsight: this.generateCollectiveInsight(submissions),
      communityEnergy: this.assessCommunityEnergy(submissions)
    };
  }
  
  /**
   * Generate collective wisdom from anonymous submissions
   */
  static generateCollectiveWisdom(
    submissions: AnonymousSubmission[]
  ): {
    resonantThemes: string[];
    sharedInsights: string[];
    communityGrowth: string;
    celebrationMessage: string;
  } {
    const themes = this.identifyResonantThemes(submissions);
    const insights = this.extractSharedInsights(submissions);
    
    return {
      resonantThemes: themes,
      sharedInsights: insights,
      communityGrowth: this.describeCommunityGrowth(submissions),
      celebrationMessage: this.generateCelebrationMessage(submissions.length)
    };
  }
  
  /**
   * Complete challenge and receive community wisdom
   */
  static completeChallenge(
    challengeId: string,
    userId: string,
    personalReflection?: string
  ): {
    success: boolean;
    personalCelebration: string;
    communityWisdom: string;
    nextChallengeSuggestion?: string;
  } {
    return {
      success: true,
      personalCelebration: "You showed up. You shared. You grew. This is sacred work.",
      communityWisdom: "Together, we're weaving a tapestry of healing. Every thread matters.",
      nextChallengeSuggestion: this.suggestNextChallenge(personalReflection)
    };
  }
  
  // Private helper methods
  private static getChallengeTemplates(season: string): Partial<CommunityChallenge>[] {
    const baseTemplates = [
      // Healing-focused challenges
      {
        title: "Three Breaths of Gratitude",
        description: "Share something you're grateful for, however small",
        prompt: "Take three deep breaths. What feels worth appreciating right now?",
        category: 'gratitude' as const,
        duration: { type: 'single_day' as const, label: '24 hours', durationHours: 24 },
        challengeType: 'reflection' as const,
        maxParticipants: 50
      },
      {
        title: "Moments of Courage",
        description: "Acknowledge the small acts of bravery in your day",
        prompt: "What's one moment today when you chose courage over comfort, however quietly?",
        category: 'courage' as const,
        duration: { type: 'single_day' as const, label: '24 hours', durationHours: 24 },
        challengeType: 'reflection' as const,
        maxParticipants: 30
      },
      {
        title: "Letters to Your Younger Self",
        description: "What would you tell the version of you that needed to hear it most?",
        prompt: "Write a gentle message to yourself at a time when you needed kindness most.",
        category: 'healing' as const,
        duration: { type: 'three_days' as const, label: '3 days', durationHours: 72 },
        challengeType: 'reflection' as const,
        maxParticipants: 25
      },
      {
        title: "Boundary Celebrations",
        description: "Honor the boundaries you've set, however small",
        prompt: "What boundary have you set recently that you can celebrate?",
        category: 'growth' as const,
        duration: { type: 'single_day' as const, label: '24 hours', durationHours: 24 },
        challengeType: 'reflection' as const
      },
      {
        title: "Unexpected Kindness",
        description: "Share about receiving or giving unexpected kindness",
        prompt: "When did kindness surprise you recently - either given or received?",
        category: 'kindness' as const,
        duration: { type: 'single_day' as const, label: '24 hours', durationHours: 24 },
        challengeType: 'reflection' as const
      },
      {
        title: "Growing Edge Acknowledgment",
        description: "What's asking for your attention and growth right now?",
        prompt: "What feels tender and growing in you right now? No need to have answers.",
        category: 'growth' as const,
        duration: { type: 'three_days' as const, label: '3 days', durationHours: 72 },
        challengeType: 'reflection' as const,
        maxParticipants: 40
      }
    ];
    
    // Seasonal variations could be added here
    return baseTemplates;
  }
  
  private static initializeProgress(): CollectiveProgress {
    return {
      totalSubmissions: 0,
      uniqueParticipants: 0,
      averageWordCount: 0,
      moodDistribution: {},
      resonantThemes: [],
      energyLevel: 'growing'
    };
  }
  
  private static extractThemes(content: string): string[] {
    // Simple theme extraction - in reality would use more sophisticated NLP
    const themes: string[] = [];
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('gratitude') || lowerContent.includes('grateful') || lowerContent.includes('thankful')) {
      themes.push('gratitude');
    }
    if (lowerContent.includes('courage') || lowerContent.includes('brave') || lowerContent.includes('fear')) {
      themes.push('courage');
    }
    if (lowerContent.includes('growth') || lowerContent.includes('learn') || lowerContent.includes('change')) {
      themes.push('growth');
    }
    if (lowerContent.includes('heal') || lowerContent.includes('recovery') || lowerContent.includes('better')) {
      themes.push('healing');
    }
    if (lowerContent.includes('kind') || lowerContent.includes('compassion') || lowerContent.includes('gentle')) {
      themes.push('kindness');
    }
    
    return themes;
  }
  
  private static generateSubmissionMessage(): string {
    const messages = [
      "Your truth has been witnessed. Thank you for sharing.",
      "Anonymous but not alone - your voice adds to our collective healing.",
      "What you've shared matters. The community holds your words with care.",
      "In sharing anonymously, you've given a gift to all who read your words.",
      "Your reflection joins the river of collective wisdom.",
      "Seen without being exposed, heard without judgment. Thank you."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)] || "Your voice matters.";
  }
  
  private static generateCollectiveInsight(submissions: AnonymousSubmission[]): string {
    if (submissions.length === 0) return "Waiting for the first brave soul to begin...";
    
    const insights = [
      `${submissions.length} souls have shared their truth here.`,
      "Patterns of healing emerge when we witness each other's stories.",
      "The diversity of experience creates a tapestry of wisdom.",
      "Each anonymous voice contributes to our collective understanding.",
      "In sharing without identity, we find our shared humanity."
    ];
    
    return insights[Math.floor(Math.random() * insights.length)] || "Community wisdom emerges.";
  }
  
  private static assessCommunityEnergy(submissions: AnonymousSubmission[]): string {
    if (submissions.length === 0) return "Potential energy waiting to unfold";
    if (submissions.length < 5) return "Seeds of community beginning to sprout";
    if (submissions.length < 15) return "Community energy is building and flowing";
    if (submissions.length < 30) return "Vibrant community energy in full bloom";
    return "Transformational community energy - something beautiful is happening";
  }
  
  private static identifyResonantThemes(submissions: AnonymousSubmission[]): string[] {
    // Aggregate themes from all submissions
    const themeCount: Record<string, number> = {};
    
    submissions.forEach(submission => {
      submission.tags.forEach(tag => {
        themeCount[tag] = (themeCount[tag] || 0) + 1;
      });
    });
    
    return Object.entries(themeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);
  }
  
  private static extractSharedInsights(submissions: AnonymousSubmission[]): string[] {
    // This would use more sophisticated analysis in practice
    return [
      "Many find courage in small moments rather than grand gestures.",
      "Gratitude often emerges from unexpected places.",
      "Healing isn't linear - it's a spiral of returning and growing.",
      "Kindness to oneself enables kindness to others.",
      "Growth happens in the space between comfort and overwhelm."
    ].slice(0, Math.min(3, Math.ceil(submissions.length / 5)));
  }
  
  private static describeCommunityGrowth(submissions: AnonymousSubmission[]): string {
    return "This community is learning to hold space for authenticity without judgment. Each anonymous share contributes to collective healing.";
  }
  
  private static generateCelebrationMessage(participantCount: number): string {
    if (participantCount === 0) return "Every beginning starts with one person's courage.";
    if (participantCount === 1) return "The first voice has spoken. Others will follow.";
    if (participantCount < 5) return `${participantCount} brave souls have begun this journey together.`;
    if (participantCount < 10) return `${participantCount} voices creating harmony in diversity.`;
    return `${participantCount} people proving that healing happens in community.`;
  }
  
  private static suggestNextChallenge(personalReflection?: string): string {
    if (!personalReflection) return "Follow what feels most alive in your next reflection.";
    
    // Simple suggestion logic based on reflection content
    const lower = personalReflection.toLowerCase();
    if (lower.includes('grateful') || lower.includes('appreciate')) {
      return "Consider exploring what you're learning to appreciate about yourself.";
    }
    if (lower.includes('difficult') || lower.includes('hard') || lower.includes('struggle')) {
      return "Perhaps reflect on the strength you've shown in difficult moments.";
    }
    if (lower.includes('grow') || lower.includes('learn')) {
      return "Maybe explore what growth feels like in your body right now.";
    }
    
    return "Trust what's emerging and follow that thread in your next reflection.";
  }
}