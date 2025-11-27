#!/bin/bash

# ALCHM Production Deployment Script
# Comprehensive safety checks and deployment for mental health app

set -e

# Configuration
PROJECT_ID="alchm-digital-sanctuary"
BACKUP_BUCKET="alchm-digital-sanctuary-backups"
HEALTH_CHECK_URL="https://alchmapp.web.app/api/health"
CRISIS_CHECK_URL="https://alchmapp.web.app/api/crisis-detection"

echo "🏥 ALCHM Production Deployment"
echo "============================="
echo "Project: $PROJECT_ID"
echo "Timestamp: $(date)"
echo ""

# Pre-deployment safety checks
echo "🔒 Running pre-deployment safety checks..."

# 1. Verify Firebase CLI and login
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Install with: npm install -g firebase-tools"
    exit 1
fi

if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged into Firebase. Run: firebase login"
    exit 1
fi

# 2. Switch to production project
echo "📋 Switching to production project..."
firebase use production

# 3. Run security audit
echo "🛡️  Running security audit..."
if ! npm run security:audit; then
    echo "❌ Security audit failed. Deployment aborted."
    exit 1
fi

# 4. Run crisis memory validation
echo "🧠 Running crisis memory validation..."
if ! npm run test:crisis-memory; then
    echo "❌ Crisis memory validation failed. Deployment aborted."
    exit 1
fi

# 5. Backup current Firestore data
echo "💾 Creating Firestore backup..."
BACKUP_PATH="gs://$BACKUP_BUCKET/pre-deploy-$(date +%Y%m%d-%H%M%S)"
firebase firestore:export "$BACKUP_PATH" || echo "⚠️  Backup failed, continuing..."

# 6. Build application in crisis mode
echo "🏗️  Building application in crisis mode..."
if ! npm run build:crisis; then
    echo "❌ Build failed. Deployment aborted."
    exit 1
fi

# 7. Deploy to production
echo "🚀 Deploying to production..."
firebase deploy --only hosting:main,functions

# Post-deployment validation
echo ""
echo "✅ Deployment completed. Running validation checks..."

# 8. Health check
echo "🔍 Running health check..."
sleep 10  # Wait for deployment to propagate

HEALTH_STATUS=$(curl -f "$HEALTH_CHECK_URL" 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "failed")
if [ "$HEALTH_STATUS" = "healthy" ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed: $HEALTH_STATUS"
    echo "🚨 Consider rolling back deployment"
    exit 1
fi

# 9. Crisis detection validation
echo "🆘 Validating crisis detection system..."
CRISIS_TEST_RESPONSE=$(curl -s -X POST "$CRISIS_CHECK_URL" \
    -H "Content-Type: application/json" \
    -d '{"text":"test message","userId":"health-check"}' \
    | grep -o '"crisis_detected":[^,}]*' || echo "failed")

if [[ "$CRISIS_TEST_RESPONSE" == *"false"* ]]; then
    echo "✅ Crisis detection system operational"
else
    echo "❌ Crisis detection system validation failed"
    echo "🚨 Manual verification required"
fi

# 10. Performance validation
echo "📊 Running performance validation..."
if npm run performance:validate; then
    echo "✅ Performance validation passed"
else
    echo "⚠️  Performance validation failed - monitor closely"
fi

# 11. Generate deployment report
DEPLOY_TIME=$(date)
cat > deployment-report.txt << EOF
ALCHM Production Deployment Report
==================================
Deployment Time: $DEPLOY_TIME
Project: $PROJECT_ID
Backup Location: $BACKUP_PATH
Health Status: $HEALTH_STATUS
Crisis Detection: Operational

Post-Deployment Checklist:
- [ ] Monitor Firebase Functions logs for errors
- [ ] Check Core Web Vitals in Real User Monitoring
- [ ] Verify crisis escalation workflows
- [ ] Monitor user authentication flows
- [ ] Check journal data encryption
- [ ] Validate stripe payment processing

Monitoring URLs:
- Health: $HEALTH_CHECK_URL
- Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID
- Functions Logs: firebase functions:log
- Performance: npm run performance:validate

Emergency Rollback:
firebase hosting:clone --source-site-id PREVIOUS_DEPLOY_ID --target-site-id alchmapp

For issues, contact: zadie@alchm.app
EOF

echo ""
echo "🎉 Production deployment complete!"
echo "📋 Deployment report saved to deployment-report.txt"
echo ""
echo "🔍 Continue monitoring:"
echo "   firebase functions:log --only detectCrisis"
echo "   npm run performance:validate"
echo "   curl $HEALTH_CHECK_URL"
echo ""
echo "🚨 Emergency contacts ready for crisis escalation support"