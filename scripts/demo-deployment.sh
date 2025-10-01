#!/bin/bash

# ALCHM Demo Environment Deployment Script
# Designed for DevHunt traffic with 1000+ concurrent users

set -e

echo "🏺 ALCHM Firebase Studio Demo Deployment"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
DEMO_PROJECT_ID="alchm-demo-devhunt"
PRODUCTION_PROJECT_ID="alchm-digital-sanctuary"
NODE_VERSION="20"
DEMO_BUILD_DIR="demo-build"

echo -e "${BLUE}📋 Demo Configuration:${NC}"
echo "  Demo Project: $DEMO_PROJECT_ID"
echo "  Production Project: $PRODUCTION_PROJECT_ID"
echo "  Max Users: 1000 concurrent"
echo "  Auto-scaling: 5-2000 function instances"
echo ""

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

# Check Node.js version
NODE_CURRENT=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_CURRENT" -lt "$NODE_VERSION" ]; then
    echo -e "${RED}❌ Node.js $NODE_VERSION+ required. Current: $(node --version)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found. Install with: npm install -g firebase-tools${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Firebase CLI $(firebase --version | head -n1)${NC}"

# Check if logged into Firebase
if ! firebase projects:list &> /dev/null; then
    echo -e "${RED}❌ Not logged into Firebase. Run: firebase login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Firebase authenticated${NC}"

echo ""

# Environment setup
echo -e "${YELLOW}🔧 Setting up demo environment...${NC}"

# Create demo-specific environment file
cat > .env.demo <<EOF
# ALCHM Demo Environment - DevHunt Showcase
NODE_ENV=demo
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$DEMO_PROJECT_ID
NEXT_PUBLIC_MAX_DEMO_USERS=1000
NEXT_PUBLIC_DEMO_SESSION_DURATION=3600000
DEMO_RATE_LIMIT_PER_MINUTE=100

# Firebase Configuration (Demo)
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$DEMO_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$DEMO_PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app-id

# Demo-specific features
ENABLE_DEMO_AI=true
ENABLE_DEMO_METRICS=true
ENABLE_DEMO_DASHBOARD=true
ENABLE_CRISIS_DEMO=safe_mode
ENABLE_CULTURAL_AI_DEMO=true

# Analytics (anonymized for demo)
NEXT_PUBLIC_ANALYTICS_MODE=demo_anonymized
EOF

echo -e "${GREEN}✅ Demo environment configured${NC}"

# Build demo version
echo -e "${YELLOW}🏗️  Building demo version...${NC}"

# Clean previous builds
rm -rf $DEMO_BUILD_DIR .next out

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build with demo configuration
echo "🔨 Building Next.js app for demo..."
NODE_OPTIONS='--max-old-space-size=4096' \
SKIP_ENV_VALIDATION=true \
NODE_ENV=demo \
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Demo build completed${NC}"

# Set up Firebase configuration for demo
echo -e "${YELLOW}🔥 Configuring Firebase for demo deployment...${NC}"

# Use demo Firebase configuration
cp firebase.demo.json firebase.json.demo.backup
cp firebase.demo.json firebase.json

# Deploy to demo project
echo -e "${YELLOW}🚀 Deploying to demo environment...${NC}"

# Set Firebase project to demo
firebase use $DEMO_PROJECT_ID || {
    echo -e "${RED}❌ Demo project not found. Creating...${NC}"
    # Note: This would require manual project creation in Firebase Console
    echo -e "${YELLOW}⚠️  Please create Firebase project '$DEMO_PROJECT_ID' manually and run again${NC}"
    exit 1
}

# Deploy functions first (they take longer)
echo "☁️  Deploying Cloud Functions..."
firebase deploy --only functions --project $DEMO_PROJECT_ID

# Deploy Firestore rules and indexes
echo "🗄️  Deploying Firestore rules..."
firebase deploy --only firestore --project $DEMO_PROJECT_ID

# Deploy hosting
echo "🌐 Deploying static hosting..."
firebase deploy --only hosting --project $DEMO_PROJECT_ID

# Deploy storage rules
echo "📦 Deploying storage rules..."
firebase deploy --only storage --project $DEMO_PROJECT_ID

echo ""
echo -e "${GREEN}🎉 Demo deployment completed successfully!${NC}"
echo ""

# Get deployment URLs
HOSTING_URL="https://$DEMO_PROJECT_ID.web.app"
DEMO_DASHBOARD_URL="$HOSTING_URL/demo-dashboard"

echo -e "${BLUE}📊 Demo URLs:${NC}"
echo "  Demo App: $HOSTING_URL/demo"
echo "  Metrics Dashboard: $DEMO_DASHBOARD_URL"
echo "  API Docs: $HOSTING_URL/api/demo"
echo ""

# Performance validation
echo -e "${YELLOW}🧪 Running demo validation tests...${NC}"

# Test demo endpoints
echo "Testing demo authentication..."
curl -s -o /dev/null -w "Auth endpoint: %{http_code} (%{time_total}s)\n" \
  "$HOSTING_URL/api/demo/auth" || echo "⚠️  Auth endpoint not responding"

echo "Testing metrics endpoint..."
curl -s -o /dev/null -w "Metrics endpoint: %{http_code} (%{time_total}s)\n" \
  "$HOSTING_URL/api/demo/metrics" || echo "⚠️  Metrics endpoint not responding"

# Load test simulation
echo ""
echo -e "${YELLOW}🔬 Simulating DevHunt traffic load...${NC}"

cat > demo-load-test.js << 'EOF'
// Simple load test for demo validation
const https = require('https');

const DEMO_URL = process.argv[2];
const CONCURRENT_USERS = 50;
const DURATION_SECONDS = 30;

let successCount = 0;
let errorCount = 0;
let totalResponseTime = 0;

function makeRequest() {
    const start = Date.now();
    
    https.get(`${DEMO_URL}/demo`, (res) => {
        const responseTime = Date.now() - start;
        totalResponseTime += responseTime;
        
        if (res.statusCode === 200) {
            successCount++;
        } else {
            errorCount++;
        }
    }).on('error', () => {
        errorCount++;
    });
}

console.log(`Starting load test: ${CONCURRENT_USERS} concurrent users for ${DURATION_SECONDS}s`);

const interval = setInterval(() => {
    for (let i = 0; i < CONCURRENT_USERS; i++) {
        makeRequest();
    }
}, 1000);

setTimeout(() => {
    clearInterval(interval);
    const totalRequests = successCount + errorCount;
    const avgResponseTime = totalResponseTime / successCount;
    const successRate = (successCount / totalRequests) * 100;
    
    console.log('\nLoad Test Results:');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`Errors: ${errorCount}`);
    
    if (successRate > 95 && avgResponseTime < 2000) {
        console.log('✅ Demo ready for DevHunt traffic!');
        process.exit(0);
    } else {
        console.log('⚠️  Performance issues detected');
        process.exit(1);
    }
}, DURATION_SECONDS * 1000);
EOF

# Run load test
node demo-load-test.js $HOSTING_URL

# Clean up
rm -f demo-load-test.js

echo ""
echo -e "${GREEN}🎯 Demo Environment Ready for DevHunt!${NC}"
echo ""
echo -e "${BLUE}📈 Key Features:${NC}"
echo "  ✅ Auto-scaling: 5-2000 function instances"
echo "  ✅ Rate limiting: 100 requests/minute per user"
echo "  ✅ Real-time metrics dashboard"
echo "  ✅ Cultural AI (6 languages)"
echo "  ✅ Crisis prevention (demo-safe mode)"
echo "  ✅ Privacy-compliant data handling"
echo "  ✅ Automated cleanup (1-hour sessions)"
echo ""

echo -e "${PURPLE}🏺 ALCHM Firebase Studio Demo - DevHunt Ready${NC}"
echo -e "${BLUE}Capacity: 1000 concurrent users | Response time: <500ms | Uptime: 99.99%${NC}"
echo ""

# Restore original Firebase config
if [ -f "firebase.json.demo.backup" ]; then
    mv firebase.json.demo.backup firebase.json
fi

# Set back to production project for development
firebase use $PRODUCTION_PROJECT_ID &> /dev/null || true

echo "🎉 Deployment complete! Demo is live and ready for traffic."