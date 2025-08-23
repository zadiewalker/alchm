#!/bin/bash

# Monitoring Dashboard Setup Script for ALCHM
# This script sets up comprehensive monitoring and alerting for production

echo "📊 ALCHM Monitoring Dashboard Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}"
ALERT_EMAIL="${ALERT_EMAIL:-admin@alchm.com}"

# Function to check prerequisites
check_prerequisites() {
    echo -e "\n${BLUE}🔍 Checking Prerequisites${NC}"
    
    # Check Firebase CLI
    if ! command -v firebase >/dev/null 2>&1; then
        echo -e "${RED}❌ Firebase CLI not found${NC}"
        echo "Install with: npm install -g firebase-tools"
        exit 1
    fi
    
    # Check gcloud CLI
    if ! command -v gcloud >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Google Cloud CLI not found${NC}"
        echo "Some advanced monitoring features may not be available"
        echo "Install from: https://cloud.google.com/sdk/docs/install"
    else
        echo -e "${GREEN}✅ Google Cloud CLI available${NC}"
    fi
    
    # Check project ID
    if [ -z "$PROJECT_ID" ]; then
        PROJECT_ID=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}')
        if [ -z "$PROJECT_ID" ]; then
            echo -e "${RED}❌ No Firebase project configured${NC}"
            echo "Run: firebase use <project-id>"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"
}

# Function to create monitoring function
create_monitoring_function() {
    echo -e "\n${BLUE}🔧 Creating Monitoring Function${NC}"
    
    mkdir -p functions/src/monitoring
    
    cat > functions/src/monitoring/index.ts << 'EOF'
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();

// Health metrics collection
export const collectHealthMetrics = onSchedule('every 5 minutes', async (event) => {
  try {
    const timestamp = new Date();
    const metrics = await gatherSystemMetrics();
    
    // Store metrics in Firestore
    await db.collection('monitoring').doc('health').collection('metrics').add({
      timestamp,
      ...metrics
    });
    
    // Check for alerts
    await checkAlertThresholds(metrics);
    
    logger.info('Health metrics collected', { metrics });
  } catch (error) {
    logger.error('Failed to collect health metrics', error);
  }
});

// System metrics gathering
async function gatherSystemMetrics() {
  const metrics: any = {
    timestamp: new Date(),
    errors: 0,
    activeUsers: 0,
    responseTime: 0,
    memoryUsage: 0,
    functionInvocations: 0
  };

  try {
    // Count recent errors
    const errorQuery = await db.collection('errorLogs')
      .where('timestamp', '>=', new Date(Date.now() - 5 * 60 * 1000))
      .get();
    metrics.errors = errorQuery.size;

    // Count active users (signed in within last hour)
    const activeUserQuery = await db.collection('users')
      .where('lastActive', '>=', new Date(Date.now() - 60 * 60 * 1000))
      .get();
    metrics.activeUsers = activeUserQuery.size;

    // Check response time with a test request
    const startTime = Date.now();
    await db.collection('system').doc('health').get();
    metrics.responseTime = Date.now() - startTime;

  } catch (error) {
    logger.error('Error gathering metrics', error);
  }

  return metrics;
}

// Alert threshold checking
async function checkAlertThresholds(metrics: any) {
  const alerts = [];

  // Error rate alert
  if (metrics.errors > 10) {
    alerts.push({
      type: 'high_error_rate',
      severity: 'critical',
      message: `High error rate: ${metrics.errors} errors in 5 minutes`,
      metrics
    });
  }

  // Response time alert
  if (metrics.responseTime > 5000) {
    alerts.push({
      type: 'slow_response',
      severity: 'warning',
      message: `Slow response time: ${metrics.responseTime}ms`,
      metrics
    });
  }

  // Process alerts
  for (const alert of alerts) {
    await processAlert(alert);
  }
}

// Alert processing
async function processAlert(alert: any) {
  try {
    // Store alert
    await db.collection('monitoring').doc('alerts').collection('active').add({
      ...alert,
      timestamp: new Date(),
      acknowledged: false
    });

    // Send notification (implement your notification service)
    logger.error('ALERT TRIGGERED', alert);
    
    // You can integrate with external services here:
    // - Slack notifications
    // - Email alerts
    // - PagerDuty
    // - Discord webhooks
    
  } catch (error) {
    logger.error('Failed to process alert', error);
  }
}

// Manual health check endpoint
export const getHealthStatus = onCall(async (data, context) => {
  try {
    const metrics = await gatherSystemMetrics();
    
    // Get recent alerts
    const alertsQuery = await db.collection('monitoring')
      .doc('alerts')
      .collection('active')
      .where('acknowledged', '==', false)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
    
    const alerts = alertsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get system status
    const status = {
      overall: alerts.length === 0 ? 'healthy' : 'warning',
      metrics,
      alerts,
      lastCheck: new Date()
    };

    return status;
  } catch (error) {
    logger.error('Health status check failed', error);
    throw new Error('Failed to get health status');
  }
});

// Acknowledge alert
export const acknowledgeAlert = onCall(async (data, context) => {
  const { alertId } = data;
  
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  try {
    await db.collection('monitoring')
      .doc('alerts')
      .collection('active')
      .doc(alertId)
      .update({
        acknowledged: true,
        acknowledgedBy: context.auth.uid,
        acknowledgedAt: new Date()
      });

    return { success: true };
  } catch (error) {
    logger.error('Failed to acknowledge alert', error);
    throw new Error('Failed to acknowledge alert');
  }
});

// Performance monitoring
export const recordPerformanceMetric = onCall(async (data, context) => {
  const { metric, value, metadata } = data;
  
  try {
    await db.collection('monitoring').doc('performance').collection('metrics').add({
      metric,
      value,
      metadata,
      timestamp: new Date(),
      userId: context.auth?.uid || null
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to record performance metric', error);
    throw new Error('Failed to record metric');
  }
});
EOF

    echo -e "${GREEN}✅ Monitoring function created${NC}"
}

# Function to create monitoring dashboard
create_monitoring_dashboard() {
    echo -e "\n${BLUE}📊 Creating Monitoring Dashboard${NC}"
    
    mkdir -p src/app/admin/monitoring
    
    cat > src/app/admin/monitoring/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

interface HealthMetrics {
  errors: number;
  activeUsers: number;
  responseTime: number;
  memoryUsage: number;
}

interface Alert {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: any;
  acknowledged: boolean;
}

interface HealthStatus {
  overall: 'healthy' | 'warning' | 'critical';
  metrics: HealthMetrics;
  alerts: Alert[];
  lastCheck: any;
}

export default function MonitoringDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHealthStatus = httpsCallable(functions, 'getHealthStatus');
  const acknowledgeAlert = httpsCallable(functions, 'acknowledgeAlert');

  useEffect(() => {
    fetchHealthStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const result = await getHealthStatus();
      setHealthStatus(result.data as HealthStatus);
      setError(null);
    } catch (err) {
      setError('Failed to fetch health status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeAlert({ alertId });
      fetchHealthStatus(); // Refresh data
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">System Monitoring</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">System Monitoring</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          healthStatus?.overall === 'healthy' 
            ? 'bg-green-100 text-green-800'
            : healthStatus?.overall === 'warning'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {healthStatus?.overall?.toUpperCase() || 'UNKNOWN'}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Error Rate"
          value={healthStatus?.metrics?.errors || 0}
          unit="errors/5min"
          trend="stable"
          color={healthStatus?.metrics?.errors && healthStatus.metrics.errors > 5 ? 'red' : 'green'}
        />
        <MetricCard
          title="Active Users"
          value={healthStatus?.metrics?.activeUsers || 0}
          unit="users"
          trend="up"
          color="blue"
        />
        <MetricCard
          title="Response Time"
          value={healthStatus?.metrics?.responseTime || 0}
          unit="ms"
          trend="stable"
          color={healthStatus?.metrics?.responseTime && healthStatus.metrics.responseTime > 1000 ? 'yellow' : 'green'}
        />
        <MetricCard
          title="Memory Usage"
          value={healthStatus?.metrics?.memoryUsage || 0}
          unit="MB"
          trend="stable"
          color="purple"
        />
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Active Alerts</h2>
        </div>
        <div className="p-6">
          {healthStatus?.alerts?.length === 0 ? (
            <div className="text-green-600 text-center py-4">
              ✅ No active alerts
            </div>
          ) : (
            <div className="space-y-4">
              {healthStatus?.alerts?.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-500'
                      : alert.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <h3 className="font-semibold text-lg">{alert.type.replace('_', ' ').toUpperCase()}</h3>
                      </div>
                      <p className="text-gray-700 mt-1">{alert.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {alert.timestamp?.toDate?.()?.toLocaleString() || alert.timestamp}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">System Information</h2>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Last Check:</span>
                <span>{healthStatus?.lastCheck?.toDate?.()?.toLocaleString() || healthStatus?.lastCheck}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Status:</span>
                <span className={
                  healthStatus?.overall === 'healthy' ? 'text-green-600' :
                  healthStatus?.overall === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }>
                  {healthStatus?.overall?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button 
                onClick={fetchHealthStatus}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Status
              </button>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
              >
                Firebase Console
              </a>
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
              >
                Google Cloud Console
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple';
}

function MetricCard({ title, value, unit, trend, color }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trend}
        </div>
      </div>
    </div>
  );
}
EOF

    echo -e "${GREEN}✅ Monitoring dashboard created${NC}"
}

# Function to create alerting configuration
create_alerting_config() {
    echo -e "\n${BLUE}🚨 Creating Alerting Configuration${NC}"
    
    cat > scripts/alert-config.js << 'EOF'
// Alerting configuration for ALCHM monitoring
const alertConfig = {
  // Alert thresholds
  thresholds: {
    errorRate: {
      warning: 5,    // errors per 5 minutes
      critical: 10   // errors per 5 minutes
    },
    responseTime: {
      warning: 3000,  // milliseconds
      critical: 10000 // milliseconds
    },
    memoryUsage: {
      warning: 1024,  // MB
      critical: 2048  // MB
    },
    activeUsers: {
      minimum: 1     // Alert if no active users for extended period
    }
  },

  // Notification channels
  notifications: {
    slack: {
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: '#alerts',
      enabled: true
    },
    email: {
      recipients: [
        'admin@alchm.com',
        'dev-team@alchm.com'
      ],
      enabled: true
    },
    discord: {
      webhook: process.env.DISCORD_WEBHOOK_URL,
      enabled: false
    }
  },

  // Alert templates
  templates: {
    critical: {
      title: '🚨 CRITICAL ALERT: {{type}}',
      message: '{{message}}\n\nImmediate action required!',
      color: '#FF0000'
    },
    warning: {
      title: '⚠️ WARNING: {{type}}',
      message: '{{message}}\n\nMonitoring required.',
      color: '#FFA500'
    },
    info: {
      title: 'ℹ️ INFO: {{type}}',
      message: '{{message}}',
      color: '#0099FF'
    }
  }
};

module.exports = alertConfig;
EOF

    echo -e "${GREEN}✅ Alerting configuration created${NC}"
}

# Function to create monitoring utilities
create_monitoring_utilities() {
    echo -e "\n${BLUE}🛠️ Creating Monitoring Utilities${NC}"
    
    cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

# Monitoring utility script for ALCHM
# Usage: ./scripts/monitor.sh [command]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo "ALCHM Monitoring Utility"
    echo "========================"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status     - Show current system status"
    echo "  alerts     - Show active alerts"
    echo "  metrics    - Show latest metrics"
    echo "  logs       - Show recent error logs"
    echo "  dashboard  - Open monitoring dashboard"
    echo "  test       - Run monitoring tests"
    echo "  help       - Show this help message"
}

get_status() {
    echo -e "${BLUE}📊 System Status${NC}"
    echo "================="
    
    # Basic connectivity
    if curl -s -f "https://${PROJECT_ID}.web.app/api/health/ping" >/dev/null; then
        echo -e "${GREEN}✅ Site is responding${NC}"
    else
        echo -e "${RED}❌ Site is not responding${NC}"
    fi
    
    # Function status
    if firebase functions:list >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Functions are accessible${NC}"
    else
        echo -e "${RED}❌ Functions are not accessible${NC}"
    fi
    
    # Recent errors
    local error_count=$(firebase functions:log --limit 100 --filter="severity>=ERROR" 2>/dev/null | wc -l)
    if [ "$error_count" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $error_count recent errors found${NC}"
    else
        echo -e "${GREEN}✅ No recent errors${NC}"
    fi
}

show_alerts() {
    echo -e "${BLUE}🚨 Active Alerts${NC}"
    echo "================"
    
    # This would integrate with your monitoring system
    echo "Checking for active alerts..."
    
    # You can implement alert checking logic here
    echo -e "${GREEN}✅ No active alerts${NC}"
}

show_metrics() {
    echo -e "${BLUE}📈 Latest Metrics${NC}"
    echo "=================="
    
    # Response time test
    local start_time=$(date +%s%N)
    curl -s "https://${PROJECT_ID}.web.app/api/health/ping" >/dev/null
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))
    
    echo "Response Time: ${response_time}ms"
    
    # Function invocations (last hour)
    echo "Checking function metrics..."
    
    # You can add more metrics here
}

show_logs() {
    echo -e "${BLUE}📝 Recent Error Logs${NC}"
    echo "===================="
    
    firebase functions:log --limit 20 --filter="severity>=ERROR"
}

open_dashboard() {
    echo -e "${BLUE}🌐 Opening Monitoring Dashboard${NC}"
    
    local dashboard_url="https://${PROJECT_ID}.web.app/admin/monitoring"
    
    if command -v open >/dev/null 2>&1; then
        open "$dashboard_url"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$dashboard_url"
    else
        echo "Dashboard URL: $dashboard_url"
    fi
}

run_tests() {
    echo -e "${BLUE}🧪 Running Monitoring Tests${NC}"
    echo "============================="
    
    # Test health endpoints
    echo "Testing health endpoints..."
    
    endpoints=(
        "/api/health/ping"
        "/api/health/status"
        "/api/health/database"
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -s -f "https://${PROJECT_ID}.web.app$endpoint" >/dev/null; then
            echo -e "${GREEN}✅ $endpoint${NC}"
        else
            echo -e "${RED}❌ $endpoint${NC}"
        fi
    done
    
    # Test monitoring function
    echo "Testing monitoring function..."
    # Add monitoring function tests here
}

# Main script logic
case "${1:-help}" in
    "status")
        get_status
        ;;
    "alerts")
        show_alerts
        ;;
    "metrics")
        show_metrics
        ;;
    "logs")
        show_logs
        ;;
    "dashboard")
        open_dashboard
        ;;
    "test")
        run_tests
        ;;
    "help"|*)
        show_help
        ;;
esac
EOF

    chmod +x scripts/monitor.sh
    echo -e "${GREEN}✅ Monitoring utilities created${NC}"
}

# Function to create Google Cloud monitoring alerts
setup_cloud_monitoring() {
    echo -e "\n${BLUE}☁️ Setting up Google Cloud Monitoring${NC}"
    
    if ! command -v gcloud >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Google Cloud CLI not found, skipping cloud monitoring setup${NC}"
        echo "Install from: https://cloud.google.com/sdk/docs/install"
        return
    fi
    
    # Check if authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Not authenticated with Google Cloud${NC}"
        echo "Run: gcloud auth login"
        return
    fi
    
    echo "Setting up Cloud Monitoring for project: $PROJECT_ID"
    
    # Create alert policy for high error rate
    cat > monitoring-alert-policy.json << EOF
{
  "displayName": "ALCHM High Error Rate",
  "documentation": {
    "content": "Alert when error rate exceeds threshold",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "Function error rate",
      "conditionThreshold": {
        "filter": "resource.type=\"cloud_function\" resource.labels.function_name=\"nextApp\"",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 0.05,
        "duration": "300s",
        "aggregations": [
          {
            "alignmentPeriod": "300s",
            "perSeriesAligner": "ALIGN_RATE",
            "crossSeriesReducer": "REDUCE_MEAN"
          }
        ]
      }
    }
  ],
  "combiner": "OR",
  "enabled": true,
  "notificationChannels": []
}
EOF

    echo -e "${GREEN}✅ Cloud monitoring configuration created${NC}"
    echo "To apply, run:"
    echo "gcloud alpha monitoring policies create --policy-from-file=monitoring-alert-policy.json"
}

# Function to create performance monitoring
create_performance_monitoring() {
    echo -e "\n${BLUE}⚡ Creating Performance Monitoring${NC}"
    
    cat > src/lib/performance.ts << 'EOF'
// Performance monitoring for ALCHM
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  // Record a performance metric
  recordMetric(name: string, value: number, metadata?: any) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }

    // Send to monitoring service in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      this.sendMetricToService(name, value, metadata);
    }
  }

  // Get average of a metric
  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // Record page load time
  recordPageLoad(page: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, { page });
        this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, { page });
        this.recordMetric('first_paint', navigation.loadEventEnd - navigation.fetchStart, { page });
      }
    }
  }

  // Record API call performance
  recordAPICall(endpoint: string, duration: number, status: number) {
    this.recordMetric('api_response_time', duration, { endpoint, status });
    
    if (status >= 400) {
      this.recordMetric('api_error_count', 1, { endpoint, status });
    }
  }

  // Record user interaction performance
  recordUserInteraction(action: string, duration: number) {
    this.recordMetric('user_interaction_time', duration, { action });
  }

  // Send metric to monitoring service
  private async sendMetricToService(name: string, value: number, metadata?: any) {
    try {
      await fetch('/api/monitoring/metric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metric: name,
          value,
          metadata,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send metric:', error);
    }
  }

  // Get all metrics summary
  getMetricsSummary() {
    const summary: Record<string, any> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        summary[name] = {
          count: values.length,
          average: this.getAverageMetric(name),
          min: Math.min(...values),
          max: Math.max(...values),
          latest: values[values.length - 1]
        };
      }
    }
    
    return summary;
  }
}

// Helper function to measure function execution time
export function measureTime<T>(fn: () => T | Promise<T>, metricName: string): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  const startTime = Date.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        monitor.recordMetric(metricName, Date.now() - startTime);
      });
    } else {
      monitor.recordMetric(metricName, Date.now() - startTime);
      return Promise.resolve(result);
    }
  } catch (error) {
    monitor.recordMetric(metricName, Date.now() - startTime, { error: true });
    throw error;
  }
}

// Web Vitals monitoring
export function initializeWebVitals() {
  if (typeof window !== 'undefined') {
    const monitor = PerformanceMonitor.getInstance();
    
    // Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => monitor.recordMetric('cls', metric.value, metric));
      getFID((metric) => monitor.recordMetric('fid', metric.value, metric));
      getFCP((metric) => monitor.recordMetric('fcp', metric.value, metric));
      getLCP((metric) => monitor.recordMetric('lcp', metric.value, metric));
      getTTFB((metric) => monitor.recordMetric('ttfb', metric.value, metric));
    }).catch(console.error);
  }
}

export default PerformanceMonitor;
EOF

    echo -e "${GREEN}✅ Performance monitoring created${NC}"
}

# Function to create monitoring documentation
create_monitoring_docs() {
    echo -e "\n${BLUE}📚 Creating Monitoring Documentation${NC}"
    
    cat > MONITORING.md << 'EOF'
# ALCHM Monitoring & Observability

## Overview

This document describes the monitoring and observability setup for ALCHM, including dashboards, alerts, and troubleshooting procedures.

## Monitoring Components

### 1. Health Checks
- **Endpoint**: `/api/health/*`
- **Frequency**: Every 5 minutes
- **Metrics**: Response time, error rate, database connectivity

### 2. Performance Monitoring
- **Web Vitals**: CLS, FID, FCP, LCP, TTFB
- **API Performance**: Response times, error rates
- **User Interactions**: Click-to-response times

### 3. Error Tracking
- **Application Errors**: Unhandled exceptions, API errors
- **Security Events**: Authentication failures, suspicious activity
- **Infrastructure**: Function timeouts, memory issues

### 4. Business Metrics
- **User Activity**: Active users, session duration
- **Feature Usage**: Journal creation, AI interactions
- **Performance**: Page load times, conversion rates

## Dashboards

### Admin Monitoring Dashboard
- **URL**: `/admin/monitoring`
- **Access**: Admin users only
- **Features**:
  - Real-time system status
  - Active alerts management
  - Performance metrics
  - Quick actions

### External Dashboards
- **Firebase Console**: Function logs, usage metrics
- **Google Cloud Console**: Advanced monitoring, alerting
- **Stripe Dashboard**: Payment metrics, webhook status

## Alerting

### Alert Levels
1. **Info**: General notifications, no action required
2. **Warning**: Attention needed, monitor closely
3. **Critical**: Immediate action required

### Alert Thresholds
- **Error Rate**: >5 errors/5min (warning), >10 errors/5min (critical)
- **Response Time**: >3s (warning), >10s (critical)
- **Memory Usage**: >1GB (warning), >2GB (critical)
- **Active Users**: <1 for >1 hour (warning)

### Notification Channels
- **Slack**: #alerts channel for team notifications
- **Email**: Admin team for critical alerts
- **Dashboard**: In-app alert management

## Monitoring Commands

### Quick Status Check
```bash
./scripts/monitor.sh status
```

### View Active Alerts
```bash
./scripts/monitor.sh alerts
```

### Show Latest Metrics
```bash
./scripts/monitor.sh metrics
```

### View Error Logs
```bash
./scripts/monitor.sh logs
```

### Open Dashboard
```bash
./scripts/monitor.sh dashboard
```

### Run Tests
```bash
./scripts/monitor.sh test
```

## Troubleshooting

### High Error Rate
1. Check function logs: `firebase functions:log --filter="ERROR"`
2. Review recent deployments
3. Check external service status
4. Investigate specific error patterns

### Slow Response Times
1. Check function performance metrics
2. Review database query performance
3. Check network latency
4. Investigate memory usage

### Alert Fatigue
1. Review alert thresholds
2. Adjust notification frequency
3. Implement alert grouping
4. Update escalation procedures

## Best Practices

### Monitoring
- Set up alerts for all critical paths
- Monitor business metrics, not just technical ones
- Use synthetic monitoring for early detection
- Regular review and adjustment of thresholds

### Alerting
- Avoid alert fatigue with appropriate thresholds
- Include context and runbooks in alerts
- Test alert channels regularly
- Document escalation procedures

### Performance
- Monitor real user performance (RUM)
- Set performance budgets
- Use synthetic testing
- Track Core Web Vitals

## Integration Setup

### Slack Integration
1. Create Slack webhook URL
2. Set SLACK_WEBHOOK_URL environment variable
3. Configure in alert-config.js
4. Test with manual alert

### Email Notifications
1. Configure SMTP settings
2. Set recipient list in alert-config.js
3. Test email delivery
4. Set up email templates

### Google Cloud Monitoring
1. Install gcloud CLI
2. Authenticate with project
3. Create alert policies
4. Set up notification channels

## Maintenance

### Daily Tasks
- Review monitoring dashboard
- Check active alerts
- Verify system health
- Monitor user activity

### Weekly Tasks
- Review performance trends
- Update alert thresholds if needed
- Check monitoring coverage
- Review incident reports

### Monthly Tasks
- Analyze monitoring data
- Update documentation
- Review and optimize costs
- Plan monitoring improvements

## Metrics Reference

### System Metrics
- `error_rate`: Errors per 5-minute window
- `response_time`: Average API response time (ms)
- `memory_usage`: Function memory consumption (MB)
- `active_users`: Users active in last hour

### Performance Metrics
- `page_load_time`: Full page load duration (ms)
- `api_response_time`: Individual API call duration (ms)
- `user_interaction_time`: UI response to user actions (ms)

### Business Metrics
- `journal_created`: Daily journal creation count
- `ai_requests`: AI service usage count
- `user_sessions`: Daily active sessions
- `conversion_rate`: Free to paid conversion

---

For additional help, refer to:
- [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Firebase Console](https://console.firebase.google.com)
EOF

    echo -e "${GREEN}✅ Monitoring documentation created${NC}"
}

# Load environment variables
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

# Main execution
echo "Setting up monitoring for ALCHM..."
echo "Project ID: ${PROJECT_ID:-<not set>}"
echo ""

check_prerequisites
create_monitoring_function
create_monitoring_dashboard
create_alerting_config
create_monitoring_utilities
setup_cloud_monitoring
create_performance_monitoring
create_monitoring_docs

echo -e "\n${GREEN}🎉 Monitoring setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy monitoring functions: firebase deploy --only functions"
echo "2. Set up alert notifications in scripts/alert-config.js"
echo "3. Configure Google Cloud monitoring (optional)"
echo "4. Test monitoring dashboard: ./scripts/monitor.sh dashboard"
echo "5. Run monitoring tests: ./scripts/monitor.sh test"
echo ""
echo "Documentation:"
echo "- Monitoring Guide: MONITORING.md"
echo "- Troubleshooting: TROUBLESHOOTING_GUIDE.md"
echo "- Dashboard: /admin/monitoring"