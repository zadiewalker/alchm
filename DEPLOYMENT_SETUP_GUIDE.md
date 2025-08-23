# 🚀 ALCHM Deployment Setup Guide
**Firebase + Vercel CI/CD Configuration**

---

## 🎯 Quick Setup Commands

### 1. Firebase Authentication & Service Account

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Generate CI token (for GitHub Actions)
firebase login:ci

# Copy the token output for later use in GitHub secrets
```

### 2. Create Firebase Service Account

```bash
# Go to Firebase Console → Project Settings → Service Accounts
# Click "Generate new private key" → Download JSON file
# This will be used as FIREBASE_SERVICE_ACCOUNT secret
```

### 3. Vercel Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project (run from project root)
vercel link

# Get Vercel project settings
vercel env ls

# Get Vercel tokens for CI/CD
# Go to vercel.com/account/tokens → Create new token
```

---

## 🔑 Environment Variables & Secrets

### GitHub Repository Secrets

Add these secrets in GitHub → Repository → Settings → Secrets and Variables → Actions:

```bash
# Firebase Secrets
FIREBASE_TOKEN=1//your-generated-token-from-firebase-login-ci
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"alchm-digital-sanctuary",...}

# Vercel Secrets  
VERCEL_TOKEN=your-vercel-token-here
VERCEL_ORG_ID=team_abc123 
VERCEL_PROJECT_ID=prj_abc123xyz

# App Environment Variables
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=alchm-digital-sanctuary.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=alchm-digital-sanctuary
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=alchm-digital-sanctuary.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_...

# Optional: Notification Webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Vercel Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=alchm-digital-sanctuary.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=alchm-digital-sanctuary
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=alchm-digital-sanctuary.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://alchm.app
NEXT_PUBLIC_ENVIRONMENT=production
```

### Firebase Functions Environment Variables

```bash
# Set Firebase function environment variables
firebase functions:config:set \
  stripe.secret_key="sk_live_..." \
  stripe.webhook_secret="whsec_..." \
  gemini.api_key="your_google_ai_key" \
  app.environment="production"

# Deploy the configuration
firebase functions:config:get > functions/.runtimeconfig.json
```

---

## 📁 Required Project Structure

Ensure your project follows this structure:

```
alchm/
├── .github/
│   └── workflows/
│       └── firebase.yml              # ✅ CI/CD workflow
├── apps/web/                         # (Optional: if using monorepo)
│   ├── src/
│   ├── package.json
│   └── next.config.js
├── functions/                        # ✅ Firebase Functions
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── src/                              # ✅ Next.js app source
│   ├── app/
│   ├── components/
│   └── lib/
├── public/                           # ✅ Static assets
├── .firebaserc                       # ✅ Firebase project config
├── firebase.json                     # ✅ Firebase hosting/functions config
├── vercel.json                       # ✅ Vercel deployment config
├── next.config.js                    # ✅ Next.js configuration
├── package.json                      # ✅ Root dependencies
└── .env.local                        # ✅ Local environment (gitignored)
```

---

## ⚙️ Package.json Scripts Update

Add these scripts to your root `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:firebase": "next build && next export",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    
    "firebase:emulators": "firebase emulators:start",
    "firebase:deploy": "firebase deploy",
    "firebase:deploy:functions": "firebase deploy --only functions",
    "firebase:deploy:hosting": "firebase deploy --only hosting",
    
    "vercel:deploy": "vercel --prod",
    "vercel:preview": "vercel",
    
    "deploy:all": "npm run build && firebase deploy && vercel --prod"
  }
}
```

---

## 🔧 Firebase Configuration Files

### .firebaserc

```json
{
  "projects": {
    "default": "alchm-digital-sanctuary"
  },
  "targets": {
    "alchm-digital-sanctuary": {
      "hosting": {
        "production": [
          "alchm-digital-sanctuary"
        ]
      }
    }
  }
}
```

### firestore.rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Journal entries subcollection
      match /entries/{entryId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public crisis resources
    match /crisis-resources/{resourceId} {
      allow read: if true;
      allow write: if false;
    }
    
    // AI analysis results (read-only for users)
    match /ai-analysis/{analysisId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow write: if false;
    }
  }
}
```

### storage.rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/profile/{imageId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Journal attachments
    match /users/{userId}/journal-attachments/{attachmentId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public assets
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🔍 Testing Deployment Pipeline

### 1. Test Locally

```bash
# Test Firebase emulators
npm run firebase:emulators

# Test Next.js build
npm run build

# Test Vercel build locally
vercel dev
```

### 2. Test Firebase Functions

```bash
# Build functions
cd functions && npm run build

# Test functions locally
firebase emulators:start --only functions

# Test specific function
curl http://localhost:5001/alchm-digital-sanctuary/us-central1/chatWithGemini
```

### 3. Test CI/CD Pipeline

```bash
# Create test branch
git checkout -b test-deployment

# Make small change
echo "// Test deployment" >> src/app/page.tsx

# Commit and push
git add .
git commit -m "test: CI/CD pipeline"
git push origin test-deployment

# Create pull request to trigger CI
# Merge to main to trigger deployment
```

---

## 🚨 Troubleshooting Common Issues

### Firebase Deployment Errors

```bash
# Error: HTTP Error: 400, Invalid project name
# Solution: Check .firebaserc project ID matches Firebase console

# Error: functions predeploy error
# Solution: Ensure functions/package.json has correct dependencies
cd functions && npm install

# Error: hosting predeploy error  
# Solution: Ensure build output directory exists
npm run build
```

### Vercel Deployment Errors

```bash
# Error: Build exceeded time limit
# Solution: Optimize build process or upgrade Vercel plan

# Error: Environment variable not found
# Solution: Check Vercel dashboard environment variables

# Error: Function timeout
# Solution: Optimize API routes or increase timeout in vercel.json
```

### GitHub Actions Errors

```bash
# Error: Firebase authentication failed
# Solution: Check FIREBASE_TOKEN secret is valid
firebase login:ci  # Generate new token

# Error: Vercel authentication failed  
# Solution: Check VERCEL_TOKEN is valid and has correct permissions

# Error: Build failed
# Solution: Check all environment variables are set in GitHub secrets
```

---

## 📊 Monitoring & Analytics Setup

### Firebase Performance Monitoring

```typescript
// Add to src/lib/firebase.ts
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);

// Custom traces
import { trace } from 'firebase/performance';

const customTrace = trace(perf, 'journal_entry_save');
customTrace.start();
// ... your code
customTrace.stop();
```

### Vercel Analytics

```bash
# Install Vercel analytics
npm install @vercel/analytics

# Add to pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Custom Health Checks

Create `/pages/api/health.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
}
```

---

## 🎯 Production Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Firebase security rules tested
- [ ] CI/CD pipeline tested with test branch
- [ ] Performance monitoring enabled
- [ ] Error tracking configured
- [ ] Health check endpoints working

### Post-Deployment
- [ ] Verify web app loads correctly
- [ ] Test user registration/login flow
- [ ] Verify AI journal analysis works
- [ ] Test payment integration (if applicable)
- [ ] Check Firebase Functions logs
- [ ] Verify analytics tracking
- [ ] Test crisis support resources

### Ongoing Monitoring
- [ ] Set up alerting for deployment failures
- [ ] Monitor performance metrics
- [ ] Review error logs regularly
- [ ] Track user engagement metrics
- [ ] Monitor Firebase usage quotas

---

**🎉 Your ALCHM deployment pipeline is now production-ready!**

This setup provides automatic deployment of your Next.js frontend to Vercel and Firebase Functions to Firebase, with comprehensive monitoring and error handling.