/**
 * Professional Resource Matching System
 * 
 * This system matches users with appropriate mental health professionals and resources
 * based on their specific needs, location, insurance, and other factors while maintaining
 * ALCHM's commitment to user autonomy and privacy.
 */

interface ProfessionalProvider {
  id: string;
  type: 'therapist' | 'psychiatrist' | 'psychologist' | 'counselor' | 'social_worker' | 'crisis_center' | 'clinic';
  name: string;
  credentials: {
    license: string;
    licenseNumber: string;
    licenseState: string;
    certifications: string[];
    yearsOfPractice: number;
  };
  specialties: {
    primary: string[];
    secondary: string[];
    traumaInformed: boolean;
    culturalCompetencies: string[];
    ageGroups: ('child' | 'adolescent' | 'adult' | 'elderly')[];
    approaches: string[]; // CBT, DBT, EMDR, etc.
  };
  availability: {
    acceptingNewClients: boolean;
    waitTimeWeeks: number;
    emergencyAvailable: boolean;
    schedulingMethods: string[];
    languages: string[];
  };
  location: {
    address?: string;
    city: string;
    state: string;
    zipCode?: string;
    coordinates?: { lat: number; lng: number };
    telehealth: boolean;
    inPerson: boolean;
    maxTravelDistance?: number;
  };
  insurance: {
    accepted: string[];
    selfPayRates: {
      individual: number;
      couples?: number;
      family?: number;
    };
    slidingScale: boolean;
    proBonoSlots: number;
  };
  ratings: {
    overallRating: number;
    totalReviews: number;
    culturalSensitivity: number;
    responsiveness: number;
    effectiveness: number;
  };
  integration: {
    alchmsPartner: boolean;
    ehrsSupported: string[];
    dataSharing: boolean;
    crisisProtocols: boolean;
  };
  lastUpdated: Date;
}

interface UserNeedsProfile {
  userId: string;
  preferences: {
    providerType: ProfessionalProvider['type'][];
    genderPreference?: 'male' | 'female' | 'non_binary' | 'no_preference';
    ageRangePreference?: 'younger' | 'peer' | 'older' | 'no_preference';
    culturalBackground?: string[];
    religiousConsiderations?: string[];
    lgbtqAffirming?: boolean;
    traumaInformed: boolean;
  };
  clinicalNeeds: {
    primaryConcerns: string[];
    severityLevel: 'mild' | 'moderate' | 'severe';
    urgency: 'routine' | 'urgent' | 'crisis';
    previousTherapy: boolean;
    medicationManagement: boolean;
    groupTherapyInterest: boolean;
  };
  practicalConstraints: {
    maxDistance: number;
    transportationMethod: 'drive' | 'public_transit' | 'telehealth_only';
    sessionTiming: 'morning' | 'afternoon' | 'evening' | 'flexible';
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'as_needed';
  };
  financialSituation: {
    hasInsurance: boolean;
    insurancePlan?: string;
    maxSelfPayRate?: number;
    needsSlidingScale: boolean;
    studentStatus?: boolean;
  };
  location: {
    zipCode?: string;
    city?: string;
    state: string;
    coordinates?: { lat: number; lng: number };
  };
}

interface MatchingScore {
  providerId: string;
  overallScore: number;
  categoryScores: {
    clinical: number;
    practical: number;
    cultural: number;
    financial: number;
    availability: number;
  };
  strengths: string[];
  considerations: string[];
  estimatedWaitTime: number;
  matchConfidence: 'high' | 'medium' | 'low';
}

interface ResourceRecommendation {
  provider: ProfessionalProvider;
  matchScore: MatchingScore;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
    bookingLink?: string;
    intakeForm?: string;
  };
  nextSteps: string[];
  alchmsIntegration?: {
    available: boolean;
    benefits: string[];
    setupProcess: string[];
  };
}

export class ProfessionalResourceMatcher {
  private static readonly WEIGHTING_FACTORS = {
    clinical: 0.35,      // Clinical specialties and approaches
    practical: 0.25,     // Location, availability, scheduling
    cultural: 0.20,      // Cultural competency and preferences
    financial: 0.15,     // Insurance, cost, sliding scale
    availability: 0.05   // Current openings and wait times
  };

  /**
   * Find matching mental health professionals based on user needs
   */
  public static async findMatchingProviders(
    userProfile: UserNeedsProfile,
    maxResults: number = 10
  ): Promise<ResourceRecommendation[]> {
    
    try {
      // Get potential providers based on basic filters
      const candidates = await this.getProviderCandidates(userProfile);
      
      // Score each provider against user needs
      const scoredMatches = await Promise.all(
        candidates.map(async (provider) => {
          const matchScore = this.calculateMatchScore(provider, userProfile);
          return { provider, matchScore };
        })
      );

      // Sort by overall score and filter top matches
      const topMatches = scoredMatches
        .sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore)
        .slice(0, maxResults);

      // Convert to recommendations with detailed information
      const recommendations = await Promise.all(
        topMatches.map(async (match) => {
          return await this.createRecommendation(match.provider, match.matchScore, userProfile);
        })
      );

      return recommendations;

    } catch (error) {
      console.error('Error finding matching providers:', error);
      return [];
    }
  }

  /**
   * Get crisis-specific resources for immediate needs
   */
  public static async findCrisisResources(
    userProfile: UserNeedsProfile
  ): Promise<ResourceRecommendation[]> {
    
    const crisisProviders = await this.getProviderCandidates({
      ...userProfile,
      clinicalNeeds: {
        ...userProfile.clinicalNeeds,
        urgency: 'crisis',
        severityLevel: 'severe'
      }
    });

    // Filter for crisis-capable providers
    const crisisCapable = crisisProviders.filter(provider => 
      provider.availability.emergencyAvailable ||
      provider.type === 'crisis_center' ||
      provider.specialties.primary.includes('crisis_intervention')
    );

    // Score with emphasis on immediate availability
    const scoredCrisisResources = crisisCapable.map(provider => {
      const matchScore = this.calculateMatchScore(provider, userProfile, true);
      return { provider, matchScore };
    });

    // Sort by crisis readiness and proximity
    const sortedResources = scoredCrisisResources.sort((a, b) => {
      // Prioritize emergency availability
      if (a.provider.availability.emergencyAvailable !== b.provider.availability.emergencyAvailable) {
        return a.provider.availability.emergencyAvailable ? -1 : 1;
      }
      // Then by overall score
      return b.matchScore.overallScore - a.matchScore.overallScore;
    });

    return await Promise.all(
      sortedResources.map(async (match) => {
        return await this.createRecommendation(match.provider, match.matchScore, userProfile, true);
      })
    );
  }

  /**
   * Find specialized resources for specific conditions or populations
   */
  public static async findSpecializedResources(
    userProfile: UserNeedsProfile,
    specialization: string
  ): Promise<ResourceRecommendation[]> {
    
    const specialists = await this.getSpecializedProviders(specialization, userProfile.location);
    
    const scoredSpecialists = specialists.map(provider => {
      const matchScore = this.calculateMatchScore(provider, userProfile);
      return { provider, matchScore };
    });

    const sortedSpecialists = scoredSpecialists
      .sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore);

    return await Promise.all(
      sortedSpecialists.map(async (match) => {
        return await this.createRecommendation(match.provider, match.matchScore, userProfile);
      })
    );
  }

  /**
   * Calculate comprehensive matching score
   */
  private static calculateMatchScore(
    provider: ProfessionalProvider,
    userProfile: UserNeedsProfile,
    isCrisis: boolean = false
  ): MatchingScore {
    
    const categoryScores = {
      clinical: this.scoreClinicalMatch(provider, userProfile),
      practical: this.scorePracticalMatch(provider, userProfile),
      cultural: this.scoreCulturalMatch(provider, userProfile),
      financial: this.scoreFinancialMatch(provider, userProfile),
      availability: this.scoreAvailabilityMatch(provider, userProfile, isCrisis)
    };

    // Adjust weightings for crisis situations
    const weights = isCrisis ? {
      clinical: 0.30,
      practical: 0.20,
      cultural: 0.15,
      financial: 0.10,
      availability: 0.25  // Higher weight for crisis availability
    } : this.WEIGHTING_FACTORS;

    const overallScore = Object.entries(categoryScores).reduce((total, [category, score]) => {
      return total + (score * weights[category as keyof typeof weights]);
    }, 0);

    const strengths = this.identifyStrengths(provider, userProfile, categoryScores);
    const considerations = this.identifyConsiderations(provider, userProfile, categoryScores);
    
    return {
      providerId: provider.id,
      overallScore: Math.round(overallScore * 100) / 100,
      categoryScores,
      strengths,
      considerations,
      estimatedWaitTime: provider.availability.waitTimeWeeks,
      matchConfidence: overallScore >= 0.8 ? 'high' : overallScore >= 0.6 ? 'medium' : 'low'
    };
  }

  private static scoreClinicalMatch(provider: ProfessionalProvider, userProfile: UserNeedsProfile): number {
    let score = 0.0;
    let maxScore = 0.0;

    // Provider type preference (if specified)
    if (userProfile.preferences.providerType.length > 0) {
      maxScore += 0.3;
      if (userProfile.preferences.providerType.includes(provider.type)) {
        score += 0.3;
      }
    }

    // Primary concerns alignment
    maxScore += 0.4;
    const concernsMatch = userProfile.clinicalNeeds.primaryConcerns.filter(concern =>
      provider.specialties.primary.some(specialty => 
        this.isSpecialtyMatch(specialty, concern)
      ) ||
      provider.specialties.secondary.some(specialty =>
        this.isSpecialtyMatch(specialty, concern)
      )
    ).length;
    
    if (userProfile.clinicalNeeds.primaryConcerns.length > 0) {
      score += (concernsMatch / userProfile.clinicalNeeds.primaryConcerns.length) * 0.4;
    }

    // Trauma-informed care requirement
    if (userProfile.preferences.traumaInformed) {
      maxScore += 0.2;
      if (provider.specialties.traumaInformed) {
        score += 0.2;
      }
    }

    // Severity level appropriateness
    maxScore += 0.1;
    if (this.isSeverityLevelAppropriate(provider, userProfile.clinicalNeeds.severityLevel)) {
      score += 0.1;
    }

    return maxScore > 0 ? score / maxScore : 0;
  }

  private static scorePracticalMatch(provider: ProfessionalProvider, userProfile: UserNeedsProfile): number {
    let score = 0.0;
    let maxScore = 1.0;

    // Location and distance
    const distance = this.calculateDistance(provider.location, userProfile.location);
    if (distance <= userProfile.practicalConstraints.maxDistance) {
      score += 0.4 * (1 - (distance / userProfile.practicalConstraints.maxDistance));
    }

    // Service delivery method (telehealth vs in-person)
    if (userProfile.practicalConstraints.transportationMethod === 'telehealth_only') {
      if (provider.location.telehealth) score += 0.3;
    } else if (provider.location.inPerson) {
      score += 0.3;
    }

    // Language compatibility
    if (userProfile.preferences.culturalBackground) {
      const languageMatch = provider.availability.languages.some(lang =>
        userProfile.preferences.culturalBackground?.includes(lang)
      );
      if (languageMatch) score += 0.1;
    }

    // Accepting new clients
    if (provider.availability.acceptingNewClients) {
      score += 0.2;
    }

    return score;
  }

  private static scoreCulturalMatch(provider: ProfessionalProvider, userProfile: UserNeedsProfile): number {
    let score = 0.0;
    let totalWeight = 0.0;

    // Cultural competencies
    if (userProfile.preferences.culturalBackground?.length) {
      totalWeight += 0.4;
      const culturalMatch = userProfile.preferences.culturalBackground.some(bg =>
        provider.specialties.culturalCompetencies.includes(bg)
      );
      if (culturalMatch) score += 0.4;
    }

    // LGBTQ+ affirming care
    if (userProfile.preferences.lgbtqAffirming) {
      totalWeight += 0.3;
      if (provider.specialties.culturalCompetencies.includes('LGBTQ+')) {
        score += 0.3;
      }
    }

    // Religious considerations
    if (userProfile.preferences.religiousConsiderations?.length) {
      totalWeight += 0.2;
      const religiousMatch = userProfile.preferences.religiousConsiderations.some(religion =>
        provider.specialties.culturalCompetencies.includes(religion)
      );
      if (religiousMatch) score += 0.2;
    }

    // Age group appropriateness
    totalWeight += 0.1;
    if (this.isAgeGroupAppropriate(provider, userProfile)) {
      score += 0.1;
    }

    return totalWeight > 0 ? score / totalWeight : 1.0;
  }

  private static scoreFinancialMatch(provider: ProfessionalProvider, userProfile: UserNeedsProfile): number {
    let score = 0.0;

    // Insurance acceptance
    if (userProfile.financialSituation.hasInsurance && userProfile.financialSituation.insurancePlan) {
      if (provider.insurance.accepted.includes(userProfile.financialSituation.insurancePlan)) {
        score += 0.6;
      }
    }

    // Self-pay affordability
    if (!userProfile.financialSituation.hasInsurance || userProfile.financialSituation.maxSelfPayRate) {
      const maxRate = userProfile.financialSituation.maxSelfPayRate || 0;
      if (provider.insurance.selfPayRates.individual <= maxRate) {
        score += 0.3;
      }
    }

    // Sliding scale availability
    if (userProfile.financialSituation.needsSlidingScale) {
      if (provider.insurance.slidingScale) {
        score += 0.1;
      }
    }

    return score;
  }

  private static scoreAvailabilityMatch(
    provider: ProfessionalProvider, 
    userProfile: UserNeedsProfile,
    isCrisis: boolean
  ): number {
    let score = 0.0;

    if (isCrisis) {
      // For crisis situations, prioritize emergency availability
      if (provider.availability.emergencyAvailable) {
        score += 0.8;
      }
      if (provider.availability.waitTimeWeeks === 0) {
        score += 0.2;
      }
    } else {
      // Regular availability scoring
      if (provider.availability.acceptingNewClients) {
        score += 0.5;
      }
      
      // Wait time scoring (shorter is better)
      const waitTimeScore = Math.max(0, 1 - (provider.availability.waitTimeWeeks / 12));
      score += 0.5 * waitTimeScore;
    }

    return score;
  }

  // Helper methods
  private static async getProviderCandidates(userProfile: UserNeedsProfile): Promise<ProfessionalProvider[]> {
    // In production, this would query the provider database with basic filters
    return this.getMockProviders().filter(provider => 
      provider.location.state === userProfile.location.state
    );
  }

  private static async getSpecializedProviders(
    specialization: string, 
    location: UserNeedsProfile['location']
  ): Promise<ProfessionalProvider[]> {
    return this.getMockProviders().filter(provider =>
      provider.specialties.primary.includes(specialization) ||
      provider.specialties.secondary.includes(specialization)
    );
  }

  private static isSpecialtyMatch(providerSpecialty: string, userConcern: string): boolean {
    // Mapping logic between user concerns and provider specialties
    const specialtyMappings: { [concern: string]: string[] } = {
      'anxiety': ['anxiety_disorders', 'generalized_anxiety', 'panic_disorder', 'social_anxiety'],
      'depression': ['depression', 'major_depressive_disorder', 'mood_disorders'],
      'trauma': ['trauma', 'ptsd', 'complex_trauma', 'childhood_trauma'],
      'relationships': ['couples_therapy', 'relationship_counseling', 'family_therapy'],
      'addiction': ['substance_abuse', 'addiction_counseling', 'behavioral_addictions']
    };

    const relevantSpecialties = specialtyMappings[userConcern.toLowerCase()] || [userConcern.toLowerCase()];
    return relevantSpecialties.some(specialty => 
      providerSpecialty.toLowerCase().includes(specialty)
    );
  }

  private static isSeverityLevelAppropriate(
    provider: ProfessionalProvider, 
    severityLevel: string
  ): boolean {
    // Different provider types are appropriate for different severity levels
    switch (severityLevel) {
      case 'severe':
        return ['psychiatrist', 'psychologist', 'clinic'].includes(provider.type);
      case 'moderate':
        return !['crisis_center'].includes(provider.type);
      case 'mild':
        return true; // All providers can handle mild concerns
      default:
        return true;
    }
  }

  private static calculateDistance(
    providerLocation: ProfessionalProvider['location'],
    userLocation: UserNeedsProfile['location']
  ): number {
    // Mock distance calculation - in production, use geocoding service
    if (providerLocation.city === userLocation.city) return 5;
    if (providerLocation.state === userLocation.state) return 25;
    return 100;
  }

  private static isAgeGroupAppropriate(
    provider: ProfessionalProvider,
    userProfile: UserNeedsProfile
  ): boolean {
    // In production, this would consider user's actual age
    // For now, assume adult population
    return provider.specialties.ageGroups.includes('adult');
  }

  private static identifyStrengths(
    provider: ProfessionalProvider,
    userProfile: UserNeedsProfile,
    scores: MatchingScore['categoryScores']
  ): string[] {
    const strengths: string[] = [];

    if (scores.clinical > 0.8) {
      strengths.push('Excellent clinical specialty match');
    }
    if (scores.cultural > 0.8) {
      strengths.push('Strong cultural competency alignment');
    }
    if (provider.integration.alchmsPartner) {
      strengths.push('ALCHM integration partner');
    }
    if (provider.ratings.overallRating > 4.5) {
      strengths.push('Highly rated by clients');
    }
    if (provider.availability.waitTimeWeeks === 0) {
      strengths.push('Immediate availability');
    }

    return strengths;
  }

  private static identifyConsiderations(
    provider: ProfessionalProvider,
    userProfile: UserNeedsProfile,
    scores: MatchingScore['categoryScores']
  ): string[] {
    const considerations: string[] = [];

    if (scores.financial < 0.5) {
      considerations.push('May not accept your insurance - verify coverage');
    }
    if (scores.practical < 0.6) {
      considerations.push('Location may require travel or telehealth preference');
    }
    if (provider.availability.waitTimeWeeks > 4) {
      considerations.push(`${provider.availability.waitTimeWeeks} week wait time`);
    }
    if (!provider.integration.alchmsPartner) {
      considerations.push('Not currently integrated with ALCHM platform');
    }

    return considerations;
  }

  private static async createRecommendation(
    provider: ProfessionalProvider,
    matchScore: MatchingScore,
    userProfile: UserNeedsProfile,
    isCrisis: boolean = false
  ): Promise<ResourceRecommendation> {
    
    const contactInfo = await this.getProviderContactInfo(provider.id);
    const nextSteps = this.generateNextSteps(provider, userProfile, isCrisis);
    const alchmsIntegration = provider.integration.alchmsPartner 
      ? this.getALCHMIntegrationInfo(provider)
      : undefined;

    return {
      provider,
      matchScore,
      contactInfo,
      nextSteps,
      alchmsIntegration
    };
  }

  private static async getProviderContactInfo(providerId: string): Promise<ResourceRecommendation['contactInfo']> {
    // Mock implementation - would fetch from secure provider database
    return {
      phone: '(555) 123-4567',
      email: 'contact@example.com',
      website: 'https://example.com',
      bookingLink: 'https://example.com/book'
    };
  }

  private static generateNextSteps(
    provider: ProfessionalProvider,
    userProfile: UserNeedsProfile,
    isCrisis: boolean
  ): string[] {
    const steps: string[] = [];

    if (isCrisis) {
      steps.push('Call immediately - mention you are in crisis');
      if (provider.availability.emergencyAvailable) {
        steps.push('Emergency consultation available');
      }
    } else {
      steps.push('Call to schedule initial consultation');
      if (userProfile.financialSituation.hasInsurance) {
        steps.push('Verify insurance coverage before first appointment');
      }
    }

    steps.push('Prepare list of questions about their approach');
    
    if (provider.integration.alchmsPartner) {
      steps.push('Ask about ALCHM integration during initial consultation');
    }

    return steps;
  }

  private static getALCHMIntegrationInfo(provider: ProfessionalProvider): ResourceRecommendation['alchmsIntegration'] {
    return {
      available: true,
      benefits: [
        'Secure sharing of progress insights with your consent',
        'Enhanced session preparation with your journaling patterns',
        'Coordinated crisis prevention monitoring',
        'Integrated therapeutic goal tracking'
      ],
      setupProcess: [
        'Discuss integration during first session',
        'Review and sign data sharing consent',
        'Complete secure account linking',
        'Configure sharing preferences'
      ]
    };
  }

  // Mock data for development
  private static getMockProviders(): ProfessionalProvider[] {
    return [
      {
        id: 'provider_001',
        type: 'therapist',
        name: 'Dr. Sarah Johnson, LCSW',
        credentials: {
          license: 'LCSW',
          licenseNumber: '12345',
          licenseState: 'CA',
          certifications: ['Trauma-Informed Care', 'EMDR Level II'],
          yearsOfPractice: 12
        },
        specialties: {
          primary: ['anxiety_disorders', 'trauma', 'depression'],
          secondary: ['couples_therapy', 'family_therapy'],
          traumaInformed: true,
          culturalCompetencies: ['LGBTQ+', 'Hispanic/Latino'],
          ageGroups: ['adolescent', 'adult'],
          approaches: ['CBT', 'EMDR', 'Mindfulness-Based']
        },
        availability: {
          acceptingNewClients: true,
          waitTimeWeeks: 2,
          emergencyAvailable: false,
          schedulingMethods: ['phone', 'online'],
          languages: ['English', 'Spanish']
        },
        location: {
          city: 'San Francisco',
          state: 'CA',
          telehealth: true,
          inPerson: true
        },
        insurance: {
          accepted: ['Blue Cross Blue Shield', 'Aetna', 'United Healthcare'],
          selfPayRates: {
            individual: 150,
            couples: 180
          },
          slidingScale: true,
          proBonoSlots: 2
        },
        ratings: {
          overallRating: 4.8,
          totalReviews: 127,
          culturalSensitivity: 4.9,
          responsiveness: 4.7,
          effectiveness: 4.8
        },
        integration: {
          alchmsPartner: true,
          ehrsSupported: ['Epic', 'Cerner'],
          dataSharing: true,
          crisisProtocols: true
        },
        lastUpdated: new Date()
      }
      // Additional mock providers would be included here
    ];
  }
}

export default ProfessionalResourceMatcher;