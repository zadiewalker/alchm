'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DESIGN } from '@/utils/design';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import type { ContainerCompletionCeremonyProps } from '@/types/container';

export function ContainerCompletionCeremony({ 
  container, 
  entryCount, 
  daysActive,
  onComplete 
}: ContainerCompletionCeremonyProps): React.JSX.Element | null {
  const router = useRouter();
  const [phase, setPhase] = useState<'recognition' | 'reflection' | 'choice'>('recognition');
  const [carryingForward, setCarryingForward] = useState('');
  const [leavingBehind, setLeavingBehind] = useState('');

  const handleComplete = (): void => {
    onComplete();
    router.push('/containers');
  };

  if (phase === 'recognition') {
    return (
      <div className="screen-gradient page-up" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-6)',
        textAlign: 'center'
      }}>
        <div className="sequential-reveal reveal-1" style={{ marginBottom: 'var(--space-6)' }}>
          <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
            This rhythm can rest here.
          </AppText>
          <AppText variant="caption" style={{ maxWidth: '300px' }}>
            {container.title} • {daysActive} days • {entryCount} entries
          </AppText>
        </div>

        <div className="sequential-reveal reveal-2" style={{ 
          marginBottom: 'var(--space-8)',
          maxWidth: '320px' 
        }}>
          <AppCard style={{ 
            background: 'var(--surface-color)',
            border: '1px solid var(--border-divider)'
          }}>
            <AppText variant="body" style={{ 
              fontStyle: 'italic',
              color: DESIGN.colors.textKhepera,
              lineHeight: '1.5'
            }}>
              "What came through this container can stay with you without becoming a task."
            </AppText>
            <AppText variant="khepera" style={{ marginTop: DESIGN.spacing.sm }}>
              — Khepera
            </AppText>
          </AppCard>
        </div>

        <div className="sequential-reveal reveal-3">
          <button
            type="button"
            onClick={() => setPhase('reflection')}
            className="btn-primary"
            style={{ minWidth: '200px' }}
          >
            Continue ceremony
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'reflection') {
    return (
        <div className="screen-gradient page-up" style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-6)'
        }}>
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '400px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div className="section-emerge" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              What are you carrying forward?
            </AppText>
            <AppText variant="caption" style={{ 
              color: 'var(--text-secondary)',
              lineHeight: '1.5' 
            }}>
              Name what you learned, what shifted, what you want to remember.
            </AppText>
          </div>

          <textarea
            className="journal-textarea"
            value={carryingForward}
            onChange={(e) => setCarryingForward(e.target.value)}
            placeholder="I'm carrying forward..."
            style={{
              minHeight: '120px',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family-body)',
              lineHeight: 'var(--line-height-base)',
              background: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
              resize: 'none',
              outline: 'none',
              marginBottom: 'var(--space-6)'
            }}
          />

          <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              What are you leaving behind?
            </AppText>
            <AppText variant="caption" style={{ 
              color: 'var(--text-secondary)',
              lineHeight: '1.5' 
            }}>
              What patterns, thoughts, or ways of being no longer serve you?
            </AppText>
          </div>

          <textarea
            className="journal-textarea"
            value={leavingBehind}
            onChange={(e) => setLeavingBehind(e.target.value)}
            placeholder="I'm leaving behind..."
            style={{
              minHeight: '120px',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family-body)',
              lineHeight: 'var(--line-height-base)',
              background: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
              resize: 'none',
              outline: 'none',
              marginBottom: 'var(--space-6)'
            }}
          />

          <button
            type="button"
            onClick={() => setPhase('choice')}
            disabled={!carryingForward.trim() && !leavingBehind.trim()}
            className="btn-primary"
            style={{ 
              opacity: (!carryingForward.trim() && !leavingBehind.trim()) ? 0.5 : 1
            }}
          >
            Let this rest here
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'choice') {
    return (
      <div className="screen-gradient page-up" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: DESIGN.spacing.lg,
        textAlign: 'center'
      }}>
        <div className="sequential-reveal reveal-1" style={{ 
          marginBottom: 'var(--space-8)',
          maxWidth: '350px'
        }}>
            <AppText variant="title" style={{ marginBottom: DESIGN.spacing.md }}>
            This container can rest here.
          </AppText>
          
          {carryingForward && (
            <AppCard style={{ 
              marginBottom: 'var(--space-4)',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-divider)'
            }}>
              <AppText variant="caption" style={{ 
                color: 'var(--accent-primary)',
                marginBottom: 'var(--space-2)',
                textTransform: "none",
                letterSpacing: 0
              }}>
                Carrying Forward
              </AppText>
              <AppText variant="body" style={{ fontStyle: 'italic' }}>
                {carryingForward}
              </AppText>
            </AppCard>
          )}

          {leavingBehind && (
            <AppCard style={{ 
              marginBottom: 'var(--space-6)',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-divider)'
            }}>
              <AppText variant="caption" style={{ 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-2)',
                textTransform: "none",
                letterSpacing: 0
              }}>
                Leaving Behind
              </AppText>
              <AppText variant="body" style={{ 
                fontStyle: 'italic',
                color: 'var(--text-secondary)'
              }}>
                {leavingBehind}
              </AppText>
            </AppCard>
          )}

          <AppText variant="caption" style={{ 
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            marginBottom: 'var(--space-6)'
          }}>
            What belongs with you can come along quietly.
          </AppText>
        </div>

        <div className="sequential-reveal reveal-2" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          width: '100%',
          maxWidth: '280px'
        }}>
          <button
            type="button"
            onClick={handleComplete}
            className="btn-primary"
          >
            Return to containers
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/journal')}
            className="btn-ghost"
            style={{
              color: DESIGN.colors.textSecondary,
              textDecoration: 'underline',
            }}
          >
            View my journal entries
          </button>
        </div>
      </div>
    );
  }

  return null;
}
