/**
 * Notification Permission Prompt for ALCHM
 * 
 * Appears after user completes their first journal entry
 * Requests notification permissions after an initial entry
 */

'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications, useNotificationPermissionTiming } from '@/hooks/useNotifications';
import type { NotificationPermissionPromptProps } from '@/types/components';

export function NotificationPermissionPrompt({ onDismiss }: NotificationPermissionPromptProps): React.JSX.Element | null {
  const { 
    permissions, 
    requestPermissions, 
    isLoading 
  } = useNotifications();
  
  const {
    shouldRequestPermissions,
    markPermissionsRequested
  } = useNotificationPermissionTiming();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Show prompt when conditions are met
  useEffect(() => {
    if (shouldRequestPermissions && !permissions?.granted && !permissions?.deniedAt) {
      // Small delay for smooth UX after journal entry completion
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(showTimer);
    }
  }, [shouldRequestPermissions, permissions]);

  const handleAllowNotifications = async (): Promise<void> => {
    setIsRequesting(true);
    
    try {
      const granted = await requestPermissions();
      
      if (granted) {
        // Success - close prompt
        handleDismiss();
      } else {
        // Permission denied - still close prompt but mark as requested
        markPermissionsRequested();
        handleDismiss();
      }
    } catch (error) {
      console.error('Failed to request notifications:', error);
      // Close prompt even on error
      handleDismiss();
    }
    
    setIsRequesting(false);
  };

  const handleNotNow = (): void => {
    markPermissionsRequested();
    handleDismiss();
  };

  const handleDismiss = (): void => {
    setIsVisible(false);
    onDismiss?.();
  };

  // Don't render if not visible or if already have permissions
  if (!isVisible || permissions?.granted || isLoading) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--color-bg-overlay)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-5)',
    }}>
      <div style={{
        background: 'var(--background-primary)',
        border: '1px solid var(--border-divider)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-6)',
        maxWidth: '380px',
        width: '100%',
        position: 'relative',
        boxShadow: 'var(--shadow-soft)',
      }}>
        {/* Close button */}
        <button
          className="btn-icon"
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            background: 'var(--surface-elevated)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={16} />
        </button>

        {/* Icon and header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-divider)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)',
          }}>
            <Bell size={28} color="var(--accent-primary)" />
          </div>
          
          <h2 style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            margin: '0 0 var(--space-2)',
            lineHeight: 'var(--line-height-tight)',
          }}>
            Allow quiet notifications
          </h2>
          
          <p style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 'var(--line-height-base)',
          }}>
            ALCHM can let you know when something is available here.
          </p>
        </div>

        {/* Benefits */}
        <div style={{
          background: 'var(--surface-color)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-divider)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-6)',
        }}>
          <div style={{
            display: 'grid',
            gap: 'var(--space-3)',
          }}>
            {[
              'Seed Returns can arrive about 2-3 days after you write',
              'No urgent alerts or repeated prompts',
              'Easy to adjust or turn off anytime in Settings'
            ].map((benefit, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  marginTop: '8px',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-regular)',
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--line-height-base)',
                }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <button
            className="btn-primary"
            onClick={handleAllowNotifications}
            disabled={isRequesting}
            style={{
              padding: '0 20px',
              cursor: isRequesting ? 'default' : 'pointer',
              opacity: isRequesting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isRequesting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid var(--border-divider)',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite',
                }} />
                Requesting...
              </>
            ) : (
              'Allow notifications'
            )}
          </button>

          <button
            className="btn-ghost"
            onClick={handleNotNow}
            disabled={isRequesting}
            style={{
              padding: '0 20px',
              color: 'var(--text-secondary)',
              cursor: isRequesting ? 'default' : 'pointer',
              opacity: isRequesting ? 0.7 : 1,
            }}
          >
            Not now
          </button>
        </div>

        {/* Privacy note */}
        <p style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-regular)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginTop: 'var(--space-4)',
          lineHeight: 'var(--line-height-base)',
        }}>
          All notifications are private and processed locally on your device
        </p>
      </div>
      
      {/* CSS for spin animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
