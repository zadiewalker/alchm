import type {
  PersistableSupportRequestType,
  SupportContext,
  SupportPriority,
} from '@/types/support';

export function determineSupportPriority(params: {
  type: PersistableSupportRequestType;
  context?: SupportContext;
}): SupportPriority {
  if (params.type === 'billing_issue') {
    return 'P0';
  }

  if (params.type === 'technical_issue' && params.context?.isBlocking) {
    return 'P0';
  }

  if (params.type === 'technical_issue' && params.context?.hasCrash) {
    return 'P1';
  }

  return 'P2';
}
