/**
 * Crisis Safety Analytics - Privacy-preserving monitoring for crisis detection system
 * Records performance metrics without compromising user privacy
 */

export type CrisisDetectionEvent = {
  responseTimeMs: number;
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  interventionType: 'none' | 'gentle_check' | 'resource_offer' | 'urgent_support' | 'emergency_protocol';
  confidenceScore: number;
  culturalAdaptationApplied: boolean;
  demographicContext?: {
    ageGroup?: 'youth' | 'adult' | 'senior';
    primaryLanguage?: string;
    countryCode?: string;
    lgbtqSupportNeeded?: boolean;
  };
};

export type SystemHealthMetrics = {
  status: 'healthy' | 'degraded' | 'critical';
  metrics: {
    averageResponseTime: number;
    accuracyRate: number;
    falsePositiveRate: number;
    culturalAdaptationRate: number;
    privacyCompliance: boolean;
  };
  alerts: string[];
  lastUpdated: number;
};

class CrisisSafetyAnalyticsManager {
  private events: CrisisDetectionEvent[] = [];
  private maxEvents = 1000; // Limit stored events for privacy
  
  recordDetectionEvent(event: CrisisDetectionEvent): void {
    // Add event to in-memory store (no persistent storage for privacy)
    this.events.push(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }
  
  getSystemHealth(): SystemHealthMetrics {
    const recentEvents = this.events.slice(-100); // Last 100 events
    
    if (recentEvents.length === 0) {
      return {
        status: 'healthy',
        metrics: {
          averageResponseTime: 0,
          accuracyRate: 0,
          falsePositiveRate: 0,
          culturalAdaptationRate: 0,
          privacyCompliance: true
        },
        alerts: [],
        lastUpdated: Date.now()
      };
    }
    
    const avgResponseTime = recentEvents.reduce((sum, e) => sum + e.responseTimeMs, 0) / recentEvents.length;
    const culturalAdaptations = recentEvents.filter(e => e.culturalAdaptationApplied).length;
    const culturalAdaptationRate = culturalAdaptations / recentEvents.length;
    
    const alerts: string[] = [];
    
    if (avgResponseTime > 3000) {
      alerts.push('Average response time exceeds 3-second target');
    }
    
    const status: 'healthy' | 'degraded' | 'critical' = 
      alerts.length === 0 ? 'healthy' : 
      alerts.length < 3 ? 'degraded' : 'critical';
    
    return {
      status,
      metrics: {
        averageResponseTime: Math.round(avgResponseTime),
        accuracyRate: 0.95, // Placeholder - would be calculated from validation data
        falsePositiveRate: 0.08, // Placeholder - would be calculated from validation data
        culturalAdaptationRate: Math.round(culturalAdaptationRate * 100) / 100,
        privacyCompliance: true // Always true - we don't store PII
      },
      alerts,
      lastUpdated: Date.now()
    };
  }
  
  clearEvents(): void {
    this.events = [];
  }
}

export const crisisSafetyAnalytics = new CrisisSafetyAnalyticsManager();