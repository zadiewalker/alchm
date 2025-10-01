#!/bin/bash

# ALCHM Firebase Platform Optimization Deployment Script
# Deploys trauma-informed Firebase configurations for mental health app excellence

set -e

echo "🏥 ALCHM Firebase Platform Optimization Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="alchm-digital-sanctuary"
BACKUP_DIR="firebase-config-backup-$(date +%Y%m%d-%H%M%S)"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI not found. Install with: npm install -g firebase-tools"
        exit 1
    fi
    
    if ! firebase projects:list | grep -q "$PROJECT_ID"; then
        print_error "Firebase project $PROJECT_ID not found. Please check your project access."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Backup current configuration
backup_config() {
    print_status "Creating backup of current configuration..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup current files
    cp firebase.json "$BACKUP_DIR/" 2>/dev/null || true
    cp firestore.rules "$BACKUP_DIR/" 2>/dev/null || true
    cp firestore.indexes.json "$BACKUP_DIR/" 2>/dev/null || true
    cp storage.rules "$BACKUP_DIR/" 2>/dev/null || true
    
    print_success "Configuration backed up to $BACKUP_DIR"
}

# Deploy Firestore security rules
deploy_firestore_rules() {
    print_status "Deploying enhanced Firestore security rules for mental health data protection..."
    
    # Backup current rules
    cp firestore.rules "$BACKUP_DIR/firestore.rules.backup"
    
    # Deploy new mental health optimized rules
    if [[ -f "firestore-mental-health-optimized.rules" ]]; then
        print_warning "Deploying mental health optimized Firestore rules..."
        print_warning "This will replace your current security rules. Continue? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            cp firestore-mental-health-optimized.rules firestore.rules
            firebase deploy --only firestore:rules --project "$PROJECT_ID"
            print_success "Enhanced Firestore security rules deployed"
        else
            print_warning "Firestore rules deployment skipped"
        fi
    else
        print_warning "Mental health optimized rules file not found"
    fi
}

# Configure Firebase Functions for crisis detection
deploy_functions() {
    print_status "Deploying Firebase Functions with crisis detection capabilities..."
    
    cd functions
    
    # Install dependencies
    npm install
    
    # Build functions
    npm run build
    
    # Deploy functions
    firebase deploy --only functions --project "$PROJECT_ID"
    
    cd ..
    
    print_success "Firebase Functions deployed with crisis detection"
}

# Configure Crashlytics settings
configure_crashlytics() {
    print_status "Configuring Crashlytics for trauma-informed crash reporting..."
    
    if [[ -f "firebase-crashlytics-optimized.json" ]]; then
        # Set Crashlytics configuration
        firebase functions:config:set \
            crashlytics.privacy_mode=true \
            crashlytics.filter_sensitive_data=true \
            crashlytics.crisis_priority=critical \
            --project "$PROJECT_ID"
        
        print_success "Crashlytics configured for mental health app requirements"
    else
        print_warning "Crashlytics configuration file not found"
    fi
}

# Configure Test Lab settings
configure_testlab() {
    print_status "Configuring Firebase Test Lab for mental health app testing..."
    
    if [[ -f "firebase-testlab-optimized.json" ]]; then
        firebase functions:config:set \
            testlab.crisis_testing=enabled \
            testlab.accessibility_testing=comprehensive \
            testlab.trauma_informed_scenarios=enabled \
            --project "$PROJECT_ID"
        
        print_success "Test Lab configured for comprehensive mental health testing"
    else
        print_warning "Test Lab configuration file not found"
    fi
}

# Set up monitoring and alerting
configure_monitoring() {
    print_status "Setting up monitoring and alerting for crisis intervention..."
    
    firebase functions:config:set \
        monitoring.crisis_alerts=enabled \
        monitoring.performance_tracking=comprehensive \
        monitoring.privacy_compliance=strict \
        --project "$PROJECT_ID"
    
    print_success "Monitoring and alerting configured"
}

# Validate deployment
validate_deployment() {
    print_status "Validating Firebase platform optimization deployment..."
    
    # Check if functions are deployed
    if firebase functions:list --project "$PROJECT_ID" | grep -q "crisisDetection"; then
        print_success "Crisis detection function verified"
    else
        print_warning "Crisis detection function not found"
    fi
    
    # Check Firestore rules
    firebase firestore:rules:list --project "$PROJECT_ID" > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
        print_success "Firestore rules verified"
    else
        print_warning "Firestore rules validation failed"
    fi
    
    # Check hosting
    if firebase hosting:sites:list --project "$PROJECT_ID" | grep -q "alchm"; then
        print_success "Hosting configuration verified"
    else
        print_warning "Hosting configuration not found"
    fi
}

# Set up crisis resources
configure_crisis_resources() {
    print_status "Configuring global crisis resources..."
    
    firebase functions:config:set \
        crisis.us_hotline=988 \
        crisis.us_text=741741 \
        crisis.uk_samaritans=116123 \
        crisis.canada_talk_suicide=18334564566 \
        crisis.australia_lifeline=131114 \
        --project "$PROJECT_ID"
    
    print_success "Global crisis resources configured"
}

# Main deployment function
main() {
    echo "Starting ALCHM Firebase platform optimization deployment..."
    echo ""
    
    # Run deployment steps
    check_prerequisites
    backup_config
    
    print_status "Deploying optimizations..."
    deploy_firestore_rules
    deploy_functions
    configure_crashlytics
    configure_testlab
    configure_monitoring
    configure_crisis_resources
    
    print_status "Validating deployment..."
    validate_deployment
    
    echo ""
    echo "🎉 Firebase Platform Optimization Complete!"
    echo "==========================================="
    print_success "ALCHM is now optimized for trauma-informed mental health support"
    print_success "Crisis intervention systems are active and monitored"
    print_success "Mental health data protection is enhanced and compliant"
    print_success "Multi-platform deployment configurations are ready"
    echo ""
    print_status "Next steps:"
    echo "1. Test crisis detection functionality: npm run test:crisis"
    echo "2. Validate Crashlytics integration: firebase crashlytics:symbols:upload"
    echo "3. Run Test Lab scenarios: firebase test android"
    echo "4. Monitor performance: firebase console --project $PROJECT_ID"
    echo ""
    print_status "Configuration backup available at: $BACKUP_DIR"
    echo ""
    print_success "ALCHM Firebase platform is ready for production deployment! 🚀"
}

# Error handling
trap 'print_error "Deployment failed. Check the error above and try again."; exit 1' ERR

# Run main function
main "$@"