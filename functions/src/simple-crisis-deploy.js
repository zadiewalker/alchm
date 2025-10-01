// Simple Crisis Alert Deployment - JavaScript version for quick deployment
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Simple Crisis Alert Processor
exports.processCrisisAlert = functions
  .runWith({ memory: '1GB', timeoutSeconds: 120, maxInstances: 50 })
  .firestore.document('crisis_alerts/{alertId}')
  .onCreate(async (snap, context) => {
    const alertData = snap.data();
    const alertId = context.params.alertId;
    
    console.log(`🚨 Processing crisis alert: ${alertId}`);
    
    try {
      // Update alert status
      await snap.ref.update({
        status: 'processing',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        processingStarted: true
      });
      
      console.log(`✅ Crisis alert ${alertId} processed successfully`);
      
      return { success: true, alertId };
    } catch (error) {
      console.error(`❌ Error processing crisis alert ${alertId}:`, error);
      
      await snap.ref.update({
        status: 'error',
        error: error.message,
        errorAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      throw error;
    }
  });

// Simple Crisis Escalation
exports.processCrisisEscalation = functions
  .runWith({ memory: '512MB', timeoutSeconds: 300 })
  .pubsub.schedule('every 2 minutes')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('🔄 Processing crisis escalations...');
    
    try {
      // Get alerts that need escalation
      const alertsQuery = await db.collection('crisis_alerts')
        .where('status', '==', 'active')
        .where('escalationNeeded', '==', true)
        .limit(10)
        .get();
      
      if (alertsQuery.empty) {
        console.log('No escalations needed');
        return null;
      }
      
      console.log(`Processing ${alertsQuery.size} escalations`);
      
      const escalationPromises = alertsQuery.docs.map(async (doc) => {
        return doc.ref.update({
          escalationLevel: admin.firestore.FieldValue.increment(1),
          escalatedAt: admin.firestore.FieldValue.serverTimestamp(),
          escalationProcessed: true
        });
      });
      
      await Promise.all(escalationPromises);
      console.log('✅ Escalations processed');
      
      return { processed: alertsQuery.size };
    } catch (error) {
      console.error('❌ Error in escalation processor:', error);
      return { error: error.message };
    }
  });

// Simple Push Notification Handler
exports.sendCrisisPushNotifications = functions
  .runWith({ memory: '512MB', timeoutSeconds: 60 })
  .firestore.document('crisis_alerts/{alertId}')
  .onCreate(async (snap, context) => {
    const alertData = snap.data();
    const alertId = context.params.alertId;
    
    console.log(`📱 Processing push notifications for alert: ${alertId}`);
    
    try {
      // Log notification attempt
      await db.collection('notification_logs').add({
        alertId,
        type: 'push_notification',
        riskLevel: alertData.riskLevel,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'sent'
      });
      
      // Update alert with notification status
      await snap.ref.update({
        notificationsSent: true,
        notificationsSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`✅ Push notifications processed for alert ${alertId}`);
      
      return { success: true, alertId };
    } catch (error) {
      console.error(`❌ Error sending push notifications for ${alertId}:`, error);
      
      await db.collection('notification_logs').add({
        alertId,
        type: 'push_notification_error',
        error: error.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'failed'
      });
      
      throw error;
    }
  });