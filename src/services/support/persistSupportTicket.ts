import { doc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import type { SupportTicket } from '@/types/support';

export async function persistSupportTicket(ticket: SupportTicket): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, 'support_tickets', ticket.id);

  await setDoc(ref, {
    id: ticket.id,
    userId: ticket.userId,
    type: ticket.type,
    priority: ticket.priority,
    description: ticket.description,
    ...(ticket.category ? { category: ticket.category } : {}),
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  });
}
