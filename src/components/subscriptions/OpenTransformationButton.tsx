'use client';

import type { ButtonHTMLAttributes } from 'react';
import {
  type TransformationSurface,
  useTransformationAccess,
} from '@/hooks/useTransformationAccess';
import { AppText } from '@/components/ui/AppText';

type OpenTransformationButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'type'> & {
  surface: TransformationSurface;
  source: string;
  route: string;
  label?: string;
};

export function OpenTransformationButton({
  surface,
  source,
  route,
  label,
  className = 'btn-primary',
  disabled,
  ...buttonProps
}: OpenTransformationButtonProps): React.JSX.Element {
  const transformation = useTransformationAccess({ surface, source, route });
  const isDisabled = Boolean(disabled || transformation.isOpening);

  return (
    <>
      <button
        {...buttonProps}
        type="button"
        className={className}
        onClick={() => {
          void transformation.openTransformation();
        }}
        disabled={isDisabled}
        aria-busy={transformation.isOpening ? 'true' : undefined}
      >
        {transformation.isOpening ? transformation.label : label ?? transformation.label}
      </button>
      {transformation.statusMessage ? (
        <AppText variant="caption" as="p" className="subscription-action-status">
          {transformation.statusMessage}
        </AppText>
      ) : null}
    </>
  );
}
