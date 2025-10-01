/**
 * Offline Navigation Support for Crisis Situations
 * Ensures navigation works even when connectivity is poor or interrupted
 */

interface NavigationCache {
  route: string;
  timestamp: number;
  isEssential: boolean;
  fallbackContent?: string;
}

interface OfflineNavigationState {
  isOffline: boolean;
  cachedRoutes: Map<string, NavigationCache>;
  pendingNavigation: string | null;
  retryQueue: string[];
}

class OfflineNavigationManager {
  private state: OfflineNavigationState;
  private static instance: OfflineNavigationManager;

  constructor() {
    this.state = {
      isOffline: !typeof window !== 'undefined' && navigator.onLine,
      cachedRoutes: new Map(),
      pendingNavigation: null,
      retryQueue: []
    };

    this.initializeOfflineSupport();
  }

  static getInstance(): OfflineNavigationManager {
    if (!OfflineNavigationManager.instance) {
      OfflineNavigationManager.instance = new OfflineNavigationManager();
    }
    return OfflineNavigationManager.instance;
  }

  private initializeOfflineSupport() {
    // Monitor online/offline status
    typeof window !== 'undefined' && window.addEventListener('online', () => {
      this.state.isOffline = false;
      this.processPendingNavigation();
    });

    typeof window !== 'undefined' && window.addEventListener('offline', () => {
      this.state.isOffline = true;
      this.showOfflineNotification();
    });

    // Cache essential routes for offline access
    this.preloadEssentialRoutes();
  }

  private preloadEssentialRoutes() {
    const essentialRoutes = [
      '/dashboard',
      '/journal',
      '/journals',
      '/crisis-resources',
      '/pathways',
      '/analytics'
    ];

    essentialRoutes.forEach(route => {
      this.cacheRoute(route, true);
    });
  }

  private cacheRoute(route: string, isEssential: boolean = false) {
    // In a real implementation, this would cache the route content
    this.state.cachedRoutes.set(route, {
      route,
      timestamp: Date.now(),
      isEssential,
      fallbackContent: this.generateFallbackContent(route)
    });
  }

  private generateFallbackContent(route: string): string {
    const routeFallbacks = {
      '/dashboard': 'Your dashboard is available offline with limited functionality.',
      '/journal': 'You can write entries offline - they will sync when you reconnect.',
      '/journals': 'Your previous entries are cached and available offline.',
      '/crisis-resources': 'Emergency resources are always available offline.',
      '/pathways': 'Guided pathways are cached for offline access.',
      '/analytics': 'Basic analytics are available offline - full data requires connection.'
    };

    return routeFallbacks[route as keyof typeof routeFallbacks] || 'This page has limited offline functionality.';
  }

  canNavigateOffline(route: string): boolean {
    if (!this.state.isOffline) return true;
    
    const cached = this.state.cachedRoutes.get(route);
    return cached?.isEssential || false;
  }

  async attemptNavigation(route: string): Promise<boolean> {
    if (!this.state.isOffline) {
      return true; // Normal online navigation
    }

    if (this.canNavigateOffline(route)) {
      this.showOfflineCapabilityMessage(route);
      return true;
    }

    // Queue for retry when online
    this.state.retryQueue.push(route);
    this.showOfflineBlockMessage(route);
    return false;
  }

  private processPendingNavigation() {
    if (this.state.retryQueue.length > 0) {
      const route = this.state.retryQueue.shift();
      if (route) {
        this.showReconnectedMessage();
        // Trigger navigation retry
        setTimeout(() => {
          typeof window !== 'undefined' && window.location.href = route;
        }, 1000);
      }
    }
  }

  private showOfflineNotification() {
    this.createNotification(
      '⚡ You\'re offline',
      'Essential features like journaling still work. Navigation is limited to cached pages.',
      'warning',
      5000
    );
  }

  private showOfflineCapabilityMessage(route: string) {
    const cached = this.state.cachedRoutes.get(route);
    if (cached?.fallbackContent) {
      this.createNotification(
        '📱 Offline Mode',
        cached.fallbackContent,
        'info',
        3000
      );
    }
  }

  private showOfflineBlockMessage(route: string) {
    this.createNotification(
      '🌐 Connection Required',
      'This page needs internet access. We\'ll take you there once you\'re back online.',
      'error',
      4000
    );
  }

  private showReconnectedMessage() {
    this.createNotification(
      '✨ Back Online',
      'Connection restored! Taking you to your requested page.',
      'success',
      2000
    );
  }

  private createNotification(title: string, message: string, type: 'info' | 'warning' | 'error' | 'success', duration: number) {
    // Create trauma-informed notification
    const notification = typeof window !== 'undefined' && document.createElement('div');
    notification.className = `offline-notification offline-notification-${type}`;
    
    const colors = {
      info: '#3b82f6',
      warning: '#f59e0b', 
      error: '#ef4444',
      success: '#10b981'
    };

    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      border-left: 4px solid ${colors[type]};
      max-width: 320px;
      width: 90vw;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(8px);
      font-size: 14px;
      line-height: 1.4;
      animation: slideDownGentle 0.3s ease-out;
      text-align: center;
    `;

    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
      <div style="opacity: 0.9;">${message}</div>
    `;

    typeof window !== 'undefined' && document.body.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideUpGentle 0.3s ease-in forwards';
        setTimeout(() => {
          typeof window !== 'undefined' && document.body.removeChild(notification);
        }, 300);
      }
    }, duration);

    // Allow manual dismiss by tapping
    notification.addEventListener('click', () => {
      if (notification.parentNode) {
        notification.style.animation = 'slideUpGentle 0.3s ease-in forwards';
        setTimeout(() => {
          typeof window !== 'undefined' && document.body.removeChild(notification);
        }, 300);
      }
    });
  }

  getOfflineStatus(): OfflineNavigationState {
    return { ...this.state };
  }
}

// Animation styles for notifications
const notificationStyles = `
  @keyframes slideDownGentle {
    from {
      transform: translate(-50%, -20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  @keyframes slideUpGentle {
    from {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -20px);
      opacity: 0;
    }
  }
`;

// Inject styles if not already present
if (typeof typeof window !== 'undefined' && document !== 'undefined') {
  const styleId = 'offline-navigation-styles';
  if (!typeof window !== 'undefined' && document.getElementById(styleId)) {
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.id = styleId;
    style.textContent = notificationStyles;
    typeof window !== 'undefined' && document.head.appendChild(style);
  }
}

export default OfflineNavigationManager;
export type { OfflineNavigationState, NavigationCache };