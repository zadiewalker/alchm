# ALCHM TestFlight Setup Guide

## Prerequisites Setup Required

### 1. Apple Developer Account
You need an **Apple Developer Program** membership ($99/year):
- Visit https://developer.apple.com/programs/
- Enroll in the Apple Developer Program
- Complete identity verification (can take 24-48 hours)

### 2. App Store Connect Access
Once your developer account is active:
- Access https://appstoreconnect.apple.com
- Sign in with your Apple Developer ID

## Step-by-Step TestFlight Deployment

### Phase 1: Complete Project Setup ✅
- [x] iOS project created and building successfully
- [x] Bundle identifier: `com.alchm.app`
- [x] App name: ALCHM
- [x] WebView implementation loading https://alchmapp.web.app

### Phase 2: Developer Account Setup (TO DO)

#### A. Install Certificates in Xcode
1. Open Xcode → Preferences → Accounts
2. Add your Apple ID (the one associated with Developer Program)
3. Select your team → "Download Manual Profiles"
4. This will install required certificates

#### B. Configure Code Signing
Your project is already configured for automatic signing. Once certificates are installed:
1. Open `ALCHM.xcodeproj` in Xcode
2. Select target "ALCHM"
3. Go to "Signing & Capabilities"
4. Ensure "Automatically manage signing" is checked
5. Select your team from dropdown

### Phase 3: Create App Store Connect Record

#### A. Create New App
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill out details:
   - **Platform**: iOS
   - **Name**: ALCHM
   - **Primary Language**: English
   - **Bundle ID**: com.alchm.app (should auto-populate)
   - **SKU**: ALCHM-001 (or any unique identifier)

#### B. Required App Information
```
App Name: ALCHM
Bundle ID: com.alchm.app
Primary Language: English (U.S.)
Category: Health & Fitness (or Medical/Lifestyle as appropriate)
Content Rights: You own or have licensed all of the content
Age Rating: Complete questionnaire based on your app's features
```

### Phase 4: Prepare App Store Assets

#### A. App Icons (Already Generated)
Your project includes these required sizes:
- 1024×1024 (App Store)
- 180×180 (iPhone @3x)
- 120×120 (iPhone @2x)
- 152×152 (iPad @2x)
- 76×76 (iPad @1x)

#### B. Screenshots Required
**iPhone Screenshots (Required)**:
- 6.7" Display (iPhone 14 Pro Max): 1290×2796 pixels
- 6.1" Display (iPhone 14 Pro): 1179×2556 pixels

**iPad Screenshots (If supporting iPad)**:
- 12.9" Display (iPad Pro): 2048×2732 pixels

#### C. App Description Content
```
Title: ALCHM - Trauma-Informed AI Journaling

Description: 
ALCHM is a revolutionary trauma-informed AI-powered journaling platform designed to support mental health and emotional wellness. Our app provides a safe, private space for reflection and growth with intelligent insights and culturally responsive support.

Keywords: journal, mental health, AI, trauma-informed, wellness, reflection, personal growth

What's New in This Version:
- Initial release of ALCHM for iOS
- Trauma-informed journaling interface
- AI-powered insights and support
- Private and secure data handling
```

### Phase 5: Build and Upload to TestFlight

#### A. Archive the App (Once certificates are set up)
```bash
# In your project directory
cd /Users/zadiewalker/Desktop/alchm/ios/ALCHM
xcodebuild -scheme ALCHM -configuration Release -destination 'generic/platform=iOS' archive -archivePath "./ALCHM.xcarchive"
```

#### B. Export for App Store
```bash
# Export the archive for upload
xcodebuild -exportArchive -archivePath "./ALCHM.xcarchive" -exportPath "./ALCHMExport" -exportOptionsPlist "./ExportOptions.plist"
```

#### C. Upload to App Store Connect
```bash
# Upload using altool
xcrun altool --upload-app --file "./ALCHMExport/ALCHM.ipa" --type ios --username "your@email.com" --password "app-specific-password"
```

### Phase 6: TestFlight Configuration

#### A. In App Store Connect
1. Go to "TestFlight" tab in your app
2. Wait for build to process (10-30 minutes)
3. Add "What to Test" notes
4. Invite internal testers (up to 100)
5. Submit for external testing (requires App Review)

#### B. Invite Testers
- **Internal Testers**: Apple Developer team members
- **External Testers**: Anyone with email address (up to 10,000)
- Send invites through App Store Connect

## Current Status
- ✅ iOS project built and tested
- ⏳ Apple Developer account setup needed
- ⏳ App Store Connect app creation needed
- ⏳ Certificate installation needed

## Next Immediate Steps
1. **Enroll in Apple Developer Program** (if not done)
2. **Install certificates in Xcode**
3. **Create App Store Connect record**
4. **Archive and upload to TestFlight**

## Files Ready for Submission
- iOS app project: `/Users/zadiewalker/Desktop/alchm/ios/ALCHM/`
- Bundle ID: `com.alchm.app`
- App icons included in Assets.xcassets
- WebView implementation complete

Your iOS app is fully built and ready - you just need the Apple Developer credentials to complete the TestFlight upload!