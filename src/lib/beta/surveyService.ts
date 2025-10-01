// Beta Survey and Interview Scheduling Service

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
  writeBatch
} from 'firebase/firestore';
import {
  BetaSurvey,
  SurveyResponse,
  BetaInterview,
  SurveyQuestion
} from '@/types/beta';
import { messagingService } from './messagingService';
import { betaUserService } from './betaUserService';

const COLLECTIONS = {
  SURVEYS: 'betaSurveys',
  SURVEY_RESPONSES: 'betaSurveyResponses',
  INTERVIEWS: 'betaInterviews',
  INTERVIEW_AVAILABILITY: 'betaInterviewAvailability'
};

export class SurveyService {
  private static instance: SurveyService;
  private db: any;

  private constructor() {}

  static getInstance(): SurveyService {
    if (!SurveyService.instance) {
      SurveyService.instance = new SurveyService();
    }
    return SurveyService.instance;
  }

  private async getDb() {
    if (!this.db) {
      this.db = await getFirebaseDb();
    }
    return this.db;
  }

  // Survey Management
  async createSurvey(survey: Omit<BetaSurvey, 'id' | 'responses' | 'createdAt'>): Promise<BetaSurvey> {
    const db = await this.getDb();
    
    const surveyData: Omit<BetaSurvey, 'id'> = {
      ...survey,
      responses: [],
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.SURVEYS), {
      ...surveyData,
      createdAt: Timestamp.fromDate(surveyData.createdAt),
      scheduledAt: surveyData.scheduledAt ? Timestamp.fromDate(surveyData.scheduledAt) : null,
      expiresAt: surveyData.expiresAt ? Timestamp.fromDate(surveyData.expiresAt) : null
    });

    const createdSurvey = { ...surveyData, id: docRef.id };
    
    // If survey is active and has target cohorts, send invitations
    if (survey.status === 'active' && survey.targetCohort && survey.targetCohort.length > 0) {
      await this.sendSurveyInvitations(docRef.id, survey.targetCohort);
    }

    return createdSurvey;
  }

  async getSurveys(filters?: {
    status?: string;
    type?: string;
    limit?: number;
  }): Promise<BetaSurvey[]> {
    const db = await this.getDb();
    
    let q = query(collection(db, COLLECTIONS.SURVEYS));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        scheduledAt: data.scheduledAt?.toDate(),
        expiresAt: data.expiresAt?.toDate()
      } as BetaSurvey;
    });
  }

  async getSurvey(id: string): Promise<BetaSurvey | null> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.SURVEYS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      scheduledAt: data.scheduledAt?.toDate(),
      expiresAt: data.expiresAt?.toDate()
    } as BetaSurvey;
  }

  async updateSurveyStatus(id: string, status: 'draft' | 'active' | 'completed'): Promise<void> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.SURVEYS, id);
    
    await updateDoc(docRef, { status });
    
    // If activating survey, send invitations
    if (status === 'active') {
      const survey = await this.getSurvey(id);
      if (survey && survey.targetCohort && survey.targetCohort.length > 0) {
        await this.sendSurveyInvitations(id, survey.targetCohort);
      }
    }
  }

  private async sendSurveyInvitations(surveyId: string, targetCohorts: string[]): Promise<void> {
    const survey = await this.getSurvey(surveyId);
    if (!survey) return;
    
    // Get beta users in target cohorts
    const betaUsers = await betaUserService.getBetaUsers();
    const targetUsers = betaUsers
      .filter(user => !user.cohort || targetCohorts.includes(user.cohort))
      .map(user => user.uid);
    
    if (targetUsers.length > 0) {
      await messagingService.sendSurveyInvitation(targetUsers, surveyId, survey.title);
    }
  }

  // Survey Response Management
  async submitSurveyResponse(response: Omit<SurveyResponse, 'id' | 'completedAt'>): Promise<SurveyResponse> {
    const db = await this.getDb();
    
    const responseData: Omit<SurveyResponse, 'id'> = {
      ...response,
      completedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.SURVEY_RESPONSES), {
      ...responseData,
      completedAt: Timestamp.fromDate(responseData.completedAt)
    });

    // Update user metrics
    await betaUserService.updateUserActivity(response.userId, {
      featuresUsed: ['survey_completion']
    });
    
    // Update user's survey completion count
    const betaUser = await betaUserService.getBetaUser(response.userId);
    if (betaUser) {
      await betaUserService.updateBetaUser(betaUser.id, {
        metrics: {
          ...betaUser.metrics,
          surveysCompleted: betaUser.metrics.surveysCompleted + 1
        }
      });
    }

    return { ...responseData, id: docRef.id };
  }

  async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    const db = await this.getDb();
    
    const q = query(
      collection(db, COLLECTIONS.SURVEY_RESPONSES),
      where('surveyId', '==', surveyId),
      orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        completedAt: data.completedAt.toDate()
      } as SurveyResponse;
    });
  }

  async getUserSurveyResponse(surveyId: string, userId: string): Promise<SurveyResponse | null> {
    const db = await this.getDb();
    
    const q = query(
      collection(db, COLLECTIONS.SURVEY_RESPONSES),
      where('surveyId', '==', surveyId),
      where('userId', '==', userId),
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
      completedAt: data.completedAt.toDate()
    } as SurveyResponse;
  }

  // Interview Management
  async scheduleInterview(interview: Omit<BetaInterview, 'id'>): Promise<BetaInterview> {
    const db = await this.getDb();
    
    const docRef = await addDoc(collection(db, COLLECTIONS.INTERVIEWS), {
      ...interview,
      scheduledAt: Timestamp.fromDate(interview.scheduledAt)
    });

    const createdInterview = { ...interview, id: docRef.id };
    
    // Send interview invitation
    await messagingService.sendInterviewInvitation(
      interview.userId,
      docRef.id,
      interview.scheduledAt
    );
    
    return createdInterview;
  }

  async getInterviews(filters?: {
    userId?: string;
    status?: string;
    type?: string;
    limit?: number;
  }): Promise<BetaInterview[]> {
    const db = await this.getDb();
    
    let q = query(collection(db, COLLECTIONS.INTERVIEWS));
    
    if (filters?.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    q = query(q, orderBy('scheduledAt', 'desc'));
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        scheduledAt: data.scheduledAt.toDate()
      } as BetaInterview;
    });
  }

  async updateInterviewStatus(
    id: string,
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show',
    notes?: string
  ): Promise<void> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.INTERVIEWS, id);
    
    const updateData: any = { status };
    if (notes) {
      updateData.notes = notes;
    }
    
    await updateDoc(docRef, updateData);
    
    // Update user metrics if completed
    if (status === 'completed') {
      const interview = await this.getInterview(id);
      if (interview) {
        const betaUser = await betaUserService.getBetaUser(interview.userId);
        if (betaUser) {
          await betaUserService.updateBetaUser(betaUser.id, {
            metrics: {
              ...betaUser.metrics,
              interviewsCompleted: betaUser.metrics.interviewsCompleted + 1
            }
          });
        }
      }
    }
  }

  async getInterview(id: string): Promise<BetaInterview | null> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.INTERVIEWS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      scheduledAt: data.scheduledAt.toDate()
    } as BetaInterview;
  }

  // Automated Survey Creation
  async createWeeklySurvey(targetCohorts?: string[]): Promise<BetaSurvey> {
    const questions: SurveyQuestion[] = [
      {
        id: 'overall_satisfaction',
        type: 'rating',
        question: 'How satisfied are you with the beta experience this week?',
        required: true,
        minValue: 1,
        maxValue: 5
      },
      {
        id: 'features_used',
        type: 'multiple_choice',
        question: 'Which features did you test this week?',
        required: false,
        options: ['Journaling', 'Dashboard', 'Pathways', 'Crisis Support', 'Other']
      },
      {
        id: 'issues_encountered',
        type: 'text',
        question: 'Did you encounter any issues or bugs this week? Please describe.',
        required: false
      },
      {
        id: 'suggestions',
        type: 'text',
        question: 'Any suggestions for improvement?',
        required: false
      },
      {
        id: 'likelihood_recommend',
        type: 'rating',
        question: 'How likely are you to recommend this app to others?',
        required: true,
        minValue: 0,
        maxValue: 10
      }
    ];

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.createSurvey({
      title: `Weekly Beta Feedback - ${now.toISOString().split('T')[0]}`,
      description: 'Help us improve by sharing your weekly beta testing experience.',
      type: 'weekly',
      status: 'active',
      targetCohort: targetCohorts || ['all'],
      questions,
      scheduledAt: now,
      expiresAt: nextWeek
    });
  }

  async createFeatureFeedbackSurvey(featureName: string, targetCohorts?: string[]): Promise<BetaSurvey> {
    const questions: SurveyQuestion[] = [
      {
        id: 'feature_used',
        type: 'boolean',
        question: `Have you used the ${featureName} feature?`,
        required: true
      },
      {
        id: 'ease_of_use',
        type: 'rating',
        question: `How easy was it to use the ${featureName} feature?`,
        required: true,
        minValue: 1,
        maxValue: 5
      },
      {
        id: 'usefulness',
        type: 'rating',
        question: `How useful is the ${featureName} feature for you?`,
        required: true,
        minValue: 1,
        maxValue: 5
      },
      {
        id: 'issues',
        type: 'text',
        question: `Did you encounter any issues with the ${featureName} feature?`,
        required: false
      },
      {
        id: 'improvements',
        type: 'text',
        question: `What improvements would you suggest for the ${featureName} feature?`,
        required: false
      }
    ];

    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    return this.createSurvey({
      title: `${featureName} Feature Feedback`,
      description: `We'd love your feedback on our new ${featureName} feature.`,
      type: 'feature_specific',
      status: 'active',
      targetCohort: targetCohorts || ['all'],
      questions,
      scheduledAt: new Date(),
      expiresAt
    });
  }

  async createOnboardingSurvey(userId: string): Promise<BetaSurvey> {
    const questions: SurveyQuestion[] = [
      {
        id: 'onboarding_clarity',
        type: 'rating',
        question: 'How clear was the onboarding process?',
        required: true,
        minValue: 1,
        maxValue: 5
      },
      {
        id: 'setup_difficulty',
        type: 'rating',
        question: 'How easy was it to set up your beta account?',
        required: true,
        minValue: 1,
        maxValue: 5
      },
      {
        id: 'expectations',
        type: 'multiple_choice',
        question: 'What are your main expectations from this beta program?',
        required: true,
        options: [
          'Testing new features',
          'Providing feedback',
          'Early access to updates',
          'Influencing product direction',
          'Learning about the product'
        ]
      },
      {
        id: 'previous_experience',
        type: 'multiple_choice',
        question: 'Have you participated in beta testing programs before?',
        required: true,
        options: ['Yes, many times', 'Yes, a few times', 'Once or twice', 'Never']
      },
      {
        id: 'additional_comments',
        type: 'text',
        question: 'Any additional comments or questions?',
        required: false
      }
    ];

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return this.createSurvey({
      title: 'Beta Onboarding Feedback',
      description: 'Help us improve the onboarding experience for new beta testers.',
      type: 'onboarding',
      status: 'active',
      targetCohort: [userId],
      questions,
      scheduledAt: new Date(),
      expiresAt
    });
  }

  // Automated Interview Scheduling
  async scheduleOnboardingInterview(userId: string, preferredTimes?: Date[]): Promise<BetaInterview | null> {
    // Find an available time slot
    const availableSlot = await this.findAvailableInterviewSlot(preferredTimes);
    
    if (!availableSlot) {
      return null;
    }

    return this.scheduleInterview({
      userId,
      type: 'onboarding',
      status: 'scheduled',
      scheduledAt: availableSlot,
      duration: 30, // 30 minutes
      interviewer: 'auto-assigned',
      topics: ['Onboarding experience', 'Initial impressions', 'Beta testing goals'],
      insights: [],
      followUpActions: []
    });
  }

  async scheduleFeatureFeedbackInterview(userId: string, featureName: string): Promise<BetaInterview | null> {
    const availableSlot = await this.findAvailableInterviewSlot();
    
    if (!availableSlot) {
      return null;
    }

    return this.scheduleInterview({
      userId,
      type: 'feature_feedback',
      status: 'scheduled',
      scheduledAt: availableSlot,
      duration: 45, // 45 minutes
      interviewer: 'auto-assigned',
      topics: [`${featureName} feature feedback`, 'User experience', 'Improvement suggestions'],
      insights: [],
      followUpActions: []
    });
  }

  private async findAvailableInterviewSlot(preferredTimes?: Date[]): Promise<Date | null> {
    // This would integrate with a calendar system
    // For now, we'll return a slot 3 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    futureDate.setHours(14, 0, 0, 0); // 2 PM
    
    return futureDate;
  }

  // Analytics and Reporting
  async getSurveyAnalytics(surveyId: string): Promise<{
    responseRate: number;
    completionRate: number;
    avgTimeSpent: number;
    questionAnalytics: any[];
  }> {
    const survey = await this.getSurvey(surveyId);
    const responses = await this.getSurveyResponses(surveyId);
    
    if (!survey || !survey.targetCohort) {
      return {
        responseRate: 0,
        completionRate: 0,
        avgTimeSpent: 0,
        questionAnalytics: []
      };
    }
    
    // Calculate metrics
    const targetUsers = await this.getTargetUserCount(survey.targetCohort);
    const responseRate = targetUsers > 0 ? (responses.length / targetUsers) * 100 : 0;
    const completionRate = 100; // All responses are completed
    const avgTimeSpent = responses.reduce((sum, r) => sum + r.timeSpent, 0) / responses.length || 0;
    
    // Question analytics
    const questionAnalytics = survey.questions.map(question => {
      const answers = responses.map(r => r.answers[question.id]).filter(a => a !== undefined);
      
      if (question.type === 'rating' || question.type === 'range') {
        const numericAnswers = answers.filter(a => typeof a === 'number') as number[];
        return {
          questionId: question.id,
          question: question.question,
          type: question.type,
          responseCount: answers.length,
          average: numericAnswers.reduce((sum, a) => sum + a, 0) / numericAnswers.length || 0,
          distribution: this.getDistribution(numericAnswers)
        };
      } else if (question.type === 'multiple_choice') {
        return {
          questionId: question.id,
          question: question.question,
          type: question.type,
          responseCount: answers.length,
          distribution: this.getChoiceDistribution(answers as string[], question.options || [])
        };
      } else {
        return {
          questionId: question.id,
          question: question.question,
          type: question.type,
          responseCount: answers.length,
          responses: answers
        };
      }
    });
    
    return {
      responseRate,
      completionRate,
      avgTimeSpent,
      questionAnalytics
    };
  }

  private async getTargetUserCount(targetCohorts: string[]): Promise<number> {
    const betaUsers = await betaUserService.getBetaUsers();
    return betaUsers.filter(user => 
      !user.cohort || targetCohorts.includes(user.cohort) || targetCohorts.includes('all')
    ).length;
  }

  private getDistribution(values: number[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    values.forEach(value => {
      distribution[value.toString()] = (distribution[value.toString()] || 0) + 1;
    });
    return distribution;
  }

  private getChoiceDistribution(values: string[], options: string[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    options.forEach(option => {
      distribution[option] = values.filter(v => v === option).length;
    });
    return distribution;
  }

  // Automated Scheduling
  async processScheduledSurveys(): Promise<void> {
    const surveys = await this.getSurveys({ status: 'draft' });
    const now = new Date();
    
    for (const survey of surveys) {
      if (survey.scheduledAt && survey.scheduledAt <= now) {
        await this.updateSurveyStatus(survey.id, 'active');
      }
    }
  }

  async processExpiredSurveys(): Promise<void> {
    const surveys = await this.getSurveys({ status: 'active' });
    const now = new Date();
    
    for (const survey of surveys) {
      if (survey.expiresAt && survey.expiresAt <= now) {
        await this.updateSurveyStatus(survey.id, 'completed');
      }
    }
  }

  // Cleanup
  async deleteSurvey(id: string): Promise<void> {
    const db = await this.getDb();
    await deleteDoc(doc(db, COLLECTIONS.SURVEYS, id));
  }

  async deleteInterview(id: string): Promise<void> {
    const db = await this.getDb();
    await deleteDoc(doc(db, COLLECTIONS.INTERVIEWS, id));
  }
}

export const surveyService = SurveyService.getInstance();