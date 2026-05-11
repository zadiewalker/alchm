'use client';

import { DESIGN } from '@/utils/design';
import type { Container, ContainerState } from '@/services/containers/localContainersService';
import type { ContainerCardProps } from '@/types/container';

function getPhaseArc(state: ContainerState | undefined, container: Container): {
  phase: string;
  stepText: string;
} {
  if (!state) return { phase: 'Ready to begin', stepText: '' };
  
  const currentStep = state.currentStep + 1;
  const totalSteps = container.duration;
  
  // Determine phase based on state
  const phaseMap = [
    { name: 'Grounding', range: [1, 5] },
    { name: 'Pattern', range: [6, 10] },
    { name: 'Contact', range: [11, 16] },
    { name: 'Integration', range: [17, 21] },
  ];
  
  const currentPhase = phaseMap.find(p => 
    currentStep >= p.range[0] && currentStep <= p.range[1]
  )?.name || 'Integration';
  
  return {
    phase: `${currentPhase} Phase`,
    stepText: currentPhase === 'Integration' ? 'Deepening' : 'In practice',
  };
}

function getFrameworkIcon(framework: string): string {
  switch (framework) {
    case 'somatic': return '◎';
    case 'cbt': return '◇';
    case 'narrative': return '⟡';
    case 'ifs': return '○';
    default: return '▽';
  }
}

function getFrameworkDescription(framework: string): string {
  switch (framework) {
    case 'somatic': return 'Body-based awareness';
    case 'cbt': return 'Thought-feeling patterns';
    case 'narrative': return 'Story reauthoring';
    case 'ifs': return 'Internal parts work';
    default: return 'Therapeutic framework';
  }
}

export function ContainerCard({
  container,
  state,
  isActive = false,
  isCompleted = false,
  canAccess = true,
  onEnroll,
  onContinue
}: ContainerCardProps): React.JSX.Element {
  const phaseInfo = getPhaseArc(state, container);
  const frameworkIcon = getFrameworkIcon(container.framework);
  const frameworkDesc = getFrameworkDescription(container.framework);

  return (
    <div
      className="section-emerge"
      style={{
        border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-divider)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        background: 'var(--surface-color)',
        opacity: canAccess ? 1 : 0.72,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'var(--text-primary)',
          }}
        />
      )}

      {/* Container header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: DESIGN.spacing.sm 
      }}>
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: DESIGN.spacing.xs,
            marginBottom: DESIGN.spacing.xs 
          }}>
            <span style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--text-secondary)'
            }}>
              {frameworkIcon}
            </span>
            <span style={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-sm)',
              textTransform: "none",
              letterSpacing: 0,
              fontWeight: 'var(--font-weight-medium)'
            }}>
              {frameworkDesc}
            </span>
          </div>
          
          <h3 style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            lineHeight: 'var(--line-height-tight)',
            margin: '0 0 var(--space-3)',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}>
            {container.title}
          </h3>
        </div>
      </div>

      {/* Container description */}
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontFamily: 'var(--font-family-body)',
        fontSize: 'var(--font-size-base)',
        lineHeight: 'var(--line-height-relaxed)',
        marginBottom: 'var(--space-4)'
      }}>
        {container.description}
      </p>

      {/* State visualization for active/completed containers */}
      {(isActive || isCompleted) && state && (
        <div style={{ marginBottom: DESIGN.spacing.md }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: DESIGN.spacing.xs
          }}>
            <span style={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              {phaseInfo.phase}
            </span>
            {phaseInfo.stepText ? (
              <span style={{
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-sm)'
              }}>
                {phaseInfo.stepText}
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Duration indicator for new containers */}
      {!isActive && !isCompleted && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: DESIGN.spacing.xs,
          marginBottom: DESIGN.spacing.md
        }}>
          <span style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-sm)'
          }}>
            {container.duration} day container
          </span>
          <div style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'var(--text-secondary)',
            opacity: 0.5
          }} />
          <span style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-sm)'
          }}>
            {container.steps.length} guided prompts
          </span>
        </div>
      )}

      {/* Action button */}
      {isCompleted ? (
        <div style={{
          padding: `var(--space-3) 0`,
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-sm)'
        }}>
          Resting here
        </div>
      ) : isActive ? (
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          Continue
        </button>
      ) : (
        <button
          type="button"
          onClick={onEnroll}
          disabled={!canAccess}
          className={canAccess ? 'btn-primary' : 'btn-ghost'}
          style={!canAccess ? {
            width: '100%',
            height: '52px',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-divider)',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          } : {}}
        >
          {canAccess ? 'Begin container' : 'Open Transformation'}
        </button>
      )}
    </div>
  );
}
