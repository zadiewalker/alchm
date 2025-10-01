/**
 * CRISIS-SAFE NAVIGATION SYSTEM
 * Ensures navigation never breaks during crisis situations
 * Provides failsafe routing and emergency fallbacks
 */

interface NavigationState {
  isInCrisis: boolean;
  hasUnsavedContent: boolean;
  currentPath: string;
  emergencyExitEnabled: boolean;
}

interface CrisisRoute {
  path: string;
  isCritical: boolean;
  fallbackPath?: string;
  requiresConfirmation?: boolean;
  emergencyBypass?: boolean;
}

class CrisisSafeNavigation {
  private state: NavigationState = {
    isInCrisis: false,
    hasUnsavedContent: false,
    currentPath: '/',
    emergencyExitEnabled: false
  };

  private crisisRoutes: CrisisRoute[] = [
    { path: '/', isCritical: true, fallbackPath: '/emergency-safe' },
    { path: '/journal', isCritical: true, fallbackPath: '/', requiresConfirmation: true },
    { path: '/dashboard', isCritical: false, fallbackPath: '/' },
    { path: '/crisis-resources', isCritical: true, emergencyBypass: true },
    { path: '/emergency-safe', isCritical: true, emergencyBypass: true }
  ];

  private navigationHistory: string[] = [];
  private maxHistoryLength = 10;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeNavigation();
    }
  }

  /**
   * Initialize crisis-safe navigation system
   */
  private initializeNavigation(): void {
    // Override browser navigation for crisis safety
    this.interceptBrowserNavigation();
    
    // Add emergency exit listeners
    this.setupEmergencyExitHandlers();
    
    // Monitor for crisis indicators
    this.setupCrisisDetection();
    
    console.log('🛡️ Crisis-safe navigation initialized');
  }

  /**
   * Intercept browser navigation to add crisis safety checks
   */
  private interceptBrowserNavigation(): void {
    // Override history.pushState
    const originalPushState = history.pushState;
    history.pushState = (state: any, title: string, url?: string | URL | null) => {
      if (this.isCrisisSafeNavigation(url?.toString() || '')) {
        originalPushState.call(history, state, title, url);
        this.updateNavigationState(url?.toString() || '');
      } else {
        this.handleUnsafeNavigation(url?.toString() || '');
      }
    };

    // Override history.replaceState
    const originalReplaceState = history.replaceState;
    history.replaceState = (state: any, title: string, url?: string | URL | null) => {
      if (this.isCrisisSafeNavigation(url?.toString() || '')) {
        originalReplaceState.call(history, state, title, url);
        this.updateNavigationState(url?.toString() || '');
      } else {
        this.handleUnsafeNavigation(url?.toString() || '');
      }
    };

    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', (event) => {
      const currentPath = window.location.pathname;
      if (!this.isCrisisSafeNavigation(currentPath)) {
        // Prevent unsafe navigation and provide safe alternative
        this.navigateToSafeFallback(currentPath);
      }
    });
  }

  /**
   * Setup emergency exit handlers for crisis situations
   */
  private setupEmergencyExitHandlers(): void {
    // Emergency exit with Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.state.isInCrisis) {
        this.emergencyExit();
      }
    });

    // Emergency exit with triple-tap on mobile
    let tapCount = 0;
    let tapTimer: NodeJS.Timeout | null = null;

    document.addEventListener('touchend', () => {
      tapCount++;
      
      if (tapTimer) clearTimeout(tapTimer);
      
      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 1000);

      if (tapCount === 3 && this.state.isInCrisis) {
        this.emergencyExit();
      }
    });
  }

  /**
   * Setup crisis detection for navigation decisions
   */
  private setupCrisisDetection(): void {
    // Monitor localStorage for crisis indicators
    const checkCrisisState = () => {
      const emergencyMode = localStorage.getItem('alchm_emergency_mode') === 'true';
      const crisisDetected = localStorage.getItem('alchm_crisis_detected') === 'true';
      
      this.state.isInCrisis = emergencyMode || crisisDetected;
      
      if (this.state.isInCrisis && !this.state.emergencyExitEnabled) {
        this.enableEmergencyExit();
      }
    };

    // Check every 5 seconds
    setInterval(checkCrisisState, 5000);
    
    // Initial check
    checkCrisisState();
  }

  /**
   * Check if navigation is safe during crisis
   */
  private isCrisisSafeNavigation(path: string): boolean {
    const route = this.crisisRoutes.find(r => r.path === path || path.startsWith(r.path));
    
    if (!route) {
      // Unknown route - allow but log warning
      console.warn(`⚠️ Unknown route in crisis mode: ${path}`);
      return true;
    }

    // Always allow emergency bypass routes
    if (route.emergencyBypass && this.state.isInCrisis) {
      return true;
    }

    // Critical routes require extra confirmation in crisis
    if (route.isCritical && this.state.isInCrisis && route.requiresConfirmation) {
      return this.confirmCriticalNavigation(path);
    }

    return true;
  }

  /**
   * Handle unsafe navigation attempts
   */
  private handleUnsafeNavigation(attemptedPath: string): void {
    console.warn(`🚨 Blocked unsafe navigation to: ${attemptedPath}`);
    
    // Find safe fallback
    const route = this.crisisRoutes.find(r => r.path === attemptedPath);
    const fallbackPath = route?.fallbackPath || '/';
    
    // Navigate to safe fallback
    this.navigateToSafeFallback(fallbackPath);
  }

  /**
   * Navigate to safe fallback with user notification
   */
  private navigateToSafeFallback(fallbackPath: string): void {
    if (this.state.isInCrisis) {
      // Show gentle notification for crisis users
      this.showCrisisNavigation(fallbackPath);
    }
    
    // Navigate to safe path
    window.location.pathname = fallbackPath;
    this.updateNavigationState(fallbackPath);
  }

  /**
   * Show crisis-appropriate navigation notification
   */
  private showCrisisNavigation(path: string): void {
    // Create non-alarming notification
    const notification = document.createElement('div');
    notification.className = 'crisis-navigation-notice';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(59, 130, 246, 0.95);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        backdrop-filter: blur(8px);
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Taking you somewhere safe...
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Confirm critical navigation in crisis mode
   */
  private confirmCriticalNavigation(path: string): boolean {
    if (!this.state.isInCrisis) return true;
    
    // For crisis users, use gentle confirmation
    const message = `You're about to navigate to ${path}. Are you sure you want to continue?\n\nIf you're in crisis, help is available:\n• Call 988 for crisis support\n• Text HOME to 741741`;
    
    return confirm(message);
  }

  /**
   * Update navigation state tracking
   */
  private updateNavigationState(path: string): void {
    this.state.currentPath = path;
    
    // Add to history
    this.navigationHistory.unshift(path);
    if (this.navigationHistory.length > this.maxHistoryLength) {
      this.navigationHistory.pop();
    }
    
    // Check for unsaved content
    this.checkForUnsavedContent();
  }

  /**
   * Check for unsaved content that might be lost
   */
  private checkForUnsavedContent(): void {
    // Check various sources of unsaved content
    const textareas = document.querySelectorAll('textarea');
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    
    let hasUnsavedContent = false;
    
    textareas.forEach(textarea => {
      if (textarea.value.trim().length > 10) { // More than 10 chars
        hasUnsavedContent = true;
      }
    });
    
    inputs.forEach(input => {
      if (input.value.trim().length > 0) {
        hasUnsavedContent = true;
      }
    });
    
    this.state.hasUnsavedContent = hasUnsavedContent;
  }

  /**
   * Enable emergency exit functionality
   */
  private enableEmergencyExit(): void {
    this.state.emergencyExitEnabled = true;
    
    // Add visual indicator for emergency exit
    if (!document.querySelector('.emergency-exit-indicator')) {
      const indicator = document.createElement('div');
      indicator.className = 'emergency-exit-indicator';
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(220, 38, 38, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          z-index: 10000;
          backdrop-filter: blur(4px);
        ">
          Press ESC for emergency exit
        </div>
      `;
      document.body.appendChild(indicator);
    }
  }

  /**
   * Emergency exit function for crisis situations
   */
  public emergencyExit(): void {
    console.log('🚨 Emergency exit activated');
    
    // Clear any sensitive data
    this.clearSensitiveData();
    
    // Navigate to safe page
    window.location.href = '/emergency-safe';
    
    // Show emergency resources
    this.showEmergencyResources();
  }

  /**
   * Clear sensitive data during emergency exit
   */
  private clearSensitiveData(): void {
    // Clear form data
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    // Clear local storage of sensitive data (but keep crisis indicators)
    const sensitiveKeys = ['journal_draft', 'personal_notes', 'private_thoughts'];
    sensitiveKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Show emergency resources during crisis
   */
  private showEmergencyResources(): void {
    alert(`EMERGENCY CRISIS RESOURCES:

📞 Call 988 - Suicide & Crisis Lifeline (24/7)
💬 Text HOME to 741741 - Crisis Text Line (24/7)
🚨 Call 911 - Emergency Services

You are not alone. Help is available.`);
  }

  /**
   * Public API methods
   */
  
  public setInCrisis(inCrisis: boolean): void {
    this.state.isInCrisis = inCrisis;
    localStorage.setItem('alchm_crisis_detected', inCrisis.toString());
    
    if (inCrisis) {
      this.enableEmergencyExit();
    }
  }

  public getNavigationHistory(): string[] {
    return [...this.navigationHistory];
  }

  public getCurrentState(): NavigationState {
    return { ...this.state };
  }

  public navigateToSafe(path: string): void {
    if (this.isCrisisSafeNavigation(path)) {
      // Use Next.js router if available, otherwise fallback to location change
      if (typeof window !== 'undefined' && (window as any).__NEXT_ROUTER__) {
        (window as any).__NEXT_ROUTER__.push(path);
      } else if (typeof window !== 'undefined' && window.history) {
        // Use history.pushState for SPA navigation
        window.history.pushState({}, '', path);
        // Trigger a popstate event to notify Next.js router
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        window.location.pathname = path;
      }
    } else {
      this.navigateToSafeFallback(path);
    }
  }
}

// Export singleton instance
export const crisisSafeNavigation = new CrisisSafeNavigation();

export default crisisSafeNavigation;