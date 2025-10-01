'use client';

import { useEffect, useState, memo, useCallback } from 'react';
import { getMobilePerformanceOptimizer } from '@/lib/mobile-performance-optimizer';

interface CrisisOptimizationState {
  isActive: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  optimizationsApplied: string[];
  emergencyContacts: Array<{ name: string; number: string; type: string }>;
}

// CRITICAL: Memoized crisis mode optimizer for minimal resource usage
const CrisisModeOptimizer = memo(function CrisisModeOptimizer() {
  const [crisisState, setCrisisState] = useState<CrisisOptimizationState>({
    isActive: false,
    severity: 'low',
    optimizationsApplied: [],
    emergencyContacts: [
      { name: 'Crisis Text Line', number: '741741', type: 'text' },
      { name: 'National Suicide Prevention Lifeline', number: '988', type: 'call' },
      { name: 'Emergency Services', number: '911', type: 'call' }
    ]
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const optimizer = getMobilePerformanceOptimizer();
    
    // Check if we're already in crisis mode
    if (optimizer?.getDeviceCapabilities?.()?.isInCrisisMode) {
      activateCrisisMode('high');
    }

    // Listen for crisis activation events
    const handleCrisisActivation = (event: CustomEvent) => {
      const severity = event.detail?.severity || 'medium';
      activateCrisisMode(severity);
    };

    const handleMemoryPressure = (event: CustomEvent) => {
      const level = event.detail?.level;
      if (level === 'critical') {
        activateCrisisMode('critical');
      }
    };

    const handlePerformanceIssues = () => {
      if (optimizer?.isDeviceStruggling?.()) {
        activateCrisisMode('high');
      }
    };

    // Add event listeners
    window.addEventListener('crisisMode', handleCrisisActivation as EventListener);
    window.addEventListener('memoryPressure', handleMemoryPressure as EventListener);
    window.addEventListener('performanceDegradation', handlePerformanceIssues);

    // Check performance periodically
    const performanceCheck = setInterval(handlePerformanceIssues, 10000);

    return () => {
      window.removeEventListener('crisisMode', handleCrisisActivation as EventListener);
      window.removeEventListener('memoryPressure', handleMemoryPressure as EventListener);
      window.removeEventListener('performanceDegradation', handlePerformanceIssues);
      clearInterval(performanceCheck);
    };
  }, []);

  const activateCrisisMode = useCallback((severity: 'low' | 'medium' | 'high' | 'critical') => {
    if (isOptimizing) return; // Prevent duplicate optimizations

    setIsOptimizing(true);
    
    setCrisisState(prev => ({
      ...prev,
      isActive: true,
      severity: severity
    }));

    // Apply optimizations based on severity
    const optimizations = applyOptimizationsBySeverity(severity);
    
    setCrisisState(prev => ({
      ...prev,
      optimizationsApplied: optimizations
    }));

    // Store crisis state for persistence
    try {
      localStorage.setItem('alchm_crisis_mode', JSON.stringify({
        active: true,
        severity,
        timestamp: Date.now(),
        optimizations
      }));
    } catch (error) {
      // localStorage not available
    }

    setIsOptimizing(false);
  }, [isOptimizing]);

  const applyOptimizationsBySeverity = (severity: string): string[] => {
    const optimizations: string[] = [];

    switch (severity) {
      case 'critical':
        // Ultra-minimal mode for emergency situations
        optimizations.push('disable-all-animations');
        optimizations.push('remove-non-essential-elements');
        optimizations.push('emergency-only-ui');
        optimizations.push('force-offline-mode');
        optimizations.push('preload-emergency-contacts');
        applyUltraMinimalMode();
        break;

      case 'high':
        // Aggressive performance mode
        optimizations.push('disable-animations');
        optimizations.push('reduce-ui-complexity');
        optimizations.push('prioritize-crisis-features');
        optimizations.push('enable-large-touch-targets');
        applyHighPerformanceMode();
        break;

      case 'medium':
        // Standard crisis optimizations
        optimizations.push('simplify-interface');
        optimizations.push('reduce-visual-effects');
        optimizations.push('enable-crisis-shortcuts');
        applyStandardCrisisMode();
        break;

      case 'low':
        // Minimal optimizations
        optimizations.push('enable-crisis-support');
        optimizations.push('show-crisis-resources');
        applyMinimalCrisisMode();
        break;
    }

    return optimizations;
  };

  const applyUltraMinimalMode = () => {
    // Remove all non-essential DOM elements
    const nonEssentialElements = document.querySelectorAll('.non-essential, .decorative, .animations');
    nonEssentialElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Apply ultra-minimal CSS
    const style = document.createElement('style');
    style.id = 'ultra-minimal-crisis-mode';
    style.textContent = `
      /* Ultra-minimal crisis mode - emergency only */
      * {
        animation: none !important;
        transition: none !important;
        transform: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        box-shadow: none !important;
        border-radius: 4px !important;
      }
      
      body {
        background: #ffffff !important;
        color: #000000 !important;
        font-family: system-ui !important;
        font-size: 18px !important;
        line-height: 1.5 !important;
      }
      
      .crisis-button, .emergency-button {
        background: #dc2626 !important;
        color: #ffffff !important;
        border: 4px solid #000000 !important;
        min-height: 80px !important;
        min-width: 200px !important;
        font-size: 24px !important;
        font-weight: 900 !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 99999 !important;
      }
      
      .non-crisis * {
        display: none !important;
      }
      
      .crisis-only {
        display: block !important;
        font-size: 20px !important;
        padding: 20px !important;
        margin: 20px !important;
        border: 2px solid #000000 !important;
      }
    `;
    document.head.appendChild(style);

    // Show only crisis elements
    document.body.classList.add('ultra-crisis-mode');
    
    // Create emergency overlay
    createEmergencyOverlay();
  };

  const applyHighPerformanceMode = () => {
    const style = document.createElement('style');
    style.id = 'high-performance-crisis-mode';
    style.textContent = `
      /* High performance crisis mode */
      * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      
      .btn-primary, .crisis-button {
        min-height: 64px !important;
        min-width: 180px !important;
        font-size: 20px !important;
        font-weight: 700 !important;
        touch-action: manipulation !important;
      }
      
      .backdrop-blur-sm {
        backdrop-filter: none !important;
        background: rgba(255, 255, 255, 0.95) !important;
      }
      
      .gradient-sanctuary {
        background: #a4b792 !important; /* Solid color for performance */
      }
    `;
    document.head.appendChild(style);

    document.body.classList.add('high-performance-crisis-mode');
  };

  const applyStandardCrisisMode = () => {
    const style = document.createElement('style');
    style.id = 'standard-crisis-mode';
    style.textContent = `
      /* Standard crisis mode optimizations */
      .crisis-mode-active .btn-primary {
        min-height: 56px !important;
        font-size: 18px !important;
        font-weight: 600 !important;
      }
      
      .crisis-mode-active .non-essential {
        opacity: 0.3;
      }
      
      .crisis-mode-active .crisis-support {
        border: 3px solid #dc2626 !important;
        box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2) !important;
      }
    `;
    document.head.appendChild(style);

    document.body.classList.add('crisis-mode-active');
  };

  const applyMinimalCrisisMode = () => {
    document.body.classList.add('minimal-crisis-mode');
    
    // Show crisis resources prominently
    const crisisElements = document.querySelectorAll('.crisis-support, .emergency-button');
    crisisElements.forEach(el => {
      (el as HTMLElement).style.border = '2px solid #dc2626';
      (el as HTMLElement).style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.1)';
    });
  };

  const createEmergencyOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'emergency-crisis-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #ffffff;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      font-family: system-ui;
      text-align: center;
    `;

    overlay.innerHTML = `
      <h1 style="font-size: 36px; margin-bottom: 30px; color: #000000;">
        Emergency Support
      </h1>
      <div style="margin-bottom: 40px;">
        <a href="tel:988" 
           style="display: block; background: #dc2626; color: #ffffff; 
                  padding: 20px 40px; font-size: 24px; font-weight: 900; 
                  text-decoration: none; border-radius: 8px; margin-bottom: 20px;
                  min-height: 80px; display: flex; align-items: center; justify-content: center;">
          📞 Call 988 - Crisis Lifeline
        </a>
        <a href="sms:741741" 
           style="display: block; background: #059669; color: #ffffff; 
                  padding: 20px 40px; font-size: 24px; font-weight: 900; 
                  text-decoration: none; border-radius: 8px; margin-bottom: 20px;
                  min-height: 80px; display: flex; align-items: center; justify-content: center;">
          💬 Text 741741 - Crisis Text Line
        </a>
        <a href="tel:911" 
           style="display: block; background: #b91c1c; color: #ffffff; 
                  padding: 20px 40px; font-size: 24px; font-weight: 900; 
                  text-decoration: none; border-radius: 8px;
                  min-height: 80px; display: flex; align-items: center; justify-content: center;">
          🚨 Call 911 - Emergency
        </a>
      </div>
      <button onclick="this.parentElement.style.display='none'" 
              style="background: #6b7280; color: #ffffff; padding: 12px 24px; 
                     border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
        Return to App
      </button>
    `;

    document.body.appendChild(overlay);
  };

  const deactivateCrisisMode = useCallback(() => {
    setCrisisState(prev => ({
      ...prev,
      isActive: false,
      optimizationsApplied: []
    }));

    // Remove crisis mode styles
    const crisisStyles = document.querySelectorAll('#ultra-minimal-crisis-mode, #high-performance-crisis-mode, #standard-crisis-mode');
    crisisStyles.forEach(style => style.remove());

    // Remove crisis mode classes
    document.body.classList.remove(
      'ultra-crisis-mode',
      'high-performance-crisis-mode', 
      'crisis-mode-active',
      'minimal-crisis-mode'
    );

    // Remove emergency overlay
    const overlay = document.getElementById('emergency-crisis-overlay');
    if (overlay) {
      overlay.remove();
    }

    // Clear localStorage
    try {
      localStorage.removeItem('alchm_crisis_mode');
    } catch (error) {
      // localStorage not available
    }
  }, []);

  // Check for stored crisis mode on mount
  useEffect(() => {
    try {
      const storedState = localStorage.getItem('alchm_crisis_mode');
      if (storedState) {
        const parsed = JSON.parse(storedState);
        if (parsed.active && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
          activateCrisisMode(parsed.severity);
        }
      }
    } catch (error) {
      // Invalid stored state
    }
  }, [activateCrisisMode]);

  // Debug info (only in development)
  if (process.env.NODE_ENV === 'development' && crisisState.isActive) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(220, 38, 38, 0.9)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10000,
        fontFamily: 'monospace'
      }}>
        CRISIS MODE: {crisisState.severity.toUpperCase()}
        <br />
        Optimizations: {crisisState.optimizationsApplied.length}
        <button 
          onClick={deactivateCrisisMode}
          style={{
            marginLeft: '8px',
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '2px 6px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          Deactivate
        </button>
      </div>
    );
  }

  return null; // Component is invisible in production
});

export default CrisisModeOptimizer;

// Export utility functions for manual crisis mode activation
export const activateEmergencyCrisisMode = () => {
  window.dispatchEvent(new CustomEvent('crisisMode', {
    detail: { severity: 'critical' }
  }));
};

export const activatePerformanceCrisisMode = () => {
  window.dispatchEvent(new CustomEvent('crisisMode', {
    detail: { severity: 'high' }
  }));
};

export const activateStandardCrisisMode = () => {
  window.dispatchEvent(new CustomEvent('crisisMode', {
    detail: { severity: 'medium' }
  }));
};