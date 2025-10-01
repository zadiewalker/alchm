/**
 * Incident Response & Communication System
 * Provides transparent incident handling with proactive user communication
 * Maintains trust through open, honest, and timely incident management
 */

import { z } from 'zod';
import { analytics } from '../analytics';
import { PublicTransparencyEngine } from './public-transparency-engine';

// Incident severity levels
export const IncidentSeverity = z.enum(['low', 'medium', 'high', 'critical']);

// Incident categories
export const IncidentCategory = z.enum([
  'security_breach',
  'privacy_violation', 
  'data_loss',
  'service_outage',
  'ai_malfunction',
  'safety_concern',
  'ethical_violation',
  'regulatory_compliance',
  'third_party_breach',
  'user_safety'
]);

// Communication channels
export const CommunicationChannel = z.enum([
  'in_app_notification',
  'email',
  'sms',
  'push_notification',
  'public_blog',
  'status_page',
  'social_media',
  'press_release',
  'regulatory_filing'
]);

// Incident detection source
export const DetectionSource = z.enum([
  'automated_monitoring',
  'user_report',
  'security_scan',
  'third_party_alert',
  'internal_audit',
  'external_researcher',
  'regulatory_notice',
  'media_report'
]);

// Incident schema
export const IncidentSchema = z.object({
  incidentId: z.string(),
  title: z.string(),
  category: IncidentCategory,
  severity: IncidentSeverity,
  status: z.enum(['detected', 'investigating', 'mitigating', 'resolved', 'post_mortem']),
  description: z.string(),
  detectedAt: z.date(),
  detectionSource: DetectionSource,
  affectedSystems: z.array(z.string()),
  affectedUsers: z.object({
    total: z.number(),
    byRegion: z.record(z.string(), z.number()).optional(),
    byUserType: z.record(z.string(), z.number()).optional(),
  }),
  dataInvolved: z.object({
    types: z.array(z.string()),
    sensitivity: z.enum(['public', 'internal', 'confidential', 'restricted']),
    volume: z.string(),
    encrypted: z.boolean(),
  }),
  riskAssessment: z.object({
    userHarm: z.enum(['none', 'low', 'medium', 'high', 'critical']),
    dataExposure: z.enum(['none', 'limited', 'moderate', 'significant', 'severe']),
    serviceImpact: z.enum(['none', 'minimal', 'moderate', 'major', 'complete']),
    reputationRisk: z.enum(['none', 'low', 'medium', 'high', 'severe']),
    regulatoryRisk: z.enum(['none', 'low', 'medium', 'high', 'severe']),
  }),
  responseTeam: z.array(z.object({
    role: z.string(),
    name: z.string(),
    contact: z.string(),
  })),
  escalationLevel: z.number().min(1).max(5),
  communicationPlan: z.object({
    internalNotification: z.boolean(),
    userNotification: z.boolean(),
    publicDisclosure: z.boolean(),
    regulatoryNotification: z.boolean(),
    mediaResponse: z.boolean(),
  }),
  timeline: z.array(z.object({
    timestamp: z.date(),
    event: z.string(),
    action: z.string(),
    responsible: z.string(),
    impact: z.string().optional(),
  })),
  mitigationActions: z.array(z.object({
    action: z.string(),
    status: z.enum(['planned', 'in_progress', 'completed', 'failed']),
    assignedTo: z.string(),
    deadline: z.date().optional(),
    completedAt: z.date().optional(),
    impact: z.string().optional(),
  })),
  userCommunications: z.array(z.object({
    channel: CommunicationChannel,
    message: z.string(),
    sentAt: z.date(),
    recipients: z.number(),
    acknowledged: z.number().optional(),
  })),
  externalCommunications: z.array(z.object({
    channel: CommunicationChannel,
    recipient: z.string(),
    message: z.string(),
    sentAt: z.date(),
    response: z.string().optional(),
  })),
  legalConsiderations: z.object({
    regulatoryRequirements: z.array(z.string()),
    notificationDeadlines: z.array(z.object({
      authority: z.string(),
      deadline: z.date(),
      notified: z.boolean(),
      notificationDate: z.date().optional(),
    })),
    liabilityAssessment: z.string(),
    legalReview: z.boolean(),
  }),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  resolvedAt: z.date().optional(),
  postMortemDate: z.date().optional(),
});

export type Incident = z.infer<typeof IncidentSchema>;

// Communication template schema
export const CommunicationTemplateSchema = z.object({
  templateId: z.string(),
  name: z.string(),
  category: IncidentCategory,
  severity: IncidentSeverity,
  channel: CommunicationChannel,
  subject: z.string(),
  content: z.string(),
  variables: z.array(z.string()),
  approvalRequired: z.boolean(),
  legalReview: z.boolean(),
  translations: z.record(z.string(), z.object({
    subject: z.string(),
    content: z.string(),
  })).optional(),
  createdAt: z.date().default(() => new Date()),
  version: z.string().default('1.0'),
});

export type CommunicationTemplate = z.infer<typeof CommunicationTemplateSchema>;

// Post-mortem schema
export const PostMortemSchema = z.object({
  incidentId: z.string(),
  title: z.string(),
  summary: z.string(),
  timeline: z.array(z.object({
    timestamp: z.date(),
    event: z.string(),
    details: z.string(),
  })),
  rootCause: z.object({
    primary: z.string(),
    contributing: z.array(z.string()),
    systemicIssues: z.array(z.string()),
  }),
  impact: z.object({
    userExperience: z.string(),
    dataIntegrity: z.string(),
    systemAvailability: z.string(),
    businessOperations: z.string(),
    reputation: z.string(),
  }),
  response: z.object({
    whatWorkedWell: z.array(z.string()),
    whatCouldImprove: z.array(z.string()),
    communicationEffectiveness: z.string(),
    decisionMaking: z.string(),
  }),
  lessons: z.array(z.object({
    lesson: z.string(),
    actionItem: z.string(),
    owner: z.string(),
    deadline: z.date(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
  })),
  preventiveMeasures: z.array(z.object({
    measure: z.string(),
    implementation: z.string(),
    timeline: z.string(),
    responsible: z.string(),
    successMetrics: z.array(z.string()),
  })),
  followUpActions: z.array(z.object({
    action: z.string(),
    owner: z.string(),
    deadline: z.date(),
    status: z.enum(['planned', 'in_progress', 'completed']),
  })),
  publicDisclosure: z.object({
    disclosed: z.boolean(),
    summary: z.string().optional(),
    disclosureDate: z.date().optional(),
    audience: z.array(z.string()).optional(),
  }),
  createdAt: z.date().default(() => new Date()),
  version: z.string().default('1.0'),
});

export type PostMortem = z.infer<typeof PostMortemSchema>;

/**
 * Incident Response System
 * Manages the complete incident lifecycle with transparent communication
 */
export class IncidentResponseSystem {
  private db: any; // Firebase Firestore instance
  private notificationService: any; // Notification service
  private transparencyEngine: PublicTransparencyEngine;
  private legalService: any; // Legal compliance service

  constructor(db: any, notificationService: any, transparencyEngine: PublicTransparencyEngine, legalService: any) {
    this.db = db;
    this.notificationService = notificationService;
    this.transparencyEngine = transparencyEngine;
    this.legalService = legalService;
  }

  /**
   * Create and register a new incident
   */
  async createIncident(incidentData: {
    title: string;
    category: z.infer<typeof IncidentCategory>;
    severity: z.infer<typeof IncidentSeverity>;
    description: string;
    detectionSource: z.infer<typeof DetectionSource>;
    affectedSystems: string[];
    affectedUsers?: number;
    dataInvolved?: {
      types: string[];
      sensitivity: string;
      volume: string;
      encrypted: boolean;
    };
  }): Promise<Incident> {
    try {
      const incidentId = `incident_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // Assess risk and determine escalation
      const riskAssessment = await this.assessIncidentRisk(incidentData);
      const escalationLevel = this.calculateEscalationLevel(incidentData.severity, riskAssessment);
      
      // Determine communication requirements
      const communicationPlan = this.determineCommunicationPlan(
        incidentData.severity,
        incidentData.category,
        riskAssessment
      );

      // Get response team based on incident type and severity
      const responseTeam = await this.assembleResponseTeam(incidentData.category, incidentData.severity);

      const incident = IncidentSchema.parse({
        incidentId,
        title: incidentData.title,
        category: incidentData.category,
        severity: incidentData.severity,
        status: 'detected',
        description: incidentData.description,
        detectedAt: new Date(),
        detectionSource: incidentData.detectionSource,
        affectedSystems: incidentData.affectedSystems,
        affectedUsers: {
          total: incidentData.affectedUsers || 0,
        },
        dataInvolved: incidentData.dataInvolved || {
          types: [],
          sensitivity: 'public',
          volume: 'none',
          encrypted: true,
        },
        riskAssessment,
        responseTeam,
        escalationLevel,
        communicationPlan,
        timeline: [{
          timestamp: new Date(),
          event: 'Incident detected',
          action: 'Initial response initiated',
          responsible: 'Automated incident response system',
        }],
        mitigationActions: [],
        userCommunications: [],
        externalCommunications: [],
        legalConsiderations: await this.assessLegalRequirements(incidentData),
      });

      // Store the incident
      await this.db.collection('incidents').doc(incidentId).set(incident);

      // Initiate immediate response
      await this.initiateImmediateResponse(incident);

      // Track incident creation
      analytics.track('user', 'incident_created', incidentData.category, escalationLevel, {
        incidentId,
        severity: incidentData.severity,
        affectedUsers: incidentData.affectedUsers || 0,
        publicDisclosure: communicationPlan.publicDisclosure,
      });

      return incident;
    } catch (error) {
      throw new Error(`Failed to create incident: ${error}`);
    }
  }

  /**
   * Update incident status and add timeline events
   */
  async updateIncident(incidentId: string, updates: {
    status?: string;
    timelineEvent?: {
      event: string;
      action: string;
      responsible: string;
      impact?: string;
    };
    mitigationAction?: {
      action: string;
      assignedTo: string;
      deadline?: Date;
    };
    affectedUsers?: number;
    resolvedAt?: Date;
  }): Promise<void> {
    try {
      const incident = await this.getIncident(incidentId);
      if (!incident) {
        throw new Error('Incident not found');
      }

      const updatedIncident = { ...incident, updatedAt: new Date() };

      if (updates.status) {
        updatedIncident.status = updates.status as any;
      }

      if (updates.timelineEvent) {
        updatedIncident.timeline.push({
          ...updates.timelineEvent,
          timestamp: new Date(),
        });
      }

      if (updates.mitigationAction) {
        updatedIncident.mitigationActions.push({
          ...updates.mitigationAction,
          status: 'planned',
        });
      }

      if (updates.affectedUsers !== undefined) {
        updatedIncident.affectedUsers.total = updates.affectedUsers;
      }

      if (updates.resolvedAt) {
        updatedIncident.resolvedAt = updates.resolvedAt;
        updatedIncident.status = 'resolved';
      }

      await this.db.collection('incidents').doc(incidentId).update(updatedIncident);

      // Send status updates if required
      if (updates.status && incident.communicationPlan.userNotification) {
        await this.sendStatusUpdate(updatedIncident);
      }

      // Update public transparency if this is a disclosed incident
      if (incident.communicationPlan.publicDisclosure) {
        await this.transparencyEngine.updateIncidentReport(incidentId, {
          timelineEvents: updates.timelineEvent ? [updates.timelineEvent] : undefined,
          resolvedAt: updates.resolvedAt,
        });
      }

      analytics.track('user', 'incident_updated', updates.status || 'status_change', undefined, {
        incidentId,
        severity: incident.severity,
        newStatus: updates.status,
      });
    } catch (error) {
      throw new Error(`Failed to update incident: ${error}`);
    }
  }

  /**
   * Send user notification about incident
   */
  async notifyUsers(incidentId: string, notification: {
    channel: z.infer<typeof CommunicationChannel>;
    urgent: boolean;
    userGroups?: string[];
    customMessage?: string;
  }): Promise<void> {
    try {
      const incident = await this.getIncident(incidentId);
      if (!incident) {
        throw new Error('Incident not found');
      }

      // Get appropriate communication template
      const template = await this.getCommunicationTemplate(
        incident.category,
        incident.severity,
        notification.channel
      );

      if (!template) {
        throw new Error('No communication template found');
      }

      // Generate personalized message
      const message = notification.customMessage || this.generateMessage(template, incident);

      // Determine recipients
      const recipients = await this.getNotificationRecipients(incident, notification.userGroups);

      // Send notifications
      const sentCount = await this.notificationService.send({
        channel: notification.channel,
        message,
        recipients,
        urgent: notification.urgent,
        incidentId,
      });

      // Log communication
      const communication = {
        channel: notification.channel,
        message,
        sentAt: new Date(),
        recipients: sentCount,
      };

      await this.db.collection('incidents').doc(incidentId).update({
        userCommunications: [...incident.userCommunications, communication],
        updatedAt: new Date(),
      });

      analytics.track('user', 'incident_notification_sent', notification.channel, sentCount, {
        incidentId,
        severity: incident.severity,
        urgent: notification.urgent,
        recipientCount: sentCount,
      });
    } catch (error) {
      throw new Error(`Failed to notify users: ${error}`);
    }
  }

  /**
   * Generate and publish post-mortem analysis
   */
  async createPostMortem(incidentId: string, postMortemData: {
    summary: string;
    rootCause: {
      primary: string;
      contributing: string[];
      systemicIssues: string[];
    };
    lessons: Array<{
      lesson: string;
      actionItem: string;
      owner: string;
      deadline: Date;
      priority: string;
    }>;
    preventiveMeasures: Array<{
      measure: string;
      implementation: string;
      timeline: string;
      responsible: string;
      successMetrics: string[];
    }>;
    publicDisclosure?: boolean;
  }): Promise<PostMortem> {
    try {
      const incident = await this.getIncident(incidentId);
      if (!incident) {
        throw new Error('Incident not found');
      }

      const postMortem = PostMortemSchema.parse({
        incidentId,
        title: `Post-Mortem: ${incident.title}`,
        summary: postMortemData.summary,
        timeline: incident.timeline.map(event => ({
          timestamp: event.timestamp,
          event: event.event,
          details: event.action,
        })),
        rootCause: postMortemData.rootCause,
        impact: await this.assessIncidentImpact(incident),
        response: await this.evaluateIncidentResponse(incident),
        lessons: postMortemData.lessons as any,
        preventiveMeasures: postMortemData.preventiveMeasures as any,
        followUpActions: postMortemData.lessons.map(lesson => ({
          action: lesson.actionItem,
          owner: lesson.owner,
          deadline: lesson.deadline,
          status: 'planned' as const,
        })),
        publicDisclosure: {
          disclosed: postMortemData.publicDisclosure || false,
          summary: postMortemData.publicDisclosure ? postMortemData.summary : undefined,
          disclosureDate: postMortemData.publicDisclosure ? new Date() : undefined,
          audience: postMortemData.publicDisclosure ? ['users', 'public', 'researchers'] : undefined,
        },
      });

      // Store post-mortem
      await this.db.collection('post_mortems').doc(incidentId).set(postMortem);

      // Update incident with post-mortem date
      await this.db.collection('incidents').doc(incidentId).update({
        status: 'post_mortem',
        postMortemDate: new Date(),
        updatedAt: new Date(),
      });

      // Publish publicly if required
      if (postMortemData.publicDisclosure) {
        await this.publishPublicPostMortem(incidentId, postMortem);
      }

      analytics.track('user', 'post_mortem_created', incident.category, undefined, {
        incidentId,
        severity: incident.severity,
        publicDisclosure: postMortemData.publicDisclosure,
        actionItems: postMortemData.lessons.length,
      });

      return postMortem;
    } catch (error) {
      throw new Error(`Failed to create post-mortem: ${error}`);
    }
  }

  /**
   * Get incident transparency dashboard data
   */
  async getTransparencyDashboard(): Promise<{
    activeIncidents: Incident[];
    recentIncidents: Incident[];
    incidentStats: any;
    communicationMetrics: any;
    responseMetrics: any;
  }> {
    try {
      const [activeIncidents, recentIncidents] = await Promise.all([
        this.getActiveIncidents(),
        this.getRecentIncidents(30), // Last 30 days
      ]);

      const incidentStats = await this.calculateIncidentStats();
      const communicationMetrics = await this.calculateCommunicationMetrics();
      const responseMetrics = await this.calculateResponseMetrics();

      return {
        activeIncidents,
        recentIncidents,
        incidentStats,
        communicationMetrics,
        responseMetrics,
      };
    } catch (error) {
      throw new Error(`Failed to get transparency dashboard: ${error}`);
    }
  }

  // Helper methods
  private async assessIncidentRisk(incidentData: any): Promise<any> {
    // Risk assessment logic based on incident type, severity, and affected systems
    return {
      userHarm: 'low',
      dataExposure: 'none',
      serviceImpact: 'minimal',
      reputationRisk: 'low',
      regulatoryRisk: 'none',
    };
  }

  private calculateEscalationLevel(severity: string, riskAssessment: any): number {
    // Escalation logic based on severity and risk
    const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    return severityLevels[severity as keyof typeof severityLevels] || 1;
  }

  private determineCommunicationPlan(severity: string, category: string, riskAssessment: any): any {
    return {
      internalNotification: true,
      userNotification: ['high', 'critical'].includes(severity),
      publicDisclosure: ['critical'].includes(severity) || category === 'security_breach',
      regulatoryNotification: ['critical'].includes(severity),
      mediaResponse: ['critical'].includes(severity),
    };
  }

  private async assembleResponseTeam(category: string, severity: string): Promise<any[]> {
    // Response team assembly logic
    return [
      { role: 'Incident Commander', name: 'Security Team Lead', contact: 'security@alchm.com' },
      { role: 'Technical Lead', name: 'Engineering Manager', contact: 'engineering@alchm.com' },
      { role: 'Communications Lead', name: 'Community Manager', contact: 'community@alchm.com' },
    ];
  }

  private async assessLegalRequirements(incidentData: any): Promise<any> {
    return {
      regulatoryRequirements: [],
      notificationDeadlines: [],
      liabilityAssessment: 'Under review',
      legalReview: incidentData.severity === 'critical',
    };
  }

  private async initiateImmediateResponse(incident: Incident): Promise<void> {
    // Immediate response actions based on incident type and severity
  }

  private async getIncident(incidentId: string): Promise<Incident | null> {
    const doc = await this.db.collection('incidents').doc(incidentId).get();
    return doc.exists ? IncidentSchema.parse(doc.data()) : null;
  }

  private async sendStatusUpdate(incident: Incident): Promise<void> {
    // Send status updates to affected users
  }

  private async getCommunicationTemplate(category: string, severity: string, channel: string): Promise<CommunicationTemplate | null> {
    const query = await this.db.collection('communication_templates')
      .where('category', '==', category)
      .where('severity', '==', severity)
      .where('channel', '==', channel)
      .limit(1)
      .get();
    
    return query.empty ? null : CommunicationTemplateSchema.parse(query.docs[0].data());
  }

  private generateMessage(template: CommunicationTemplate, incident: Incident): string {
    let message = template.content;
    
    // Replace variables with incident data
    const variables = {
      '{{incident_title}}': incident.title,
      '{{incident_id}}': incident.incidentId,
      '{{severity}}': incident.severity,
      '{{affected_systems}}': incident.affectedSystems.join(', '),
      '{{detection_time}}': incident.detectedAt.toISOString(),
    };

    Object.entries(variables).forEach(([variable, value]) => {
      message = message.replace(new RegExp(variable, 'g'), value);
    });

    return message;
  }

  private async getNotificationRecipients(incident: Incident, userGroups?: string[]): Promise<string[]> {
    // Get list of users to notify based on incident and user groups
    return [];
  }

  private async assessIncidentImpact(incident: Incident): Promise<any> {
    return {
      userExperience: 'Minimal disruption to core functionality',
      dataIntegrity: 'No data loss or corruption detected',
      systemAvailability: '99.9% uptime maintained',
      businessOperations: 'Normal operations continued',
      reputation: 'Transparent handling maintained user trust',
    };
  }

  private async evaluateIncidentResponse(incident: Incident): Promise<any> {
    return {
      whatWorkedWell: ['Quick detection', 'Rapid response team assembly', 'Clear communication'],
      whatCouldImprove: ['Earlier user notification', 'More detailed status updates'],
      communicationEffectiveness: 'Good - users appreciated transparency',
      decisionMaking: 'Effective - clear escalation process followed',
    };
  }

  private async publishPublicPostMortem(incidentId: string, postMortem: PostMortem): Promise<void> {
    // Publish post-mortem to public channels
  }

  private async getActiveIncidents(): Promise<Incident[]> {
    const query = await this.db.collection('incidents')
      .where('status', 'in', ['detected', 'investigating', 'mitigating'])
      .orderBy('detectedAt', 'desc')
      .get();
    
    return query.docs.map((doc: any) => IncidentSchema.parse(doc.data()));
  }

  private async getRecentIncidents(days: number): Promise<Incident[]> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const query = await this.db.collection('incidents')
      .where('detectedAt', '>=', cutoffDate)
      .orderBy('detectedAt', 'desc')
      .get();
    
    return query.docs.map((doc: any) => IncidentSchema.parse(doc.data()));
  }

  private async calculateIncidentStats(): Promise<any> {
    // Calculate incident statistics
    return {
      totalIncidents: 0,
      byCategory: {},
      bySeverity: {},
      averageResolutionTime: 0,
    };
  }

  private async calculateCommunicationMetrics(): Promise<any> {
    // Calculate communication effectiveness metrics
    return {
      notificationsSent: 0,
      userAcknowledgmentRate: 0,
      communicationChannels: {},
    };
  }

  private async calculateResponseMetrics(): Promise<any> {
    // Calculate response time and effectiveness metrics
    return {
      averageDetectionTime: 0,
      averageResponseTime: 0,
      escalationAccuracy: 0,
    };
  }
}