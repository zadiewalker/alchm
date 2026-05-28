import type { SupportCategory } from '@/types/support';

export interface SupportCategoryDefinition {
  value: SupportCategory;
  label: string;
  description: string;
}

export const SUPPORT_CATEGORIES: SupportCategoryDefinition[] = [
  {
    value: 'writing',
    label: 'Writing',
    description: 'Writing surface or entry flow issues.',
  },
  {
    value: 'saving',
    label: 'Saving',
    description: 'Saving, syncing, or return availability issues.',
  },
  {
    value: 'loading',
    label: 'Loading',
    description: 'Opening, loading, or blank-screen issues.',
  },
  {
    value: 'subscription',
    label: 'Subscription',
    description: 'Purchases, subscriptions, or restore purchase issues.',
  },
  {
    value: 'account',
    label: 'Account',
    description: 'Sign-in, access, or account recovery issues.',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'A product issue that does not fit the categories above.',
  },
];

export function getSupportCategoryDefinition(category: SupportCategory): SupportCategoryDefinition {
  return SUPPORT_CATEGORIES.find(item => item.value === category) ?? SUPPORT_CATEGORIES[0];
}
