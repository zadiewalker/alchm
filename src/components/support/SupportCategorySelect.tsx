'use client';

import type React from 'react';
import { SUPPORT_CATEGORIES } from '@/config/supportCategories';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { AppText } from '@/components/ui/AppText';
import type { SupportCategory } from '@/types/support';

interface SupportCategorySelectProps {
  value: SupportCategory | '';
  onChange: (value: SupportCategory | '') => void;
}

export function SupportCategorySelect({
  value,
  onChange,
}: SupportCategorySelectProps): React.JSX.Element {
  return (
    <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <AppText variant="label" as="span">{SUPPORT_COPY.categoryLabel}</AppText>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SupportCategory | '')}
        style={fieldStyle}
      >
        <option value="">{SUPPORT_COPY.categoryPlaceholder}</option>
        {SUPPORT_CATEGORIES.map(category => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
      {value ? (
        <AppText variant="caption" as="span">
          {SUPPORT_CATEGORIES.find(category => category.value === value)?.description}
        </AppText>
      ) : null}
    </label>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '48px',
  borderRadius: '16px',
  border: '1px solid var(--border-divider)',
  background: 'var(--surface-elevated)',
  color: 'var(--text-primary)',
  padding: '0 var(--space-4)',
  font: 'inherit',
};
