# ALCHM Rollback Procedures

## Table of Contents
- [Overview](#overview)
- [When to Rollback](#when-to-rollback)
- [Rollback Types](#rollback-types)
- [Emergency Procedures](#emergency-procedures)
- [Rollback Commands](#rollback-commands)
- [Post-Rollback Actions](#post-rollback-actions)
- [Prevention Strategies](#prevention-strategies)

## Overview

This document outlines the rollback procedures for ALCHM, designed to quickly restore service in case of deployment issues or critical bugs. The rollback system supports granular rollbacks (hosting, functions, database rules) and full system rollbacks.

### Rollback Principles
- **Speed**: Minimize downtime during rollback
- **Safety**: Preserve data integrity during rollback
- **Verification**: Confirm rollback success before declaring completion
- **Communication**: Keep stakeholders informed throughout process
- **Documentation**: Log all rollback activities for analysis

## When to Rollback

### Immediate Rollback Required 🚨
- **Site completely down**: Users cannot access the application
- **Critical security vulnerability**: Exposed sensitive data or authentication bypass
- **Data corruption**: Users losing data or seeing incorrect information
- **Payment system failure**: Billing or subscription issues affecting revenue
- **Performance degradation >90%**: Response times >10 seconds consistently

### Consider Rollback ⚠️
- **Non-critical feature broken**: New feature not working but core functionality intact
- **Performance degradation 50-90%**: Slower than normal but still usable
- **Elevated error rates**: Increased errors but not affecting majority of users
- **Minor UI issues**: Display problems that don't affect core functionality

### Monitor and Fix Forward 👀
- **Minor bugs**: Small issues that can be hotfixed quickly
- **Performance degradation <50%**: Slight slowdowns that are tolerable
- **Low error rates**: Occasional errors affecting <5% of requests
- **Non-user-facing issues**: Internal logging or monitoring problems

## Rollback Types

### 1. Full System Rollback
**When to use**: Complete deployment failure or multiple system issues
**What it includes**: Hosting, Functions, and Database Rules
**Duration**: 10-15 minutes
**Risk**: Medium

```bash
# Full rollback to previous working commit
./scripts/rollback-deployment.sh \
  --type full \
  --reason "Critical production bug causing data loss" \
  --commit abc123ef
```

### 2. Hosting-Only Rollback
**When to use**: Frontend issues, UI problems, client-side errors
**What it includes**: Next.js application, static assets, routing
**Duration**: 3-5 minutes
**Risk**: Low

```bash
# Rollback hosting to previous version
./scripts/rollback-deployment.sh \
  --type hosting \
  --reason "Frontend authentication flow broken"
```

### 3. Functions-Only Rollback
**When to use**: API issues, server-side logic problems, function timeouts
**What it includes**: Firebase Functions, API endpoints, server logic
**Duration**: 5-8 minutes
**Risk**: Medium

```bash
# Rollback functions to specific commit
./scripts/rollback-deployment.sh \
  --type functions \
  --reason "API endpoints returning 500 errors" \
  --commit def456gh
```

### 4. Database Rules Rollback
**When to use**: Security rule issues, data access problems
**What it includes**: Firestore and Storage security rules
**Duration**: 2-3 minutes
**Risk**: High (affects data security)

```bash
# Rollback database rules
./scripts/rollback-deployment.sh \
  --type database \
  --reason "Security rules blocking legitimate user access" \
  --commit hij789kl
```

## Emergency Procedures

### 🚨 Emergency Rollback (Site Down)

**Time Limit**: Complete within 5 minutes

1. **Immediate Assessment** (30 seconds)
   ```bash
   # Quick status check
   curl -I https://your-domain.com
   ./scripts/monitor.sh status
   ```

2. **Emergency Full Rollback** (3 minutes)
   ```bash
   # Force rollback without confirmations
   ./scripts/rollback-deployment.sh \
     --type full \
     --reason "EMERGENCY: Site completely down" \
     --force
   ```

3. **Verify Recovery** (1 minute)
   ```bash
   # Verify site is responding
   ./scripts/production-user-flow-test.sh
   ```

4. **Notify Team** (30 seconds)
   - Post in #alerts Slack channel
   - Update status page
   - Notify key stakeholders

### 🔒 Security Breach Rollback

**Time Limit**: Complete within 2 minutes

1. **Immediate Isolation** (30 seconds)
   ```bash
   # Deploy emergency lockdown rules
   firebase deploy --only firestore:rules --config emergency-lockdown.json
   ```

2. **Full System Rollback** (1 minute)
   ```bash
   ./scripts/rollback-deployment.sh \
     --type full \
     --reason "SECURITY: Potential data breach detected" \
     --force
   ```

3. **Security Assessment** (ongoing)
   - Review audit logs
   - Check for data exposure
   - Contact security team

### 💳 Payment System Failure

**Time Limit**: Complete within 3 minutes

1. **Disable Payment Processing** (30 seconds)
   ```bash
   # Temporarily disable Stripe webhooks
   firebase functions:config:set stripe.webhook_secret="DISABLED"
   firebase deploy --only functions
   ```

2. **Rollback Functions** (2 minutes)
   ```bash
   ./scripts/rollback-deployment.sh \
     --type functions \
     --reason "Payment processing failure - revenue impact"
   ```

3. **Verify Payment System** (30 seconds)
   - Test payment flow in staging
   - Verify Stripe webhook status
   - Check transaction logs

## Rollback Commands

### Quick Reference

```bash
# List available rollback points
./scripts/rollback-deployment.sh --list

# Create emergency backup
./scripts/rollback-deployment.sh --create-backup

# Full rollback with confirmation
./scripts/rollback-deployment.sh \
  --type full \
  --reason "Description of issue"

# Force rollback (no confirmations)
./scripts/rollback-deployment.sh \
  --type hosting \
  --reason "Emergency rollback" \
  --force

# Rollback to specific commit
./scripts/rollback-deployment.sh \
  --type functions \
  --reason "Revert to working version" \
  --commit abc123ef
```

### Rollback Verification

```bash
# Automated verification
./scripts/production-user-flow-test.sh

# Manual verification checklist
curl -I https://your-domain.com/api/health/ping    # Basic connectivity
curl https://your-domain.com/api/health/status     # Detailed status
curl https://your-domain.com/api/health/database   # Database connectivity

# Monitor for 5 minutes
./scripts/monitor.sh status
./scripts/monitor.sh metrics
./scripts/monitor.sh alerts
```

## Post-Rollback Actions

### Immediate Actions (0-15 minutes)

1. **Verify System Stability**
   ```bash
   # Run comprehensive tests
   ./scripts/production-user-flow-test.sh
   
   # Monitor for 15 minutes
   watch -n 30 './scripts/monitor.sh status'
   ```

2. **Communication**
   - [ ] Update status page: "Service restored, monitoring for stability"
   - [ ] Notify team in #general channel
   - [ ] Send customer communication if needed
   - [ ] Update stakeholders on rollback completion

3. **Initial Assessment**
   - [ ] Document what went wrong
   - [ ] Identify root cause (if obvious)
   - [ ] Assess customer impact
   - [ ] Review rollback effectiveness

### Short-term Actions (15 minutes - 2 hours)

1. **Detailed Investigation**
   ```bash
   # Review deployment logs
   firebase functions:log --limit 100 --filter="ERROR"
   
   # Check performance metrics
   ./scripts/monitor.sh metrics
   
   # Review recent changes
   git log --oneline -10
   ```

2. **Communication Updates**
   - [ ] Provide detailed incident update
   - [ ] Estimate time for proper fix
   - [ ] Update documentation with lessons learned
   - [ ] Schedule post-mortem meeting

3. **Prepare Fix Strategy**
   - [ ] Identify specific code changes needed
   - [ ] Plan testing strategy for fix
   - [ ] Prepare staging environment for fix validation
   - [ ] Estimate timeline for next deployment

### Medium-term Actions (2-24 hours)

1. **Root Cause Analysis**
   - [ ] Complete detailed investigation
   - [ ] Document timeline of events
   - [ ] Identify contributing factors
   - [ ] Review deployment process gaps

2. **Fix Development**
   - [ ] Develop and test fix in development
   - [ ] Deploy and validate fix in staging
   - [ ] Prepare comprehensive test plan
   - [ ] Review fix with team

3. **Process Improvement**
   - [ ] Update testing procedures
   - [ ] Improve monitoring and alerting
   - [ ] Enhance rollback procedures if needed
   - [ ] Update deployment checklist

## Prevention Strategies

### Pre-deployment Prevention

1. **Comprehensive Testing**
   ```bash
   # Required before deployment
   ./scripts/production-readiness-master.sh
   npm run test
   npm run typecheck
   ./scripts/production-user-flow-test.sh
   ```

2. **Staging Validation**
   - [ ] Deploy to staging environment first
   - [ ] Run full test suite in staging
   - [ ] Performance testing in staging
   - [ ] Security validation in staging

3. **Gradual Rollout**
   - [ ] Consider feature flags for major changes
   - [ ] Implement blue-green deployments
   - [ ] Monitor metrics during deployment
   - [ ] Have rollback plan ready before deployment

### Monitoring and Detection

1. **Proactive Monitoring**
   ```bash
   # Continuous monitoring
   ./scripts/monitor.sh status    # Every 5 minutes
   ./scripts/quota-monitor.sh     # Daily
   ./scripts/ssl-monitor.sh       # Daily
   ```

2. **Alerting Thresholds**
   - Error rate > 5% (warning), > 10% (critical)
   - Response time > 3s (warning), > 10s (critical)
   - No active users for > 1 hour (warning)
   - SSL certificate expiring < 30 days (warning)

3. **Automated Response**
   - Automatic alerts to #alerts channel
   - Email notifications for critical issues
   - Dashboard updates with real-time status
   - Integration with incident management tools

### Team Preparedness

1. **Documentation**
   - [ ] Keep runbooks updated
   - [ ] Maintain emergency contact list
   - [ ] Document all critical procedures
   - [ ] Regular procedure review and updates

2. **Training**
   - [ ] Regular rollback procedure drills
   - [ ] Cross-training on emergency procedures
   - [ ] Keep multiple team members familiar with systems
   - [ ] Document tribal knowledge

3. **Access Management**
   - [ ] Ensure multiple team members have production access
   - [ ] Maintain emergency access procedures
   - [ ] Keep authentication methods backed up
   - [ ] Regular access audits

## Rollback Decision Matrix

| Issue Severity | User Impact | Business Impact | Recommended Action | Time Limit |
|----------------|-------------|-----------------|-------------------|------------|
| Critical | >90% users affected | Revenue/data loss | Emergency Full Rollback | 5 minutes |
| High | 50-90% users affected | Significant degradation | Full/Partial Rollback | 15 minutes |
| Medium | 10-50% users affected | Moderate impact | Consider Rollback | 30 minutes |
| Low | <10% users affected | Minimal impact | Monitor/Fix Forward | 1 hour |

## Emergency Contacts

### Internal Team
- **Technical Lead**: [Contact Information]
- **DevOps Engineer**: [Contact Information]
- **Security Lead**: [Contact Information]
- **Product Manager**: [Contact Information]

### External Contacts
- **Firebase Support**: Firebase Console → Support
- **Google Cloud Support**: Cloud Console → Support
- **Stripe Support**: Stripe Dashboard → Support
- **DNS Provider**: [Provider Support]

### Communication Channels
- **Emergency Slack**: #alerts
- **Status Updates**: #general
- **Customer Communication**: [Support Email]
- **Escalation**: [Emergency Phone Number]

---

## Quick Emergency Reference Card

```bash
# 🚨 EMERGENCY COMMANDS 🚨

# Check if site is down
curl -I https://your-domain.com

# Emergency full rollback (no confirmation)
./scripts/rollback-deployment.sh --type full --reason "EMERGENCY" --force

# Check rollback success
./scripts/production-user-flow-test.sh

# Monitor status
./scripts/monitor.sh status

# View recent errors
firebase functions:log --limit 20 --filter="ERROR"
```

**Print this section and keep accessible during emergencies!**

---

**Document Version**: 1.0.0  
**Last Updated**: $(date)  
**Next Review**: $(date -d "+3 months" 2>/dev/null || date -v +3m 2>/dev/null)  
**Owner**: ALCHM Development Team