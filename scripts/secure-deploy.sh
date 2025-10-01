#!/bin/bash

# ALCHM Secure Deployment Script
# Production-grade deployment with comprehensive security validation
# 
# CRITICAL: This script deploys a mental health platform serving vulnerable users
# Every security check is essential for user protection

set -euo pipefail  # Exit on any error, undefined variable, or pipe failure

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
readonly LOG_FILE="$PROJECT_ROOT/deployment.log"
readonly TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo -e "${timestamp} [${level}] ${message}" >> "$LOG_FILE"
    
    case "$level" in
        "ERROR")   echo -e "${RED}❌ ${message}${NC}" ;;
        "SUCCESS") echo -e "${GREEN}✅ ${message}${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  ${message}${NC}" ;;
        "INFO")    echo -e "${BLUE}ℹ️  ${message}${NC}" ;;
        *)         echo -e "${message}" ;;
    esac
}

# Error handler
error_handler() {
    local line_number=$1
    log "ERROR" "Deployment failed at line ${line_number}"
    log "ERROR" "Check ${LOG_FILE} for full details"
    exit 1
}

trap 'error_handler ${LINENO}' ERR

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                        ALCHM SECURE DEPLOYMENT                               ║"
echo "║                   Mental Health Platform - Production Ready                  ║"
echo "║                                                                              ║"
echo "║  🛡️  Zero credential exposure                                               ║"
echo "║  🔒  Firebase Studio compliance                                             ║"
echo "║  🚨  Crisis system continuity                                               ║"
echo "║  🌟  Trauma-informed deployment                                             ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$PROJECT_ROOT"

# Pre-deployment validation
log "INFO" "Starting ALCHM secure deployment validation..."

# 1. Environment Configuration Validation
log "INFO" "Step 1: Validating environment configuration..."

if [[ ! -f ".env.local" ]]; then
    log "ERROR" ".env.local file not found"
    log "ERROR" "Copy .env.example to .env.local and configure your secrets"
    exit 1
fi

# Check for critical environment variables (without exposing values)
check_env_var() {
    local var_name="$1"
    local var_description="$2"
    
    if grep -q "^${var_name}=" .env.local; then
        local value=$(grep "^${var_name}=" .env.local | cut -d'=' -f2- | tr -d '"')
        if [[ -z "$value" || "$value" == "your_"* || "$value" == "example_"* ]]; then
            log "ERROR" "${var_description} not configured properly"
            return 1
        fi
        log "SUCCESS" "${var_description} configured"
    else
        log "ERROR" "${var_name} not found in .env.local"
        return 1
    fi
}

# Validate critical configuration
check_env_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "Firebase Project ID"
check_env_var "FIREBASE_PRIVATE_KEY" "Firebase Admin Private Key"
check_env_var "STRIPE_SECRET_KEY" "Stripe Secret Key"
check_env_var "GOOGLE_AI_API_KEY" "Google AI API Key"
check_env_var "OPENAI_API_KEY" "OpenAI API Key"
check_env_var "NEXTAUTH_SECRET" "NextAuth Secret"

# 2. Dependencies and Build Validation
log "INFO" "Step 2: Validating dependencies and build..."

# Clean install
log "INFO" "Installing dependencies..."
npm ci

# Type checking
log "INFO" "Running TypeScript validation..."
npm run type-check || {
    log "ERROR" "TypeScript validation failed"
    exit 1
}

# Linting
log "INFO" "Running ESLint validation..."
npm run lint || {
    log "ERROR" "ESLint validation failed"
    exit 1
}

# Build validation
log "INFO" "Building production version..."
npm run build || {
    log "ERROR" "Production build failed"
    exit 1
}

# 3. Security Validation
log "INFO" "Step 3: Running security validation..."

# Check for credential exposure
log "INFO" "Scanning for exposed credentials..."
if grep -r "sk_live_\|sk_test_\|AIzaSy\|-----BEGIN PRIVATE KEY-----" out/ 2>/dev/null; then
    log "ERROR" "Exposed credentials found in build output"
    exit 1
fi
log "SUCCESS" "No credentials exposed in build output"

# Validate Firebase configuration
log "INFO" "Validating Firebase configuration..."
node -e "
const { validateEnvironmentVariables } = require('./src/lib/config.ts');
const result = validateEnvironmentVariables();
if (!result.success) {
    console.error('Configuration validation failed:', result.errors);
    process.exit(1);
}
console.log('✅ Configuration validation passed');
" || {
    log "ERROR" "Configuration validation failed"
    exit 1
}

# 4. Crisis System Validation
log "INFO" "Step 4: Validating crisis detection systems..."

# Test crisis detection endpoint
log "INFO" "Testing crisis detection availability..."
node -e "
const { getServerConfig } = require('./src/lib/config.ts');
try {
    const config = getServerConfig();
    if (!config.ai.openaiApiKey) throw new Error('OpenAI API key not configured');
    if (!config.ai.googleApiKey) throw new Error('Google AI API key not configured');
    console.log('✅ Crisis detection systems configured');
} catch (error) {
    console.error('❌ Crisis detection validation failed:', error.message);
    process.exit(1);
}
"

# 5. Firebase Functions Preparation
log "INFO" "Step 5: Preparing Firebase Functions..."

cd functions
npm ci
npm run build || {
    log "ERROR" "Firebase Functions build failed"
    exit 1
}
cd ..

# 6. Pre-deployment Security Scan
log "INFO" "Step 6: Final security scan..."

# Check for any remaining development artifacts
if find out/ -name "*.map" -o -name "*.dev.*" | grep -q .; then
    log "WARNING" "Development artifacts found in build output"
fi

# Validate bundle size for crisis response speed
BUNDLE_SIZE=$(du -sm out/ | cut -f1)
if [[ $BUNDLE_SIZE -gt 50 ]]; then
    log "WARNING" "Bundle size is ${BUNDLE_SIZE}MB - may impact crisis response speed"
fi

# 7. Firebase Deployment
log "INFO" "Step 7: Deploying to Firebase..."

# Validate Firebase project
firebase use --project $(grep "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local | cut -d'=' -f2 | tr -d '"') || {
    log "ERROR" "Failed to select Firebase project"
    exit 1
}

# Deploy with comprehensive validation
log "INFO" "Deploying to Firebase Studio..."
firebase deploy --force || {
    log "ERROR" "Firebase deployment failed"
    exit 1
}

# 8. Post-deployment Validation
log "INFO" "Step 8: Post-deployment validation..."

# Extract deployed URL
DEPLOYED_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d'=' -f2 | tr -d '"')

# Health check
log "INFO" "Performing health check..."
if curl -f -s "$DEPLOYED_URL/api/health" > /dev/null; then
    log "SUCCESS" "Health check passed"
else
    log "ERROR" "Health check failed"
    exit 1
fi

# Crisis detection health check
if curl -f -s "$DEPLOYED_URL/api/ai/crisis-detection" > /dev/null; then
    log "SUCCESS" "Crisis detection system operational"
else
    log "ERROR" "Crisis detection system failed"
    exit 1
fi

# 9. Deployment Summary
log "SUCCESS" "🎉 ALCHM deployment completed successfully!"
log "INFO" "Deployment timestamp: $TIMESTAMP"
log "INFO" "Deployed URL: $DEPLOYED_URL"
log "INFO" "Log file: $LOG_FILE"

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                           DEPLOYMENT SUCCESSFUL                             ║"
echo "║                                                                              ║"
echo "║  🌟 ALCHM is now live and serving users safely                             ║"
echo "║  🛡️  All security validations passed                                       ║"
echo "║  🚨 Crisis detection systems operational                                   ║"
echo "║  💙 Ready to support healing journeys                                      ║"
echo "║                                                                              ║"
echo "║  Monitor at: $DEPLOYED_URL                             ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "SUCCESS" "Deployment completed at $(date)"