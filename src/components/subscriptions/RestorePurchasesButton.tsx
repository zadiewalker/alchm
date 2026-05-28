'use client';

import { AppText } from '@/components/ui/AppText';

type RestorePurchasesButtonProps = {
  label: string;
  onRestore: () => void;
  loading?: boolean;
  className?: string;
};

export function RestorePurchasesButton({
  label,
  onRestore,
  loading = false,
  className,
}: RestorePurchasesButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={['btn-ghost', className].filter(Boolean).join(' ')}
      onClick={onRestore}
      disabled={loading}
      style={{ width: '100%', textAlign: 'center', opacity: loading ? 0.6 : 1 }}
    >
      <AppText as="span" variant="body" style={{ fontWeight: 'var(--font-weight-medium)' }}>
        {loading ? 'Restoring…' : label}
      </AppText>
    </button>
  );
}
