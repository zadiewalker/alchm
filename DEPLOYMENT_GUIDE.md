# 🚀 ALCHM Multi-Environment Deployment Guide

**Complete multi-environment deployment configuration for ALCHM's trauma-informed journaling platform with Firebase Studio optimization.**

## 📋 Prerequisites Checklist

Before starting deployment, ensure you have:

### Required Accounts & Services
- [ ] **Firebase Project** - [Create here](https://console.firebase.google.com/)
- [ ] **Google Cloud Account** - [Sign up here](https://console.cloud.google.com/)
- [ ] **Stripe Account** - [Create here](https://dashboard.stripe.com/register)
- [ ] **Domain Name** - For your production app
- [ ] **Git Repository** - This codebase deployed

### Required Tools
- [ ] **Node.js** (v18+) - [Download](https://nodejs.org/)
- [ ] **Firebase CLI** - `npm install -g firebase-tools`
- [ ] **Google Cloud SDK** - [Install](https://cloud.google.com/sdk/docs/install)
- [ ] **Git** - Version control
- [ ] **Code Editor** - VS Code recommended

### Optional Tools (Enhanced Features)
- [ ] **k6** - Load testing ([Install](https://k6.io/docs/get-started/installation/))
- [ ] **Lighthouse** - Performance auditing
- [ ] **Docker** - Containerization (future scaling)

## 🎯 Quick Start - Multi-Environment Setup

### Production Deployment (Full Safety Checks)
```bash
# Comprehensive production deployment with safety validation
npm run deploy:safe:production

# Or using the enhanced script
./scripts/deploy-production.sh
```

### Staging Deployment
```bash
# Deploy to staging environment
npm run deploy:safe:staging

# Switch to staging and deploy
npm run firebase:switch:staging
firebase deploy --only hosting:main,functions
```

### Preview Channel (Testing)
```bash
# Create preview channel for testing
npm run firebase:preview:create

# Emergency preview (1-day expiry)
npm run firebase:preview:emergency
```

### Environment Switching
```bash
# Switch between environments
npm run firebase:switch:prod      # Production
npm run firebase:switch:staging   # Staging  
npm run firebase:switch:preview   # Preview
npm run firebase:switch:dev       # Development
```

## Overview

ALCHM is a trauma-informed, AI-powered journaling OS built with Next.js and Firebase. This guide covers the complete production deployment process, from initial setup to ongoing maintenance.

### Architecture Summary
- **Frontend**: Next.js 15 with React 18 and TypeScript
- **Backend**: Firebase Functions with Node.js 20
- **Database**: Firestore with security rules and indexes
- **Hosting**: Firebase Hosting with multi-site configuration
- **Authentication**: Firebase Auth with crisis-safe fallbacks
- **Payment Processing**: Stripe integration
- **AI Services**: Google AI and Khepera AI integration
- **Monitoring**: Real-time health checks and crisis detection
- **Environments**: Production, Staging, Preview, Development

## 🏗️ Multi-Environment Configuration

### Environment Overview

ALCHM uses a comprehensive multi-environment setup designed for mental health application reliability:

| Environment | Purpose | URL | Configuration |
|-------------|---------|-----|---------------|
| **Production** | Live application | alchmapp.web.app | Full safety checks, 1GB memory, minInstances: 1 |
| **Staging** | Pre-production testing | alchmapp-staging.web.app | Medium safety, 512MB memory, minInstances: 0 |
| **Preview** | Feature testing | alchmapp-preview.web.app | Basic safety, 256MB memory, temporary channels |
| **Development** | Development testing | alchmapp-dev.web.app | Development mode, minimal resources |

### Firebase Configuration Files

- `firebase.json` - Production configuration with enhanced security
- `firebase.staging.json` - Staging configuration with reduced resources
- `firebase.preview.json` - Preview configuration for temporary deployments
- `.firebaserc` - Multi-project environment mappings

### Site Mappings

Each environment supports dual hosting targets:
- **Main Site**: Primary application (alchmapp, alchmapp-staging, etc.)
- **Emergency Site**: Crisis-accessible fallback (alchm-digital-sanctuary, etc.)

## Prerequisites

### Required Tools
```bash
# Install Node.js (version 18 or higher)
node --version  # Should be >=18.0.0

# Install Firebase CLI
npm install -g firebase-tools

# Install pnpm (package manager)
npm install -g pnpm

# Verify installations
firebase --version
pnpm --version
```

### Required Accounts & Services
- [ ] Firebase project created
- [ ] Google Cloud billing enabled (for Blaze plan)
- [ ] Stripe account (production mode)
- [ ] Domain name configured (optional)
- [ ] SSL certificate (handled by Firebase)

### Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd alchm

# Install dependencies
pnpm install

# Install function dependencies
cd functions
pnpm install
cd ..
```

## Deployment Process

### 1. Pre-Deployment Checklist

Run the production readiness audit:
```bash
./scripts/production-readiness-master.sh
```

This comprehensive script checks:
- Environment variables and secrets
- SSL certificates and domains
- Firebase quotas and billing
- Security rules and permissions
- User flow testing

### 2. Environment Configuration

Create production environment file:
```bash
cp .env.local.template .env.local
```

Configure required variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-production-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your-production-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"

# Stripe Configuration (PRODUCTION KEYS)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_stripe_price_id

# AI Services
GOOGLE_AI_API_KEY=your_google_ai_api_key
KHEPERA_AI_ENDPOINT=https://your-khepera-endpoint.com
KHEPERA_AI_API_KEY=your_khepera_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_APP_NAME=ALCHM
NODE_ENV=production
```

### 3. Firebase Project Setup

#### Authentication with Firebase
```bash
firebase login
firebase use your-production-project-id
```

#### Configure Firebase Functions Environment
```bash
# Set environment variables for functions
firebase functions:config:set \
  stripe.secret_key="sk_live_your_stripe_secret_key" \
  stripe.webhook_secret="whsec_your_webhook_secret" \
  google.ai_api_key="your_google_ai_api_key" \
  app.url="https://your-production-domain.com"
```

#### Deploy Security Rules
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules (if using)
firebase deploy --only storage:rules
```

### 4. Build and Deploy

#### Automated Deployment (Recommended)
```bash
./deploy-to-production.sh
```

This script automatically:
- Runs pre-deployment checks
- Builds the application
- Runs tests and type checking
- Deploys to Firebase
- Runs post-deployment verification

#### Manual Deployment Process
```bash
# 1. Run production readiness checks
./scripts/production-readiness-master.sh

# 2. Build the application
npm run build

# 3. Run tests
npm run test

# 4. Type checking
npm run typecheck

# 5. Build functions
cd functions
pnpm run build
cd ..

# 6. Deploy to Firebase
firebase deploy --only hosting,functions

# 7. Post-deployment verification
./scripts/production-user-flow-test.sh
```

### 5. Domain Configuration (Optional)

#### Custom Domain Setup
1. **In Firebase Console:**
   - Go to Hosting section
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **DNS Configuration:**
   ```
   # Add these DNS records:
   Type: A
   Name: @
   Value: [Firebase IP addresses provided]
   
   Type: CNAME
   Name: www
   Value: your-project.web.app
   ```

3. **Verify Domain:**
   ```bash
   # Check SSL certificate status
   ./scripts/ssl-monitor.sh your-domain.com
   ```

## Environment Configuration

### Development vs Production

| Environment | Purpose | Key Differences |
|-------------|---------|-----------------|
| Development | Local development | Test API keys, localhost URLs |
| Staging | Pre-production testing | Production-like setup, test data |
| Production | Live application | Production API keys, real data |

### Environment Variables Security

**Critical Security Requirements:**
- Never commit `.env.local` to version control
- Use production API keys only in production
- Rotate keys regularly
- Monitor for key exposure

**Validation:**
```bash
# Run environment audit
./scripts/env-audit.sh
```

## Firebase Setup

### Project Configuration

1. **Create Firebase Project:**
   - Visit [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Blaze plan for production features

2. **Enable Services:**
   ```bash
   # Enable required services
   firebase functions:log  # Enable Functions
   firebase firestore:usage  # Enable Firestore
   firebase auth:export  # Enable Authentication
   ```

3. **Configure Security:**
   - Set up Firestore security rules
   - Configure Firebase App Check
   - Enable audit logging

### Firestore Configuration

#### Security Rules Deployment
```bash
# Deploy production-ready security rules
cp firestore.rules.template firestore.rules
firebase deploy --only firestore:rules
```

#### Index Management
```bash
# Deploy composite indexes
firebase deploy --only firestore:indexes
```

### Functions Configuration

#### Memory and Timeout Settings
```javascript
// functions/src/index.ts
import { onRequest } from 'firebase-functions/v2/https';

export const nextApp = onRequest({
  memory: '1GiB',
  timeoutSeconds: 60,
  concurrency: 100
}, nextjsApp);
```

#### Environment Variables
```bash
# Set production environment variables
firebase functions:config:set \
  app.env="production" \
  app.debug="false" \
  stripe.webhook_endpoint_secret="whsec_..."
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Install function dependencies
      run: cd functions && pnpm install
    
    - name: Run production readiness checks
      run: ./scripts/production-readiness-master.sh
      env:
        NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        # Add other environment variables
    
    - name: Build application
      run: npm run build
    
    - name: Run tests
      run: npm run test
    
    - name: Type checking
      run: npm run typecheck
    
    - name: Deploy to Firebase
      run: firebase deploy --only hosting,functions --token ${{ secrets.FIREBASE_TOKEN }}
    
    - name: Post-deployment testing
      run: ./scripts/production-user-flow-test.sh
```

### Required GitHub Secrets

Add these secrets to your GitHub repository:

```
FIREBASE_TOKEN=your_firebase_ci_token
FIREBASE_API_KEY=your_production_api_key
FIREBASE_PROJECT_ID=your_production_project_id
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Manual CI Token Generation
```bash
# Generate Firebase CI token
firebase login:ci
# Save the token as FIREBASE_TOKEN secret
```

## Post-Deployment Verification

### Automated Verification
```bash
# Run comprehensive post-deployment tests
./scripts/production-user-flow-test.sh
```

### Manual Verification Checklist

#### Core Functionality
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Journal creation and editing
- [ ] AI integration functions
- [ ] Payment processing works
- [ ] Email notifications sent

#### Performance Checks
- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass

#### Security Verification
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Authentication required for protected routes
- [ ] API endpoints secured
- [ ] Firestore rules working

#### Monitoring Setup
- [ ] Error tracking active
- [ ] Performance monitoring enabled
- [ ] Usage analytics configured
- [ ] Billing alerts set up

### Health Check Endpoints

Test these endpoints after deployment:
```bash
# Basic health check
curl https://your-domain.com/api/health/ping

# Detailed status
curl https://your-domain.com/api/health/status

# Database connectivity
curl https://your-domain.com/api/health/database
```

## Monitoring & Maintenance

### Daily Monitoring
```bash
# Run quota monitoring
./scripts/quota-monitor.sh

# Check SSL certificates
./scripts/ssl-monitor.sh

# Review error logs
firebase functions:log --limit 50
```

### Weekly Maintenance
```bash
# Full production testing
./scripts/production-user-flow-test.sh

# Security audit
./scripts/security-rules-audit.sh

# Performance review
npm run lighthouse
```

### Monthly Reviews
```bash
# Complete readiness audit
./scripts/production-readiness-master.sh

# Update dependencies
pnpm update

# Security updates
npm audit fix
```

### Monitoring Dashboards

#### Firebase Console Monitoring
- [Project Overview](https://console.firebase.google.com/project/_/overview)
- [Functions Monitoring](https://console.firebase.google.com/project/_/functions)
- [Firestore Usage](https://console.firebase.google.com/project/_/firestore/usage)
- [Hosting Analytics](https://console.firebase.google.com/project/_/hosting)

#### Google Cloud Monitoring
- [Cloud Console](https://console.cloud.google.com)
- [Billing Dashboard](https://console.cloud.google.com/billing)
- [Error Reporting](https://console.cloud.google.com/errors)

### Alerting Setup

#### Billing Alerts
```bash
# Set up billing alerts in Google Cloud Console
# 1. Go to Billing → Budgets & alerts
# 2. Create budget with alert thresholds (50%, 90%, 100%)
# 3. Configure email notifications
```

#### Error Rate Alerts
```bash
# Configure error rate monitoring
# 1. Go to Cloud Monitoring
# 2. Create alerting policy for error rates
# 3. Set threshold: >5% error rate over 5 minutes
# 4. Configure notification channels
```

### Performance Optimization

#### Lighthouse Audits
```bash
# Run Lighthouse audit
npx lighthouse https://your-domain.com --output html
```

#### Core Web Vitals Monitoring
```bash
# Monitor via Google PageSpeed Insights
# https://pagespeed.web.dev/
```

## Emergency Procedures

### Quick Status Check
```bash
# Check if site is responding
curl -I https://your-domain.com

# Check Firebase services
firebase projects:list
```

### Emergency Contacts
- **Firebase Support**: Firebase Console → Support
- **Google Cloud Support**: Cloud Console → Support
- **Stripe Support**: Stripe Dashboard → Support
- **Domain Registrar**: [Your domain provider]

### Escalation Process
1. **Minor Issues**: Check logs, attempt self-resolution
2. **Major Issues**: Contact team lead, review rollback options
3. **Critical Issues**: Implement rollback, contact all stakeholders

---

## Quick Reference Commands

```bash
# Deploy to production
./deploy-to-production.sh

# Check production readiness
./scripts/production-readiness-master.sh

# Test production environment
./scripts/production-user-flow-test.sh

# Monitor quotas
./scripts/quota-monitor.sh

# Check SSL certificates
./scripts/ssl-monitor.sh

# View function logs
firebase functions:log --limit 50

# Check project status
firebase projects:list
```

## Support Resources

- **Documentation**: [Firebase Documentation](https://firebase.google.com/docs)
- **Community**: [Firebase Slack](https://firebase.community)
- **Status Page**: [Firebase Status](https://status.firebase.google.com)
- **Project Repository**: [GitHub Repository](https://github.com/your-org/alchm)

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: ALCHM Development Team