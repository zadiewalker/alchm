import { getAnalytics, logEvent as firebaseLogEvent, isSupported } from "firebase/analytics";

let analytics: any = null;

// Lazy load analytics
const getAnalyticsInstance = async () => {
  if (!analytics && await isSupported()) {
    analytics = getAnalytics();
  }
  return analytics;
};

// Simplified event tracking
export const trackEvent = async (event: string, data?: Record<string, any>) => {
  try {
    const instance = await getAnalyticsInstance();
    if (instance) {
      firebaseLogEvent(instance, event, { ...data, timestamp: Date.now() });
    }
  } catch {
    // Fail silently to not affect user experience
  }
};

// Core events
export const Events = {
  // Auth
  LOGIN: 'login',
  SIGNUP: 'sign_up',
  LOGOUT: 'logout',
  
  // Journal
  ENTRY_SAVE: 'journal_save',
  ENTRY_DELETE: 'journal_delete',
  
  // Engagement
  PAGE_VIEW: 'page_view',
  UPGRADE: 'upgrade',
} as const;

// Essential tracking functions
export const track = {
  login: (provider: string) => trackEvent(Events.LOGIN, { provider }),
  signup: (method: string) => trackEvent(Events.SIGNUP, { method }),
  logout: () => trackEvent(Events.LOGOUT),
  journalSave: (wordCount: number, mood?: number) => 
    trackEvent(Events.ENTRY_SAVE, { word_count: wordCount, mood }),
  journalDelete: () => trackEvent(Events.ENTRY_DELETE),
  pageView: (page: string) => trackEvent(Events.PAGE_VIEW, { page }),
  upgrade: (tier: string, price: number) => 
    trackEvent(Events.UPGRADE, { tier, price, currency: 'USD' }),
};