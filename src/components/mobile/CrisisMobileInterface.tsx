'use client';

import { useEffect, useState, useCallback, memo, useRef } from 'react';
import { getMobilePerformanceOptimizer } from '@/lib/mobile-performance-optimizer';
import { coreWebVitalsMonitor } from '@/lib/core-web-vitals-monitor';
import { getCrisisModeCoordinator, useCrisisModeCoordinator } from '@/lib/mobile/crisis-mode-coordinator';
import { MobileCrisisOfflineManager } from './MobileCrisisOfflineManager';
import { MobileCrisisDetectionSystem, useCrisisDetection } from './MobileCrisisDetectionSystem';

interface CrisisMobileInterfaceProps {
  isActive?: boolean;
  severity?: 'none' | 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  onCrisisActivated?: (severity: string) => void;
  onResourceAccessed?: (resource: string) => void;
  onTherapistAlerted?: (priority: string) => void;
  onEmergencyEscalation?: () => void;
  enableOfflineMode?: boolean;
  enableTherapistIntegration?: boolean;
  enablePerformanceMonitoring?: boolean;
  children?: React.ReactNode;
}

interface CrisisMetrics {
  lcp: number;
  fid: number;
  cls: number;
  memoryUsage: number;
  batteryLevel?: number;
  isOffline: boolean;
  connectionType: string;
}

// Memoized crisis interface for maximum performance with full system integration
const CrisisMobileInterface = memo(function CrisisMobileInterface({
  isActive = false,
  severity = 'medium',
  onCrisisActivated,
  onResourceAccessed,
  onTherapistAlerted,
  onEmergencyEscalation,
  enableOfflineMode = true,
  enableTherapistIntegration = true,
  enablePerformanceMonitoring = true,
  children
}: CrisisMobileInterfaceProps) {
  // Crisis coordinator integration
  const { state: coordinatorState, coordinator, isActive: coordinatorActive } = useCrisisModeCoordinator();
  const { state: detectionState, actions: detectionActions } = useCrisisDetection();
  
  const [metrics, setMetrics] = useState<CrisisMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    memoryUsage: 0,
    isOffline: false,
    connectionType: 'unknown'
  });
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOfflineManager, setShowOfflineManager] = useState(false);
  const [therapistConnectionStatus, setTherapistConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [emergencyModeActive, setEmergencyModeActive] = useState(false);
  const lastTouchRef = useRef<{ x: number; y: number; timestamp: number }>({ x: 0, y: 0, timestamp: 0 });
  const tremorDetectionRef = useRef<number[]>([]);
  const performanceThresholdRef = useRef<number>(0);
  
  // Derived state from coordinator
  const isOneHanded = coordinatorState.accessibilityNeeds.oneHandedMode;
  const isHighContrast = coordinatorState.accessibilityNeeds.highContrast;
  const reducedMotion = coordinatorState.accessibilityNeeds.reducedMotion;
  const tremorCompensation = coordinatorState.accessibilityNeeds.tremorCompensation;
  const batteryLevel = coordinatorState.batteryLevel;
  const networkStatus = coordinatorState.networkStatus;

  // Initialize integrated crisis management system
  useEffect(() => {
    if (!enablePerformanceMonitoring) return;
    
    const optimizer = getMobilePerformanceOptimizer();
    const vitalsMonitor = coreWebVitalsMonitor;

    // Start crisis detection timing
    optimizer?.startCrisisDetectionTiming();

    // Monitor Core Web Vitals for crisis thresholds - integrate with coordinator
    const unsubscribe = vitalsMonitor.onAlert((alert) => {
      if (alert.severity === 'critical') {
        // Use coordinator to handle performance crisis
        coordinator.activateCrisisMode('performance_degradation', 'high', 85);
        handlePerformanceCrisis(alert);
      }
    });

    // Initial metrics collection
    collectCrisisMetrics();

    // Set up periodic metrics monitoring (every 3s during crisis, 10s otherwise)
    const interval = coordinatorActive ? 3000 : 10000;
    const metricsInterval = setInterval(collectCrisisMetrics, interval);

    // Monitor for crisis indicators
    detectCrisisIndicators();

    // Complete crisis detection timing
    optimizer?.endCrisisDetectionTiming();

    return () => {
      unsubscribe();
      clearInterval(metricsInterval);
    };
  }, [coordinatorActive, enablePerformanceMonitoring]);

  const collectCrisisMetrics = useCallback(async () => {
    try {
      const vitals = coreWebVitalsMonitor.getLatestMetrics();
      const optimizer = getMobilePerformanceOptimizer();
      const perfMetrics = optimizer?.getMetrics();
      
      // Check battery status
      let batteryLevel: number | undefined;
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          batteryLevel = battery.level;
        } catch (error) {
          // Battery API not available
        }
      }

      // Check connection status
      const connection = (navigator as any).connection;
      const isOffline = !navigator.onLine;
      const connectionType = connection?.effectiveType || 'unknown';

      setMetrics({
        lcp: vitals?.lcp || 0,
        fid: vitals?.fid || 0,
        cls: vitals?.cls || 0,
        memoryUsage: perfMetrics?.memoryUsage || 0,
        batteryLevel,
        isOffline,
        connectionType
      });

      // Auto-escalate severity based on metrics
      if (vitals?.lcp && vitals.lcp > 2500) { // LCP > 2.5s
        escalateCrisisLevel('high');
      }
      if (vitals?.lcp && vitals.lcp > 4000) { // LCP > 4s
        escalateCrisisLevel('critical');
      }

    } catch (error) {
      console.warn('Crisis metrics collection failed:', error);
    }
  }, []);

  const handlePerformanceCrisis = useCallback((alert: any) => {
    console.warn(`Performance crisis detected: ${alert.metric} = ${alert.value}`);
    
    performanceThresholdRef.current += 1;
    
    // Escalate through coordinator for integrated response
    if (alert.metric === 'lcp' && alert.value > 4000) {
      coordinator.activateCrisisMode('performance_degradation', 'critical', 90);
    } else if (alert.metric === 'lcp' && alert.value > 3000) {
      coordinator.activateCrisisMode('performance_degradation', 'high', 80);
    }
    
    // Immediately enable ultra-minimal mode
    if (alert.metric === 'lcp' && alert.value > 3000) {
      activateUltraMinimalMode();
    }
    
    // Log performance crisis for therapist awareness
    if (enableTherapistIntegration && performanceThresholdRef.current >= 3) {
      onTherapistAlerted?.('performance_degradation');
    }
  }, [coordinator, enableTherapistIntegration, onTherapistAlerted]);

  const activateUltraMinimalMode = useCallback(() => {
    if (isOptimizing) return;
    setIsOptimizing(true);

    // Apply critical performance optimizations
    document.body.classList.add('ultra-minimal-crisis');
    document.documentElement.style.setProperty('--crisis-mode', 'ultra');
    document.documentElement.style.setProperty('--disable-all-animations', '1');
    document.documentElement.style.setProperty('--simplify-layout', '1');

    // Create ultra-minimal crisis overlay
    createMinimalCrisisOverlay();

    onCrisisActivated?.('critical');
    setIsOptimizing(false);
  }, [isOptimizing, onCrisisActivated]);

  const enableBatteryConservation = useCallback(() => {
    document.body.classList.add('battery-conservation');
    document.documentElement.style.setProperty('--disable-gpu-acceleration', '1');
    document.documentElement.style.setProperty('--reduce-brightness', '0.8');
    document.documentElement.style.setProperty('--minimal-processing', '1');
  }, []);

  const escalateCrisisLevel = useCallback((newSeverity: string) => {
    const severityLevels = ['none', 'low', 'medium', 'high', 'critical', 'emergency'];
    const currentIndex = severityLevels.indexOf(coordinatorState.severity);
    const newIndex = severityLevels.indexOf(newSeverity as any);
    
    if (newIndex > currentIndex) {
      // Use coordinator for integrated escalation
      coordinator.activateCrisisMode('user_activated', newSeverity as any, 75);
      enableStressAdaptation();
      onCrisisActivated?.(newSeverity);
      
      // Trigger therapist alert for high-risk escalations
      if (enableTherapistIntegration && (newSeverity === 'critical' || newSeverity === 'emergency')) {
        setTherapistConnectionStatus('connecting');
        onTherapistAlerted?.(newSeverity);
        
        // Simulate therapist connection
        setTimeout(() => {
          setTherapistConnectionStatus('connected');
        }, 2000);
      }
    }
  }, [coordinatorState.severity, coordinator, enableTherapistIntegration, onCrisisActivated, onTherapistAlerted]);

  const detectCrisisIndicators = useCallback(() => {
    // Monitor for tremor patterns
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const now = Date.now();
      const lastTouch = lastTouchRef.current;
      
      if (now - lastTouch.timestamp > 100) { // Sample every 100ms
        const distance = Math.sqrt(
          Math.pow(touch.clientX - lastTouch.x, 2) + 
          Math.pow(touch.clientY - lastTouch.y, 2)
        );
        
        tremorDetectionRef.current.push(distance);
        
        // Keep only last 10 samples
        if (tremorDetectionRef.current.length > 10) {
          tremorDetectionRef.current.shift();
        }

        // Detect potential tremor pattern
        if (tremorDetectionRef.current.length >= 5) {
          const avgMovement = tremorDetectionRef.current.reduce((a, b) => a + b, 0) / tremorDetectionRef.current.length;
          
          if (avgMovement > 50 && avgMovement < 200) { // Tremor range
            enableTremorCompensation();
          }
        }

        lastTouchRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          timestamp: now
        };
      }
    };

    // Monitor for panic button usage
    const handlePanicGesture = (e: TouchEvent) => {
      if (e.touches.length === 3) { // Three-finger tap for emergency
        activateEmergencyMode();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchstart', handlePanicGesture, { passive: true });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchstart', handlePanicGesture);
    };
  }, []);

  const enableTremorCompensation = useCallback(() => {
    document.body.classList.add('tremor-compensation');
    // Enforce minimum 52px touch targets for tremor safety (enhanced for crisis)
    document.documentElement.style.setProperty('--touch-target-size', 'max(64px, 72px)');   // Enhanced tremor-safe touch targets
    document.documentElement.style.setProperty('--touch-padding', '32px');  // Increased padding
    document.documentElement.style.setProperty('--stabilize-taps', '1');
    document.documentElement.style.setProperty('--tremor-safe-spacing', '16px');
    
    // Notify coordinator of tremor detection
    coordinator.updateConfig({
      automaticTremorDetection: true
    });
  }, [coordinator]);

  // Enable stress adaptation for crisis situations
  const enableStressAdaptation = useCallback(() => {
    document.body.classList.add('stress-adaptation-active');
    // Simplify UI during stress
    document.documentElement.style.setProperty('--ui-complexity', 'minimal');
    document.documentElement.style.setProperty('--font-size-boost', '110%');
    document.documentElement.style.setProperty('--contrast-boost', '1.2');
    // Hide non-essential elements
    const nonEssential = document.querySelectorAll('[data-priority="low"], .decorative');
    nonEssential.forEach(el => (el as HTMLElement).style.display = 'none');
  }, []);

  // Battery optimization for extended crisis sessions
  const enableBatteryOptimization = useCallback((mode: 'conservative' | 'aggressive') => {
    setBatteryOptimizationMode(mode);
    document.body.classList.add(`battery-optimization-${mode}`);
    
    if (mode === 'conservative') {
      // Reduce animations and effects
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    } else if (mode === 'aggressive') {
      // Disable all animations and reduce functionality
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.style.setProperty('--transition-duration', '0s');
      document.documentElement.style.setProperty('--reduce-gpu-usage', '1');
    }
  }, []);

  const activateEmergencyMode = useCallback(() => {
    setEmergencyModeActive(true);
    
    // Activate emergency through coordinator
    coordinator.activateCrisisMode('user_activated', 'emergency', 100);
    
    // Show integrated offline manager for emergency resources
    setShowOfflineManager(true);
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
    
    // Trigger emergency escalation callback
    onEmergencyEscalation?.();
    onResourceAccessed?.('emergency-mode');
    
    // Auto-connect to therapist in emergency
    if (enableTherapistIntegration) {
      setTherapistConnectionStatus('connecting');
      onTherapistAlerted?.('emergency');
      
      setTimeout(() => {
        setTherapistConnectionStatus('connected');
      }, 1000); // Faster connection in emergency
    }
  }, [coordinator, enableTherapistIntegration, onEmergencyEscalation, onResourceAccessed, onTherapistAlerted]);

  const createMinimalCrisisOverlay = useCallback(() => {
    // Remove any existing overlays
    const existing = document.getElementById('minimal-crisis-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'minimal-crisis-overlay';
    overlay.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #dc2626;
      color: white;
      padding: 16px 24px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 16px;
      z-index: 10000;
      box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
      cursor: pointer;
      touch-action: manipulation;
      min-height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    overlay.textContent = 'Crisis Support';
    overlay.onclick = activateEmergencyMode;
    
    document.body.appendChild(overlay);
  }, [activateEmergencyMode]);

  // Performance optimization based on metrics
  useEffect(() => {
    if (metrics.lcp > 1200 && severity !== 'critical') {
      escalateCrisisLevel('high');
    }
    
    if (metrics.memoryUsage > 100) {
      enableMemoryOptimization();
    }
    
    if (metrics.isOffline) {
      enableOfflineMode();
    }
  }, [metrics, severity, escalateCrisisLevel]);

  const enableMemoryOptimization = useCallback(() => {
    document.body.classList.add('memory-optimized');
    
    // Unload non-essential images
    const images = document.querySelectorAll('img:not(.essential)');
    images.forEach(img => {
      if (!(img as HTMLImageElement).src.startsWith('data:')) {
        (img as HTMLImageElement).dataset.originalSrc = (img as HTMLImageElement).src;
        (img as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=';
      }
    });
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
  }, []);

  const enableOfflineMode = useCallback(() => {
    document.body.classList.add('offline-mode');
    
    // Activate integrated offline manager
    if (enableOfflineMode) {
      setShowOfflineManager(true);
    }
    
    // Show offline notice with enhanced crisis messaging
    const offlineNotice = document.createElement('div');
    offlineNotice.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      right: 20px;
      background: #f59e0b;
      color: white;
      padding: 16px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      z-index: 9999;
      text-align: center;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    `;
    offlineNotice.innerHTML = `
      <div style="margin-bottom: 8px;">📱 You're offline, but help is still available</div>
      <div style="font-size: 14px; opacity: 0.9;">Emergency numbers work without internet</div>
    `;
    
    document.body.appendChild(offlineNotice);
    
    // Auto-remove after 8 seconds
    setTimeout(() => offlineNotice.remove(), 8000);
    
    onResourceAccessed?.('offline-crisis-resources');
  }, [enableOfflineMode, onResourceAccessed]);

  // Integrated offline resource management
  useEffect(() => {
    if (networkStatus === 'offline' && coordinatorActive) {
      enableOfflineMode();
    }
  }, [networkStatus, coordinatorActive, enableOfflineMode]);
  
  // Monitor coordinator state changes for UI updates
  useEffect(() => {
    if (coordinatorState.severity === 'emergency' && !emergencyModeActive) {
      setEmergencyModeActive(true);
      setShowOfflineManager(true);
    }
  }, [coordinatorState.severity, emergencyModeActive]);
  
  // Crisis-optimized render with minimal DOM and integrated systems
  if (!coordinatorActive && !isActive && coordinatorState.severity === 'none') {
    return (
      <MobileCrisisDetectionSystem 
        enableProactiveDetection={true}
        enableOfflineMode={enableOfflineMode}
      >
        {children}
      </MobileCrisisDetectionSystem>
    );
  }

  return (
    <MobileCrisisDetectionSystem 
      enableProactiveDetection={true}
      enableOfflineMode={enableOfflineMode}
    >
      <div 
        className={`crisis-mobile-interface ${coordinatorState.severity} ${
          isOneHanded ? 'one-handed' : ''
        } ${isHighContrast ? 'high-contrast' : ''} ${
          reducedMotion ? 'reduced-motion' : ''
        } ${tremorCompensation ? 'tremor-compensation' : ''} ${
          coordinatorState.dataMinimizationActive ? 'data-minimized' : ''
        }`}
        style={{
          position: 'relative',
          minHeight: '100vh',
          '--crisis-touch-size': tremorCompensation ? '72px' : (isOneHanded ? '64px' : '52px'),
          '--crisis-padding': tremorCompensation ? '32px' : '20px',
          '--crisis-font-size': isHighContrast ? '20px' : '18px',
          '--battery-level': `${batteryLevel}%`,
          '--network-status': networkStatus
        } as React.CSSProperties}
        data-crisis-active={coordinatorActive}
        data-severity={coordinatorState.severity}
        data-tremor-compensation={tremorCompensation}
      >
      {/* Integrated Crisis Status Panel */}
      {coordinatorActive && (
        <div className="crisis-status-panel" style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          right: '16px',
          background: coordinatorState.severity === 'emergency' ? 'rgba(220, 38, 38, 0.95)' : 
                     coordinatorState.severity === 'critical' ? 'rgba(239, 68, 68, 0.95)' :
                     'rgba(59, 130, 246, 0.95)',
          color: 'white',
          padding: '16px',
          borderRadius: '16px',
          fontSize: '16px',
          fontWeight: '600',
          zIndex: 10001,
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {coordinatorState.severity === 'emergency' && '🚨'}
              {coordinatorState.severity === 'critical' && '🆘'}
              {(coordinatorState.severity === 'high' || coordinatorState.severity === 'medium') && '💙'}
              <span>Crisis Support Active</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm opacity-90">
              {networkStatus === 'offline' && '📱'}
              {batteryLevel < 20 && '🔋'}
              {therapistConnectionStatus === 'connected' && '👩‍⚕️'}
              {tremorCompensation && '🤝'}
            </div>
          </div>
          
          {therapistConnectionStatus === 'connecting' && (
            <div className="mt-2 text-sm opacity-90">
              Connecting to support team...
            </div>
          )}
          
          {therapistConnectionStatus === 'connected' && (
            <div className="mt-2 text-sm opacity-90">
              ✅ Support team notified and standing by
            </div>
          )}
        </div>
      )}
      
      {/* Development Crisis Metrics */}
      {process.env.NODE_ENV === 'development' && (
        <div className="crisis-metrics" style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          zIndex: 10001,
          fontFamily: 'monospace'
        }}>
          LCP: {metrics.lcp.toFixed(0)}ms | 
          FID: {metrics.fid.toFixed(0)}ms | 
          CLS: {metrics.cls.toFixed(3)} |
          MEM: {metrics.memoryUsage.toFixed(0)}MB |
          BAT: {batteryLevel}% |
          NET: {networkStatus} |
          SEVERITY: {coordinatorState.severity}
        </div>
      )}

      {/* One-handed navigation hint */}
      {isOneHanded && (
        <div 
          className="one-handed-hint"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            background: 'rgba(34, 197, 94, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            zIndex: 9998
          }}
        >
          Three-finger tap for emergency
        </div>
      )}

      {/* High contrast mode indicator */}
      {isHighContrast && (
        <div 
          className="high-contrast-indicator"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, #dc2626 0%, #f59e0b 50%, #059669 100%)',
            zIndex: 1
          }}
        />
      )}

      {children}
      
      {/* Integrated Offline Crisis Manager */}
      {showOfflineManager && (
        <MobileCrisisOfflineManager />
      )}
      
      {/* Emergency Action Panel */}
      {(coordinatorState.severity === 'emergency' || emergencyModeActive) && (
        <div className="emergency-action-panel" style={{
          position: 'fixed',
          bottom: tremorCompensation ? '32px' : '20px',
          left: tremorCompensation ? '32px' : '20px',
          right: tremorCompensation ? '32px' : '20px',
          background: '#dc2626',
          color: 'white',
          padding: tremorCompensation ? '32px' : '24px',
          borderRadius: '24px',
          zIndex: 9999,
          boxShadow: '0 12px 32px rgba(220, 38, 38, 0.5)'
        }}>
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🆘</div>
            <div className="text-xl font-medium mb-2">Emergency Support Active</div>
            <div className="text-red-100 text-sm">Help is on the way. You are not alone.</div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <a 
              href="tel:988"
              className="block bg-red-500 hover:bg-red-400 text-white font-medium py-6 px-6 rounded-2xl text-center transition-colors"
              style={{ 
                minHeight: tremorCompensation ? '80px' : '72px',
                touchAction: 'manipulation',
                fontSize: '18px'
              }}
            >
              📞 Call 988 Crisis Lifeline
            </a>
            
            <a 
              href="sms:741741?body=HOME"
              className="block bg-blue-600 hover:bg-blue-500 text-white font-medium py-6 px-6 rounded-2xl text-center transition-colors"
              style={{ 
                minHeight: tremorCompensation ? '80px' : '72px',
                touchAction: 'manipulation',
                fontSize: '18px'
              }}
            >
              💬 Text HOME to 741741
            </a>
            
            {enableTherapistIntegration && therapistConnectionStatus === 'connected' && (
              <button
                onClick={() => {
                  onTherapistAlerted?.('emergency_escalation');
                  alert('Your therapist has been notified of this emergency and will contact you shortly.');
                }}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-6 px-6 rounded-2xl transition-colors"
                style={{ 
                  minHeight: tremorCompensation ? '80px' : '72px',
                  touchAction: 'manipulation',
                  fontSize: '18px'
                }}
              >
                👩‍⚕️ Alert My Therapist
              </button>
            )}
            
            <button
              onClick={() => {
                coordinator.reportUserSafe();
                setEmergencyModeActive(false);
                setShowOfflineManager(false);
              }}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-medium py-4 px-6 rounded-xl transition-colors"
              style={{ 
                minHeight: tremorCompensation ? '64px' : '56px',
                touchAction: 'manipulation'
              }}
            >
              ✅ I'm Safe Now
            </button>
          </div>
        </div>
      )}
      
      {/* Therapist Communication Status */}
      {enableTherapistIntegration && therapistConnectionStatus !== 'disconnected' && !emergencyModeActive && (
        <div className="therapist-status" style={{
          position: 'fixed',
          top: coordinatorActive ? '120px' : '20px',
          right: '20px',
          background: therapistConnectionStatus === 'connected' ? '#059669' : '#f59e0b',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 9998,
          maxWidth: '200px',
          textAlign: 'center'
        }}>
          {therapistConnectionStatus === 'connecting' && (
            <div>👩‍⚕️ Connecting to therapist...</div>
          )}
          {therapistConnectionStatus === 'connected' && (
            <div>👩‍⚕️ Therapist notified</div>
          )}
        </div>
      )}

      <style jsx>{`
        .crisis-mobile-interface {
          font-size: var(--crisis-font-size);
          padding: var(--crisis-padding);
        }

        .crisis-mobile-interface.emergency *,
        .crisis-mobile-interface.critical * {
          animation: none !important;
          transition: none !important;
          transform: none !important;
          filter: none !important;
        }
        
        .crisis-mobile-interface.data-minimized .non-essential {
          display: none !important;
        }

        .crisis-mobile-interface .crisis-button,
        .crisis-mobile-interface .emergency-button {
          min-height: var(--crisis-touch-size) !important;
          min-width: var(--crisis-touch-size) !important;
          padding: 16px !important;
          font-size: 18px !important;
          font-weight: 700 !important;
          touch-action: manipulation !important;
          border: 3px solid transparent !important;
        }

        .crisis-mobile-interface.high-contrast .crisis-button,
        .crisis-mobile-interface.high-contrast .emergency-button {
          background: #dc2626 !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
          box-shadow: 0 0 0 2px #dc2626, 0 4px 12px rgba(220, 38, 38, 0.3) !important;
        }

        .crisis-mobile-interface.one-handed {
          padding-bottom: calc(var(--crisis-padding) + 80px);
        }

        .crisis-mobile-interface.reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .crisis-mobile-interface.tremor-compensation button,
        .crisis-mobile-interface.tremor-compensation a[role="button"],
        .crisis-mobile-interface.tremor-compensation .clickable,
        .tremor-compensation button,
        .tremor-compensation a[role="button"],
        .tremor-compensation .clickable {
          min-height: 72px !important;
          min-width: 72px !important;
          padding: 32px !important;
          margin: 16px !important;
          border-radius: 16px !important;
          font-size: 18px !important;
          font-weight: 700 !important;
        }
        
        .crisis-mobile-interface[data-tremor-compensation="true"] * {
          --touch-target-size: 72px;
          --touch-padding: 32px;
        }

        .battery-conservation * {
          will-change: auto !important;
          transform: none !important;
          filter: brightness(0.8) !important;
        }

        .memory-optimized .non-essential {
          display: none !important;
        }

        .offline-mode .network-dependent {
          opacity: 0.5;
          pointer-events: none;
        }

        .ultra-minimal-crisis * {
          background-image: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
          border-radius: 4px !important;
        }
        
        .crisis-mobile-interface[data-crisis-active="true"] {
          --color-primary: #dc2626;
          --color-secondary: #059669;
          --color-warning: #f59e0b;
        }
        
        .emergency-action-panel {
          animation: emergencyPulse 2s ease-in-out infinite;
        }
        
        @keyframes emergencyPulse {
          0%, 100% { box-shadow: 0 12px 32px rgba(220, 38, 38, 0.5); }
          50% { box-shadow: 0 12px 32px rgba(220, 38, 38, 0.8); }
        }
        
        .crisis-mobile-interface.reduced-motion .emergency-action-panel {
          animation: none;
        }
      `}</style>
      </div>
    </MobileCrisisDetectionSystem>
  );
});

export default CrisisMobileInterface;

// Utility functions for external crisis activation
export const activateMobileCrisisMode = (severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
  window.dispatchEvent(new CustomEvent('mobilecrisisactivated', {
    detail: { severity, timestamp: Date.now() }
  }));
};

export const reportCrisisMetrics = () => {
  const vitals = coreWebVitalsMonitor.getLatestMetrics();
  const optimizer = getMobilePerformanceOptimizer();
  
  return {
    coreWebVitals: vitals,
    performance: optimizer?.getMetrics(),
    recommendations: optimizer?.getOptimizationRecommendations(),
    isStruggling: optimizer?.isDeviceStruggling()
  };
};