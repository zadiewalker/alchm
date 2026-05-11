import type {
  EntitlementStatus,
  GatedFeature,
  SubscriptionState,
  SubscriptionTier,
} from '@/types/subscriptions';

type SubscriptionLike =
  | SubscriptionTier
  | Pick<EntitlementStatus, 'tier' | 'hasTransformation'>
  | Pick<SubscriptionState, 'tier' | 'entitlement'>;

function resolveHasTransformation(value: SubscriptionLike): boolean {
  if (typeof value === 'string') {
    return value === 'transformation';
  }

  if ('entitlement' in value) {
    return value.entitlement.hasTransformation;
  }

  return value.hasTransformation || value.tier === 'transformation';
}

export function hasTransformation(value: SubscriptionLike): boolean {
  return resolveHasTransformation(value);
}

export function canUseReflectionExport(value: SubscriptionLike): boolean {
  return hasTransformation(value);
}

export function canUseConversationSummary(value: SubscriptionLike): boolean {
  return hasTransformation(value);
}

export function canUseLongRangeReturns(value: SubscriptionLike): boolean {
  return hasTransformation(value);
}

export function canUseContinuityDepth(value: SubscriptionLike): boolean {
  return hasTransformation(value);
}

export function canAccessGatedFeature(
  feature: GatedFeature,
  value: SubscriptionLike,
): boolean {
  switch (feature) {
    case 'reflection_export':
      return canUseReflectionExport(value);
    case 'conversation_summary':
      return canUseConversationSummary(value);
    case 'long_range_returns':
      return canUseLongRangeReturns(value);
    case 'continuity_depth':
      return canUseContinuityDepth(value);
    default:
      return false;
  }
}
