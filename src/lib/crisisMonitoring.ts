import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { doc, onSnapshot, collection, query, where, orderBy, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface CrisisNotification {
  id: string;
  type: 'crisis_support';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resources: Array<{
    name: string;
    phone?: string;
    text?: string;
    website?: string;
    description: string;
    urgent: boolean;
  }>;
  timestamp: any;
  read: boolean;
  urgent: boolean;
}

export interface SafetyPlan {
  warningSigns: string[];
  copingStrategies: string[];
  supportContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  professionalContacts: Array<{
    name: string;
    phone: string;
    type: string;
  }>;
  environmentSafety: string[];
  reasonsToLive: string[];
  lastUpdated: Date;
}

// Crisis detection function calls
const analyzeCrisisRisk = httpsCallable(functions, 'analyzeCrisisRisk');
const getCrisisResources = httpsCallable(functions, 'getCrisisResources');
const analyzeBatchContent = httpsCallable(functions, 'analyzeBatchContent');

export class CrisisMonitoringService {
  private static instance: CrisisMonitoringService;
  private notificationListeners: Map<string, () => void> = new Map();
  
  static getInstance(): CrisisMonitoringService {
    if (!CrisisMonitoringService.instance) {
      CrisisMonitoringService.instance = new CrisisMonitoringService();
    }
    return CrisisMonitoringService.instance;
  }

  // Monitor content for crisis indicators
  async monitorContent(content: string, userId: string, contentType: 'journal_entry' | 'community_post' | 'chat_message'): Promise<{
    riskLevel: string;
    recommendedAction: string;
    suggestedResources: any[];
  }> {
    try {
      const result = await analyzeCrisisRisk({
        content,
        userId,
        contentType
      });

      // Auto-trigger interventions for high-risk content
      const riskLevel = (result.data as any)?.riskLevel;
      if (riskLevel === 'critical' || riskLevel === 'high') {
        await this.handleCrisisDetected(userId, riskLevel);
      }

      return result.data as any;
    } catch (error) {
      console.error('Crisis monitoring error:', error);
      throw error;
    }
  }

  // Handle when crisis is detected
  private async handleCrisisDetected(userId: string, riskLevel: string) {
    // Show immediate support options
    if (typeof window !== 'undefined') {
      // Show crisis support modal
      this.showCrisisSupport(riskLevel);
    }

    // Log intervention for tracking
    console.log(`Crisis detected for user ${userId} - Risk Level: ${riskLevel}`);
  }

  // Show crisis support modal
  private showCrisisSupport(riskLevel: string) {
    // This would trigger a modal component
    const event = new CustomEvent('crisis-detected', {
      detail: { riskLevel }
    });
    window.dispatchEvent(event);
  }

  // Listen for crisis notifications
  subscribeToNotifications(userId: string, callback: (notifications: CrisisNotification[]) => void): () => void {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const notificationsQuery = query(
      notificationsRef,
      where('type', '==', 'crisis_support'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notifications: CrisisNotification[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CrisisNotification));
      
      callback(notifications);
    });

    this.notificationListeners.set(userId, unsubscribe);
    return unsubscribe;
  }

  // Get crisis resources
  async getCrisisResources(riskLevel: string, location?: string) {
    try {
      const result = await getCrisisResources({
        riskLevel,
        location
      });
      return (result.data as any)?.resources || this.getDefaultCrisisResources();
    } catch (error) {
      console.error('Error getting crisis resources:', error);
      return this.getDefaultCrisisResources();
    }
  }

  // Default crisis resources
  private getDefaultCrisisResources() {
    return [
      {
        name: "National Suicide Prevention Lifeline",
        phone: "988",
        description: "24/7 crisis support",
        urgent: true
      },
      {
        name: "Crisis Text Line",
        text: "Text HOME to 741741",
        description: "Text-based crisis support", 
        urgent: true
      },
      {
        name: "SAMHSA National Helpline",
        phone: "1-800-662-4357",
        description: "Mental health and substance abuse support",
        urgent: false
      }
    ];
  }

  // Batch analyze existing content
  async performBatchAnalysis(userId: string) {
    try {
      const result = await analyzeBatchContent({ userId });
      return (result.data as any)?.assessments || [];
    } catch (error) {
      console.error('Batch analysis error:', error);
      throw error;
    }
  }

  // Safety plan management
  async saveSafetyPlan(userId: string, safetyPlan: SafetyPlan) {
    try {
      const safetyPlanRef = doc(db, 'users', userId, 'safety_plan', 'current');
      await setDoc(safetyPlanRef, {
        ...safetyPlan,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error saving safety plan:', error);
      throw error;
    }
  }

  async getSafetyPlan(userId: string): Promise<SafetyPlan | null> {
    try {
      const safetyPlanRef = doc(db, 'users', userId, 'safety_plan', 'current');
      const snapshot = await getDoc(safetyPlanRef);
      
      if (snapshot.exists()) {
        return snapshot.data() as SafetyPlan;
      }
      return null;
    } catch (error) {
      console.error('Error getting safety plan:', error);
      return null;
    }
  }

  // Check if user needs intervention based on patterns
  async checkInterventionNeeded(userId: string): Promise<boolean> {
    try {
      // Get recent assessments
      const assessmentsRef = collection(db, 'crisis_assessments');
      const recentAssessmentsQuery = query(
        assessmentsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        // Add limit here if available
      );

      const snapshot = await getDocs(recentAssessmentsQuery);
      const assessments = snapshot.docs.map(doc => doc.data());

      // Check for escalating patterns
      const recentHighRisk = assessments.filter(a => 
        a.assessment?.riskLevel === 'high' || a.assessment?.riskLevel === 'critical'
      ).length;

      return recentHighRisk >= 2; // Trigger if 2+ high-risk assessments recently
    } catch (error) {
      console.error('Error checking intervention need:', error);
      return false;
    }
  }

  // Clean up listeners
  unsubscribeAll() {
    this.notificationListeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.notificationListeners.clear();
  }
}

// Export singleton instance
export const crisisMonitoring = CrisisMonitoringService.getInstance();

// Helper function for immediate crisis check
export const checkForCrisis = async (content: string, userId: string, contentType: 'journal_entry' | 'community_post' | 'chat_message' = 'journal_entry') => {
  return await crisisMonitoring.monitorContent(content, userId, contentType);
};

// Helper function for crisis resources
export const getEmergencyResources = () => [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    description: "24/7 crisis support - Call or chat",
    action: () => window.open('tel:988'),
    urgent: true
  },
  {
    name: "Crisis Text Line", 
    text: "Text HOME to 741741",
    description: "Text-based crisis support",
    action: () => window.open('sms:741741?body=HOME'),
    urgent: true
  },
  {
    name: "Emergency Services",
    phone: "911",
    description: "For immediate life-threatening emergencies",
    action: () => window.open('tel:911'),
    urgent: true
  }
];

// Real-time content monitoring hook for React components - SSR SAFE
export const useCrisisMonitoring = (userId: string) => {
  // Always return SSR-safe structure
  if (typeof window === 'undefined') {
    return {
      notifications: [],
      isMonitoring: false,
      checkContent: async () => ({ riskLevel: 'low', recommendedAction: 'monitor', suggestedResources: [] }),
      getCrisisResources: async () => [],
      isClient: false
    };
  }

  // Only import React hooks on client side to avoid SSR errors
  let useState: any, useEffect: any;
  try {
    const React = require('react');
    useState = React.useState;
    useEffect = React.useEffect;
  } catch (error) {
    console.error('React hooks not available:', error);
    return {
      notifications: [],
      isMonitoring: false,
      checkContent: async () => ({ riskLevel: 'low', recommendedAction: 'monitor', suggestedResources: [] }),
      getCrisisResources: async () => [],
      isClient: false
    };
  }
  
  const [notifications, setNotifications] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side after hydration
    setIsClient(true);
    
    if (!userId) return;

    setIsMonitoring(true);
    
    try {
      const unsubscribe = crisisMonitoring.subscribeToNotifications(userId, setNotifications);

      return () => {
        unsubscribe();
        setIsMonitoring(false);
      };
    } catch (error) {
      console.error('Crisis monitoring subscription failed:', error);
      setIsMonitoring(false);
    }
  }, [userId]);

  return {
    notifications,
    isMonitoring,
    isClient,
    checkContent: (content: string, contentType?: 'journal_entry' | 'community_post' | 'chat_message') => {
      if (!isClient) {
        return Promise.resolve({ riskLevel: 'low', recommendedAction: 'monitor', suggestedResources: [] });
      }
      return crisisMonitoring.monitorContent(content, userId, contentType || 'journal_entry');
    },
    getCrisisResources: (riskLevel: string) => {
      if (!isClient) {
        return Promise.resolve([]);
      }
      return crisisMonitoring.getCrisisResources(riskLevel);
    }
  };
};