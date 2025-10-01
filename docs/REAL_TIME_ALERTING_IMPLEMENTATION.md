# 🚨 ALCHM Real-Time Crisis Alerting System Implementation

## 🎯 **ALERTING SYSTEM ARCHITECTURE**

**Mission**: Provide instant, reliable, multi-channel alerts for crisis interventions with professional-grade escalation protocols and cultural responsiveness.

**Technology Stack**: Firebase Cloud Functions + Twilio + PagerDuty + Custom Dashboard + Mobile Apps

---

## ⚡ **MULTI-CHANNEL ALERT SYSTEM**

### **Alert Delivery Architecture**
```typescript
interface AlertDeliverySystem {
  // Primary alert channels (immediate delivery)
  primaryChannels: {
    sms: {
      provider: 'Twilio',
      deliveryTime: '<5 seconds',
      reliability: '99.95%',
      fallback: 'Alternative SMS provider'
    };
    
    mobileApp: {
      provider: 'Firebase Cloud Messaging',
      deliveryTime: '<2 seconds',
      reliability: '99.9%',
      fallback: 'SMS backup'
    };
    
    dashboard: {
      provider: 'WebSocket + Firebase Realtime DB',
      deliveryTime: '<1 second',
      reliability: '99.99%',
      fallback: 'HTTP polling'
    };
  };
  
  // Secondary alert channels (escalation)
  secondaryChannels: {
    voice: {
      provider: 'Twilio Voice',
      deliveryTime: '<10 seconds',
      reliability: '99.9%',
      trigger: 'No response to primary alerts in 2 minutes'
    };
    
    email: {
      provider: 'SendGrid',
      deliveryTime: '<30 seconds',
      reliability: '99.95%',
      trigger: 'Documentation and backup notification'
    };
    
    pagerDuty: {
      provider: 'PagerDuty',
      deliveryTime: '<15 seconds',
      reliability: '99.99%',
      trigger: 'System failure or no professional response'
    };
  };
  
  // Emergency escalation channels
  emergencyChannels: {
    emergencyServices: {
      provider: 'Direct 911 integration',
      deliveryTime: '<30 seconds',
      trigger: 'Immediate danger + no professional response in 5 minutes'
    };
    
    hospitalNetwork: {
      provider: 'Hospital partnership system',
      deliveryTime: '<60 seconds',
      trigger: 'Medical emergency or hospitalization needed'
    };
  };
}
```

### **Crisis Alert Classification & Routing**
```typescript
enum CrisisAlertType {
  IMMEDIATE_SUICIDE_RISK = 'immediate_suicide_risk',
  ACTIVE_SELF_HARM = 'active_self_harm',
  SEVERE_PSYCHOSIS = 'severe_psychosis',
  SUBSTANCE_OVERDOSE = 'substance_overdose',
  HIGH_RISK_IDEATION = 'high_risk_ideation',
  TRAUMA_FLASHBACK = 'trauma_flashback',
  PANIC_CRISIS = 'panic_crisis',
  MODERATE_CONCERN = 'moderate_concern'
}

interface CrisisAlert {
  id: string;
  type: CrisisAlertType;
  participantId: string;
  riskLevel: 'immediate' | 'high' | 'moderate' | 'mild';
  confidence: number;
  triggers: string[];
  culturalContext: string[];
  timestamp: Date;
  
  // Alert routing configuration
  routing: {
    primaryRecipients: ProfessionalRecipient[];
    escalationRecipients: ProfessionalRecipient[];
    culturalLiaisons: CulturalLiaison[];
    emergencyContacts: EmergencyContact[];
  };
  
  // Multi-channel delivery tracking
  delivery: {
    sms: AlertDeliveryStatus;
    mobileApp: AlertDeliveryStatus;
    dashboard: AlertDeliveryStatus;
    voice: AlertDeliveryStatus;
    email: AlertDeliveryStatus;
  };
  
  // Response tracking
  response: {
    acknowledged: boolean;
    acknowledgedBy: string;
    acknowledgedAt: Date;
    responseTime: number;
    professionalAssigned: string;
    interventionStarted: boolean;
    interventionNotes: string;
  };
}

interface ProfessionalRecipient {
  id: string;
  name: string;
  role: 'crisis_counselor' | 'clinical_director' | 'cultural_liaison';
  credentials: string[];
  specializations: string[];
  contactMethods: {
    primaryPhone: string;
    backupPhone: string;
    sms: string;
    email: string;
    mobileAppId: string;
  };
  availability: {
    schedule: AvailabilitySchedule;
    currentStatus: 'available' | 'busy' | 'unavailable';
    responseCapacity: number;
  };
}
```

---

## 🔧 **FIREBASE CLOUD FUNCTIONS IMPLEMENTATION**

### **Crisis Alert Processing Engine**
```typescript
// functions/src/crisis-alert-processor.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Twilio } from 'twilio';
import fetch from 'node-fetch';

export const processCrisisAlert = functions.firestore
  .document('crisis_alerts/{alertId}')
  .onCreate(async (snap, context) => {
    const alert = snap.data() as CrisisAlert;
    const alertId = context.params.alertId;
    
    console.log(`🚨 CRISIS ALERT TRIGGERED: ${alertId}`, {
      type: alert.type,
      riskLevel: alert.riskLevel,
      confidence: alert.confidence,
      participantId: alert.participantId.substring(0, 8)
    });
    
    try {
      // Initialize alert delivery system
      const deliveryResults = await Promise.allSettled([
        sendSMSAlerts(alert),
        sendMobileAppAlerts(alert),
        updateRealtimeDashboard(alert),
        sendEmailNotifications(alert),
        logAlertAnalytics(alert)
      ]);
      
      // Check for delivery failures
      const failures = deliveryResults
        .map((result, index) => ({ index, result }))
        .filter(({ result }) => result.status === 'rejected');
        
      if (failures.length > 0) {
        console.error('Alert delivery failures:', failures);
        await activateBackupDelivery(alert, failures);
      }
      
      // Set escalation timer based on risk level
      const escalationDelay = getEscalationDelay(alert.riskLevel);
      await scheduleEscalation(alertId, escalationDelay);
      
      // Update alert status
      await snap.ref.update({
        'delivery.initiated': true,
        'delivery.initiatedAt': admin.firestore.FieldValue.serverTimestamp(),
        'delivery.deliveryResults': deliveryResults.map(r => ({
          status: r.status,
          reason: r.status === 'rejected' ? r.reason : null
        }))
      });
      
    } catch (error) {
      console.error('Critical error in crisis alert processing:', error);
      
      // Emergency fallback - direct escalation
      await emergencyEscalation(alert, error);
    }
  });

async function sendSMSAlerts(alert: CrisisAlert): Promise<SMSDeliveryResult[]> {
  const twilio = new Twilio(
    functions.config().twilio.account_sid,
    functions.config().twilio.auth_token
  );
  
  // Get appropriate recipients based on alert type and cultural context
  const recipients = await getAlertRecipients(alert);
  
  const smsPromises = recipients.map(async (recipient) => {
    const message = formatCrisisAlertMessage(alert, recipient);
    
    try {
      const result = await twilio.messages.create({
        body: message,
        from: functions.config().twilio.crisis_number,
        to: recipient.contactMethods.sms
      });
      
      return {
        recipientId: recipient.id,
        messageId: result.sid,
        status: 'sent',
        sentAt: new Date()
      };
    } catch (error) {
      console.error(`SMS delivery failed for ${recipient.id}:`, error);
      return {
        recipientId: recipient.id,
        status: 'failed',
        error: error.message,
        sentAt: new Date()
      };
    }
  });
  
  return Promise.all(smsPromises);
}

function formatCrisisAlertMessage(alert: CrisisAlert, recipient: ProfessionalRecipient): string {
  const severity = alert.riskLevel.toUpperCase();
  const participantId = alert.participantId.substring(0, 8);
  const confidence = Math.round(alert.confidence * 100);
  
  const culturalContext = alert.culturalContext.length > 0 
    ? `\nCultural: ${alert.culturalContext.join(', ')}` 
    : '';
    
  const triggers = alert.triggers.length > 0 
    ? `\nTriggers: ${alert.triggers.slice(0, 3).join(', ')}` 
    : '';
  
  return `🚨 ALCHM CRISIS ALERT - ${severity}
Participant: ${participantId}...
Confidence: ${confidence}%${culturalContext}${triggers}
Time: ${alert.timestamp.toLocaleString()}

RESPOND IMMEDIATELY to acknowledge.
Dashboard: https://crisis.alchm.app/alert/${alert.id}

Professional: ${recipient.name}`;
}

async function sendMobileAppAlerts(alert: CrisisAlert): Promise<void> {
  const recipients = await getAlertRecipients(alert);
  
  // Send push notifications to professional team mobile apps
  const notifications = recipients.map(recipient => ({
    token: recipient.contactMethods.mobileAppId,
    notification: {
      title: `🚨 ${alert.riskLevel.toUpperCase()} Crisis Alert`,
      body: `Participant needs immediate attention. Confidence: ${Math.round(alert.confidence * 100)}%`,
    },
    data: {
      alertId: alert.id,
      alertType: alert.type,
      riskLevel: alert.riskLevel,
      participantId: alert.participantId,
      culturalContext: JSON.stringify(alert.culturalContext),
      action: 'crisis_response'
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'crisis_alerts',
        priority: 'max',
        defaultSound: true,
        defaultVibrateTimings: true
      }
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: `🚨 ${alert.riskLevel.toUpperCase()} Crisis Alert`,
            body: `Immediate response needed. Tap to respond.`
          },
          badge: 1,
          sound: 'critical-alert.wav',
          category: 'CRISIS_ALERT'
        }
      }
    }
  }));
  
  // Send all notifications
  const results = await admin.messaging().sendAll(notifications);
  
  // Log delivery results
  console.log(`Mobile app alerts sent: ${results.successCount}/${notifications.length}`);
  if (results.failureCount > 0) {
    console.error('Mobile app alert failures:', results.responses
      .filter(response => !response.success)
      .map(response => response.error)
    );
  }
}
```

### **Escalation Management System**
```typescript
// Automatic escalation system
export const processAlertEscalation = functions.pubsub
  .topic('crisis-alert-escalation')
  .onPublish(async (message) => {
    const { alertId, escalationLevel } = message.json;
    
    const alertDoc = await admin.firestore()
      .collection('crisis_alerts')
      .doc(alertId)
      .get();
      
    if (!alertDoc.exists) {
      console.error(`Alert ${alertId} not found for escalation`);
      return;
    }
    
    const alert = alertDoc.data() as CrisisAlert;
    
    // Check if alert has been acknowledged
    if (alert.response.acknowledged) {
      console.log(`Alert ${alertId} already acknowledged, skipping escalation`);
      return;
    }
    
    console.log(`Escalating alert ${alertId} to level ${escalationLevel}`);
    
    switch (escalationLevel) {
      case 1:
        await firstLevelEscalation(alert);
        break;
      case 2:
        await secondLevelEscalation(alert);
        break;
      case 3:
        await emergencyEscalation(alert);
        break;
      default:
        console.error(`Unknown escalation level: ${escalationLevel}`);
    }
  });

async function firstLevelEscalation(alert: CrisisAlert): Promise<void> {
  console.log('🔴 FIRST LEVEL ESCALATION - Backup team activation');
  
  // Activate backup crisis counselor
  const backupTeam = await getBackupCrisisTeam();
  
  // Send urgent notifications to backup team
  await Promise.all([
    sendUrgentSMSAlerts(alert, backupTeam, 'ESCALATION: Primary team non-responsive'),
    sendVoiceAlerts(alert, backupTeam),
    updateDashboardWithEscalation(alert, 1),
    sendPagerDutyAlert(alert, 'low')
  ]);
  
  // Schedule second level escalation
  await scheduleEscalation(alert.id, 300000); // 5 minutes
}

async function secondLevelEscalation(alert: CrisisAlert): Promise<void> {
  console.log('🟠 SECOND LEVEL ESCALATION - Clinical director activation');
  
  // Activate clinical director and supervisory team
  const supervisoryTeam = await getSupervisoryTeam();
  
  await Promise.all([
    sendUrgentSMSAlerts(alert, supervisoryTeam, 'CRITICAL ESCALATION: No response to crisis'),
    sendVoiceAlerts(alert, supervisoryTeam),
    updateDashboardWithEscalation(alert, 2),
    sendPagerDutyAlert(alert, 'high'),
    notifyEmergencyContacts(alert, 'standby')
  ]);
  
  // Schedule emergency escalation
  await scheduleEscalation(alert.id, 300000); // 5 minutes
}

async function emergencyEscalation(alert: CrisisAlert, error?: any): Promise<void> {
  console.log('🚨 EMERGENCY ESCALATION - Emergency services activation');
  
  // This is the highest level of escalation
  const emergencyTeam = await getEmergencyTeam();
  
  await Promise.all([
    sendEmergencyServiceAlert(alert),
    notifyEmergencyContacts(alert, 'immediate'),
    sendPagerDutyAlert(alert, 'critical'),
    updateDashboardWithEscalation(alert, 3),
    logEmergencyEscalation(alert, error)
  ]);
  
  // Activate all available backup systems
  await activateAllBackupSystems(alert);
}

async function sendVoiceAlerts(alert: CrisisAlert, recipients: ProfessionalRecipient[]): Promise<void> {
  const twilio = new Twilio(
    functions.config().twilio.account_sid,
    functions.config().twilio.auth_token
  );
  
  const voiceMessage = `This is an emergency alert from ALCHM Crisis System. 
    A participant requires immediate crisis intervention. 
    Alert ID: ${alert.id.substring(0, 8)}. 
    Risk level: ${alert.riskLevel}. 
    Please respond immediately by accessing the crisis dashboard 
    or calling the crisis line. This message will repeat twice.`;
  
  for (const recipient of recipients) {
    try {
      await twilio.calls.create({
        twiml: `
          <Response>
            <Say voice="alice" rate="slow">${voiceMessage}</Say>
            <Pause length="2"/>
            <Say voice="alice" rate="slow">${voiceMessage}</Say>
            <Pause length="2"/>
            <Say voice="alice">Press any key to acknowledge this alert.</Say>
            <Gather numDigits="1" timeout="30">
              <Say voice="alice">Press any key to acknowledge.</Say>
            </Gather>
          </Response>
        `,
        to: recipient.contactMethods.primaryPhone,
        from: functions.config().twilio.crisis_voice_number
      });
    } catch (error) {
      console.error(`Voice alert failed for ${recipient.id}:`, error);
    }
  }
}
```

---

## 📱 **PROFESSIONAL TEAM MOBILE APP**

### **Crisis Response Mobile Interface**
```typescript
// Mobile app for professional crisis team
import React, { useEffect, useState } from 'react';
import { Alert, Vibration } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

interface CrisisResponseApp {
  // Real-time crisis alerts
  activeCrisisAlerts: CrisisAlert[];
  
  // Professional status
  professionalStatus: 'available' | 'responding' | 'unavailable';
  
  // Response capabilities
  responseActions: {
    acknowledge: (alertId: string) => Promise<void>;
    acceptCase: (alertId: string) => Promise<void>;
    requestBackup: (alertId: string) => Promise<void>;
    escalate: (alertId: string, reason: string) => Promise<void>;
    resolveCase: (alertId: string, outcome: string, notes: string) => Promise<void>;
  };
}

export function CrisisResponseMobileApp() {
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [professionalId, setProfessionalId] = useState<string>('');
  const [isResponding, setIsResponding] = useState(false);
  
  useEffect(() => {
    // Initialize Firebase messaging for crisis alerts
    const initializeMessaging = async () => {
      const authorizationStatus = await messaging().requestPermission();
      
      if (authorizationStatus) {
        console.log('Permission status:', authorizationStatus);
        
        // Get FCM token for this device
        const fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);
        
        // Register this professional's device
        await registerProfessionalDevice(professionalId, fcmToken);
      }
    };
    
    initializeMessaging();
    
    // Handle foreground notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification received:', remoteMessage);
      
      if (remoteMessage.data?.action === 'crisis_response') {
        // Critical crisis alert received
        handleCrisisAlert(remoteMessage.data);
      }
    });
    
    // Handle notification tap when app is in background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      
      if (remoteMessage.data?.alertId) {
        navigateToCrisisAlert(remoteMessage.data.alertId);
      }
    });
    
    return unsubscribe;
  }, [professionalId]);
  
  const handleCrisisAlert = async (alertData: any) => {
    const alert = await fetchCrisisAlert(alertData.alertId);
    
    if (!alert) {
      console.error('Failed to fetch crisis alert:', alertData.alertId);
      return;
    }
    
    // Add to active alerts
    setCrisisAlerts(prev => [alert, ...prev]);
    
    // Show immediate alert modal for high/immediate risk
    if (['immediate', 'high'].includes(alert.riskLevel)) {
      showCriticalAlertModal(alert);
      
      // Vibrate for critical alerts
      Vibration.vibrate([0, 1000, 500, 1000, 500, 1000]);
    }
  };
  
  const showCriticalAlertModal = (alert: CrisisAlert) => {
    Alert.alert(
      `🚨 ${alert.riskLevel.toUpperCase()} CRISIS ALERT`,
      `Participant needs immediate attention.\n\nConfidence: ${Math.round(alert.confidence * 100)}%\nTriggers: ${alert.triggers.slice(0, 2).join(', ')}`,
      [
        {
          text: 'Acknowledge',
          onPress: () => acknowledgeCrisisAlert(alert.id),
          style: 'default'
        },
        {
          text: 'Respond Now',
          onPress: () => acceptCrisisCase(alert.id),
          style: 'destructive'
        }
      ],
      { 
        cancelable: false,
        userInterfaceStyle: 'dark'
      }
    );
  };
  
  const acknowledgeCrisisAlert = async (alertId: string) => {
    try {
      await firestore()
        .collection('crisis_alerts')
        .doc(alertId)
        .update({
          'response.acknowledged': true,
          'response.acknowledgedBy': professionalId,
          'response.acknowledgedAt': firestore.FieldValue.serverTimestamp(),
          'response.responseTime': Date.now() - alert.timestamp.getTime()
        });
        
      console.log('Crisis alert acknowledged:', alertId);
      
      // Remove from active alerts list
      setCrisisAlerts(prev => prev.filter(a => a.id !== alertId));
      
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      Alert.alert('Error', 'Failed to acknowledge alert. Please try again.');
    }
  };
  
  const acceptCrisisCase = async (alertId: string) => {
    try {
      setIsResponding(true);
      
      await firestore()
        .collection('crisis_alerts')
        .doc(alertId)
        .update({
          'response.acknowledged': true,
          'response.acknowledgedBy': professionalId,
          'response.acknowledgedAt': firestore.FieldValue.serverTimestamp(),
          'response.professionalAssigned': professionalId,
          'response.interventionStarted': true,
          'response.responseTime': Date.now() - alert.timestamp.getTime()
        });
      
      // Navigate to crisis intervention interface
      navigateToCrisisIntervention(alertId);
      
    } catch (error) {
      console.error('Failed to accept crisis case:', error);
      Alert.alert('Error', 'Failed to accept case. Please try again.');
    }
  };
  
  return (
    <div className="crisis-response-app">
      <header className="app-header">
        <h1>ALCHM Crisis Response</h1>
        <div className="professional-status">
          <StatusToggle
            status={isResponding ? 'responding' : 'available'}
            onChange={setIsResponding}
          />
        </div>
      </header>
      
      <section className="active-alerts">
        <h2>Active Crisis Alerts ({crisisAlerts.length})</h2>
        {crisisAlerts.map(alert => (
          <CrisisAlertCard
            key={alert.id}
            alert={alert}
            onAcknowledge={() => acknowledgeCrisisAlert(alert.id)}
            onAccept={() => acceptCrisisCase(alert.id)}
          />
        ))}
      </section>
      
      <section className="response-tools">
        <h2>Crisis Response Tools</h2>
        <div className="tools-grid">
          <ResponseTool
            icon="📞"
            title="Emergency Contacts"
            action={() => navigateToEmergencyContacts()}
          />
          <ResponseTool
            icon="🏥"
            title="Hospital Network"
            action={() => navigateToHospitalNetwork()}
          />
          <ResponseTool
            icon="📊"
            title="Crisis Dashboard"
            action={() => navigateToCrisisDashboard()}
          />
          <ResponseTool
            icon="👥"
            title="Team Coordination"
            action={() => navigateToTeamChat()}
          />
        </div>
      </section>
    </div>
  );
}
```

---

## 📊 **REAL-TIME DASHBOARD INTEGRATION**

### **Live Crisis Monitoring Dashboard**
```typescript
export function RealTimeCrisisMonitor() {
  const [activeAlerts, setActiveAlerts] = useState<CrisisAlert[]>([]);
  const [teamStatus, setTeamStatus] = useState<TeamStatus>();
  const [alertStatistics, setAlertStatistics] = useState<AlertStatistics>();
  
  useEffect(() => {
    // Real-time monitoring of active crisis alerts
    const unsubscribe = firestore()
      .collection('crisis_alerts')
      .where('response.acknowledged', '==', false)
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const alerts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CrisisAlert[];
        
        setActiveAlerts(alerts);
        
        // Auto-refresh team status when new alerts arrive
        if (alerts.length > 0) {
          refreshTeamStatus();
        }
      });
      
    return unsubscribe;
  }, []);
  
  const refreshTeamStatus = async () => {
    const status = await fetchCurrentTeamStatus();
    setTeamStatus(status);
    
    // Check for understaffing alerts
    if (status.availableProfessionals < 2 && activeAlerts.length > 0) {
      triggerUnderstaffingAlert();
    }
  };
  
  return (
    <div className="real-time-crisis-monitor">
      {/* Critical Alerts Banner */}
      {activeAlerts.filter(a => a.riskLevel === 'immediate').length > 0 && (
        <div className="critical-alerts-banner">
          🚨 IMMEDIATE INTERVENTIONS NEEDED: {activeAlerts.filter(a => a.riskLevel === 'immediate').length}
        </div>
      )}
      
      <div className="monitor-grid">
        {/* Active Crisis Alerts */}
        <Panel title="🚨 Active Crisis Alerts" priority="critical">
          <div className="alerts-list">
            {activeAlerts.map(alert => (
              <RealTimeCrisisAlert
                key={alert.id}
                alert={alert}
                onAcknowledge={(alertId) => handleAlertAcknowledgment(alertId)}
                onEscalate={(alertId) => handleManualEscalation(alertId)}
              />
            ))}
          </div>
        </Panel>
        
        {/* Professional Team Status */}
        <Panel title="👨‍⚕️ Team Status">
          <ProfessionalTeamStatusGrid teamStatus={teamStatus} />
        </Panel>
        
        {/* Alert Statistics */}
        <Panel title="📈 Alert Statistics">
          <AlertStatisticsDisplay stats={alertStatistics} />
        </Panel>
        
        {/* System Health */}
        <Panel title="💻 System Health">
          <AlertingSystemHealthMonitor />
        </Panel>
      </div>
    </div>
  );
}

function RealTimeCrisisAlert({ alert, onAcknowledge, onEscalate }) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Date.now() - alert.timestamp.getTime());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [alert.timestamp]);
  
  const formatTimeElapsed = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };
  
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'immediate': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <div className={`crisis-alert-card ${getRiskLevelColor(alert.riskLevel)}`}>
      <div className="alert-header">
        <span className="alert-id">{alert.id.substring(0, 8)}</span>
        <span className="time-elapsed">{formatTimeElapsed(timeElapsed)}</span>
        <span className="confidence">{Math.round(alert.confidence * 100)}%</span>
      </div>
      
      <div className="alert-details">
        <div className="participant-info">
          Participant: {alert.participantId.substring(0, 8)}...
        </div>
        
        <div className="cultural-context">
          {alert.culturalContext.length > 0 && (
            <span>Context: {alert.culturalContext.join(', ')}</span>
          )}
        </div>
        
        <div className="triggers">
          Triggers: {alert.triggers.slice(0, 3).join(', ')}
          {alert.triggers.length > 3 && '...'}
        </div>
      </div>
      
      <div className="alert-actions">
        <button
          onClick={() => onAcknowledge(alert.id)}
          className="acknowledge-btn"
        >
          Acknowledge
        </button>
        
        <button
          onClick={() => onEscalate(alert.id)}
          className="escalate-btn"
        >
          Manual Escalate
        </button>
        
        <a
          href={`/crisis-intervention/${alert.id}`}
          className="respond-btn"
          target="_blank"
        >
          Respond Now
        </a>
      </div>
    </div>
  );
}
```

---

## 🛠️ **IMPLEMENTATION CHECKLIST**

### **Week 1: Core Alerting Infrastructure**
- [ ] Deploy Firebase Cloud Functions for multi-channel alert processing
- [ ] Set up Twilio integration (SMS + Voice) with crisis-specific numbers
- [ ] Configure Firebase Cloud Messaging for mobile app alerts
- [ ] Implement WebSocket dashboard for real-time updates
- [ ] Set up PagerDuty integration for system failure alerts

### **Week 2: Professional Team Integration**
- [ ] Deploy crisis response mobile app for professional team
- [ ] Set up professional team device registration and management
- [ ] Implement escalation scheduling and automatic progression
- [ ] Configure cultural liaison alert routing
- [ ] Test end-to-end alert delivery and acknowledgment

### **Week 3: Advanced Features & Reliability**
- [ ] Implement alert delivery failure detection and backup systems
- [ ] Deploy voice calling system for critical escalations
- [ ] Set up emergency services integration protocols
- [ ] Implement cultural context-aware alert routing
- [ ] Configure hospital partnership notification systems

### **Week 4: Dashboard & Analytics**
- [ ] Deploy real-time crisis monitoring dashboard
- [ ] Implement alert statistics and performance analytics
- [ ] Set up alerting system health monitoring
- [ ] Configure professional team performance tracking
- [ ] Final testing of all escalation paths and failsafes

This comprehensive real-time alerting system ensures ALCHM's crisis interventions are delivered instantly through multiple channels with automatic escalation and professional-grade reliability.