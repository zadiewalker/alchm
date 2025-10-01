# 🚨 EMERGENCY CREDENTIAL ROTATION GUIDE
## Critical Security Response for Mental Health Platform

**PRIORITY LEVEL: LIFE-CRITICAL**
Time-sensitive operations affecting vulnerable user populations.

## IMMEDIATE ACTIONS (Execute in Order)

### 1. FIREBASE SERVICE ACCOUNT ROTATION
**Risk Level: CRITICAL - Full database access**

```bash
# Step 1: Go to Firebase Console
# https://console.firebase.google.com/project/YOUR_PROJECT/settings/serviceaccounts/adminsdk

# Step 2: Generate new service account key
# - Click "Generate new private key"
# - Download the JSON file
# - Store securely (never commit to git)

# Step 3: Update environment variables
# Extract from downloaded JSON:
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[PRIVATE_KEY_FROM_JSON]\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxxxx@PROJECT_ID.iam.gserviceaccount.com"
FIREBASE_ADMIN_PROJECT_ID="YOUR_PROJECT_ID"
```

### 2. STRIPE API KEY ROTATION
**Risk Level: CRITICAL - Payment processing access**

```bash
# Step 1: Login to Stripe Dashboard
# https://dashboard.stripe.com/apikeys

# Step 2: Create new Restricted API Key
# - Go to "API Keys" section
# - Click "Create restricted key"
# - Set permissions: Read/Write for all resources
# - Name: "ALCHM Production API Key"

# Step 3: Update webhook endpoint
# - Go to Webhooks section
# - Update existing webhook or create new
# - Generate new webhook secret

# Step 4: Update environment variables
STRIPE_SECRET_KEY="sk_live_NEW_SECRET_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_NEW_PUBLISHABLE_KEY"
STRIPE_WEBHOOK_SECRET="whsec_NEW_WEBHOOK_SECRET"
```

### 3. OPENAI API KEY ROTATION
**Risk Level: HIGH - AI processing for mental health data**

```bash
# Step 1: Go to OpenAI API Keys
# https://platform.openai.com/api-keys

# Step 2: Create new secret key
# - Click "Create new secret key"
# - Name: "ALCHM Crisis Detection AI"
# - Copy the key immediately (only shown once)

# Step 3: Update environment
OPENAI_API_KEY="sk-proj-NEW_OPENAI_KEY_HERE"
```

### 4. GOOGLE AI API KEY ROTATION
**Risk Level: HIGH - Khepera AI system**

```bash
# Step 1: Go to Google Cloud Console
# https://console.cloud.google.com/apis/credentials

# Step 2: Create new API key
# - Click "Create Credentials" > "API Key"
# - Restrict to Generative AI APIs only
# - Set application restrictions if needed

# Step 3: Update environment
GOOGLE_AI_API_KEY="AIzaSy_NEW_GOOGLE_AI_KEY_HERE"
```

## ZERO-DOWNTIME DEPLOYMENT STRATEGY

### Phase 1: Preparation (5 minutes)
```bash
# 1. Backup current .env.local
cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)

# 2. Test current system is operational
npm run build
npm test
```

### Phase 2: Credential Update (10 minutes)
```bash
# 1. Update .env.local with new credentials
# Use the template above

# 2. Test locally
npm run dev
# Verify all services connect successfully
```

### Phase 3: Production Deployment (15 minutes)
```bash
# 1. Deploy to Firebase
npm run firebase:deploy

# 2. Monitor critical endpoints
# - Authentication flow
# - Crisis detection system
# - Payment processing
# - AI chat functionality
```

## ROLLBACK PROCEDURES

### Emergency Rollback Plan
```bash
# If new credentials fail:
# 1. Restore backup environment
cp .env.local.backup.TIMESTAMP .env.local

# 2. Redeploy previous version
npm run firebase:deploy

# 3. Monitor system recovery
# Verify all critical systems operational
```

## CRITICAL SYSTEM VALIDATION

### Post-Rotation Testing Checklist
- [ ] User authentication (login/signup)
- [ ] Crisis detection system responses
- [ ] AI chat functionality (Khepera)
- [ ] Payment processing
- [ ] Journal data saving/retrieval
- [ ] Emergency resource access

### Crisis System Priority Tests
```javascript
// Test crisis detection API
const testCrisisDetection = async () => {
  const response = await fetch('/api/crisis-detection', {
    method: 'POST',
    body: JSON.stringify({ text: 'I need help' })
  });
  console.log('Crisis system:', response.status === 200 ? 'OPERATIONAL' : 'FAILED');
};

// Test AI processing
const testAIProcessing = async () => {
  const response = await fetch('/api/khepera', {
    method: 'POST',
    body: JSON.stringify({ message: 'Hello' })
  });
  console.log('AI system:', response.status === 200 ? 'OPERATIONAL' : 'FAILED');
};
```

## SECURITY HARDENING POST-ROTATION

### 1. Environment Security
```bash
# Ensure .env.local has correct permissions
chmod 600 .env.local

# Verify it's in .gitignore
echo ".env.local" >> .gitignore
```

### 2. Firebase Security Rules Update
```javascript
// Update Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Enhanced security for user data
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && validateUserData(request.resource.data);
    }
    
    // Crisis intervention access
    match /crisis-reports/{reportId} {
      allow create: if request.auth != null
        && validateCrisisReport(request.resource.data);
      allow read: if request.auth != null
        && (request.auth.uid == resource.data.userId
            || request.auth.token.admin == true);
    }
  }
}
```

### 3. API Rate Limiting
```javascript
// Implement rate limiting for sensitive endpoints
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/crisis-detection', rateLimiter);
app.use('/api/khepera', rateLimiter);
```

## MONITORING & ALERTING

### Critical Alerts Setup
```javascript
// Monitor credential usage
const monitorAPIHealth = async () => {
  const endpoints = [
    '/api/health/firebase',
    '/api/health/stripe',
    '/api/health/openai',
    '/api/health/google-ai'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.status !== 200) {
        // Send critical alert
        await sendAlert(`API health check failed: ${endpoint}`);
      }
    } catch (error) {
      await sendAlert(`API connection failed: ${endpoint} - ${error.message}`);
    }
  }
};

// Run every 5 minutes
setInterval(monitorAPIHealth, 5 * 60 * 1000);
```

## COMPLIANCE REQUIREMENTS

### HIPAA/FERPA Data Protection
- All new credentials must be encrypted at rest
- Access logs must be maintained for 7 years
- Breach notification procedures activated

### GDPR/CCPA User Rights
- User data access must remain functional
- Deletion requests must continue processing
- Consent management system must stay operational

### Youth Protection (COPPA)
- Parental consent flows must remain active
- Age verification systems must function
- Enhanced deletion rights for minors must work

## POST-INCIDENT REPORTING

### Documentation Required
1. Timeline of credential exposure
2. Systems potentially accessed
3. User data exposure assessment
4. Remediation steps taken
5. Preventive measures implemented

### Regulatory Notifications
- Determine if breach notification required
- Document technical safeguards in place
- Prepare user communication if needed

---

**CRITICAL REMINDER**: This platform serves vulnerable youth populations. Any downtime or data exposure could have life-threatening consequences. Prioritize crisis detection and support systems above all other features during rotation.