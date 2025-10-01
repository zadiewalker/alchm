'use client';

/**
 * ALCHM Technical Support Chatbot Integration Guide
 * 
 * This component demonstrates how to integrate the TechnicalSupportChatbot
 * with ALCHM's existing design system and sanctuary architecture.
 * 
 * Design Philosophy:
 * "Every interaction should feel like receiving help from a caring friend 
 * within a beautiful, calming digital sanctuary." - Jony Ive principles 
 * applied to technical support.
 */

import React from 'react';
import { TechnicalSupportChatbot } from './TechnicalSupportChatbot';

// Import existing ALCHM design system
import '../../styles/jony-ive-sage-system.css';
import '../../styles/support-chatbot.css';

/**
 * Integration Example Component
 * Shows how to add the chatbot to any ALCHM page
 */
export function ChatbotIntegrationExample() {
  return (
    <>
      {/* Your existing ALCHM page content */}
      <main className="min-h-screen bg-sage-primary">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-light text-sanctuary mb-8">
            Your ALCHM Experience
          </h1>
          <p className="text-sanctuary/90 text-lg leading-relaxed mb-12">
            The technical support chatbot seamlessly integrates with your healing journey,
            providing assistance without disrupting the sacred space of your digital sanctuary.
          </p>
          
          {/* Example content showcasing the design integration */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card sanctuary">
              <h3 className="text-xl font-medium text-sage-active mb-4">
                Sanctuary Design Principles
              </h3>
              <ul className="space-y-3 text-sanctuary-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">✨</span>
                  <span>Translucent containers that don't obstruct the healing space</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">🎨</span>
                  <span>Sage green color palette maintains visual harmony</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">📱</span>
                  <span>Mobile-optimized with trauma-informed touch targets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">♿</span>
                  <span>Accessibility features for users in emotional distress</span>
                </li>
              </ul>
            </div>
            
            <div className="card elevated">
              <h3 className="text-xl font-medium text-sage-active mb-4">
                Therapeutic Interactions
              </h3>
              <ul className="space-y-3 text-sanctuary-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">💝</span>
                  <span>Heart-sparkle animations for successful solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">🌱</span>
                  <span>Gentle, never jarring transitions and animations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">🔒</span>
                  <span>Crisis detection with caring, not clinical responses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sage-400 mt-1">🤝</span>
                  <span>Seamless escalation to human support when needed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      {/* The Technical Support Chatbot - Always available but non-intrusive */}
      <TechnicalSupportChatbot />
    </>
  );
}

/**
 * Integration Instructions for ALCHM Development Team
 * 
 * === STEP 1: Add to Layout ===
 * Add the TechnicalSupportChatbot component to your main layout file:
 * 
 * ```tsx
 * import { TechnicalSupportChatbot } from '@/components/support/TechnicalSupportChatbot';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <TechnicalSupportChatbot />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 * 
 * === STEP 2: Import Styles ===
 * Add the chatbot styles to your global CSS:
 * 
 * ```css
 * @import 'src/styles/support-chatbot.css';
 * ```
 * 
 * === STEP 3: Configure Environment ===
 * Add environment variables for chatbot integration:
 * 
 * ```env
 * NEXT_PUBLIC_SUPPORT_API_URL=https://api.alchm.app/support
 * NEXT_PUBLIC_SUPPORT_WEBSOCKET_URL=wss://api.alchm.app/support/ws
 * NEXT_PUBLIC_ENABLE_VOICE_SUPPORT=true
 * NEXT_PUBLIC_ENABLE_SCREEN_SHARING=true
 * ```
 * 
 * === STEP 4: Crisis Integration ===
 * The chatbot automatically integrates with ALCHM's crisis detection system.
 * Ensure these crisis resources are available:
 * 
 * - Crisis hotline numbers (988, local resources)
 * - Escalation protocols for human intervention
 * - Emergency contact procedures
 * 
 * === STEP 5: Analytics Integration ===
 * Track support interactions for continuous improvement:
 * 
 * ```tsx
 * import { analytics } from '@/lib/analytics';
 * 
 * // Track support chatbot usage
 * analytics.track('support_chatbot_opened', {
 *   user_state: 'crisis' | 'normal',
 *   entry_point: 'fab' | 'menu' | 'error_page'
 * });
 * ```
 * 
 * === DESIGN SYSTEM INTEGRATION ===
 * 
 * The chatbot uses ALCHM's existing design tokens:
 * 
 * - Colors: All sage green variants from jony-ive-sage-system.css
 * - Typography: System font stack for performance and consistency
 * - Spacing: 8px grid system for mathematical harmony
 * - Animations: Trauma-informed timing (300ms standard, reduced motion support)
 * - Accessibility: WCAG 2.1 AA compliance with crisis-specific enhancements
 * 
 * === MOBILE OPTIMIZATION ===
 * 
 * Mobile-specific considerations:
 * 
 * - 72px+ touch targets for crisis situations
 * - One-handed operation support
 * - iOS zoom prevention (16px base font size)
 * - Haptic feedback for important actions
 * - Offline functionality for essential features
 * 
 * === CRISIS SAFETY FEATURES ===
 * 
 * Built-in safety mechanisms:
 * 
 * - Crisis keyword detection with gentle escalation
 * - Direct connection to 988 Crisis Lifeline
 * - Visual crisis indicators (gentle, not alarming)
 * - Automatic escalation protocols
 * - Emergency contact integration
 * 
 * === ACCESSIBILITY FEATURES ===
 * 
 * Trauma-informed accessibility:
 * 
 * - High contrast mode toggle
 * - Reduced motion preferences
 * - Voice input support
 * - Screen reader optimization
 * - Large text options for distressed users
 * - Keyboard navigation support
 * 
 * === CUSTOMIZATION OPTIONS ===
 * 
 * The chatbot accepts these configuration props:
 * 
 * ```tsx
 * <TechnicalSupportChatbot
 *   theme="sage" | "sanctuary" | "high-contrast"
 *   position="bottom-right" | "bottom-left" | "center"
 *   crisisMode={boolean}
 *   voiceEnabled={boolean}
 *   fileUploadEnabled={boolean}
 *   maxFileSize={number} // in MB
 *   supportedLanguages={string[]}
 *   escalationEndpoint={string}
 * />
 * ```
 * 
 * === PERFORMANCE CONSIDERATIONS ===
 * 
 * - Lazy loading: Chatbot loads only when first opened
 * - Code splitting: Separate bundle for chatbot functionality
 * - Image optimization: All icons use SVG or emoji
 * - Memory management: Message history limits and cleanup
 * - Network efficiency: WebSocket for real-time, REST for file uploads
 * 
 * === TESTING GUIDELINES ===
 * 
 * Test the chatbot across scenarios:
 * 
 * - Crisis detection and response
 * - File upload functionality
 * - Voice input (if enabled)
 * - Accessibility compliance
 * - Mobile device compatibility
 * - Offline functionality
 * - Performance under load
 * 
 * === MONITORING & ANALYTICS ===
 * 
 * Key metrics to track:
 * 
 * - Response time and user satisfaction
 * - Crisis detection accuracy
 * - Escalation rates and reasons
 * - File upload success rates
 * - Mobile vs desktop usage patterns
 * - Accessibility feature adoption
 * 
 */

export default ChatbotIntegrationExample;