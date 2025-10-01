// Firebase Studio Security & Compliance Configuration for Mental Health Platform
// Enterprise-grade security with HIPAA, FERPA, COPPA compliance

const ADVANCED_SECURITY_CONFIG = {
  // App Check configuration for enhanced security
  appCheck: {
    providers: {
      // reCAPTCHA for web clients
      recaptchaV3: {
        siteKey: "auto-configured",
        scoreThreshold: 0.5,
        challengeOnLowScore: true
      },
      
      // Device attestation for mobile
      deviceCheck: {
        enabled: true,
        keyId: "${DEVICE_CHECK_KEY_ID}",
        privateKey: "${DEVICE_CHECK_PRIVATE_KEY}"
      },
      
      // Play Integrity for Android
      playIntegrity: {
        enabled: true,
        packageName: "app.alchm.sanctuary"
      }
    },
    
    // Enforcement levels
    enforcement: {
      firestore: "strict",
      storage: "strict",
      functions: "strict",
      realtimeDatabase: "strict"
    },
    
    // Debug configuration
    debug: {
      enabled: false, // Always false in production
      allowedProviders: []
    }
  },

  // Firebase Auth security enhancements
  authentication: {
    // Multi-factor authentication
    mfa: {
      enabled: true,
      providerConfigs: [
        {
          state: "ENABLED",
          totpProviderConfig: {
            adjacentIntervals: 5
          }
        },
        {
          state: "ENABLED", 
          phoneProviderConfig: {}
        }
      ],
      enforcementPolicy: {
        enforcementState: "OPTIONAL", // Allow user choice for mental health accessibility
        exemptedProviders: ["password"] // SMS backup for crisis situations
      }
    },
    
    // Password policy
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumeric: true,
      requireNonAlphanumeric: true,
      allowedNonAlphanumericCharacters: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
      forceUpgradeOnSignin: true
    },
    
    // Session management
    sessionManagement: {
      sessionCookieMaxAge: 1800, // 30 minutes for mental health security
      revokeRefreshTokens: true,
      requireRecentSignIn: true,
      signInOptions: {
        continueUrl: "https://alchm-digital-sanctuary.web.app/dashboard",
        handleCodeInApp: true
      }
    },
    
    // Account security
    accountSecurity: {
      enableAccountLinking: false, // Disabled for mental health privacy
      enableAnonymousUsers: true, // Allow for crisis situations
      enableEmailVerification: true,
      disableAccountCreation: false,
      quotas: {
        signUpQuotaPerIp: 100,
        signInQuotaPerIp: 1000
      }
    }
  },

  // Data encryption configuration
  encryption: {
    // Firestore encryption
    firestore: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      clientSideEncryption: {
        enabled: true,
        algorithm: "AES-GCM-256",
        keyRotation: "quarterly"
      }
    },
    
    // Cloud Storage encryption
    storage: {
      encryptionAtRest: true,
      encryptionInTransit: true,
      customerManagedKeys: true,
      keyManagement: {
        provider: "google-cloud-kms",
        keyRing: "alchm-mental-health",
        cryptoKey: "patient-data-encryption"
      }
    },
    
    // Function environment encryption
    functions: {
      environmentVariables: {
        encrypted: true,
        secrets: [
          "STRIPE_SECRET_KEY",
          "OPENAI_API_KEY", 
          "GEMINI_API_KEY",
          "TWILIO_AUTH_TOKEN",
          "SMTP_PASSWORD"
        ]
      }
    }
  },

  // Network security
  networkSecurity: {
    // HTTPS enforcement
    httpsOnly: true,
    
    // Security headers
    headers: {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https: blob:;
        connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net;
        frame-src 'none';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim(),
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Resource-Policy": "same-origin"
    },
    
    // Rate limiting
    rateLimiting: {
      global: {
        requestsPerMinute: 1000,
        burstLimit: 100
      },
      perUser: {
        requestsPerMinute: 100,
        burstLimit: 20
      },
      crisis: {
        requestsPerMinute: 500, // Higher limit for crisis situations
        burstLimit: 50
      }
    }
  }
};

// HIPAA Compliance Configuration
const HIPAA_COMPLIANCE = {
  // Protected Health Information (PHI) handling
  phi: {
    // Data classification
    classification: {
      journalEntries: "phi",
      moodData: "phi", 
      crisisAlerts: "phi",
      therapeuticNotes: "phi",
      demographics: "phi",
      contactInfo: "phi"
    },
    
    // Access controls
    accessControls: {
      roleBasedAccess: true,
      minimumNecessary: true,
      auditLogging: true,
      automaticLogoff: 1800, // 30 minutes
      uniqueUserIdentification: true,
      procedures: {
        accessDetermination: "role-based-with-need-to-know",
        accessModification: "approval-workflow-required",
        accessTermination: "immediate-upon-role-change"
      }
    },
    
    // Data safeguards
    safeguards: {
      administrative: {
        securityOfficer: "designated",
        conductedTraining: true,
        accessManagement: "documented-procedures",
        workforceAccess: "minimum-necessary",
        emergencyAccess: "documented-procedures"
      },
      
      physical: {
        facilityAccess: "controlled",
        workstationSecurity: "documented",
        mediaControls: "documented"
      },
      
      technical: {
        accessControl: "unique-user-identification",
        auditControls: "comprehensive-logging",
        integrity: "data-validation-procedures",
        transmission: "end-to-end-encryption"
      }
    }
  },
  
  // Business Associate Agreement compliance
  baa: {
    coveredEntities: ["healthcare-providers", "health-plans"],
    businessAssociates: ["firebase", "google-cloud", "stripe"],
    subcontractors: ["twilio", "openai"],
    safeguards: "administrative-physical-technical",
    incidentReporting: "immediate",
    returnDestruction: "documented-procedures"
  },
  
  // Breach notification procedures
  breachNotification: {
    discovery: "immediate-assessment",
    investigation: "within-24-hours",
    notification: {
      individuals: "within-60-days",
      hhs: "within-60-days",
      media: "if-500-plus-affected"
    },
    documentation: "all-steps-documented"
  }
};

// FERPA Compliance Configuration (Educational Records)
const FERPA_COMPLIANCE = {
  // Educational records protection
  educationalRecords: {
    // Definition of educational records
    definition: {
      includes: ["academic-performance", "therapeutic-progress", "behavioral-notes"],
      excludes: ["personal-crisis-notes", "emergency-contacts"]
    },
    
    // Directory information
    directoryInfo: {
      allowedWithoutConsent: [],
      optOutAvailable: true,
      annualNotification: true
    },
    
    // Consent requirements
    consent: {
      required: "prior-written-consent",
      exceptions: ["school-officials", "emergency", "judicial-order"],
      validConsent: {
        specifies: "records-to-disclose",
        states: "purpose-of-disclosure",
        identifies: "party-to-whom-disclosed",
        signed: true,
        dated: true
      }
    },
    
    // Student rights
    studentRights: {
      inspectReview: "within-45-days",
      requestAmendment: "if-inaccurate-misleading",
      hearing: "if-amendment-denied",
      fileComplaint: "with-department-of-education"
    }
  },
  
  // Age-based protections
  ageBasedProtections: {
    under13: {
      parentalConsent: "required",
      dataCollection: "minimal",
      sharing: "prohibited-without-consent",
      retention: "limited"
    },
    
    ages13to18: {
      parentalRights: "maintained",
      studentRights: "developing",
      dualConsent: "recommended",
      emergencyOverride: "documented"
    },
    
    over18: {
      studentRights: "full",
      parentalRights: "with-consent-only",
      independence: "respected"
    }
  }
};

// COPPA Compliance Configuration (Children's Privacy)
const COPPA_COMPLIANCE = {
  // Children's data protection (under 13)
  childrensData: {
    // Parental consent mechanisms
    parentalConsent: {
      methods: [
        "signed-form-email-scan",
        "video-conference-verification",
        "government-id-verification"
      ],
      verification: "reasonable-effort-standard",
      exceptions: [
        "email-for-direct-response",
        "safety-protection",
        "notification-to-parents"
      ]
    },
    
    // Data collection limitations
    dataCollection: {
      minimal: "only-necessary-for-service",
      purpose: "clearly-specified",
      retention: "no-longer-than-necessary",
      sharing: "prohibited-without-consent",
      deletion: "upon-request-or-end-of-service"
    },
    
    // Parental controls
    parentalControls: {
      review: "child-data-access",
      delete: "child-data-deletion",
      refuse: "further-collection",
      notification: "material-changes-to-policy"
    }
  },
  
  // Safe Harbor provisions
  safeHarbor: {
    ageScreening: {
      method: "neutral-age-screening",
      noInducement: "to-disclose-more-than-necessary",
      mixedAudience: "additional-safeguards"
    },
    
    blockingMechanisms: {
      parentalControls: "available",
      filteringSoftware: "compatible",
      ageVerification: "when-possible"
    }
  }
};

// Audit and monitoring configuration
const AUDIT_MONITORING = {
  // Comprehensive logging
  logging: {
    events: [
      "user-authentication",
      "data-access",
      "data-modification", 
      "crisis-alerts",
      "professional-interventions",
      "system-administration",
      "security-events",
      "compliance-actions"
    ],
    
    details: {
      timestamp: "utc-with-milliseconds",
      userId: "hashed-identifier",
      action: "specific-operation",
      resource: "accessed-data",
      result: "success-failure",
      ipAddress: "source-ip",
      userAgent: "client-information",
      sessionId: "unique-session-identifier"
    },
    
    retention: {
      securityLogs: "7-years",
      accessLogs: "6-years",
      systemLogs: "2-years",
      errorLogs: "1-year"
    }
  },
  
  // Real-time monitoring
  monitoring: {
    alerting: {
      unauthorizedAccess: "immediate",
      dataExfiltration: "immediate",
      crisisEscalation: "immediate",
      systemFailures: "5-minutes",
      performanceDegradation: "15-minutes"
    },
    
    metrics: {
      authenticationFailures: "tracked",
      accessPatterns: "analyzed",
      dataUsage: "monitored",
      systemPerformance: "measured",
      complianceViolations: "flagged"
    }
  },
  
  // Automated compliance checking
  complianceChecking: {
    frequency: "continuous",
    frameworks: ["hipaa", "ferpa", "coppa", "gdpr"],
    reporting: "monthly-summary",
    violations: "immediate-alert",
    remediation: "automated-where-possible"
  }
};

// Privacy by design principles
const PRIVACY_BY_DESIGN = {
  principles: {
    proactiveNotReactive: {
      anticipate: "privacy-risks",
      prevent: "privacy-invasions",
      remedy: "before-they-occur"
    },
    
    privacyAsDefault: {
      noAction: "required-from-individual",
      maximumPrivacy: "automatically-ensured",
      noCompromise: "of-system-functionality"
    },
    
    privacyEmbedded: {
      designPhase: "incorporated-from-start",
      notBolted: "on-as-add-on",
      coreComponent: "of-system-functionality"
    },
    
    fullFunctionality: {
      noTrade: "offs-necessary",
      accommodateAllInterests: "without-compromise",
      winWinSolutions: "for-all-stakeholders"
    },
    
    endToEndSecurity: {
      fromStart: "to-finish",
      dataLifecycle: "fully-protected",
      secureDestruction: "when-no-longer-needed"
    },
    
    visibilityTransparency: {
      allStakeholders: "can-verify",
      businessPractices: "open-to-scrutiny",
      operatingAccordingly: "to-stated-promises"
    },
    
    respectUserPrivacy: {
      userCentric: "design-and-operation",
      individualNeeds: "prioritized",
      userFriendly: "defaults-settings-notices"
    }
  }
};

module.exports = {
  ADVANCED_SECURITY_CONFIG,
  HIPAA_COMPLIANCE,
  FERPA_COMPLIANCE,
  COPPA_COMPLIANCE,
  AUDIT_MONITORING,
  PRIVACY_BY_DESIGN
};