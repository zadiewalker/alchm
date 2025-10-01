/**
 * ALCHM Offline Crisis Resources System
 * Ensures crisis support is available even when offline or on poor connections
 */

export interface OfflineCrisisResource {
  id: string;
  name: string;
  type: 'hotline' | 'text' | 'chat' | 'local_service' | 'emergency' | 'self_care';
  phone?: string;
  textNumber?: string;
  instructions: string;
  availability: string;
  languages: string[];
  offlineContent: {
    description: string;
    selfCareSteps?: string[];
    safetyPlan?: string[];
    affirmations?: string[];
    groundingTechniques?: string[];
  };
  culturallySpecific?: boolean;
  lgbtqFriendly?: boolean;
  priority: number; // 1 = highest priority for offline access
}

export interface OfflineJournalEntry {
  id: string;
  content: string;
  mood?: number;
  timestamp: Date;
  tags?: string[];
  isPrivate: boolean;
  needsSync: boolean;
  crisisLevel?: 'none' | 'low' | 'moderate' | 'high' | 'critical';
}

export interface OfflineSelfCareActivity {
  id: string;
  title: string;
  type: 'breathing' | 'grounding' | 'movement' | 'cognitive' | 'sensory';
  duration: number; // in minutes
  instructions: string[];
  audioGuideUrl?: string;
  audioGuideOffline?: boolean;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestFor: string[]; // anxiety, panic, sadness, anger, etc.
}

class OfflineCrisisResourceManager {
  private static instance: OfflineCrisisResourceManager;
  private dbName = 'alchm_offline_crisis';
  private version = 1;
  private db: IDBDatabase | null = null;

  // Critical crisis resources always cached offline
  private criticalResources: OfflineCrisisResource[] = [
    {
      id: 'crisis-lifeline-988',
      name: '988 Suicide & Crisis Lifeline',
      type: 'hotline',
      phone: '988',
      instructions: 'Call or text 988 for immediate crisis support. Free, confidential, 24/7.',
      availability: '24/7/365',
      languages: ['English', 'Spanish'],
      priority: 1,
      offlineContent: {
        description: 'The 988 Lifeline is a national network of local crisis centers that provides free and confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week.',
        safetyPlan: [
          'Call 988 if you can make a call',
          'Text 988 if calling is not possible',
          'If no phone service, go to nearest hospital emergency room',
          'Call 911 if in immediate danger',
          'Reach out to a trusted friend or family member',
          'Use offline grounding techniques until help arrives'
        ],
        affirmations: [
          'You are not alone in this struggle',
          'This crisis will pass',
          'You deserve support and care',
          'Help is available and people want to help you',
          'Your life has value and meaning'
        ]
      }
    },
    {
      id: 'crisis-text-line',
      name: 'Crisis Text Line',
      type: 'text',
      textNumber: '741741',
      instructions: 'Text HOME to 741741 for crisis support via text message.',
      availability: '24/7/365',
      languages: ['English'],
      priority: 1,
      offlineContent: {
        description: 'Crisis Text Line serves anyone, in any type of crisis, providing access to free, 24/7 emotional support and information via the medium people already use and trust: text.',
        safetyPlan: [
          'Text HOME to 741741 when you have signal',
          'Keep texting even if responses are delayed',
          'Save this number in your phone as "Crisis Support"',
          'Practice breathing exercises while waiting',
          'Remember that trained counselors are standing by'
        ],
        groundingTechniques: [
          '5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
          'Breathe in for 4, hold for 4, out for 4, hold for 4',
          'Press your feet firmly on the ground and notice the sensation',
          'Hold an ice cube or splash cold water on your face',
          'Repeat: "I am safe in this moment"'
        ]
      }
    },
    {
      id: 'emergency-911',
      name: 'Emergency Services',
      type: 'emergency',
      phone: '911',
      instructions: 'Call 911 if you are in immediate physical danger or having thoughts of harming yourself or others.',
      availability: '24/7/365',
      languages: ['English', 'Translation services available'],
      priority: 1,
      offlineContent: {
        description: 'Emergency services for immediate life-threatening situations.',
        safetyPlan: [
          'Call 911 immediately if in danger',
          'Stay on the line with the operator',
          'Provide your exact location if possible',
          'Follow any instructions given by the operator',
          'If you cannot speak, try to make sounds so they know someone is there'
        ]
      }
    },
    {
      id: 'lgbtq-crisis-support',
      name: 'LGBTQ National Hotline',
      type: 'hotline',
      phone: '1-888-843-4564',
      instructions: 'Call for LGBTQ+-specific crisis support and resources.',
      availability: 'Daily 4 PM - 12 AM EST',
      languages: ['English'],
      priority: 2,
      lgbtqFriendly: true,
      offlineContent: {
        description: 'Provides telephone, online private one-to-one chat and email peer-support, as well as factual information and local resources for cities and towns across the United States.',
        affirmations: [
          'Your identity is valid and beautiful',
          'You deserve love and acceptance exactly as you are',
          'There are people who understand your experience',
          'Your life and story matter',
          'You are not broken and do not need to be fixed'
        ]
      }
    },
    {
      id: 'veterans-crisis-line',
      name: 'Veterans Crisis Line',
      type: 'hotline',
      phone: '988',
      instructions: 'Press 1 after dialing 988 for veteran-specific crisis support.',
      availability: '24/7/365',
      languages: ['English', 'Spanish'],
      priority: 2,
      offlineContent: {
        description: 'The Veterans Crisis Line connects Veterans in crisis and their families and friends with qualified, caring Department of Veterans Affairs responders through a confidential toll-free hotline, online chat, or text.',
        affirmations: [
          'Your service and sacrifice are honored',
          'You are not alone in your struggles',
          'Seeking help is a sign of strength, not weakness',
          'You deserve support and care',
          'There are people who understand what you\'ve been through'
        ]
      }
    }
  ];

  private offlineSelfCareActivities: OfflineSelfCareActivity[] = [
    {
      id: 'box-breathing',
      title: 'Box Breathing for Anxiety',
      type: 'breathing',
      duration: 5,
      difficulty: 'easy',
      bestFor: ['anxiety', 'panic', 'overwhelm'],
      instructions: [
        'Sit comfortably with your back straight',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly through your mouth for 4 counts',
        'Hold empty lungs for 4 counts',
        'Repeat this cycle 4-8 times',
        'Focus only on counting and breathing'
      ]
    },
    {
      id: 'grounding-5-4-3-2-1',
      title: '5-4-3-2-1 Grounding Technique',
      type: 'grounding',
      duration: 3,
      difficulty: 'easy',
      bestFor: ['panic', 'dissociation', 'overwhelm'],
      instructions: [
        'Look around and name 5 things you can see',
        'Name 4 things you can touch (then touch them)',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
        'Take three deep breaths',
        'Notice how you feel more present and grounded'
      ]
    },
    {
      id: 'body-scan',
      title: 'Quick Body Scan',
      type: 'sensory',
      duration: 5,
      difficulty: 'moderate',
      bestFor: ['anxiety', 'tension', 'stress'],
      instructions: [
        'Sit or lie down in a comfortable position',
        'Close your eyes or soften your gaze',
        'Start at the top of your head, notice any sensations',
        'Slowly move your attention down through your face, neck, shoulders',
        'Continue down your arms, chest, stomach, back',
        'Move down through your hips, thighs, knees, calves',
        'End at your feet and toes',
        'Take three deep breaths to finish'
      ]
    },
    {
      id: 'cold-water-reset',
      title: 'Cold Water Reset',
      type: 'sensory',
      duration: 2,
      difficulty: 'easy',
      bestFor: ['panic', 'intense_emotions', 'overwhelm'],
      instructions: [
        'Go to a sink or bathroom',
        'Turn on cold water',
        'Splash cold water on your face 3-5 times',
        'Or hold cold water in your hands and place on face',
        'Hold an ice cube if available',
        'Pay attention to the cold sensation',
        'Notice how it brings you into the present moment',
        'Take three slow, deep breaths'
      ]
    },
    {
      id: 'safe-place-visualization',
      title: 'Safe Place Visualization',
      type: 'cognitive',
      duration: 7,
      difficulty: 'moderate',
      bestFor: ['anxiety', 'trauma_response', 'fear'],
      instructions: [
        'Close your eyes and take three deep breaths',
        'Imagine a place where you feel completely safe and calm',
        'This can be real or imaginary - a beach, forest, cozy room, etc.',
        'Picture yourself in this safe place in detail',
        'Notice what you see, hear, smell, and feel',
        'Feel the safety and peace of this place',
        'Remember: you can return to this place anytime',
        'Take three deep breaths and slowly open your eyes'
      ]
    }
  ];

  static getInstance(): OfflineCrisisResourceManager {
    if (!OfflineCrisisResourceManager.instance) {
      OfflineCrisisResourceManager.instance = new OfflineCrisisResourceManager();
    }
    return OfflineCrisisResourceManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.openDatabase();
      await this.ensureCriticalResourcesAreCached();
      await this.setupServiceWorker();
      console.log('✅ Offline crisis resources initialized');
    } catch (error) {
      console.error('❌ Failed to initialize offline crisis resources:', error);
      // Fallback to typeof window !== 'undefined' && localStorage if IndexedDB fails
      await this.fallbackToLocalStorage();
    }
  }

  private async openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crisis resources store
        if (!db.objectStoreNames.contains('crisisResources')) {
          const resourceStore = db.createObjectStore('crisisResources', { keyPath: 'id' });
          resourceStore.createIndex('priority', 'priority', { unique: false });
          resourceStore.createIndex('type', 'type', { unique: false });
        }

        // Offline journal entries
        if (!db.objectStoreNames.contains('offlineEntries')) {
          const entryStore = db.createObjectStore('offlineEntries', { keyPath: 'id' });
          entryStore.createIndex('timestamp', 'timestamp', { unique: false });
          entryStore.createIndex('needsSync', 'needsSync', { unique: false });
        }

        // Self-care activities
        if (!db.objectStoreNames.contains('selfCareActivities')) {
          const activityStore = db.createObjectStore('selfCareActivities', { keyPath: 'id' });
          activityStore.createIndex('type', 'type', { unique: false });
          activityStore.createIndex('difficulty', 'difficulty', { unique: false });
        }

        // Emergency contacts
        if (!db.objectStoreNames.contains('emergencyContacts')) {
          db.createObjectStore('emergencyContacts', { keyPath: 'id' });
        }
      };
    });
  }

  private async ensureCriticalResourcesAreCached(): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['crisisResources', 'selfCareActivities'], 'readwrite');
    const resourceStore = transaction.objectStore('crisisResources');
    const activityStore = transaction.objectStore('selfCareActivities');

    // Cache critical crisis resources
    for (const resource of this.criticalResources) {
      await this.putInStore(resourceStore, resource);
    }

    // Cache self-care activities
    for (const activity of this.offlineSelfCareActivities) {
      await this.putInStore(activityStore, activity);
    }

    console.log(`✅ Cached ${this.criticalResources.length} crisis resources and ${this.offlineSelfCareActivities.length} self-care activities offline`);
  }

  private async putInStore(store: IDBObjectStore, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async setupServiceWorker(): Promise<void> {
    if ('serviceWorker' in typeof window !== 'undefined' && navigator) {
      try {
        const registration = await typeof window !== 'undefined' && navigator.serviceWorker.register('/crisis-sw.js');
        console.log('✅ Crisis service worker registered');
        
        // Listen for messages from service worker
        typeof window !== 'undefined' && navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage);
      } catch (error) {
        console.log('Service worker registration optional:', error);
      }
    }
  }

  private handleServiceWorkerMessage = (event: MessageEvent) => {
    if (event.data.type === 'CRISIS_RESOURCE_REQUEST') {
      this.provideCrisisResourceToServiceWorker();
    }
  };

  private async provideCrisisResourceToServiceWorker(): Promise<void> {
    const resources = await this.getCriticalCrisisResources();
    if ('serviceWorker' in typeof window !== 'undefined' && navigator && typeof window !== 'undefined' && navigator.serviceWorker.controller) {
      typeof window !== 'undefined' && navigator.serviceWorker.controller.postMessage({
        type: 'CRISIS_RESOURCES',
        resources: resources
      });
    }
  }

  async getCriticalCrisisResources(): Promise<OfflineCrisisResource[]> {
    if (!this.db) {
      return this.criticalResources; // Return hardcoded fallback
    }

    try {
      const transaction = this.db.transaction(['crisisResources'], 'readonly');
      const store = transaction.objectStore('crisisResources');
      const index = store.index('priority');
      
      return new Promise((resolve, reject) => {
        const resources: OfflineCrisisResource[] = [];
        const request = index.openCursor();
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            resources.push(cursor.value);
            cursor.continue();
          } else {
            resolve(resources.sort((a, b) => a.priority - b.priority));
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting crisis resources:', error);
      return this.criticalResources;
    }
  }

  async getSelfCareActivities(type?: string, difficulty?: string): Promise<OfflineSelfCareActivity[]> {
    if (!this.db) {
      return this.offlineSelfCareActivities.filter(activity => {
        const typeMatch = !type || activity.type === type;
        const difficultyMatch = !difficulty || activity.difficulty === difficulty;
        return typeMatch && difficultyMatch;
      });
    }

    try {
      const transaction = this.db.transaction(['selfCareActivities'], 'readonly');
      const store = transaction.objectStore('selfCareActivities');
      
      return new Promise((resolve, reject) => {
        const activities: OfflineSelfCareActivity[] = [];
        const request = store.openCursor();
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const activity = cursor.value;
            const typeMatch = !type || activity.type === type;
            const difficultyMatch = !difficulty || activity.difficulty === difficulty;
            
            if (typeMatch && difficultyMatch) {
              activities.push(activity);
            }
            cursor.continue();
          } else {
            resolve(activities);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting self-care activities:', error);
      return this.offlineSelfCareActivities;
    }
  }

  async saveOfflineJournalEntry(entry: Omit<OfflineJournalEntry, 'id' | 'needsSync'>): Promise<string> {
    const fullEntry: OfflineJournalEntry = {
      ...entry,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      needsSync: true
    };

    if (!this.db) {
      // Fallback to typeof window !== 'undefined' && localStorage
      const entries = this.getOfflineEntriesFromStorage();
      entries.push(fullEntry);
      typeof window !== 'undefined' && localStorage.setItem('alchm_offline_entries', JSON.stringify(entries));
      console.log('📝 Saved journal entry offline (typeof window !== 'undefined' && localStorage fallback)');
      return fullEntry.id;
    }

    try {
      const transaction = this.db.transaction(['offlineEntries'], 'readwrite');
      const store = transaction.objectStore('offlineEntries');
      
      await this.putInStore(store, fullEntry);
      console.log('📝 Saved journal entry offline');
      
      // Try to sync if online
      if (typeof window !== 'undefined' && navigator.onLine) {
        this.syncOfflineEntries();
      }
      
      return fullEntry.id;
    } catch (error) {
      console.error('Error saving offline journal entry:', error);
      throw error;
    }
  }

  private getOfflineEntriesFromStorage(): OfflineJournalEntry[] {
    try {
      const stored = typeof window !== 'undefined' && localStorage.getItem('alchm_offline_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async getOfflineJournalEntries(): Promise<OfflineJournalEntry[]> {
    if (!this.db) {
      return this.getOfflineEntriesFromStorage();
    }

    try {
      const transaction = this.db.transaction(['offlineEntries'], 'readonly');
      const store = transaction.objectStore('offlineEntries');
      
      return new Promise((resolve, reject) => {
        const entries: OfflineJournalEntry[] = [];
        const request = store.openCursor();
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            entries.push(cursor.value);
            cursor.continue();
          } else {
            resolve(entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting offline entries:', error);
      return [];
    }
  }

  async syncOfflineEntries(): Promise<void> {
    if (!typeof window !== 'undefined' && navigator.onLine) {
      console.log('📡 Waiting for connection to sync entries');
      return;
    }

    const entries = await this.getOfflineJournalEntries();
    const entriesToSync = entries.filter(entry => entry.needsSync);
    
    if (entriesToSync.length === 0) {
      return;
    }

    console.log(`📡 Syncing ${entriesToSync.length} offline entries`);

    for (const entry of entriesToSync) {
      try {
        const response = await fetch('/api/journal/sync-offline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offlineId: entry.id,
            content: entry.content,
            mood: entry.mood,
            timestamp: entry.timestamp.toISOString(),
            tags: entry.tags,
            isPrivate: entry.isPrivate,
            crisisLevel: entry.crisisLevel
          }),
          credentials: 'include'
        });

        if (response.ok) {
          // Mark as synced
          await this.markEntrySynced(entry.id);
          console.log(`✅ Synced entry ${entry.id}`);
        }
      } catch (error) {
        console.error(`❌ Failed to sync entry ${entry.id}:`, error);
      }
    }
  }

  private async markEntrySynced(entryId: string): Promise<void> {
    if (!this.db) {
      // Update in typeof window !== 'undefined' && localStorage
      const entries = this.getOfflineEntriesFromStorage();
      const updatedEntries = entries.map(entry => 
        entry.id === entryId ? { ...entry, needsSync: false } : entry
      );
      typeof window !== 'undefined' && localStorage.setItem('alchm_offline_entries', JSON.stringify(updatedEntries));
      return;
    }

    try {
      const transaction = this.db.transaction(['offlineEntries'], 'readwrite');
      const store = transaction.objectStore('offlineEntries');
      const request = store.get(entryId);
      
      request.onsuccess = () => {
        const entry = request.result;
        if (entry) {
          entry.needsSync = false;
          store.put(entry);
        }
      };
    } catch (error) {
      console.error('Error marking entry as synced:', error);
    }
  }

  async saveEmergencyContact(contact: { name: string; phone: string; relationship: string }): Promise<void> {
    const emergencyContact = {
      id: `contact_${Date.now()}`,
      ...contact,
      createdAt: new Date()
    };

    if (!this.db) {
      const contacts = JSON.parse(typeof window !== 'undefined' && localStorage.getItem('alchm_emergency_contacts') || '[]');
      contacts.push(emergencyContact);
      typeof window !== 'undefined' && localStorage.setItem('alchm_emergency_contacts', JSON.stringify(contacts));
      return;
    }

    try {
      const transaction = this.db.transaction(['emergencyContacts'], 'readwrite');
      const store = transaction.objectStore('emergencyContacts');
      await this.putInStore(store, emergencyContact);
      console.log('📞 Saved emergency contact offline');
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      throw error;
    }
  }

  async getEmergencyContacts(): Promise<any[]> {
    if (!this.db) {
      return JSON.parse(typeof window !== 'undefined' && localStorage.getItem('alchm_emergency_contacts') || '[]');
    }

    try {
      const transaction = this.db.transaction(['emergencyContacts'], 'readonly');
      const store = transaction.objectStore('emergencyContacts');
      
      return new Promise((resolve, reject) => {
        const contacts: any[] = [];
        const request = store.openCursor();
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            contacts.push(cursor.value);
            cursor.continue();
          } else {
            resolve(contacts);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting emergency contacts:', error);
      return [];
    }
  }

  private async fallbackToLocalStorage(): Promise<void> {
    // Store critical resources in typeof window !== 'undefined' && localStorage as fallback
    typeof window !== 'undefined' && localStorage.setItem('alchm_crisis_resources', JSON.stringify(this.criticalResources));
    typeof window !== 'undefined' && localStorage.setItem('alchm_selfcare_activities', JSON.stringify(this.offlineSelfCareActivities));
    console.log('💾 Using typeof window !== 'undefined' && localStorage fallback for offline resources');
  }

  // Connection event handlers
  setupConnectionHandlers(): void {
    typeof window !== 'undefined' && window.addEventListener('online', () => {
      console.log('🌐 Connection restored - syncing offline data');
      this.syncOfflineEntries();
    });

    typeof window !== 'undefined' && window.addEventListener('offline', () => {
      console.log('📴 Connection lost - offline mode activated');
    });
  }

  // Utility method to check if crisis resources are available
  async areCrisisResourcesAvailable(): Promise<boolean> {
    try {
      const resources = await this.getCriticalCrisisResources();
      return resources.length > 0;
    } catch {
      return false;
    }
  }

  // Get network status and quality
  getConnectionInfo(): { online: boolean; effectiveType?: string } {
    const online = typeof window !== 'undefined' && navigator.onLine;
    const connection = (typeof window !== 'undefined' && navigator as any).connection || (typeof window !== 'undefined' && navigator as any).mozConnection || (typeof window !== 'undefined' && navigator as any).webkitConnection;
    
    return {
      online,
      effectiveType: connection?.effectiveType || 'unknown'
    };
  }
}

export default OfflineCrisisResourceManager;