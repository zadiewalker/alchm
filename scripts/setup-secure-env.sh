#!/bin/bash

# ALCHM Secure Environment Setup
# Helps developers set up secure environment configuration
# 
# CRITICAL: Guides proper secrets management for mental health platform

set -euo pipefail

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

log() {
    local level="$1"
    shift
    local message="$*"
    
    case "$level" in
        "ERROR")   echo -e "${RED}❌ ${message}${NC}" ;;
        "SUCCESS") echo -e "${GREEN}✅ ${message}${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  ${message}${NC}" ;;
        "INFO")    echo -e "${BLUE}ℹ️  ${message}${NC}" ;;
        *)         echo -e "${message}" ;;
    esac
}

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                      ALCHM SECURE ENVIRONMENT SETUP                         ║"
echo "║                                                                              ║"
echo "║  🛡️  Zero credential exposure setup                                        ║"
echo "║  🔒  Production-ready security                                              ║"
echo "║  🌟  Trauma-informed configuration                                          ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

cd "$PROJECT_ROOT"

log "INFO" "Setting up secure environment for ALCHM..."

# 1. Check if .env.local already exists
if [[ -f ".env.local" ]]; then
    echo
    log "WARNING" ".env.local already exists"
    read -p "Do you want to backup and recreate it? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mv .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        log "INFO" "Existing .env.local backed up"
    else
        log "INFO" "Keeping existing .env.local"
        echo
        log "INFO" "To validate your current configuration, run:"
        log "INFO" "node -e \"console.log(require('./src/lib/config.ts').validateEnvironmentVariables())\""
        exit 0
    fi
fi

# 2. Copy template
log "INFO" "Creating .env.local from template..."
cp .env.example .env.local

# 3. Generate secure secrets
log "INFO" "Generating secure secrets..."

# Generate NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
if [[ -n "$NEXTAUTH_SECRET" ]]; then
    sed -i.bak "s|your_32_character_secret_here|$NEXTAUTH_SECRET|g" .env.local
    rm .env.local.bak
    log "SUCCESS" "Generated NextAuth secret"
else
    log "ERROR" "Failed to generate NextAuth secret"
    exit 1
fi

# 4. Interactive configuration
echo
log "INFO" "🔧 INTERACTIVE CONFIGURATION"
log "INFO" "Please provide your service credentials..."
echo

# Firebase Configuration
echo -e "${BLUE}━━━ FIREBASE CONFIGURATION ━━━${NC}"
read -p "Firebase Project ID: " FIREBASE_PROJECT_ID
read -p "Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY): " FIREBASE_API_KEY
read -p "Firebase Auth Domain (e.g., your-project.web.app): " FIREBASE_AUTH_DOMAIN
read -p "Firebase Client Email (from service account): " FIREBASE_CLIENT_EMAIL
echo "Firebase Private Key (paste the entire key including headers):"
read -r FIREBASE_PRIVATE_KEY

# Stripe Configuration  
echo -e "${BLUE}━━━ STRIPE CONFIGURATION ━━━${NC}"
read -p "Stripe Publishable Key (pk_live_... or pk_test_...): " STRIPE_PUBLISHABLE_KEY
read -s -p "Stripe Secret Key (sk_live_... or sk_test_...): " STRIPE_SECRET_KEY
echo
read -s -p "Stripe Webhook Secret (whsec_...): " STRIPE_WEBHOOK_SECRET
echo
read -p "Stripe Deep Cut Price ID: " STRIPE_DEEP_CUT_PRICE_ID
read -p "Stripe Oracle Price ID: " STRIPE_ORACLE_PRICE_ID

# AI Services
echo -e "${BLUE}━━━ AI SERVICES ━━━${NC}"
read -s -p "Google AI API Key (AIzaSy...): " GOOGLE_AI_API_KEY
echo
read -s -p "OpenAI API Key (sk-...): " OPENAI_API_KEY
echo
read -p "OpenAI Project ID (optional, proj_...): " OPENAI_PROJECT_ID

# Domain Configuration
echo -e "${BLUE}━━━ DOMAIN CONFIGURATION ━━━${NC}"
read -p "Your domain (e.g., https://your-app.web.app): " DOMAIN_URL

# 5. Update .env.local with provided values
log "INFO" "Updating configuration file..."

# Firebase
sed -i.bak "s|your-project-id|$FIREBASE_PROJECT_ID|g" .env.local
sed -i.bak "s|your_firebase_api_key_here|$FIREBASE_API_KEY|g" .env.local
sed -i.bak "s|your-project.web.app|$FIREBASE_AUTH_DOMAIN|g" .env.local
sed -i.bak "s|firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com|$FIREBASE_CLIENT_EMAIL|g" .env.local
sed -i.bak "s|YOUR_PRIVATE_KEY_HERE|$FIREBASE_PRIVATE_KEY|g" .env.local

# Stripe
sed -i.bak "s|pk_live_your_publishable_key_here|$STRIPE_PUBLISHABLE_KEY|g" .env.local
sed -i.bak "s|sk_live_your_secret_key_here|$STRIPE_SECRET_KEY|g" .env.local
sed -i.bak "s|whsec_your_webhook_secret_here|$STRIPE_WEBHOOK_SECRET|g" .env.local
sed -i.bak "s|price_deep_cut_monthly_id|$STRIPE_DEEP_CUT_PRICE_ID|g" .env.local
sed -i.bak "s|price_oracle_monthly_id|$STRIPE_ORACLE_PRICE_ID|g" .env.local

# AI Services
sed -i.bak "s|AIzaSyYour_Google_AI_Key_Here|$GOOGLE_AI_API_KEY|g" .env.local
sed -i.bak "s|sk-Your_OpenAI_Key_Here|$OPENAI_API_KEY|g" .env.local
if [[ -n "$OPENAI_PROJECT_ID" ]]; then
    sed -i.bak "s|proj_your_project_id_here|$OPENAI_PROJECT_ID|g" .env.local
fi

# Domain
sed -i.bak "s|https://your-domain.com|$DOMAIN_URL|g" .env.local

# Clean up backup files
rm .env.local.bak 2>/dev/null || true

# 6. Validation
log "INFO" "Validating configuration..."

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
    log "INFO" "Installing dependencies for validation..."
    npm install
fi

# Validate configuration
node -e "
try {
    const { validateEnvironmentVariables } = require('./src/lib/config.ts');
    const result = validateEnvironmentVariables();
    if (result.success) {
        console.log('✅ Configuration validation PASSED');
    } else {
        console.log('❌ Configuration validation FAILED:');
        result.errors.forEach(error => console.log('  -', error));
        process.exit(1);
    }
} catch (error) {
    console.log('❌ Validation error:', error.message);
    process.exit(1);
}
" || {
    log "ERROR" "Configuration validation failed"
    echo
    log "INFO" "Please check your .env.local file and fix any issues"
    exit 1
}

# 7. Security reminders
echo
log "SUCCESS" "🎉 Secure environment setup completed!"
echo

echo -e "${YELLOW}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                            SECURITY REMINDERS                               ║"
echo "║                                                                              ║"
echo "║  🔒 Your .env.local file is already in .gitignore                          ║"
echo "║  🛡️  NEVER commit .env.local to version control                            ║"
echo "║  🔑 Rotate API keys regularly for security                                 ║"
echo "║  👥 Don't share .env.local with others                                     ║"
echo "║  💾 Back up your keys in a secure password manager                        ║"
echo "║                                                                              ║"
echo "║  Next steps:                                                                 ║"
echo "║  1. Run 'npm run dev' to start development                                 ║"
echo "║  2. Run './scripts/secure-deploy.sh' to deploy securely                    ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

log "SUCCESS" "Environment setup completed at $(date)"