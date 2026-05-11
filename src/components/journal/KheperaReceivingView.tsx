'use client';

import type React from 'react';
import { AppText } from '@/components/ui/AppText';
import { KheperaCard } from '@/components/ui/KheperaCard';
import type { EmotionalCheckIn } from '@/types/journal';
import type { KheperaResponse } from '@/types/khepera';

type KheperaReceivingViewProps = {
  result: KheperaResponse;
  checkIn: EmotionalCheckIn | null;
  onCheckInChange?: (next: EmotionalCheckIn | null) => void;
  onReturn?: () => void;
  returnLabel?: string;
  statusNote?: React.ReactNode;
  interactive?: boolean;
  reveal?: boolean;
  orientation?: string;
  prefersReducedMotion?: boolean;
};

export function KheperaReceivingView({
  result,
  checkIn: _checkIn,
  onCheckInChange: _onCheckInChange,
  onReturn,
  returnLabel = 'Return to your journal',
  statusNote = null,
  interactive = true,
  reveal = true,
  orientation = 'What came back is here in three parts.',
  prefersReducedMotion = false,
}: KheperaReceivingViewProps): React.JSX.Element {
  return (
    <div className="journal-receiving-screen">
      <div className="journal-khepera-preface">
        <div className="khepera-reading-motif khepera__motif" aria-hidden="true">
          <span className="khepera-reading-motif-line" />
        </div>
        <AppText variant="secondary" as="p" className="journal-khepera-orientation">
          {orientation}
        </AppText>
        {statusNote ? (
          <AppText variant="caption" as="p" className="journal-khepera-status-note">
            {statusNote}
          </AppText>
        ) : null}
      </div>
      <KheperaCard
        aria-live="polite"
        aria-busy={!interactive}
        className={[
          'khepera-response-surface',
          'journal-khepera-reveal',
          reveal ? 'is-visible' : '',
          prefersReducedMotion ? 'is-reduced-motion' : '',
        ].filter(Boolean).join(' ')}
      >
        <div className="khepera-response-header">
          <AppText variant="caption" as="p" className="khepera-response-kicker">
            This came back.
          </AppText>
        </div>
        <div className="khepera-reading-block khepera-refined-response">
          {result.witness ? (
            <section className="khepera-reading-section khepera-passage khepera-passage-witness khepera__block khepera-stage khepera-stage-witness">
              <span className="khepera-reading-marker khepera__marker" aria-hidden="true" />
              <AppText variant="caption" as="p" className="khepera-section-label">
                Witness
              </AppText>
              <AppText variant="kheperaWitness" as="p" className="khepera-witness">
                {result.witness}
              </AppText>
            </section>
          ) : null}

          {result.perspective ? (
            <section className="khepera-reading-section khepera-passage khepera-passage-perspective khepera__block khepera-stage khepera-stage-perspective">
              <span className="khepera-reading-marker khepera__marker" aria-hidden="true" />
              <AppText variant="caption" as="p" className="khepera-section-label">
                Perspective
              </AppText>
              <AppText variant="kheperaPerspective" as="p" className="khepera-perspective">
                {result.perspective}
              </AppText>
            </section>
          ) : null}

          <div className="khepera-reading-divider khepera-seed-divider khepera__divider khepera-stage khepera-stage-divider" />

          <section className="khepera-seed-block khepera__block khepera__seed khepera-stage khepera-stage-seed">
            <AppText variant="caption" as="p" className="khepera-reading-label khepera-section-label">
              Seed
            </AppText>
            <AppText variant="kheperaSeed" as="p" className="khepera-seed-text">
              {result.seed}
            </AppText>
          </section>
        </div>
      </KheperaCard>

      <div
        className="journal-receiving-actions"
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      >
        {onReturn ? (
          <button
            type="button"
            className="btn-primary journal-primary-cta"
            disabled={!interactive}
            onClick={onReturn}
          >
            {returnLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
