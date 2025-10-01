# Firebase Google OAuth Configuration Fix

## Issue Diagnosis
✅ **API Key Valid**: `AIzaSyCqjfzvykK6q55vLH7F0FEuyK0cppGhD3w` is working  
✅ **Domains Authorized**: localhost, alchm-digital-sanctuary.web.app, alchmapp.web.app  
❌ **Google OAuth Issue**: The error suggests Google provider configuration problem

## Step-by-Step Fix

### 1. Check Google Sign-In Method
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **alchm-digital-sanctuary**  
3. Navigate to: **Authentication → Sign-in method**
4. Find **Google** provider
5. Ensure it's **Enabled** (not just set up)

### 2. Verify OAuth 2.0 Client Configuration
1. In Firebase Console → **Authentication → Sign-in method → Google**
2. Click **Edit** on Google provider
3. Check that **Web SDK configuration** shows:
   - ✅ Web client ID exists
   - ✅ Web client secret exists  
4. If missing, click **Web SDK configuration** → **Generate new credential**

### 3. Google Cloud Console Check
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: **alchm-digital-sanctuary** 
3. Navigate to: **APIs & Services → Credentials**
4. Find **OAuth 2.0 Client IDs** for Web application
5. Edit the credential and verify **Authorized JavaScript origins** include:
   - `http://localhost:3000`
   - `https://alchm-digital-sanctuary.web.app`
   - `https://alchmapp.web.app`
6. Verify **Authorized redirect URIs** include:
   - `http://localhost:3000/__/auth/handler`
   - `https://alchm-digital-sanctuary.web.app/__/auth/handler`
   - `https://alchmapp.web.app/__/auth/handler`

### 4. OAuth Consent Screen Setup
1. In Google Cloud Console → **APIs & Services → OAuth consent screen**
2. Ensure consent screen is properly configured
3. For production: Must be **Published** (not in Testing mode)
4. Add your domains to **Authorized domains**

### 5. Enable Required APIs
1. In Google Cloud Console → **APIs & Services → Library**
2. Search for and enable:
   - ✅ **Identity and Access Management (IAM) API**
   - ✅ **Google+ API** (if using legacy)
   - ✅ **People API** (recommended)

## Test After Each Step
Run this test to verify fixes: http://localhost:3000/quick-auth-test.html

## Common Issues & Solutions

### "auth/api-key-not-valid"
- API key is valid, but might be restricted
- Check API key restrictions in Google Cloud Console

### "auth/unauthorized-domain"  
- Domain not in authorized list
- Add domain to Firebase Auth and Google OAuth client

### "auth/operation-not-allowed"
- Google provider not enabled in Firebase
- Enable in Firebase Console → Authentication → Sign-in method

### "auth/popup-blocked"
- Browser blocking popup
- User needs to allow popups

## Next Steps After Fix
1. Test authentication: http://localhost:3000/auth/login
2. Check browser console for detailed error logs
3. Verify user can complete full sign-in flow

## Support Links
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)