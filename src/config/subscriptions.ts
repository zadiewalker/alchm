import type { GatedFeature, SubscriptionTier } from '@/types/subscriptions';

export const TRANSFORMATION_FALLBACK_PRICE = '$4.99/month';

export const SUBSCRIPTION_COPY = {
  title: 'Choose your space',
  intro:
    'Sanctuary remains the full core space for writing and return.\n\nTransformation keeps selected writing and occasional returns closer at hand when you choose.',
  trustLine:
    'Nothing is taken away from Sanctuary.\nTransformation keeps selected writing closer at hand.',
  tiers: {
    sanctuary: {
      title: 'Sanctuary',
      price: 'Free',
      cta: 'Continue in Sanctuary',
      features: [
        'Unlimited writing',
        'Full reflections',
        'Core return experience',
        'Privacy and safety, always',
      ],
    },
    transformation: {
      title: 'Transformation',
      price: TRANSFORMATION_FALLBACK_PRICE,
      cta: 'Open Transformation',
      features: [
        'Occasional returns',
        'Reflection Export',
        'Continuity you can carry forward',
      ],
    },
  } satisfies Record<
    SubscriptionTier,
    {
      title: string;
      price: string;
      cta: string;
      features: string[];
    }
  >,
  restoreLabel: 'Restore Purchase',
  restoreSuccess: 'Transformation is active.',
  restoreFailure: 'We couldn’t restore purchases right now.\nPlease try again.',
  restoreNotFound: 'No previous purchase was found for this Apple ID.',
} as const;

export const FEATURE_GATE_COPY: Record<
  GatedFeature,
  {
    headline: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
  }
> = {
  reflection_export: {
    headline: 'Carry your writing forward.',
    body:
      'Transformation includes Reflection Export: a calm summary built only from what you choose, so your words can stay intact in a document you can keep or share.',
    primaryCta: 'Carry selected writing forward',
    secondaryCta: 'Back',
  },
  conversation_summary: {
    headline: 'Carry your writing forward.',
    body:
      'Transformation includes Reflection Export: a calm summary built only from what you choose, so your words can stay intact in a document you can keep or share.',
    primaryCta: 'Carry selected writing forward',
    secondaryCta: 'Back',
  },
  long_range_returns: {
    headline: 'Let your writing stay with you.',
    body:
      'Transformation lets selected writing return here rarely, with restraint.',
    primaryCta: 'Open Transformation',
    secondaryCta: 'Not now',
  },
  continuity_depth: {
    headline: 'Let your writing stay with you.',
    body:
      'Transformation lets selected writing return here rarely, with restraint.',
    primaryCta: 'Open Transformation',
    secondaryCta: 'Not now',
  },
};
