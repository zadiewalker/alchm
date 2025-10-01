// Beta User Communication and Messaging Service

import { getFirebaseDb } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  arrayUnion,
  writeBatch
} from 'firebase/firestore';
import { BetaMessage, BetaUser } from '@/types/beta';

const COLLECTIONS = {
  MESSAGES: 'betaMessages',
  MESSAGE_RECIPIENTS: 'betaMessageRecipients',
  MESSAGE_TEMPLATES: 'betaMessageTemplates'
};

export class MessagingService {
  private static instance: MessagingService;
  private db: any;

  private constructor() {}

  static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  private async getDb() {
    if (!this.db) {
      this.db = await getFirebaseDb();
    }
    return this.db;
  }

  // Message Creation and Management
  async createMessage(message: Omit<BetaMessage, 'id' | 'sentAt' | 'readBy'>): Promise<BetaMessage> {
    const db = await this.getDb();
    
    const messageData: Omit<BetaMessage, 'id'> = {
      ...message,
      readBy: [],
      sentAt: message.scheduledAt <= new Date() ? new Date() : undefined
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      ...messageData,
      scheduledAt: Timestamp.fromDate(messageData.scheduledAt),
      sentAt: messageData.sentAt ? Timestamp.fromDate(messageData.sentAt) : null,
      expiresAt: messageData.expiresAt ? Timestamp.fromDate(messageData.expiresAt) : null
    });

    const createdMessage = { ...messageData, id: docRef.id };
    
    // If message should be sent immediately, send it
    if (message.scheduledAt <= new Date()) {
      await this.sendMessage(docRef.id);
    }

    return createdMessage;
  }

  async sendMessage(messageId: string): Promise<void> {
    const db = await this.getDb();
    const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId);
    
    try {
      // Update message as sent
      await updateDoc(messageRef, {
        sentAt: Timestamp.fromDate(new Date())
      });

      // Get message details
      const messageDoc = await getDoc(messageRef);
      const messageData = messageDoc.data();
      
      if (!messageData) {
        throw new Error('Message not found');
      }

      // Send notifications based on delivery methods
      if (messageData.deliveryMethod.includes('email')) {
        await this.sendEmailNotifications(messageData);
      }
      
      if (messageData.deliveryMethod.includes('in_app')) {
        await this.createInAppNotifications(messageData);
      }
      
      if (messageData.deliveryMethod.includes('push')) {
        await this.sendPushNotifications(messageData);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  private async sendEmailNotifications(messageData: any): Promise<void> {
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    console.log('Sending email notifications for message:', messageData.title);
    
    // For now, we'll just log the email sending
    // In production, you'd implement actual email sending here
    for (const userId of messageData.targetUsers) {
      console.log(`Sending email to user ${userId}: ${messageData.title}`);
    }
  }

  private async createInAppNotifications(messageData: any): Promise<void> {
    const db = await this.getDb();
    const batch = writeBatch(db);
    
    // Create in-app notification records for each target user
    for (const userId of messageData.targetUsers) {
      const notificationRef = doc(collection(db, 'userNotifications'));
      batch.set(notificationRef, {
        userId,
        messageId: messageData.id,
        type: messageData.type,
        title: messageData.title,
        content: messageData.content,
        priority: messageData.priority,
        read: false,
        actionRequired: messageData.actionRequired,
        actionUrl: messageData.actionUrl,
        createdAt: Timestamp.fromDate(new Date()),
        expiresAt: messageData.expiresAt
      });
    }
    
    await batch.commit();
  }

  private async sendPushNotifications(messageData: any): Promise<void> {
    // This would integrate with FCM or another push notification service
    console.log('Sending push notifications for message:', messageData.title);
    
    // For now, we'll just log the push sending
    // In production, you'd implement actual push notification sending here
    for (const userId of messageData.targetUsers) {
      console.log(`Sending push to user ${userId}: ${messageData.title}`);
    }
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const db = await this.getDb();
    const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId);
    
    await updateDoc(messageRef, {
      readBy: arrayUnion(userId)
    });
  }

  async getMessagesForUser(userId: string, filters?: {
    type?: string;
    priority?: string;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<BetaMessage[]> {
    const db = await this.getDb();
    
    let q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('targetUsers', 'array-contains', userId),
      where('sentAt', '!=', null)
    );
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    if (filters?.priority) {
      q = query(q, where('priority', '==', filters.priority));
    }
    
    q = query(q, orderBy('sentAt', 'desc'));
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    
    let messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        scheduledAt: data.scheduledAt.toDate(),
        sentAt: data.sentAt?.toDate(),
        expiresAt: data.expiresAt?.toDate()
      } as BetaMessage;
    });

    // Filter unread messages if requested
    if (filters?.unreadOnly) {
      messages = messages.filter(msg => !msg.readBy.includes(userId));
    }

    // Filter expired messages
    const now = new Date();
    messages = messages.filter(msg => !msg.expiresAt || msg.expiresAt > now);

    return messages;
  }

  async getAllMessages(filters?: {
    type?: string;
    priority?: string;
    limit?: number;
  }): Promise<BetaMessage[]> {
    const db = await this.getDb();
    
    let q = query(collection(db, COLLECTIONS.MESSAGES));
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    if (filters?.priority) {
      q = query(q, where('priority', '==', filters.priority));
    }
    
    q = query(q, orderBy('scheduledAt', 'desc'));
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        scheduledAt: data.scheduledAt.toDate(),
        sentAt: data.sentAt?.toDate(),
        expiresAt: data.expiresAt?.toDate()
      } as BetaMessage;
    });
  }

  // Message Templates
  async createTemplate(template: {
    name: string;
    type: 'announcement' | 'update' | 'survey' | 'interview' | 'reminder';
    subject: string;
    content: string;
    variables: string[];
  }): Promise<string> {
    const db = await this.getDb();
    
    const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGE_TEMPLATES), {
      ...template,
      createdAt: Timestamp.fromDate(new Date())
    });

    return docRef.id;
  }

  async getTemplates(): Promise<any[]> {
    const db = await this.getDb();
    
    const q = query(
      collection(db, COLLECTIONS.MESSAGE_TEMPLATES),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
  }

  // Automated Messages
  async sendWelcomeMessage(userId: string, userName?: string): Promise<void> {
    await this.createMessage({
      type: 'announcement',
      title: 'Welcome to Beta Testing!',
      content: `Hi ${userName || 'there'}!\n\nWelcome to our beta testing program. We're excited to have you on board!\n\nHere's what you can expect:\n\n• Early access to new features\n• Direct communication with our development team\n• Opportunity to shape the product's future\n\nYou can access the beta dashboard to submit feedback, report bugs, and participate in surveys.\n\nThank you for helping us build something amazing!\n\nThe Development Team`,
      priority: 'medium',
      targetUsers: [userId],
      deliveryMethod: ['email', 'in_app'],
      scheduledAt: new Date(),
      actionRequired: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
  }

  async sendSurveyInvitation(userIds: string[], surveyId: string, surveyTitle: string): Promise<void> {
    await this.createMessage({
      type: 'survey',
      title: `New Survey: ${surveyTitle}`,
      content: `We have a new survey that we'd love your input on!\n\n**${surveyTitle}**\n\nYour feedback is crucial to improving our product. The survey takes about 5-10 minutes to complete.\n\nThank you for your time and insights!`,
      priority: 'medium',
      targetUsers: userIds,
      deliveryMethod: ['email', 'in_app'],
      scheduledAt: new Date(),
      actionRequired: true,
      actionUrl: `/beta/surveys/${surveyId}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
  }

  async sendInterviewInvitation(userId: string, interviewId: string, scheduledTime: Date): Promise<void> {
    await this.createMessage({
      type: 'interview',
      title: 'Beta Testing Interview Invitation',
      content: `You've been invited to participate in a beta testing interview!\n\n**Scheduled Time:** ${scheduledTime.toLocaleString()}\n\nThis is a great opportunity to share your detailed feedback and help us improve the product.\n\nPlease confirm your attendance or reschedule if needed.`,
      priority: 'high',
      targetUsers: [userId],
      deliveryMethod: ['email', 'in_app'],
      scheduledAt: new Date(),
      actionRequired: true,
      actionUrl: `/beta/interviews/${interviewId}`,
      expiresAt: scheduledTime
    });
  }

  async sendFeatureAnnouncement(userIds: string[], featureName: string, description: string): Promise<void> {
    await this.createMessage({
      type: 'announcement',
      title: `New Feature Available: ${featureName}`,
      content: `We're excited to announce a new feature is now available for beta testing!\n\n**${featureName}**\n\n${description}\n\nWe'd love to get your feedback on this new feature. Please test it out and let us know what you think!`,
      priority: 'medium',
      targetUsers: userIds,
      deliveryMethod: ['email', 'in_app'],
      scheduledAt: new Date(),
      actionRequired: false,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
    });
  }

  async sendReminderMessage(userIds: string[], reminderType: string, content: string): Promise<void> {
    const titles: Record<string, string> = {
      'feedback_needed': 'Reminder: We Need Your Feedback',
      'survey_completion': 'Reminder: Complete Your Survey',
      'interview_confirmation': 'Reminder: Confirm Your Interview',
      'feature_testing': 'Reminder: Test New Features'
    };

    await this.createMessage({
      type: 'reminder',
      title: titles[reminderType] || 'Beta Testing Reminder',
      content,
      priority: 'low',
      targetUsers: userIds,
      deliveryMethod: ['in_app'],
      scheduledAt: new Date(),
      actionRequired: false,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
    });
  }

  // Message Analytics
  async getMessageStats(messageId: string): Promise<{
    totalRecipients: number;
    delivered: number;
    read: number;
    clicked: number;
    readRate: number;
    clickRate: number;
  }> {
    const db = await this.getDb();
    const messageDoc = await getDoc(doc(db, COLLECTIONS.MESSAGES, messageId));
    
    if (!messageDoc.exists()) {
      throw new Error('Message not found');
    }

    const messageData = messageDoc.data();
    const totalRecipients = messageData.targetUsers.length;
    const read = messageData.readBy.length;
    
    // For now, we'll assume all messages are delivered if sent
    const delivered = messageData.sentAt ? totalRecipients : 0;
    
    // Click tracking would require additional implementation
    const clicked = 0;
    
    return {
      totalRecipients,
      delivered,
      read,
      clicked,
      readRate: delivered > 0 ? (read / delivered) * 100 : 0,
      clickRate: delivered > 0 ? (clicked / delivered) * 100 : 0
    };
  }

  async getUserEngagementStats(userId: string): Promise<{
    totalMessages: number;
    messagesRead: number;
    messagesWithAction: number;
    avgReadTime: number;
  }> {
    const messages = await this.getMessagesForUser(userId);
    const totalMessages = messages.length;
    const messagesRead = messages.filter(msg => msg.readBy.includes(userId)).length;
    const messagesWithAction = messages.filter(msg => msg.actionRequired && msg.readBy.includes(userId)).length;
    
    return {
      totalMessages,
      messagesRead,
      messagesWithAction,
      avgReadTime: 0 // Would require read time tracking
    };
  }

  // Scheduled Message Processing
  async processScheduledMessages(): Promise<void> {
    const db = await this.getDb();
    const now = new Date();
    
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('sentAt', '==', null),
      where('scheduledAt', '<=', Timestamp.fromDate(now))
    );

    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
      try {
        await this.sendMessage(doc.id);
      } catch (error) {
        console.error(`Failed to send scheduled message ${doc.id}:`, error);
      }
    }
  }

  // Cleanup
  async deleteMessage(messageId: string): Promise<void> {
    const db = await this.getDb();
    await deleteDoc(doc(db, COLLECTIONS.MESSAGES, messageId));
  }

  async cleanupExpiredMessages(): Promise<number> {
    const db = await this.getDb();
    const now = new Date();
    
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('expiresAt', '<=', Timestamp.fromDate(now))
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return snapshot.docs.length;
  }
}

export const messagingService = MessagingService.getInstance();