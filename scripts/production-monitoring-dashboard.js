#!/usr/bin/env node

/**
 * ALCHM Production Monitoring Dashboard
 * Real-time performance monitoring with crisis-specific alerts and analytics
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class ProductionMonitoringDashboard {
  constructor() {
    this.port = 3002;
    this.monitoringInterval = 30000; // 30 seconds
    this.domains = [
      'https://alchm-digital-sanctuary.web.app',
      'https://alchmapp.web.app'
    ];
    
    this.metrics = {
      timestamp: Date.now(),
      domains: {},
      alerts: [],
      systemHealth: 'unknown',
      crisisReadiness: false
    };

    this.crisisThresholds = {
      responseTime: 100,    // ms
      availability: 99.9,   // %
      errorRate: 0.1,      // %
      crisisResourceTime: 50 // ms for emergency resources
    };

    this.alertHistory = [];
    this.isMonitoring = false;
  }

  async startMonitoring() {
    console.log('🔥 Starting ALCHM Production Monitoring Dashboard');
    console.log('=' .repeat(60));
    console.log(`Dashboard URL: http://localhost:${this.port}`);
    console.log(`Monitoring interval: ${this.monitoringInterval / 1000}s`);
    console.log('Crisis thresholds:', this.crisisThresholds);
    
    // Start web server
    this.startWebServer();
    
    // Start monitoring loop
    this.isMonitoring = true;
    this.monitoringLoop();
    
    console.log('✅ Monitoring active - Dashboard ready');
  }

  startWebServer() {
    const server = http.createServer((req, res) => {
      if (req.url === '/' || req.url === '/dashboard') {
        this.serveDashboard(res);
      } else if (req.url === '/api/metrics') {
        this.serveMetrics(res);
      } else if (req.url === '/api/alerts') {
        this.serveAlerts(res);
      } else if (req.url.startsWith('/static/')) {
        this.serveStatic(req.url, res);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(this.port, () => {
      console.log(`📊 Dashboard server running on http://localhost:${this.port}`);
    });
  }

  serveDashboard(res) {
    const dashboard = this.generateDashboardHTML();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(dashboard);
  }

  serveMetrics(res) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(this.metrics));
  }

  serveAlerts(res) {
    res.writeHead(200, {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(this.alertHistory.slice(-50))); // Last 50 alerts
  }

  async monitoringLoop() {
    while (this.isMonitoring) {
      try {
        await this.performHealthCheck();
        console.log(`🔍 Health check completed at ${new Date().toLocaleTimeString()}`);
      } catch (error) {
        console.error('❌ Monitoring error:', error.message);
      }
      
      await this.sleep(this.monitoringInterval);
    }
  }

  async performHealthCheck() {
    const checkTimestamp = Date.now();
    const newMetrics = {
      timestamp: checkTimestamp,
      domains: {},
      alerts: [],
      systemHealth: 'healthy',
      crisisReadiness: true
    };

    // Test each domain
    for (const domain of this.domains) {
      const domainMetrics = await this.testDomain(domain);
      newMetrics.domains[domain] = domainMetrics;

      // Check for alerts
      const domainAlerts = this.checkDomainAlerts(domain, domainMetrics);
      newMetrics.alerts.push(...domainAlerts);

      // Update system health
      if (domainMetrics.health !== 'healthy') {
        newMetrics.systemHealth = 'degraded';
      }

      if (!domainMetrics.crisisReady) {
        newMetrics.crisisReadiness = false;
      }
    }

    // Update metrics
    this.metrics = newMetrics;

    // Process alerts
    if (newMetrics.alerts.length > 0) {
      this.processAlerts(newMetrics.alerts);
    }
  }

  async testDomain(domain) {
    const domainMetrics = {
      domain,
      health: 'healthy',
      crisisReady: true,
      responseTime: -1,
      statusCode: -1,
      availability: 0,
      errorRate: 0,
      crisisResources: {},
      lastChecked: Date.now()
    };

    try {
      // Test main domain response time
      const mainResponse = await this.measureResponse(domain);
      domainMetrics.responseTime = mainResponse.responseTime;
      domainMetrics.statusCode = mainResponse.statusCode;
      domainMetrics.availability = mainResponse.statusCode >= 200 && mainResponse.statusCode < 400 ? 100 : 0;

      // Test crisis-critical endpoints
      const crisisEndpoints = ['/', '/journal', '/dashboard', '/auth/login'];
      
      for (const endpoint of crisisEndpoints) {
        const endpointUrl = `${domain}${endpoint}`;
        try {
          const response = await this.measureResponse(endpointUrl);
          domainMetrics.crisisResources[endpoint] = {
            responseTime: response.responseTime,
            statusCode: response.statusCode,
            healthy: response.responseTime <= this.crisisThresholds.crisisResourceTime &&
                    response.statusCode >= 200 && response.statusCode < 400
          };

          if (!domainMetrics.crisisResources[endpoint].healthy) {
            domainMetrics.crisisReady = false;
          }
        } catch (error) {
          domainMetrics.crisisResources[endpoint] = {
            responseTime: -1,
            statusCode: -1,
            healthy: false,
            error: error.message
          };
          domainMetrics.crisisReady = false;
        }
      }

      // Determine overall health
      if (domainMetrics.responseTime > this.crisisThresholds.responseTime) {
        domainMetrics.health = 'slow';
      }
      
      if (domainMetrics.availability < this.crisisThresholds.availability) {
        domainMetrics.health = 'down';
      }

    } catch (error) {
      domainMetrics.health = 'down';
      domainMetrics.crisisReady = false;
      domainMetrics.error = error.message;
    }

    return domainMetrics;
  }

  async measureResponse(url) {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const request = https.get(url, { timeout: 10000 }, (response) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        response.on('data', () => {}); // Consume data
        response.on('end', () => {
          resolve({
            responseTime,
            statusCode: response.statusCode,
            headers: response.headers
          });
        });
      });

      request.on('error', (error) => {
        const endTime = performance.now();
        reject({
          error: error.message,
          responseTime: endTime - startTime
        });
      });

      request.on('timeout', () => {
        request.destroy();
        reject({ error: 'Timeout' });
      });
    });
  }

  checkDomainAlerts(domain, metrics) {
    const alerts = [];

    // Response time alert
    if (metrics.responseTime > this.crisisThresholds.responseTime) {
      alerts.push({
        type: 'RESPONSE_TIME_VIOLATION',
        severity: 'CRITICAL',
        domain,
        message: `Response time ${Math.round(metrics.responseTime)}ms exceeds crisis threshold ${this.crisisThresholds.responseTime}ms`,
        value: metrics.responseTime,
        threshold: this.crisisThresholds.responseTime,
        timestamp: Date.now()
      });
    }

    // Availability alert
    if (metrics.availability < this.crisisThresholds.availability) {
      alerts.push({
        type: 'AVAILABILITY_VIOLATION',
        severity: 'CRITICAL',
        domain,
        message: `Availability ${metrics.availability}% below threshold ${this.crisisThresholds.availability}%`,
        value: metrics.availability,
        threshold: this.crisisThresholds.availability,
        timestamp: Date.now()
      });
    }

    // Crisis resource alerts
    Object.entries(metrics.crisisResources).forEach(([endpoint, resource]) => {
      if (!resource.healthy) {
        alerts.push({
          type: 'CRISIS_RESOURCE_FAILURE',
          severity: 'CRITICAL',
          domain,
          endpoint,
          message: `Crisis resource ${endpoint} unhealthy: ${resource.responseTime}ms response time`,
          value: resource.responseTime,
          threshold: this.crisisThresholds.crisisResourceTime,
          timestamp: Date.now()
        });
      }
    });

    return alerts;
  }

  processAlerts(alerts) {
    // Add to alert history
    this.alertHistory.push(...alerts);

    // Log critical alerts
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
    
    if (criticalAlerts.length > 0) {
      console.log('🚨 CRITICAL ALERTS DETECTED:');
      criticalAlerts.forEach((alert, index) => {
        console.log(`   ${index + 1}. ${alert.domain} - ${alert.message}`);
      });

      // Save alert log
      this.saveAlertLog(criticalAlerts);
    }
  }

  saveAlertLog(alerts) {
    const alertLog = {
      timestamp: new Date().toISOString(),
      alerts: alerts.map(alert => ({
        ...alert,
        timestamp: new Date(alert.timestamp).toISOString()
      }))
    };

    const logPath = `./alerts-${new Date().toISOString().split('T')[0]}.json`;
    
    try {
      let existingLog = [];
      if (fs.existsSync(logPath)) {
        existingLog = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
      
      existingLog.push(alertLog);
      fs.writeFileSync(logPath, JSON.stringify(existingLog, null, 2));
      
      console.log(`💾 Alert log saved to: ${logPath}`);
    } catch (error) {
      console.error('❌ Failed to save alert log:', error.message);
    }
  }

  generateDashboardHTML() {
    const lastUpdate = new Date(this.metrics.timestamp).toLocaleString();
    const systemHealthColor = this.getHealthColor(this.metrics.systemHealth);
    const crisisReadinessColor = this.metrics.crisisReadiness ? '#10b981' : '#ef4444';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALCHM Production Monitoring Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            line-height: 1.6;
        }
        .header {
            background: linear-gradient(135deg, #1e293b, #334155);
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #334155;
        }
        .header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .header p { color: #94a3b8; }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 2rem;
        }
        .card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card h2 {
            color: #f1f5f9;
            margin-bottom: 1rem;
            font-size: 1.25rem;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #334155;
        }
        .metric:last-child { border-bottom: none; }
        .metric-label { color: #94a3b8; }
        .metric-value {
            font-weight: 600;
            font-size: 1.1rem;
        }
        .alert {
            background: #7f1d1d;
            border-left: 4px solid #ef4444;
            padding: 0.75rem;
            margin: 0.5rem 0;
            border-radius: 4px;
        }
        .alert-critical { background: #7f1d1d; border-left-color: #ef4444; }
        .alert-high { background: #7c2d12; border-left-color: #f97316; }
        .alert-medium { background: #713f12; border-left-color: #eab308; }
        .domain-status {
            margin: 1rem 0;
            padding: 1rem;
            background: #334155;
            border-radius: 6px;
        }
        .refresh-btn {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .refresh-btn:hover { background: #0284c7; }
        .crisis-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.1rem;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔥 ALCHM Production Monitor</h1>
        <p>Real-time trauma-informed performance monitoring | Last updated: ${lastUpdate}</p>
        <button class="refresh-btn" onclick="location.reload()">Refresh Now</button>
    </div>

    <div class="dashboard-grid">
        <!-- System Overview -->
        <div class="card">
            <h2>🎯 System Overview</h2>
            <div class="metric">
                <span class="metric-label">System Health</span>
                <div class="crisis-status">
                    <span class="status-indicator" style="background-color: ${systemHealthColor};"></span>
                    <span class="metric-value">${this.metrics.systemHealth.toUpperCase()}</span>
                </div>
            </div>
            <div class="metric">
                <span class="metric-label">Crisis Readiness</span>
                <div class="crisis-status">
                    <span class="status-indicator" style="background-color: ${crisisReadinessColor};"></span>
                    <span class="metric-value">${this.metrics.crisisReadiness ? 'READY' : 'NOT READY'}</span>
                </div>
            </div>
            <div class="metric">
                <span class="metric-label">Active Alerts</span>
                <span class="metric-value" style="color: ${this.metrics.alerts.length > 0 ? '#ef4444' : '#10b981'};">
                    ${this.metrics.alerts.length}
                </span>
            </div>
        </div>

        <!-- Domain Status -->
        ${Object.entries(this.metrics.domains).map(([domain, metrics]) => `
        <div class="card">
            <h2>🌐 ${domain.replace('https://', '')}</h2>
            <div class="metric">
                <span class="metric-label">Response Time</span>
                <span class="metric-value" style="color: ${this.getResponseTimeColor(metrics.responseTime)};">
                    ${Math.round(metrics.responseTime)}ms
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Status Code</span>
                <span class="metric-value" style="color: ${this.getStatusColor(metrics.statusCode)};">
                    ${metrics.statusCode}
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Availability</span>
                <span class="metric-value" style="color: ${this.getAvailabilityColor(metrics.availability)};">
                    ${metrics.availability}%
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Crisis Ready</span>
                <div class="crisis-status">
                    <span class="status-indicator" style="background-color: ${metrics.crisisReady ? '#10b981' : '#ef4444'};"></span>
                    <span class="metric-value">${metrics.crisisReady ? 'YES' : 'NO'}</span>
                </div>
            </div>
        </div>
        `).join('')}

        <!-- Active Alerts -->
        <div class="card">
            <h2>🚨 Active Alerts</h2>
            ${this.metrics.alerts.length === 0 ? 
                '<p style="color: #10b981;">✅ No active alerts - System healthy</p>' :
                this.metrics.alerts.map(alert => `
                <div class="alert alert-${alert.severity.toLowerCase()}">
                    <strong>${alert.type}</strong><br>
                    <small>${alert.domain}</small><br>
                    ${alert.message}
                </div>
                `).join('')
            }
        </div>

        <!-- Crisis Resources Status -->
        ${Object.entries(this.metrics.domains).map(([domain, domainMetrics]) => `
        <div class="card">
            <h2>🆘 Crisis Resources - ${domain.replace('https://', '')}</h2>
            ${Object.entries(domainMetrics.crisisResources || {}).map(([endpoint, resource]) => `
            <div class="metric">
                <span class="metric-label">${endpoint}</span>
                <div class="crisis-status">
                    <span class="status-indicator" style="background-color: ${resource.healthy ? '#10b981' : '#ef4444'};"></span>
                    <span class="metric-value">${Math.round(resource.responseTime)}ms</span>
                </div>
            </div>
            `).join('')}
        </div>
        `).join('')}
    </div>

    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
        
        // Real-time updates via API
        setInterval(async () => {
            try {
                const response = await fetch('/api/metrics');
                const metrics = await response.json();
                // Update metrics display without full page reload
                console.log('Updated metrics:', metrics);
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            }
        }, 10000);
    </script>
</body>
</html>`;
  }

  getHealthColor(health) {
    switch (health) {
      case 'healthy': return '#10b981';
      case 'degraded': case 'slow': return '#f59e0b';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getResponseTimeColor(time) {
    if (time <= 100) return '#10b981';
    if (time <= 500) return '#f59e0b';
    return '#ef4444';
  }

  getStatusColor(status) {
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#f59e0b';
    return '#ef4444';
  }

  getAvailabilityColor(availability) {
    if (availability >= 99.9) return '#10b981';
    if (availability >= 95) return '#f59e0b';
    return '#ef4444';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopMonitoring() {
    this.isMonitoring = false;
    console.log('🛑 Monitoring stopped');
  }
}

// Execute if run directly
if (require.main === module) {
  const dashboard = new ProductionMonitoringDashboard();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down monitoring dashboard...');
    dashboard.stopMonitoring();
    process.exit(0);
  });
  
  dashboard.startMonitoring().catch(console.error);
}

module.exports = ProductionMonitoringDashboard;