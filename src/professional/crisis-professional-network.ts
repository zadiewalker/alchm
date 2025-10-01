/**
 * ALCHM Professional Crisis Network
 * 
 * 24/7 network of licensed crisis counselors, therapists, and emergency 
 * mental health professionals providing immediate intervention support.
 * 
 * Features:
 * - Cultural competency matching
 * - Geographic proximity optimization  
 * - Specialty expertise routing
 * - Emergency backup protocols
 * - Professional credentialing validation
 */

import { CrisisEvent } from '../crisis/emergency-escalation-system';

export interface CrisisProfessional {
  id: string;
  profile: {
    name: string;
    title: string;
    credentials: string[];
    licenseNumber: string;
    licenseState: string;
    licenseExpiration: Date;
    yearsExperience: number;
  };
  availability: {
    status: 'available' | 'busy' | 'offline' | 'in_session' | 'emergency_only';
    timezone: string;
    workingHours: {
      start: string; // "09:00"
      end: string;   // "17:00"
      days: string[]; // ["monday", "tuesday", ...]
    };
    onCallSchedule?: {
      start: Date;
      end: Date;
    };
    maxConcurrentCases: number;
    currentCaseLoad: number;
    averageResponseTime: number; // seconds
  };
  specialties: {
    primary: string[];
    secondary: string[];
    certifications: string[];
    specializedTraining: string[];
  };
  culturalCompetencies: {
    languages: string[];
    culturalBackgrounds: string[];
    lgbtqAffirming: boolean;
    traumaInformed: boolean;
    youtFocused: boolean;
    elderCare: boolean;
    religiousCompetencies: string[];
  };
  geographic: {
    primaryLocation: {
      city: string;
      state: string;
      timezone: string;
    };
    serviceArea: {
      states: string[];
      regions: string[];
    };
    mobileTeamAccess: boolean;
    emergencyDispatchRadius: number; // miles
  };
  performanceMetrics: {
    responseTimeAverage: number;
    successfulInterventions: number;
    escalationRate: number;
    clientSatisfactionScore: number;
    culturalCompetencyRating: number;
    crisisResolutionRate: number;
  };
  contactMethods: {
    secure_messaging: boolean;
    video_call: boolean;
    phone_call: boolean;
    mobile_app: boolean;
    emergency_line: string;
  };
  compliance: {
    hipaaTraining: Date;
    crisisInterventionCertification: Date;
    backgroundCheckDate: Date;
    malpracticeInsurance: {
      provider: string;
      policyNumber: string;
      expirationDate: Date;
    };
    continuingEducationHours: number;
    lastComplianceAudit: Date;
  };
}

export interface ProfessionalNetworkConfiguration {
  minimumResponseTime: number; // seconds
  maxSearchRadius: number; // miles
  culturalMatchingWeight: number; // 0-1
  specialtyMatchingWeight: number; // 0-1
  availabilityWeight: number; // 0-1
  performanceWeight: number; // 0-1
  backupProtocolThreshold: number; // minutes
  emergencyOverrideEnabled: boolean;
}

export interface CrisisMatchingCriteria {
  severity: 'low' | 'moderate' | 'high' | 'severe' | 'imminent';
  culturalBackground?: string;
  primaryLanguage: string;
  specialtiesNeeded: string[];
  ageGroup: 'child' | 'adolescent' | 'adult' | 'elderly';
  religiousConsiderations?: string[];
  lgbtqAffirming?: boolean;
  geographicLocation?: {
    latitude: number;
    longitude: number;
  };
  preferredContactMethod: string[];
  maxResponseTime: number;
  timeOfDay: 'business' | 'evening' | 'overnight' | 'weekend';
}

export interface ProfessionalMatch {
  professional: CrisisProfessional;
  matchScore: number;
  matchFactors: {
    cultural: number;
    specialty: number;
    availability: number;
    performance: number;
    geographic: number;
  };
  estimatedResponseTime: number;
  contactMethod: string;
  backupProfessionals: CrisisProfessional[];
}

export class CrisisProfessionalNetwork {
  private professionals: Map<string, CrisisProfessional> = new Map();
  private availabilityCache: Map<string, Date> = new Map();
  private performanceMetrics: Map<string, any> = new Map();
  private configuration: ProfessionalNetworkConfiguration;
  private backupProtocols: EmergencyBackupProtocols;

  constructor(config: ProfessionalNetworkConfiguration) {
    this.configuration = config;
    this.backupProtocols = new EmergencyBackupProtocols();
    this.initializeNetwork();
    this.startAvailabilityMonitoring();
  }

  /**
   * Find best-matched available crisis professional
   */
  async findAvailableCounselor(criteria: CrisisMatchingCriteria): Promise<ProfessionalMatch | null> {
    try {
      // Get all available professionals
      const availableProfessionals = await this.getAvailableProfessionals(criteria.maxResponseTime);
      
      if (availableProfessionals.length === 0) {
        // Activate backup protocols
        return await this.activateBackupProtocols(criteria);
      }

      // Score and rank professionals
      const scoredMatches = await this.scoreProfessionalMatches(availableProfessionals, criteria);
      
      // Get best match
      const bestMatch = scoredMatches[0];
      if (!bestMatch || bestMatch.matchScore < 0.6) {
        // Score too low, try backup protocols
        return await this.activateBackupProtocols(criteria);
      }

      // Reserve professional and return match
      await this.reserveProfessional(bestMatch.professional.id, criteria.maxResponseTime);
      
      return bestMatch;

    } catch (error) {
      console.error('Error finding available counselor:', error);
      return await this.activateBackupProtocols(criteria);
    }
  }

  /**
   * Get real-time availability of all professionals
   */
  private async getAvailableProfessionals(maxResponseTime: number): Promise<CrisisProfessional[]> {
    const available: CrisisProfessional[] = [];
    const now = new Date();

    for (const professional of this.professionals.values()) {
      // Check basic availability status
      if (professional.availability.status === 'offline') {
        continue;
      }

      // Check if within working hours or on-call
      if (!this.isProfessionalAvailable(professional, now)) {
        continue;
      }

      // Check response time capability
      if (professional.availability.averageResponseTime > maxResponseTime) {
        continue;
      }

      // Check current caseload
      if (professional.availability.currentCaseLoad >= professional.availability.maxConcurrentCases) {
        continue;
      }

      // Verify license is current
      if (!this.isLicenseValid(professional)) {
        continue;
      }

      available.push(professional);
    }

    return available;
  }

  /**
   * Score professional matches based on multiple criteria
   */
  private async scoreProfessionalMatches(
    professionals: CrisisProfessional[],
    criteria: CrisisMatchingCriteria
  ): Promise<ProfessionalMatch[]> {
    const matches: ProfessionalMatch[] = [];

    for (const professional of professionals) {
      const matchFactors = {
        cultural: this.scoreCulturalMatch(professional, criteria),
        specialty: this.scoreSpecialtyMatch(professional, criteria),
        availability: this.scoreAvailability(professional, criteria),
        performance: this.scorePerformance(professional),
        geographic: this.scoreGeographicMatch(professional, criteria)
      };

      const matchScore = this.calculateOverallScore(matchFactors);
      
      // Get backup professionals for this match
      const backupProfessionals = await this.findBackupProfessionals(professional, criteria, 3);

      matches.push({
        professional,
        matchScore,
        matchFactors,
        estimatedResponseTime: professional.availability.averageResponseTime,
        contactMethod: this.selectBestContactMethod(professional, criteria.preferredContactMethod),
        backupProfessionals
      });
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Score cultural competency match
   */
  private scoreCulturalMatch(professional: CrisisProfessional, criteria: CrisisMatchingCriteria): number {
    let score = 0;
    const maxScore = 100;

    // Language match (highest priority)
    if (professional.culturalCompetencies.languages.includes(criteria.primaryLanguage)) {
      score += 40;
    }

    // Cultural background match
    if (criteria.culturalBackground && 
        professional.culturalCompetencies.culturalBackgrounds.includes(criteria.culturalBackground)) {
      score += 30;
    }

    // LGBTQ affirming if needed
    if (criteria.lgbtqAffirming && professional.culturalCompetencies.lgbtqAffirming) {
      score += 15;
    }

    // Religious considerations
    if (criteria.religiousConsiderations) {
      const religiousMatch = criteria.religiousConsiderations.some(religion => 
        professional.culturalCompetencies.religiousCompetencies.includes(religion)
      );
      if (religiousMatch) {
        score += 15;
      }
    }

    return Math.min(score, maxScore) / maxScore;
  }

  /**
   * Score specialty expertise match
   */
  private scoreSpecialtyMatch(professional: CrisisProfessional, criteria: CrisisMatchingCriteria): number {
    let score = 0;
    const maxScore = 100;

    const allSpecialties = [
      ...professional.specialties.primary,
      ...professional.specialties.secondary,
      ...professional.specialties.certifications
    ];

    // Primary specialty matches (higher weight)
    const primaryMatches = criteria.specialtiesNeeded.filter(specialty =>
      professional.specialties.primary.includes(specialty)
    );
    score += primaryMatches.length * 30;

    // Secondary specialty matches
    const secondaryMatches = criteria.specialtiesNeeded.filter(specialty =>
      professional.specialties.secondary.includes(specialty) ||
      professional.specialties.certifications.includes(specialty)
    );
    score += secondaryMatches.length * 20;

    // Crisis intervention experience
    if (allSpecialties.includes('crisis_intervention')) {
      score += 20;
    }

    // Trauma-informed care
    if (professional.culturalCompetencies.traumaInformed) {
      score += 15;
    }

    // Age group specialization
    if (this.hasAgeGroupSpecialization(professional, criteria.ageGroup)) {
      score += 15;
    }

    return Math.min(score, maxScore) / maxScore;
  }

  /**
   * Score availability and response capability
   */
  private scoreAvailability(professional: CrisisProfessional, criteria: CrisisMatchingCriteria): number {
    let score = 0;
    const maxScore = 100;

    // Response time (faster = higher score)
    const responseTimeScore = Math.max(0, 100 - (professional.availability.averageResponseTime / 60));
    score += responseTimeScore * 0.4;

    // Current caseload (lower = higher score)
    const caseloadRatio = professional.availability.currentCaseLoad / professional.availability.maxConcurrentCases;
    score += (1 - caseloadRatio) * 30;

    // Status priority
    switch (professional.availability.status) {
      case 'available':
        score += 30;
        break;
      case 'busy':
        score += 10;
        break;
      case 'in_session':
        score += 5;
        break;
      case 'emergency_only':
        score += criteria.severity === 'severe' || criteria.severity === 'imminent' ? 25 : 0;
        break;
    }

    return Math.min(score, maxScore) / maxScore;
  }

  /**
   * Score professional performance metrics
   */
  private scorePerformance(professional: CrisisProfessional): number {
    const metrics = professional.performanceMetrics;
    
    // Weighted average of performance indicators
    const successRate = metrics.successfulInterventions / Math.max(1, metrics.successfulInterventions + (metrics.escalationRate * 10));
    const clientSatisfaction = metrics.clientSatisfactionScore / 5; // Assume 5-point scale
    const culturalCompetency = metrics.culturalCompetencyRating / 5;
    const crisisResolution = metrics.crisisResolutionRate;

    return (successRate * 0.3 + clientSatisfaction * 0.25 + culturalCompetency * 0.25 + crisisResolution * 0.2);
  }

  /**
   * Score geographic proximity and availability
   */
  private scoreGeographicMatch(professional: CrisisProfessional, criteria: CrisisMatchingCriteria): number {
    if (!criteria.geographicLocation) {
      return 0.8; // Neutral score for remote sessions
    }

    // Calculate distance (simplified)
    const distance = this.calculateDistance(
      criteria.geographicLocation,
      {
        latitude: 0, // Would get from professional.geographic.primaryLocation
        longitude: 0
      }
    );

    if (distance <= professional.geographic.emergencyDispatchRadius) {
      return 1.0;
    }

    // Score decreases with distance
    return Math.max(0, 1 - (distance / this.configuration.maxSearchRadius));
  }

  /**
   * Calculate weighted overall match score
   */
  private calculateOverallScore(factors: any): number {
    const config = this.configuration;
    
    return (
      factors.cultural * config.culturalMatchingWeight +
      factors.specialty * config.specialtyMatchingWeight +
      factors.availability * config.availabilityWeight +
      factors.performance * config.performanceWeight
    ) / (
      config.culturalMatchingWeight +
      config.specialtyMatchingWeight +
      config.availabilityWeight +
      config.performanceWeight
    );
  }

  /**
   * Activate backup protocols when no suitable match found
   */
  private async activateBackupProtocols(criteria: CrisisMatchingCriteria): Promise<ProfessionalMatch | null> {
    // Try expanding search criteria
    const expandedCriteria = {
      ...criteria,
      maxResponseTime: criteria.maxResponseTime * 2,
      specialtiesNeeded: [] // Remove specialty requirements in emergency
    };

    const expandedSearch = await this.findAvailableCounselor(expandedCriteria);
    if (expandedSearch) {
      return expandedSearch;
    }

    // Activate emergency backup network
    return await this.backupProtocols.activateEmergencyBackup(criteria);
  }

  /**
   * Reserve a professional for a crisis intervention
   */
  private async reserveProfessional(professionalId: string, durationMinutes: number): Promise<void> {
    const professional = this.professionals.get(professionalId);
    if (professional) {
      professional.availability.currentCaseLoad += 1;
      professional.availability.status = 'in_session';
      
      // Schedule release after estimated duration
      setTimeout(() => {
        professional.availability.currentCaseLoad -= 1;
        if (professional.availability.currentCaseLoad < professional.availability.maxConcurrentCases) {
          professional.availability.status = 'available';
        }
      }, durationMinutes * 60 * 1000);
    }
  }

  /**
   * Find backup professionals for redundancy
   */
  private async findBackupProfessionals(
    primaryProfessional: CrisisProfessional,
    criteria: CrisisMatchingCriteria,
    count: number
  ): Promise<CrisisProfessional[]> {
    const available = await this.getAvailableProfessionals(criteria.maxResponseTime * 1.5);
    const backups = available
      .filter(p => p.id !== primaryProfessional.id)
      .slice(0, count);
    
    return backups;
  }

  /**
   * Select best contact method based on preferences and capabilities
   */
  private selectBestContactMethod(professional: CrisisProfessional, preferredMethods: string[]): string {
    const availableMethods = Object.entries(professional.contactMethods)
      .filter(([method, available]) => available)
      .map(([method]) => method);

    // Find first preferred method that's available
    for (const preferred of preferredMethods) {
      if (availableMethods.includes(preferred)) {
        return preferred;
      }
    }

    // Default to first available method
    return availableMethods[0] || 'phone_call';
  }

  /**
   * Check if professional is currently available
   */
  private isProfessionalAvailable(professional: CrisisProfessional, now: Date): boolean {
    // Check if on-call
    if (professional.availability.onCallSchedule) {
      return now >= professional.availability.onCallSchedule.start && 
             now <= professional.availability.onCallSchedule.end;
    }

    // Check regular working hours
    const currentDay = now.toLocaleDateString('en', { weekday: 'lowercase' });
    if (!professional.availability.workingHours.days.includes(currentDay)) {
      return false;
    }

    const currentTime = now.toTimeString().slice(0, 5);
    return currentTime >= professional.availability.workingHours.start &&
           currentTime <= professional.availability.workingHours.end;
  }

  /**
   * Verify professional license is valid
   */
  private isLicenseValid(professional: CrisisProfessional): boolean {
    return professional.profile.licenseExpiration > new Date();
  }

  /**
   * Check if professional has age group specialization
   */
  private hasAgeGroupSpecialization(professional: CrisisProfessional, ageGroup: string): boolean {
    switch (ageGroup) {
      case 'child':
      case 'adolescent':
        return professional.culturalCompetencies.youtFocused;
      case 'elderly':
        return professional.culturalCompetencies.elderCare;
      default:
        return true; // Adult is default
    }
  }

  /**
   * Calculate distance between two geographic points
   */
  private calculateDistance(point1: { latitude: number; longitude: number }, point2: { latitude: number; longitude: number }): number {
    // Haversine formula implementation
    const R = 3959; // Earth's radius in miles
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Initialize professional network with sample data
   */
  private initializeNetwork(): void {
    // This would load from a secure professional database
    // Sample implementation for demonstration
  }

  /**
   * Start monitoring availability status
   */
  private startAvailabilityMonitoring(): void {
    setInterval(async () => {
      await this.updateAvailabilityCache();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Update cached availability information
   */
  private async updateAvailabilityCache(): Promise<void> {
    for (const professional of this.professionals.values()) {
      this.availabilityCache.set(professional.id, new Date());
    }
  }

  /**
   * Add professional to network
   */
  async addProfessional(professional: CrisisProfessional): Promise<void> {
    // Validate credentials and compliance
    if (await this.validateProfessionalCredentials(professional)) {
      this.professionals.set(professional.id, professional);
    }
  }

  /**
   * Remove professional from network
   */
  async removeProfessional(professionalId: string): Promise<void> {
    this.professionals.delete(professionalId);
    this.availabilityCache.delete(professionalId);
  }

  /**
   * Update professional availability
   */
  async updateProfessionalAvailability(professionalId: string, availability: Partial<CrisisProfessional['availability']>): Promise<void> {
    const professional = this.professionals.get(professionalId);
    if (professional) {
      professional.availability = { ...professional.availability, ...availability };
    }
  }

  /**
   * Validate professional credentials
   */
  private async validateProfessionalCredentials(professional: CrisisProfessional): Promise<boolean> {
    // Implement credential validation logic
    return true;
  }
}

/**
 * Emergency backup protocols for when primary network is unavailable
 */
class EmergencyBackupProtocols {
  async activateEmergencyBackup(criteria: CrisisMatchingCriteria): Promise<ProfessionalMatch | null> {
    // Implement backup network activation
    // This might include:
    // - National crisis hotlines
    // - Partner organization professionals
    // - Emergency on-call volunteers
    
    return null; // Placeholder
  }
}