/**
 * Professional Advocacy Building & NPS Tracking System
 * 
 * Comprehensive system for building professional advocacy through NPS tracking,
 * referral management, testimonial collection, and professional rewards.
 * Drives business growth through validated professional endorsement.
 */

import { collection, doc, getDoc, setDoc, updateDoc, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Core Types
export interface NPSResponse {
  id: string;
  therapistId: string;
  score: number; // 0-10
  category: 'detractor' | 'passive' | 'promoter';
  comment?: string;
  followUpActions: string[];
  responseDate: Timestamp;
  quarter: string; // e.g., '2024-Q1'
  year: number;
}

export interface ReferralTracking {
  id: string;
  referringTherapistId: string;
  referredTherapistEmail: string;
  referredTherapistId?: string; // Set when they register
  
  // Referral Details
  referralMethod: 'email' | 'phone' | 'conference' | 'professional-network' | 'social-media';
  referralContext: string; // Description of how referral happened
  clientConnected: boolean;
  registrationCompleted: boolean;
  firstClientConnection?: Timestamp;
  
  // Tracking
  referralDate: Timestamp;
  registrationDate?: Timestamp;
  lastFollowUp?: Timestamp;
  
  // Rewards
  rewardEligible: boolean;
  rewardIssued: boolean;
  rewardType?: 'credit' | 'subscription-month' | 'conference-ticket' | 'certification';
  rewardValue?: number;
}

export interface TestimonialCollection {
  id: string;
  therapistId: string;
  
  // Testimonial Content
  testimonialText: string;
  specificFeatures: string[]; // What they praise specifically
  clientOutcomes: string[]; // Specific outcomes they've seen
  usageContext: string; // How they use ALCHM in practice
  
  // Publishing Permissions
  canPublishName: boolean;
  canPublishCredentials: boolean;
  canPublishLocation: boolean;
  canUseInMarketing: boolean;
  canUseInCaseStudies: boolean;
  
  // Verification
  isVerified: boolean;
  verificationMethod: 'email' | 'phone' | 'video-call';
  verificationDate?: Timestamp;
  
  // Usage Tracking
  marketingUsage: Array<{
    platform: string;
    campaignId: string;
    usageDate: Timestamp;
  }>;
  
  collectionDate: Timestamp;
  lastUpdated: Timestamp;
}

export interface ProfessionalRewards {
  id: string;
  therapistId: string;
  
  // Points System
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  
  // Point Sources
  pointHistory: Array<{
    source: 'nps-response' | 'referral' | 'testimonial' | 'research-participation' | 'community-engagement';
    points: number;
    description: string;
    date: Timestamp;
  }>;
  
  // Rewards Claimed
  rewardsClaimed: Array<{
    rewardType: string;
    pointsCost: number;
    description: string;
    claimDate: Timestamp;
    fulfillmentStatus: 'pending' | 'fulfilled' | 'cancelled';
  }>;
  
  // Tier Status
  tierLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierBenefits: string[];
  nextTierRequirement: number;
  
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

export interface AdvocacyMetrics {
  totalNPSResponses: number;
  averageNPSScore: number;
  npsDistribution: {
    detractors: number;
    passives: number;
    promoters: number;
  };
  netPromoterScore: number;
  
  totalReferrals: number;
  successfulReferrals: number;
  referralConversionRate: number;
  
  totalTestimonials: number;
  publishableTestimonials: number;
  
  topAdvocates: Array<{
    therapistId: string;
    name: string;
    npsScore: number;
    referralCount: number;
    testimonialCount: number;
  }>;
}

/**
 * Professional Advocacy Building Engine
 */
export class AdvocacyBuildingEngine {
  private static instance: AdvocacyBuildingEngine;
  
  public static getInstance(): AdvocacyBuildingEngine {
    if (!AdvocacyBuildingEngine.instance) {
      AdvocacyBuildingEngine.instance = new AdvocacyBuildingEngine();
    }
    return AdvocacyBuildingEngine.instance;
  }

  /**
   * NPS TRACKING & MANAGEMENT
   */
  
  async collectNPSResponse(
    therapistId: string, 
    score: number, 
    comment?: string
  ): Promise<string> {
    try {
      const category = this.categirizeNPSScore(score);
      const quarter = this.getCurrentQuarter();
      const year = new Date().getFullYear();
      
      const npsResponse: Omit<NPSResponse, 'id'> = {
        therapistId,
        score,
        category,
        comment,
        followUpActions: this.generateFollowUpActions(score, category),
        responseDate: Timestamp.now(),
        quarter,
        year
      };
      
      const docRef = await addDoc(collection(db, 'npsResponses'), npsResponse);
      
      // Award points for NPS response
      await this.awardPoints(therapistId, 'nps-response', 50, 'NPS survey completion');
      
      // Trigger appropriate follow-up actions
      await this.triggerNPSFollowUp(therapistId, score, category);
      
      return docRef.id;
    } catch (error) {
      console.error('Error collecting NPS response:', error);
      throw new Error('Failed to collect NPS response');
    }
  }
  
  private categirizeNPSScore(score: number): 'detractor' | 'passive' | 'promoter' {
    if (score >= 9) return 'promoter';
    if (score >= 7) return 'passive';
    return 'detractor';
  }
  
  private generateFollowUpActions(score: number, category: string): string[] {
    const baseActions = ['Thank therapist for feedback'];
    
    if (category === 'promoter') {
      return [
        ...baseActions,
        'Request testimonial',
        'Offer referral rewards program',
        'Invite to case study participation',
        'Propose speaking opportunity'
      ];
    } else if (category === 'passive') {
      return [
        ...baseActions,
        'Schedule check-in call',
        'Provide additional training resources',
        'Gather specific improvement suggestions'
      ];
    } else {
      return [
        ...baseActions,
        'Schedule urgent feedback call',
        'Escalate to customer success team',
        'Provide immediate support',
        'Create improvement action plan'
      ];
    }
  }
  
  private async triggerNPSFollowUp(therapistId: string, score: number, category: string): Promise<void> {
    // Implementation would trigger appropriate automated or manual follow-ups
    if (category === 'promoter') {
      await this.initiateTestimonialRequest(therapistId);
      await this.enrollInReferralProgram(therapistId);
    } else if (category === 'detractor') {
      await this.escalateToSupport(therapistId, score);
    }
  }

  /**
   * REFERRAL TRACKING & REWARDS
   */
  
  async trackReferral(
    referringTherapistId: string,
    referredTherapistEmail: string,
    referralMethod: ReferralTracking['referralMethod'],
    context: string
  ): Promise<string> {
    try {
      const referralData: Omit<ReferralTracking, 'id'> = {
        referringTherapistId,
        referredTherapistEmail,
        referralMethod,
        referralContext: context,
        clientConnected: false,
        registrationCompleted: false,
        referralDate: Timestamp.now(),
        rewardEligible: true,
        rewardIssued: false
      };
      
      const docRef = await addDoc(collection(db, 'referralTracking'), referralData);
      
      // Award points for making referral
      await this.awardPoints(
        referringTherapistId, 
        'referral', 
        100, 
        `Referred ${referredTherapistEmail}`
      );
      
      return docRef.id;
    } catch (error) {
      console.error('Error tracking referral:', error);
      throw new Error('Failed to track referral');
    }
  }
  
  async updateReferralStatus(
    referralId: string, 
    updates: Partial<ReferralTracking>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'referralTracking', referralId), {
        ...updates,
        lastFollowUp: Timestamp.now()
      });
      
      // If referral completed registration, award bonus points
      if (updates.registrationCompleted) {
        const referralDoc = await getDoc(doc(db, 'referralTracking', referralId));
        if (referralDoc.exists()) {
          const referralData = referralDoc.data() as ReferralTracking;
          await this.awardPoints(
            referralData.referringTherapistId,
            'referral',
            200,
            'Successful referral registration'
          );
        }
      }
    } catch (error) {
      console.error('Error updating referral status:', error);
      throw new Error('Failed to update referral status');
    }
  }

  /**
   * TESTIMONIAL COLLECTION & VERIFICATION
   */
  
  async collectTestimonial(
    therapistId: string,
    testimonialData: Omit<TestimonialCollection, 'id' | 'therapistId' | 'isVerified' | 'marketingUsage' | 'collectionDate' | 'lastUpdated'>
  ): Promise<string> {
    try {
      const testimonial: Omit<TestimonialCollection, 'id'> = {
        therapistId,
        ...testimonialData,
        isVerified: false,
        marketingUsage: [],
        collectionDate: Timestamp.now(),
        lastUpdated: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'testimonials'), testimonial);
      
      // Award points for testimonial
      await this.awardPoints(therapistId, 'testimonial', 300, 'Provided testimonial');
      
      // Trigger verification process
      await this.initiateTestimonialVerification(docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error collecting testimonial:', error);
      throw new Error('Failed to collect testimonial');
    }
  }
  
  async verifyTestimonial(
    testimonialId: string, 
    verificationMethod: TestimonialCollection['verificationMethod']
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'testimonials', testimonialId), {
        isVerified: true,
        verificationMethod,
        verificationDate: Timestamp.now(),
        lastUpdated: Timestamp.now()
      });
      
      // Award bonus points for verified testimonial
      const testimonialDoc = await getDoc(doc(db, 'testimonials', testimonialId));
      if (testimonialDoc.exists()) {
        const testimonialData = testimonialDoc.data() as TestimonialCollection;
        await this.awardPoints(
          testimonialData.therapistId,
          'testimonial',
          200,
          'Testimonial verified'
        );
      }
    } catch (error) {
      console.error('Error verifying testimonial:', error);
      throw new Error('Failed to verify testimonial');
    }
  }

  /**
   * PROFESSIONAL REWARDS SYSTEM
   */
  
  async awardPoints(
    therapistId: string,
    source: ProfessionalRewards['pointHistory'][0]['source'],
    points: number,
    description: string
  ): Promise<void> {
    try {
      const rewardsRef = doc(db, 'professionalRewards', therapistId);
      const rewardsDoc = await getDoc(rewardsRef);
      
      if (rewardsDoc.exists()) {
        const currentRewards = rewardsDoc.data() as ProfessionalRewards;
        const newTotalPoints = currentRewards.totalPoints + points;
        const newAvailablePoints = currentRewards.availablePoints + points;
        const newLifetimePoints = currentRewards.lifetimePoints + points;
        
        const newTierLevel = this.calculateTierLevel(newLifetimePoints);
        
        await updateDoc(rewardsRef, {
          totalPoints: newTotalPoints,
          availablePoints: newAvailablePoints,
          lifetimePoints: newLifetimePoints,
          tierLevel: newTierLevel,
          tierBenefits: this.getTierBenefits(newTierLevel),
          nextTierRequirement: this.getNextTierRequirement(newTierLevel),
          pointHistory: [
            ...currentRewards.pointHistory,
            {
              source,
              points,
              description,
              date: Timestamp.now()
            }
          ],
          lastUpdated: Timestamp.now()
        });
      } else {
        // Initialize rewards for new therapist
        const initialRewards: Omit<ProfessionalRewards, 'id'> = {
          therapistId,
          totalPoints: points,
          availablePoints: points,
          lifetimePoints: points,
          pointHistory: [{
            source,
            points,
            description,
            date: Timestamp.now()
          }],
          rewardsClaimed: [],
          tierLevel: this.calculateTierLevel(points),
          tierBenefits: this.getTierBenefits(this.calculateTierLevel(points)),
          nextTierRequirement: this.getNextTierRequirement(this.calculateTierLevel(points)),
          createdAt: Timestamp.now(),
          lastUpdated: Timestamp.now()
        };
        
        await setDoc(rewardsRef, initialRewards);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
      throw new Error('Failed to award points');
    }
  }
  
  private calculateTierLevel(lifetimePoints: number): ProfessionalRewards['tierLevel'] {
    if (lifetimePoints >= 5000) return 'platinum';
    if (lifetimePoints >= 2500) return 'gold';
    if (lifetimePoints >= 1000) return 'silver';
    return 'bronze';
  }
  
  private getTierBenefits(tier: ProfessionalRewards['tierLevel']): string[] {
    const benefits = {
      bronze: ['Basic support', 'Monthly newsletter', 'Community access'],
      silver: ['Priority support', 'Quarterly webinars', 'Beta feature access', 'Referral bonuses'],
      gold: ['Dedicated account manager', 'Monthly 1:1 calls', 'Custom training', 'Speaking opportunities'],
      platinum: ['White-glove service', 'Co-marketing opportunities', 'Advisory board invitation', 'Revenue sharing']
    };
    return benefits[tier];
  }
  
  private getNextTierRequirement(tier: ProfessionalRewards['tierLevel']): number {
    const requirements = {
      bronze: 1000,
      silver: 2500,
      gold: 5000,
      platinum: 0 // Already at top tier
    };
    return requirements[tier];
  }

  /**
   * ANALYTICS & REPORTING
   */
  
  async getAdvocacyMetrics(timeRange?: { start: Date; end: Date }): Promise<AdvocacyMetrics> {
    try {
      // Get NPS data
      const npsQuery = query(collection(db, 'npsResponses'));
      const npsSnapshot = await getDocs(npsQuery);
      const npsResponses = npsSnapshot.docs.map(doc => doc.data() as NPSResponse);
      
      const totalNPSResponses = npsResponses.length;
      const averageNPSScore = npsResponses.reduce((sum, response) => sum + response.score, 0) / totalNPSResponses;
      
      const detractors = npsResponses.filter(r => r.category === 'detractor').length;
      const passives = npsResponses.filter(r => r.category === 'passive').length;
      const promoters = npsResponses.filter(r => r.category === 'promoter').length;
      
      const netPromoterScore = ((promoters - detractors) / totalNPSResponses) * 100;
      
      // Get referral data
      const referralQuery = query(collection(db, 'referralTracking'));
      const referralSnapshot = await getDocs(referralQuery);
      const referrals = referralSnapshot.docs.map(doc => doc.data() as ReferralTracking);
      
      const totalReferrals = referrals.length;
      const successfulReferrals = referrals.filter(r => r.registrationCompleted).length;
      const referralConversionRate = (successfulReferrals / totalReferrals) * 100;
      
      // Get testimonial data
      const testimonialQuery = query(collection(db, 'testimonials'));
      const testimonialSnapshot = await getDocs(testimonialQuery);
      const testimonials = testimonialSnapshot.docs.map(doc => doc.data() as TestimonialCollection);
      
      const totalTestimonials = testimonials.length;
      const publishableTestimonials = testimonials.filter(t => t.canUseInMarketing && t.isVerified).length;
      
      // Calculate top advocates (mock implementation)
      const topAdvocates = [
        {
          therapistId: 'advocate-1',
          name: 'Dr. Sarah Chen',
          npsScore: 10,
          referralCount: 5,
          testimonialCount: 2
        }
      ];
      
      return {
        totalNPSResponses,
        averageNPSScore: Math.round(averageNPSScore * 100) / 100,
        npsDistribution: { detractors, passives, promoters },
        netPromoterScore: Math.round(netPromoterScore * 100) / 100,
        totalReferrals,
        successfulReferrals,
        referralConversionRate: Math.round(referralConversionRate * 100) / 100,
        totalTestimonials,
        publishableTestimonials,
        topAdvocates
      };
    } catch (error) {
      console.error('Error getting advocacy metrics:', error);
      throw new Error('Failed to get advocacy metrics');
    }
  }

  /**
   * HELPER METHODS
   */
  
  private getCurrentQuarter(): string {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    return `${year}-Q${quarter}`;
  }
  
  private async initiateTestimonialRequest(therapistId: string): Promise<void> {
    // Implementation would send testimonial request email/notification
    console.log(`Initiating testimonial request for therapist ${therapistId}`);
  }
  
  private async enrollInReferralProgram(therapistId: string): Promise<void> {
    // Implementation would automatically enroll high-scoring therapists in referral program
    console.log(`Enrolling therapist ${therapistId} in referral program`);
  }
  
  private async escalateToSupport(therapistId: string, npsScore: number): Promise<void> {
    // Implementation would create support ticket for low NPS scores
    console.log(`Escalating to support: therapist ${therapistId}, score ${npsScore}`);
  }
  
  private async initiateTestimonialVerification(testimonialId: string): Promise<void> {
    // Implementation would trigger verification workflow
    console.log(`Initiating verification for testimonial ${testimonialId}`);
  }
}

// Export singleton instance
export const advocacyBuildingEngine = AdvocacyBuildingEngine.getInstance();