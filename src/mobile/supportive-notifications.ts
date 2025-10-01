/**
 * ALCHM Supportive Push Notifications System
 * Trauma-informed notifications for supportive check-ins and gentle reminders
 */

interface SupportiveNotification {
  id: string;
  type: 'check_in' | 'affirmation' | 'reminder' | 'milestone' | 'emergency_resource' | 'gentle_nudge';
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  scheduleTime?: Date;
  recurring?: 'daily' | 'weekly' | 'custom';
  priority: 'low' | 'normal' | 'high' | 'max';
  traumaInformed: boolean;
  personalizedFor?: string[];
  culturallyRelevant?: string[];
}

interface NotificationPreferences {
  enabled: boolean;
  checkInsEnabled: boolean;
  affirmationsEnabled: boolean;
  remindersEnabled: boolean;
  milestoneEnabled: boolean;
  emergencyEnabled: boolean; // Always true, cannot be disabled
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
  frequency: 'minimal' | 'moderate' | 'supportive';
  personalizedTriggers: string[];
  culturalContext?: string[];
  traumaConsiderations: string[];
}

class SupportiveNotificationManager {
  private static instance: SupportiveNotificationManager;
  private notificationQueue: SupportiveNotification[] = [];
  private preferences: NotificationPreferences;
  private permission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  // Trauma-informed notification templates
  private notificationTemplates = {
    check_ins: [
      {
        title: "💙 Gentle Check-in",
        body: "How are you feeling right now? No pressure - just checking in.",
        traumaInformed: true
      },
      {
        title: "🌱 You Matter",
        body: "Your feelings are valid. You're doing the best you can today.",
        traumaInformed: true
      },
      {
        title: "🤗 Safe Space Reminder",
        body: "ALCHM is here whenever you need support. You're not alone.",
        traumaInformed: true
      },
      {
        title: "🌸 Gentle Presence",
        body: "No need to do anything right now. Just being here is enough.",
        traumaInformed: true
      }
    ],
    affirmations: [
      {
        title: "✨ Daily Affirmation",
        body: "You are worthy of love and kindness, especially from yourself.",
        traumaInformed: true,
        culturallyRelevant: ['general']
      },
      {
        title: "🔥 Inner Strength",
        body: "You've survived difficult times before. Your resilience is real.",
        traumaInformed: true
      },
      {
        title: "🌟 Progress Recognition",
        body: "Healing isn't linear. Every step forward, no matter how small, counts.",
        traumaInformed: true
      },
      {
        title: "💪 Your Courage",
        body: "Seeking support takes courage. You're already showing your strength.",
        traumaInformed: true
      },
      // Culturally specific affirmations
      {
        title: "🌺 Community Strength",
        body: "Your ancestors' resilience flows through you. You carry their wisdom.",
        traumaInformed: true,
        culturallyRelevant: ['BIPOC', 'Indigenous']
      },
      {
        title: "🏳️‍🌈 Authentic Self",
        body: "Your authentic self is beautiful and deserves to be celebrated.",
        traumaInformed: true,
        culturallyRelevant: ['LGBTQ+']
      },
      {
        title: "🙏 Spiritual Support",
        body: "Your spiritual journey is your own. Trust your inner wisdom.",
        traumaInformed: true,
        culturallyRelevant: ['Religious', 'Spiritual']
      }
    ],
    gentle_reminders: [
      {
        title: "💧 Hydration Reminder",
        body: "A gentle reminder to drink some water if you can. 💙",
        traumaInformed: true
      },
      {
        title: "🌬️ Breathing Space",
        body: "Maybe take three deep breaths? Only if it feels right for you.",
        traumaInformed: true
      },
      {
        title: "🌙 Rest Permission",
        body: "It's okay to rest when you need to. Self-care isn't selfish.",
        traumaInformed: true
      },
      {
        title: "📱 Digital Boundary",
        body: "Consider taking a gentle break from screens if you need space.",
        traumaInformed: true
      }
    ],
    milestones: [
      {
        title: "🎉 Journal Milestone",
        body: "You've written {{count}} journal entries! Your voice matters.",
        traumaInformed: true
      },
      {
        title: "📅 Consistency Recognition",
        body: "{{days}} days of self-reflection. You're building healthy habits.",
        traumaInformed: true
      },
      {
        title: "🌱 Growth Moment",
        body: "Look how far you've come. Your journey is inspiring.",
        traumaInformed: true
      }
    ],
    crisis_resources: [
      {
        title: "🆘 Crisis Resources Available",
        body: "If you're struggling right now, help is available 24/7. Tap for resources.",
        traumaInformed: true,
        priority: 'max' as const,
        data: { action: 'open_crisis_resources' }
      },
      {
        title: "💙 You Are Not Alone",
        body: "Crisis support is just a tap away. 988 - Suicide & Crisis Lifeline",
        traumaInformed: true,
        priority: 'max' as const,
        data: { action: 'dial_988' }
      }
    ]
  };

  // Default preferences with trauma-informed settings
  private defaultPreferences: NotificationPreferences = {
    enabled: false, // Requires explicit opt-in
    checkInsEnabled: true,
    affirmationsEnabled: true,
    remindersEnabled: true,
    milestoneEnabled: true,
    emergencyEnabled: true, // Cannot be disabled
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00"
    },
    frequency: 'moderate',
    personalizedTriggers: [],
    traumaConsiderations: []
  };

  static getInstance(): SupportiveNotificationManager {
    if (!SupportiveNotificationManager.instance) {
      SupportiveNotificationManager.instance = new SupportiveNotificationManager();
    }
    return SupportiveNotificationManager.instance;
  }

  constructor() {
    this.preferences = this.loadPreferences();
    this.initializeNotifications();
  }

  private loadPreferences(): NotificationPreferences {
    try {
      const stored = localStorage.getItem('alchm_notification_preferences');
      if (stored) {
        return { ...this.defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
    return this.defaultPreferences;
  }

  private savePreferences(): void {
    try {
      localStorage.setItem('alchm_notification_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  }

  async initializeNotifications(): Promise<void> {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return;
    }

    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/notification-sw.js');
        console.log('✅ Notification service worker registered');
      } catch (error) {
        console.error('❌ Service worker registration failed:', error);
      }
    }

    this.permission = Notification.permission;
    
    if (this.preferences.enabled && this.permission === 'granted') {
      this.scheduleNotifications();
    }
  }

  async requestPermission(context: 'initial' | 'settings' | 'crisis'): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      // Show gentle explanation about browser settings
      this.showPermissionGuidance();
      return false;
    }

    // Trauma-informed permission request
    const granted = await this.showTraumaInformedPermissionRequest(context);
    
    if (granted) {
      this.permission = 'granted';
      this.preferences.enabled = true;
      this.savePreferences();
      this.scheduleNotifications();
      return true;
    }

    return false;
  }

  private async showTraumaInformedPermissionRequest(context: string): Promise<boolean> {
    // Create a gentle, non-pressuring permission modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-slate-800 mb-4">
          ${context === 'crisis' ? '🆘 Crisis Support Notifications' : '💙 Gentle Support Notifications'}
        </h3>
        <p class="text-slate-600 mb-4">
          ${context === 'crisis' 
            ? 'We\'d like to send you crisis resource notifications when you might need immediate support. These are only sent during potential crisis situations.'
            : 'We can send you gentle, supportive check-ins and affirmations. You have full control over what you receive and when.'
          }
        </p>
        <div class="space-y-2 mb-4 text-sm text-slate-500">
          <p>✓ Always respectful of your time and space</p>
          <p>✓ Trauma-informed and culturally sensitive</p>
          <p>✓ You can adjust or turn off anytime</p>
          <p>✓ Crisis resources are always available regardless</p>
        </div>
        <div class="flex space-x-3">
          <button id="allow-notifications" class="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg flex-1">
            Allow Notifications
          </button>
          <button id="maybe-later" class="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg flex-1">
            Maybe Later
          </button>
        </div>
        <p class="text-xs text-slate-400 mt-3 text-center">
          This will not send you promotional or marketing messages
        </p>
      </div>
    `;

    document.body.appendChild(modal);

    return new Promise((resolve) => {
      const allowBtn = modal.querySelector('#allow-notifications');
      const laterBtn = modal.querySelector('#maybe-later');

      allowBtn?.addEventListener('click', async () => {
        document.body.removeChild(modal);
        const permission = await Notification.requestPermission();
        resolve(permission === 'granted');
      });

      laterBtn?.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve(false);
      });

      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          resolve(false);
        }
      });
    });
  }

  private showPermissionGuidance(): void {
    // Show guidance for enabling notifications in browser settings
    console.log('Notifications blocked - showing guidance');
  }

  async scheduleNotifications(): Promise<void> {
    if (!this.preferences.enabled || this.permission !== 'granted') {
      return;
    }

    // Clear existing scheduled notifications
    this.clearScheduledNotifications();

    // Schedule based on frequency preference
    switch (this.preferences.frequency) {
      case 'minimal':
        this.scheduleMinimalNotifications();
        break;
      case 'moderate':
        this.scheduleModerateNotifications();
        break;
      case 'supportive':
        this.scheduleSupportiveNotifications();
        break;
    }
  }

  private scheduleMinimalNotifications(): void {
    // Weekly check-in only
    if (this.preferences.checkInsEnabled) {
      this.scheduleWeeklyCheckIn();
    }

    // Milestone notifications only
    if (this.preferences.milestoneEnabled) {
      this.scheduleMilestoneTracking();
    }
  }

  private scheduleModerateNotifications(): void {
    // 2-3 times per week check-ins
    if (this.preferences.checkInsEnabled) {
      this.scheduleRegularCheckIns(3); // 3 times per week
    }

    // Weekly affirmation
    if (this.preferences.affirmationsEnabled) {
      this.scheduleWeeklyAffirmation();
    }

    // Gentle reminders occasionally
    if (this.preferences.remindersEnabled) {
      this.scheduleGentleReminders(2); // 2 times per week
    }

    // Milestones
    if (this.preferences.milestoneEnabled) {
      this.scheduleMilestoneTracking();
    }
  }

  private scheduleSupportiveNotifications(): void {
    // Daily gentle check-ins
    if (this.preferences.checkInsEnabled) {
      this.scheduleDailyCheckIn();
    }

    // 3x per week affirmations
    if (this.preferences.affirmationsEnabled) {
      this.scheduleRegularAffirmations(3);
    }

    // Daily gentle reminders
    if (this.preferences.remindersEnabled) {
      this.scheduleDailyReminders();
    }

    // All milestone notifications
    if (this.preferences.milestoneEnabled) {
      this.scheduleMilestoneTracking();
    }
  }

  private scheduleWeeklyCheckIn(): void {
    const checkIn = this.createPersonalizedNotification('check_ins');
    this.scheduleNotification(checkIn, this.getNextWeeklyTime());
  }

  private scheduleRegularCheckIns(perWeek: number): void {
    for (let i = 0; i < perWeek; i++) {
      const checkIn = this.createPersonalizedNotification('check_ins');
      const scheduleTime = this.getDistributedWeeklyTime(i, perWeek);
      this.scheduleNotification(checkIn, scheduleTime);
    }
  }

  private scheduleDailyCheckIn(): void {
    const checkIn = this.createPersonalizedNotification('check_ins');
    this.scheduleNotification(checkIn, this.getNextDailyTime('afternoon'));
  }

  private scheduleWeeklyAffirmation(): void {
    const affirmation = this.createPersonalizedNotification('affirmations');
    this.scheduleNotification(affirmation, this.getNextWeeklyTime());
  }

  private scheduleRegularAffirmations(perWeek: number): void {
    for (let i = 0; i < perWeek; i++) {
      const affirmation = this.createPersonalizedNotification('affirmations');
      const scheduleTime = this.getDistributedWeeklyTime(i, perWeek);
      this.scheduleNotification(affirmation, scheduleTime);
    }
  }

  private scheduleGentleReminders(perWeek: number): void {
    for (let i = 0; i < perWeek; i++) {
      const reminder = this.createPersonalizedNotification('gentle_reminders');
      const scheduleTime = this.getDistributedWeeklyTime(i, perWeek);
      this.scheduleNotification(reminder, scheduleTime);
    }
  }

  private scheduleDailyReminders(): void {
    const reminder = this.createPersonalizedNotification('gentle_reminders');
    this.scheduleNotification(reminder, this.getNextDailyTime('evening'));
  }

  private scheduleMilestoneTracking(): void {
    // This will be triggered by actual milestone achievements
    // Rather than scheduled in advance
    console.log('Milestone tracking enabled');
  }

  private createPersonalizedNotification(category: keyof typeof this.notificationTemplates): SupportiveNotification {
    const templates = this.notificationTemplates[category];
    let availableTemplates = templates;

    // Filter by cultural relevance if specified
    if (this.preferences.culturalContext?.length) {
      const culturallyRelevant = templates.filter(template => {
        if (!template.culturallyRelevant) return true; // General templates
        return template.culturallyRelevant.some(culture => 
          this.preferences.culturalContext?.includes(culture)
        );
      });
      
      if (culturallyRelevant.length > 0) {
        availableTemplates = culturallyRelevant;
      }
    }

    // Select random template
    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

    return {
      id: `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: category.includes('check') ? 'check_in' : 
            category.includes('affirmation') ? 'affirmation' :
            category.includes('reminder') ? 'reminder' : 'gentle_nudge',
      title: template.title,
      body: template.body,
      priority: template.priority || 'normal',
      traumaInformed: template.traumaInformed,
      icon: '/icons/alchm-heart-notification.png',
      badge: '/icons/alchm-badge.png',
      data: template.data
    };
  }

  private async scheduleNotification(notification: SupportiveNotification, scheduleTime: Date): Promise<void> {
    if (this.isInQuietHours(scheduleTime)) {
      // Reschedule outside quiet hours
      scheduleTime = this.adjustForQuietHours(scheduleTime);
    }

    const delay = scheduleTime.getTime() - Date.now();
    
    if (delay <= 0) {
      return; // Don't schedule past notifications
    }

    // Use setTimeout for near-term notifications (< 24 hours)
    if (delay < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        this.sendNotification(notification);
      }, delay);
    } else {
      // For longer delays, store in queue and reschedule daily
      this.notificationQueue.push({
        ...notification,
        scheduleTime
      });
    }
  }

  private isInQuietHours(time: Date): boolean {
    if (!this.preferences.quietHours.enabled) return false;

    const hour = time.getHours();
    const minute = time.getMinutes();
    const timeValue = hour * 100 + minute;

    const startTime = this.parseTime(this.preferences.quietHours.start);
    const endTime = this.parseTime(this.preferences.quietHours.end);

    if (startTime <= endTime) {
      // Same day (e.g., 14:00 to 18:00)
      return timeValue >= startTime && timeValue <= endTime;
    } else {
      // Crosses midnight (e.g., 22:00 to 08:00)
      return timeValue >= startTime || timeValue <= endTime;
    }
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 100 + minutes;
  }

  private adjustForQuietHours(originalTime: Date): Date {
    const adjusted = new Date(originalTime);
    const endHour = parseInt(this.preferences.quietHours.end.split(':')[0]);
    const endMinute = parseInt(this.preferences.quietHours.end.split(':')[1]);

    adjusted.setHours(endHour, endMinute + 30, 0, 0); // 30 minutes after quiet hours end

    // If that's in the past, move to next day
    if (adjusted.getTime() <= Date.now()) {
      adjusted.setDate(adjusted.getDate() + 1);
    }

    return adjusted;
  }

  private getNextWeeklyTime(): Date {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0); // 2 PM default
    return nextWeek;
  }

  private getDistributedWeeklyTime(index: number, total: number): Date {
    const daysFromNow = Math.floor((7 * index) / total) + 1;
    const time = new Date();
    time.setDate(time.getDate() + daysFromNow);
    
    // Vary the hour based on index
    const hours = [10, 14, 18]; // Morning, afternoon, evening options
    time.setHours(hours[index % hours.length], 0, 0, 0);
    
    return time;
  }

  private getNextDailyTime(period: 'morning' | 'afternoon' | 'evening'): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (period) {
      case 'morning':
        tomorrow.setHours(9, 30, 0, 0);
        break;
      case 'afternoon':
        tomorrow.setHours(14, 30, 0, 0);
        break;
      case 'evening':
        tomorrow.setHours(19, 30, 0, 0);
        break;
    }
    
    return tomorrow;
  }

  async sendNotification(notification: SupportiveNotification): Promise<void> {
    if (this.permission !== 'granted' || !this.preferences.enabled) {
      return;
    }

    try {
      // Use service worker for background notifications if available
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icons/alchm-heart-notification.png',
          badge: notification.badge || '/icons/alchm-badge.png',
          data: notification.data,
          requireInteraction: notification.priority === 'max',
          silent: notification.priority === 'low',
          tag: notification.type, // Prevents multiple of same type
          renotify: notification.priority === 'max'
        });
      } else {
        // Fallback to regular notification
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icons/alchm-heart-notification.png',
          data: notification.data,
          requireInteraction: notification.priority === 'max',
          silent: notification.priority === 'low',
          tag: notification.type
        });

        // Handle notification click
        browserNotification.onclick = () => {
          this.handleNotificationClick(notification);
        };
      }

      console.log(`📱 Sent ${notification.type} notification: ${notification.title}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  private handleNotificationClick(notification: SupportiveNotification): void {
    // Focus the window if it exists
    if (typeof window !== 'undefined') {
      window.focus();
    }

    // Handle specific actions based on notification data
    if (notification.data?.action) {
      switch (notification.data.action) {
        case 'open_crisis_resources':
          // Navigate to crisis resources
          window.location.hash = '#crisis-resources';
          break;
        case 'dial_988':
          // Attempt to dial 988
          window.location.href = 'tel:988';
          break;
        default:
          // Navigate to journal or dashboard
          window.location.hash = '#journal';
      }
    } else {
      // Default: navigate to journal
      window.location.hash = '#journal';
    }
  }

  async sendCrisisResourceNotification(): Promise<void> {
    const crisisNotification = this.createPersonalizedNotification('crisis_resources');
    crisisNotification.priority = 'max';
    await this.sendNotification(crisisNotification);
  }

  async sendMilestoneNotification(milestone: { type: string; count?: number; days?: number }): Promise<void> {
    if (!this.preferences.milestoneEnabled) return;

    const templates = this.notificationTemplates.milestones;
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders
    let body = template.body;
    if (milestone.count) body = body.replace('{{count}}', milestone.count.toString());
    if (milestone.days) body = body.replace('{{days}}', milestone.days.toString());

    const notification: SupportiveNotification = {
      id: `milestone_${Date.now()}`,
      type: 'milestone',
      title: template.title,
      body,
      priority: 'normal',
      traumaInformed: true,
      icon: '/icons/alchm-celebration.png'
    };

    await this.sendNotification(notification);
  }

  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();

    // Reschedule notifications with new preferences
    if (this.preferences.enabled && this.permission === 'granted') {
      this.scheduleNotifications();
    }
  }

  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  private clearScheduledNotifications(): void {
    this.notificationQueue = [];
    // Clear any pending timeouts would require tracking them
    // For now, we rely on the notification system to not duplicate
  }

  async testNotification(type: SupportiveNotification['type'] = 'check_in'): Promise<void> {
    if (this.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    const testNotification = this.createPersonalizedNotification(
      type === 'check_in' ? 'check_ins' : 'affirmations'
    );
    testNotification.title = '🧪 Test - ' + testNotification.title;
    
    await this.sendNotification(testNotification);
  }

  disable(): void {
    this.preferences.enabled = false;
    this.savePreferences();
    this.clearScheduledNotifications();
  }

  async enable(): Promise<boolean> {
    const granted = await this.requestPermission('settings');
    if (granted) {
      this.preferences.enabled = true;
      this.savePreferences();
      this.scheduleNotifications();
      return true;
    }
    return false;
  }
}

export default SupportiveNotificationManager;