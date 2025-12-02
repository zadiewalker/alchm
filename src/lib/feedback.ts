// src/lib/feedback.ts

export type FeedbackType = 'bug' | 'suggestion' | 'confusion' | 'appreciation';

export interface FeedbackData {
  type: FeedbackType;
  message: string;
  context: {
    page: string;
    userId: string | null;
    isAnonymous: boolean;
    timestamp: string;
    appVersion: string;
    buildNumber: string;
    deviceInfo: string;
    screenSize: string;
  };
  screenshot?: string; // Base64 if implemented
}

export const FEEDBACK_TYPES: Record<FeedbackType, {
  label: string;
  icon: string;
  placeholder: string;
  color: string;
}> = {
  bug: {
    label: 'Something\'s broken',
    icon: '🐛',
    placeholder: 'What happened? What did you expect to happen?',
    color: '#D76B6B',
  },
  confusion: {
    label: 'I got confused',
    icon: '🤔',
    placeholder: 'Where did you get stuck? What wasn\'t clear?',
    color: '#C5A47E',
  },
  suggestion: {
    label: 'I have an idea',
    icon: '💡',
    placeholder: 'What would make ALCHM better for you?',
    color: '#6B7FD7',
  },
  appreciation: {
    label: 'Something delighted me',
    icon: '✨',
    placeholder: 'What moment stood out? We\'d love to know.',
    color: '#41B3A3',
  },
};

export function getDeviceInfo(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  const ios = ua.match(/iPhone|iPad|iPod/);
  const iosVersion = ua.match(/OS (\d+[._]\d+)/);
  
  if (ios && iosVersion) {
    return `${ios[0]} iOS ${iosVersion[1].replace('_', '.')}`;
  }
  
  return ua.substring(0, 100);
}

export function getScreenSize(): string {
  if (typeof window === 'undefined') return 'unknown';
  return `${window.innerWidth}x${window.innerHeight}`;
}