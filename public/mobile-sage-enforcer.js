/**
 * ALCHM Mobile Sage Green Enforcer
 * 
 * This JavaScript runs immediately on mobile devices to ensure
 * sage green (#a4b792) colors are displayed regardless of CSS
 * loading issues, cache problems, or stylesheet conflicts.
 * 
 * Nuclear option - forces sage green with maximum priority
 */

(function() {
  'use strict';
  
  // Constants
  const SAGE_PRIMARY = '#a4b792';
  const SAGE_SECONDARY = '#8fa37c';
  const SAGE_GRADIENT = `linear-gradient(145deg, ${SAGE_PRIMARY} 0%, ${SAGE_SECONDARY} 100%)`;
  const WHITE_TEXT = '#fefcfb';
  
  // Detection functions
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768 ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0);
  };
  
  const isIOSSafari = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };
  
  // Sacred Contract styling constants
  const SACRED_CONTRACT = {
    background: 'rgba(164, 183, 146, 0.15)',
    border: '1px solid rgba(164, 183, 146, 0.3)',
    backdropFilter: 'blur(8px)',
    textColor: '#2c2c2c',
    wisdomColor: '#525f44'
  };

  // Core sage green enforcement with Sacred Contract support
  const enforceSageGreen = () => {
    console.log('🚨 ALCHM: Enforcing sage green colors on mobile');
    
    try {
      // 1. Force immediate background on critical elements
      const criticalElements = [
        document.documentElement,
        document.body,
        document.querySelector('main'),
        document.querySelector('.sanctuary-layout'),
        document.querySelector('.auth-sanctuary'),
        document.querySelector('.home-sanctuary')
      ].filter(Boolean);
      
      criticalElements.forEach(el => {
        if (el) {
          el.style.cssText += `
            background: ${SAGE_GRADIENT} !important;
            background-color: ${SAGE_PRIMARY} !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            color: ${WHITE_TEXT} !important;
          `;
        }
      });
      
      // 2. Force CSS custom properties
      if (document.documentElement) {
        const root = document.documentElement;
        const properties = {
          '--surface': SAGE_PRIMARY,
          '--surface-light': '#f7f7f2',
          '--sage': SAGE_PRIMARY,
          '--sage-primary': SAGE_PRIMARY,
          '--sage-secondary': SAGE_SECONDARY,
          '--sage-400': SAGE_PRIMARY,
          '--sage-500': SAGE_SECONDARY,
          '--color-primary': SAGE_PRIMARY
        };
        
        Object.entries(properties).forEach(([prop, value]) => {
          root.style.setProperty(prop, value, 'important');
        });
      }
      
      // 3. Sacred Contract specific enforcement
      enforceSacredContract();
      
      // 4. iOS Safari specific fixes
      if (isIOSSafari()) {
        document.body.style.cssText += `
          -webkit-background-attachment: fixed !important;
          background-attachment: fixed !important;
        `;
      }
      
      console.log('✅ ALCHM: Sage green enforcement complete');
      
    } catch (error) {
      console.error('❌ ALCHM: Sage green enforcement failed:', error);
    }
  };

  // Sacred Contract specific styling enforcement
  const enforceSacredContract = () => {
    console.log('🌿 ALCHM: Enforcing Sacred Contract styling');
    
    try {
      // Find Sacred Contract elements by various selectors
      const selectors = [
        '.card-sanctuary',
        'section[style*="rgba(164, 183, 146"]',
        '.sacred-contract',
        '[data-contract="sacred"]'
      ];
      
      // Also find by content
      const allSections = document.querySelectorAll('section, div');
      const contractElements = new Set();
      
      // Add elements found by selectors
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => contractElements.add(el));
      });
      
      // Add elements found by content
      allSections.forEach(section => {
        const text = section.textContent || '';
        if (text.includes('sacred contract') || 
            text.includes('You show up') || 
            text.includes('protect the words')) {
          contractElements.add(section);
        }
      });
      
      // Apply Sacred Contract styling to all found elements
      contractElements.forEach(element => {
        console.log('🌿 MOBILE: Applying Sacred Contract styling');
        
        element.style.cssText += `
          background: ${SACRED_CONTRACT.background} !important;
          backdrop-filter: ${SACRED_CONTRACT.backdropFilter} !important;
          border: ${SACRED_CONTRACT.border} !important;
          border-radius: 16px !important;
          padding: 2rem !important;
          margin: var(--space-sanctuary, 3rem) auto 0 !important;
          text-align: center !important;
          position: relative !important;
          z-index: 10 !important;
          max-width: 600px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        `;
        
        // Style headings in Sacred Contract
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          heading.style.cssText += `
            color: ${SACRED_CONTRACT.textColor} !important;
            font-weight: 300 !important;
            margin-bottom: var(--space-breath, 1rem) !important;
          `;
        });
        
        // Style wisdom text in Sacred Contract
        const wisdomElements = element.querySelectorAll('p, .wisdom-text');
        wisdomElements.forEach(p => {
          p.style.cssText += `
            color: ${SACRED_CONTRACT.wisdomColor} !important;
            line-height: 1.6 !important;
            max-width: 500px !important;
            margin: 0 auto !important;
          `;
        });
      });
      
      console.log(`✅ ALCHM: Sacred Contract styling applied to ${contractElements.size} elements`);
      
    } catch (error) {
      console.error('❌ ALCHM: Sacred Contract enforcement failed:', error);
    }
  };
  
  // Advanced enforcement for stubborn cases
  const advancedEnforcement = () => {
    // Watch for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              
              // Check if this is a layout container
              if (element.classList.contains('sanctuary-layout') ||
                  element.classList.contains('auth-sanctuary') ||
                  element.classList.contains('home-sanctuary') ||
                  element.tagName === 'MAIN') {
                
                element.style.cssText += `
                  background: ${SAGE_GRADIENT} !important;
                  background-color: ${SAGE_PRIMARY} !important;
                `;
              }
              
              // Check if this might be a Sacred Contract element
              const text = element.textContent || '';
              if (text.includes('sacred contract') || 
                  text.includes('You show up') || 
                  text.includes('protect the words') ||
                  element.classList.contains('card-sanctuary')) {
                console.log('🌿 MOBILE: Dynamically added Sacred Contract detected');
                setTimeout(() => enforceSacredContract(), 100);
              }
            }
          });
        }
        
        // Watch for style attribute changes
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target;
          if (target && (target.tagName === 'BODY' || target.tagName === 'HTML' || target.tagName === 'MAIN')) {
            // Re-enforce sage green if something tries to change it
            setTimeout(() => enforceSageGreen(), 0);
          }
          
          // Check if Sacred Contract styling was overridden
          if (target && target.textContent && 
              (target.textContent.includes('sacred contract') || 
               target.textContent.includes('You show up'))) {
            console.log('🌿 MOBILE: Sacred Contract style change detected, re-enforcing');
            setTimeout(() => enforceSacredContract(), 50);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  };
  
  // Cache busting and persistence
  const preventCacheOverride = () => {
    // Store sage green preference
    try {
      localStorage.setItem('alchm_sage_enforced', 'true');
      localStorage.setItem('alchm_sage_timestamp', Date.now().toString());
    } catch (e) {
      console.warn('ALCHM: Could not persist sage green preference:', e);
    }
    
    // Add cache bust attributes
    if (document.documentElement) {
      document.documentElement.setAttribute('data-sage-enforced', 'true');
      document.documentElement.setAttribute('data-sage-timestamp', Date.now().toString());
    }
  };
  
  // Emergency recovery for critical failures
  const emergencyRecovery = () => {
    // If page appears to have loaded without sage green, force it
    setTimeout(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
      
      // Check if sage green is actually applied
      const hasSageGreen = bodyBg.includes('164, 183, 146') || 
                          htmlBg.includes('164, 183, 146') ||
                          bodyBg.includes('#a4b792') ||
                          htmlBg.includes('#a4b792');
      
      if (!hasSageGreen) {
        console.warn('🚨 ALCHM: Emergency recovery - sage green not detected');
        enforceSageGreen();
        
        // Try again in case of timing issues
        setTimeout(enforceSageGreen, 100);
        setTimeout(enforceSageGreen, 500);
      }
    }, 1000);
  };
  
  // Trauma-informed crisis monitoring for mobile users
  const crisisMonitoring = () => {
    console.log('🚨 ALCHM: Initializing trauma-informed crisis monitoring');
    
    // Monitor for stress indicators that might affect styling visibility
    let stressIndicators = 0;
    
    // Rapid tapping might indicate crisis/frustration
    let rapidTapCount = 0;
    let rapidTapTimer = null;
    
    document.addEventListener('touchstart', () => {
      rapidTapCount++;
      
      if (rapidTapTimer) {
        clearTimeout(rapidTapTimer);
      }
      
      rapidTapTimer = setTimeout(() => {
        if (rapidTapCount > 5) {
          console.log('🚨 CRISIS INDICATOR: Rapid tapping detected, reinforcing styling');
          stressIndicators++;
          
          // Emergency styling enforcement
          setTimeout(() => {
            enforceSageGreen();
            enforceSacredContract();
          }, 100);
        }
        rapidTapCount = 0;
      }, 2000);
    }, { passive: true });
    
    // Frequent orientation changes might indicate distress
    let orientationChangeCount = 0;
    let orientationTimer = null;
    
    window.addEventListener('orientationchange', () => {
      orientationChangeCount++;
      
      if (orientationTimer) {
        clearTimeout(orientationTimer);
      }
      
      orientationTimer = setTimeout(() => {
        if (orientationChangeCount > 3) {
          console.log('🚨 CRISIS INDICATOR: Frequent orientation changes, reinforcing styling');
          stressIndicators++;
          
          // Emergency styling enforcement
          setTimeout(() => {
            enforceSageGreen();
            enforceSacredContract();
          }, 500);
        }
        orientationChangeCount = 0;
      }, 10000);
    });
    
    // Page reload frequency monitoring
    let pageLoadTime = Date.now();
    let reloadCount = parseInt(sessionStorage.getItem('alchm_reload_count') || '0');
    reloadCount++;
    sessionStorage.setItem('alchm_reload_count', reloadCount.toString());
    
    if (reloadCount > 3) {
      console.log('🚨 CRISIS INDICATOR: Frequent page reloads, emergency enforcement');
      stressIndicators++;
      
      // Immediate emergency enforcement
      enforceSageGreen();
      enforceSacredContract();
      
      // Set up aggressive monitoring
      const aggressiveInterval = setInterval(() => {
        enforceSacredContract();
      }, 1000); // Every second for first minute
      
      setTimeout(() => {
        clearInterval(aggressiveInterval);
      }, 60000);
    }
    
    // Emergency styling button for users in crisis
    const createEmergencyButton = () => {
      const button = document.createElement('button');
      button.innerHTML = '🌿 Fix Colors';
      button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: rgba(220, 38, 38, 0.9);
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        display: none;
      `;
      
      button.addEventListener('click', () => {
        console.log('🚨 EMERGENCY: User manually triggered styling fix');
        enforceSageGreen();
        enforceSacredContract();
        
        // Clear all caches
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => caches.delete(cacheName));
          });
        }
        
        button.style.display = 'none';
      });
      
      document.body.appendChild(button);
      
      // Show button if styling issues detected
      setTimeout(() => {
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const hasSage = bodyBg.includes('164, 183, 146') || bodyBg.includes('#a4b792');
        
        if (!hasSage || stressIndicators > 1) {
          button.style.display = 'block';
          console.log('🚨 EMERGENCY: Emergency styling button activated');
        }
      }, 3000);
    };
    
    // Create emergency button after page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createEmergencyButton);
    } else {
      createEmergencyButton();
    }
  };

  // Main execution with trauma-informed enhancements
  const initialize = () => {
    if (!isMobile()) {
      console.log('ALCHM: Desktop detected, skipping mobile sage enforcement');
      return;
    }
    
    console.log('🌿 ALCHM: Initializing trauma-informed mobile sage enforcement');
    
    // Immediate enforcement
    enforceSageGreen();
    
    // Set up advanced monitoring
    advancedEnforcement();
    
    // Trauma-informed crisis monitoring
    crisisMonitoring();
    
    // Prevent cache issues
    preventCacheOverride();
    
    // Emergency recovery
    emergencyRecovery();
    
    // Re-enforce on various events
    window.addEventListener('load', () => {
      enforceSageGreen();
      setTimeout(enforceSacredContract, 500); // Extra delay for Sacred Contract
    });
    
    window.addEventListener('DOMContentLoaded', () => {
      enforceSageGreen();
      setTimeout(enforceSacredContract, 300);
    });
    
    window.addEventListener('resize', () => {
      setTimeout(() => {
        enforceSageGreen();
        enforceSacredContract();
      }, 200);
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        enforceSageGreen();
        enforceSacredContract();
      }, 100);
    });
    
    // Handle page visibility changes (mobile browser tab switching)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => {
          enforceSageGreen();
          enforceSacredContract();
        }, 50);
      }
    });
    
    // Handle touch events that might trigger repaints
    document.addEventListener('touchstart', () => {
      setTimeout(enforceSacredContract, 0);
    }, { passive: true });
    
    // Periodic Sacred Contract checks for vulnerable users
    setInterval(() => {
      enforceSacredContract();
    }, 15000); // Every 15 seconds
    
    console.log('✅ ALCHM: Trauma-informed mobile sage enforcement initialized');
  };
  
  // Start immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Backup - run on next tick regardless
  setTimeout(initialize, 0);
  
})();