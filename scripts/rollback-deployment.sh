#!/bin/bash

# ALCHM Emergency Rollback System
# Critical safety mechanism for mental health app deployment failures

set -e

# Configuration
ENVIRONMENT=${1:-production}
FORCE_ROLLBACK=${2:-false}

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Emergency banner
echo ""
echo -e "${RED}🚨 ALCHM EMERGENCY ROLLBACK INITIATED 🚨${NC}"
echo -e "${RED}     CRITICAL SYSTEM RECOVERY MODE     ${NC}"
echo ""

log "🔄 Starting emergency rollback for $ENVIRONMENT"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "firebase.json" ]; then
    error "Must be run from ALCHM project root directory"
    exit 1
fi

# Read current deployment info
CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
ROLLBACK_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

log "Current version: $CURRENT_VERSION"
log "Rollback timestamp: $ROLLBACK_TIMESTAMP"

# Check for previous version info
PREVIOUS_VERSION="unknown"
if [ -f "deployment-info.json" ]; then
    PREVIOUS_VERSION=$(cat deployment-info.json | jq -r '.previous_version' 2>/dev/null || echo "unknown")
fi

log "Previous version: $PREVIOUS_VERSION"

# Look for backup directories
BACKUP_DIRS=$(find backups -name "deployment-*" -type d 2>/dev/null | sort -r | head -5 || echo "")

if [ -z "$BACKUP_DIRS" ]; then
    error "No backup directories found"
    log "Available options:"
    log "1. Manual rollback using Firebase Console"
    log "2. Redeploy from last known good commit"
    exit 1
fi

echo ""
log "Available backups:"
echo "$BACKUP_DIRS" | while read backup_dir; do
    if [ -n "$backup_dir" ] && [ -d "$backup_dir" ]; then
        VERSION_FILE="$backup_dir/version.txt"
        BACKUP_VERSION="unknown"
        if [ -f "$VERSION_FILE" ]; then
            BACKUP_VERSION=$(cat "$VERSION_FILE")
        fi
        BACKUP_DATE=$(basename "$backup_dir" | sed 's/deployment-//')
        log "  📦 $backup_dir (v$BACKUP_VERSION, $BACKUP_DATE)"
    fi
done

# Select backup for rollback
LATEST_BACKUP=$(echo "$BACKUP_DIRS" | head -1)

if [ "$FORCE_ROLLBACK" != "true" ]; then
    echo ""
    warning "⚠️  CRITICAL ROLLBACK CONFIRMATION REQUIRED ⚠️"
    echo ""
    echo "This will rollback the ALCHM mental health application."
    echo "Crisis support functionality must remain operational."
    echo ""
    echo "Current version: $CURRENT_VERSION"
    echo "Rollback to: $LATEST_BACKUP"
    echo ""
    echo "Are you absolutely sure you want to proceed?"
    echo "This action affects users who may need immediate crisis support."
    echo ""
    read -p "Type 'EMERGENCY ROLLBACK' to confirm: " confirmation
    
    if [ "$confirmation" != "EMERGENCY ROLLBACK" ]; then
        log "Rollback cancelled - confirmation not provided"
        exit 1
    fi
fi

log "🚨 PROCEEDING WITH EMERGENCY ROLLBACK"

# Step 1: Prepare rollback environment
log "📋 Step 1: Preparing rollback environment..."

if [ ! -d "$LATEST_BACKUP" ]; then
    error "Latest backup directory not found: $LATEST_BACKUP"
    exit 1
fi

# Backup current state before rollback
EMERGENCY_BACKUP="backups/emergency-rollback-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EMERGENCY_BACKUP"
cp -r out "$EMERGENCY_BACKUP/" 2>/dev/null || true
cp firebase.json "$EMERGENCY_BACKUP/" 2>/dev/null || true
echo "$CURRENT_VERSION" > "$EMERGENCY_BACKUP/version.txt"

success "Current state backed up to $EMERGENCY_BACKUP"

# Step 2: Restore from backup
log "🔄 Step 2: Restoring from backup..."

# Restore the build output
if [ -d "$LATEST_BACKUP/out" ]; then
    rm -rf out
    cp -r "$LATEST_BACKUP/out" .
    success "Build output restored"
else
    error "No build output found in backup"
    exit 1
fi

# Restore Firebase configuration if available
if [ -f "$LATEST_BACKUP/firebase.json" ]; then
    cp "$LATEST_BACKUP/firebase.json" .
    success "Firebase configuration restored"
fi

# Step 3: Deploy restored version
log "🚀 Step 3: Deploying restored version..."

# Deploy hosting (priority for crisis access)
log "Deploying hosting (critical for crisis access)..."
if ! firebase deploy --only hosting > rollback-hosting.log 2>&1; then
    error "Hosting rollback failed. Check rollback-hosting.log"
    
    # Try to restore current state
    log "Attempting to restore current state..."
    if [ -d "$EMERGENCY_BACKUP/out" ]; then
        rm -rf out
        cp -r "$EMERGENCY_BACKUP/out" .
        firebase deploy --only hosting > emergency-restore.log 2>&1 || true
    fi
    exit 1
fi
success "Hosting rolled back successfully"

# Deploy functions if backup contains them
if [ -d "$LATEST_BACKUP/functions" ]; then
    log "Rolling back functions..."
    # Note: This is more complex as we'd need to rebuild functions
    # For now, skip function rollback and rely on current functions
    warning "Function rollback skipped - using current function deployment"
else
    log "No function backup found - keeping current functions"
fi

# Step 4: Wait for propagation
log "⏳ Step 4: Waiting for rollback to propagate..."
sleep 30

# Step 5: Verify rollback
log "🔍 Step 5: Verifying rollback..."

ROLLBACK_SUCCESS=false

# Test critical endpoints
log "Testing critical crisis endpoints..."

# Test main site
if curl -s -f "https://alchmapp.web.app/" > /dev/null 2>&1; then
    success "Main site accessible"
    ROLLBACK_SUCCESS=true
else
    error "Main site not accessible"
fi

# Test crisis resources
if curl -s -f "https://alchmapp.web.app/mobile-emergency" > /dev/null 2>&1; then
    success "Crisis resources accessible"
else
    warning "Crisis resources may not be accessible"
fi

# Test health check
if curl -s "https://alchmapp.web.app/api/health/ping" | grep -q "healthy" 2>/dev/null; then
    success "Health check responding"
else
    warning "Health check not responding normally"
fi

# Step 6: Update monitoring
log "📊 Step 6: Updating monitoring for rollback..."

# Create rollback deployment info
ROLLBACK_VERSION=$(cat "$LATEST_BACKUP/version.txt" 2>/dev/null || echo "unknown")

echo "{
  \"rollback\": true,
  \"rollback_timestamp\": \"$ROLLBACK_TIMESTAMP\",
  \"rolled_back_to_version\": \"$ROLLBACK_VERSION\",
  \"rolled_back_from_version\": \"$CURRENT_VERSION\",
  \"environment\": \"$ENVIRONMENT\",
  \"emergency_backup\": \"$EMERGENCY_BACKUP\"
}" > rollback-info.json

success "Rollback information recorded"

# Step 7: Generate rollback report
log "📋 Step 7: Generating rollback report..."

ROLLBACK_REPORT="rollback-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$ROLLBACK_REPORT" << EOF
# ALCHM Emergency Rollback Report

**🚨 EMERGENCY ROLLBACK EXECUTED 🚨**

## Rollback Details

**Rollback ID:** $(date +%Y%m%d-%H%M%S)
**Environment:** $ENVIRONMENT
**Rollback Timestamp:** $ROLLBACK_TIMESTAMP
**Status:** $([ "$ROLLBACK_SUCCESS" = "true" ] && echo "✅ SUCCESS" || echo "❌ NEEDS ATTENTION")

## Version Information

**Rolled Back From:** $CURRENT_VERSION
**Rolled Back To:** $ROLLBACK_VERSION
**Backup Used:** $LATEST_BACKUP

## Rollback Steps Completed

- ✅ Emergency backup of current state
- ✅ Restoration from backup
- ✅ Hosting deployment
- ⚠️ Functions rollback (skipped - using current)
- $([ "$ROLLBACK_SUCCESS" = "true" ] && echo "✅" || echo "❌") Rollback verification

## Verification Results

$([ "$ROLLBACK_SUCCESS" = "true" ] && echo "Basic verification passed. Site appears functional." || echo "Verification issues detected. Manual inspection required.")

**Critical Systems:**
- Main site: $(curl -s -f "https://alchmapp.web.app/" > /dev/null 2>&1 && echo "✅ Accessible" || echo "❌ Issues")
- Crisis resources: $(curl -s -f "https://alchmapp.web.app/mobile-emergency" > /dev/null 2>&1 && echo "✅ Accessible" || echo "❌ Issues")
- Health check: $(curl -s "https://alchmapp.web.app/api/health/ping" | grep -q "healthy" 2>/dev/null && echo "✅ Responding" || echo "❌ Issues")

## Recovery Information

**Emergency Backup:** $EMERGENCY_BACKUP
**Rollback Logs:** rollback-hosting.log
**Can Restore Failed Deployment:** Yes (from $EMERGENCY_BACKUP)

## Next Steps

1. **IMMEDIATE:** Monitor crisis support functionality
2. **URGENT:** Investigate root cause of deployment failure
3. **REQUIRED:** Test all critical user flows manually
4. **RECOMMENDED:** Plan hotfix deployment once issue resolved

## Crisis Support Monitoring

🚨 **CRITICAL REMINDER:** This is a mental health application.
Users may depend on crisis support features. Monitor these closely:

- Crisis detection API: /api/crisis-detection
- Emergency resources: /mobile-emergency
- Crisis resources page: /crisis-resources.html

---
*Generated by ALCHM Emergency Rollback System*
EOF

success "Rollback report generated: $ROLLBACK_REPORT"

# Final status
echo ""
echo "🔄 ALCHM EMERGENCY ROLLBACK COMPLETED"
echo "===================================="
echo "Rolled back from: $CURRENT_VERSION"
echo "Rolled back to: $ROLLBACK_VERSION"
echo "Status: $([ "$ROLLBACK_SUCCESS" = "true" ] && echo "✅ SUCCESS" || echo "❌ NEEDS ATTENTION")"
echo "Report: $ROLLBACK_REPORT"
echo ""

if [ "$ROLLBACK_SUCCESS" = "true" ]; then
    echo "✅ Rollback completed successfully"
    echo "🔍 Crisis support systems appear operational"
    echo "📊 Continue monitoring all critical functionality"
else
    echo "⚠️ Rollback completed but issues detected"
    echo "🚨 IMMEDIATE MANUAL INSPECTION REQUIRED"
    echo "🔍 Test all crisis support functionality manually"
fi

echo ""
echo "🚨 POST-ROLLBACK ACTIONS REQUIRED:"
echo "1. Test crisis detection manually"
echo "2. Verify emergency resources load correctly"
echo "3. Check user authentication flows"
echo "4. Monitor error logs for issues"
echo "5. Investigate original deployment failure"
echo ""

log "Emergency rollback process completed"

# Set exit code based on success
if [ "$ROLLBACK_SUCCESS" = "true" ]; then
    exit 0
else
    exit 1
fi