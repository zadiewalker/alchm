// Firebase Performance Monitoring for ALCHM
import { getPerformance, trace, Trace } from 'firebase/performance';
import { app } from './firebase';

class FirebasePerformanceMonitor {
  private performance: any = null;
  private traces: Map<string, Trace> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        this.performance = getPerformance(app);
        console.log('✅ Firebase Performance monitoring initialized');
      } catch (error) {
        console.warn('⚠️ Firebase Performance monitoring failed to initialize:', error);
      }
    }
  }

  // Start a custom trace
  startTrace(traceName: string): void {
    if (!this.performance) return;
    
    try {
      const customTrace = trace(this.performance, traceName);
      customTrace.start();
      this.traces.set(traceName, customTrace);
    } catch (error) {
      console.warn(`Failed to start trace ${traceName}:`, error);
    }
  }

  // Stop a custom trace
  stopTrace(traceName: string): void {
    if (!this.performance) return;
    
    try {
      const customTrace = this.traces.get(traceName);
      if (customTrace) {
        customTrace.stop();
        this.traces.delete(traceName);
      }
    } catch (error) {
      console.warn(`Failed to stop trace ${traceName}:`, error);
    }
  }

  // Add custom metrics to a trace
  addMetric(traceName: string, metricName: string, value: number): void {
    if (!this.performance) return;
    
    try {
      const customTrace = this.traces.get(traceName);
      if (customTrace) {
        customTrace.putMetric(metricName, value);
      }
    } catch (error) {
      console.warn(`Failed to add metric ${metricName} to trace ${traceName}:`, error);
    }
  }

  // Monitor Firebase Auth sign-in performance
  monitorAuthPerformance() {
    if (!this.performance) return;

    // Start auth trace
    this.startTrace('auth_signin_flow');
    
    // Monitor critical auth metrics
    const startTime = performance.now();
    
    return {
      recordTokenFetch: () => {
        const tokenTime = performance.now() - startTime;
        this.addMetric('auth_signin_flow', 'token_fetch_time', Math.round(tokenTime));
      },
      recordSessionCreation: () => {
        const sessionTime = performance.now() - startTime;
        this.addMetric('auth_signin_flow', 'session_creation_time', Math.round(sessionTime));
      },
      recordComplete: () => {
        const totalTime = performance.now() - startTime;
        this.addMetric('auth_signin_flow', 'total_signin_time', Math.round(totalTime));
        this.stopTrace('auth_signin_flow');
      }
    };
  }

  // Monitor Firestore performance
  monitorFirestorePerformance(operation: string) {
    if (!this.performance) return { recordComplete: () => {} };

    const traceName = `firestore_${operation}`;
    this.startTrace(traceName);
    const startTime = performance.now();

    return {
      recordComplete: (success: boolean = true) => {
        const operationTime = performance.now() - startTime;
        this.addMetric(traceName, 'operation_time', Math.round(operationTime));
        this.addMetric(traceName, 'success', success ? 1 : 0);
        this.stopTrace(traceName);
      }
    };
  }

  // Monitor page load performance
  monitorPageLoad(pageName: string) {
    if (!this.performance) return { recordComplete: () => {} };

    const traceName = `page_load_${pageName}`;
    this.startTrace(traceName);
    const startTime = performance.now();

    return {
      recordComplete: () => {
        const loadTime = performance.now() - startTime;
        this.addMetric(traceName, 'page_load_time', Math.round(loadTime));
        this.stopTrace(traceName);
      }
    };
  }
}

// Create singleton instance
export const performanceMonitor = new FirebasePerformanceMonitor();

// Helper function for auth performance monitoring
export const monitorAuthFlow = () => performanceMonitor.monitorAuthPerformance();

// Helper function for Firestore performance monitoring
export const monitorFirestoreOperation = (operation: string) => 
  performanceMonitor.monitorFirestorePerformance(operation);

// Helper function for page load monitoring
export const monitorPageLoad = (pageName: string) => 
  performanceMonitor.monitorPageLoad(pageName);