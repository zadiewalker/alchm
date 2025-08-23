#!/bin/bash

# Rollback Deployment Script for ALCHM
# This script handles emergency rollbacks to previous working versions

echo "🔄 ALCHM Deployment Rollback System"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="backups"
PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}"
ROLLBACK_REASON=""
ROLLBACK_TYPE=""

# Function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -t, --type TYPE        Rollback type: full, hosting, functions, database"
    echo "  -r, --reason REASON    Reason for rollback (required)"
    echo "  -l, --list            List available rollback points"
    echo "  -c, --create-backup   Create backup before rollback"
    echo "  -f, --force           Skip confirmation prompts"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --type full --reason \"Critical bug in production\""
    echo "  $0 --type hosting --reason \"Frontend deployment issues\""
    echo "  $0 --list"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "\n${BLUE}🔍 Checking Prerequisites${NC}"
    
    # Check Firebase CLI
    if ! command -v firebase >/dev/null 2>&1; then
        echo -e "${RED}❌ Firebase CLI not found${NC}"
        echo "Install with: npm install -g firebase-tools"
        exit 1
    fi
    
    # Check Git
    if ! command -v git >/dev/null 2>&1; then
        echo -e "${RED}❌ Git not found${NC}"
        exit 1
    fi
    
    # Check authentication
    if ! firebase projects:list >/dev/null 2>&1; then
        echo -e "${RED}❌ Not authenticated with Firebase${NC}"
        echo "Run: firebase login"
        exit 1
    fi
    
    # Get project ID if not set
    if [ -z "$PROJECT_ID" ]; then
        PROJECT_ID=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}')
        if [ -z "$PROJECT_ID" ]; then
            echo -e "${RED}❌ No Firebase project configured${NC}"
            echo "Run: firebase use <project-id>"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ Prerequisites met${NC}"
    echo "Project: $PROJECT_ID"
}

# Function to create emergency backup
create_emergency_backup() {
    echo -e "\n${BLUE}💾 Creating Emergency Backup${NC}"
    
    local backup_timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$BACKUP_DIR/emergency_$backup_timestamp"
    
    mkdir -p "$backup_path"
    
    # Backup current deployment
    echo "Creating deployment snapshot..."
    
    # Git commit hash
    git rev-parse HEAD > "$backup_path/git_commit.txt"
    git log -1 --oneline > "$backup_path/git_log.txt"
    
    # Firebase configuration
    cp firebase.json "$backup_path/" 2>/dev/null
    cp firestore.rules "$backup_path/" 2>/dev/null
    cp storage.rules "$backup_path/" 2>/dev/null
    
    # Environment configuration
    cp .env.local "$backup_path/env.backup" 2>/dev/null
    
    # Package information
    cp package.json "$backup_path/"
    cp package-lock.json "$backup_path/" 2>/dev/null
    cp pnpm-lock.yaml "$backup_path/" 2>/dev/null
    
    # Function configuration
    if [ -d "functions" ]; then
        cp -r functions/package.json "$backup_path/" 2>/dev/null
    fi
    
    # Firebase functions config
    firebase functions:config:get > "$backup_path/functions_config.json" 2>/dev/null
    
    # Create backup manifest
    cat > "$backup_path/backup_manifest.json" << EOF
{
  "timestamp": "$backup_timestamp",
  "type": "emergency_backup",
  "project_id": "$PROJECT_ID",
  "git_commit": "$(git rev-parse HEAD)",
  "created_by": "$(whoami)",
  "reason": "Pre-rollback emergency backup"
}
EOF

    echo -e "${GREEN}✅ Emergency backup created: $backup_path${NC}"
    echo "$backup_path" > .last_backup_path
}

# Function to list available rollback points
list_rollback_points() {
    echo -e "\n${BLUE}📋 Available Rollback Points${NC}"
    echo "============================="
    
    # Git-based rollback points
    echo -e "\n${YELLOW}Git Commits (last 10):${NC}"
    git log --oneline -10 | while read commit message; do
        echo "  🔸 $commit: $message"
    done
    
    # Backup-based rollback points
    if [ -d "$BACKUP_DIR" ]; then
        echo -e "\n${YELLOW}Available Backups:${NC}"
        find "$BACKUP_DIR" -maxdepth 1 -type d -name "*_*" | sort -r | head -10 | while read backup_dir; do
            local backup_name=$(basename "$backup_dir")
            if [ -f "$backup_dir/backup_manifest.json" ]; then
                local timestamp=$(jq -r '.timestamp // "unknown"' "$backup_dir/backup_manifest.json" 2>/dev/null || echo "unknown")
                local reason=$(jq -r '.reason // "no reason"' "$backup_dir/backup_manifest.json" 2>/dev/null || echo "no reason")
                echo "  📦 $backup_name ($timestamp) - $reason"
            else
                echo "  📦 $backup_name"
            fi
        done
    else
        echo -e "${YELLOW}No backups directory found${NC}"
    fi
    
    # Firebase hosting releases
    echo -e "\n${YELLOW}Firebase Hosting Releases:${NC}"
    firebase hosting:releases --limit 5 2>/dev/null | tail -n +2 | while read line; do
        echo "  🌐 $line"
    done
}

# Function to rollback hosting
rollback_hosting() {
    local target_commit=$1
    
    echo -e "\n${BLUE}🌐 Rolling Back Hosting${NC}"
    
    if [ -n "$target_commit" ]; then
        echo "Rolling back hosting to commit: $target_commit"
        
        # Checkout target commit
        if ! git checkout "$target_commit" -- .; then
            echo -e "${RED}❌ Failed to checkout commit${NC}"
            return 1
        fi
        
        # Rebuild and deploy
        echo "Rebuilding application..."
        if ! npm run build; then
            echo -e "${RED}❌ Build failed${NC}"
            git checkout HEAD -- .
            return 1
        fi
        
        echo "Deploying hosting..."
        if ! firebase deploy --only hosting; then
            echo -e "${RED}❌ Hosting deployment failed${NC}"
            git checkout HEAD -- .
            return 1
        fi
        
        echo -e "${GREEN}✅ Hosting rollback complete${NC}"
    else
        # Use previous release
        echo "Rolling back to previous hosting release..."
        if ! firebase hosting:sites:list >/dev/null 2>&1; then
            echo -e "${RED}❌ Cannot access hosting releases${NC}"
            return 1
        fi
        
        echo -e "${YELLOW}⚠️  Manual rollback required via Firebase Console${NC}"
        echo "Visit: https://console.firebase.google.com/project/$PROJECT_ID/hosting"
    fi
}

# Function to rollback functions
rollback_functions() {
    local target_commit=$1
    
    echo -e "\n${BLUE}🔧 Rolling Back Functions${NC}"
    
    if [ -n "$target_commit" ]; then
        echo "Rolling back functions to commit: $target_commit"
        
        # Checkout target commit for functions
        if ! git checkout "$target_commit" -- functions/; then
            echo -e "${RED}❌ Failed to checkout functions${NC}"
            return 1
        fi
        
        # Rebuild functions
        echo "Rebuilding functions..."
        cd functions
        if ! pnpm install; then
            echo -e "${RED}❌ Functions dependency installation failed${NC}"
            cd ..
            git checkout HEAD -- functions/
            return 1
        fi
        
        if ! pnpm run build; then
            echo -e "${RED}❌ Functions build failed${NC}"
            cd ..
            git checkout HEAD -- functions/
            return 1
        fi
        cd ..
        
        # Deploy functions
        echo "Deploying functions..."
        if ! firebase deploy --only functions; then
            echo -e "${RED}❌ Functions deployment failed${NC}"
            git checkout HEAD -- functions/
            return 1
        fi
        
        echo -e "${GREEN}✅ Functions rollback complete${NC}"
    else
        echo -e "${YELLOW}⚠️  Cannot rollback functions without specific commit${NC}"
        return 1
    fi
}

# Function to rollback database rules
rollback_database_rules() {
    local target_commit=$1
    
    echo -e "\n${BLUE}🗄️ Rolling Back Database Rules${NC}"
    
    if [ -n "$target_commit" ]; then
        echo "Rolling back database rules to commit: $target_commit"
        
        # Checkout target rules
        if ! git checkout "$target_commit" -- firestore.rules storage.rules 2>/dev/null; then
            echo -e "${YELLOW}⚠️  Some rules files may not exist${NC}"
        fi
        
        # Deploy rules
        echo "Deploying Firestore rules..."
        if [ -f "firestore.rules" ]; then
            if ! firebase deploy --only firestore:rules; then
                echo -e "${RED}❌ Firestore rules deployment failed${NC}"
                git checkout HEAD -- firestore.rules
                return 1
            fi
        fi
        
        echo "Deploying Storage rules..."
        if [ -f "storage.rules" ]; then
            if ! firebase deploy --only storage:rules; then
                echo -e "${RED}❌ Storage rules deployment failed${NC}"
                git checkout HEAD -- storage.rules
                return 1
            fi
        fi
        
        echo -e "${GREEN}✅ Database rules rollback complete${NC}"
    else
        echo -e "${YELLOW}⚠️  Cannot rollback rules without specific commit${NC}"
        return 1
    fi
}

# Function to perform full rollback
rollback_full() {
    local target_commit=$1
    
    echo -e "\n${BLUE}🔄 Performing Full Rollback${NC}"
    echo "Target commit: ${target_commit:-latest backup}"
    
    if [ -z "$target_commit" ]; then
        echo -e "${RED}❌ Full rollback requires a specific commit${NC}"
        return 1
    fi
    
    # Rollback in order: rules, functions, hosting
    echo "Rolling back database rules..."
    if ! rollback_database_rules "$target_commit"; then
        echo -e "${YELLOW}⚠️  Database rules rollback failed, continuing...${NC}"
    fi
    
    echo "Rolling back functions..."
    if ! rollback_functions "$target_commit"; then
        echo -e "${RED}❌ Functions rollback failed${NC}"
        return 1
    fi
    
    echo "Rolling back hosting..."
    if ! rollback_hosting "$target_commit"; then
        echo -e "${RED}❌ Hosting rollback failed${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Full rollback complete${NC}"
}

# Function to verify rollback
verify_rollback() {
    echo -e "\n${BLUE}🧪 Verifying Rollback${NC}"
    
    # Run production tests
    if [ -f "scripts/production-user-flow-test.sh" ]; then
        echo "Running production tests..."
        if ./scripts/production-user-flow-test.sh; then
            echo -e "${GREEN}✅ Rollback verification passed${NC}"
        else
            echo -e "${RED}❌ Rollback verification failed${NC}"
            echo "Manual investigation required"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  No test script found, manual verification required${NC}"
    fi
    
    # Basic connectivity test
    local app_url="${NEXT_PUBLIC_APP_URL:-https://$PROJECT_ID.web.app}"
    if curl -s -f "$app_url/api/health/ping" >/dev/null; then
        echo -e "${GREEN}✅ Basic connectivity test passed${NC}"
    else
        echo -e "${RED}❌ Basic connectivity test failed${NC}"
        return 1
    fi
}

# Function to log rollback
log_rollback() {
    local rollback_type=$1
    local reason=$2
    local success=$3
    
    local log_file="rollback_history.log"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local git_commit=$(git rev-parse HEAD)
    local user=$(whoami)
    
    echo "[$timestamp] ROLLBACK - Type: $rollback_type, Reason: $reason, Success: $success, User: $user, Commit: $git_commit" >> "$log_file"
    
    # Also log to Firebase if possible
    if [ "$success" = "true" ]; then
        echo -e "${GREEN}📝 Rollback logged successfully${NC}"
    else
        echo -e "${RED}📝 Rollback failure logged${NC}"
    fi
}

# Function to send notifications
send_rollback_notification() {
    local rollback_type=$1
    local reason=$2
    local success=$3
    
    local status_emoji="❌"
    local status_text="FAILED"
    
    if [ "$success" = "true" ]; then
        status_emoji="✅"
        status_text="SUCCESS"
    fi
    
    local message="$status_emoji ROLLBACK $status_text
Type: $rollback_type
Reason: $reason
Project: $PROJECT_ID
Time: $(date)
User: $(whoami)"
    
    echo -e "\n${BLUE}📢 Notification:${NC}"
    echo "$message"
    
    # Send to external systems if configured
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Function to confirm rollback
confirm_rollback() {
    local rollback_type=$1
    local reason=$2
    
    echo -e "\n${YELLOW}⚠️  ROLLBACK CONFIRMATION${NC}"
    echo "================================="
    echo "Type: $rollback_type"
    echo "Reason: $reason"
    echo "Project: $PROJECT_ID"
    echo ""
    echo -e "${RED}This action cannot be easily undone!${NC}"
    echo ""
    
    if [ "${FORCE_ROLLBACK:-false}" = "true" ]; then
        echo "Force mode enabled, proceeding without confirmation..."
        return 0
    fi
    
    read -p "Are you sure you want to proceed with the rollback? (yes/no): " -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Rollback cancelled."
        exit 1
    fi
}

# Main rollback function
perform_rollback() {
    local rollback_type=$1
    local reason=$2
    local target_commit=$3
    
    echo -e "\n${BLUE}🚀 Starting Rollback Process${NC}"
    echo "Type: $rollback_type"
    echo "Reason: $reason"
    echo "Target: ${target_commit:-automatic}"
    
    # Create emergency backup
    create_emergency_backup
    
    # Perform rollback based on type
    local rollback_success="false"
    
    case "$rollback_type" in
        "full")
            if rollback_full "$target_commit"; then
                rollback_success="true"
            fi
            ;;
        "hosting")
            if rollback_hosting "$target_commit"; then
                rollback_success="true"
            fi
            ;;
        "functions")
            if rollback_functions "$target_commit"; then
                rollback_success="true"
            fi
            ;;
        "database")
            if rollback_database_rules "$target_commit"; then
                rollback_success="true"
            fi
            ;;
        *)
            echo -e "${RED}❌ Unknown rollback type: $rollback_type${NC}"
            exit 1
            ;;
    esac
    
    # Verify rollback if successful
    if [ "$rollback_success" = "true" ]; then
        verify_rollback
        if [ $? -ne 0 ]; then
            rollback_success="false"
        fi
    fi
    
    # Log and notify
    log_rollback "$rollback_type" "$reason" "$rollback_success"
    send_rollback_notification "$rollback_type" "$reason" "$rollback_success"
    
    if [ "$rollback_success" = "true" ]; then
        echo -e "\n${GREEN}🎉 Rollback completed successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Monitor the application for stability"
        echo "2. Investigate the root cause of the issue"
        echo "3. Plan a fix for the next deployment"
        echo "4. Update the team on the rollback status"
    else
        echo -e "\n${RED}💥 Rollback failed!${NC}"
        echo ""
        echo "Immediate actions required:"
        echo "1. Check application status manually"
        echo "2. Contact the development team"
        echo "3. Consider manual intervention"
        echo "4. Escalate to emergency contacts if needed"
        exit 1
    fi
}

# Parse command line arguments
FORCE_ROLLBACK=false
CREATE_BACKUP=false
SHOW_LIST=false
TARGET_COMMIT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--type)
            ROLLBACK_TYPE="$2"
            shift 2
            ;;
        -r|--reason)
            ROLLBACK_REASON="$2"
            shift 2
            ;;
        -c|--commit)
            TARGET_COMMIT="$2"
            shift 2
            ;;
        -l|--list)
            SHOW_LIST=true
            shift
            ;;
        --create-backup)
            CREATE_BACKUP=true
            shift
            ;;
        -f|--force)
            FORCE_ROLLBACK=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
check_prerequisites

if [ "$SHOW_LIST" = "true" ]; then
    list_rollback_points
    exit 0
fi

if [ "$CREATE_BACKUP" = "true" ]; then
    create_emergency_backup
    exit 0
fi

# Validate required parameters
if [ -z "$ROLLBACK_TYPE" ]; then
    echo -e "${RED}❌ Rollback type is required${NC}"
    show_usage
    exit 1
fi

if [ -z "$ROLLBACK_REASON" ]; then
    echo -e "${RED}❌ Rollback reason is required${NC}"
    show_usage
    exit 1
fi

# Validate rollback type
case "$ROLLBACK_TYPE" in
    "full"|"hosting"|"functions"|"database")
        ;;
    *)
        echo -e "${RED}❌ Invalid rollback type: $ROLLBACK_TYPE${NC}"
        echo "Valid types: full, hosting, functions, database"
        exit 1
        ;;
esac

# Confirm rollback
confirm_rollback "$ROLLBACK_TYPE" "$ROLLBACK_REASON"

# Perform rollback
perform_rollback "$ROLLBACK_TYPE" "$ROLLBACK_REASON" "$TARGET_COMMIT"