'use client';

type SplashBrandImageProps = {
  variant?: 'hero' | 'fallback';
  className?: string;
  alt?: string;
};

export function SplashBrandImage({
  variant = 'hero',
  className,
  alt = 'ALCHM',
}: SplashBrandImageProps): React.JSX.Element {
  const classes = [
    variant === 'hero' ? 'splash-brand-image' : 'splash-brand-fallback-image',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <img
      src="/splash-brand.png"
      alt={alt}
      className={classes}
      draggable="false"
    />
  );
}
