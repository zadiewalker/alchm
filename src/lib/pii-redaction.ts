// ALCHM PII Detection and Redaction System
// FERPA/COPPA Compliant Personal Information Protection

export interface PIIDetectionResult {
  originalText: string;
  redactedText: string;
  detectedPII: PIIMatch[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface PIIMatch {
  type: PIIType;
  value: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  replacement: string;
}

export enum PIIType {
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  SSN = 'ssn',
  ADDRESS = 'address',
  SCHOOL_ID = 'school_id',
  DATE_OF_BIRTH = 'date_of_birth',
  CREDIT_CARD = 'credit_card',
  IP_ADDRESS = 'ip_address',
  CUSTOM_IDENTIFIER = 'custom_identifier'
}

export class PIIRedactionService {
  
  // Comprehensive PII detection patterns
  private readonly PII_PATTERNS: Record<PIIType, RegExp[]> = {
    [PIIType.EMAIL]: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/g
    ],
    
    [PIIType.PHONE]: [
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // US phone format
      /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, // (xxx) xxx-xxxx
      /\b\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g // International
    ],
    
    [PIIType.SSN]: [
      /\b\d{3}-\d{2}-\d{4}\b/g,
      /\b\d{3}\s\d{2}\s\d{4}\b/g,
      /\b\d{9}\b/g
    ],
    
    [PIIType.NAME]: [
      // Common name patterns (requires context validation)
      /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g, // First Last
      /\b[A-Z][a-z]{2,}\s+[A-Z]\.\s+[A-Z][a-z]{2,}\b/g, // First M. Last
      /\bMy name is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /\bI am\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /\bI'm\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
    ],
    
    [PIIType.ADDRESS]: [
      /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl)\b/gi,
      /\b\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s+\d{5}\b/gi // Address with city, state, zip
    ],
    
    [PIIType.SCHOOL_ID]: [
      /\b(?:student\s*(?:id|number|#)?:?\s*)?[A-Z]?\d{6,10}\b/gi,
      /\b(?:id\s*(?:number|#)?:?\s*)?[A-Z]{2,3}\d{4,8}\b/gi
    ],
    
    [PIIType.DATE_OF_BIRTH]: [
      /\b(?:born|birth|dob|date of birth):?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
      /\b(?:birthday|b-?day):?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi
    ],
    
    [PIIType.CREDIT_CARD]: [
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
    ],
    
    [PIIType.IP_ADDRESS]: [
      /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
    ],
    
    [PIIType.CUSTOM_IDENTIFIER]: [
      // School-specific patterns can be added here
      /\b[A-Z]{3}\d{6}\b/g, // Example: ABC123456
    ]
  };

  // Safe replacement patterns
  private readonly REPLACEMENT_PATTERNS: Record<PIIType, (match: string) => string> = {
    [PIIType.EMAIL]: () => '[EMAIL_REDACTED]',
    [PIIType.PHONE]: () => '[PHONE_REDACTED]',
    [PIIType.SSN]: () => '[SSN_REDACTED]',
    [PIIType.NAME]: () => '[NAME_REDACTED]',
    [PIIType.ADDRESS]: () => '[ADDRESS_REDACTED]',
    [PIIType.SCHOOL_ID]: () => '[STUDENT_ID_REDACTED]',
    [PIIType.DATE_OF_BIRTH]: () => '[DOB_REDACTED]',
    [PIIType.CREDIT_CARD]: () => '[CARD_REDACTED]',
    [PIIType.IP_ADDRESS]: () => '[IP_REDACTED]',
    [PIIType.CUSTOM_IDENTIFIER]: () => '[ID_REDACTED]'
  };

  // Context-aware name validation
  private readonly COMMON_WORDS = new Set([
    'the', 'and', 'but', 'for', 'are', 'not', 'you', 'all', 'can', 'her', 'was', 'one',
    'our', 'had', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old',
    'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too',
    'use', 'about', 'after', 'again', 'back', 'call', 'came', 'come', 'down', 'each',
    'find', 'first', 'good', 'great', 'here', 'just', 'know', 'last', 'left', 'life',
    'like', 'live', 'look', 'made', 'make', 'many', 'most', 'move', 'must', 'name',
    'need', 'next', 'only', 'open', 'over', 'own', 'part', 'place', 'right', 'said',
    'same', 'seem', 'show', 'small', 'such', 'take', 'than', 'that', 'them', 'think',
    'this', 'time', 'very', 'want', 'water', 'well', 'went', 'were', 'what', 'when',
    'where', 'will', 'with', 'work', 'world', 'would', 'write', 'year', 'your'
  ]);

  // Main PII detection and redaction function
  async detectAndRedactPII(text: string, options: PIIDetectionOptions = {}): Promise<PIIDetectionResult> {
    const detectedPII: PIIMatch[] = [];
    let redactedText = text;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Process each PII type
    for (const [piiType, patterns] of Object.entries(this.PII_PATTERNS)) {
      for (const pattern of patterns) {
        const matches = Array.from(text.matchAll(pattern));
        
        for (const match of matches) {
          if (match.index !== undefined) {
            const confidence = this.calculateConfidence(piiType as PIIType, match[0], text, match.index);
            
            // Only process high-confidence matches
            if (confidence >= (options.confidenceThreshold || 0.7)) {
              const replacement = this.REPLACEMENT_PATTERNS[piiType as PIIType](match[0]);
              
              detectedPII.push({
                type: piiType as PIIType,
                value: match[0],
                startIndex: match.index,
                endIndex: match.index + match[0].length,
                confidence,
                replacement
              });

              // Update risk level based on PII type
              riskLevel = this.updateRiskLevel(riskLevel, piiType as PIIType);
            }
          }
        }
      }
    }

    // Sort by start index (descending) to replace from end to beginning
    detectedPII.sort((a, b) => b.startIndex - a.startIndex);

    // Apply redactions
    for (const pii of detectedPII) {
      redactedText = redactedText.substring(0, pii.startIndex) + 
                    pii.replacement + 
                    redactedText.substring(pii.endIndex);
    }

    return {
      originalText: text,
      redactedText,
      detectedPII,
      riskLevel
    };
  }

  // Calculate confidence score for PII matches
  private calculateConfidence(type: PIIType, match: string, context: string, index: number): number {
    let confidence = 0.5; // Base confidence
    
    switch (type) {
      case PIIType.EMAIL:
        // High confidence for email - clear pattern
        confidence = 0.95;
        break;
        
      case PIIType.PHONE:
        // High confidence for phone numbers
        confidence = 0.9;
        break;
        
      case PIIType.SSN:
        // Very high confidence for SSN patterns
        confidence = 0.98;
        break;
        
      case PIIType.NAME:
        // Lower confidence - needs context validation
        confidence = this.validateNameContext(match, context, index);
        break;
        
      case PIIType.ADDRESS:
        // Medium-high confidence for addresses
        confidence = 0.85;
        break;
        
      case PIIType.SCHOOL_ID:
        // Context-dependent
        confidence = this.validateStudentIdContext(match, context, index);
        break;
        
      default:
        confidence = 0.7;
    }
    
    return Math.min(confidence, 1.0);
  }

  // Validate name matches against common words and context
  private validateNameContext(match: string, context: string, index: number): number {
    const words = match.toLowerCase().split(' ');
    
    // Check if any word is a common word (reduce confidence)
    const hasCommonWord = words.some(word => this.COMMON_WORDS.has(word));
    if (hasCommonWord) {
      return 0.3;
    }
    
    // Check for name-indicating context
    const beforeContext = context.substring(Math.max(0, index - 50), index).toLowerCase();
    const afterContext = context.substring(index + match.length, Math.min(context.length, index + match.length + 50)).toLowerCase();
    
    const nameIndicators = [
      'my name is', 'i am', "i'm", 'called', 'name:', 'student:', 'friend', 'classmate'
    ];
    
    const hasNameIndicator = nameIndicators.some(indicator => 
      beforeContext.includes(indicator) || afterContext.includes(indicator)
    );
    
    return hasNameIndicator ? 0.8 : 0.4;
  }

  // Validate student ID context
  private validateStudentIdContext(match: string, context: string, index: number): number {
    const beforeContext = context.substring(Math.max(0, index - 30), index).toLowerCase();
    const afterContext = context.substring(index + match.length, Math.min(context.length, index + match.length + 30)).toLowerCase();
    
    const idIndicators = [
      'student id', 'id number', 'student number', 'id:', 'number:', 'id is'
    ];
    
    const hasIdIndicator = idIndicators.some(indicator => 
      beforeContext.includes(indicator) || afterContext.includes(indicator)
    );
    
    return hasIdIndicator ? 0.9 : 0.6;
  }

  // Update overall risk level based on detected PII types
  private updateRiskLevel(currentLevel: string, piiType: PIIType): 'low' | 'medium' | 'high' | 'critical' {
    const riskLevels = { low: 1, medium: 2, high: 3, critical: 4 };
    const typeRisks: Record<PIIType, number> = {
      [PIIType.NAME]: 2,
      [PIIType.EMAIL]: 3,
      [PIIType.PHONE]: 3,
      [PIIType.SSN]: 4,
      [PIIType.ADDRESS]: 3,
      [PIIType.SCHOOL_ID]: 3,
      [PIIType.DATE_OF_BIRTH]: 4,
      [PIIType.CREDIT_CARD]: 4,
      [PIIType.IP_ADDRESS]: 2,
      [PIIType.CUSTOM_IDENTIFIER]: 2
    };
    
    const newRiskLevel = Math.max(riskLevels[currentLevel as keyof typeof riskLevels], typeRisks[piiType]);
    
    const levelNames = ['', 'low', 'medium', 'high', 'critical'];
    return levelNames[newRiskLevel] as 'low' | 'medium' | 'high' | 'critical';
  }

  // Validate redaction quality
  async validateRedaction(result: PIIDetectionResult): Promise<boolean> {
    // Re-run detection on redacted text to ensure no PII remains
    const secondScan = await this.detectAndRedactPII(result.redactedText, { confidenceThreshold: 0.5 });
    return secondScan.detectedPII.length === 0;
  }

  // Get redaction statistics
  getRedactionStats(result: PIIDetectionResult): RedactionStats {
    const typeCount: Record<string, number> = {};
    result.detectedPII.forEach(pii => {
      typeCount[pii.type] = (typeCount[pii.type] || 0) + 1;
    });

    return {
      totalPIIFound: result.detectedPII.length,
      riskLevel: result.riskLevel,
      typeBreakdown: typeCount,
      redactionPercentage: result.detectedPII.length > 0 ? 
        (result.detectedPII.reduce((sum, pii) => sum + pii.value.length, 0) / result.originalText.length) * 100 : 0
    };
  }
}

export interface PIIDetectionOptions {
  confidenceThreshold?: number; // 0-1, default 0.7
  enabledTypes?: PIIType[];
  customPatterns?: Record<string, RegExp[]>;
}

export interface RedactionStats {
  totalPIIFound: number;
  riskLevel: string;
  typeBreakdown: Record<string, number>;
  redactionPercentage: number;
}

// Export singleton instance
export const piiRedactionService = new PIIRedactionService();