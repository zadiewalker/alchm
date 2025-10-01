# Firebase App Hosting Deployment Guide - ALCHM

## CRITICAL FIXES IMPLEMENTED

### 1. Next.js Configuration ✅
- Changed to `output: 'standalone'` for App Hosting compatibility
- Removed static export settings
- Fixed firebase-admin externalization

### 2. Firebase Configuration ✅ 
- Removed conflicting Firebase Hosting config from firebase.json
- Created apphosting.yaml for App Hosting deployment
- Fixed server/client component separation

### 3. Build Issues ✅
- Fixed styled-jsx usage in server components  
- Added missing framer-motion dependency
- Created safe lazy loading with error boundaries

## DEPLOYMENT COMMANDS

### Step 1: Pre-deployment Verification
```bash
# Ensure you're in the project directory
cd /Users/zadiewalker/Desktop/alchm

# Install dependencies
npm ci

# Test local build (may take time due to component complexity)
npm run build

# If build succeeds locally, proceed to deployment
```

### Step 2: Firebase App Hosting Deployment
```bash
# Login to Firebase (if not already logged in)
firebase login

# Set the correct project
firebase use alchm-digital-sanctuary

# Deploy to Firebase App Hosting
firebase apphosting:deploy

# OR use the experimental deploy command
firebase deploy --only apphosting
```

### Step 3: Environment Variables Setup
Ensure these secrets are configured in Firebase Console:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` 
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `STRIPE_SECRET_KEY`

## VERIFICATION CHECKLIST

- [x] next.config.js uses `output: 'standalone'`
- [x] apphosting.yaml exists with proper configuration
- [x] firebase.json has hosting section removed
- [x] All server components properly separated from client components
- [x] Package.json has correct dependencies
- [x] Environment variables configured as secrets

## TROUBLESHOOTING

If deployment fails:

1. **Build timeout**: The local build may take 5-10 minutes due to component complexity
2. **Memory issues**: App Hosting has 2GB memory allocated in apphosting.yaml
3. **Environment variables**: Check Firebase Console > Project Settings > App Hosting secrets

## NEXT STEPS AFTER DEPLOYMENT

1. Test all critical pages: `/dashboard`, `/journal`, `/crisis-resources`
2. Verify authentication flow works
3. Test Stripe payment integration
4. Validate Firebase Functions connectivity

## IMPORTANT NOTES

- This configuration supports SSR and API routes (required for ALCHM)
- Crisis intervention features will work properly with server-side rendering
- The trauma-informed design requires dynamic content rendering
- Mobile optimization includes proper PWA capabilities

## MONITORING

After deployment, monitor:
- App Hosting logs in Firebase Console
- Performance metrics for crisis response times
- User authentication success rates
- API route functionality