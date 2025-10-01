/**
 * CRITICAL LIFE-SAFETY SYSTEM: Emergency Fallback System
 * 
 * This system provides emergency fallback mechanisms when primary systems
 * fail due to performance issues. Ensures users always have access to
 * crisis resources even when the main application is degraded.
 */

import { getPerformanceMonitor } from './real-time-performance-monitor';
import { getCrisisResourceMonitor } from './crisis-resource-monitor';

interface FallbackResource {
  id: string;
  name: string;
  type: 'STATIC_HTML' | 'CACHED_API' | 'EXTERNAL_SERVICE' | 'PHONE_NUMBER' | 'TEXT_SERVICE';
  primaryUrl: string;
  fallbackUrl: string;
  staticContent?: string;
  cachedData?: any;
  priority: number; // Lower number = higher priority
  isEssential: boolean; // Must be available during emergencies
}

interface FallbackState {
  isActive: boolean;
  reason: string;
  timestamp: number;
  activeFallbacks: string[];
  failedSystems: string[];
}

interface EmergencyMode {
  enabled: boolean;
  level: 'DEGRADED' | 'MINIMAL' | 'EMERGENCY_ONLY';
  enabledFeatures: string[];
  disabledFeatures: string[];
  staticResourcesOnly: boolean;
}

class EmergencyFallbackSystem {
  private fallbackResources: Map<string, FallbackResource> = new Map();
  private fallbackState: FallbackState = {
    isActive: false,
    reason: '',
    timestamp: 0,
    activeFallbacks: [],
    failedSystems: []
  };
  private emergencyMode: EmergencyMode = {
    enabled: false,
    level: 'DEGRADED',
    enabledFeatures: [],
    disabledFeatures: [],
    staticResourcesOnly: false
  };
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeFallbackResources();
    this.setupEmergencyDetection();
    this.loadCachedResources();
  }

  private initializeFallbackResources() {
    const resources: FallbackResource[] = [
      // Critical Crisis Resources
      {
        id: 'crisis-hotline-988',
        name: 'National Suicide Prevention Lifeline',
        type: 'PHONE_NUMBER',
        primaryUrl: 'tel:988',
        fallbackUrl: 'tel:1-800-273-8255',
        staticContent: `
          <div style="background: #fee; padding: 20px; text-align: center; font-size: 18px;">
            <h2>Crisis Support Available</h2>
            <p><strong>Call 988</strong> - National Suicide Prevention Lifeline</p>
            <p><strong>Text "HELLO" to 741741</strong> - Crisis Text Line</p>
            <p><strong>Call 911</strong> - Emergency Services</p>
          </div>
        `,
        priority: 1,
        isEssential: true
      },
      
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        type: 'TEXT_SERVICE',
        primaryUrl: 'sms:741741',
        fallbackUrl: 'sms:741741',
        staticContent: `
          <div style="background: #efe; padding: 20px;">
            <h3>Crisis Text Line</h3>
            <p>Text <strong>HELLO</strong> to <strong>741741</strong></p>
            <p>Free, 24/7 crisis support</p>
          </div>
        `,
        priority: 2,
        isEssential: true
      },

      // Emergency Web Resources
      {
        id: 'static-crisis-page',
        name: 'Static Crisis Support Page',
        type: 'STATIC_HTML',
        primaryUrl: '/crisis',
        fallbackUrl: '/emergency-static.html',
        staticContent: this.generateStaticCrisisPage(),
        priority: 3,
        isEssential: true
      },

      {
        id: 'cached-crisis-resources',
        name: 'Cached Crisis Resources API',
        type: 'CACHED_API',
        primaryUrl: '/api/crisis-resources',
        fallbackUrl: 'localStorage:crisis-resources',
        priority: 4,
        isEssential: true
      },

      // Safety Planning
      {
        id: 'static-safety-plan',
        name: 'Static Safety Plan',
        type: 'STATIC_HTML',
        primaryUrl: '/safety-plan',
        fallbackUrl: '/static-safety-plan.html',
        staticContent: this.generateStaticSafetyPlan(),
        priority: 5,
        isEssential: true
      },

      // Coping Resources
      {
        id: 'static-coping-strategies',
        name: 'Static Coping Strategies',
        type: 'STATIC_HTML',
        primaryUrl: '/coping-strategies',
        fallbackUrl: '/static-coping.html',
        staticContent: this.generateStaticCopingStrategies(),
        priority: 6,
        isEssential: true
      },

      // External Backup Services
      {
        id: 'external-crisis-chat',
        name: 'External Crisis Chat Service',
        type: 'EXTERNAL_SERVICE',
        primaryUrl: '/chat',
        fallbackUrl: 'https://www.crisischat.org/chat',
        priority: 7,
        isEssential: false
      }
    ];

    resources.forEach(resource => {
      this.fallbackResources.set(resource.id, resource);
    });

    console.log('[EMERGENCY FALLBACK] Initialized', resources.length, 'fallback resources');
  }

  private setupEmergencyDetection() {
    // Monitor performance for emergency conditions
    const performanceMonitor = getPerformanceMonitor();
    performanceMonitor.onAlert((alert) => {
      if (alert.severity === 'EMERGENCY') {
        this.activateEmergencyFallbacks(alert.metric, `Performance emergency: ${alert.metric}`);
      }
    });

    // Monitor crisis resources
    const crisisMonitor = getCrisisResourceMonitor();
    crisisMonitor.onAlert((alert) => {
      if (alert.severity === 'EMERGENCY') {
        this.activateEmergencyFallbacks(alert.resourceId, `Crisis resource failure: ${alert.message}`);
      }
    });

    // Monitor system health periodically
    this.monitoringInterval = setInterval(() => {
      this.checkSystemHealth();
    }, 30000); // Every 30 seconds
  }

  private async loadCachedResources() {
    if (typeof window === 'undefined') return;

    try {
      // Pre-cache critical resources for offline access
      const criticalUrls = [
        '/api/crisis-resources',
        '/api/emergency-contacts',
        '/crisis-resources/safety-plan',
        '/crisis-resources/coping-strategies'
      ];

      for (const url of criticalUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.text();
            localStorage.setItem(`emergency_cache_${url}`, data);
            localStorage.setItem(`emergency_cache_${url}_timestamp`, Date.now().toString());
          }
        } catch (error) {
          console.warn(`[EMERGENCY FALLBACK] Failed to cache ${url}:`, error);
        }
      }

      console.log('[EMERGENCY FALLBACK] Critical resources cached for offline access');
    } catch (error) {
      console.error('[EMERGENCY FALLBACK] Failed to load cached resources:', error);
    }
  }

  private async checkSystemHealth(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Quick health check of critical systems
      const healthChecks = [
        this.checkPerformanceHealth(),
        this.checkCrisisResourceHealth(),
        this.checkNetworkConnectivity()
      ];

      const results = await Promise.allSettled(healthChecks);
      const failures = results.filter(result => result.status === 'rejected');

      if (failures.length >= 2) {
        this.activateEmergencyFallbacks('system_health', 'Multiple system failures detected');
      } else if (failures.length === 1 && !this.fallbackState.isActive) {
        // Single failure - monitor more closely
        setTimeout(() => this.checkSystemHealth(), 10000); // Check again in 10 seconds
      }
    } catch (error) {
      console.error('[EMERGENCY FALLBACK] Health check failed:', error);
    }
  }

  private async checkPerformanceHealth(): Promise<boolean> {
    const performanceMonitor = getPerformanceMonitor();
    const recentMetrics = await performanceMonitor.getRecentMetrics(60000); // Last minute

    // Check if we have any recent metrics
    if (recentMetrics.length === 0) {
      throw new Error('No recent performance metrics');
    }

    // Check for critical performance issues
    const criticalMetrics = recentMetrics.filter(metric => {
      if (metric.type === 'LCP' && metric.value > 5000) return true; // 5s+ LCP
      if (metric.type === 'FID' && metric.value > 1000) return true; // 1s+ FID
      return false;
    });

    if (criticalMetrics.length > 0) {
      throw new Error('Critical performance degradation detected');
    }

    return true;
  }

  private async checkCrisisResourceHealth(): Promise<boolean> {
    const crisisMonitor = getCrisisResourceMonitor();
    const healthSummary = crisisMonitor.getHealthSummary();

    if (healthSummary.downResources > 0) {
      throw new Error(`${healthSummary.downResources} crisis resources are down`);
    }

    if (healthSummary.failingResources > 2) {
      throw new Error(`${healthSummary.failingResources} crisis resources are failing`);
    }

    return true;
  }

  private async checkNetworkConnectivity(): Promise<boolean> {
    if (typeof window === 'undefined') return true;

    if (!navigator.onLine) {
      throw new Error('Network connectivity lost');
    }

    // Quick network test
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Network test failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error('Network connectivity test failed');
    }

    return true;
  }

  private async activateEmergencyFallbacks(trigger: string, reason: string): Promise<void> {
    if (this.fallbackState.isActive) {
      // Already in fallback mode, add to failed systems
      if (!this.fallbackState.failedSystems.includes(trigger)) {
        this.fallbackState.failedSystems.push(trigger);
      }
      return;
    }

    console.error(`[EMERGENCY FALLBACK] 🚨 Activating emergency fallbacks due to: ${reason}`);

    this.fallbackState = {
      isActive: true,
      reason,
      timestamp: Date.now(),
      activeFallbacks: [],
      failedSystems: [trigger]
    };

    // Activate fallbacks based on priority
    const sortedResources = Array.from(this.fallbackResources.values())
      .sort((a, b) => a.priority - b.priority);

    for (const resource of sortedResources) {
      if (resource.isEssential) {
        await this.activateResourceFallback(resource);
      }
    }

    // Enable emergency mode
    await this.enableEmergencyMode('EMERGENCY_ONLY');

    // Store fallback state
    this.storeFallbackState();

    // Notify user
    this.showEmergencyNotification();
  }

  private async activateResourceFallback(resource: FallbackResource): Promise<void> {
    try {
      switch (resource.type) {
        case 'STATIC_HTML':
          await this.deployStaticContent(resource);
          break;
        case 'CACHED_API':
          await this.activateCachedApi(resource);
          break;
        case 'EXTERNAL_SERVICE':
          await this.redirectToExternal(resource);
          break;
        case 'PHONE_NUMBER':
        case 'TEXT_SERVICE':
          // These are always available
          break;
      }

      this.fallbackState.activeFallbacks.push(resource.id);
      console.log(`[EMERGENCY FALLBACK] ✅ Activated fallback for ${resource.name}`);
    } catch (error) {
      console.error(`[EMERGENCY FALLBACK] ❌ Failed to activate fallback for ${resource.name}:`, error);
    }
  }

  private async deployStaticContent(resource: FallbackResource): Promise<void> {
    if (typeof window === 'undefined' || !resource.staticContent) return;

    // Create or update static fallback page
    const fallbackKey = `emergency_static_${resource.id}`;
    localStorage.setItem(fallbackKey, resource.staticContent);
    localStorage.setItem(`${fallbackKey}_timestamp`, Date.now().toString());

    // If we're on the primary URL, show the static content immediately
    if (window.location.pathname === resource.primaryUrl) {
      this.displayStaticContent(resource.staticContent);
    }
  }

  private async activateCachedApi(resource: FallbackResource): Promise<void> {
    if (typeof window === 'undefined') return;

    const cacheKey = `emergency_cache_${resource.primaryUrl}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      // Set up service worker to serve cached data
      this.setupCachedApiInterception(resource.primaryUrl, cachedData);
    }
  }

  private async redirectToExternal(resource: FallbackResource): Promise<void> {
    // Store external redirect info
    if (typeof window !== 'undefined') {
      localStorage.setItem(`emergency_redirect_${resource.id}`, resource.fallbackUrl);
    }
  }

  private displayStaticContent(content: string): void {
    if (typeof window === 'undefined') return;

    // Create emergency overlay
    const overlay = document.createElement('div');
    overlay.id = 'emergency-fallback-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 10000;
      overflow-y: auto;
      padding: 20px;
      box-sizing: border-box;
    `;

    overlay.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="background: #ff4444; color: white; padding: 15px; text-align: center; margin-bottom: 20px; border-radius: 8px;">
          <h2>🚨 Emergency Mode Active</h2>
          <p>System issues detected. Showing emergency resources.</p>
        </div>
        ${content}
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="document.getElementById('emergency-fallback-overlay').remove()" 
                  style="background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            Try to Return to Main Site
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  private setupCachedApiInterception(url: string, cachedData: string): void {
    // This would typically be handled by a service worker
    // For now, we'll store it for manual retrieval
    if (typeof window !== 'undefined') {
      window.addEventListener('fetch', (event: any) => {
        if (event.request.url.includes(url)) {
          event.respondWith(new Response(cachedData, {
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      });
    }
  }

  private async enableEmergencyMode(level: EmergencyMode['level']): Promise<void> {
    this.emergencyMode = {
      enabled: true,
      level,
      enabledFeatures: this.getEssentialFeatures(level),
      disabledFeatures: this.getNonEssentialFeatures(level),
      staticResourcesOnly: level === 'EMERGENCY_ONLY'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm_emergency_mode', JSON.stringify(this.emergencyMode));
      
      // Broadcast to all tabs
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('alchm_emergency');
        channel.postMessage({
          type: 'EMERGENCY_MODE_ACTIVATED',
          mode: this.emergencyMode,
          timestamp: Date.now()
        });
      }
    }

    console.warn(`[EMERGENCY FALLBACK] Emergency mode enabled: ${level}`);
  }

  private getEssentialFeatures(level: EmergencyMode['level']): string[] {
    const essential = [
      'crisis-support',
      'emergency-contacts',
      'safety-planning',
      'basic-auth'
    ];

    if (level === 'DEGRADED') {
      essential.push('basic-journaling', 'simple-navigation');
    } else if (level === 'MINIMAL') {
      essential.push('basic-journaling');
    }
    // EMERGENCY_ONLY includes only crisis features

    return essential;
  }

  private getNonEssentialFeatures(level: EmergencyMode['level']): string[] {
    const nonEssential = [
      'analytics',
      'animations',
      'prefetching',
      'background-sync',
      'push-notifications',
      'advanced-features',
      'gamification',
      'social-features'
    ];

    if (level === 'MINIMAL' || level === 'EMERGENCY_ONLY') {
      nonEssential.push('complex-journaling', 'pathways', 'insights');
    }

    if (level === 'EMERGENCY_ONLY') {
      nonEssential.push('journaling', 'user-dashboard', 'settings');
    }

    return nonEssential;
  }

  private showEmergencyNotification(): void {
    if (typeof window === 'undefined') return;

    // Show persistent emergency notification
    const notification = document.createElement('div');
    notification.id = 'emergency-notification';
    notification.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #ff4444;
      color: white;
      text-align: center;
      padding: 10px;
      z-index: 9999;
      font-weight: bold;
    `;
    
    notification.innerHTML = `
      🚨 Emergency mode active - Crisis resources prioritized
      <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      const elem = document.getElementById('emergency-notification');
      if (elem) elem.remove();
    }, 30000);
  }

  private storeFallbackState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm_fallback_state', JSON.stringify(this.fallbackState));
      localStorage.setItem('alchm_fallback_timestamp', Date.now().toString());
    }
  }

  private generateStaticCrisisPage(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Crisis Support - ALCHM</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f8ff; }
          .container { max-width: 600px; margin: 0 auto; }
          .crisis-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .urgent { background: #ffebee; border-left: 4px solid #f44336; }
          .contact { font-size: 24px; font-weight: bold; color: #1976d2; text-decoration: none; }
          .contact:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🆘 Crisis Support Available</h1>
          
          <div class="crisis-card urgent">
            <h2>Immediate Help</h2>
            <p>If you're in immediate danger, call emergency services:</p>
            <a href="tel:911" class="contact">📞 Call 911</a>
          </div>

          <div class="crisis-card">
            <h2>National Suicide Prevention Lifeline</h2>
            <p>Free, confidential support 24/7:</p>
            <a href="tel:988" class="contact">📞 Call 988</a>
            <p>Or chat online at: <a href="https://suicidepreventionlifeline.org/chat/">suicidepreventionlifeline.org/chat</a></p>
          </div>

          <div class="crisis-card">
            <h2>Crisis Text Line</h2>
            <p>Text support available 24/7:</p>
            <a href="sms:741741" class="contact">💬 Text HELLO to 741741</a>
          </div>

          <div class="crisis-card">
            <h2>International Resources</h2>
            <p>If you're outside the US:</p>
            <ul>
              <li>UK: 116 123 (Samaritans)</li>
              <li>Canada: 1-833-456-4566</li>
              <li>Australia: 13 11 14 (Lifeline)</li>
              <li>More: <a href="https://findahelpline.com">findahelpline.com</a></li>
            </ul>
          </div>

          <div class="crisis-card">
            <h2>You Are Not Alone</h2>
            <p>Remember: This feeling is temporary. You matter. Help is available.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateStaticSafetyPlan(): string {
    return `
      <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1>Emergency Safety Plan</h1>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2>Step 1: Recognize Warning Signs</h2>
          <p>Common warning signs of crisis:</p>
          <ul>
            <li>Feeling hopeless or trapped</li>
            <li>Intense emotional pain</li>
            <li>Thoughts of self-harm</li>
            <li>Feeling like a burden</li>
          </ul>
        </div>

        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2>Step 2: Use Coping Strategies</h2>
          <ul>
            <li>Deep breathing exercises</li>
            <li>Call a trusted friend</li>
            <li>Go for a walk</li>
            <li>Listen to calming music</li>
            <li>Write in a journal</li>
          </ul>
        </div>

        <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2>Step 3: Reach Out for Support</h2>
          <p><strong>Crisis Hotline:</strong> <a href="tel:988">988</a></p>
          <p><strong>Crisis Text:</strong> <a href="sms:741741">Text HELLO to 741741</a></p>
          <p><strong>Emergency:</strong> <a href="tel:911">911</a></p>
        </div>

        <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h2>Step 4: Make Environment Safe</h2>
          <ul>
            <li>Remove or secure harmful items</li>
            <li>Stay with trusted people</li>
            <li>Go to a safe location</li>
          </ul>
        </div>
      </div>
    `;
  }

  private generateStaticCopingStrategies(): string {
    return `
      <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1>Quick Coping Strategies</h1>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>🌬️ Breathing Exercise (5-4-3-2-1)</h3>
          <p>Notice:</p>
          <ul>
            <li>5 things you can see</li>
            <li>4 things you can touch</li>
            <li>3 things you can hear</li>
            <li>2 things you can smell</li>
            <li>1 thing you can taste</li>
          </ul>
        </div>

        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>🧊 Ice Cube Technique</h3>
          <p>Hold an ice cube in your hand. Focus on the cold sensation. This can help ground you in the present moment.</p>
        </div>

        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>📝 Thought Challenging</h3>
          <p>Ask yourself:</p>
          <ul>
            <li>Is this thought realistic?</li>
            <li>What evidence supports/contradicts it?</li>
            <li>What would I tell a friend in this situation?</li>
          </ul>
        </div>

        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3>🎵 Distraction Techniques</h3>
          <ul>
            <li>Listen to your favorite song</li>
            <li>Count backwards from 100 by 7s</li>
            <li>Name all the animals you can think of</li>
            <li>Call a friend or family member</li>
          </ul>
        </div>
      </div>
    `;
  }

  // Public API
  public async deactivateFallbacks(): Promise<void> {
    if (!this.fallbackState.isActive) return;

    console.log('[EMERGENCY FALLBACK] Deactivating emergency fallbacks');

    this.fallbackState = {
      isActive: false,
      reason: '',
      timestamp: 0,
      activeFallbacks: [],
      failedSystems: []
    };

    this.emergencyMode = {
      enabled: false,
      level: 'DEGRADED',
      enabledFeatures: [],
      disabledFeatures: [],
      staticResourcesOnly: false
    };

    if (typeof window !== 'undefined') {
      localStorage.removeItem('alchm_emergency_mode');
      localStorage.removeItem('alchm_fallback_state');
      
      // Remove emergency overlay if it exists
      const overlay = document.getElementById('emergency-fallback-overlay');
      if (overlay) overlay.remove();

      // Remove emergency notification
      const notification = document.getElementById('emergency-notification');
      if (notification) notification.remove();

      // Broadcast deactivation
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('alchm_emergency');
        channel.postMessage({
          type: 'EMERGENCY_MODE_DEACTIVATED',
          timestamp: Date.now()
        });
      }
    }
  }

  public getFallbackState(): FallbackState {
    return { ...this.fallbackState };
  }

  public getEmergencyMode(): EmergencyMode {
    return { ...this.emergencyMode };
  }

  public isInEmergencyMode(): boolean {
    return this.emergencyMode.enabled;
  }

  public addFallbackResource(resource: FallbackResource): void {
    this.fallbackResources.set(resource.id, resource);
    console.log(`[EMERGENCY FALLBACK] Added fallback resource: ${resource.name}`);
  }

  public removeFallbackResource(resourceId: string): void {
    this.fallbackResources.delete(resourceId);
    console.log(`[EMERGENCY FALLBACK] Removed fallback resource: ${resourceId}`);
  }

  public async testFallbacks(): Promise<{ success: boolean; results: any[] }> {
    console.log('[EMERGENCY FALLBACK] Running fallback test...');
    
    const results = [];
    
    for (const [id, resource] of this.fallbackResources) {
      try {
        await this.activateResourceFallback(resource);
        results.push({ id, status: 'success', resource: resource.name });
      } catch (error) {
        results.push({ 
          id, 
          status: 'failed', 
          resource: resource.name, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const success = results.every(result => result.status === 'success');
    
    console.log('[EMERGENCY FALLBACK] Test complete:', { success, results });
    
    return { success, results };
  }

  public cleanup(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

// Singleton instance
let emergencyFallbackSystem: EmergencyFallbackSystem | null = null;

export function getEmergencyFallbackSystem(): EmergencyFallbackSystem {
  if (!emergencyFallbackSystem) {
    emergencyFallbackSystem = new EmergencyFallbackSystem();
  }
  return emergencyFallbackSystem;
}

// Utility functions
export function isInEmergencyFallbackMode(): boolean {
  const system = getEmergencyFallbackSystem();
  return system.isInEmergencyMode();
}

export function activateEmergencyMode(): Promise<void> {
  const system = getEmergencyFallbackSystem();
  return (system as any).activateEmergencyFallbacks('manual', 'Manual activation');
}

export function deactivateEmergencyMode(): Promise<void> {
  const system = getEmergencyFallbackSystem();
  return system.deactivateFallbacks();
}

// Export types
export type { FallbackResource, FallbackState, EmergencyMode };