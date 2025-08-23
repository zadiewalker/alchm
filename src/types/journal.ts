// Comprehensive journal types for ALCHM

import { Timestamp } from 'firebase/firestore';

// Base journal entry structure
export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  emotion?: string;
  mood?: 'positive' | 'neutral' | 'negative' | 'mixed';
  tags?: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  // AI analysis results
  analysis?: JournalAnalysis;
  // Trauma-informed tracking
  traumaIndicators?: TraumaIndicators;
  // Version for optimistic updates
  version: number;
}

// Firestore document structure (with Timestamps)
export interface JournalEntryFirestore {
  userId: string;
  title: string;
  content: string;
  emotion?: string;
  mood?: 'positive' | 'neutral' | 'negative' | 'mixed';
  tags?: string[];
  isPrivate: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  analysis?: JournalAnalysisFirestore;
  traumaIndicators?: TraumaIndicatorsFirestore;
  version: number;
}

// AI analysis structure
export interface JournalAnalysis {
  sentiment: number; // -1 to 1
  emotions: string[];
  themes: string[];
  insights: string[];
  suggestions: string[];
  confidence: number;
  processedAt: Date;
}

export interface JournalAnalysisFirestore {
  sentiment: number;
  emotions: string[];
  themes: string[];
  insights: string[];
  suggestions: string[];
  confidence: number;
  processedAt: Timestamp;
}

// Trauma-informed indicators
export interface TraumaIndicators {
  riskLevel: 'low' | 'medium' | 'high';
  triggers: string[];
  copingStrategies: string[];
  needsSupport: boolean;
  supportResources: string[];
  assessedAt: Date;
}

export interface TraumaIndicatorsFirestore {
  riskLevel: 'low' | 'medium' | 'high';
  triggers: string[];
  copingStrategies: string[];
  needsSupport: boolean;
  supportResources: string[];
  assessedAt: Timestamp;
}

// Query options for pagination and filtering
export interface JournalQueryOptions {
  limit?: number;
  startAfter?: string; // Document ID for pagination
  orderBy?: 'createdAt' | 'updatedAt' | 'title';
  orderDirection?: 'asc' | 'desc';
  where?: {
    field: keyof JournalEntry;
    operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
    value: any;
  }[];
  includeAnalysis?: boolean;
  includeTraumaIndicators?: boolean;
}

// Batch operations
export interface BatchOperation {
  type: 'create' | 'update' | 'delete';
  entry: Partial<JournalEntry>;
  id?: string;
}

// Subscription options for real-time updates
export interface SubscriptionOptions {
  includeAnalysis?: boolean;
  includeTraumaIndicators?: boolean;
  onlyRecent?: boolean; // Only entries from last 30 days
  maxEntries?: number;
}

// Search functionality
export interface SearchOptions {
  query: string;
  fields?: ('title' | 'content' | 'tags')[];
  limit?: number;
  userId: string;
}

export interface SearchResult {
  entries: JournalEntry[];
  total: number;
  hasMore: boolean;
  searchTime: number;
}

// Statistics and insights
export interface JournalStats {
  totalEntries: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
  averageWordsPerEntry: number;
  mostCommonEmotions: { emotion: string; count: number }[];
  mostCommonTags: { tag: string; count: number }[];
  moodTrends: { date: string; mood: string; count: number }[];
  longestStreak: number;
  currentStreak: number;
}

// Offline queue item
export interface OfflineQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  collection: string;
  docId?: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

// Real-time subscription state
export interface SubscriptionState {
  isActive: boolean;
  isOnline: boolean;
  lastUpdate: Date | null;
  error: string | null;
  pendingChanges: number;
}

// Data serialization helpers
export type SerializedJournalEntry = Omit<JournalEntry, 'createdAt' | 'updatedAt' | 'analysis' | 'traumaIndicators'> & {
  createdAt: string;
  updatedAt: string;
  analysis?: Omit<JournalAnalysis, 'processedAt'> & { processedAt: string };
  traumaIndicators?: Omit<TraumaIndicators, 'assessedAt'> & { assessedAt: string };
};

// Performance monitoring
export interface QueryPerformance {
  queryType: string;
  duration: number;
  documentsRead: number;
  cacheHit: boolean;
  timestamp: Date;
}

// Collection names as constants
export const COLLECTIONS = {
  JOURNAL_ENTRIES: 'journalEntries',
  USER_PROFILES: 'userProfiles',
  REFLECTIONS: 'reflections',
  BADGES: 'badges',
  FEEDBACK: 'feedback',
  ANALYTICS: 'analytics'
} as const;

// Firestore security rule helpers
export interface SecurityContext {
  userId: string;
  isAdmin?: boolean;
  isOwner?: boolean;
}

// Error types for database operations
export enum DatabaseErrorCode {
  PERMISSION_DENIED = 'permission-denied',
  NOT_FOUND = 'not-found',
  ALREADY_EXISTS = 'already-exists',
  INVALID_ARGUMENT = 'invalid-argument',
  QUOTA_EXCEEDED = 'quota-exceeded',
  NETWORK_ERROR = 'network-error',
  OFFLINE = 'offline',
  TIMEOUT = 'timeout'
}

export interface DatabaseError {
  code: DatabaseErrorCode;
  message: string;
  details?: any;
}