'use client';

import { useState, useEffect } from 'react';

/**
 * Mobile Crisis Offline Manager
 * Ensures crisis resources are always available offline on mobile devices
 * Critical for users in emotional distress with poor connectivity
 */

interface CrisisResource {
  id: string;
  title: string;
  description: string;
  contactMethod: 'phone' | 'text' | 'web';
  contact: string;
  priority: 'critical' | 'high' | 'medium';
  availability: '24/7' | 'limited';
}

const CRITICAL_CRISIS_RESOURCES: CrisisResource[] = [
  {
    id: 'suicide-crisis-lifeline',
    title: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support for people in distress',
    contactMethod: 'phone',
    contact: '988',
    priority: 'critical',
    availability: '24/7'
  },
  {
    id: 'crisis-text-line',
    title: 'Crisis Text Line',
    description: 'Text HOME to 741741 for crisis support',
    contactMethod: 'text',
    contact: 'sms:741741?body=HOME',
    priority: 'critical',
    availability: '24/7'
  },
  {
    id: 'emergency-services',
    title: 'Emergency Services',
    description: 'For immediate life-threatening emergencies',
    contactMethod: 'phone',
    contact: '911',
    priority: 'critical',
    availability: '24/7'
  },
  {
    id: 'trans-lifeline',
    title: 'Trans Lifeline',
    description: 'Support for transgender community',
    contactMethod: 'phone',
    contact: '877-565-8860',
    priority: 'high',
    availability: '24/7'
  },
  {
    id: 'lgbtq-hotline',
    title: 'LGBTQ National Hotline',
    description: 'Support for LGBTQ+ individuals',
    contactMethod: 'phone',
    contact: '1-888-843-4564',
    priority: 'high',
    availability: 'limited'
  }
];

const CRISIS_COPING_TECHNIQUES = [
  {
    title: 'Grounding (5-4-3-2-1)',
    description: '5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste'
  },
  {
    title: 'Box Breathing',
    description: 'Inhale 4, hold 4, exhale 4, hold 4. Repeat.'
  },
  {
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and release each muscle group from toes to head'
  },
  {
    title: 'Ice Water on Wrists',
    description: 'Cold water on wrists can help reset your nervous system'
  }
];

export function MobileCrisisOfflineManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [showCrisisPanel, setShowCrisisPanel] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial state
    setIsOffline(!navigator.onLine);
    
    // Cache critical resources in localStorage for offline access
    try {
      localStorage.setItem('alchm-crisis-resources', JSON.stringify(CRITICAL_CRISIS_RESOURCES));
      localStorage.setItem('alchm-crisis-techniques', JSON.stringify(CRISIS_COPING_TECHNIQUES));
    } catch (error) {
      console.warn('[Crisis] Failed to cache crisis resources:', error);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    // Listen for crisis mode activation
    const handleCrisisMode = () => {
      setShowCrisisPanel(true);
      
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 300]);
      }
    };
    
    window.addEventListener('alchm:crisis-mode-activated', handleCrisisMode);
    return () => window.removeEventListener('alchm:crisis-mode-activated', handleCrisisMode);
  }, []);
  
  const handleContact = (resource: CrisisResource) => {
    try {
      if (resource.contactMethod === 'phone') {
        window.location.href = `tel:${resource.contact}`;
      } else if (resource.contactMethod === 'text') {
        window.location.href = resource.contact;
      } else if (resource.contactMethod === 'web') {
        window.open(resource.contact, '_blank');
      }
      
      // Log usage for analytics (only successful contacts)
      console.log(`[Crisis] Contact initiated: ${resource.id}`);
      
    } catch (error) {
      console.error('[Crisis] Contact failed:', error);
      
      // Fallback: show contact info as text
      alert(`Emergency Contact: ${resource.contact}\nTap to call or save this number.`);
    }
  };
  
  if (!showCrisisPanel) return null;
  
  return (
    <div className="fixed inset-0 bg-red-900/95 backdrop-blur-sm z-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 text-center">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-medium">🆘 Crisis Support</div>
          <button
            onClick={() => setShowCrisisPanel(false)}
            className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-full min-h-[52px] min-w-[52px] flex items-center justify-center"
            style={{ touchAction: 'manipulation' }}
            aria-label="Close crisis support panel"
          >
            ✕
          </button>
        </div>
        <p className="text-red-100 text-sm mt-2">
          Help is available right now. You are not alone.
        </p>
        {isOffline && (
          <div className="bg-yellow-600 text-yellow-100 p-2 rounded-lg mt-2 text-sm">
            📱 You're offline, but these numbers still work
          </div>
        )}
      </div>
      
      {/* Critical Resources */}
      <div className="flex-1 p-4 space-y-4">
        <div className="text-white text-lg font-medium mb-4">
          Immediate Help Available:
        </div>
        
        {CRITICAL_CRISIS_RESOURCES
          .filter(resource => resource.priority === 'critical')
          .map(resource => (
            <button
              key={resource.id}
              onClick={() => handleContact(resource)}
              className="w-full bg-red-500 hover:bg-red-400 text-white p-6 rounded-2xl text-left touch-target-crisis min-h-[100px] border-2 border-red-300"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-xl font-medium mb-2">{resource.title}</div>
                  <div className="text-red-100 text-sm mb-2">{resource.description}</div>
                  <div className="text-red-200 font-mono text-lg">{resource.contact}</div>
                </div>
                <div className="text-3xl">
                  {resource.contactMethod === 'phone' ? '📞' : '💬'}
                </div>
              </div>
            </button>
        ))}
        
        {/* Additional Resources */}
        <div className="text-white text-lg font-medium mt-8 mb-4">
          Additional Support:
        </div>
        
        {CRITICAL_CRISIS_RESOURCES
          .filter(resource => resource.priority === 'high')
          .map(resource => (
            <button
              key={resource.id}
              onClick={() => handleContact(resource)}
              className="w-full bg-red-600 hover:bg-red-500 text-white p-4 rounded-xl text-left touch-target-large min-h-[80px]"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="text-lg font-medium">{resource.title}</div>
              <div className="text-red-200 text-sm mt-1">{resource.description}</div>
              <div className="text-red-300 font-mono mt-2">{resource.contact}</div>
            </button>
        ))}
        
        {/* Quick Coping Techniques */}
        <div className="bg-red-800/50 rounded-2xl p-4 mt-8">
          <div className="text-white text-lg font-medium mb-4">
            🌿 Quick Calming Techniques:
          </div>
          
          <div className="space-y-3">
            {CRISIS_COPING_TECHNIQUES.map((technique, index) => (
              <div key={index} className="bg-red-700/50 p-3 rounded-xl">
                <div className="text-white font-medium">{technique.title}</div>
                <div className="text-red-200 text-sm mt-1">{technique.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Safe Reporting and Privacy Notice */}
        <div className="bg-green-800/30 border-2 border-green-600 rounded-2xl p-4 mt-6">
          <div className="text-green-200 text-center mb-4">
            <div className="text-2xl mb-2">🤗</div>
            <div className="font-medium text-lg">You matter.</div>
            <div className="text-sm mt-2">
              This crisis will pass. Help is available. You are not alone.
            </div>
          </div>
          
          <button
            onClick={() => {
              coordinator.reportUserSafe();
              setShowCrisisPanel(false);
              
              // Show confirmation
              const confirmation = document.createElement('div');
              confirmation.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #059669;
                color: white;
                padding: 16px 24px;
                border-radius: 20px;
                font-weight: 600;
                z-index: 10002;
                text-align: center;
              `;
              confirmation.textContent = '✓ Thank you for staying safe';
              document.body.appendChild(confirmation);
              
              setTimeout(() => confirmation.remove(), 5000);
            }}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors"
            style={{ 
              touchAction: 'manipulation',
              padding: padding,
              minHeight: touchTargetSize
            }}
          >
            ✅ I'm Safe - Return to ALCHM
          </button>
        </div>
        
        {/* Privacy Notice */}
        <div className="bg-gray-800/50 rounded-xl p-3 mt-4">
          <div className="text-gray-300 text-xs text-center">
            <div className="font-medium mb-1">🔒 Your Privacy is Protected</div>
            <div>
              Crisis interactions are logged anonymously for safety. 
              No personal information is shared without your consent.
            </div>
          </div>
        </div>
      </div>
      
      {/* Crisis-optimized styles */}
      <style jsx>{`
        .battery-optimized {
          filter: brightness(0.8);
          backdrop-filter: blur(4px);
        }
        
        .battery-optimized * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
        
        .touch-target-crisis {
          min-height: ${touchTargetSize};
          min-width: ${touchTargetSize};
          padding: ${padding};
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        .touch-target-large {
          min-height: ${tremorCompensation ? '80px' : '64px'};
          min-width: ${tremorCompensation ? '80px' : '64px'};
          padding: ${tremorCompensation ? '24px' : '16px'};
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Enhanced accessibility for crisis situations */
        button:focus {
          outline: 3px solid #ffffff;
          outline-offset: 2px;
        }
        
        /* Reduced motion for vestibular sensitivity */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse {
            animation: none;
          }
          
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-red-600 {
            background-color: #dc2626 !important;
            border: 2px solid #ffffff;
          }
          
          .bg-red-500 {
            background-color: #ef4444 !important;
            border: 2px solid #ffffff;
          }
          
          button {
            border: 2px solid #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
}

export default MobileCrisisOfflineManager;