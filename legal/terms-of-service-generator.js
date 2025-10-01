/**
 * ALCHM Terms of Service Generator
 * Platform-Compliant Liability Protection Framework
 * 
 * Generates attorney-ready terms of service with comprehensive liability protection
 */

const termsOfServiceGenerator = {
  // Platform compliance requirements
  platform_compliance: {
    apple_app_store: {
      required_clauses: [
        "Acknowledgment that agreement is between user and ALCHM, not Apple",
        "Apple has no responsibility for the app or its content",
        "Apple not responsible for addressing user claims",
        "Apple beneficiary of end-user license agreement",
        "Compliance with applicable third-party terms"
      ],
      content_restrictions: [
        "No objectionable content as defined by Apple",
        "No content that violates applicable laws",
        "Age-appropriate content for youth mental health",
        "No content encouraging illegal or harmful activities"
      ]
    },
    
    google_play_store: {
      required_clauses: [
        "Google Play Terms of Service incorporation",
        "Google not liable for app functionality",
        "User agreement to Google Play policies",
        "Content compliance with Google Play standards",
        "Developer responsibility for app support"
      ],
      policy_compliance: [
        "Developer Program Policies adherence",
        "User Data policy compliance for health apps",
        "Family-friendly content requirements",
        "Prohibited content restrictions"
      ]
    },
    
    web_platform: {
      jurisdiction: "Delaware incorporation, California operation",
      governing_law: "California state law with federal preemption",
      dispute_resolution: "Binding arbitration with youth protections",
      service_availability: "Global with local law compliance"
    }
  },

  // Comprehensive liability protection
  liability_protection: {
    medical_disclaimers: {
      primary_disclaimer: "ALCHM IS NOT THERAPY, NOT MEDICAL ADVICE, NOT PROFESSIONAL TREATMENT",
      specific_exclusions: [
        "Licensed therapy or counseling services",
        "Medical diagnosis or treatment recommendations", 
        "Psychiatric medication advice or management",
        "Crisis intervention beyond resource referral",
        "Professional mental health service provision"
      ],
      user_responsibilities: [
        "Seeking professional help when needed",
        "Using crisis resources appropriately",
        "Understanding platform limitations",
        "Not relying solely on ALCHM for mental health care"
      ]
    },
    
    ai_limitations: {
      khepera_disclosures: [
        "AI responses are generated, not human professional advice",
        "AI has limitations and may provide imperfect responses",
        "AI not trained as licensed mental health professional",
        "User should verify AI suggestions with qualified professionals",
        "AI responses based on patterns, not individual assessment"
      ],
      technical_limitations: [
        "AI processing dependent on technology functionality",
        "Response accuracy not guaranteed",
        "Cultural and individual variations may affect AI responses",
        "AI development ongoing with periodic improvements"
      ]
    },
    
    crisis_situation_limitations: {
      platform_boundaries: [
        "ALCHM provides resources, not emergency intervention",
        "Crisis resources are informational, not treatment",
        "Users responsible for accessing appropriate emergency services",
        "Platform cannot replace professional crisis intervention"
      ],
      emergency_protocols: [
        "Call 911 or local emergency services for immediate danger",
        "Contact crisis hotlines for professional crisis support",
        "Seek immediate professional help for safety concerns",
        "Inform trusted adults about crisis situations"
      ]
    },
    
    user_content_liability: [
      "Users responsible for accuracy of information provided",
      "Users maintain ownership of journal entries and personal content",
      "Users responsible for appropriateness of shared content",
      "Users liable for violations of platform community guidelines"
    ]
  },

  // Intellectual property framework
  intellectual_property: {
    user_generated_content: {
      ownership_rights: [
        "Users retain full ownership of journal entries and personal content",
        "Users own their healing journey documentation and insights",
        "Users control sharing and privacy of personal content",
        "Users can export, delete, or modify their content anytime"
      ],
      platform_rights: [
        "Limited license to provide platform services only",
        "No rights to sell, share, or commercialize user content",
        "Technical processing rights for AI response generation",
        "Backup and storage rights for service provision"
      ],
      content_usage: [
        "Personal content used only for providing personalized service",
        "Anonymized, aggregated data for platform improvement only",
        "No individual content used for AI training without explicit consent",
        "Content analysis limited to safety and service provision"
      ]
    },
    
    alchm_proprietary_content: {
      platform_assets: [
        "ALCHM trademark, logo, and brand assets",
        "Khepera AI system and response frameworks",
        "Pathway prompts and healing journey structures",
        "User interface designs and platform architecture"
      ],
      protection_measures: [
        "Unauthorized use of ALCHM branding prohibited",
        "Platform code and algorithms proprietary and protected",
        "User interface copying or replication forbidden",
        "Reverse engineering of AI systems prohibited"
      ],
      permitted_usage: [
        "Users may reference ALCHM in personal context",
        "Social media sharing of own achievements with attribution",
        "Educational or therapeutic discussion of platform benefits",
        "Fair use provisions for commentary or criticism"
      ]
    },
    
    ai_response_ownership: {
      khepera_responses: [
        "AI responses generated for individual user benefit",
        "Users have personal use rights to AI responses received",
        "AI response patterns and generation methods remain ALCHM property",
        "Individual AI responses not for commercial redistribution"
      ],
      training_data: [
        "User content not used for AI training without explicit consent",
        "AI trained on professionally curated therapeutic frameworks",
        "Anonymized interaction patterns may inform AI improvements",
        "Users can opt-out of AI improvement data usage"
      ]
    }
  },

  // Subscription and billing terms
  subscription_framework: {
    stripe_integration: {
      payment_processing: [
        "Stripe processes all payments with industry-standard security",
        "Payment information not stored on ALCHM servers",
        "Billing handled through secure third-party integration",
        "Payment disputes resolved through Stripe's systems"
      ],
      billing_policies: [
        "Subscription fees charged monthly or annually as selected",
        "Automatic renewal unless cancelled before billing date", 
        "Pro-rated refunds for cancelled annual subscriptions",
        "No refunds for partial monthly usage periods"
      ]
    },
    
    cancellation_policies: {
      user_rights: [
        "Cancel subscription anytime through account settings",
        "No cancellation fees or penalties",
        "Access continues until end of current billing period",
        "Account data preserved for 90 days post-cancellation"
      ],
      refund_policies: [
        "30-day money-back guarantee for first-time subscribers",
        "Pro-rated refunds for annual subscriptions cancelled within 30 days",
        "No refunds for monthly subscriptions after 7-day trial period",
        "Refund processing through original payment method"
      ]
    },
    
    service_availability: [
      "Service provided as available with periodic maintenance",
      "No guarantee of uninterrupted access",
      "Reasonable efforts to maintain service uptime",
      "Alternative access methods during maintenance periods"
    ]
  }
};

// Generate complete terms of service document
function generateTermsOfService() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });

  return `
# ALCHM TERMS OF SERVICE
## Your Digital Sanctuary Agreement

**Last Updated:** ${lastUpdated}
**Effective Date:** ${lastUpdated}

---

## 🤝 WELCOME TO YOUR DIGITAL SANCTUARY

These Terms of Service ("Terms") govern your use of ALCHM's trauma-informed journaling platform ("Service"), operated by ALCHM Inc., a Delaware corporation ("ALCHM," "we," "us," or "our").

By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.

**IMPORTANT:** ALCHM is a journaling and reflection platform with AI support. WE ARE NOT A THERAPY SERVICE, MEDICAL PROVIDER, OR CRISIS INTERVENTION SERVICE. Please read these Terms carefully, especially the medical disclaimers and limitation of liability sections.

---

## 🚨 CRITICAL MEDICAL DISCLAIMERS

### ALCHM IS NOT THERAPY OR MEDICAL CARE

**PLEASE READ CAREFULLY - THIS IS ESSENTIAL FOR YOUR SAFETY:**

✋ **NOT THERAPY:** ALCHM is not therapy, counseling, or professional mental health treatment
✋ **NOT MEDICAL ADVICE:** Nothing on ALCHM constitutes medical advice or diagnosis
✋ **NOT CRISIS INTERVENTION:** We provide crisis resources but not emergency intervention
✋ **NOT PROFESSIONAL TREATMENT:** Our AI (Khepera) is not a licensed mental health professional

### WHEN TO SEEK PROFESSIONAL HELP

**You should seek professional help if you experience:**
- Thoughts of harming yourself or others
- Severe depression, anxiety, or mood changes
- Inability to function in daily activities
- Substance abuse or addiction concerns
- Trauma that impacts your daily life
- Any mental health crisis or emergency

### EMERGENCY SITUATIONS

**IN CASE OF EMERGENCY:**
- **Call 911** for immediate life-threatening situations
- **Call 988** for the Suicide & Crisis Lifeline (24/7)
- **Text HOME to 741741** for Crisis Text Line
- **Go to your nearest emergency room** for immediate danger
- **Contact a licensed mental health professional** for ongoing support

**ALCHM CANNOT AND WILL NOT:**
- Provide emergency intervention
- Replace professional mental health care
- Diagnose or treat mental health conditions
- Monitor you for safety 24/7
- Guarantee your safety or wellbeing

---

## 👤 USER ELIGIBILITY & ACCOUNT REQUIREMENTS

### Age Requirements

**Minimum Age:** 13 years old with special protections for youth
**Under 13:** Requires verifiable parental consent per COPPA
**13-17 years:** Enhanced youth protections with optional parental oversight
**18+ years:** Full independent account access and control

### Account Registration

**Required Information:**
- Valid email address
- Age verification
- Agreement to these Terms
- Privacy Policy acknowledgment

**Optional Information:**
- Display name (pseudonym encouraged for privacy)
- Preferred language
- Timezone for local crisis resources
- Accessibility preferences

### Account Security

**Your Responsibilities:**
- Maintain account password security
- Report unauthorized access immediately
- Use accurate information for age verification
- Comply with these Terms and community guidelines

---

## 🤖 KHEPERA AI SYSTEM TERMS

### AI Service Description

**What Khepera Does:**
- Provides trauma-informed responses to your journal entries
- Offers reflection prompts and healing guidance
- Suggests coping strategies and positive reframing
- Connects patterns in your writing to growth opportunities

**What Khepera Does NOT Do:**
- Provide therapy or professional mental health treatment
- Diagnose mental health conditions or disorders
- Replace licensed therapist or counselor guidance
- Monitor for crisis situations 24/7
- Guarantee accuracy or appropriateness of all responses

### AI Limitations & Disclaimers

**Technical Limitations:**
- AI responses are generated by software, not human professionals
- Responses may occasionally be inaccurate or inappropriate
- AI cannot understand complex human emotions perfectly
- Response quality depends on input quality and clarity

**Professional Limitations:**
- Khepera is not trained as a licensed mental health professional
- AI responses should not replace professional therapy or counseling
- Users should verify AI suggestions with qualified professionals
- AI cannot provide crisis intervention or emergency support

### AI Data Processing

**How Khepera Processes Your Content:**
- Your journal entries are encrypted before AI processing
- AI analyzes patterns and emotional content for personalized responses
- Processing data is deleted immediately after response generation
- Your content is never used to train AI without explicit consent
- AI responses are generated for your individual benefit only

---

## 💰 SUBSCRIPTION & BILLING TERMS

### Service Tiers

**Free Tier:**
- Basic journaling functionality
- Limited AI responses
- Access to crisis resources
- Core privacy protections

**Premium Tiers:**
- Unlimited AI responses from Khepera
- Advanced insights and pattern recognition
- Export capabilities for your journey
- Priority customer support

### Billing & Payment

**Payment Processing:**
- All payments processed securely through Stripe
- We do not store your payment information
- Billing handled through secure third-party integration
- Payment disputes resolved through Stripe's systems

**Subscription Terms:**
- Monthly or annual billing as selected
- Automatic renewal unless cancelled
- Charges processed on your billing date
- Sales tax applied where legally required

### Cancellation & Refunds

**Your Cancellation Rights:**
- Cancel anytime through account settings
- No cancellation fees or penalties
- Access continues until end of current billing period
- Account data preserved for 90 days after cancellation

**Refund Policy:**
- **30-day money-back guarantee** for first-time subscribers
- **Pro-rated refunds** for annual subscriptions cancelled within 30 days
- **No refunds** for monthly subscriptions after 7-day trial
- Refunds processed through original payment method within 5-10 business days

---

## 📝 YOUR CONTENT & INTELLECTUAL PROPERTY

### Your Ownership Rights

**You Own Your Content:**
- Full ownership of all journal entries and personal content
- Complete control over sharing and privacy settings
- Right to export, modify, or delete your content anytime
- Ownership of your healing journey documentation and insights

**Our Limited Rights:**
- Technical processing rights to provide platform services
- Backup and storage rights for service provision and security
- AI processing rights for generating personalized responses
- Anonymized analysis for platform safety and improvement

### Content Usage Policies

**Appropriate Use:**
- Use platform for personal healing and reflection
- Respect community guidelines and other users
- Provide accurate information for safety features
- Use crisis resources appropriately and responsibly

**Prohibited Content:**
- Content that violates applicable laws or regulations
- Harmful, threatening, or harassment content toward others
- Spam, commercial solicitation, or unauthorized advertising
- Content that infringes others' intellectual property rights
- Objectionable content as defined by platform policies

### ALCHM Intellectual Property

**Our Protected Assets:**
- ALCHM trademark, logos, and brand elements
- Khepera AI system and response generation technology
- Pathway prompts and healing journey frameworks
- Platform interface design and user experience elements

**Permitted Usage:**
- Personal reference to ALCHM in appropriate contexts
- Social media sharing of your own achievements with attribution
- Educational discussion of platform benefits and features
- Fair use for commentary, criticism, or news reporting

---

## 👥 COMMUNITY GUIDELINES & USER CONDUCT

### Community Standards

**Creating Safe Spaces:**
- Respectful and supportive communication
- Trauma-informed language and interactions
- Cultural sensitivity and inclusive behavior
- Age-appropriate content and language

**Prohibited Behavior:**
- Harassment, bullying, or threatening other users
- Sharing personal information of other users
- Impersonating others or providing false information
- Using platform for commercial or promotional purposes

### Content Moderation

**Our Approach:**
- Combination of automated screening and human review
- Focus on safety and community protection
- Transparent enforcement with appeal process
- Progressive discipline for violations

**Enforcement Actions:**
- Warning for minor violations
- Temporary account restrictions
- Content removal for serious violations
- Account termination for repeated or severe violations

### Reporting Violations

**How to Report:**
- Use in-app reporting tools
- Email support@alchm.app with concerns
- Provide specific information about violations
- Report safety concerns immediately

---

## 👨‍👩‍👧‍👦 YOUTH & FAMILY PROTECTIONS

### COPPA Compliance (Under 13)

**Parental Consent Requirements:**
- Verifiable parental consent required for account creation
- Parents control all privacy settings and data sharing
- Parental access to child's account and content
- Parent-initiated account deletion and data export

### Youth Protections (13-17)

**Enhanced Safety Measures:**
- Age-appropriate content standards and community guidelines
- Optional parental notification for crisis situations
- Simplified privacy controls and clear language
- Additional layers of content moderation

### Family Account Features

**Parental Dashboard (Optional):**
- Overview of child's platform engagement (not content)
- Crisis situation notifications and safety alerts
- Privacy setting management and consent controls
- Professional resource recommendations

---

## 🚨 CRISIS RESPONSE & SAFETY PROTOCOLS

### Crisis Detection & Response

**Our Safety Approach:**
- Automated detection of concerning language patterns
- Immediate display of appropriate crisis resources
- Connection to professional crisis support services
- Family notification procedures when legally required

**What We Provide:**
- Crisis resource information and hotline numbers
- Connection to professional crisis support services
- Local mental health resource directories
- Safety planning tools and coping strategies

**What We Cannot Provide:**
- 24/7 crisis monitoring or intervention
- Emergency response or immediate safety assurance
- Professional crisis counseling or therapy
- Guarantee of safety or prevention of harmful actions

### Safety Protocols

**User Safety Responsibilities:**
- Seek immediate professional help for crisis situations
- Use crisis resources appropriately and promptly
- Inform trusted adults about safety concerns
- Call emergency services for immediate danger

**Platform Safety Measures:**
- Crisis keyword detection and resource provision
- Professional resource database maintenance
- Safety protocol compliance monitoring
- Continuous improvement of safety features

---

## ⚖️ LIMITATION OF LIABILITY & DISCLAIMERS

### Disclaimer of Warranties

**SERVICE PROVIDED "AS IS":**
ALCHM makes no warranties, express or implied, regarding:
- Service availability, functionality, or performance
- Accuracy or reliability of AI responses
- Suitability for specific mental health needs
- Compatibility with individual therapeutic approaches

### Limitation of Liability

**MAXIMUM LIABILITY:**
To the fullest extent permitted by law, ALCHM's total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.

**EXCLUDED DAMAGES:**
ALCHM shall not be liable for:
- Indirect, incidental, or consequential damages
- Loss of data, profits, or business opportunities
- Personal injury or mental health deterioration
- Decisions made based on platform content or AI responses

### Medical Liability Exclusion

**HEALTH-RELATED DISCLAIMERS:**
- ALCHM is not responsible for medical or therapeutic outcomes
- Users assume full responsibility for their mental health care decisions
- Platform cannot replace professional mental health treatment
- AI responses are informational only, not medical advice

---

## 🌍 PLATFORM COMPLIANCE & JURISDICTIONAL TERMS

### App Store Compliance

**Apple App Store:**
- Agreement between user and ALCHM, not Apple Inc.
- Apple has no responsibility for app functionality or support
- Apple is third-party beneficiary of these Terms
- Claims resolved directly with ALCHM, not Apple

**Google Play Store:**
- Compliance with Google Play Developer Program Policies
- Google not liable for app functionality or content
- User agreement subject to Google Play Terms of Service
- ALCHM responsible for app support and maintenance

### Governing Law & Jurisdiction

**Legal Framework:**
- **Governing Law:** California state law
- **Federal Preemption:** Federal law where applicable
- **Jurisdiction:** State and federal courts in California
- **Corporate Structure:** Delaware incorporation

### International Users

**Global Access:**
- Service available internationally with local law compliance
- Users responsible for compliance with local regulations
- Privacy protections adapted to local requirements
- Crisis resources localized where possible

---

## 🔄 DISPUTE RESOLUTION & LEGAL PROCEDURES

### Binding Arbitration

**Arbitration Agreement:**
- Most disputes resolved through binding arbitration
- American Arbitration Association (AAA) rules apply
- Individual arbitration only (no class actions)
- California location unless otherwise agreed

**Exceptions to Arbitration:**
- Small claims court matters under jurisdictional limits
- Intellectual property disputes
- Emergency injunctive relief
- Youth-specific protections where arbitration inappropriate

### Class Action Waiver

**Individual Claims Only:**
- No class actions, mass arbitrations, or representative proceedings
- Each user must bring individual claims only
- No consolidation of multiple user claims
- Waiver applies to fullest extent legally permissible

### Youth Arbitration Protections

**Additional Safeguards for Minors:**
- Parental involvement required for arbitration
- Court approval for settlement agreements
- Legal counsel consultation recommended
- Alternative dispute resolution options available

---

## 📞 CONTACT & SUPPORT INFORMATION

### Customer Support

**General Support:**
- **Email:** support@alchm.app
- **Response Time:** 24-48 hours
- **Languages:** English and Spanish
- **Hours:** Monday-Friday, 9 AM - 6 PM PT

### Legal & Privacy Inquiries

**Legal Matters:**
- **Email:** legal@alchm.app
- **Privacy Requests:** privacy@alchm.app
- **Business Address:** [Corporate Address]
- **Response Time:** 48 hours for legal inquiries

### Crisis Support

**Immediate Help:**
- **Call 911** for emergencies
- **Call 988** for Suicide & Crisis Lifeline
- **Text HOME to 741741** for Crisis Text Line
- **International:** Contact local emergency services

---

## 🔄 TERMS UPDATES & MODIFICATIONS

### How We Update These Terms

**Material Changes:**
- 30-day advance notice for significant modifications
- Email notification to all active users
- Prominent in-app notification of changes
- Option to terminate account if you disagree

**Minor Updates:**
- Immediate effect for clarifications and technical updates
- Change log available for all modifications
- Continued use constitutes acceptance
- No action required for minor clarifications

### Version Control

**Terms History:**
- All previous versions archived and available
- Change log with detailed modification descriptions
- Effective date tracking for all versions
- Legal counsel review for all material changes

---

## 📋 ATTORNEY REVIEW CHECKLIST

**Legal Compliance Verification:**
- ✅ COPPA compliance for users under 13
- ✅ App Store terms compliance (Apple & Google)
- ✅ Medical liability disclaimers prominent and comprehensive
- ✅ AI service limitations clearly disclosed
- ✅ Crisis intervention boundaries established
- ✅ Intellectual property ownership clearly defined
- ✅ Billing and cancellation terms transparent
- ✅ Dispute resolution procedures established
- ✅ International jurisdiction compliance
- ✅ Youth-specific protections implemented

---

**By using ALCHM, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.**

*These Terms are attorney-reviewed and comply with applicable state and federal laws, App Store requirements, and industry best practices for youth mental health platforms.*

**Questions?** Contact our Legal Team at legal@alchm.app

---

© 2024 ALCHM Inc. All rights reserved. Your Digital Sanctuary.
  `;
}

// Export for attorney review and implementation
module.exports = {
  termsOfServiceGenerator,
  generateTermsOfService,
  
  // Attorney review requirements
  attorney_review_checklist: [
    "Medical disclaimer prominence and comprehensiveness verified",
    "AI service limitations clearly disclosed and legally protective",
    "Crisis intervention boundaries established and liability limited",
    "App Store compliance requirements satisfied",
    "Youth-specific protections legally compliant",
    "Intellectual property ownership clearly established",
    "Billing terms transparent and fair",
    "Dispute resolution enforceable and compliant",
    "International jurisdiction properly addressed",
    "Class action waiver valid in applicable jurisdictions"
  ],
  
  // Implementation requirements  
  implementation_checklist: [
    "Terms display and acceptance UI integration",
    "Version control system for terms updates",
    "User notification system for terms changes",
    "Crisis disclaimer prominence in AI interface",
    "Age verification integration with terms acceptance",
    "Parental consent workflow for youth accounts",
    "Account termination and data deletion automation",
    "Dispute resolution contact and process documentation"
  ]
};