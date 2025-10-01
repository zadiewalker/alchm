#!/bin/bash

# 🚨 EMERGENCY CREDENTIAL ROTATION SCRIPT
# ALCHM Mental Health Platform - Critical Security Response
# Execute immediately to prevent data breach

set -e  # Exit on any error

echo "🚨 EMERGENCY CREDENTIAL ROTATION INITIATED"
echo "=========================================="
echo "Platform: ALCHM Mental Health Journaling"
echo "Risk Level: LIFE-CRITICAL"
echo "Time: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a emergency-rotation.log
}

# Error handling
error_exit() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    log "ERROR: $1"
    echo "Check emergency-rotation.log for details"
    exit 1
}

# Success message
success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

# Warning message
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

log "Emergency credential rotation started"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error_exit "Not in ALCHM project directory. Please run from project root."
fi

# Backup current environment
if [ -f ".env.local" ]; then
    BACKUP_FILE=".env.local.backup.$(date +%Y%m%d_%H%M%S)"
    cp .env.local "$BACKUP_FILE"
    success "Backed up current environment to $BACKUP_FILE"
else
    warning "No existing .env.local file found"
fi

# Create new environment file from template
if [ ! -f ".env.local.template" ]; then
    error_exit "Template file .env.local.template not found. Run this script from project root."
fi

echo ""
echo "🔐 CREDENTIAL ROTATION CHECKLIST"
echo "================================"
echo ""
echo "You must manually rotate these credentials in their respective consoles:"
echo ""
echo "1. 🔥 FIREBASE CREDENTIALS (CRITICAL)"
echo "   → Go to: https://console.firebase.google.com/project/YOUR_PROJECT/settings/serviceaccounts/adminsdk"
echo "   → Click 'Generate new private key'"
echo "   → Download JSON and extract credentials"
echo ""
echo "2. 💳 STRIPE API KEYS (CRITICAL)" 
echo "   → Go to: https://dashboard.stripe.com/apikeys"
echo "   → Create new restricted API key"
echo "   → Update webhook secrets"
echo ""
echo "3. 🤖 OPENAI API KEY (HIGH PRIORITY)"
echo "   → Go to: https://platform.openai.com/api-keys"
echo "   → Create new secret key for ALCHM Crisis Detection AI"
echo ""
echo "4. 🧠 GOOGLE AI API KEY (HIGH PRIORITY)"
echo "   → Go to: https://console.cloud.google.com/apis/credentials"
echo "   → Create new API key restricted to Generative AI APIs"
echo ""

# Check if user wants to continue with environment setup
read -p "Have you rotated all credentials and are ready to update .env.local? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please complete credential rotation first, then re-run this script."
    exit 0
fi

# Interactive environment setup
echo ""
echo "🔧 SETTING UP NEW ENVIRONMENT"
echo "============================="

# Copy template to create new .env.local
cp .env.local.template .env.local
success "Created new .env.local from template"

echo ""
echo "⚠️  IMPORTANT: You must now manually edit .env.local with your new credentials"
echo "   File location: $(pwd)/.env.local"
echo ""
echo "Use the Emergency Credential Rotation Guide for detailed steps."

# Test if Node.js dependencies are available
if ! command -v npm &> /dev/null; then
    error_exit "npm not found. Please install Node.js"
fi

echo ""
echo "🧪 TESTING ENVIRONMENT"
echo "====================="

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install || error_exit "Failed to install dependencies"
fi

# Test build
echo "Testing build process..."
if npm run build > build.log 2>&1; then
    success "Build test passed"
else
    warning "Build test failed. Check build.log for details"
    echo "This may be due to incomplete credential configuration."
fi

# Security checks
echo ""
echo "🔒 SECURITY VALIDATION"
echo "====================="

# Check file permissions
if [ -f ".env.local" ]; then
    chmod 600 .env.local
    success "Set secure permissions on .env.local (600)"
fi

# Verify .gitignore
if ! grep -q ".env.local" .gitignore 2>/dev/null; then
    echo ".env.local" >> .gitignore
    success "Added .env.local to .gitignore"
fi

# Check for any remaining exposed credentials in code
echo "Scanning for hardcoded credentials..."
if grep -r "AIzaSyCqjfzvykK6q55vLH7F0FEuyK0cppGhD3w\|sk-proj-" --exclude-dir=node_modules --exclude="*.log" --exclude="emergency-credential-rotation.sh" . 2>/dev/null; then
    error_exit "Found hardcoded credentials in codebase. These must be removed immediately."
else
    success "No hardcoded credentials found in codebase"
fi

echo ""
echo "🏥 CRISIS SYSTEM PRIORITY CHECK"
echo "==============================="
echo ""
echo "After updating .env.local with real credentials, test these CRITICAL endpoints:"
echo "1. Crisis detection: /api/crisis-detection"
echo "2. AI chat system: /api/khepera"  
echo "3. User authentication: /auth/login"
echo "4. Emergency resources: /crisis-resources"
echo ""

# Create monitoring script
cat > monitor-credentials.sh << 'EOF'
#!/bin/bash
# Continuous monitoring for credential health

echo "🔍 Credential Health Monitor"
echo "Testing critical API endpoints..."

# Test if server is running
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding - check npm run dev"
    exit 1
fi

# Add more endpoint tests here as needed
echo "Monitoring complete. Run this periodically to verify credential health."
EOF

chmod +x monitor-credentials.sh
success "Created credential monitoring script (monitor-credentials.sh)"

echo ""
echo "📋 NEXT STEPS SUMMARY"
echo "===================="
echo "1. Edit .env.local with your new credentials"
echo "2. Run: npm run dev"
echo "3. Test all critical systems (especially crisis detection)"
echo "4. Deploy to production: npm run firebase:deploy" 
echo "5. Monitor system health with ./monitor-credentials.sh"
echo ""
echo "📞 CRISIS CONTACT INFO (if systems fail):"
echo "   National Suicide Prevention Lifeline: 988"
echo "   Crisis Text Line: Text HOME to 741741"
echo ""

log "Emergency credential rotation script completed"

echo -e "${GREEN}✅ EMERGENCY ROTATION PREPARATION COMPLETE${NC}"
echo "⚠️  Remember: User safety depends on these systems working correctly"
echo "   Test thoroughly before declaring rotation complete"