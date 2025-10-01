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
