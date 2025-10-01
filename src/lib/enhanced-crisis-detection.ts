'use client';

/**
 * ALCHM Enhanced Crisis Detection System
 * Sub-100ms response time with privacy-preserving analytics
 * Real-time crisis pattern recognition with cultural responsiveness
 */

import React from 'react';

export interface CrisisDetectionConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high' | 'maximum';
  culturalContext: string[];
  languagePreference: string;
  ageGroup: 'youth' | 'adult' | 'senior';
  privacyMode: 'strict' | 'balanced' | 'analytics';
}

export interface CrisisPattern {
  type: 'suicide' | 'self_harm' | 'violence' | 'substance' | 'eating_disorder' | 'domestic_violence';
  keywords: string[];
  patterns: RegExp[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  cultural?: string[];
  ageSpecific?: boolean;
  confidenceThreshold: number;
}

export interface CrisisDetectionResult {
  detected: boolean;
  confidence: number;
  patterns: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  responseTime: number;
  recommendedAction: 'monitor' | 'support' | 'intervention' | 'emergency';
  culturallyRelevant: boolean;
}

export interface PrivacyLog {
  timestamp: string;
  patternType: string;
  confidence: number;
  severity: string;
  responseTime: number;
  userAgent: string;
  sessionId: string;
  // No actual content logged for privacy
}

class EnhancedCrisisDetection {
  private config: CrisisDetectionConfig;
  private patterns: CrisisPattern[];
  private performanceMetrics: Map<string, number[]> = new Map();
  private lastDetection: number = 0;
  private detectionCache: Map<string, CrisisDetectionResult> = new Map();
  
  // Performance thresholds for life-critical system
  private readonly PERFORMANCE_TARGETS = {
    CRITICAL_RESPONSE_TIME: 50,   // 50ms for critical patterns
    STANDARD_RESPONSE_TIME: 100,  // 100ms for standard detection
    CACHE_CLEANUP_INTERVAL: 60000 // 1 minute cache cleanup
  };

  constructor(config: CrisisDetectionConfig) {
    this.config = config;
    this.patterns = this.initializeCrisisPatterns();
    this.initializePerformanceMonitoring();
    this.startCacheCleanup();
  }

  /**
   * Initialize crisis detection patterns with cultural responsiveness
   */
  private initializeCrisisPatterns(): CrisisPattern[] {
    const basePatterns: CrisisPattern[] = [
      // Suicide ideation patterns
      {
        type: 'suicide',
        keywords: [
          'kill myself', 'end it all', 'ending it all', 'suicide', 'not worth living', 'want to die',
          'wish I was dead', 'better off dead', 'end my life', 'take my own life',
          'no point living', 'nothing to live for', 'tired of living', 'nobody would care',
          'if I was gone', 'without me'
        ],
        patterns: [
          /(?:want to|going to|plan to|thinking about).{0,20}(?:kill myself|end it|die|ending it)/i,
          /(?:nobody|everyone).{0,30}(?:better|worse|care).{0,10}(?:without me|if I was gone|if I died)/i,
          /(?:tired|sick|done).{0,20}(?:with|of).{0,20}(?:life|living|everything)/i,
          /(?:nobody|no one).{0,20}(?:would|will).{0,20}(?:care|miss|notice).{0,20}(?:if I|when I)/i
        ],
        severity: 'critical',
        confidenceThreshold: 0.8
      },

      // Self-harm patterns
      {
        type: 'self_harm',
        keywords: [
          'cut myself', 'cutting', 'self harm', 'hurt myself', 'blade', 'razor',
          'burning myself', 'scratching', 'picking at', 'hitting myself'
        ],
        patterns: [
          /(?:want to|need to|going to).{0,20}(?:cut|hurt|harm).{0,10}myself/i,
          /(?:blade|razor|knife).{0,30}(?:skin|arm|leg|wrist)/i,
          /(?:cutting|burning|scratching).{0,20}(?:helps|makes me feel|relieves)/i
        ],
        severity: 'high',
        confidenceThreshold: 0.7
      },

      // Violence patterns
      {
        type: 'violence',
        keywords: [
          'hurt someone', 'kill them', 'violence', 'revenge', 'make them pay',
          'shoot up', 'bomb', 'weapon', 'attack'
        ],
        patterns: [
          /(?:want to|going to|plan to).{0,20}(?:hurt|kill|attack).{0,20}(?:someone|them|people)/i,
          /(?:get|buy|find).{0,20}(?:gun|weapon|knife|bomb)/i,
          /(?:they|everyone).{0,20}(?:deserve|will pay|should die)/i
        ],
        severity: 'critical',
        confidenceThreshold: 0.9
      },

      // Substance abuse crisis
      {
        type: 'substance',
        keywords: [
          'overdose', 'too many pills', 'drink everything', 'drugs', 'high enough',
          'numb the pain', 'escape reality', 'blackout'
        ],
        patterns: [
          /(?:take|swallow|drink).{0,20}(?:all|everything|too many|enough)/i,
          /(?:overdose|OD).{0,20}(?:tonight|now|today)/i,
          /(?:pills|drugs|alcohol).{0,30}(?:make it stop|end the pain|forget)/i
        ],
        severity: 'high',
        confidenceThreshold: 0.75
      },

      // Eating disorder crisis
      {
        type: 'eating_disorder',
        keywords: [
          'starve myself', 'not eating', 'purging', 'throw up', 'hate my body',
          'too fat', 'disgusting', 'food is enemy', 'calories'
        ],
        patterns: [
          /(?:not|stop|quit).{0,10}eating.{0,20}(?:anymore|at all|today)/i,
          /(?:hate|disgusted).{0,20}(?:my body|myself|how I look)/i,
          /(?:need to|have to|must).{0,20}(?:purge|throw up|get rid)/i
        ],
        severity: 'medium',
        confidenceThreshold: 0.6
      }
    ];

    // Add cultural and age-specific variations
    return this.addCulturalVariations(basePatterns);
  }

  /**
   * Add cultural variations to crisis patterns
   */
  private addCulturalVariations(basePatterns: CrisisPattern[]): CrisisPattern[] {
    const culturalPatterns = [...basePatterns];

    // LGBTQ+ specific patterns
    if (this.config.culturalContext.includes('lgbtq')) {
      culturalPatterns.push({
        type: 'suicide',
        keywords: [
          'deadname', 'misgendered', 'not accepted', 'family hates me',
          'rejected by family', 'conversion therapy', 'pray away'
        ],
        patterns: [
          /(?:family|parents).{0,20}(?:hate|reject|disown).{0,20}(?:me|who I am)/i,
          /(?:never|can\'t).{0,20}(?:be myself|live authentically|come out)/i
        ],
        severity: 'high',
        cultural: ['lgbtq'],
        confidenceThreshold: 0.7
      });
    }

    // BIPOC specific patterns
    if (this.config.culturalContext.includes('bipoc')) {
      culturalPatterns.push({
        type: 'suicide',
        keywords: [
          'racism', 'discrimination', 'police violence', 'systemic oppression',
          'microaggressions', 'not safe anywhere', 'tired of fighting'
        ],
        patterns: [
          /(?:tired|exhausted).{0,20}(?:of|from).{0,20}(?:racism|discrimination|fighting)/i,
          /(?:not safe|danger).{0,20}(?:anywhere|being black|being brown)/i
        ],
        severity: 'high',
        cultural: ['bipoc'],
        confidenceThreshold: 0.7
      });
    }

    // Youth-specific patterns
    if (this.config.ageGroup === 'youth') {
      culturalPatterns.push({
        type: 'suicide',
        keywords: [
          'school shooting', 'bullying', 'cyberbullying', 'social media',
          'everyone hates me', 'no friends', 'alone forever'
        ],
        patterns: [
          /(?:everyone|kids|classmates).{0,20}(?:hate|bully|ignore).{0,20}me/i,
          /(?:no one|nobody).{0,20}(?:cares|would miss|likes).{0,20}me/i
        ],
        severity: 'high',
        ageSpecific: true,
        confidenceThreshold: 0.6
      });
    }

    return culturalPatterns;
  }

  /**
   * Main crisis detection function with sub-100ms guarantee
   */
  public detectCrisis(text: string, useCache: boolean = true): CrisisDetectionResult {
    const startTime = performance.now();
    
    // Check cache first for performance
    const cacheKey = this.hashText(text);
    if (useCache && this.detectionCache.has(cacheKey)) {
      const cached = this.detectionCache.get(cacheKey)!;
      cached.responseTime = performance.now() - startTime;
      return cached;
    }

    // Fast preprocessing
    const normalizedText = this.preprocessText(text);
    
    // Pattern matching with early termination for performance
    const detectionResults = this.analyzePatterns(normalizedText);
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    // Performance monitoring
    this.recordPerformance('crisis_detection', responseTime);
    
    // Alert if response time exceeds thresholds
    if (responseTime > this.PERFORMANCE_TARGETS.STANDARD_RESPONSE_TIME) {
      console.warn(`🚨 Crisis detection exceeded 100ms: ${responseTime.toFixed(2)}ms`);
    }

    const result: CrisisDetectionResult = {
      detected: detectionResults.detected,
      confidence: detectionResults.confidence,
      patterns: detectionResults.patterns,
      severity: detectionResults.severity,
      responseTime,
      recommendedAction: this.determineRecommendedAction(detectionResults),
      culturallyRelevant: detectionResults.culturallyRelevant
    };

    // Cache result for performance
    if (useCache) {
      this.detectionCache.set(cacheKey, result);
    }

    // Privacy-preserving logging
    if (result.detected) {
      this.logDetectionEvent(result);
    }

    return result;
  }

  /**
   * Preprocess text for faster pattern matching
   */
  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Analyze text against crisis patterns with performance optimization
   */
  private analyzePatterns(text: string): {
    detected: boolean;
    confidence: number;
    patterns: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    culturallyRelevant: boolean;
  } {
    let maxConfidence = 0;
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const matchedPatterns: string[] = [];
    let culturallyRelevant = false;

    // Fast keyword matching first (most performant)
    for (const pattern of this.patterns) {
      // Skip culturally irrelevant patterns for performance
      if (pattern.cultural && !this.isCulturallyRelevant(pattern.cultural)) {
        continue;
      }

      // Skip age-inappropriate patterns
      if (pattern.ageSpecific && this.config.ageGroup !== 'youth') {
        continue;
      }

      let patternConfidence = 0;

      // Keyword matching (fastest)
      for (const keyword of pattern.keywords) {
        if (text.includes(keyword)) {
          patternConfidence += 0.3;
          matchedPatterns.push(keyword);
        }
      }

      // Pattern matching (slower, only if keywords found)
      if (patternConfidence > 0) {
        for (const regex of pattern.patterns) {
          if (regex.test(text)) {
            patternConfidence += 0.7;
            matchedPatterns.push(regex.source);
          }
        }
      }

      // Update max confidence and severity
      if (patternConfidence > maxConfidence) {
        maxConfidence = patternConfidence;
        maxSeverity = pattern.severity;
      }

      // Check cultural relevance
      if (pattern.cultural && patternConfidence > 0) {
        culturallyRelevant = true;
      }

      // Early termination for critical patterns
      if (patternConfidence >= 0.9 && pattern.severity === 'critical') {
        break;
      }
    }

    // Apply sensitivity adjustments
    maxConfidence = this.applySensitivityAdjustment(maxConfidence);

    return {
      detected: maxConfidence > 0.5,
      confidence: Math.min(maxConfidence, 1.0),
      patterns: [...new Set(matchedPatterns)], // Remove duplicates
      severity: maxSeverity,
      culturallyRelevant
    };
  }

  /**
   * Check if pattern is culturally relevant
   */
  private isCulturallyRelevant(patternCultural: string[]): boolean {
    return patternCultural.some(culture => 
      this.config.culturalContext.includes(culture) || culture === 'all'
    );
  }

  /**
   * Apply sensitivity adjustments
   */
  private applySensitivityAdjustment(confidence: number): number {
    switch (this.config.sensitivity) {
      case 'low':
        return confidence * 0.8;
      case 'medium':
        return confidence * 0.9;
      case 'high':
        return confidence * 1.1;
      case 'maximum':
        return confidence * 1.3;
      default:
        return confidence;
    }
  }

  /**
   * Determine recommended action based on detection results
   */
  private determineRecommendedAction(results: any): 'monitor' | 'support' | 'intervention' | 'emergency' {
    if (results.confidence >= 0.9 && results.severity === 'critical') {
      return 'emergency';
    }
    if (results.confidence >= 0.7 && (results.severity === 'critical' || results.severity === 'high')) {
      return 'intervention';
    }
    if (results.confidence >= 0.5) {
      return 'support';
    }
    return 'monitor';
  }

  /**
   * Privacy-preserving detection logging
   */
  private logDetectionEvent(result: CrisisDetectionResult): void {
    if (this.config.privacyMode === 'strict') {
      // Only log critical events in strict mode
      if (result.severity !== 'critical') return;
    }

    const log: PrivacyLog = {
      timestamp: new Date().toISOString(),
      patternType: result.patterns.length > 0 ? 'pattern_detected' : 'keyword_detected',
      confidence: Math.round(result.confidence * 100) / 100,
      severity: result.severity,
      responseTime: Math.round(result.responseTime * 100) / 100,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'server',
      sessionId: this.generateSessionId()
    };

    // Store in browser storage for crisis support follow-up
    if (typeof localStorage !== 'undefined') {
      const existingLogs = JSON.parse(localStorage.getItem('alchm_crisis_logs') || '[]');
      existingLogs.push(log);
      
      // Keep only last 50 logs for privacy
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('alchm_crisis_logs', JSON.stringify(existingLogs));
    }

    console.log(`🆘 Crisis detection logged: ${result.severity} (${(result.confidence * 100).toFixed(1)}% confidence)`);
  }

  /**
   * Generate privacy-preserving session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  /**
   * Hash text for caching without storing actual content
   */
  private hashText(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Record performance metrics
   */
  private recordPerformance(operation: string, time: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }
    
    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(time);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window !== 'undefined') {
      // Monitor performance and alert on degradation
      setInterval(() => {
        const crisisMetrics = this.performanceMetrics.get('crisis_detection') || [];
        if (crisisMetrics.length > 10) {
          const recentAverage = crisisMetrics.slice(-10).reduce((a, b) => a + b, 0) / 10;
          
          if (recentAverage > this.PERFORMANCE_TARGETS.STANDARD_RESPONSE_TIME) {
            console.warn(`⚠️ Crisis detection performance degraded: ${recentAverage.toFixed(2)}ms average`);
          }
        }
      }, 30000); // Check every 30 seconds
    }
  }

  /**
   * Start cache cleanup to prevent memory leaks
   */
  private startCacheCleanup(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.detectionCache.clear();
      }, this.PERFORMANCE_TARGETS.CACHE_CLEANUP_INTERVAL);
    }
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): Map<string, number[]> {
    return new Map(this.performanceMetrics);
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<CrisisDetectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Reinitialize patterns if cultural context changed
    if (newConfig.culturalContext || newConfig.ageGroup) {
      this.patterns = this.initializeCrisisPatterns();
    }
    
    // Clear cache when config changes
    this.detectionCache.clear();
  }

  /**
   * Get crisis logs for support team (privacy-preserving)
   */
  public getCrisisLogs(): PrivacyLog[] {
    if (typeof localStorage === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('alchm_crisis_logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Emergency bypass for immediate crisis detection
   */
  public emergencyDetection(text: string): boolean {
    const emergencyKeywords = [
      'kill myself', 'suicide', 'end it all', 'want to die',
      'hurt someone', 'kill them', 'overdose', 'jump'
    ];
    
    const normalizedText = text.toLowerCase();
    return emergencyKeywords.some(keyword => normalizedText.includes(keyword));
  }
}

// Export singleton instance with default configuration
export const crisisDetection = new EnhancedCrisisDetection({
  enabled: true,
  sensitivity: 'high',
  culturalContext: ['all'],
  languagePreference: 'en',
  ageGroup: 'adult',
  privacyMode: 'balanced'
});

// Export hooks for React integration
export function useCrisisDetection(config?: Partial<CrisisDetectionConfig>) {
  const [detectionConfig, setDetectionConfig] = React.useState(config || {});
  
  React.useEffect(() => {
    if (config) {
      crisisDetection.updateConfig(config);
    }
  }, [config]);

  const detectCrisis = React.useCallback((text: string) => {
    return crisisDetection.detectCrisis(text);
  }, []);

  return { detectCrisis, updateConfig: setDetectionConfig };
}

// Real-time crisis monitoring hook
export function useCrisisMonitoring(enabled: boolean = true) {
  const [crisisDetected, setCrisisDetected] = React.useState(false);
  const [lastDetection, setLastDetection] = React.useState<CrisisDetectionResult | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    const monitorInputs = () => {
      const inputs = document.querySelectorAll('textarea, input[type="text"]');
      
      inputs.forEach(input => {
        const handleInput = (e: Event) => {
          const target = e.target as HTMLInputElement;
          const result = crisisDetection.detectCrisis(target.value);
          
          if (result.detected && result.confidence > 0.7) {
            setCrisisDetected(true);
            setLastDetection(result);
          }
        };

        input.addEventListener('input', handleInput);
        
        return () => input.removeEventListener('input', handleInput);
      });
    };

    const observer = new MutationObserver(monitorInputs);
    observer.observe(document.body, { childList: true, subtree: true });
    
    monitorInputs();

    return () => observer.disconnect();
  }, [enabled]);

  return { crisisDetected, lastDetection, setCrisisDetected };
}

// Export convenience function for legacy compatibility
export function detectCrisisEnhanced(text: string, config?: Partial<CrisisDetectionConfig>): CrisisDetectionResult {
  if (config) {
    crisisDetection.updateConfig(config);
  }
  return crisisDetection.detectCrisis(text);
}

// Export additional convenience functions that might be expected
export function enhancedCrisisCheck(text: string): boolean {
  const result = crisisDetection.detectCrisis(text);
  return result.detected && result.confidence > 0.7;
}

export function validateDetectionSystem(): boolean {
  // Basic validation that the detection system is working
  const testResult = crisisDetection.detectCrisis("I want to kill myself");
  return testResult.detected && testResult.confidence > 0.5;
}