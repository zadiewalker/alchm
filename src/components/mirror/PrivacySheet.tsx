'use client';

import { useState } from 'react';
import { useClearMirrorMemory } from '@/hooks/useMirrorWorkflows';
import type React from 'react';
import type { PrivacySheetProps } from '@/types/mirror';

export function PrivacySheet({ onClose, userId }: PrivacySheetProps): React.JSX.Element {
  const { clear } = useClearMirrorMemory(userId);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearObservations = async (): Promise<void> => {
    if (!userId || clearing) return;
    
    setClearing(true);
    try {
      await clear();
      
      setCleared(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to clear observations:', error);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div
      style={overlayStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClose();
        }
      }}
      aria-label="Close privacy sheet overlay"
    >
      <div style={sheetStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Mirror Privacy</h2>
          <button className="btn-icon" onClick={onClose} style={closeButtonStyle} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={contentStyle}>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>How Mirror works</h3>
            <p style={descriptionStyle}>
              Mirror uses the same limited memory ALCHM already keeps for Khepera: theme tags and one tone label.
              It does not store raw journal text as mirror memory.
            </p>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Data usage</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}>Theme tags and tone labels can shape what appears here</li>
              <li style={listItemStyle}>Open seeds can be shown again without storing new raw text</li>
              <li style={listItemStyle}>Mirror does not create a hidden behavioral profile</li>
              <li style={listItemStyle}>This sheet does not claim storage beyond canonical Firestore sessions and the temporary IndexedDB queue</li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Your control</h3>
            <p style={descriptionStyle}>
              You can clear Khepera memory at any time. This removes stored tags and tone while preserving
              your journal entries.
            </p>
            
            {cleared ? (
              <div style={successStyle}>
                <span style={successIconStyle}>✓</span>
                <span>Mirror observations cleared</span>
              </div>
            ) : (
              <button 
                className="btn-ghost"
                onClick={handleClearObservations}
                disabled={clearing}
                style={{
                  ...clearButtonStyle,
                  opacity: clearing ? 0.6 : 1,
                  cursor: clearing ? 'not-allowed' : 'pointer',
                }}
              >
                {clearing ? 'Clearing...' : 'Clear Mirror observations'}
              </button>
            )}
          </div>

          <div style={footerStyle}>
            <p style={footerTextStyle}>
              Mirror does not add a separate local storage system. Your journal entries remain in Firestore, and unsent entries remain
              temporary in IndexedDB until they sync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'var(--color-bg-overlay)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 1000,
};

const sheetStyle: React.CSSProperties = {
  backgroundColor: 'var(--background-primary)',
  borderTopLeftRadius: 'var(--radius-lg)',
  borderTopRightRadius: 'var(--radius-lg)',
  width: '100%',
  maxHeight: '80vh',
  overflow: 'auto',
  boxShadow: 'var(--shadow-soft)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-4)',
  borderBottom: '1px solid var(--border-divider)',
  position: 'sticky',
  top: 0,
  backgroundColor: 'var(--background-primary)',
  zIndex: 10,
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-heading)',
  margin: 0,
};

const closeButtonStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: 'var(--font-size-xl)',
  padding: 0,
  width: 44,
  height: 44,
  borderRadius: 'var(--radius-sm)',
  lineHeight: 1,
};

const contentStyle: React.CSSProperties = {
  padding: 'var(--space-4)',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 'var(--space-6)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-family-body)',
  marginBottom: 'var(--space-3)',
  margin: '0 0 var(--space-3) 0',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-base)',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-family-body)',
  margin: 0,
};

const listStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-base)',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-family-body)',
  paddingLeft: 'var(--space-4)',
  margin: 0,
};

const listItemStyle: React.CSSProperties = {
  marginBottom: 'var(--space-2)',
};

const clearButtonStyle: React.CSSProperties = {
  padding: 'var(--space-3) var(--space-4)',
  backgroundColor: 'var(--surface-color)',
  border: '1px solid var(--border-divider)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-sm)',
  fontFamily: 'var(--font-family-body)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
  marginTop: 'var(--space-4)',
  width: '100%',
  textAlign: 'center',
};

const successStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-3) var(--space-4)',
  backgroundColor: 'var(--surface-color)',
  border: '1px solid var(--border-divider)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-sm)',
  fontFamily: 'var(--font-family-body)',
  marginTop: 'var(--space-4)',
  justifyContent: 'center',
};

const successIconStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-base)',
};

const footerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border-divider)',
  paddingTop: 'var(--space-4)',
  marginTop: 'var(--space-6)',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-base)',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-family-body)',
  margin: 0,
  textAlign: 'center',
};
