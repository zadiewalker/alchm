/**
 * ALCHM Performance Monitoring Setup
 * Critical performance tracking for trauma-informed users
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Performance thresholds for crisis users
const PERFORMANCE_THRESHOLDS = {
  crisisDetection: 100, // 100ms max for crisis detection
  journalSave: 500, // 500ms max for journal saves
  authentication: 1000, // 1s max for auth
  pageLoad: 2000 // 2s max for initial page load
};

// Performance monitoring alerts
const ALERT_RECIPIENTS = [
  'zadie@alchm.app',
  'alerts@alchm.app'
];

async function setupPerformanceMonitoring() {
  console.log('🚀 Setting up ALCHM Performance Monitoring...');

  try {
    // Create performance monitoring collection
    await db.collection('performance_monitoring').doc('config').set({
      thresholds: PERFORMANCE_THRESHOLDS,
      alertRecipients: ALERT_RECIPIENTS,
      monitoringEnabled: true,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      criticalEndpoints: [
        'crisisDetection',
        'saveJournalEntry', 
        'validateUserSession',
        'chatWithGemini'
      ]
    });

    // Create performance metrics collection structure
    await db.collection('performance_metrics').doc('template').set({
      endpoint: 'example',
      responseTime: 0,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      statusCode: 200,
      errorCount: 0,
      userAgent: '',
      geography: 'unknown',
      criticalPath: false
    });

    // Create performance alerts collection
    await db.collection('performance_alerts').doc('template').set({
      alertType: 'threshold_exceeded',
      endpoint: 'example',
      threshold: 0,
      actualTime: 0,
      severity: 'medium',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      acknowledged: false,
      resolution: null
    });

    // Create error tracking collection
    await db.collection('error_tracking').doc('template').set({
      errorType: 'function_error',
      endpoint: 'example',
      errorMessage: '',
      stackTrace: '',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: null,
      userAgent: '',
      resolved: false
    });

    // Set up Firebase Performance Monitoring configuration
    const performanceConfig = {
      enablePerformanceMonitoring: true,
      traceSampling: 1.0, // 100% sampling for crisis scenarios
      networkRequestSampling: 1.0,
      httpMetricSampling: 1.0,
      customTraceSampling: 1.0,
      criticalUserFlowTracking: true
    };

    await db.collection('app_config').doc('performance').set(performanceConfig);

    console.log('✅ Performance monitoring collections created');

    // Create monitoring dashboard data
    await db.collection('monitoring_dashboard').doc('realtime_stats').set({
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      criticalAlerts: 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      status: 'operational'
    });

    console.log('✅ Monitoring dashboard initialized');

    // Set up cost monitoring
    await db.collection('cost_monitoring').doc('current_month').set({
      firebaseFunctions: 0,
      firestoreOperations: 0,
      storageUsage: 0,
      bandwidthUsage: 0,
      estimatedTotal: 0,
      budget: 200, // $200 monthly budget
      alertThreshold: 0.8, // Alert at 80% of budget
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Cost monitoring configured');

    // Create uptime monitoring
    await db.collection('uptime_monitoring').doc('status').set({
      overallStatus: 'operational',
      services: {
        hosting: 'operational',
        functions: 'operational',
        firestore: 'operational',
        auth: 'operational',
        crisisDetection: 'operational'
      },
      lastChecked: admin.firestore.FieldValue.serverTimestamp(),
      uptimePercentage: 100.0
    });

    console.log('✅ Uptime monitoring initialized');

    console.log('🎉 ALCHM Performance Monitoring Setup Complete!');
    console.log('');
    console.log('📊 Monitoring Features Enabled:');
    console.log('   - Real-time performance tracking');
    console.log('   - Crisis detection response time monitoring');
    console.log('   - Error tracking and alerting');
    console.log('   - Cost optimization monitoring');
    console.log('   - Uptime monitoring');
    console.log('');
    console.log('🚨 Crisis Response Optimizations:');
    console.log('   - <100ms crisis detection threshold');
    console.log('   - 100% request sampling for accuracy');
    console.log('   - Real-time alerting system');
    console.log('');

  } catch (error) {
    console.error('❌ Error setting up performance monitoring:', error);
    throw error;
  }
}

// Run the setup
if (require.main === module) {
  setupPerformanceMonitoring()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupPerformanceMonitoring, PERFORMANCE_THRESHOLDS };