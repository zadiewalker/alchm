// Beta User Management Service

import { getFirebaseDb } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import {
  BetaUser,
  BetaUserProfile,
  BetaPermissions,
  BetaUserMetrics,
  BetaApplication,
  BetaRecruitment
} from '@/types/beta';

const COLLECTIONS = {
  BETA_USERS: 'betaUsers',
  BETA_APPLICATIONS: 'betaApplications',
  BETA_RECRUITMENT: 'betaRecruitment',
  BETA_ANALYTICS: 'betaAnalytics'
};

export class BetaUserService {
  private static instance: BetaUserService;
  private db: any;

  private constructor() {}

  static getInstance(): BetaUserService {
    if (!BetaUserService.instance) {
      BetaUserService.instance = new BetaUserService();
    }
    return BetaUserService.instance;
  }

  private async getDb() {
    if (!this.db) {
      this.db = await getFirebaseDb();
    }
    return this.db;
  }

  // Beta User Management
  async createBetaUser(uid: string, profile: Partial<BetaUserProfile>): Promise<BetaUser> {
    const db = await this.getDb();
    
    const defaultPermissions: BetaPermissions = {
      canAccessBetaFeatures: true,
      canReportBugs: true,
      canParticipateInSurveys: true,
      canScheduleInterviews: false,
      canAccessAnalytics: false,
      featureFlags: ['basic_beta_features']
    };

    const defaultMetrics: BetaUserMetrics = {
      sessionsCount: 0,
      totalTimeSpent: 0,
      featuresUsed: [],
      bugsReported: 0,
      feedbackSubmitted: 0,
      surveysCompleted: 0,
      interviewsCompleted: 0,
      lastActiveAt: new Date(),
      engagementScore: 0
    };

    const betaUser: Omit<BetaUser, 'id'> = {
      uid,
      email: profile.email || '',
      displayName: profile.displayName,
      joinedAt: new Date(),
      status: 'pending',
      testingPhase: 'beta',
      permissions: defaultPermissions,
      profile: {
        primaryDevice: profile.primaryDevice || 'desktop',
        operatingSystem: profile.operatingSystem || '',
        browser: profile.browser || '',
        experience: profile.experience || 'beginner',
        interests: profile.interests || [],
        availabilityHours: profile.availabilityHours || 5,
        timeZone: profile.timeZone || 'UTC',
        communicationPreferences: {
          email: true,
          inApp: true,
          sms: false
        },
        ...profile
      },
      metrics: defaultMetrics
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.BETA_USERS), {
      ...betaUser,
      joinedAt: Timestamp.fromDate(betaUser.joinedAt),
      'metrics.lastActiveAt': Timestamp.fromDate(defaultMetrics.lastActiveAt)
    });

    return { ...betaUser, id: docRef.id };
  }

  async getBetaUser(uid: string): Promise<BetaUser | null> {
    const db = await this.getDb();
    
    const q = query(
      collection(db, COLLECTIONS.BETA_USERS),
      where('uid', '==', uid),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      joinedAt: data.joinedAt.toDate(),
      'metrics.lastActiveAt': data['metrics.lastActiveAt'].toDate()
    } as BetaUser;
  }

  async updateBetaUser(id: string, updates: Partial<BetaUser>): Promise<void> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.BETA_USERS, id);
    
    const updateData: any = { ...updates };
    
    // Convert dates to Firestore timestamps
    if (updates.joinedAt) {
      updateData.joinedAt = Timestamp.fromDate(updates.joinedAt);
    }
    if (updates.metrics?.lastActiveAt) {
      updateData['metrics.lastActiveAt'] = Timestamp.fromDate(updates.metrics.lastActiveAt);
    }

    await updateDoc(docRef, updateData);
  }

  async updateUserActivity(uid: string, activity: {
    sessionDuration?: number;
    featuresUsed?: string[];
    pageVisited?: string;
  }): Promise<void> {
    const db = await this.getDb();
    
    const q = query(
      collection(db, COLLECTIONS.BETA_USERS),
      where('uid', '==', uid),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = doc(db, COLLECTIONS.BETA_USERS, snapshot.docs[0].id);
      
      const updates: any = {
        'metrics.sessionsCount': increment(1),
        'metrics.lastActiveAt': Timestamp.fromDate(new Date())
      };

      if (activity.sessionDuration) {
        updates['metrics.totalTimeSpent'] = increment(activity.sessionDuration);
      }

      await updateDoc(docRef, updates);

      // Update features used array if provided
      if (activity.featuresUsed && activity.featuresUsed.length > 0) {
        const userDoc = await getDoc(docRef);
        const userData = userDoc.data();
        const currentFeatures = userData?.metrics?.featuresUsed || [];
        const newFeatures = [...new Set([...currentFeatures, ...activity.featuresUsed])];
        
        await updateDoc(docRef, {
          'metrics.featuresUsed': newFeatures
        });
      }
    }
  }

  async getBetaUsers(filters?: {
    status?: string;
    cohort?: string;
    testingPhase?: string;
    limit?: number;
  }): Promise<BetaUser[]> {
    const db = await this.getDb();
    
    let q = query(collection(db, COLLECTIONS.BETA_USERS));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.cohort) {
      q = query(q, where('cohort', '==', filters.cohort));
    }
    
    if (filters?.testingPhase) {
      q = query(q, where('testingPhase', '==', filters.testingPhase));
    }
    
    q = query(q, orderBy('joinedAt', 'desc'));
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        joinedAt: data.joinedAt.toDate(),
        'metrics.lastActiveAt': data['metrics.lastActiveAt'].toDate()
      } as BetaUser;
    });
  }

  // Beta Recruitment Management
  async createRecruitment(recruitment: Omit<BetaRecruitment, 'id' | 'currentCount' | 'createdAt'>): Promise<BetaRecruitment> {
    const db = await this.getDb();
    
    const recruitmentData: Omit<BetaRecruitment, 'id'> = {
      ...recruitment,
      currentCount: 0,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.BETA_RECRUITMENT), {
      ...recruitmentData,
      createdAt: Timestamp.fromDate(recruitmentData.createdAt),
      closesAt: recruitment.closesAt ? Timestamp.fromDate(recruitment.closesAt) : null
    });

    return { ...recruitmentData, id: docRef.id };
  }

  async getActiveRecruitments(): Promise<BetaRecruitment[]> {
    const db = await this.getDb();
    
    const q = query(
      collection(db, COLLECTIONS.BETA_RECRUITMENT),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        closesAt: data.closesAt?.toDate()
      } as BetaRecruitment;
    });
  }

  // Beta Application Management
  async submitApplication(application: Omit<BetaApplication, 'id' | 'submittedAt' | 'status' | 'score'>): Promise<BetaApplication> {
    const db = await this.getDb();
    
    const applicationData: Omit<BetaApplication, 'id'> = {
      ...application,
      status: 'pending',
      score: 0,
      submittedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.BETA_APPLICATIONS), {
      ...applicationData,
      submittedAt: Timestamp.fromDate(applicationData.submittedAt)
    });

    // Update recruitment current count
    const recruitmentRef = doc(db, COLLECTIONS.BETA_RECRUITMENT, application.recruitmentId);
    await updateDoc(recruitmentRef, {
      currentCount: increment(1)
    });

    return { ...applicationData, id: docRef.id };
  }

  async reviewApplication(id: string, decision: 'approved' | 'rejected' | 'waitlisted', reviewNotes?: string, reviewerId?: string): Promise<void> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.BETA_APPLICATIONS, id);
    
    const updates: any = {
      status: decision,
      reviewedAt: Timestamp.fromDate(new Date()),
      reviewNotes: reviewNotes || '',
      reviewedBy: reviewerId || 'system'
    };

    await updateDoc(docRef, updates);

    // If approved, create beta user account
    if (decision === 'approved') {
      const appDoc = await getDoc(docRef);
      const appData = appDoc.data();
      
      if (appData) {
        // Extract profile information from application answers
        const profile: Partial<BetaUserProfile> = {
          email: appData.applicantEmail,
          primaryDevice: appData.answers.primaryDevice || 'desktop',
          operatingSystem: appData.answers.operatingSystem || '',
          browser: appData.answers.browser || '',
          experience: appData.answers.experience || 'beginner',
          interests: appData.answers.interests || [],
          availabilityHours: appData.answers.availabilityHours || 5,
          timeZone: appData.answers.timeZone || 'UTC'
        };

        // Create a temporary UID for the beta user (will be replaced when they actually sign up)
        const tempUid = `beta_${id}_${Date.now()}`;
        await this.createBetaUser(tempUid, profile);
      }
    }
  }

  async getApplications(recruitmentId?: string): Promise<BetaApplication[]> {
    const db = await this.getDb();
    
    let q = query(collection(db, COLLECTIONS.BETA_APPLICATIONS));
    
    if (recruitmentId) {
      q = query(q, where('recruitmentId', '==', recruitmentId));
    }
    
    q = query(q, orderBy('submittedAt', 'desc'));

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt.toDate(),
        reviewedAt: data.reviewedAt?.toDate()
      } as BetaApplication;
    });
  }

  // Feature Flag Management
  async updateFeatureFlags(uid: string, flags: string[]): Promise<void> {
    const user = await this.getBetaUser(uid);
    if (user) {
      await this.updateBetaUser(user.id, {
        permissions: {
          ...user.permissions,
          featureFlags: flags
        }
      });
    }
  }

  async hasFeatureFlag(uid: string, flag: string): Promise<boolean> {
    const user = await this.getBetaUser(uid);
    return user?.permissions.featureFlags.includes(flag) || false;
  }

  // Engagement Scoring
  async calculateEngagementScore(uid: string): Promise<number> {
    const user = await this.getBetaUser(uid);
    if (!user) return 0;

    const { metrics } = user;
    const daysSinceJoined = Math.max(1, Math.floor((Date.now() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Engagement score calculation (0-100)
    const sessionScore = Math.min(30, metrics.sessionsCount * 2);
    const timeScore = Math.min(20, (metrics.totalTimeSpent / 3600) * 2); // Hours to score
    const featureScore = Math.min(25, metrics.featuresUsed.length * 5);
    const feedbackScore = Math.min(15, (metrics.bugsReported + metrics.feedbackSubmitted) * 3);
    const surveyScore = Math.min(10, metrics.surveysCompleted * 5);
    
    // Decay factor for inactive users
    const daysSinceActive = Math.floor((Date.now() - metrics.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24));
    const decayFactor = Math.max(0.1, 1 - (daysSinceActive * 0.1));
    
    const baseScore = sessionScore + timeScore + featureScore + feedbackScore + surveyScore;
    const finalScore = Math.round(baseScore * decayFactor);
    
    // Update the engagement score
    await this.updateBetaUser(user.id, {
      metrics: {
        ...metrics,
        engagementScore: finalScore
      }
    });

    return finalScore;
  }

  // Cleanup
  async deleteBetaUser(id: string): Promise<void> {
    const db = await this.getDb();
    await deleteDoc(doc(db, COLLECTIONS.BETA_USERS, id));
  }

  async archiveInactiveUsers(daysInactive: number = 30): Promise<number> {
    const db = await this.getDb();
    const cutoffDate = new Date(Date.now() - (daysInactive * 24 * 60 * 60 * 1000));
    
    const q = query(
      collection(db, COLLECTIONS.BETA_USERS),
      where('metrics.lastActiveAt', '<=', Timestamp.fromDate(cutoffDate)),
      where('status', '==', 'active')
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'inactive' });
    });

    await batch.commit();
    return snapshot.docs.length;
  }
}

export const betaUserService = BetaUserService.getInstance();