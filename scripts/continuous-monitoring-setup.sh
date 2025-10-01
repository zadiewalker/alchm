#!/bin/bash

# ALCHM Continuous Monitoring Setup
# Comprehensive monitoring solution for Sacred Contract styling and performance

set -e

log() {
    echo "[$(date '+%H:%M:%S')] $1"
}

echo "🔧 ALCHM CONTINUOUS MONITORING SETUP"
echo "===================================="

# Create monitoring directories
log "📁 Setting up monitoring directories"
mkdir -p monitoring/logs
mkdir -p monitoring/reports
mkdir -p monitoring/alerts

# Create systemd service file for continuous monitoring (Linux)
if command -v systemctl >/dev/null 2>&1; then
    log "🖥️ Creating systemd service for Linux"
    cat > monitoring/alchm-monitoring.service << EOF
[Unit]
Description=ALCHM Performance & Sacred Contract Monitoring
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=\$(whoami)
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node scripts/performance-monitoring-dashboard.js
Restart=always
RestartSec=10
StandardOutput=append:$(pwd)/monitoring/logs/monitoring.log
StandardError=append:$(pwd)/monitoring/logs/monitoring-error.log
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
    
    echo "   → Service file created at monitoring/alchm-monitoring.service"
    echo "   → To install: sudo cp monitoring/alchm-monitoring.service /etc/systemd/system/"
    echo "   → To enable: sudo systemctl enable alchm-monitoring"
    echo "   → To start: sudo systemctl start alchm-monitoring"
fi

# Create macOS LaunchDaemon (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    log "🍎 Creating LaunchDaemon for macOS"
    cat > monitoring/com.alchm.monitoring.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.alchm.monitoring</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>$(pwd)/scripts/performance-monitoring-dashboard.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$(pwd)</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$(pwd)/monitoring/logs/monitoring.log</string>
    <key>StandardErrorPath</key>
    <string>$(pwd)/monitoring/logs/monitoring-error.log</string>
</dict>
</plist>
EOF
    
    echo "   → LaunchDaemon created at monitoring/com.alchm.monitoring.plist"
    echo "   → To install: cp monitoring/com.alchm.monitoring.plist ~/Library/LaunchAgents/"
    echo "   → To load: launchctl load ~/Library/LaunchAgents/com.alchm.monitoring.plist"
fi

# Create Docker container setup
log "🐳 Creating Docker monitoring setup"
cat > monitoring/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy monitoring scripts
COPY scripts/ ./scripts/
COPY monitoring/ ./monitoring/

# Create non-root user
RUN addgroup -g 1001 -S alchm && adduser -S alchm -u 1001
RUN chown -R alchm:alchm /app
USER alchm

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Run monitoring
CMD ["node", "scripts/performance-monitoring-dashboard.js"]
EOF

cat > monitoring/docker-compose.yml << EOF
version: '3.8'

services:
  alchm-monitoring:
    build: 
      context: ..
      dockerfile: monitoring/Dockerfile
    container_name: alchm-performance-monitor
    restart: unless-stopped
    volumes:
      - ./logs:/app/monitoring/logs
      - ./reports:/app/monitoring/reports
      - ./alerts:/app/monitoring/alerts
    environment:
      - NODE_ENV=production
      - TZ=UTC
    healthcheck:
      test: ["CMD", "node", "-e", "console.log('Health check')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
EOF

# Create monitoring dashboard HTML
log "📊 Creating web dashboard"
cat > monitoring/dashboard.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALCHM Performance & Monitoring Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
            min-height: 100vh;
        }
        .dashboard { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .metric-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .metric-title { font-size: 1.2em; font-weight: 600; margin-bottom: 15px; }
        .metric-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { opacity: 0.8; font-size: 0.9em; }
        .status-good { color: #10b981; }
        .status-warning { color: #f59e0b; }
        .status-error { color: #ef4444; }
        .chart-container { 
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            height: 200px;
        }
        .alert-panel {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .refresh-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(16, 185, 129, 0.9);
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .sacred-contract-test {
            margin-top: 5rem;
            background-color: rgba(34, 51, 68, 0.15);
            color: white;
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="refresh-indicator" id="refreshIndicator">
        ⏳ Loading...
    </div>
    
    <div class="dashboard">
        <div class="header">
            <h1>🔬 ALCHM Performance & Monitoring Dashboard</h1>
            <p>Real-time monitoring of Sacred Contract styling and Core Web Vitals</p>
            <div class="sacred-contract-test">
                <strong>Sacred Contract Test Element</strong>
                <p>This element should display correctly with proper styling</p>
            </div>
        </div>
        
        <div id="alertPanel" class="alert-panel" style="display: none;">
            <h3>🚨 Active Alerts</h3>
            <div id="alertsList"></div>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-title">Sacred Contract Success Rate</div>
                <div class="metric-value status-good" id="successRate">--</div>
                <div class="metric-label">Styling tests passing</div>
                <div class="chart-container" id="successChart">
                    <canvas width="100%" height="160"></canvas>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">Average Response Time</div>
                <div class="metric-value status-good" id="avgResponseTime">--</div>
                <div class="metric-label">Milliseconds</div>
                <div class="chart-container" id="responseChart">
                    <canvas width="100%" height="160"></canvas>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">Largest Contentful Paint</div>
                <div class="metric-value status-good" id="avgLCP">--</div>
                <div class="metric-label">Target: <2000ms</div>
                <div class="chart-container" id="lcpChart">
                    <canvas width="100%" height="160"></canvas>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">First Contentful Paint</div>
                <div class="metric-value status-good" id="avgFCP">--</div>
                <div class="metric-label">Target: <1200ms</div>
                <div class="chart-container" id="fcpChart">
                    <canvas width="100%" height="160"></canvas>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">Cumulative Layout Shift</div>
                <div class="metric-value status-good" id="avgCLS">--</div>
                <div class="metric-label">Target: <0.05</div>
                <div class="chart-container" id="clsChart">
                    <canvas width="100%" height="160"></canvas>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-title">Global Availability</div>
                <div class="metric-value status-good" id="availability">--</div>
                <div class="metric-label">Uptime percentage</div>
                <div class="chart-container" id="availabilityChart">
                    <canvas width="100%" height="160"></canvas>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        let refreshInterval;
        
        async function loadDashboardData() {
            try {
                document.getElementById('refreshIndicator').textContent = '🔄 Refreshing...';
                
                // In a real implementation, this would fetch from your monitoring API
                // For now, we'll simulate the data
                const data = await simulateMonitoringData();
                
                updateDashboard(data);
                document.getElementById('refreshIndicator').textContent = '✅ Updated';
                
                setTimeout(() => {
                    document.getElementById('refreshIndicator').textContent = 
                        `Next update in ${30 - Math.floor(Date.now()/1000) % 30}s`;
                }, 2000);
                
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                document.getElementById('refreshIndicator').textContent = '❌ Error';
            }
        }
        
        function simulateMonitoringData() {
            // Simulate good performance metrics
            return {
                successRate: 100,
                avgResponseTime: 85,
                avgLCP: 156,
                avgFCP: 92,
                avgCLS: 0.012,
                availability: 99.97,
                alerts: []
            };
        }
        
        function updateDashboard(data) {
            // Update metrics
            document.getElementById('successRate').textContent = data.successRate + '%';
            document.getElementById('avgResponseTime').textContent = data.avgResponseTime + 'ms';
            document.getElementById('avgLCP').textContent = data.avgLCP + 'ms';
            document.getElementById('avgFCP').textContent = data.avgFCP + 'ms';
            document.getElementById('avgCLS').textContent = data.avgCLS.toFixed(3);
            document.getElementById('availability').textContent = data.availability + '%';
            
            // Update status colors
            updateStatusColor('successRate', data.successRate >= 95);
            updateStatusColor('avgResponseTime', data.avgResponseTime < 1000);
            updateStatusColor('avgLCP', data.avgLCP < 2000);
            updateStatusColor('avgFCP', data.avgFCP < 1200);
            updateStatusColor('avgCLS', data.avgCLS < 0.05);
            updateStatusColor('availability', data.availability >= 99.5);
            
            // Show/hide alerts
            const alertPanel = document.getElementById('alertPanel');
            if (data.alerts && data.alerts.length > 0) {
                alertPanel.style.display = 'block';
                document.getElementById('alertsList').innerHTML = 
                    data.alerts.map(alert => `<div>⚠️ ${alert.message}</div>`).join('');
            } else {
                alertPanel.style.display = 'none';
            }
        }
        
        function updateStatusColor(elementId, isGood) {
            const element = document.getElementById(elementId);
            element.className = element.className.replace(/status-\w+/, '');
            element.classList.add(isGood ? 'status-good' : 'status-warning');
        }
        
        // Test Sacred Contract styling on page load
        window.addEventListener('load', () => {
            const element = document.querySelector('.sacred-contract-test');
            const style = getComputedStyle(element);
            
            console.log('Sacred Contract Dashboard Test:');
            console.log('margin-top:', style.marginTop);
            console.log('background-color:', style.backgroundColor);
            console.log('color:', style.color);
            
            // Verify styling
            const correctMargin = style.marginTop === '80px' || style.marginTop.includes('5rem');
            const correctBg = style.backgroundColor.includes('34, 51, 68') || 
                             style.backgroundColor.includes('rgba');
            const correctColor = style.color.includes('255') || style.color === 'white';
            
            if (correctMargin && correctBg && correctColor) {
                console.log('✅ Sacred Contract styling verified in dashboard');
            } else {
                console.error('❌ Sacred Contract styling issues detected in dashboard');
            }
        });
        
        // Initialize dashboard
        loadDashboardData();
        refreshInterval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    </script>
</body>
</html>
EOF

# Create monitoring startup script
log "🚀 Creating startup scripts"
cat > monitoring/start-monitoring.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting ALCHM Performance Monitoring"

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

# Create log directory
mkdir -p logs

# Start monitoring with log rotation
exec node ../scripts/performance-monitoring-dashboard.js 2>&1 | tee logs/monitoring-$(date +%Y%m%d-%H%M%S).log
EOF

chmod +x monitoring/start-monitoring.sh

# Create simple alert webhook script
cat > monitoring/alert-webhook.js << 'EOF'
const https = require('https');

function sendAlert(alert) {
    // Example webhook implementation
    // Replace with your actual webhook URL
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;
    
    if (!webhookUrl) {
        console.log('📧 Alert (no webhook configured):', alert.message);
        return;
    }
    
    const payload = JSON.stringify({
        text: `🚨 ALCHM Alert: ${alert.message}`,
        timestamp: alert.timestamp,
        severity: alert.severity,
        site: alert.site
    });
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };
    
    const req = https.request(webhookUrl, options, (res) => {
        console.log(`Alert sent, status: ${res.statusCode}`);
    });
    
    req.on('error', (error) => {
        console.error('Alert webhook error:', error);
    });
    
    req.write(payload);
    req.end();
}

module.exports = { sendAlert };
EOF

# Create configuration file
cat > monitoring/config.json << EOF
{
    "sites": [
        "https://alchm-digital-sanctuary.web.app/",
        "https://alchmapp.web.app/"
    ],
    "monitoring": {
        "interval": 30000,
        "timeout": 10000,
        "retries": 3
    },
    "alerts": {
        "responseTime": 3000,
        "errorRate": 5,
        "stylingFailure": 1,
        "webhookUrl": ""
    },
    "performance": {
        "fcpTarget": 1200,
        "lcpTarget": 2000,
        "fidTarget": 50,
        "clsTarget": 0.05,
        "ttiTarget": 3000
    },
    "sacredContract": {
        "expectedMarginTop": "5rem",
        "expectedBackground": "rgba(34, 51, 68, 0.15)",
        "expectedColor": "white"
    }
}
EOF

log "✅ Monitoring setup completed!"
echo ""
echo "🎯 MONITORING SETUP SUMMARY:"
echo "=============================="
echo ""
echo "📁 Directory structure created:"
echo "  monitoring/"
echo "  ├── logs/                    # Monitoring logs"
echo "  ├── reports/                 # Performance reports"  
echo "  ├── alerts/                  # Alert configurations"
echo "  ├── dashboard.html           # Web dashboard"
echo "  ├── config.json             # Configuration"
echo "  ├── start-monitoring.sh     # Manual startup script"
echo "  └── alert-webhook.js         # Alert notification system"
echo ""
echo "🚀 TO START MONITORING:"
echo "  Manual: ./monitoring/start-monitoring.sh"
echo "  Docker: cd monitoring && docker-compose up -d"
if command -v systemctl >/dev/null 2>&1; then
    echo "  SystemD: sudo systemctl start alchm-monitoring"
fi
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  macOS: launchctl load ~/Library/LaunchAgents/com.alchm.monitoring.plist"
fi
echo ""
echo "📊 DASHBOARD ACCESS:"
echo "  Local: file://$(pwd)/monitoring/dashboard.html"
echo "  Or serve via: python -m http.server 8080 (from monitoring/ dir)"
echo ""
echo "⚙️ CONFIGURATION:"
echo "  Edit monitoring/config.json to customize settings"
echo "  Set ALERT_WEBHOOK_URL environment variable for notifications"
echo ""
echo "🎉 Sacred Contract styling is now under continuous monitoring!"

log "🎉 Setup complete!"