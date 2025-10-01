/**
 * ALCHM Influencer Partnership & Advocacy Program
 * Manages authentic partnerships with mental health advocates, therapists, and community leaders
 */

import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit, serverTimestamp, updateDoc } from 'firebase/firestore';

// Influencer Program Configuration
const PROGRAM_CONFIG = {
  TIERS: {
    MICRO_INFLUENCER: {
      name: 'Community Advocate',
      minFollowers: 1000,
      maxFollowers: 10000,
      benefits: ['Free premium access', 'Early feature access', 'Community badge', 'Referral bonuses'],
      requirements: ['Authentic mental health advocacy', 'Alignment with trauma-informed values']
    },
    MACRO_INFLUENCER: {
      name: 'Wellness Leader',
      minFollowers: 10000,
      maxFollowers: 100000,
      benefits: ['All Community benefits', 'Monthly stipend', 'Co-creation opportunities', 'Event speaking'],
      requirements: ['Established wellness platform', 'Professional credentials or lived experience']
    },
    THOUGHT_LEADER: {
      name: 'Mental Health Expert',
      minFollowers: 100000,
      maxFollowers: Infinity,
      benefits: ['All previous benefits', 'Advisory board consideration', 'Revenue sharing', 'Product co-development'],
      requirements: ['Recognized expertise', 'Published work or clinical practice', 'Platform alignment']
    }
  },
  CONTENT_GUIDELINES: {
    REQUIRED_DISCLOSURES: [
      '#ALCHMPartner',
      'Gifted product disclosure',
      'Personal experience authenticity'
    ],
    PROHIBITED_CONTENT: [
      'Medical advice or diagnosis',
      'Promises of cure or guaranteed outcomes',
      'Comparison with prescription medications',
      'Crisis content without appropriate resources'
    ],
    ENCOURAGED_THEMES: [
      'Personal healing journeys',
      'Mental health destigmatization',
      'Trauma-informed awareness',
      'Self-care practices',
      'Community building'
    ]
  },
  COMPENSATION_STRUCTURE: {
    MICRO: { base: 0, perPost: 50, perReferral: 10 },
    MACRO: { base: 500, perPost: 200, perReferral: 25 },
    THOUGHT_LEADER: { base: 2000, perPost: 500, perReferral: 50 }
  }
};

interface InfluencerProfile {
  id: string;
  name: string;
  email: string;
  platforms: {
    instagram?: { handle: string; followers: number; verified: boolean };
    tiktok?: { handle: string; followers: number; verified: boolean };
    youtube?: { handle: string; subscribers: number; verified: boolean };
    linkedin?: { handle: string; connections: number; verified: boolean };
    twitter?: { handle: string; followers: number; verified: boolean };
  };
  demographics: {
    ageRange: string;
    location: string;
    primaryAudience: string[];
    contentCategories: string[];
  };
  credentials: {
    type: 'lived_experience' | 'professional' | 'both';
    details: string;
    verified: boolean;
  };
  tier: keyof typeof PROGRAM_CONFIG.TIERS;
  status: 'applied' | 'approved' | 'active' | 'paused' | 'terminated';
  applicationDate: Date;
  approvalDate?: Date;
  totalReach: number;
  engagementRate: number;
  alignmentScore: number;
  brandSafety: {
    score: number;
    flags: string[];
    lastChecked: Date;
  };
}

interface InfluencerCampaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  targetAudience: string[];
  contentRequirements: {
    postCount: number;
    platforms: string[];
    hashtags: string[];
    mentions: string[];
    contentType: ('image' | 'video' | 'story' | 'reel' | 'live')[];
  };
  compensation: {
    type: 'flat_fee' | 'per_post' | 'performance_based' | 'product_only';
    amount?: number;
    bonusThresholds?: { metric: string; threshold: number; bonus: number }[];
  };
  participants: string[]; // Influencer IDs
  performance: {
    totalReach: number;
    totalEngagement: number;
    clickThroughs: number;
    conversions: number;
    brandMentions: number;
  };
  status: 'draft' | 'active' | 'completed' | 'cancelled';
}

export class InfluencerProgramManager {
  private db = db;

  /**
   * Process new influencer application
   */
  async processApplication(applicationData: any): Promise<{
    success: boolean;
    influencerId?: string;
    tier?: string;
    nextSteps: string[];
  }> {
    try {
      // Calculate influencer metrics
      const metrics = this.calculateInfluencerMetrics(applicationData);
      
      // Determine tier eligibility
      const tier = this.determineTier(metrics.totalFollowers, applicationData.credentials);
      
      // Perform brand safety assessment
      const brandSafety = await this.assessBrandSafety(applicationData);
      
      // Calculate alignment score
      const alignmentScore = this.calculateAlignmentScore(applicationData);

      const influencerProfile: Partial<InfluencerProfile> = {
        name: applicationData.name,
        email: applicationData.email,
        platforms: applicationData.platforms,
        demographics: applicationData.demographics,
        credentials: applicationData.credentials,
        tier,
        status: brandSafety.score >= 80 && alignmentScore >= 70 ? 'approved' : 'applied',
        applicationDate: new Date(),
        approvalDate: brandSafety.score >= 80 && alignmentScore >= 70 ? new Date() : undefined,
        totalReach: metrics.totalFollowers,
        engagementRate: metrics.avgEngagementRate,
        alignmentScore,
        brandSafety
      };

      // Store application
      const influencerRef = doc(collection(this.db, 'influencer_applications'));
      await setDoc(influencerRef, {
        ...influencerProfile,
        applicationDate: serverTimestamp(),
        approvalDate: influencerProfile.approvalDate ? serverTimestamp() : null
      });

      // Generate next steps
      const nextSteps = this.generateApplicationNextSteps(influencerProfile.status!, tier, alignmentScore);

      // Send welcome email if approved
      if (influencerProfile.status === 'approved') {
        await this.sendWelcomeEmail(influencerRef.id, influencerProfile);
      }

      return {
        success: true,
        influencerId: influencerRef.id,
        tier,
        nextSteps
      };

    } catch (error) {
      console.error('Error processing influencer application:', error);
      return {
        success: false,
        nextSteps: ['Please try again or contact our partnership team']
      };
    }
  }

  /**
   * Create targeted influencer campaign
   */
  async createCampaign(campaignData: Partial<InfluencerCampaign>): Promise<string> {
    try {
      const campaign: Partial<InfluencerCampaign> = {
        ...campaignData,
        status: 'draft',
        performance: {
          totalReach: 0,
          totalEngagement: 0,
          clickThroughs: 0,
          conversions: 0,
          brandMentions: 0
        }
      };

      const campaignRef = doc(collection(this.db, 'influencer_campaigns'));
      await setDoc(campaignRef, {
        ...campaign,
        startDate: serverTimestamp(),
        endDate: serverTimestamp() // Would be calculated based on duration
      });

      return campaignRef.id;

    } catch (error) {
      console.error('Error creating influencer campaign:', error);
      throw error;
    }
  }

  /**
   * Match influencers to campaigns
   */
  async matchInfluencersToCampaign(
    campaignId: string,
    criteria: {
      tier?: string;
      minFollowers?: number;
      platforms?: string[];
      demographics?: string[];
      contentCategories?: string[];
    }
  ): Promise<InfluencerProfile[]> {
    try {
      let influencersQuery = query(
        collection(this.db, 'influencer_applications'),
        where('status', '==', 'active'),
        orderBy('alignmentScore', 'desc'),
        limit(50)
      );

      const influencersSnap = await getDocs(influencersQuery);
      let influencers = influencersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as InfluencerProfile));

      // Apply filters
      if (criteria.tier) {
        influencers = influencers.filter(inf => inf.tier === criteria.tier);
      }

      if (criteria.minFollowers) {
        influencers = influencers.filter(inf => inf.totalReach >= (criteria.minFollowers || 0));
      }

      if (criteria.platforms?.length) {
        influencers = influencers.filter(inf => 
          criteria.platforms!.some(platform => inf.platforms[platform as keyof typeof inf.platforms])
        );
      }

      if (criteria.demographics?.length) {
        influencers = influencers.filter(inf =>
          criteria.demographics!.some(demo => 
            inf.demographics.primaryAudience.includes(demo)
          )
        );
      }

      if (criteria.contentCategories?.length) {
        influencers = influencers.filter(inf =>
          criteria.contentCategories!.some(category =>
            inf.demographics.contentCategories.includes(category)
          )
        );
      }

      // Score and rank matches
      return influencers
        .map(inf => ({
          ...inf,
          matchScore: this.calculateCampaignMatchScore(inf, criteria)
        }))
        .sort((a: any, b: any) => b.matchScore - a.matchScore)
        .slice(0, 20);

    } catch (error) {
      console.error('Error matching influencers to campaign:', error);
      return [];
    }
  }

  /**
   * Track influencer performance
   */
  async trackInfluencerPerformance(
    influencerId: string,
    campaignId: string,
    metrics: {
      reach?: number;
      engagement?: number;
      clicks?: number;
      conversions?: number;
      sentiment?: 'positive' | 'neutral' | 'negative';
      brandMentions?: number;
    }
  ): Promise<void> {
    try {
      // Update influencer performance
      const influencerRef = doc(this.db, 'influencer_applications', influencerId);
      await updateDoc(influencerRef, {
        [`campaigns.${campaignId}.performance`]: metrics,
        lastPerformanceUpdate: serverTimestamp()
      });

      // Update campaign aggregate performance
      const campaignRef = doc(this.db, 'influencer_campaigns', campaignId);
      await updateDoc(campaignRef, {
        'performance.totalReach': metrics.reach || 0,
        'performance.totalEngagement': metrics.engagement || 0,
        'performance.clickThroughs': metrics.clicks || 0,
        'performance.conversions': metrics.conversions || 0,
        'performance.brandMentions': metrics.brandMentions || 0,
        lastUpdated: serverTimestamp()
      });

      // Calculate performance score and update tier if needed
      await this.evaluateInfluencerTierStatus(influencerId);

    } catch (error) {
      console.error('Error tracking influencer performance:', error);
    }
  }

  /**
   * Generate authentic content suggestions
   */
  generateContentSuggestions(
    influencer: InfluencerProfile,
    campaign: InfluencerCampaign
  ): {
    contentIdeas: string[];
    hashtagSuggestions: string[];
    captionTemplates: string[];
    visualGuidelines: string[];
  } {
    const contentIdeas = this.generateContentIdeas(influencer, campaign);
    const hashtagSuggestions = this.generateHashtags(influencer, campaign);
    const captionTemplates = this.generateCaptionTemplates(influencer);
    const visualGuidelines = this.generateVisualGuidelines(campaign);

    return {
      contentIdeas,
      hashtagSuggestions,
      captionTemplates,
      visualGuidelines
    };
  }

  /**
   * Monitor brand safety and authenticity
   */
  async monitorBrandSafety(influencerId: string): Promise<{
    score: number;
    flags: string[];
    recommendations: string[];
  }> {
    try {
      // This would integrate with content monitoring APIs
      const mockSafetyData = {
        score: 85,
        flags: [],
        recommendations: [
          'Continue authentic storytelling approach',
          'Maintain trauma-informed language',
          'Include appropriate crisis resources in mental health content'
        ]
      };

      // Update influencer safety score
      await updateDoc(doc(this.db, 'influencer_applications', influencerId), {
        'brandSafety.score': mockSafetyData.score,
        'brandSafety.flags': mockSafetyData.flags,
        'brandSafety.lastChecked': serverTimestamp()
      });

      return mockSafetyData;

    } catch (error) {
      console.error('Error monitoring brand safety:', error);
      return {
        score: 0,
        flags: ['monitoring_error'],
        recommendations: ['Contact partnership team for manual review']
      };
    }
  }

  // Private helper methods

  private calculateInfluencerMetrics(applicationData: any) {
    let totalFollowers = 0;
    let totalEngagement = 0;
    let platformCount = 0;

    Object.entries(applicationData.platforms).forEach(([platform, data]: [string, any]) => {
      if (data) {
        totalFollowers += data.followers || data.subscribers || data.connections || 0;
        totalEngagement += (data.followers || 0) * 0.03; // Estimated 3% engagement
        platformCount++;
      }
    });

    return {
      totalFollowers,
      avgEngagementRate: platformCount > 0 ? totalEngagement / totalFollowers : 0,
      platformCount
    };
  }

  private determineTier(
    totalFollowers: number,
    credentials: { type: string; verified: boolean }
  ): keyof typeof PROGRAM_CONFIG.TIERS {
    // Professional boost for verified credentials
    const credentialBoost = credentials.verified && credentials.type !== 'lived_experience' ? 10000 : 0;
    const adjustedFollowers = totalFollowers + credentialBoost;

    if (adjustedFollowers >= 100000) return 'THOUGHT_LEADER';
    if (adjustedFollowers >= 10000) return 'MACRO_INFLUENCER';
    return 'MICRO_INFLUENCER';
  }

  private async assessBrandSafety(applicationData: any): Promise<{
    score: number;
    flags: string[];
    lastChecked: Date;
  }> {
    // Mock brand safety assessment - would integrate with monitoring tools
    let score = 90;
    const flags: string[] = [];

    // Check for trauma-informed alignment
    const hasTraumaExperience = applicationData.credentials.type.includes('experience');
    const hasProfessionalBackground = applicationData.credentials.type.includes('professional');
    
    if (!hasTraumaExperience && !hasProfessionalBackground) {
      score -= 20;
      flags.push('limited_mental_health_background');
    }

    // Check content categories alignment
    const mentalHealthCategories = ['mental_health', 'wellness', 'self_care', 'healing'];
    const hasRelevantContent = applicationData.demographics.contentCategories.some(
      (category: string) => mentalHealthCategories.includes(category)
    );

    if (!hasRelevantContent) {
      score -= 15;
      flags.push('content_misalignment');
    }

    return {
      score,
      flags,
      lastChecked: new Date()
    };
  }

  private calculateAlignmentScore(applicationData: any): number {
    let score = 0;

    // Credential alignment (30 points)
    if (applicationData.credentials.verified) score += 15;
    if (applicationData.credentials.type.includes('professional')) score += 10;
    if (applicationData.credentials.type.includes('lived_experience')) score += 15;

    // Content alignment (25 points)
    const mentalHealthKeywords = ['mental health', 'trauma', 'healing', 'wellness', 'therapy'];
    const contentScore = applicationData.demographics.contentCategories.filter(
      (category: string) => mentalHealthKeywords.some(keyword => category.includes(keyword))
    ).length * 5;
    score += Math.min(contentScore, 25);

    // Audience alignment (25 points)
    const targetAudiences = ['young_adults', 'trauma_survivors', 'mental_health_advocates'];
    const audienceScore = applicationData.demographics.primaryAudience.filter(
      (audience: string) => targetAudiences.includes(audience)
    ).length * 8;
    score += Math.min(audienceScore, 25);

    // Platform diversity (20 points)
    const platformCount = Object.keys(applicationData.platforms).length;
    score += Math.min(platformCount * 5, 20);

    return Math.min(score, 100);
  }

  private generateApplicationNextSteps(status: string, tier: string, alignmentScore: number): string[] {
    const nextSteps: string[] = [];

    if (status === 'approved') {
      nextSteps.push(
        'Welcome to the ALCHM Partner Program!',
        `You've been approved for our ${PROGRAM_CONFIG.TIERS[tier as keyof typeof PROGRAM_CONFIG.TIERS].name} tier`,
        'Check your email for partnership guidelines and first campaign opportunities',
        'Complete your partner profile to receive campaign invitations'
      );
    } else {
      nextSteps.push(
        'Thank you for your interest in partnering with ALCHM',
        'Your application is under review by our partnership team'
      );

      if (alignmentScore < 70) {
        nextSteps.push(
          'Consider strengthening your mental health content focus',
          'Verify any professional credentials to improve your application'
        );
      }

      nextSteps.push('We\'ll contact you within 5 business days with next steps');
    }

    return nextSteps;
  }

  private async sendWelcomeEmail(influencerId: string, profile: Partial<InfluencerProfile>): Promise<void> {
    try {
      await setDoc(doc(collection(this.db, 'email_triggers')), {
        type: 'influencer_welcome',
        influencerId,
        email: profile.email,
        tier: profile.tier,
        status: 'pending',
        createdAt: serverTimestamp(),
        metadata: {
          template: 'influencer_welcome_v2',
          personalizedContent: true,
          benefits: PROGRAM_CONFIG.TIERS[profile.tier as keyof typeof PROGRAM_CONFIG.TIERS].benefits
        }
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  private calculateCampaignMatchScore(influencer: InfluencerProfile, criteria: any): number {
    let score = 0;

    // Tier match
    if (!criteria.tier || influencer.tier === criteria.tier) score += 25;

    // Follower threshold
    if (!criteria.minFollowers || influencer.totalReach >= criteria.minFollowers) score += 20;

    // Platform alignment
    if (criteria.platforms) {
      const matchingPlatforms = criteria.platforms.filter(
        (platform: string) => influencer.platforms[platform as keyof typeof influencer.platforms]
      ).length;
      score += (matchingPlatforms / criteria.platforms.length) * 25;
    } else {
      score += 25;
    }

    // Demographics alignment
    if (criteria.demographics) {
      const matchingDemographics = criteria.demographics.filter(
        (demo: string) => influencer.demographics.primaryAudience.includes(demo)
      ).length;
      score += (matchingDemographics / criteria.demographics.length) * 15;
    } else {
      score += 15;
    }

    // Content category alignment
    if (criteria.contentCategories) {
      const matchingCategories = criteria.contentCategories.filter(
        (category: string) => influencer.demographics.contentCategories.includes(category)
      ).length;
      score += (matchingCategories / criteria.contentCategories.length) * 15;
    } else {
      score += 15;
    }

    return score;
  }

  private async evaluateInfluencerTierStatus(influencerId: string): Promise<void> {
    // Logic to potentially upgrade influencer tier based on performance
    // This would analyze campaign performance and adjust tier accordingly
  }

  private generateContentIdeas(influencer: InfluencerProfile, campaign: InfluencerCampaign): string[] {
    const ideas = [
      'Share your personal mental health journey with ALCHM',
      'Demonstrate the trauma-informed AI responses',
      'Show your daily journaling routine with ALCHM',
      'Discuss the importance of mental health stigma reduction',
      'Create educational content about trauma-informed care'
    ];

    // Customize based on influencer credentials
    if (influencer.credentials.type.includes('professional')) {
      ideas.push(
        'Professional perspective on digital mental health tools',
        'How ALCHM complements traditional therapy'
      );
    }

    return ideas;
  }

  private generateHashtags(influencer: InfluencerProfile, campaign: InfluencerCampaign): string[] {
    const baseHashtags = [
      '#ALCHMPartner',
      '#TraumaInformed',
      '#MentalHealthAwareness',
      '#DigitalWellness',
      '#HealingJourney'
    ];

    // Add tier-specific hashtags
    if (influencer.tier === 'THOUGHT_LEADER') {
      baseHashtags.push('#MentalHealthExpert', '#ThoughtLeader');
    }

    return baseHashtags;
  }

  private generateCaptionTemplates(influencer: InfluencerProfile): string[] {
    return [
      'Authenticity template: Share genuine experience with mental health tools',
      'Educational template: Explain trauma-informed principles',
      'Community template: Encourage others to prioritize mental health',
      'Personal growth template: Document healing journey milestones'
    ];
  }

  private generateVisualGuidelines(campaign: InfluencerCampaign): string[] {
    return [
      'Use calming, supportive imagery',
      'Avoid triggering visual content',
      'Include ALCHM branding naturally in posts',
      'Show authentic app usage, not staged screenshots',
      'Maintain accessibility with alt text and captions'
    ];
  }
}

// Export convenience functions
export const processInfluencerApplication = async (applicationData: any) => {
  const manager = new InfluencerProgramManager();
  return manager.processApplication(applicationData);
};

export const createInfluencerCampaign = async (campaignData: Partial<InfluencerCampaign>) => {
  const manager = new InfluencerProgramManager();
  return manager.createCampaign(campaignData);
};

export const trackInfluencerMetrics = async (influencerId: string, campaignId: string, metrics: any) => {
  const manager = new InfluencerProgramManager();
  return manager.trackInfluencerPerformance(influencerId, campaignId, metrics);
};