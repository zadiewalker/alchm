/**
 * ALCHM Community Healing Engine
 * Anonymous sharing circles, peer support matching, and collective wisdom library
 */

export interface AnonymousShare {
  id: string;
  content: string;
  emotionalThemes: string[];
  anonymizedMetadata: {
    ageRange: string;
    generalLocation: string;
    journeyStage: string;
    culturalBackground?: string[];
  };
  supportCount: number;
  resonanceLevel: number;
  healingTags: string[];
  timestamp: number;
  isModerated: boolean;
  safetyScore: number;
}

export interface SharingCircle {
  id: string;
  theme: string;
  description: string;
  participants: number;
  anonymousShares: AnonymousShare[];
  healingFocus: string[];
  culturallyInclusive: boolean;
  moderationLevel: 'light' | 'moderate' | 'high';
  circleType: 'open' | 'guided' | 'peer-matched';
}

export interface PeerMatch {
  matchId: string;
  similarity: number;
  sharedThemes: string[];
  complementaryStrengths: string[];
  supportStyle: string;
  culturalAlignment: number;
  healingStage: string;
  connectionType: 'journey-similar' | 'strength-complementary' | 'cultural-resonant';
  privacyLevel: 'full-anonymous' | 'pseudonymous' | 'opt-in-reveal';
}

export interface CollectiveWisdom {
  id: string;
  wisdomType: 'pattern-insight' | 'healing-practice' | 'cultural-wisdom' | 'peer-support';
  title: string;
  content: string;
  source: 'community-derived' | 'culturally-informed' | 'therapeutically-validated';
  resonanceScore: number;
  culturalContexts: string[];
  applicableThemes: string[];
  evidenceBase: {
    communityValidated: boolean;
    professionallyReviewed: boolean;
    culturallyVerified: boolean;
  };
  anonymizedContributions: number;
}

export interface CommunityHealingRequest {
  userId: string;
  journalContent?: string;
  emotionalState?: string;
  culturalContext?: string[];
  seekingSupport: boolean;
  willingToSupport: boolean;
  privacyPreferences: {
    anonymityLevel: 'full' | 'pseudonymous' | 'opt-in';
    sharingComfort: 'observer' | 'occasional' | 'active';
    culturalSharing: boolean;
  };
}

export class CommunityHealingEngine {
  private sharingCircles: Map<string, SharingCircle> = new Map();
  private anonymousShares: Map<string, AnonymousShare> = new Map();
  private collectiveWisdom: Map<string, CollectiveWisdom> = new Map();
  private userProfiles: Map<string, {
    anonymousId: string;
    healingThemes: string[];
    culturalContext: string[];
    supportStyle: string;
    journeyStage: string;
  }> = new Map();

  constructor() {
    this.initializeCommunityFeatures();
    console.log('🌍 Community Healing Engine initialized with privacy-first approach');
  }

  private initializeCommunityFeatures(): void {
    // Create foundational sharing circles
    this.createSharingCircle({
      id: 'healing-journeys',
      theme: 'Healing Journeys',
      description: 'Anonymous space for sharing breakthroughs, setbacks, and growth',
      healingFocus: ['personal growth', 'trauma recovery', 'emotional wellness'],
      circleType: 'open',
      culturallyInclusive: true,
      moderationLevel: 'moderate'
    });

    this.createSharingCircle({
      id: 'cultural-healing',
      theme: 'Cultural Healing Wisdom',
      description: 'Sharing healing practices from diverse cultural traditions',
      healingFocus: ['cultural practices', 'traditional wisdom', 'community healing'],
      circleType: 'guided',
      culturallyInclusive: true,
      moderationLevel: 'high'
    });

    this.createSharingCircle({
      id: 'peer-support',
      theme: 'Peer Support Circle',
      description: 'Matched peers offering mutual support and understanding',
      healingFocus: ['peer support', 'mutual aid', 'shared experiences'],
      circleType: 'peer-matched',
      culturallyInclusive: true,
      moderationLevel: 'light'
    });

    // Initialize collective wisdom library
    this.seedCollectiveWisdom();
  }

  private createSharingCircle(config: Partial<SharingCircle> & { id: string }): void {
    const circle: SharingCircle = {
      theme: '',
      description: '',
      participants: 0,
      anonymousShares: [],
      healingFocus: [],
      culturallyInclusive: false,
      moderationLevel: 'moderate',
      circleType: 'open',
      ...config
    };

    this.sharingCircles.set(config.id, circle);
  }

  private seedCollectiveWisdom(): void {
    const initialWisdom: Partial<CollectiveWisdom>[] = [
      {
        id: 'breathing-across-cultures',
        wisdomType: 'healing-practice',
        title: 'Breathing Practices Across Cultures',
        content: 'Communities worldwide have discovered the healing power of conscious breathing - from pranayama in yoga to circular breathing in Indigenous traditions.',
        source: 'culturally-informed',
        culturalContexts: ['universal', 'indigenous', 'eastern', 'western'],
        applicableThemes: ['anxiety', 'grounding', 'emotional regulation'],
        evidenceBase: {
          communityValidated: true,
          professionallyReviewed: true,
          culturallyVerified: true
        }
      },
      {
        id: 'community-as-medicine',
        wisdomType: 'cultural-wisdom',
        title: 'Community as Medicine',
        content: 'Ubuntu philosophy teaches us that healing happens in relationship. Many cultures recognize that individual healing contributes to collective healing.',
        source: 'culturally-informed',
        culturalContexts: ['african', 'indigenous', 'collective-cultures'],
        applicableThemes: ['isolation', 'depression', 'trauma'],
        evidenceBase: {
          communityValidated: true,
          professionallyReviewed: false,
          culturallyVerified: true
        }
      }
    ];

    initialWisdom.forEach(wisdom => {
      const fullWisdom: CollectiveWisdom = {
        resonanceScore: 0.8,
        anonymizedContributions: 0,
        ...wisdom as CollectiveWisdom
      };
      this.collectiveWisdom.set(wisdom.id!, fullWisdom);
    });
  }

  /**
   * Create an anonymous share with privacy protection
   */
  public createAnonymousShare(
    content: string,
    userId: string,
    emotionalThemes: string[],
    culturalContext?: string[]
  ): AnonymousShare {
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Anonymize metadata
    const anonymizedMetadata = this.anonymizeUserData(userId, culturalContext);
    
    // Calculate safety score
    const safetyScore = this.calculateSafetyScore(content);
    
    // Generate healing tags
    const healingTags = this.generateHealingTags(content, emotionalThemes);

    const anonymousShare: AnonymousShare = {
      id: shareId,
      content: this.sanitizeContent(content),
      emotionalThemes,
      anonymizedMetadata,
      supportCount: 0,
      resonanceLevel: 0,
      healingTags,
      timestamp: Date.now(),
      isModerated: safetyScore < 0.8, // Moderate if safety concerns
      safetyScore
    };

    this.anonymousShares.set(shareId, anonymousShare);
    console.log(`🌍 Created anonymous share with safety score: ${safetyScore.toFixed(2)}`);

    return anonymousShare;
  }

  private anonymizeUserData(
    userId: string, 
    culturalContext?: string[]
  ): AnonymousShare['anonymizedMetadata'] {
    // Generate consistent but anonymous metadata
    const hashBase = this.simpleHash(userId);
    
    const ageRanges = ['18-25', '26-35', '36-45', '46-55', '55+'];
    const locations = ['Urban', 'Suburban', 'Rural', 'International'];
    const journeyStages = ['Beginning', 'Exploring', 'Growing', 'Integrating', 'Supporting Others'];

    return {
      ageRange: ageRanges[hashBase % ageRanges.length],
      generalLocation: locations[(hashBase + 1) % locations.length],
      journeyStage: journeyStages[(hashBase + 2) % journeyStages.length],
      culturalBackground: culturalContext?.length ? ['diverse'] : undefined
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateSafetyScore(content: string): number {
    const lowerContent = content.toLowerCase();
    let safetyScore = 1.0;

    // Crisis indicators reduce safety score
    const crisisIndicators = [
      'hurt myself', 'end it all', 'can\'t go on', 'suicide', 'self-harm',
      'kill myself', 'better off dead', 'no point', 'give up'
    ];

    crisisIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) {
        safetyScore -= 0.3;
      }
    });

    // Substance abuse concerns
    const substanceIndicators = ['drinking too much', 'using drugs', 'can\'t stop drinking'];
    substanceIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) {
        safetyScore -= 0.2;
      }
    });

    // Positive indicators boost safety score
    const positiveIndicators = ['grateful', 'healing', 'growing', 'learning', 'support'];
    positiveIndicators.forEach(indicator => {
      if (lowerContent.includes(indicator)) {
        safetyScore += 0.1;
      }
    });

    return Math.max(0, Math.min(1, safetyScore));
  }

  private sanitizeContent(content: string): string {
    // Remove potential identifying information
    return content
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]')
      .replace(/\b(?:Dr\.|Doctor|Therapist)\s+[A-Z][a-z]+\b/g, '[healthcare provider]');
  }

  private generateHealingTags(content: string, emotionalThemes: string[]): string[] {
    const lowerContent = content.toLowerCase();
    const tags: string[] = [...emotionalThemes];

    // Journey stage tags
    if (lowerContent.includes('beginning') || lowerContent.includes('start')) {
      tags.push('beginning-journey');
    }
    if (lowerContent.includes('breakthrough') || lowerContent.includes('realization')) {
      tags.push('breakthrough');
    }
    if (lowerContent.includes('setback') || lowerContent.includes('struggle')) {
      tags.push('setback');
    }

    // Support type tags
    if (lowerContent.includes('advice') || lowerContent.includes('help')) {
      tags.push('seeking-guidance');
    }
    if (lowerContent.includes('learned') || lowerContent.includes('insight')) {
      tags.push('sharing-wisdom');
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Find peer matches for support
   */
  public findPeerMatches(
    userId: string,
    userThemes: string[],
    culturalContext?: string[],
    seekingType: 'similar' | 'complementary' | 'cultural' = 'similar'
  ): PeerMatch[] {
    const matches: PeerMatch[] = [];
    const userProfile = this.userProfiles.get(userId);

    this.userProfiles.forEach((profile, otherUserId) => {
      if (otherUserId === userId) return;

      const similarity = this.calculateSimilarity(userThemes, profile.healingThemes);
      const culturalAlignment = this.calculateCulturalAlignment(
        culturalContext || [],
        profile.culturalContext
      );

      if (similarity > 0.3 || culturalAlignment > 0.5) {
        const match: PeerMatch = {
          matchId: `match_${userId}_${otherUserId}_${Date.now()}`,
          similarity,
          sharedThemes: this.findSharedThemes(userThemes, profile.healingThemes),
          complementaryStrengths: this.findComplementaryStrengths(userProfile, profile),
          supportStyle: profile.supportStyle,
          culturalAlignment,
          healingStage: profile.journeyStage,
          connectionType: this.determineConnectionType(similarity, culturalAlignment, seekingType),
          privacyLevel: 'full-anonymous'
        };

        matches.push(match);
      }
    });

    return matches.sort((a, b) => {
      // Sort by similarity and cultural alignment
      const aScore = (a.similarity * 0.6) + (a.culturalAlignment * 0.4);
      const bScore = (b.similarity * 0.6) + (b.culturalAlignment * 0.4);
      return bScore - aScore;
    }).slice(0, 5); // Return top 5 matches
  }

  private calculateSimilarity(themes1: string[], themes2: string[]): number {
    if (themes1.length === 0 || themes2.length === 0) return 0;

    const intersection = themes1.filter(theme => themes2.includes(theme));
    const union = [...new Set([...themes1, ...themes2])];

    return intersection.length / union.length;
  }

  private calculateCulturalAlignment(context1: string[], context2: string[]): number {
    if (context1.length === 0 || context2.length === 0) return 0.5; // Neutral if no context

    const intersection = context1.filter(ctx => context2.includes(ctx));
    const maxLength = Math.max(context1.length, context2.length);

    return intersection.length / maxLength;
  }

  private findSharedThemes(themes1: string[], themes2: string[]): string[] {
    return themes1.filter(theme => themes2.includes(theme));
  }

  private findComplementaryStrengths(
    profile1: any,
    profile2: any
  ): string[] {
    // This is a simplified version - in practice, would use more sophisticated matching
    const strengths: string[] = [];

    if (profile1?.journeyStage === 'Beginning' && profile2?.journeyStage === 'Supporting Others') {
      strengths.push('mentorship opportunity');
    }
    
    if (profile1?.supportStyle === 'analytical' && profile2?.supportStyle === 'empathetic') {
      strengths.push('balanced perspectives');
    }

    return strengths;
  }

  private determineConnectionType(
    similarity: number,
    culturalAlignment: number,
    seekingType: string
  ): PeerMatch['connectionType'] {
    if (culturalAlignment > 0.7) return 'cultural-resonant';
    if (similarity > 0.6) return 'journey-similar';
    return 'strength-complementary';
  }

  /**
   * Get collective wisdom based on user themes
   */
  public getRelevantWisdom(
    themes: string[],
    culturalContext?: string[]
  ): CollectiveWisdom[] {
    const relevantWisdom: CollectiveWisdom[] = [];

    this.collectiveWisdom.forEach(wisdom => {
      let relevanceScore = 0;

      // Check theme alignment
      const themeIntersection = themes.filter(theme => 
        wisdom.applicableThemes.some(wTheme => 
          wTheme.toLowerCase().includes(theme.toLowerCase()) ||
          theme.toLowerCase().includes(wTheme.toLowerCase())
        )
      );
      relevanceScore += themeIntersection.length * 0.3;

      // Check cultural alignment
      if (culturalContext) {
        const culturalIntersection = culturalContext.filter(context =>
          wisdom.culturalContexts.some(wContext =>
            wContext.toLowerCase().includes(context.toLowerCase()) ||
            context.toLowerCase().includes(wContext.toLowerCase())
          )
        );
        relevanceScore += culturalIntersection.length * 0.2;
      }

      // Include universal wisdom
      if (wisdom.culturalContexts.includes('universal')) {
        relevanceScore += 0.1;
      }

      if (relevanceScore > 0.2) {
        relevantWisdom.push(wisdom);
      }
    });

    return relevantWisdom.sort((a, b) => b.resonanceScore - a.resonanceScore);
  }

  /**
   * Get sharing circles relevant to user
   */
  public getRelevantSharingCircles(themes: string[]): SharingCircle[] {
    const relevantCircles: SharingCircle[] = [];

    this.sharingCircles.forEach(circle => {
      const themeOverlap = circle.healingFocus.some(focus =>
        themes.some(theme => 
          focus.toLowerCase().includes(theme.toLowerCase()) ||
          theme.toLowerCase().includes(focus.toLowerCase())
        )
      );

      if (themeOverlap || circle.circleType === 'open') {
        relevantCircles.push(circle);
      }
    });

    return relevantCircles;
  }

  /**
   * Add anonymous share to a circle
   */
  public addShareToCircle(shareId: string, circleId: string): boolean {
    const share = this.anonymousShares.get(shareId);
    const circle = this.sharingCircles.get(circleId);

    if (!share || !circle) return false;

    if (share.safetyScore > 0.6) {
      circle.anonymousShares.push(share);
      circle.participants += 1;
      return true;
    }

    return false;
  }

  /**
   * Express support for an anonymous share
   */
  public expressSupport(shareId: string, supportType: 'resonance' | 'support' | 'wisdom'): boolean {
    const share = this.anonymousShares.get(shareId);
    if (!share) return false;

    share.supportCount += 1;
    
    if (supportType === 'resonance') {
      share.resonanceLevel += 0.1;
    }

    return true;
  }

  /**
   * Contribute to collective wisdom
   */
  public contributeWisdom(
    title: string,
    content: string,
    wisdomType: CollectiveWisdom['wisdomType'],
    applicableThemes: string[],
    culturalContexts: string[] = []
  ): string {
    const wisdomId = `wisdom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const wisdom: CollectiveWisdom = {
      id: wisdomId,
      wisdomType,
      title,
      content: this.sanitizeContent(content),
      source: 'community-derived',
      resonanceScore: 0,
      culturalContexts: culturalContexts.length > 0 ? culturalContexts : ['universal'],
      applicableThemes,
      evidenceBase: {
        communityValidated: false,
        professionallyReviewed: false,
        culturallyVerified: false
      },
      anonymizedContributions: 1
    };

    this.collectiveWisdom.set(wisdomId, wisdom);
    console.log(`🌍 New wisdom contribution added: "${title}"`);
    
    return wisdomId;
  }

  /**
   * Update user profile for matching
   */
  public updateUserProfile(
    userId: string,
    healingThemes: string[],
    culturalContext: string[],
    supportStyle: string,
    journeyStage: string
  ): void {
    const anonymousId = `anon_${this.simpleHash(userId)}`;
    
    this.userProfiles.set(userId, {
      anonymousId,
      healingThemes,
      culturalContext,
      supportStyle,
      journeyStage
    });
  }

  /**
   * Get community healing dashboard data
   */
  public getCommunityDashboard(): {
    totalShares: number;
    activeCircles: number;
    wisdomLibrarySize: number;
    supportInteractions: number;
    diversityMetrics: {
      culturalRepresentation: number;
      themeVariety: number;
    };
  } {
    const totalShares = this.anonymousShares.size;
    const activeCircles = this.sharingCircles.size;
    const wisdomLibrarySize = this.collectiveWisdom.size;
    
    const supportInteractions = Array.from(this.anonymousShares.values())
      .reduce((total, share) => total + share.supportCount, 0);

    // Calculate diversity metrics
    const allCultures = new Set<string>();
    const allThemes = new Set<string>();

    this.userProfiles.forEach(profile => {
      profile.culturalContext.forEach(ctx => allCultures.add(ctx));
      profile.healingThemes.forEach(theme => allThemes.add(theme));
    });

    return {
      totalShares,
      activeCircles,
      wisdomLibrarySize,
      supportInteractions,
      diversityMetrics: {
        culturalRepresentation: allCultures.size,
        themeVariety: allThemes.size
      }
    };
  }

  /**
   * Get user's anonymous shares (for their own viewing)
   */
  public getUserShares(userId: string): AnonymousShare[] {
    // In a real implementation, this would use a mapping from userId to shareIds
    // For now, return empty array as shares are fully anonymous
    return [];
  }
}

export const communityHealingEngine = new CommunityHealingEngine();