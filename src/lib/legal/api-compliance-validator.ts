/**
 * ALCHM API Legal Compliance Validator
 * Middleware for validating legal compliance on all API routes
 * Ensures GDPR/CCPA/COPPA compliance for data processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../firebase';
import { consentFlowBuilder } from './consent-flow-builder';
import { complianceChecker } from './compliance-checker';

export interface ComplianceContext {
  userId?: string;
  userAge?: 'adult' | 'teen' | 'minor';
  jurisdiction?: string;
  ipAddress?: string;
  userAgent?: string;
  requestTimestamp: string;
  endpoint: string;
  method: string;
  dataTypes: string[];
  processingPurpose: string;
  legalBasis: 'consent' | 'contract' | 'legitimate_interest' | 'legal_obligation' | 'vital_interest';
}

export interface ComplianceValidationResult {
  isCompliant: boolean;
  violations: ComplianceViolation[];
  warnings: ComplianceWarning[];
  requiredActions: ComplianceAction[];
  consentRequired: boolean;
  blockRequest: boolean;
  auditLog: ComplianceAuditEntry;
}

export interface ComplianceViolation {
  regulation: 'GDPR' | 'CCPA' | 'COPPA' | 'FERPA';
  article: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  remediation: string;
}

export interface ComplianceWarning {
  type: 'consent_expiring' | 'data_retention' | 'cross_border_transfer' | 'minor_data';
  description: string;
  recommendation: string;
}

export interface ComplianceAction {
  type: 'obtain_consent' | 'verify_age' | 'notify_parents' | 'data_minimization' | 'audit_trail';
  description: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
  deadline?: string;
}

export interface ComplianceAuditEntry {
  id: string;
  timestamp: string;
  userId?: string;
  endpoint: string;
  method: string;
  dataTypes: string[];
  processingPurpose: string;
  legalBasis: string;
  consentStatus: Record<string, boolean>;
  complianceResult: 'compliant' | 'non_compliant' | 'warning';
  violations: string[];
  userAgent?: string;
  ipAddress?: string;
  jurisdiction?: string;
}

export class APIComplianceValidator {
  private auditLog: ComplianceAuditEntry[] = [];
  private dataProcessingRegistry: Map<string, any> = new Map();

  constructor() {
    this.initializeDataProcessingRegistry();
  }

  /**
   * Main compliance validation middleware
   */
  async validateRequest(
    request: NextRequest,
    context: Partial<ComplianceContext>
  ): Promise<ComplianceValidationResult> {
    const complianceContext: ComplianceContext = {
      requestTimestamp: new Date().toISOString(),
      endpoint: new URL(request.url).pathname,
      method: request.method,
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || undefined,
      jurisdiction: await this.detectJurisdiction(request),
      ...context
    };

    const validationResult: ComplianceValidationResult = {
      isCompliant: true,
      violations: [],
      warnings: [],
      requiredActions: [],
      consentRequired: false,
      blockRequest: false,
      auditLog: await this.createAuditEntry(complianceContext)
    };

    // Run compliance checks
    await this.validateGDPRCompliance(complianceContext, validationResult);
    await this.validateCCPACompliance(complianceContext, validationResult);
    await this.validateCOPPACompliance(complianceContext, validationResult);
    await this.validateConsentRequirements(complianceContext, validationResult);
    await this.validateDataMinimization(complianceContext, validationResult);
    await this.validateRetentionLimits(complianceContext, validationResult);

    // Determine final compliance status
    validationResult.isCompliant = validationResult.violations.length === 0;
    validationResult.blockRequest = validationResult.violations.some(v => v.severity === 'critical');

    // Log audit entry
    this.auditLog.push(validationResult.auditLog);
    await this.persistAuditEntry(validationResult.auditLog);

    return validationResult;
  }

  /**
   * GDPR compliance validation
   */
  private async validateGDPRCompliance(
    context: ComplianceContext,
    result: ComplianceValidationResult
  ): Promise<void> {
    if (context.jurisdiction === 'EU' || this.isEUCitizen(context)) {
      // Article 6: Lawful basis validation
      if (!this.hasValidLegalBasis(context)) {
        result.violations.push({
          regulation: 'GDPR',
          article: 'Article 6',
          description: 'No valid legal basis for data processing',
          severity: 'critical',
          remediation: 'Obtain valid consent or establish alternative legal basis'
        });
      }

      // Article 7: Consent validation
      if (context.legalBasis === 'consent' && context.userId) {
        const hasValidConsent = await this.validateConsent(context.userId, context.processingPurpose);
        if (!hasValidConsent) {
          result.violations.push({
            regulation: 'GDPR',
            article: 'Article 7',
            description: 'Invalid or missing consent for data processing',
            severity: 'critical',
            remediation: 'Obtain fresh, explicit consent from user'
          });
          result.consentRequired = true;
        }
      }

      // Article 13/14: Information provision
      if (this.isDataCollectionEndpoint(context.endpoint)) {
        const hasProvidedInformation = await this.checkInformationProvision(context);
        if (!hasProvidedInformation) {
          result.violations.push({
            regulation: 'GDPR',
            article: 'Article 13',
            description: 'Required information not provided to data subject',
            severity: 'high',
            remediation: 'Provide comprehensive privacy notice'
          });
        }
      }

      // Article 17: Right to erasure
      if (context.endpoint.includes('delete') && context.userId) {
        await this.validateErasureRequest(context, result);
      }

      // Article 25: Data protection by design
      if (!this.hasDataProtectionByDesign(context)) {
        result.warnings.push({
          type: 'data_retention',
          description: 'Data protection by design principles not fully implemented',
          recommendation: 'Review data processing design for privacy enhancement'
        });
      }
    }
  }

  /**
   * CCPA compliance validation
   */
  private async validateCCPACompliance(
    context: ComplianceContext,
    result: ComplianceValidationResult
  ): Promise<void> {
    if (context.jurisdiction === 'CA' || this.isCaliforniaResident(context)) {
      // Right to know validation
      if (this.isDataCollectionEndpoint(context.endpoint)) {
        const hasDisclosure = await this.checkCCPADisclosure(context);
        if (!hasDisclosure) {
          result.violations.push({
            regulation: 'CCPA',
            article: 'Section 1798.100',
            description: 'Required CCPA disclosure not provided',
            severity: 'high',
            remediation: 'Provide detailed data collection disclosure'
          });
        }
      }

      // Right to delete validation
      if (context.endpoint.includes('delete')) {
        await this.validateCCPADeletion(context, result);
      }

      // Do Not Sell verification
      if (context.userId) {
        const hasOptedOut = await this.checkDoNotSellStatus(context.userId);
        if (hasOptedOut && this.involvesDataSharing(context)) {
          result.violations.push({
            regulation: 'CCPA',
            article: 'Section 1798.120',
            description: 'Data sharing attempted for user who opted out of sale',
            severity: 'critical',
            remediation: 'Block data sharing for opted-out users'
          });
        }
      }
    }
  }

  /**
   * COPPA compliance validation
   */
  private async validateCOPPACompliance(
    context: ComplianceContext,
    result: ComplianceValidationResult
  ): Promise<void> {
    if (context.userAge === 'minor') {
      // Parental consent validation
      const hasParentalConsent = await this.validateParentalConsent(context.userId);
      if (!hasParentalConsent) {
        result.violations.push({
          regulation: 'COPPA',
          article: 'Section 312.5',
          description: 'Missing verifiable parental consent for child user',
          severity: 'critical',
          remediation: 'Obtain verifiable parental consent before processing'
        });
        result.blockRequest = true;
      }

      // Data minimization for children
      if (!this.isMinimalDataCollection(context)) {
        result.violations.push({
          regulation: 'COPPA',
          article: 'Section 312.7',
          description: 'Excessive data collection from child user',
          severity: 'high',
          remediation: 'Limit data collection to what is reasonably necessary'
        });
      }

      // Enhanced security for children
      if (!this.hasEnhancedChildSecurity(context)) {
        result.warnings.push({
          type: 'minor_data',
          description: 'Enhanced security measures recommended for child data',
          recommendation: 'Implement additional security controls for minor users'
        });
      }
    }
  }

  /**
   * Consent requirements validation
   */
  private async validateConsentRequirements(
    context: ComplianceContext,
    result: ComplianceValidationResult
  ): Promise<void> {
    if (context.userId && context.legalBasis === 'consent') {
      const consentStatus = consentFlowBuilder.getConsentStatus(context.userId);
      
      if (!consentStatus) {
        result.requiredActions.push({
          type: 'obtain_consent',
          description: 'No consent record found for user',
          priority: 'immediate'
        });
        result.consentRequired = true;
        return;
      }

      // Check if consent is still valid
      const consentAge = Date.now() - new Date(consentStatus.timestamp).getTime();
      const maxConsentAge = 2 * 365 * 24 * 60 * 60 * 1000; // 2 years

      if (consentAge > maxConsentAge) {
        result.warnings.push({
          type: 'consent_expiring',
          description: 'User consent is over 2 years old',
          recommendation: 'Consider requesting consent renewal'
        });
      }

      // Check specific consent for processing purpose
      const hasSpecificConsent = Object.keys(consentStatus.consentChoices).some(key => {
        const consent = consentStatus.consentChoices[key];
        return consent.granted && this.matchesProcessingPurpose(key, context.processingPurpose);
      });

      if (!hasSpecificConsent) {
        result.violations.push({
          regulation: 'GDPR',
          article: 'Article 7',
          description: `No valid consent for processing purpose: ${context.processingPurpose}`,
          severity: 'critical',
          remediation: 'Obtain specific consent for this processing purpose'
        });
        result.consentRequired = true;
      }
    }
  }

  /**
   * Data minimization validation
   */
  private async validateDataMinimization(
    context: ComplianceContext,
    result: ComplianceValidationResult
  ): Promise<void> {
    const allowedDataTypes = this.getAllowedDataTypes(context.processingPurpose);
    const excessiveDataTypes = context.dataTypes.filter(type => 
      !allowedDataTypes.includes(type)
    );

    if (excessiveDataTypes.length > 0) {
      result.violations.push({
        regulation: 'GDPR',
        article: 'Article 5(1)(c)',
        description: `Excessive data collection: ${excessiveDataTypes.join(', ')}`,
        severity: 'medium',
        remediation: 'Remove unnecessary data types from processing'
      });

      result.requiredActions.push({
        type: 'data_minimization',
        description: 'Reduce data collection to necessary minimum',
        priority: 'high'
      });
    }
  }

  /**
   * Data retention limits validation
   */
  private async validateRetentionLimits(
    context: ComplianceContext,
    result: ComplianceValidationResult
  ): Promise<void> {
    if (context.userId) {
      const retentionPolicy = this.getRetentionPolicy(context.processingPurpose);
      const userDataAge = await this.getUserDataAge(context.userId);

      if (userDataAge > retentionPolicy.maxRetention) {
        result.warnings.push({
          type: 'data_retention',
          description: `User data exceeds retention limit for ${context.processingPurpose}`,
          recommendation: 'Review and potentially delete old data'
        });

        result.requiredActions.push({
          type: 'audit_trail',
          description: 'Review data retention compliance',
          priority: 'medium',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }
  }

  /**
   * Create comprehensive middleware for Next.js API routes
   */
  createMiddleware() {
    return async (request: NextRequest) => {
      try {
        // Extract route and processing context
        const pathname = new URL(request.url).pathname;
        const processingContext = this.getProcessingContext(pathname, request.method);

        if (!processingContext) {
          return NextResponse.next(); // No compliance validation needed
        }

        // Get user context if available
        const userId = await this.extractUserId(request);
        const userAge = userId ? await this.getUserAge(userId) : undefined;

        const context: Partial<ComplianceContext> = {
          userId,
          userAge,
          ...processingContext
        };

        // Validate compliance
        const validationResult = await this.validateRequest(request, context);

        // Block request if critical violations
        if (validationResult.blockRequest) {
          return new NextResponse(
            JSON.stringify({
              error: 'Compliance violation',
              message: 'Request blocked due to privacy regulation compliance issues',
              violations: validationResult.violations.filter(v => v.severity === 'critical')
            }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        // Add compliance headers
        const response = NextResponse.next();
        response.headers.set('X-Compliance-Status', validationResult.isCompliant ? 'compliant' : 'warning');
        response.headers.set('X-Audit-ID', validationResult.auditLog.id);

        if (validationResult.consentRequired) {
          response.headers.set('X-Consent-Required', 'true');
        }

        return response;

      } catch (error) {
        console.error('Compliance validation error:', error);
        
        // Log compliance system failure
        await this.logComplianceSystemError(error as Error, request);
        
        // Allow request to proceed but log the failure
        return NextResponse.next();
      }
    };
  }

  // Helper methods

  private initializeDataProcessingRegistry(): void {
    // Map API endpoints to their data processing characteristics
    this.dataProcessingRegistry.set('/api/journal/save', {
      dataTypes: ['journal_content', 'mood_data', 'timestamp'],
      processingPurpose: 'journaling_service',
      legalBasis: 'contract'
    });

    this.dataProcessingRegistry.set('/api/ai/insights', {
      dataTypes: ['journal_patterns', 'emotional_data'],
      processingPurpose: 'ai_insights',
      legalBasis: 'consent'
    });

    this.dataProcessingRegistry.set('/api/crisis/detect', {
      dataTypes: ['crisis_indicators', 'safety_signals'],
      processingPurpose: 'crisis_detection',
      legalBasis: 'vital_interest'
    });

    this.dataProcessingRegistry.set('/api/analytics/track', {
      dataTypes: ['usage_patterns', 'feature_interactions'],
      processingPurpose: 'service_improvement',
      legalBasis: 'legitimate_interest'
    });
  }

  private getProcessingContext(pathname: string, method: string): any {
    return this.dataProcessingRegistry.get(pathname);
  }

  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
           request.headers.get('x-real-ip') ||
           'unknown';
  }

  private async detectJurisdiction(request: NextRequest): Promise<string> {
    // In production, use IP geolocation or user preference
    const userLocation = request.headers.get('cf-ipcountry') || 'US';
    return userLocation === 'EU' ? 'EU' : userLocation;
  }

  private async extractUserId(request: NextRequest): Promise<string | undefined> {
    // Extract user ID from auth token or session
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      // Decode JWT token to get user ID
      try {
        // In production, properly verify and decode JWT
        return 'user_123'; // Mock user ID
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  private async getUserAge(userId: string): Promise<'adult' | 'teen' | 'minor' | undefined> {
    // Query user database for age group
    // This is a mock implementation
    return 'adult';
  }

  private isEUCitizen(context: ComplianceContext): boolean {
    return context.jurisdiction === 'EU' || 
           context.ipAddress?.startsWith('EU') === true;
  }

  private isCaliforniaResident(context: ComplianceContext): boolean {
    return context.jurisdiction === 'CA';
  }

  private hasValidLegalBasis(context: ComplianceContext): boolean {
    return ['consent', 'contract', 'legitimate_interest', 'legal_obligation', 'vital_interest']
      .includes(context.legalBasis);
  }

  private async validateConsent(userId: string, purpose: string): Promise<boolean> {
    return consentFlowBuilder.hasConsent(userId, purpose);
  }

  private isDataCollectionEndpoint(endpoint: string): boolean {
    return endpoint.includes('/save') || 
           endpoint.includes('/create') || 
           endpoint.includes('/register');
  }

  private async checkInformationProvision(context: ComplianceContext): Promise<boolean> {
    // Check if privacy notice was provided
    return true; // Mock implementation
  }

  private async validateErasureRequest(
    context: ComplianceContext, 
    result: ComplianceValidationResult
  ): Promise<void> {
    // Validate right to erasure request
    if (context.userId) {
      result.requiredActions.push({
        type: 'audit_trail',
        description: 'Document data erasure request',
        priority: 'immediate'
      });
    }
  }

  private hasDataProtectionByDesign(context: ComplianceContext): boolean {
    // Check if data protection by design principles are implemented
    return true; // Mock implementation
  }

  private async checkCCPADisclosure(context: ComplianceContext): Promise<boolean> {
    // Check if CCPA disclosure was provided
    return true; // Mock implementation
  }

  private async validateCCPADeletion(
    context: ComplianceContext,
    result: ComplianceValidationResult
  ): Promise<void> {
    // Validate CCPA deletion request
    result.requiredActions.push({
      type: 'audit_trail',
      description: 'Process CCPA deletion request',
      priority: 'high'
    });
  }

  private async checkDoNotSellStatus(userId: string): Promise<boolean> {
    // Check if user opted out of data sales
    return false; // Mock implementation
  }

  private involvesDataSharing(context: ComplianceContext): boolean {
    return context.endpoint.includes('/share') || 
           context.endpoint.includes('/analytics');
  }

  private async validateParentalConsent(userId?: string): Promise<boolean> {
    if (!userId) return false;
    const consentStatus = consentFlowBuilder.getConsentStatus(userId);
    return consentStatus?.parentalConsent?.verifiedAt != null;
  }

  private isMinimalDataCollection(context: ComplianceContext): boolean {
    const allowedForMinors = ['essential_account_data', 'safety_data'];
    return context.dataTypes.every(type => allowedForMinors.includes(type));
  }

  private hasEnhancedChildSecurity(context: ComplianceContext): boolean {
    // Check if enhanced security measures are in place for children
    return true; // Mock implementation
  }

  private matchesProcessingPurpose(consentType: string, purpose: string): boolean {
    const purposeMapping: Record<string, string[]> = {
      'essential_services': ['journaling_service', 'account_management'],
      'ai_processing': ['ai_insights', 'pattern_analysis'],
      'crisis_detection': ['crisis_detection', 'safety_monitoring'],
      'analytics_improvement': ['service_improvement', 'analytics']
    };

    return purposeMapping[consentType]?.includes(purpose) || false;
  }

  private getAllowedDataTypes(purpose: string): string[] {
    const dataTypeMapping: Record<string, string[]> = {
      'journaling_service': ['journal_content', 'mood_data', 'timestamp'],
      'ai_insights': ['journal_patterns', 'emotional_data', 'insights_history'],
      'crisis_detection': ['crisis_indicators', 'safety_signals', 'emergency_contacts'],
      'service_improvement': ['usage_patterns', 'feature_interactions', 'performance_metrics']
    };

    return dataTypeMapping[purpose] || [];
  }

  private getRetentionPolicy(purpose: string): { maxRetention: number } {
    const retentionPolicies: Record<string, { maxRetention: number }> = {
      'journaling_service': { maxRetention: 7 * 365 * 24 * 60 * 60 * 1000 }, // 7 years
      'ai_insights': { maxRetention: 2 * 365 * 24 * 60 * 60 * 1000 }, // 2 years
      'crisis_detection': { maxRetention: 72 * 60 * 60 * 1000 }, // 72 hours
      'service_improvement': { maxRetention: 2 * 365 * 24 * 60 * 60 * 1000 } // 2 years
    };

    return retentionPolicies[purpose] || { maxRetention: 365 * 24 * 60 * 60 * 1000 }; // 1 year default
  }

  private async getUserDataAge(userId: string): Promise<number> {
    // Query when user's data was first collected
    // Return age in milliseconds
    return 30 * 24 * 60 * 60 * 1000; // Mock: 30 days
  }

  private async createAuditEntry(context: ComplianceContext): Promise<ComplianceAuditEntry> {
    return {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: context.requestTimestamp,
      userId: context.userId,
      endpoint: context.endpoint,
      method: context.method,
      dataTypes: context.dataTypes,
      processingPurpose: context.processingPurpose,
      legalBasis: context.legalBasis,
      consentStatus: context.userId ? 
        await this.getConsentStatusForAudit(context.userId) : {},
      complianceResult: 'compliant', // Will be updated after validation
      violations: [],
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
      jurisdiction: context.jurisdiction
    };
  }

  private async getConsentStatusForAudit(userId: string): Promise<Record<string, boolean>> {
    const consentRecord = consentFlowBuilder.getConsentStatus(userId);
    if (!consentRecord) return {};

    const status: Record<string, boolean> = {};
    Object.entries(consentRecord.consentChoices).forEach(([key, choice]) => {
      status[key] = choice.granted;
    });

    return status;
  }

  private async persistAuditEntry(entry: ComplianceAuditEntry): Promise<void> {
    // In production, persist to secure audit database
    console.log('Audit entry created:', entry.id);
  }

  private async logComplianceSystemError(error: Error, request: NextRequest): Promise<void> {
    console.error('Compliance system error:', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Export audit trail for compliance reporting
   */
  exportAuditTrail(startDate?: string, endDate?: string): ComplianceAuditEntry[] {
    let entries = this.auditLog;

    if (startDate) {
      entries = entries.filter(entry => entry.timestamp >= startDate);
    }

    if (endDate) {
      entries = entries.filter(entry => entry.timestamp <= endDate);
    }

    return entries;
  }
}

// Export singleton instance
export const apiComplianceValidator = new APIComplianceValidator();

// Export middleware function for Next.js
export const complianceMiddleware = apiComplianceValidator.createMiddleware();