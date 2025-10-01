// Beta Feedback Collection Service

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
  increment,
  serverTimestamp
} from 'firebase/firestore';
import {
  BetaFeedback,
  FeedbackContext,
  DeviceInfo,
  UserAction,
  FeedbackAttachment,
  FeedbackResponse
} from '@/types/beta';

const COLLECTIONS = {
  FEEDBACK: 'betaFeedback',
  FEEDBACK_RESPONSES: 'betaFeedbackResponses',
  FEEDBACK_ATTACHMENTS: 'betaFeedbackAttachments',
  USER_ACTIONS: 'betaUserActions'
};

export class FeedbackService {
  private static instance: FeedbackService;
  private db: any;
  private actionBuffer: UserAction[] = [];
  private maxActionBuffer = 50;

  private constructor() {
    this.startActionTracking();
  }

  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  private async getDb() {
    if (!this.db) {
      this.db = await getFirebaseDb();
    }
    return this.db;
  }

  // Device and Context Detection
  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const screen = window.screen;
    
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (/Mobile|Android|iPhone/.test(ua)) {
      deviceType = 'mobile';
    } else if (/iPad|Tablet/.test(ua)) {
      deviceType = 'tablet';
    }

    const os = ua.includes('Windows') ? 'Windows' :
              ua.includes('Mac') ? 'macOS' :
              ua.includes('Linux') ? 'Linux' :
              ua.includes('Android') ? 'Android' :
              ua.includes('iOS') ? 'iOS' : 'Unknown';

    const browser = ua.includes('Chrome') ? 'Chrome' :
                   ua.includes('Firefox') ? 'Firefox' :
                   ua.includes('Safari') ? 'Safari' :
                   ua.includes('Edge') ? 'Edge' : 'Unknown';

    const browserVersion = this.extractBrowserVersion(ua, browser);

    return {
      type: deviceType,
      os,
      browser,
      browserVersion,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      touchSupport: 'ontouchstart' in window,
      connectionType: (navigator as any).connection?.effectiveType
    };
  }

  private extractBrowserVersion(ua: string, browser: string): string {
    const patterns: Record<string, RegExp> = {
      Chrome: /Chrome\/(\d+\.\d+)/,
      Firefox: /Firefox\/(\d+\.\d+)/,
      Safari: /Version\/(\d+\.\d+)/,
      Edge: /Edge\/(\d+\.\d+)/
    };

    const pattern = patterns[browser];
    if (pattern) {
      const match = ua.match(pattern);
      return match ? match[1] : 'Unknown';
    }
    return 'Unknown';
  }

  private getCurrentContext(): FeedbackContext {
    const device = this.getDeviceInfo();
    
    return {
      page: document.title || 'Unknown Page',
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      device,
      sessionId: this.getSessionId(),
      timestamp: new Date(),
      actionsBefore: [...this.actionBuffer].slice(-10) // Last 10 actions
    };
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('betaSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('betaSessionId', sessionId);
    }
    return sessionId;
  }

  // Action Tracking
  private startActionTracking() {
    if (typeof window === 'undefined') return;

    // Track clicks
    document.addEventListener('click', (event) => {
      this.trackAction({
        type: 'click',
        target: this.getElementSelector(event.target as Element),
        timestamp: new Date(),
        details: {
          x: (event as MouseEvent).clientX,
          y: (event as MouseEvent).clientY,
          button: (event as MouseEvent).button
        }
      });
    });

    // Track scrolling
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackAction({
          type: 'scroll',
          target: 'window',
          timestamp: new Date(),
          details: {
            scrollX: window.scrollX,
            scrollY: window.scrollY
          }
        });
      }, 250);
    });

    // Track input focus
    document.addEventListener('focusin', (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        this.trackAction({
          type: 'input',
          target: this.getElementSelector(event.target),
          timestamp: new Date(),
          details: {
            inputType: (event.target as HTMLInputElement).type || 'text'
          }
        });
      }
    });

    // Track navigation
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      FeedbackService.instance.trackAction({
        type: 'navigation',
        target: 'history',
        timestamp: new Date(),
        details: {
          url: args[2] || window.location.href
        }
      });
      return originalPushState.apply(history, args);
    };
  }

  private trackAction(action: UserAction) {
    this.actionBuffer.push(action);
    
    // Keep buffer size manageable
    if (this.actionBuffer.length > this.maxActionBuffer) {
      this.actionBuffer.shift();
    }
  }

  private getElementSelector(element: Element): string {
    if (!element) return 'unknown';
    
    // Try to create a meaningful selector
    let selector = element.tagName.toLowerCase();
    
    if (element.id) {
      selector += `#${element.id}`;
    } else if (element.className) {
      const classes = element.className.split(' ').filter(c => c.length > 0).slice(0, 3);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    // Add data attributes if available
    const dataTestId = element.getAttribute('data-testid');
    if (dataTestId) {
      selector += `[data-testid="${dataTestId}"]`;
    }
    
    return selector;
  }

  // Screenshot Capture
  async captureScreenshot(): Promise<string | null> {
    try {
      // Use html2canvas for screenshot capture
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 0.5, // Reduce file size
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return null;
    }
  }

  // Console Log Capture
  private setupConsoleCapture() {
    const logs: any[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      logs.push({ type: 'log', timestamp: new Date(), args });
      return originalLog.apply(console, args);
    };

    console.error = (...args) => {
      logs.push({ type: 'error', timestamp: new Date(), args });
      return originalError.apply(console, args);
    };

    console.warn = (...args) => {
      logs.push({ type: 'warn', timestamp: new Date(), args });
      return originalWarn.apply(console, args);
    };

    return () => logs.slice(-50); // Return last 50 logs
  }

  // Feedback Submission
  async submitFeedback(feedback: {
    type: 'bug' | 'feature_request' | 'usability' | 'general';
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    tags?: string[];
    userId: string;
    includeScreenshot?: boolean;
    includeConsoleLog?: boolean;
  }): Promise<BetaFeedback> {
    const db = await this.getDb();
    
    const context = this.getCurrentContext();
    const attachments: FeedbackAttachment[] = [];

    // Capture screenshot if requested
    if (feedback.includeScreenshot) {
      const screenshotData = await this.captureScreenshot();
      if (screenshotData) {
        attachments.push({
          id: `screenshot_${Date.now()}`,
          type: 'screenshot',
          url: screenshotData,
          name: 'screenshot.jpg',
          size: screenshotData.length,
          mimeType: 'image/jpeg',
          uploadedAt: new Date()
        });
      }
    }

    // Capture console logs if requested
    if (feedback.includeConsoleLog) {
      const getConsoleLogs = this.setupConsoleCapture();
      const logs = getConsoleLogs();
      
      if (logs.length > 0) {
        const logData = JSON.stringify(logs, null, 2);
        attachments.push({
          id: `logs_${Date.now()}`,
          type: 'log',
          url: `data:application/json;base64,${btoa(logData)}`,
          name: 'console-logs.json',
          size: logData.length,
          mimeType: 'application/json',
          uploadedAt: new Date()
        });
      }
    }

    const feedbackData: Omit<BetaFeedback, 'id'> = {
      userId: feedback.userId,
      type: feedback.type,
      priority: feedback.priority || 'medium',
      title: feedback.title,
      description: feedback.description,
      tags: feedback.tags || [],
      status: 'open',
      votes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      context,
      attachments,
      responses: []
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACK), {
      ...feedbackData,
      createdAt: Timestamp.fromDate(feedbackData.createdAt),
      updatedAt: Timestamp.fromDate(feedbackData.updatedAt),
      'context.timestamp': Timestamp.fromDate(context.timestamp)
    });

    return { ...feedbackData, id: docRef.id };
  }

  // Feedback Management
  async getFeedback(filters?: {
    userId?: string;
    type?: string;
    status?: string;
    priority?: string;
    limit?: number;
  }): Promise<BetaFeedback[]> {
    const db = await this.getDb();
    
    let q = query(collection(db, COLLECTIONS.FEEDBACK));
    
    if (filters?.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.priority) {
      q = query(q, where('priority', '==', filters.priority));
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
        updatedAt: data.updatedAt.toDate(),
        'context.timestamp': data['context.timestamp'].toDate()
      } as BetaFeedback;
    });
  }

  async updateFeedbackStatus(id: string, status: 'open' | 'in_progress' | 'resolved' | 'closed', response?: string): Promise<void> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.FEEDBACK, id);
    
    const updates: any = {
      status,
      updatedAt: Timestamp.fromDate(new Date())
    };

    await updateDoc(docRef, updates);

    // Add response if provided
    if (response) {
      await this.addFeedbackResponse(id, {
        authorId: 'system',
        authorType: 'developer',
        content: response,
        createdAt: new Date(),
        isInternal: false
      });
    }
  }

  async voteFeedback(id: string, increment: number = 1): Promise<void> {
    const db = await this.getDb();
    const docRef = doc(db, COLLECTIONS.FEEDBACK, id);
    
    await updateDoc(docRef, {
      votes: increment > 0 ? increment(increment) : increment(-Math.abs(increment))
    });
  }

  async addFeedbackResponse(feedbackId: string, response: Omit<FeedbackResponse, 'id'>): Promise<FeedbackResponse> {
    const db = await this.getDb();
    
    const responseData = {
      ...response,
      createdAt: Timestamp.fromDate(response.createdAt)
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACK_RESPONSES), {
      feedbackId,
      ...responseData
    });

    return { ...response, id: docRef.id };
  }

  async getFeedbackResponses(feedbackId: string): Promise<FeedbackResponse[]> {
    const db = await this.getDb();
    
    const q = query(
      collection(db, COLLECTIONS.FEEDBACK_RESPONSES),
      where('feedbackId', '==', feedbackId),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as FeedbackResponse;
    });
  }

  // Quick Feedback Methods
  async submitQuickBug(title: string, description: string, userId: string): Promise<BetaFeedback> {
    return this.submitFeedback({
      type: 'bug',
      title,
      description,
      priority: 'medium',
      userId,
      includeScreenshot: true,
      includeConsoleLog: true
    });
  }

  async submitFeatureRequest(title: string, description: string, userId: string): Promise<BetaFeedback> {
    return this.submitFeedback({
      type: 'feature_request',
      title,
      description,
      priority: 'low',
      userId,
      includeScreenshot: false,
      includeConsoleLog: false
    });
  }

  async submitUsabilityFeedback(title: string, description: string, userId: string): Promise<BetaFeedback> {
    return this.submitFeedback({
      type: 'usability',
      title,
      description,
      priority: 'medium',
      userId,
      includeScreenshot: true,
      includeConsoleLog: false
    });
  }

  // Cleanup
  async deleteFeedback(id: string): Promise<void> {
    const db = await this.getDb();
    await deleteDoc(doc(db, COLLECTIONS.FEEDBACK, id));
  }

  // Analytics
  async getFeedbackStats(timeRange?: { start: Date; end: Date }): Promise<{
    totalFeedback: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    avgResponseTime: number;
  }> {
    const db = await this.getDb();
    
    let q = query(collection(db, COLLECTIONS.FEEDBACK));
    
    if (timeRange) {
      q = query(
        q,
        where('createdAt', '>=', Timestamp.fromDate(timeRange.start)),
        where('createdAt', '<=', Timestamp.fromDate(timeRange.end))
      );
    }

    const snapshot = await getDocs(q);
    const feedback = snapshot.docs.map(doc => doc.data());

    const stats = {
      totalFeedback: feedback.length,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      avgResponseTime: 0
    };

    let totalResponseTime = 0;
    let resolvedCount = 0;

    feedback.forEach(item => {
      // Count by type
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
      
      // Count by priority
      stats.byPriority[item.priority] = (stats.byPriority[item.priority] || 0) + 1;
      
      // Count by status
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
      
      // Calculate response time for resolved items
      if (item.status === 'resolved' || item.status === 'closed') {
        const responseTime = item.updatedAt.toDate().getTime() - item.createdAt.toDate().getTime();
        totalResponseTime += responseTime;
        resolvedCount++;
      }
    });

    if (resolvedCount > 0) {
      stats.avgResponseTime = totalResponseTime / resolvedCount / (1000 * 60 * 60); // Convert to hours
    }

    return stats;
  }
}

export const feedbackService = FeedbackService.getInstance();