/**
 * EDGE RUNTIME COMPATIBLE: Crisis Safety Middleware
 * 
 * This is an optimized version of the crisis safety middleware
 * that works with Vercel Edge Runtime and Next.js middleware.
 * 
 * LIFE-CRITICAL REQUIREMENT: Must complete analysis in <3 seconds
 */

import { NextRequest, NextResponse } from 'next/server';

// Edge-compatible types (no complex dependencies)
interface QuickCrisisResult {
  hasCrisis: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresEmergencyResponse: boolean;
  businessMetricsSuspended: boolean;
}

interface CrisisInterceptionResult {
  shouldContinue: boolean;
  overrideState: 'normal' | 'suspended' | 'emergency' | 'lockdown';
  emergencyResponse?: NextResponse;
  businessMetricsSuspended: boolean;
}

/**
 * EDGE-COMPATIBLE Crisis Safety Middleware
 * Lightweight version that works in edge runtime
 */
export class EdgeCrisisSafetyMiddleware {
  private static instance: EdgeCrisisSafetyMiddleware;
  
  // Crisis keywords organized by urgency
  private readonly EMERGENCY_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'going to hurt myself', 'have a plan', 'tonight',
    'overdose', 'pills', 'bridge', 'rope', 'gun',
    'cutting myself', 'burning myself'
  ];

  private readonly WARNING_KEYWORDS = [
    'hopeless', 'worthless', 'burden', 'trapped',
    'can\'t go on', 'better off dead', 'no point',
    'cutting', 'burning', 'hurting myself', 'self harm',
    'no way out', 'give up', 'can\'t take it'
  ];

  private readonly CULTURAL_CRISIS_KEYWORDS = {
    es: ['suicidio', 'matarme', 'terminar mi vida', 'quiero morir', 'sin esperanza', 'no hay salida'],
    pt: ['suicídio', 'me matar', 'acabar com minha vida', 'quero morrer', 'sem esperança', 'não há saída'],
    ko: ['자살', '죽고 싶어', '살기 싫어', '희망이 없어', '포기하고 싶어'],
    hi: ['आत्महत्या', 'मरना चाहता हूं', 'जीना नहीं चाहता', 'निराश हूं', 'उम्मीद नहीं'],
    de: ['selbstmord', 'mich umbringen', 'sterben wollen', 'hoffnungslos', 'keinen ausweg']
  };

  private constructor() {}

  static getInstance(): EdgeCrisisSafetyMiddleware {
    if (!EdgeCrisisSafetyMiddleware.instance) {
      EdgeCrisisSafetyMiddleware.instance = new EdgeCrisisSafetyMiddleware();
    }
    return EdgeCrisisSafetyMiddleware.instance;
  }

  /**
   * MAIN INTERCEPT: Lightweight crisis detection for edge runtime
   */
  async interceptUserInteraction(
    request: NextRequest,
    userContent?: string,
    userId?: string,
    context?: { pathname: string; startTime: number }
  ): Promise<CrisisInterceptionResult> {
    const startTime = Date.now();
    
    try {
      // Extract content to analyze
      const contentToAnalyze = await this.extractContent(request, userContent);
      
      if (!contentToAnalyze) {
        return this.createNormalResult();
      }

      // Quick crisis check
      const crisisResult = this.performQuickCrisisCheck(contentToAnalyze, request);
      
      // Validate response time
      const responseTime = Date.now() - startTime;
      if (responseTime > 3000) {
        console.warn(`Crisis detection exceeded 3s: ${responseTime}ms`);
      }

      return this.createCrisisResponse(crisisResult, request, userId);

    } catch (error) {
      console.error('Edge crisis middleware error:', error);
      
      // FAILSAFE: Always err on the side of safety
      return this.createEmergencyFallback();
    }
  }

  /**
   * QUICK CRISIS CHECK: Lightweight pattern matching
   */
  private performQuickCrisisCheck(content: string, request: NextRequest): QuickCrisisResult {
    const normalizedContent = content.toLowerCase().trim();
    
    // Get locale from request
    const locale = this.extractLocale(request);
    
    // Check emergency keywords first
    const hasEmergencyKeywords = this.EMERGENCY_KEYWORDS.some(keyword => 
      normalizedContent.includes(keyword.toLowerCase())
    );
    
    // Check cultural keywords
    let hasCulturalCrisis = false;
    if (locale && this.CULTURAL_CRISIS_KEYWORDS[locale as keyof typeof this.CULTURAL_CRISIS_KEYWORDS]) {
      const culturalKeywords = this.CULTURAL_CRISIS_KEYWORDS[locale as keyof typeof this.CULTURAL_CRISIS_KEYWORDS];
      hasCulturalCrisis = culturalKeywords.some(keyword => 
        normalizedContent.includes(keyword.toLowerCase())
      );
    }
    
    // Check warning keywords
    const hasWarningKeywords = this.WARNING_KEYWORDS.some(keyword => 
      normalizedContent.includes(keyword.toLowerCase())
    );

    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let requiresEmergencyResponse = false;
    let businessMetricsSuspended = false;

    if (hasEmergencyKeywords || hasCulturalCrisis) {
      severity = 'critical';
      requiresEmergencyResponse = true;
      businessMetricsSuspended = true;
    } else if (hasWarningKeywords) {
      severity = 'high';
      requiresEmergencyResponse = false;
      businessMetricsSuspended = true;
    }

    // Additional pattern checks for context
    if (this.hasTimeUrgency(normalizedContent)) {
      severity = 'critical';
      requiresEmergencyResponse = true;
      businessMetricsSuspended = true;
    }

    return {
      hasCrisis: hasEmergencyKeywords || hasCulturalCrisis || hasWarningKeywords,
      severity,
      requiresEmergencyResponse,
      businessMetricsSuspended
    };
  }

  /**
   * Check for time-sensitive urgency indicators
   */
  private hasTimeUrgency(content: string): boolean {
    const urgencyPatterns = [
      'tonight', 'today', 'now', 'right now', 'this moment',
      'can\'t wait', 'have to do it', 'going to do it',
      'esta noche', 'ahora', 'hoje', 'agora', '오늘', '지금'
    ];
    
    return urgencyPatterns.some(pattern => content.includes(pattern));
  }

  /**
   * Create crisis response based on detection results
   */
  private createCrisisResponse(
    crisisResult: QuickCrisisResult, 
    request: NextRequest, 
    userId?: string
  ): CrisisInterceptionResult {
    if (!crisisResult.hasCrisis) {
      return this.createNormalResult();
    }

    // Log crisis detection
    console.error('CRISIS DETECTED', {
      severity: crisisResult.severity,
      requiresEmergency: crisisResult.requiresEmergencyResponse,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      pathname: new URL(request.url).pathname
    });

    // Create emergency response if needed
    let emergencyResponse: NextResponse | undefined;
    let overrideState: 'normal' | 'suspended' | 'emergency' | 'lockdown' = 'normal';

    if (crisisResult.requiresEmergencyResponse) {
      overrideState = 'emergency';
      emergencyResponse = this.createEmergencyResponse(request);
    } else if (crisisResult.businessMetricsSuspended) {
      overrideState = 'suspended';
    }

    return {
      shouldContinue: !crisisResult.requiresEmergencyResponse,
      overrideState,
      emergencyResponse,
      businessMetricsSuspended: crisisResult.businessMetricsSuspended
    };
  }

  /**
   * Create emergency redirect response
   */
  private createEmergencyResponse(request: NextRequest): NextResponse {
    try {
      const url = new URL(request.url);
      const emergencyUrl = new URL('/emergency-safe', url.origin);
      
      const response = NextResponse.redirect(emergencyUrl, 307);
      
      // Add crisis headers
      response.headers.set('X-Crisis-Safety-Override', 'true');
      response.headers.set('X-Crisis-Severity', 'critical');
      response.headers.set('X-Emergency-Response-Time', Date.now().toString());
      response.headers.set('X-Business-Metrics-Suspended', 'true');
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      return response;
    } catch (error) {
      console.error('Failed to create emergency response:', error);
      // Return a basic redirect
      return NextResponse.redirect('/emergency-safe');
    }
  }

  /**
   * Helper methods
   */
  private async extractContent(request: NextRequest, providedContent?: string): Promise<string | null> {
    if (providedContent) {
      return providedContent;
    }

    // Extract from POST/PUT body
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const contentType = request.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const body = await request.clone().json();
          return body.content || body.text || body.message || body.entry || null;
        }
      } catch {
        // Ignore JSON parsing errors
      }
    }

    // Extract from query parameters
    const url = new URL(request.url);
    return url.searchParams.get('content') || 
           url.searchParams.get('text') || 
           url.searchParams.get('message') || 
           null;
  }

  private extractLocale(request: NextRequest): string | null {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    const supportedLocales = ['en', 'es', 'pt', 'ko', 'hi', 'de'];
    if (pathSegments.length > 0 && supportedLocales.includes(pathSegments[0])) {
      return pathSegments[0];
    }
    
    // Fallback to accept-language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      for (const locale of supportedLocales) {
        if (acceptLanguage.toLowerCase().includes(locale)) {
          return locale;
        }
      }
    }
    
    return 'en'; // Default fallback
  }

  private createNormalResult(): CrisisInterceptionResult {
    return {
      shouldContinue: true,
      overrideState: 'normal',
      businessMetricsSuspended: false
    };
  }

  private createEmergencyFallback(): CrisisInterceptionResult {
    return {
      shouldContinue: false,
      overrideState: 'lockdown',
      businessMetricsSuspended: true
    };
  }

  /**
   * Health check for monitoring
   */
  healthCheck(): { status: 'healthy' | 'degraded'; edgeCompatible: boolean } {
    return {
      status: 'healthy',
      edgeCompatible: true
    };
  }
}

// Export singleton instance
export const edgeCrisisSafetyMiddleware = EdgeCrisisSafetyMiddleware.getInstance();

// Export types
export type { CrisisInterceptionResult, QuickCrisisResult };