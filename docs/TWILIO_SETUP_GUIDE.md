# 📱 ALCHM Twilio SMS/Voice Integration Setup

## 🎯 **TWILIO CONFIGURATION OVERVIEW**

**Purpose**: Enable multi-channel crisis alert delivery via SMS and voice calls for the professional crisis response team.

**Capabilities**: 
- SMS alerts to crisis counselors
- Voice call escalations
- Backup delivery systems
- Emergency service coordination

---

## 🔧 **TWILIO ACCOUNT SETUP**

### **1. Create Twilio Account**
```bash
# Visit https://www.twilio.com/console
# Sign up for Twilio account
# Verify your phone number and email
```

### **2. Get Account Credentials**
```javascript
// From Twilio Console Dashboard
const twilioCredentials = {
  accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // Account SID
  authToken: 'your_auth_token_here',             // Auth Token
  crisisNumber: '+1234567890',                   // Crisis alert phone number
  voiceNumber: '+1234567891'                     // Voice call phone number
};
```

### **3. Purchase Phone Numbers**
```bash
# In Twilio Console:
# 1. Go to Phone Numbers > Manage > Buy a number
# 2. Purchase 2 numbers:
#    - One for SMS crisis alerts
#    - One for voice call escalations
# 3. Configure webhook endpoints (optional)
```

---

## ⚙️ **FIREBASE CONFIGURATION**

### **Set Firebase Config Variables**
```bash
# Set Twilio credentials in Firebase Functions config
firebase functions:config:set twilio.account_sid="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
firebase functions:config:set twilio.auth_token="your_auth_token_here"
firebase functions:config:set twilio.crisis_number="+1234567890"
firebase functions:config:set twilio.voice_number="+1234567891"

# Deploy the updated config
firebase deploy --only functions:config
```

### **Environment Variables (Alternative)**
```bash
# For local development, create .env file in functions/
echo "TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" >> functions/.env
echo "TWILIO_AUTH_TOKEN=your_auth_token_here" >> functions/.env
echo "TWILIO_CRISIS_NUMBER=+1234567890" >> functions/.env
echo "TWILIO_VOICE_NUMBER=+1234567891" >> functions/.env
```

---

## 📞 **SMS ALERT CONFIGURATION**

### **Crisis Alert SMS Format**
```javascript
// Example SMS sent to crisis counselors
const crisisAlertSMS = `🚨 ALCHM CRISIS ALERT - IMMEDIATE

Participant: abc12345...
Confidence: 95%
Cultural: LGBTQ+, Youth
Triggers: hopeless, suicidal ideation

Time: ${timestamp}

RESPOND WITHIN 2 MINUTES

Dashboard: https://crisis.alchm.app/alert/xyz789
Acknowledge: Reply ACK to this message

Professional: Dr. Sarah Johnson (crisis_counselor)`;
```

### **SMS Delivery Features**
- **Immediate Delivery**: <5 seconds for critical alerts
- **Backup Numbers**: Automatic failover to backup phones
- **Cultural Context**: Relevant cultural information included
- **Quick Acknowledgment**: Reply "ACK" to acknowledge
- **Direct Dashboard Link**: One-tap access to crisis dashboard

### **Professional Phone Number Management**
```javascript
// Add professional team phone numbers
const professionalTeam = [
  {
    id: 'counselor_1',
    name: 'Dr. Sarah Johnson',
    role: 'crisis_counselor',
    contactMethods: {
      primaryPhone: '+1555123456',
      backupPhone: '+1555123457',  // Optional backup
      sms: '+1555123456',          // SMS-capable number
      email: 'sarah@example.com'
    },
    culturalCompetencies: ['lgbtq+', 'youth'],
    availability: {
      currentStatus: 'available',
      maxConcurrentCases: 3,
      currentCaseCount: 1
    }
  }
];

// Store in Firestore collection: 'crisis_professionals'
```

---

## 📞 **VOICE CALL ESCALATION**

### **Voice Call Configuration**
```javascript
// Voice call TwiML for escalation
const escalationVoiceMessage = `
<Response>
  <Say voice="alice" rate="slow">
    This is an emergency alert from ALCHM Crisis System. 
    A participant requires immediate crisis intervention. 
    Alert ID: ${alertId.substring(0, 8)}. 
    Risk level: ${riskLevel}. 
    Please respond immediately by accessing the crisis dashboard 
    or calling the crisis line. This message will repeat twice.
  </Say>
  <Pause length="2"/>
  <Say voice="alice" rate="slow">
    This is an emergency alert from ALCHM Crisis System. 
    A participant requires immediate crisis intervention. 
    Alert ID: ${alertId.substring(0, 8)}. 
    Risk level: ${riskLevel}. 
    Please respond immediately.
  </Say>
  <Gather numDigits="1" timeout="30">
    <Say voice="alice">Press any key to acknowledge this alert.</Say>
  </Gather>
</Response>`;
```

### **Escalation Trigger Conditions**
- **Level 1 Escalation**: No SMS response in 2 minutes (immediate risk)
- **Level 2 Escalation**: No response from backup team in 5 minutes
- **Level 3 Emergency**: No supervisory response in 10 minutes

---

## 🔒 **SECURITY & COMPLIANCE**

### **Phone Number Verification**
```javascript
// Verify all professional phone numbers before adding
const verifyPhoneNumber = async (phoneNumber, professionalId) => {
  try {
    // Send verification code via SMS
    const verification = await twilioClient.verify.services(VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: phoneNumber,
        channel: 'sms'
      });
    
    console.log(`Verification sent to ${phoneNumber} for ${professionalId}`);
    return verification.sid;
  } catch (error) {
    console.error('Phone verification failed:', error);
    throw error;
  }
};
```

### **HIPAA Compliance Considerations**
- **No PHI in SMS**: Only participant IDs (first 8 characters), never full names
- **Encrypted Storage**: All phone numbers encrypted in Firestore
- **Audit Trail**: All SMS/voice communications logged for compliance
- **Secure Transmission**: Twilio provides end-to-end encryption
- **Professional Authentication**: Verify professional identity before adding numbers

### **Data Retention Policy**
```javascript
// Automatic cleanup of communication logs
const cleanupCommunicationLogs = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    // Delete SMS logs older than 90 days (adjust per compliance requirements)
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    
    await db.collection('sms_logs')
      .where('timestamp', '<', cutoff)
      .get()
      .then(snapshot => {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
      });
  });
```

---

## 📊 **MONITORING & ANALYTICS**

### **SMS Delivery Tracking**
```javascript
// Monitor SMS delivery success rates
const trackSMSDelivery = {
  deliveryRate: '>99%',           // Target delivery success
  averageDeliveryTime: '<5s',     // Time from trigger to delivery
  failureRate: '<1%',             // Acceptable failure rate
  backupActivation: '<2%'         // Backup number usage rate
};

// Real-time monitoring
const monitorSMSHealth = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    // Check SMS delivery rates
    const recentSMS = await db.collection('sms_delivery_logs')
      .where('timestamp', '>', new Date(Date.now() - 5 * 60 * 1000))
      .get();
    
    const deliveryRate = calculateDeliveryRate(recentSMS);
    
    if (deliveryRate < 0.95) {
      await alertTechnicalTeam('SMS delivery rate below 95%', deliveryRate);
    }
  });
```

### **Voice Call Analytics**
```javascript
const voiceCallMetrics = {
  connectionRate: '>90%',         // Calls that connect successfully
  acknowledgmentRate: '>80%',     // Calls acknowledged by professionals
  averageCallDuration: '30-60s',  // Optimal call length
  escalationEffectiveness: '>85%' // Calls that result in crisis response
};
```

---

## 🧪 **TESTING PROCEDURES**

### **SMS Testing Script**
```javascript
// Test SMS delivery to all professional team members
const testSMSDelivery = async () => {
  const testMessage = `🧪 ALCHM CRISIS SYSTEM TEST

This is a test of the ALCHM crisis alert system.
Timestamp: ${new Date().toISOString()}
Professional: [PROFESSIONAL_NAME]

Please reply "TEST-ACK" to confirm receipt.
Dashboard: https://crisis.alchm.app/test

This is a test message - no action required.`;

  const professionals = await getCrisisProfessionals();
  
  for (const professional of professionals) {
    if (professional.contactMethods.sms) {
      try {
        await sendTestSMS(professional, testMessage);
        console.log(`Test SMS sent to ${professional.name}`);
      } catch (error) {
        console.error(`Test SMS failed for ${professional.name}:`, error);
      }
    }
  }
};

// Run monthly SMS tests
export const monthlySystemTest = functions.pubsub
  .schedule('0 9 1 * *') // 9 AM on 1st of each month
  .timeZone('America/New_York')
  .onRun(async () => {
    await testSMSDelivery();
    await testVoiceCallSystem();
    await generateTestReport();
  });
```

### **Voice Call Testing**
```javascript
const testVoiceCallSystem = async () => {
  // Test voice calls to supervisory team (with advance notice)
  const testVoiceMessage = `
    <Response>
      <Say voice="alice">
        This is a scheduled test of the ALCHM crisis escalation voice system. 
        This is only a test. No action is required. 
        Press any key to acknowledge this test call.
      </Say>
      <Gather numDigits="1" timeout="15">
        <Say voice="alice">Press any key to complete this test.</Say>
      </Gather>
    </Response>
  `;
  
  // Implementation would call supervisory team with test message
};
```

---

## 🚨 **EMERGENCY FALLBACK PROCEDURES**

### **Twilio Service Outage Protocol**
```javascript
const twilioFallbackProcedures = {
  primary: 'Twilio SMS/Voice service',
  fallback1: 'Alternative SMS provider (AWS SNS)',
  fallback2: 'Email alerts with high priority',
  fallback3: 'Direct dashboard notifications',
  emergency: 'Manual phone tree activation'
};

// Automatic fallback detection
const detectTwilioOutage = async () => {
  const recent_failures = await countRecentSMSFailures();
  
  if (recent_failures.rate > 0.5) {
    console.log('🚨 TWILIO OUTAGE DETECTED - Activating fallback systems');
    await activateFallbackCommunication();
  }
};
```

### **Backup Communication Systems**
```javascript
// AWS SNS as backup SMS provider
const backupSMSProvider = {
  provider: 'AWS SNS',
  setup: 'Configure AWS credentials in Firebase Functions',
  activation: 'Automatic when Twilio failure rate >50%',
  monitoring: 'Switch back to Twilio when service restored'
};

// Email emergency alerts
const emailFallback = {
  provider: 'SendGrid/Gmail API',
  use_case: 'When SMS completely unavailable',
  priority: 'High priority emergency emails',
  format: 'HTML emails with crisis dashboard links'
};
```

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Pre-Deployment Setup**
- [ ] Create Twilio account and verify identity
- [ ] Purchase 2 phone numbers (SMS + Voice)
- [ ] Set Firebase Functions config variables
- [ ] Verify professional team phone numbers
- [ ] Test SMS delivery to all team members
- [ ] Configure voice call TwiML messages
- [ ] Set up backup communication systems
- [ ] Implement delivery monitoring and alerts

### **Post-Deployment Validation**
- [ ] Test crisis alert SMS delivery (<5 seconds)
- [ ] Verify voice call escalation system
- [ ] Confirm backup number failover works
- [ ] Test acknowledgment reply system ("ACK")
- [ ] Validate cultural context SMS formatting
- [ ] Verify HIPAA compliance (no PHI in messages)
- [ ] Test emergency escalation voice calls
- [ ] Monitor delivery rates and system health

### **Ongoing Maintenance**
- [ ] Monthly system testing with all professionals
- [ ] Quarterly phone number verification
- [ ] Review and update SMS message templates
- [ ] Monitor Twilio costs and usage patterns
- [ ] Update professional team contact information
- [ ] Test backup systems quarterly
- [ ] Review compliance and audit logs

This Twilio integration provides robust, HIPAA-compliant crisis communication capabilities essential for ALCHM's professional crisis response system.