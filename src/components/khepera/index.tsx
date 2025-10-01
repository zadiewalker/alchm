// ===== KHEPERA CHAT INTERFACE EXPORTS =====

// Main Chat Components
export { default as KheperaChat } from './KheperaChat';
export { default as KheperaMobileChat } from './KheperaMobileChat';
export { default as KheperaChatProvider, useKheperaChat, KheperaChatTrigger, ChatPositionManager } from './KheperaChatProvider';

// Accessibility Components
export { default as KheperaChatAccessibility, useKheperaChatAccessibility, AccessibleChatMessage, AccessibleChatInput } from './KheperaChatAccessibility';

// Icon Components
export { 
  default as KheperaScarabIcon,
  KheperaMinimalIcon,
  KheperaLoadingSpinner,
  KheperaPresenceIndicator,
  KheperaCulturalIcon
} from './KheperaScarabIcons';

// Legacy Exports (for backward compatibility)
export { KheperaEmotionalMirror } from './KheperaEmotionalMirror';

// ===== COMPONENT COMPOSITION HELPERS =====

import React from 'react';
import KheperaChatProvider from './KheperaChatProvider';
import KheperaChatAccessibility from './KheperaChatAccessibility';

/**
 * Complete Khepera Chat System with accessibility and provider
 * Use this as the main export for full functionality
 */
export function CompleteKheperaChat({
  children,
  enabled = true,
  crisisHandler,
  userId
}: {
  children: React.ReactNode;
  enabled?: boolean;
  crisisHandler?: () => void;
  userId?: string;
}) {
  return (
    <KheperaChatAccessibility isActive={enabled}>
      <KheperaChatProvider
        enabled={enabled}
        crisisHandler={crisisHandler}
        userId={userId}
      >
        {children}
      </KheperaChatProvider>
    </KheperaChatAccessibility>
  );
}

// ===== TYPES =====

export interface KheperaMessage {
  id: string;
  content: string;
  sender: 'user' | 'khepera';
  timestamp: Date;
  type?: 'text' | 'reflection' | 'affirmation' | 'crisis_check' | 'grounding';
  emotion?: 'calm' | 'supportive' | 'celebratory' | 'grounding';
}

export interface KheperaChatConfig {
  enabled: boolean;
  crisisDetection: boolean;
  groundingTechniques: boolean;
  voiceAnnouncements: boolean;
  mobileOptimized: boolean;
  accessibilityEnhanced: boolean;
}