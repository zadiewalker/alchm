import { SUPPORT_DESCRIPTION_MAX_LENGTH } from '@/config/support';
import type {
  PersistableSupportRequestType,
  SupportCategory,
  SupportContext,
  SupportTicket,
} from '@/types/support';
import { determineSupportPriority } from './triage';

export function createSupportTicket(params: {
  userId: string;
  type: PersistableSupportRequestType;
  description: string;
  category?: SupportCategory;
  context?: SupportContext;
}): SupportTicket {
  const description = params.description
    .trim()
    .slice(0, SUPPORT_DESCRIPTION_MAX_LENGTH);
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    type: params.type,
    priority: determineSupportPriority({
      type: params.type,
      context: params.context,
    }),
    description,
    ...(params.category ? { category: params.category } : {}),
    status: 'open',
    createdAt: now,
    updatedAt: now,
  };
}
