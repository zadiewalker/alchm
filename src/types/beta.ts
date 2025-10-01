// Beta Testing Platform Types

export interface BetaUser {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  joinedAt: Date;
  status: 'pending' | 'active' | 'inactive' | 'completed';
  cohort?: string;
  testingPhase: 'alpha' | 'beta' | 'rc';
  permissions: BetaPermissions;
  profile: BetaUserProfile;
  metrics: BetaUserMetrics;
}

export interface BetaUserProfile {
  age?: number;
  location?: string;
  primaryDevice: 'mobile' | 'tablet' | 'desktop';
  operatingSystem: string;
  browser: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  availabilityHours: number;
  timeZone: string;
  communicationPreferences: {
    email: boolean;
    inApp: boolean;
    sms: boolean;
  };
}

export interface BetaPermissions {
  canAccessBetaFeatures: boolean;
  canReportBugs: boolean;
  canParticipateInSurveys: boolean;
  canScheduleInterviews: boolean;
  canAccessAnalytics: boolean;
  featureFlags: string[];
}

export interface BetaUserMetrics {
  sessionsCount: number;
  totalTimeSpent: number;
  featuresUsed: string[];
  bugsReported: number;
  feedbackSubmitted: number;
  surveysCompleted: number;
  interviewsCompleted: number;
  lastActiveAt: Date;
  engagementScore: number;
}

export interface BetaFeedback {
  id: string;
  userId: string;
  type: 'bug' | 'feature_request' | 'usability' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  tags: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  votes: number;
  createdAt: Date;
  updatedAt: Date;
  context: FeedbackContext;
  attachments: FeedbackAttachment[];
  responses: FeedbackResponse[];
}

export interface FeedbackContext {
  page: string;
  url: string;
  userAgent: string;
  viewport: { width: number; height: number };
  device: DeviceInfo;
  sessionId: string;
  timestamp: Date;
  actionsBefore: UserAction[];
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  browserVersion: string;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  touchSupport: boolean;
  connectionType?: string;
}

export interface UserAction {
  type: 'click' | 'scroll' | 'input' | 'navigation';
  target: string;
  timestamp: Date;
  details?: any;
}

export interface FeedbackAttachment {
  id: string;
  type: 'screenshot' | 'video' | 'log' | 'file';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface FeedbackResponse {
  id: string;
  authorId: string;
  authorType: 'beta_user' | 'developer' | 'admin';
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface BetaSurvey {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'feature_specific' | 'exit' | 'onboarding';
  status: 'draft' | 'active' | 'completed';
  targetCohort?: string[];
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  scheduledAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'boolean' | 'range';
  question: string;
  required: boolean;
  options?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface SurveyResponse {
  id: string;
  userId: string;
  surveyId: string;
  answers: Record<string, any>;
  completedAt: Date;
  timeSpent: number;
}

export interface BetaInterview {
  id: string;
  userId: string;
  type: 'onboarding' | 'feature_feedback' | 'usability' | 'exit';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  scheduledAt: Date;
  duration: number;
  interviewer: string;
  topics: string[];
  notes?: string;
  recording?: string;
  insights: string[];
  followUpActions: string[];
}

export interface BetaAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    avgEngagementScore: number;
    bugReports: number;
    featureRequests: number;
    surveysCompleted: number;
    interviewsCompleted: number;
  };
  engagement: {
    dailyActiveUsers: TimeSeries[];
    sessionDuration: TimeSeries[];
    featureAdoption: FeatureAdoption[];
    userRetention: RetentionData[];
  };
  feedback: {
    bugsByPriority: CategoryData[];
    feedbackByType: CategoryData[];
    resolutionTime: TimeSeries[];
    satisfactionScores: TimeSeries[];
  };
  testing: {
    coverageByFeature: FeatureCoverage[];
    testingEffectiveness: TimeSeries[];
    issueDiscoveryRate: TimeSeries[];
  };
}

export interface TimeSeries {
  date: string;
  value: number;
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

export interface FeatureAdoption {
  feature: string;
  adoptionRate: number;
  usageCount: number;
  avgTimeSpent: number;
}

export interface RetentionData {
  cohort: string;
  day1: number;
  day7: number;
  day14: number;
  day30: number;
}

export interface FeatureCoverage {
  feature: string;
  coverage: number;
  usersTestedCount: number;
  bugsFound: number;
  feedbackCount: number;
}

export interface BetaMessage {
  id: string;
  type: 'announcement' | 'update' | 'survey' | 'interview' | 'reminder';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  targetUsers: string[];
  deliveryMethod: ('email' | 'in_app' | 'push')[];
  scheduledAt: Date;
  sentAt?: Date;
  readBy: string[];
  actionRequired: boolean;
  actionUrl?: string;
  expiresAt?: Date;
}

export interface BetaRecruitment {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  status: 'open' | 'closed' | 'paused';
  criteria: RecruitmentCriteria;
  application: ApplicationForm;
  createdAt: Date;
  closesAt?: Date;
}

export interface RecruitmentCriteria {
  minAge?: number;
  maxAge?: number;
  locations?: string[];
  devices?: string[];
  experience?: string[];
  availability?: number;
  interests?: string[];
}

export interface ApplicationForm {
  questions: ApplicationQuestion[];
  requiredDocuments?: string[];
  agreedToTerms: boolean;
  agreedToNDA: boolean;
}

export interface ApplicationQuestion {
  id: string;
  type: 'text' | 'multiple_choice' | 'boolean' | 'file';
  question: string;
  required: boolean;
  options?: string[];
  maxLength?: number;
}

export interface BetaApplication {
  id: string;
  recruitmentId: string;
  applicantEmail: string;
  answers: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  score: number;
  reviewNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}