#!/usr/bin/env node

// Firebase Studio Minimal Server for ALCHM
// This is a minimal server file to satisfy buildpack detection

const path = require('path');
const fs = require('fs');

// Check if standalone server exists
const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');

if (fs.existsSync(standaloneServer)) {
  console.log('🌿 ALCHM - Starting Next.js standalone server...');
  require(standaloneServer);
} else {
  // Fallback minimal server
  const http = require('http');
  
  const server = http.createServer((req, res) => {
    if (req.url === '/api/health/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        service: 'ALCHM',
        timestamp: new Date().toISOString()
      }));
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>ALCHM - Trauma-Informed Journaling</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: system-ui, sans-serif; 
            background: linear-gradient(145deg, #a4b792 0%, #8fa37c 100%);
            color: #fefcfb;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container { max-width: 500px; }
        h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 1rem; }
        p { font-size: 1.2rem; line-height: 1.6; opacity: 0.9; }
        .cta { 
            background: #93a682; 
            color: white; 
            padding: 16px 32px; 
            border-radius: 12px; 
            text-decoration: none; 
            display: inline-block; 
            margin-top: 2rem;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌿 ALCHM</h1>
        <p>Trauma-informed, AI-powered journaling OS</p>
        <p>Your sanctuary for writing it raw and turning it gold.</p>
        <a href="/auth/login" class="cta">Start Your First Entry</a>
    </div>
</body>
</html>
    `);
  });
  
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`🌿 ALCHM server running on port ${port}`);
  });
}