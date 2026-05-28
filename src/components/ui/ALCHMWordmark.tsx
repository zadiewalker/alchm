'use client';

type ALCHMWordmarkProps = {
  variant?: 'hero' | 'fallback' | 'onboarding';
  className?: string;
};

export function ALCHMWordmark({
  variant = 'hero',
  className,
}: ALCHMWordmarkProps): React.JSX.Element {
  const classes = [
    'alchm-wordmark',
    variant === 'hero'
      ? 'alchm-wordmark-hero'
      : variant === 'fallback'
      ? 'alchm-wordmark-fallback'
      : 'alchm-wordmark-onboarding',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>ALCHM</div>;
}
