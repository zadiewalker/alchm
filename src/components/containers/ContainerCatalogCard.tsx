'use client';

import type React from 'react';
import { OpenTransformationButton } from '@/components/subscriptions/OpenTransformationButton';
import { getContainerMoonPhase } from '@/utils/khepera/containerContext';
import type { ContainerCatalogCardProps } from '@/types/container';

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'body-based awareness':
      return '◎';
    case 'thought-feeling patterns':
      return '◇';
    case 'relationship patterns':
      return '⟡';
    case 'grief and loss':
      return '○';
    case 'identity and self':
      return '▽';
    default:
      return '◎';
  }
}

function getRhythmLabel(totalDays: number): string {
  return `${totalDays} openings held here`;
}

export function ContainerCatalogCard({
  container,
  isActive = false,
  isCompleted = false,
  canAccess = true,
  isFree = false,
  onView,
  onStart,
  onContinue
}: ContainerCatalogCardProps): React.JSX.Element {
  const categoryIcon = getCategoryIcon(container.category);
  const moonPhase = getContainerMoonPhase(1, container.totalDays);
  const statusText = !canAccess
    ? 'Transformation only'
    : isActive
    ? 'Current'
    : isCompleted
    ? 'Resting here'
    : isFree
    ? 'Available in Sanctuary'
    : 'Available to enter';

  const handleAction = (): void => {
    if (isCompleted) {
      onView?.();
    } else if (isActive) {
      onContinue?.();
    } else {
      onStart?.();
    }
  };

  return (
    <article
      className={[
        'container-card',
        isActive ? 'container-card--active' : '',
        !canAccess ? 'container-card--locked' : '',
      ].filter(Boolean).join(' ')}
    >
      {isActive && (
        <div className="container-card__accent" />
      )}

      <div className="container-card__header">
        <div>
          <div className="container-card__category-row">
            <span className="container-card__category-icon">
              {categoryIcon}
            </span>
            <span className="container-card__category">
              {container.category}
            </span>
          </div>
          
          <h3 className="container-card__title">
            {container.name}
          </h3>
        </div>
      </div>

      <p className="container-card__tagline">
        {container.tagline}
      </p>

      <div className="container-card__meta-row">
        <span className="container-card__meta">
          {getRhythmLabel(container.totalDays)}
        </span>
        
        <div className="container-card__phase">
          <span className="container-card__phase-icon">
            {moonPhase.phase === 'new' && '🌑'}
            {moonPhase.phase === 'waxing' && '🌓'}
            {moonPhase.phase === 'full' && '🌕'}
            {moonPhase.phase === 'waning' && '🌗'}
          </span>
          <span className="container-card__meta">
            {moonPhase.metaphorText}
          </span>
        </div>
      </div>

      <div className="container-card__status-row">
        <span aria-hidden="true" className={['container-card__status-dot', isActive ? 'is-active' : ''].filter(Boolean).join(' ')} />
        <span className="container-card__status-text">
          {!canAccess ? '' : ''}
          {statusText}
        </span>
      </div>

      {!canAccess ? (
        <OpenTransformationButton
          surface="containers"
          source="containers_locked_transformation"
          route="/containers"
          className="container-card__action btn-primary container-card__action--primary"
          label="Open Transformation"
        />
      ) : (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleAction();
          }}
          className={[
            'container-card__action',
            !isCompleted ? 'btn-primary' : '',
            isCompleted ? 'container-card__action--secondary' : '',
            !isCompleted ? 'container-card__action--primary' : '',
          ].filter(Boolean).join(' ')}
        >
          {isCompleted ? 'Revisit the space' :
           isActive ? 'Enter the chamber' :
           'Enter container'}
        </button>
      )}
    </article>
  );
}
