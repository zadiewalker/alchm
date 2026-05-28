import type {
  PersistableSupportRequestType,
  SupportCategory,
  SupportContext,
  SupportTicket,
} from '@/types/support';
import { createSupportTicket } from './createSupportTicket';
import { persistSupportTicket } from './persistSupportTicket';

export async function submitSupportTicket(params: {
  userId: string;
  type: PersistableSupportRequestType;
  description: string;
  category?: SupportCategory;
  context?: SupportContext;
}): Promise<SupportTicket> {
  const ticket = createSupportTicket(params);
  await persistSupportTicket(ticket);
  return ticket;
}
