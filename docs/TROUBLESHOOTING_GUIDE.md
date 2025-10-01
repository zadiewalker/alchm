# ALCHM Troubleshooting Guide

## Table of Contents
- [Quick Diagnostics](#quick-diagnostics)
- [Common Issues](#common-issues)
- [Deployment Issues](#deployment-issues)
- [Firebase Issues](#firebase-issues)
- [Authentication Problems](#authentication-problems)
- [Database & Firestore Issues](#database--firestore-issues)
- [Performance Issues](#performance-issues)
- [Security & SSL Issues](#security--ssl-issues)
- [AI Integration Issues](#ai-integration-issues)
- [Payment & Stripe Issues](#payment--stripe-issues)
- [Monitoring & Logging](#monitoring--logging)
- [Emergency Response](#emergency-response)

## Quick Diagnostics

### Health Check Commands
```bash
# Quick site status
curl -I https://your-domain.com

# API health checks
curl https://your-domain.com/api/health/ping
curl https://your-domain.com/api/health/status
curl https://your-domain.com/api/health/database

# Firebase authentication
firebase projects:list

# Function logs
firebase functions:log --limit 10

# Production readiness
./scripts/production-readiness-master.sh
```

### Status Indicators
- **🟢 Healthy**: All services responding normally
- **🟡 Warning**: Some degradation, monitoring required
- **🔴 Critical**: Service down or major issues
- **⚫ Unknown**: Unable to determine status

## Common Issues

### Issue: Site Not Loading
**Symptoms**: 
- Browser shows "Site can't be reached"
- Timeout errors
- DNS resolution failures

**Diagnosis**:
```bash
# Check domain resolution
nslookup your-domain.com

# Test direct Firebase hosting
curl -I https://your-project-id.web.app

# Check SSL certificate
./scripts/ssl-monitor.sh your-domain.com

# Verify hosting deployment
firebase hosting:sites:list
```

**Solutions**:
1. **DNS Issues**:
   ```bash
   # Verify DNS records
   dig your-domain.com A
   dig www.your-domain.com CNAME
   
   # Wait for DNS propagation (up to 48 hours)
   # Use DNS checker: https://dnschecker.org
   ```

2. **Firebase Hosting Issues**:
   ```bash
   # Redeploy hosting
   firebase deploy --only hosting
   
   # Check hosting status
   firebase hosting:sites:list
   ```

3. **SSL Certificate Problems**:
   ```bash
   # Check certificate status in Firebase Console
   # SSL certificates can take up to 24 hours to provision
   
   # Force SSL certificate refresh
   # Remove and re-add custom domain in Firebase Console
   ```

### Issue: 500 Internal Server Error
**Symptoms**:
- HTTP 500 responses
- "Something went wrong" error pages
- Function execution errors

**Diagnosis**:
```bash
# Check function logs
firebase functions:log --limit 50

# Check function status
firebase functions:list

# Test API endpoints individually
curl -v https://your-domain.com/api/health/ping
```

**Solutions**:
1. **Function Errors**:
   ```bash
   # Redeploy functions
   firebase deploy --only functions
   
   # Check function configuration
   firebase functions:config:get
   
   # Verify environment variables
   ./scripts/env-audit.sh
   ```

2. **Memory/Timeout Issues**:
   ```javascript
   // Increase function memory/timeout
   // functions/src/index.ts
   export const nextApp = onRequest({
     memory: '2GiB',
     timeoutSeconds: 120
   }, nextjsApp);
   ```

3. **Dependencies**:
   ```bash
   # Rebuild function dependencies
   cd functions
   rm -rf node_modules package-lock.json
   pnpm install
   pnpm run build
   cd ..
   firebase deploy --only functions
   ```

### Issue: Authentication Failures
**Symptoms**:
- Users can't sign in
- "Authentication failed" errors
- Redirect loop after login

**Diagnosis**:
```bash
# Check Firebase Auth configuration
firebase auth:export --format=json auth_backup.json

# Verify auth domain
echo $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

# Test auth endpoints
curl https://your-domain.com/api/auth/session
```

**Solutions**:
1. **Configuration Issues**:
   ```bash
   # Verify auth domain in Firebase Console
   # Go to Authentication → Settings → Authorized domains
   # Add your production domain
   
   # Check environment variables
   ./scripts/env-audit.sh
   ```

2. **Domain Authorization**:
   - Add production domain to Firebase Auth authorized domains
   - Ensure HTTPS is properly configured
   - Check for CORS issues

3. **Session Management**:
   ```javascript
   // Check session validation
   // src/lib/validateSession.ts
   export async function validateSession(request: NextRequest) {
     // Ensure proper token validation
   }
   ```

## Deployment Issues

### Issue: Build Failures
**Symptoms**:
- `npm run build` fails
- TypeScript compilation errors
- Missing dependencies

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install

# Fix TypeScript errors
npm run typecheck

# Check for missing dependencies
pnpm audit

# Build with verbose logging
npm run build -- --debug
```

### Issue: Function Deployment Failures
**Symptoms**:
- `firebase deploy --only functions` fails
- Function build errors
- Timeout during deployment

**Solutions**:
```bash
# Build functions locally first
cd functions
pnpm run build

# Check function size (max 500MB)
du -sh lib/

# Deploy with increased timeout
firebase deploy --only functions --timeout 1800

# Deploy functions individually
firebase deploy --only functions:nextApp
```

### Issue: Environment Variable Problems
**Symptoms**:
- Missing configuration errors
- API keys not working
- Database connection failures

**Solutions**:
```bash
# Audit environment variables
./scripts/env-audit.sh

# Check Firebase Functions config
firebase functions:config:get

# Set missing variables
firebase functions:config:set stripe.secret_key="sk_live_..."

# Verify environment consistency
diff .env.local.template .env.local
```

## Firebase Issues

### Issue: Quota Exceeded
**Symptoms**:
- "Quota exceeded" errors
- Service temporarily unavailable
- Billing alerts triggered

**Diagnosis**:
```bash
# Check current usage
./scripts/quota-monitor.sh

# Firebase Console usage dashboard
open https://console.firebase.google.com/project/$(firebase use)/usage
```

**Solutions**:
1. **Immediate Actions**:
   ```bash
   # Upgrade to Blaze plan if on Spark
   # Implement rate limiting
   # Optimize queries and functions
   ```

2. **Long-term Optimization**:
   ```javascript
   // Optimize Firestore queries
   const query = collection(db, 'journals')
     .where('userId', '==', userId)
     .limit(10); // Add limits
   
   // Implement pagination
   const startAfter = lastVisible;
   const next = query(
     collection(db, 'journals'),
     orderBy('createdAt'),
     startAfter(startAfter),
     limit(25)
   );
   ```

### Issue: Security Rules Blocking Access
**Symptoms**:
- "Permission denied" errors
- Unable to read/write data
- Authentication works but data access fails

**Diagnosis**:
```bash
# Test security rules
firebase firestore:rules:get

# Check rules in Firebase Console
# Go to Firestore → Rules
```

**Solutions**:
```javascript
// Review and update firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ensure proper authentication checks
    match /journals/{journalId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
  }
}

// Deploy updated rules
firebase deploy --only firestore:rules
```

## Authentication Problems

### Issue: Login Redirect Loops
**Symptoms**:
- Infinite redirect after login
- Session not persisting
- "Already signed in" errors

**Solutions**:
1. **Check Redirect Configuration**:
   ```javascript
   // pages/api/auth/callback.ts
   export default function handler(req: NextRequest) {
     // Ensure proper redirect handling
     return redirect('/dashboard');
   }
   ```

2. **Session Persistence**:
   ```javascript
   // Check session storage
   import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
   
   const auth = getAuth();
   setPersistence(auth, browserLocalPersistence);
   ```

### Issue: Token Expiration
**Symptoms**:
- Users randomly logged out
- "Token expired" errors
- Need to re-authenticate frequently

**Solutions**:
```javascript
// Implement token refresh
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Refresh token if needed
    const token = await user.getIdToken(true);
    // Update session
  }
});
```

## Database & Firestore Issues

### Issue: Slow Queries
**Symptoms**:
- Long database response times
- Timeout errors
- Poor user experience

**Diagnosis**:
```bash
# Check query performance in Firebase Console
# Go to Firestore → Usage tab

# Monitor function execution time
firebase functions:log --filter="duration"
```

**Solutions**:
1. **Add Indexes**:
   ```javascript
   // Create composite indexes for complex queries
   // Firebase Console → Firestore → Indexes
   
   // Or use firestore.indexes.json
   {
     "indexes": [
       {
         "collectionGroup": "journals",
         "queryScope": "COLLECTION",
         "fields": [
           { "fieldPath": "userId", "order": "ASCENDING" },
           { "fieldPath": "createdAt", "order": "DESCENDING" }
         ]
       }
     ]
   }
   ```

2. **Optimize Queries**:
   ```javascript
   // Use limits and pagination
   const journals = query(
     collection(db, 'journals'),
     where('userId', '==', userId),
     orderBy('createdAt', 'desc'),
     limit(20)
   );
   
   // Avoid compound queries when possible
   // Use single field queries with client-side filtering
   ```

### Issue: Data Consistency Problems
**Symptoms**:
- Data appears inconsistent
- Updates not reflecting immediately
- Conflicts between users

**Solutions**:
```javascript
// Use transactions for critical updates
import { runTransaction } from 'firebase/firestore';

await runTransaction(db, async (transaction) => {
  const docRef = doc(db, 'journals', journalId);
  const docSnap = await transaction.get(docRef);
  
  if (docSnap.exists()) {
    transaction.update(docRef, {
      content: newContent,
      updatedAt: serverTimestamp()
    });
  }
});

// Implement optimistic updates with rollback
const optimisticUpdate = () => {
  // Update UI immediately
  setLocalState(newValue);
  
  // Send to server
  updateServer(newValue).catch(error => {
    // Rollback on error
    setLocalState(previousValue);
    showError(error);
  });
};
```

## Performance Issues

### Issue: Slow Page Load Times
**Symptoms**:
- Pages take >3 seconds to load
- Poor Lighthouse scores
- High bounce rates

**Diagnosis**:
```bash
# Run Lighthouse audit
npx lighthouse https://your-domain.com --output html

# Check Core Web Vitals
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://your-domain.com"

# Monitor function cold starts
firebase functions:log --filter="cold start"
```

**Solutions**:
1. **Optimize Bundle Size**:
   ```javascript
   // Use dynamic imports
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Skeleton />,
     ssr: false
   });
   
   // Code splitting
   const LazyPage = lazy(() => import('./LazyPage'));
   ```

2. **Optimize Images**:
   ```javascript
   // Use Next.js Image optimization
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={500}
     height={300}
     priority // For above-the-fold images
   />
   ```

3. **Function Optimization**:
   ```javascript
   // Keep functions warm
   export const keepWarm = onSchedule('every 5 minutes', async (event) => {
     // Minimal ping to keep functions warm
   });
   
   // Increase function memory for better performance
   export const nextApp = onRequest({
     memory: '2GiB',
     timeoutSeconds: 60
   }, app);
   ```

### Issue: High Memory Usage
**Symptoms**:
- Function out of memory errors
- Slow garbage collection
- High cloud costs

**Solutions**:
```javascript
// Optimize memory usage
const processLargeData = async (data) => {
  // Process in chunks
  const chunkSize = 100;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await processChunk(chunk);
    
    // Force garbage collection hint
    if (global.gc) global.gc();
  }
};

// Increase function memory if needed
export const dataProcessor = onRequest({
  memory: '4GiB'
}, handler);
```

## Security & SSL Issues

### Issue: SSL Certificate Errors
**Symptoms**:
- "Not secure" warnings in browser
- SSL handshake failures
- Certificate expiration warnings

**Diagnosis**:
```bash
# Check SSL certificate
./scripts/ssl-monitor.sh your-domain.com

# Test SSL configuration
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check certificate expiration
echo | openssl s_client -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

**Solutions**:
1. **Firebase Managed Certificates**:
   ```bash
   # Remove and re-add domain in Firebase Console
   # Certificates auto-renew but may need manual trigger
   
   # Verify domain ownership
   # Check DNS propagation
   ```

2. **Custom Certificates**:
   ```bash
   # Upload new certificate in Firebase Console
   # Ensure private key is included
   # Check certificate chain completeness
   ```

### Issue: Security Headers Missing
**Symptoms**:
- Security scanner warnings
- Poor security audit scores
- XSS/clickjacking vulnerabilities

**Solutions**:
```json
// Update firebase.json headers
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
          }
        ]
      }
    ]
  }
}
```

## AI Integration Issues

### Issue: AI API Failures
**Symptoms**:
- AI responses not generating
- "Service unavailable" errors
- Timeout on AI requests

**Diagnosis**:
```bash
# Check API key configuration
echo $GOOGLE_AI_API_KEY | head -c 20

# Test API endpoint directly
curl -H "Authorization: Bearer $GOOGLE_AI_API_KEY" \
  "https://generativelanguage.googleapis.com/v1/models"

# Check function logs for AI errors
firebase functions:log --filter="AI"
```

**Solutions**:
1. **API Key Issues**:
   ```bash
   # Verify API key in Google Cloud Console
   # Check API quotas and billing
   # Regenerate key if compromised
   
   # Update function configuration
   firebase functions:config:set google.ai_api_key="new_key"
   firebase deploy --only functions
   ```

2. **Rate Limiting**:
   ```javascript
   // Implement exponential backoff
   const retryWithBackoff = async (fn, maxRetries = 3) => {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await new Promise(resolve => 
           setTimeout(resolve, Math.pow(2, i) * 1000)
         );
       }
     }
   };
   ```

### Issue: Khepera AI Integration Problems
**Symptoms**:
- Tag generation failures
- Custom AI endpoint errors
- Authentication issues with Khepera

**Solutions**:
```javascript
// Check Khepera configuration
const khepera = {
  endpoint: process.env.KHEPERA_AI_ENDPOINT,
  apiKey: process.env.KHEPERA_AI_API_KEY
};

// Implement proper error handling
try {
  const response = await fetch(`${khepera.endpoint}/generate-tags`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${khepera.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  
  if (!response.ok) {
    throw new Error(`Khepera API error: ${response.status}`);
  }
} catch (error) {
  console.error('Khepera integration error:', error);
  // Fallback to basic tagging
}
```

## Payment & Stripe Issues

### Issue: Payment Processing Failures
**Symptoms**:
- Credit card charges failing
- Webhook events not processed
- Subscription status inconsistencies

**Diagnosis**:
```bash
# Check Stripe webhook configuration
curl https://your-domain.com/api/stripe-webhook \
  -H "stripe-signature: test"

# Verify Stripe keys
echo $STRIPE_SECRET_KEY | head -c 20

# Check webhook endpoint in Stripe Dashboard
```

**Solutions**:
1. **Webhook Configuration**:
   ```javascript
   // Verify webhook signature
   import { stripe } from '@/lib/stripe';
   
   const sig = request.headers.get('stripe-signature');
   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
   
   try {
     const event = stripe.webhooks.constructEvent(
       body, 
       sig, 
       webhookSecret
     );
   } catch (err) {
     console.error('Webhook signature verification failed:', err);
     return new Response('Webhook Error', { status: 400 });
   }
   ```

2. **Test vs Live Keys**:
   ```bash
   # Ensure using live keys in production
   if [[ $STRIPE_SECRET_KEY == sk_test_* ]]; then
     echo "ERROR: Using test keys in production"
     exit 1
   fi
   ```

### Issue: Subscription Sync Issues
**Symptoms**:
- User subscription status incorrect
- Access granted when payment failed
- Double billing issues

**Solutions**:
```javascript
// Implement subscription status sync
const syncSubscriptionStatus = async (customerId) => {
  const customer = await stripe.customers.retrieve(customerId);
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active'
  });
  
  // Update user document with current status
  await updateDoc(doc(db, 'users', userId), {
    subscriptionStatus: subscriptions.data.length > 0 ? 'active' : 'inactive',
    lastSyncAt: new Date()
  });
};
```

## Monitoring & Logging

### Log Analysis Commands
```bash
# Function logs with filters
firebase functions:log --filter="ERROR"
firebase functions:log --filter="severity>=ERROR"
firebase functions:log --limit 100

# Specific function logs
firebase functions:log --only nextApp

# Real-time log streaming
firebase functions:log --follow

# Export logs for analysis
firebase functions:log --format json > logs.json
```

### Common Log Patterns
```bash
# Find authentication errors
firebase functions:log --filter="auth" | grep -i error

# Monitor performance issues
firebase functions:log --filter="timeout\|memory"

# Track API errors
firebase functions:log --filter="api.*error"

# Database errors
firebase functions:log --filter="firestore.*error"
```

### Setting Up Alerts
```javascript
// Cloud Function for error alerting
export const errorAlert = onCall(async (data, context) => {
  const { error, severity, component } = data;
  
  if (severity === 'critical') {
    // Send immediate notification
    await sendSlackAlert({
      channel: '#alerts',
      message: `🚨 Critical error in ${component}: ${error.message}`
    });
  }
});
```

## Emergency Response

### Immediate Response Checklist
1. **🚨 Critical Site Down**:
   ```bash
   # Check overall status
   curl -I https://your-domain.com
   
   # Check Firebase status
   curl -I https://your-project-id.web.app
   
   # Implement rollback if needed
   ./scripts/rollback-deployment.sh
   ```

2. **🔥 Security Breach**:
   ```bash
   # Disable user access immediately
   firebase firestore:rules:file disable_access.rules
   firebase deploy --only firestore:rules
   
   # Rotate API keys
   # Review audit logs
   # Contact security team
   ```

3. **💸 Unexpected Billing Spike**:
   ```bash
   # Check current usage
   ./scripts/quota-monitor.sh
   
   # Implement emergency rate limiting
   # Contact Google Cloud billing support
   # Review recent deployments
   ```

### Escalation Contacts
- **Technical Lead**: [Contact Info]
- **DevOps Engineer**: [Contact Info]
- **Security Team**: [Contact Info]
- **Firebase Support**: Firebase Console → Support
- **Emergency Hotline**: [24/7 Contact]

### Communication Templates

#### Status Page Update
```
🔴 We are currently experiencing technical difficulties with ALCHM. 
Our team is investigating and working on a resolution. 
Updates will be provided every 15 minutes.
Last updated: [TIMESTAMP]
```

#### User Notification
```
Subject: ALCHM Service Update

We're currently experiencing technical issues that may affect your ability to access ALCHM. 
Our team is working to resolve this quickly. 
Your data is safe and secure.

We'll update you as soon as service is restored.
Thank you for your patience.
```

---

## Quick Reference

### Emergency Commands
```bash
# Quick health check
curl -I https://your-domain.com/api/health/ping

# Rollback deployment
git revert HEAD
./deploy-to-production.sh

# Disable functions
firebase functions:delete nextApp

# Check system status
./scripts/production-readiness-master.sh
```

### Support Resources
- **Firebase Status**: https://status.firebase.google.com
- **Google Cloud Status**: https://status.cloud.google.com
- **Stripe Status**: https://status.stripe.com
- **Project Documentation**: ./README.md
- **Architecture Guide**: ./ARCHITECTURE.md

---

**Last Updated**: $(date)
**Emergency Contact**: [Your emergency contact information]