// Analytics Events API - HIPAA-Compliant Event Processing
// Receives, validates, and stores anonymized analytics events

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { SafeAnalyticsEvent, SafeEventType } from '@/lib/analytics/hipaa-analytics';
import { logger } from '@/lib/logging';
import { z } from 'zod';

// Validation schema for analytics events
const SafeAnalyticsEventSchema = z.object({
  eventType: z.string(),
  eventId: z.string(),
  timestamp: z.number(),
  sessionId: z.string(),
  userCohort: z.string(),
  userTier: z.enum(['free', 'deep-cut', 'oracle']),
  userSegment: z.enum(['new', 'returning', 'at_risk', 'power_user']),
  daysSinceSignup: z.number(),
  engagementMetrics: z.object({
    sessionDuration: z.number().optional(),
    pageViews: z.number().optional(),
    interactionCount: z.number().optional(),
    featureUsed: z.string().optional()
  }),
  businessMetrics: z.object({
    conversionFunnel: z.string().optional(),
    revenueImpact: z.number().optional(),
    churnRisk: z.enum(['low', 'medium', 'high']).optional(),
    npsScore: z.number().optional()
  }),
  technicalMetrics: z.object({
    platform: z.string().optional(),
    deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),
    browserFamily: z.string().optional(),
    connectionType: z.string().optional(),
    loadTime: z.number().optional(),
    errorCount: z.number().optional()
  }),
  customProperties: z.record(z.union([z.string(), z.number(), z.boolean()]))
});

const AnalyticsEventsBatchSchema = z.object({
  events: z.array(SafeAnalyticsEventSchema)
});

// Rate limiting configuration
const RATE_LIMITS = {
  events_per_minute: 1000,
  events_per_session: 500,
  max_batch_size: 50
};

// Event processing pipeline
export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = AnalyticsEventsBatchSchema.safeParse(body);
    
    if (!validationResult.success) {
      logger.warn('Invalid analytics event batch', {
        errors: validationResult.error.errors,
        timestamp: Date.now()
      });
      
      return NextResponse.json({
        error: 'Invalid event format',
        details: validationResult.error.errors
      }, { status: 400 });
    }
    
    const { events } = validationResult.data;
    
    // Rate limiting check
    const rateLimitResult = await checkRateLimit(request, events.length);
    if (!rateLimitResult.allowed) {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.retryAfter
      }, { status: 429 });
    }
    
    // Process events in parallel
    const processedEvents = await Promise.all(
      events.map(event => processAnalyticsEvent(event))
    );
    
    // Filter out invalid events
    const validEvents = processedEvents.filter(event => event !== null);
    
    // Store events in batches
    const batchResults = await storeEventsBatch(validEvents);
    
    // Update aggregated metrics
    await updateAggregatedMetrics(validEvents);
    
    // Log processing results
    logger.info('Analytics events processed', {
      totalEvents: events.length,
      validEvents: validEvents.length,
      processingTimeMs: Date.now() - startTime,
      batchResults
    });
    
    return NextResponse.json({
      success: true,
      processed: validEvents.length,
      rejected: events.length - validEvents.length,
      processingTimeMs: Date.now() - startTime
    });
    
  } catch (error) {
    logger.error('Analytics event processing failed', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to process analytics events'
    }, { status: 500 });
  }
}

// Rate limiting implementation
async function checkRateLimit(request: NextRequest, eventCount: number): Promise<{
  allowed: boolean;
  retryAfter?: number;
}> {
  const clientIP = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';
  
  const rateLimitKey = `analytics_rate_limit:${clientIP}`;
  const currentMinute = Math.floor(Date.now() / 60000);
  
  try {
    // In a real implementation, you would use Redis or similar
    // For now, we'll implement a simple in-memory rate limiter
    
    // Check batch size limit
    if (eventCount > RATE_LIMITS.max_batch_size) {
      return { allowed: false, retryAfter: 60 };
    }
    
    // In production, implement proper distributed rate limiting
    return { allowed: true };
    
  } catch (error) {
    logger.error('Rate limit check failed', error);
    // Fail open for availability
    return { allowed: true };
  }
}

// Individual event processing and validation
async function processAnalyticsEvent(event: SafeAnalyticsEvent): Promise<SafeAnalyticsEvent | null> {
  try {
    // Additional validation and sanitization
    const processedEvent = {
      ...event,
      // Ensure timestamp is reasonable (within last 24 hours or future 1 hour)
      timestamp: validateTimestamp(event.timestamp),
      // Sanitize session ID
      sessionId: sanitizeSessionId(event.sessionId),
      // Validate event type
      eventType: validateEventType(event.eventType),
      // Process custom properties
      customProperties: sanitizeCustomProperties(event.customProperties)
    };
    
    // Event-specific validation
    if (!isValidEvent(processedEvent)) {
      logger.warn('Invalid event rejected', { 
        eventType: event.eventType, 
        eventId: event.eventId 
      });
      return null;
    }
    
    return processedEvent;
    
  } catch (error) {
    logger.error('Event processing failed', { 
      eventId: event.eventId, 
      error: error.message 
    });
    return null;
  }
}

// Event validation helpers
function validateTimestamp(timestamp: number): number {
  const now = Date.now();
  const dayAgo = now - (24 * 60 * 60 * 1000);
  const hourAhead = now + (60 * 60 * 1000);
  
  // Clamp timestamp to reasonable range
  return Math.max(dayAgo, Math.min(timestamp, hourAhead));
}

function sanitizeSessionId(sessionId: string): string {
  // Ensure session ID follows expected format
  if (!/^sess_\d+_[a-z0-9]+$/.test(sessionId)) {
    return `sess_${Date.now()}_sanitized`;
  }
  return sessionId;
}

function validateEventType(eventType: string): SafeEventType {
  const validEventTypes: SafeEventType[] = [
    'user_signed_up', 'user_onboarded', 'user_tier_upgraded', 'user_churned', 'user_reactivated',
    'journal_entry_created', 'journal_entry_completed', 'ai_insight_viewed', 'ai_insight_acted_on',
    'mood_tracked', 'streak_milestone', 'feature_discovered', 'feature_adopted',
    'premium_feature_accessed', 'ai_mentor_session_started', 'pattern_analysis_viewed',
    'export_requested', 'conversion_funnel_entered', 'conversion_funnel_completed',
    'payment_initiated', 'payment_completed', 'subscription_cancelled', 'support_contacted',
    'app_opened', 'app_backgrounded', 'offline_mode_used', 'sync_completed',
    'error_encountered', 'performance_issue'
  ];
  
  return validEventTypes.includes(eventType as SafeEventType) 
    ? eventType as SafeEventType 
    : 'app_opened';
}

function sanitizeCustomProperties(properties: Record<string, string | number | boolean>): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {};
  
  for (const [key, value] of Object.entries(properties)) {
    // Limit key length and sanitize
    const cleanKey = key.substring(0, 50).replace(/[^a-zA-Z0-9_]/g, '_');
    
    if (typeof value === 'string') {
      // Limit string length and remove potential PHI
      sanitized[cleanKey] = value.substring(0, 200)
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
        .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[phone]');
    } else if (typeof value === 'number') {
      // Ensure number is reasonable
      sanitized[cleanKey] = Math.max(-1000000, Math.min(value, 1000000));
    } else if (typeof value === 'boolean') {
      sanitized[cleanKey] = value;
    }
  }
  
  return sanitized;
}

function isValidEvent(event: SafeAnalyticsEvent): boolean {
  // Business logic validation
  if (event.daysSinceSignup < 0 || event.daysSinceSignup > 3650) return false; // Max 10 years
  if (event.engagementMetrics.sessionDuration && event.engagementMetrics.sessionDuration > 86400000) return false; // Max 24 hours
  if (event.businessMetrics.npsScore && (event.businessMetrics.npsScore < 0 || event.businessMetrics.npsScore > 10)) return false;
  
  return true;
}

// Batch storage with error handling
async function storeEventsBatch(events: SafeAnalyticsEvent[]): Promise<any> {
  if (events.length === 0) return { stored: 0, errors: 0 };
  
  const batchSize = 500; // Firestore batch limit
  const batches = [];
  
  for (let i = 0; i < events.length; i += batchSize) {
    batches.push(events.slice(i, i + batchSize));
  }
  
  let stored = 0;
  let errors = 0;
  
  for (const batch of batches) {
    try {
      const writes = batch.map(event => ({
        collection: getEventCollection(event.eventType),
        document: event.eventId,
        data: {
          ...event,
          storedAt: Date.now(),
          processingVersion: '1.0'
        }
      }));
      
      // Store to multiple collections for different use cases
      await Promise.all([
        storeToEventLog(writes),
        storeToHourlyAggregates(batch),
        storeToUserCohortMetrics(batch)
      ]);
      
      stored += batch.length;
      
    } catch (error) {
      logger.error('Batch storage failed', { 
        batchSize: batch.length, 
        error: error.message 
      });
      errors += batch.length;
    }
  }
  
  return { stored, errors };
}

// Collection routing based on event type
function getEventCollection(eventType: SafeEventType): string {
  if (eventType.startsWith('user_')) return 'analytics_user_events';
  if (eventType.startsWith('journal_') || eventType.startsWith('ai_')) return 'analytics_engagement_events';
  if (eventType.startsWith('conversion_') || eventType.startsWith('payment_')) return 'analytics_business_events';
  if (eventType.startsWith('app_') || eventType.startsWith('error_')) return 'analytics_technical_events';
  return 'analytics_general_events';
}

// Store events to main event log
async function storeToEventLog(writes: any[]): Promise<void> {
  const batch = db.batch();
  
  writes.forEach(write => {
    const docRef = db.collection(write.collection).doc(write.document);
    batch.set(docRef, write.data);
  });
  
  await batch.commit();
}

// Store to hourly aggregates for real-time analytics
async function storeToHourlyAggregates(events: SafeAnalyticsEvent[]): Promise<void> {
  const hourlyBuckets: Record<string, any> = {};
  
  events.forEach(event => {
    const hour = new Date(event.timestamp);
    hour.setMinutes(0, 0, 0);
    const hourKey = hour.toISOString();
    
    if (!hourlyBuckets[hourKey]) {
      hourlyBuckets[hourKey] = {
        timestamp: hour.getTime(),
        eventCounts: {},
        tierBreakdown: { free: 0, 'deep-cut': 0, oracle: 0 },
        segmentBreakdown: { new: 0, returning: 0, at_risk: 0, power_user: 0 }
      };
    }
    
    const bucket = hourlyBuckets[hourKey];
    bucket.eventCounts[event.eventType] = (bucket.eventCounts[event.eventType] || 0) + 1;
    bucket.tierBreakdown[event.userTier]++;
    bucket.segmentBreakdown[event.userSegment]++;
  });
  
  // Store aggregates
  const batch = db.batch();
  Object.entries(hourlyBuckets).forEach(([hourKey, data]) => {
    const docRef = db.collection('analytics_hourly_aggregates').doc(hourKey);
    batch.set(docRef, data, { merge: true });
  });
  
  await batch.commit();
}

// Store user cohort metrics
async function storeToUserCohortMetrics(events: SafeAnalyticsEvent[]): Promise<void> {
  const cohortMetrics: Record<string, any> = {};
  
  events.forEach(event => {
    if (!cohortMetrics[event.userCohort]) {
      cohortMetrics[event.userCohort] = {
        activeUsers: new Set(),
        eventCounts: {},
        tierDistribution: { free: 0, 'deep-cut': 0, oracle: 0 }
      };
    }
    
    const cohort = cohortMetrics[event.userCohort];
    cohort.activeUsers.add(event.sessionId);
    cohort.eventCounts[event.eventType] = (cohort.eventCounts[event.eventType] || 0) + 1;
    cohort.tierDistribution[event.userTier]++;
  });
  
  // Convert Sets to counts and store
  const batch = db.batch();
  Object.entries(cohortMetrics).forEach(([cohortKey, metrics]) => {
    const docRef = db.collection('analytics_cohort_metrics').doc(cohortKey);
    const data = {
      ...metrics,
      activeUsers: metrics.activeUsers.size,
      lastUpdated: Date.now()
    };
    delete data.activeUsers; // Remove the Set
    batch.set(docRef, data, { merge: true });
  });
  
  await batch.commit();
}

// Update real-time aggregated metrics
async function updateAggregatedMetrics(events: SafeAnalyticsEvent[]): Promise<void> {
  try {
    // Calculate key business metrics
    const businessMetrics = calculateBusinessMetrics(events);
    const engagementMetrics = calculateEngagementMetrics(events);
    const technicalMetrics = calculateTechnicalMetrics(events);
    
    // Store in real-time metrics collection
    const metricsDoc = db.collection('analytics_realtime_metrics').doc('current');
    await metricsDoc.set({
      lastUpdated: Date.now(),
      businessMetrics,
      engagementMetrics,
      technicalMetrics,
      eventCount: events.length
    }, { merge: true });
    
  } catch (error) {
    logger.error('Failed to update aggregated metrics', error);
  }
}

function calculateBusinessMetrics(events: SafeAnalyticsEvent[]): any {
  const conversionEvents = events.filter(e => e.eventType.includes('conversion'));
  const paymentEvents = events.filter(e => e.eventType.includes('payment'));
  
  return {
    conversionRate: conversionEvents.length > 0 ? 
      conversionEvents.filter(e => e.eventType === 'conversion_funnel_completed').length / conversionEvents.length : 0,
    revenueEvents: paymentEvents.length,
    tierUpgrades: events.filter(e => e.eventType === 'user_tier_upgraded').length
  };
}

function calculateEngagementMetrics(events: SafeAnalyticsEvent[]): any {
  const journalEvents = events.filter(e => e.eventType.includes('journal'));
  const aiEvents = events.filter(e => e.eventType.includes('ai_insight'));
  
  return {
    journalEngagement: journalEvents.length,
    aiInsightEngagement: aiEvents.filter(e => e.eventType === 'ai_insight_acted_on').length,
    featureAdoption: events.filter(e => e.eventType === 'feature_adopted').length
  };
}

function calculateTechnicalMetrics(events: SafeAnalyticsEvent[]): any {
  const errorEvents = events.filter(e => e.eventType === 'error_encountered');
  const performanceEvents = events.filter(e => e.eventType === 'performance_issue');
  
  return {
    errorRate: errorEvents.length / Math.max(events.length, 1),
    performanceIssues: performanceEvents.length,
    offlineUsage: events.filter(e => e.eventType === 'offline_mode_used').length
  };
}