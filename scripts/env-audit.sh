#!/bin/bash

# Environment Variables and Secrets Audit Script for ALCHM
# This script audits all environment variables and secrets for production readiness

echo "🔐 ALCHM Environment Variables & Secrets Audit"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Function to check if a variable is set
check_env_var() {
    local var_name=$1
    local description=$2
    local required=${3:-true}
    local secret=${4:-false}
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -z "${!var_name}" ]; then
        if [ "$required" = true ]; then
            echo -e "${RED}❌ MISSING${NC} $var_name - $description"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        else
            echo -e "${YELLOW}⚠️  OPTIONAL${NC} $var_name - $description (not set)"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
        fi
    else
        if [ "$secret" = true ]; then
            echo -e "${GREEN}✅ SET${NC} $var_name - $description (***hidden***)"
        else
            echo -e "${GREEN}✅ SET${NC} $var_name - $description: ${!var_name}"
        fi
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    fi
}

# Function to validate environment file
validate_env_file() {
    local env_file=$1
    local env_name=$2
    
    echo -e "\n${BLUE}📄 Checking $env_name Environment File: $env_file${NC}"
    
    if [ -f "$env_file" ]; then
        echo -e "${GREEN}✅ File exists${NC}"
        
        # Check file permissions
        local perms=$(stat -f %A "$env_file" 2>/dev/null || stat -c %a "$env_file" 2>/dev/null)
        if [ "$perms" = "600" ] || [ "$perms" = "644" ]; then
            echo -e "${GREEN}✅ File permissions secure ($perms)${NC}"
        else
            echo -e "${YELLOW}⚠️  File permissions could be more secure (current: $perms, recommended: 600)${NC}"
        fi
        
        # Check for secrets in plain text
        echo "🔍 Scanning for potential secrets..."
        local secret_patterns=("password" "secret" "key" "token" "api_key" "private")
        
        for pattern in "${secret_patterns[@]}"; do
            local matches=$(grep -i "$pattern" "$env_file" 2>/dev/null | wc -l)
            if [ "$matches" -gt 0 ]; then
                echo -e "${YELLOW}⚠️  Found $matches line(s) containing '$pattern'${NC}"
            fi
        done
        
    else
        echo -e "${RED}❌ File not found${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
}

echo -e "\n${BLUE}🔍 Environment Files Audit${NC}"
validate_env_file ".env.local" "Local Development"
validate_env_file ".env.production" "Production"
validate_env_file ".env.local.template" "Template"

# Load environment variables
if [ -f ".env.local" ]; then
    set -a
    source .env.local
    set +a
fi

echo -e "\n${BLUE}🔥 Firebase Configuration${NC}"
check_env_var "NEXT_PUBLIC_FIREBASE_API_KEY" "Firebase API Key" true true
check_env_var "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "Firebase Auth Domain" true false
check_env_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "Firebase Project ID" true false
check_env_var "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "Firebase Storage Bucket" true false
check_env_var "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "Firebase Messaging Sender ID" true false
check_env_var "NEXT_PUBLIC_FIREBASE_APP_ID" "Firebase App ID" true false
check_env_var "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" "Firebase Analytics Measurement ID" false false

echo -e "\n${BLUE}🔐 Firebase Admin SDK${NC}"
check_env_var "FIREBASE_ADMIN_PROJECT_ID" "Firebase Admin Project ID" true false
check_env_var "FIREBASE_ADMIN_CLIENT_EMAIL" "Firebase Admin Client Email" true false
check_env_var "FIREBASE_ADMIN_PRIVATE_KEY" "Firebase Admin Private Key" true true
check_env_var "FIREBASE_ADMIN_PRIVATE_KEY_ID" "Firebase Admin Private Key ID" false true

echo -e "\n${BLUE}💳 Stripe Configuration${NC}"
check_env_var "STRIPE_SECRET_KEY" "Stripe Secret Key" true true
check_env_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Stripe Publishable Key" true false
check_env_var "STRIPE_WEBHOOK_SECRET" "Stripe Webhook Secret" true true
check_env_var "STRIPE_PRICE_ID" "Stripe Price ID" false false

echo -e "\n${BLUE}🤖 AI Service Configuration${NC}"
check_env_var "GOOGLE_AI_API_KEY" "Google AI API Key" true true
check_env_var "KHEPERA_AI_ENDPOINT" "Khepera AI Endpoint" false false
check_env_var "KHEPERA_AI_API_KEY" "Khepera AI API Key" false true

echo -e "\n${BLUE}🌐 Application Configuration${NC}"
check_env_var "NEXT_PUBLIC_APP_URL" "Application URL" true false
check_env_var "NEXT_PUBLIC_APP_NAME" "Application Name" true false
check_env_var "NEXT_PUBLIC_APP_VERSION" "Application Version" false false
check_env_var "NEXT_PUBLIC_BUILD_ID" "Build ID" false false
check_env_var "NODE_ENV" "Node Environment" true false

echo -e "\n${BLUE}📧 Email Configuration${NC}"
check_env_var "SMTP_HOST" "SMTP Host" false false
check_env_var "SMTP_PORT" "SMTP Port" false false
check_env_var "SMTP_USER" "SMTP User" false false
check_env_var "SMTP_PASS" "SMTP Password" false true

echo -e "\n${BLUE}📊 Analytics & Monitoring${NC}"
check_env_var "NEXT_PUBLIC_GA_MEASUREMENT_ID" "Google Analytics Measurement ID" false false
check_env_var "SENTRY_DSN" "Sentry DSN" false true
check_env_var "SENTRY_ORG" "Sentry Organization" false false
check_env_var "SENTRY_PROJECT" "Sentry Project" false false

# Security checks
echo -e "\n${BLUE}🔒 Security Audit${NC}"

# Check for development keys in production
if [ "$NODE_ENV" = "production" ]; then
    echo "🔍 Checking for development artifacts in production..."
    
    if [[ "$NEXT_PUBLIC_FIREBASE_API_KEY" == *"dev"* ]] || [[ "$NEXT_PUBLIC_FIREBASE_API_KEY" == *"test"* ]]; then
        echo -e "${RED}❌ Using development Firebase API key in production${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    
    if [[ "$STRIPE_SECRET_KEY" == "sk_test_"* ]]; then
        echo -e "${RED}❌ Using Stripe test key in production${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    else
        echo -e "${GREEN}✅ Using production Stripe keys${NC}"
    fi
    
    if [[ "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" == *"dev"* ]] || [[ "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" == *"test"* ]]; then
        echo -e "${YELLOW}⚠️  Firebase project ID contains 'dev' or 'test'${NC}"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
    fi
fi

# Check for weak or default values
echo -e "\n🔍 Checking for weak or default values..."

weak_patterns=("secret" "password" "12345" "admin" "test" "dev" "localhost")
for pattern in "${weak_patterns[@]}"; do
    env_vars=$(env | grep -i "$pattern" | grep -v "TERM\|PATH\|HOME" || true)
    if [ ! -z "$env_vars" ]; then
        echo -e "${YELLOW}⚠️  Found potentially weak values containing '$pattern'${NC}"
    fi
done

# Check environment consistency
echo -e "\n${BLUE}🔄 Environment Consistency Check${NC}"

if [ ! -z "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" ] && [ ! -z "$FIREBASE_ADMIN_PROJECT_ID" ]; then
    if [ "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "$FIREBASE_ADMIN_PROJECT_ID" ]; then
        echo -e "${GREEN}✅ Firebase project IDs match${NC}"
    else
        echo -e "${RED}❌ Firebase project ID mismatch${NC}"
        echo "   Client: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        echo "   Admin:  $FIREBASE_ADMIN_PROJECT_ID"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
fi

# Generate .env.local.template
echo -e "\n${BLUE}📝 Generating Environment Template${NC}"

cat > .env.local.template << 'EOF'
# ALCHM Environment Variables Template
# Copy this file to .env.local and fill in your actual values

# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK (Required for server-side operations)
FIREBASE_ADMIN_PROJECT_ID=your-firebase-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
FIREBASE_ADMIN_PRIVATE_KEY_ID=your_private_key_id

# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_live_or_sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_stripe_price_id

# AI Service Configuration (Required for AI features)
GOOGLE_AI_API_KEY=your_google_ai_api_key
KHEPERA_AI_ENDPOINT=https://your-khepera-endpoint.com
KHEPERA_AI_API_KEY=your_khepera_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ALCHM
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_BUILD_ID=auto_generated
NODE_ENV=production

# Email Configuration (Optional)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Analytics & Monitoring (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
EOF

echo -e "${GREEN}✅ Template created: .env.local.template${NC}"

# Summary
echo -e "\n${BLUE}📊 Audit Summary${NC}"
echo "=================================================="
echo -e "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_CHECKS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"

# Recommendations
echo -e "\n${BLUE}💡 Recommendations${NC}"
echo "=================================================="

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ All critical environment variables are properly configured!${NC}"
else
    echo -e "${RED}❌ $FAILED_CHECKS critical issues found. Please address before production deployment.${NC}"
fi

if [ $WARNING_CHECKS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNING_CHECKS warnings found. Consider addressing for optimal security.${NC}"
fi

echo ""
echo "🔐 Security Best Practices:"
echo "  • Never commit .env files to version control"
echo "  • Use different API keys for development and production"
echo "  • Regularly rotate API keys and secrets"
echo "  • Use Firebase App Check for additional security"
echo "  • Monitor API usage and set up billing alerts"
echo "  • Use least-privilege principle for service accounts"

echo ""
echo "📋 Next Steps:"
echo "  1. Address any failed checks above"
echo "  2. Test all environment variables in staging"
echo "  3. Verify Firebase console configuration"
echo "  4. Test Stripe webhooks and payments"
echo "  5. Run security rules validation"
echo "  6. Perform end-to-end testing"

# Exit with appropriate code
if [ $FAILED_CHECKS -eq 0 ]; then
    exit 0
else
    exit 1
fi