/**
 * Firebase Integration for ALCHM Pathway System
 * Handles all Firebase operations for the Identity Operating System
 */

import { 
  doc, 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  PathwayUserProfile,
  PathwayProgress,
  PathwaySynergy,
  PathwayMilestone
} from './alchm-master-pathway-orchestrator';

export class FirebasePathwayIntegration {
  private readonly COLLECTIONS = {
    USER_PROFILES: 'pathway_user_profiles',
    PATHWAY_PROGRESS: 'pathway_progress',
    SYNERGIES: 'pathway_synergies',
    MILESTONES: 'pathway_milestones',
    INSIGHTS: 'pathway_insights',
    COACHING_SESSIONS: 'pathway_coaching'
  };

  /**
   * Initialize user pathway profile in Firebase
   */
  async initializeUserProfile(userId: string, initialData: Partial<PathwayUserProfile>): Promise<PathwayUserProfile> {
    const profileRef = doc(db, this.COLLECTIONS.USER_PROFILES, userId);
    
    const defaultProfile: PathwayUserProfile = {
      user_id: userId,
      identity_dimensions: {
        purpose_clarity: 0.3,
        authentic_expression: 0.3,
        cultural_connection: 0.3,
        emotional_intelligence: 0.3,
        somatic_awareness: 0.3,
        creative_expression: 0.3,
        community_belonging: 0.3,
        service_orientation: 0.3
      },
      active_pathways: [],
      completed_pathways: [],
      coherence_score: 0.3,
      trauma_informed_level: 'emerging',
      cultural_adaptation_preferences: {
        primary_cultural_background: 'mixed',
        healing_traditions_interest: ['mindfulness', 'western_therapy'],
        language_preferences: ['en'],
        community_connection_style: 'gradual'
      },
      mastery_level: 'emerging',
      next_breakthrough_prediction: null,
      last_updated: new Date(),
      ...initialData
    };

    await setDoc(profileRef, {
      ...defaultProfile,
      last_updated: serverTimestamp()
    });

    return defaultProfile;
  }

  /**
   * Get user pathway profile from Firebase
   */
  async getUserProfile(userId: string): Promise<PathwayUserProfile | null> {
    try {
      const profileRef = doc(db, this.COLLECTIONS.USER_PROFILES, userId);
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        // Initialize with default profile if doesn't exist
        return await this.initializeUserProfile(userId, {});
      }
      
      const data = profileSnap.data();
      return {
        ...data,
        last_updated: data.last_updated?.toDate() || new Date()
      } as PathwayUserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to retrieve user pathway profile');
    }
  }

  /**
   * Update user pathway profile
   */
  async updateUserProfile(userId: string, updates: Partial<PathwayUserProfile>): Promise<void> {
    try {
      const profileRef = doc(db, this.COLLECTIONS.USER_PROFILES, userId);
      await updateDoc(profileRef, {
        ...updates,
        last_updated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user pathway profile');
    }
  }

  /**
   * Start a new pathway for user
   */
  async startPathway(userId: string, pathwayId: string, userGoals?: any[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Add to user's active pathways
      const profileRef = doc(db, this.COLLECTIONS.USER_PROFILES, userId);
      batch.update(profileRef, {
        active_pathways: arrayUnion({
          pathway_id: pathwayId,
          started_at: serverTimestamp(),
          current_week: 1,
          completion_percentage: 0,
          user_goals: userGoals || [],
          last_activity: serverTimestamp()
        }),
        last_updated: serverTimestamp()
      });

      // Create initial progress tracking typeof window !== 'undefined' && document
      const progressRef = doc(db, this.COLLECTIONS.PATHWAY_PROGRESS, `${userId}_${pathwayId}`);
      batch.set(progressRef, {
        user_id: userId,
        pathway_id: pathwayId,
        started_at: serverTimestamp(),
        current_week: 1,
        completed_milestones: [],
        progress_entries: [],
        insights_generated: [],
        coaching_sessions: [],
        breakthrough_moments: [],
        last_updated: serverTimestamp()
      });

      await batch.commit();
    } catch (error) {
      console.error('Error starting pathway:', error);
      throw new Error('Failed to start pathway');
    }
  }

  /**
   * Log pathway progress
   */
  async logPathwayProgress(userId: string, pathwayId: string, progressData: any): Promise<void> {
    try {
      const progressRef = doc(db, this.COLLECTIONS.PATHWAY_PROGRESS, `${userId}_${pathwayId}`);
      
      await updateDoc(progressRef, {
        progress_entries: arrayUnion({
          ...progressData,
          logged_at: serverTimestamp()
        }),
        last_updated: serverTimestamp()
      });

      // Also update the pathway in user profile
      const profileRef = doc(db, this.COLLECTIONS.USER_PROFILES, userId);
      const profile = await getDoc(profileRef);
      
      if (profile.exists()) {
        const data = profile.data();
        const updatedPathways = data.active_pathways.map((pathway: any) => {
          if (pathway.pathway_id === pathwayId) {
            return {
              ...pathway,
              completion_percentage: progressData.completion_percentage || pathway.completion_percentage,
              current_week: progressData.current_week || pathway.current_week,
              last_activity: serverTimestamp()
            };
          }
          return pathway;
        });

        await updateDoc(profileRef, {
          active_pathways: updatedPathways,
          last_updated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error logging pathway progress:', error);
      throw new Error('Failed to log pathway progress');
    }
  }

  /**
   * Complete a pathway milestone
   */
  async completeMilestone(userId: string, pathwayId: string, milestoneId: string, milestoneData: any): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Update progress typeof window !== 'undefined' && document
      const progressRef = doc(db, this.COLLECTIONS.PATHWAY_PROGRESS, `${userId}_${pathwayId}`);
      batch.update(progressRef, {
        completed_milestones: arrayUnion({
          milestone_id: milestoneId,
          completed_at: serverTimestamp(),
          ...milestoneData
        }),
        last_updated: serverTimestamp()
      });

      // Log milestone completion
      const milestoneRef = doc(db, this.COLLECTIONS.MILESTONES, `${userId}_${pathwayId}_${milestoneId}`);
      batch.set(milestoneRef, {
        user_id: userId,
        pathway_id: pathwayId,
        milestone_id: milestoneId,
        completed_at: serverTimestamp(),
        milestone_data: milestoneData,
        celebration_generated: true
      });

      await batch.commit();
    } catch (error) {
      console.error('Error completing milestone:', error);
      throw new Error('Failed to complete milestone');
    }
  }

  /**
   * Get pathway synergies for user
   */
  async getPathwaySynergies(userId: string): Promise<PathwaySynergy[]> {
    try {
      const synergiesQuery = query(
        collection(db, this.COLLECTIONS.SYNERGIES),
        where('user_id', '==', userId),
        where('status', 'in', ['detected', 'active']),
        orderBy('impact_multiplier', 'desc'),
        limit(10)
      );
      
      const synergiesSnap = await getDocs(synergiesQuery);
      
      return synergiesSnap.docs.map(doc => ({
        ...doc.data(),
        detected_at: doc.data().detected_at?.toDate(),
        activated_at: doc.data().activated_at?.toDate()
      })) as PathwaySynergy[];
    } catch (error) {
      console.error('Error getting pathway synergies:', error);
      return [];
    }
  }

  /**
   * Activate pathway synergy
   */
  async activatePathwaySynergy(userId: string, synergyId: string): Promise<void> {
    try {
      const synergyRef = doc(db, this.COLLECTIONS.SYNERGIES, synergyId);
      await updateDoc(synergyRef, {
        status: 'active',
        activated_at: serverTimestamp(),
        last_updated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error activating synergy:', error);
      throw new Error('Failed to activate pathway synergy');
    }
  }

  /**
   * Store coaching session
   */
  async storeCoachingSession(userId: string, pathwayId: string, sessionData: any): Promise<void> {
    try {
      const sessionRef = doc(collection(db, this.COLLECTIONS.COACHING_SESSIONS));
      await setDoc(sessionRef, {
        user_id: userId,
        pathway_id: pathwayId,
        session_data: sessionData,
        created_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error storing coaching session:', error);
      throw new Error('Failed to store coaching session');
    }
  }

  /**
   * Store pathway insights
   */
  async storePathwayInsights(userId: string, insights: any): Promise<void> {
    try {
      const insightsRef = doc(collection(db, this.COLLECTIONS.INSIGHTS));
      await setDoc(insightsRef, {
        user_id: userId,
        insights: insights,
        generated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error storing insights:', error);
      throw new Error('Failed to store pathway insights');
    }
  }

  /**
   * Get user's pathway progress
   */
  async getPathwayProgress(userId: string, pathwayId?: string): Promise<PathwayProgress[]> {
    try {
      let progressQuery;
      
      if (pathwayId) {
        const progressRef = doc(db, this.COLLECTIONS.PATHWAY_PROGRESS, `${userId}_${pathwayId}`);
        const progressSnap = await getDoc(progressRef);
        
        if (!progressSnap.exists()) {
          return [];
        }
        
        const data = progressSnap.data();
        return [{
          ...data,
          started_at: data.started_at?.toDate(),
          last_updated: data.last_updated?.toDate()
        } as PathwayProgress];
      } else {
        progressQuery = query(
          collection(db, this.COLLECTIONS.PATHWAY_PROGRESS),
          where('user_id', '==', userId),
          orderBy('last_updated', 'desc')
        );
        
        const progressSnap = await getDocs(progressQuery);
        
        return progressSnap.docs.map(doc => ({
          ...doc.data(),
          started_at: doc.data().started_at?.toDate(),
          last_updated: doc.data().last_updated?.toDate()
        })) as PathwayProgress[];
      }
    } catch (error) {
      console.error('Error getting pathway progress:', error);
      return [];
    }
  }

  /**
   * Pause pathway
   */
  async pausePathway(userId: string, pathwayId: string): Promise<void> {
    try {
      const profileRef = doc(db, this.COLLECTIONS.USER_PROFILES, userId);
      const profile = await getDoc(profileRef);
      
      if (profile.exists()) {
        const data = profile.data();
        const updatedPathways = data.active_pathways.map((pathway: any) => {
          if (pathway.pathway_id === pathwayId) {
            return {
              ...pathway,
              status: 'paused',
              paused_at: serverTimestamp()
            };
          }
          return pathway;
        });

        await updateDoc(profileRef, {
          active_pathways: updatedPathways,
          last_updated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error pausing pathway:', error);
      throw new Error('Failed to pause pathway');
    }
  }

  /**
   * Complete pathway
   */
  async completePathway(userId: string, pathwayId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      const profileRef = doc(db, this.COLLECTIONS.USER_PROFILES, userId);
      
      // Move from active to completed pathways
      batch.update(profileRef, {
        active_pathways: arrayRemove({
          pathway_id: pathwayId
        }),
        completed_pathways: arrayUnion({
          pathway_id: pathwayId,
          completed_at: serverTimestamp()
        }),
        last_updated: serverTimestamp()
      });

      await batch.commit();
    } catch (error) {
      console.error('Error completing pathway:', error);
      throw new Error('Failed to complete pathway');
    }
  }
}

export const firebasePathwayIntegration = new FirebasePathwayIntegration();