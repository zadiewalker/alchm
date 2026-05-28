'use client';

import { AppText } from '@/components/ui/AppText';
import { MotionButton } from '@/components/ui/MotionButton';

type ReflectionExportActionsProps = {
  backLabel?: string;
  onBack?: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryBusy?: boolean;
  helper?: string;
};

export function ReflectionExportActions({
  backLabel = 'Back',
  onBack,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryBusy = false,
  helper,
}: ReflectionExportActionsProps): React.JSX.Element {
  return (
    <div className="export-actions-block">
      {helper ? (
        <AppText variant="whisper" as="p">
          {helper}
        </AppText>
      ) : null}
      <div className="export-actions-row">
        {onBack ? <MotionButton variant="ghost" label={backLabel} onClick={onBack} /> : <span />}
        <MotionButton
          label={primaryBusy ? 'Preparing...' : primaryLabel}
          onClick={onPrimary}
          disabled={primaryDisabled || primaryBusy}
        />
      </div>
    </div>
  );
}
