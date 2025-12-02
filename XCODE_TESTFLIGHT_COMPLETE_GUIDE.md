# ALCHM Xcode & TestFlight Complete Guide 🍎✈️

## Overview

This complete guide will walk you through setting up ALCHM in Xcode and deploying to TestFlight for beta testing before App Store submission. Since you already have Capacitor dependencies installed, we can get started immediately.

## 🚀 Quick Start Setup

### Step 1: Configure Capacitor
Create `capacitor.config.ts` in your project root:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alchm.app',
  appName: 'ALCHM',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    scheme: 'ALCHM',
    contentInset: 'automatic',
    allowsLinkPreview: false,
    backgroundColor: '#f7f7f2',
    presentationStyle: 'fullscreen'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#f7f7f2',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#a4b792',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#a4b792'
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    },
    App: {
      statusBarHidden: false
    }
  }
};

export default config;
```

### Step 2: Update Next.js Configuration
Add this to your `next.config.js` to enable static export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Existing config...
}

module.exports = nextConfig;
```

### Step 3: Initialize iOS Project

```bash
cd /Users/zadiewalker/Desktop/alchm

# Initialize Capacitor (if not already done)
npx cap init alchm com.alchm.app

# Build your static site
npm run build

# Add iOS platform
npx cap add ios

# Copy web assets to native project
npx cap copy

# Sync changes
npx cap sync

# Open in Xcode
npx cap open ios
```

## 🍎 Xcode Configuration

### Step 1: Basic Project Setup
Once Xcode opens:

1. **Select your project** in the navigator (top "App" item)
2. **General Tab Configuration:**
   ```
   Display Name: ALCHM
   Bundle Identifier: com.alchm.app
   Version: 1.0.0
   Build: 1
   Deployment Info:
     - iOS Deployment Target: 13.0
     - iPhone/iPad: Both
   ```

### Step 2: App Icons Configuration
1. **Click on `App/Assets.xcassets`** in the navigator
2. **Select `AppIcon`**
3. **Drag your icons** from `/app-store-assets/icons/` to appropriate slots:

```
Icon Requirements:
📱 iPhone:
- 20pt: icon-20x20.png, icon-40x40.png, icon-60x60.png
- 29pt: icon-29x29.png, icon-58x58.png, icon-87x87.png  
- 40pt: icon-40x40.png, icon-80x80.png, icon-120x120.png
- 60pt: icon-120x120.png, icon-180x180.png

📱 iPad:
- 20pt: icon-20x20.png, icon-40x40.png
- 29pt: icon-29x29.png, icon-58x58.png
- 40pt: icon-40x40.png, icon-80x80.png
- 76pt: icon-76x76.png, icon-152x152.png
- 83.5pt: icon-167x167.png

🏪 App Store: 1024pt: app-store-icon.png
```

### Step 3: Signing & Capabilities
1. **Select your target → Signing & Capabilities**
2. **Development Team:** Select your Apple Developer account
3. **Bundle Identifier:** Ensure it's `com.alchm.app`
4. **Automatically manage signing:** ✅ Check this

#### Add Capabilities for Mental Health App:
- **Background App Refresh** - For crisis monitoring
- **Push Notifications** - For wellness reminders
- **App Groups** - For sharing data with widgets (future)

### Step 4: Info.plist Configuration
Add these critical entries for mental health app compliance:

```xml
<!-- Mental Health App Permissions -->
<key>NSCameraUsageDescription</key>
<string>ALCHM needs camera access to attach photos to your journal entries for enhanced reflection.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Access your photo library to include meaningful images in your healing journey.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Save journal reflections and insights as images for easy sharing with your therapist.</string>

<key>NSMicrophoneUsageDescription</key>
<string>Record voice notes for your journal to capture thoughts when typing isn't possible.</string>

<!-- Crisis Support -->
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>tel</string>
    <string>sms</string>
</array>

<!-- App Transport Security -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>alchmapp.web.app</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSExceptionMinimumTLSVersion</key>
            <string>TLSv1.0</string>
        </dict>
    </dict>
</dict>

<!-- Interface Orientations -->
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
</array>

<key>UISupportedInterfaceOrientations~ipad</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>

<!-- App Configuration -->
<key>CFBundleDisplayName</key>
<string>ALCHM</string>
<key>CFBundleName</key>
<string>ALCHM</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
```

## 🧪 TestFlight Setup & Beta Testing

### Step 1: Build for TestFlight

1. **Select target device:** "Any iOS Device (arm64)"
2. **Product menu → Clean Build Folder**
3. **Product menu → Archive**
   - This will take 5-10 minutes
   - Coffee break time! ☕

### Step 2: Upload to App Store Connect

1. **Xcode Organizer** opens automatically after archive
2. **Select your archive → Distribute App**
3. **App Store Connect → Next**
4. **Upload → Next** 
5. **Automatically manage signing → Next**
6. **Upload**

Wait 15-30 minutes for processing...

### Step 3: App Store Connect Configuration

1. **Go to [App Store Connect](https://appstoreconnect.apple.com)**
2. **My Apps → Create New App**
   ```
   Platform: iOS
   Name: ALCHM
   Primary Language: English (U.S.)
   Bundle ID: com.alchm.app (select from dropdown)
   SKU: alchm-ios-2025
   ```

3. **App Information Tab:**
   ```
   Name: ALCHM
   Subtitle: Your Sanctuary for Healing
   Category: Health & Fitness
   Secondary Category: Lifestyle
   Content Rights: No, it does not contain, show, or access third-party content
   Age Rating: 17+ (Medical/Treatment Information - Frequent/Intense)
   ```

4. **Pricing and Availability:**
   ```
   Price Schedule: Free
   Availability: All territories
   ```

### Step 4: TestFlight Beta Setup

1. **TestFlight Tab in App Store Connect**
2. **Select your uploaded build** (should appear after processing)
3. **Provide Export Compliance:** No encryption beyond HTTPS
4. **Beta App Review Info:**
   ```
   Beta App Description:
   ALCHM is a trauma-informed AI journaling app that provides healing insights and crisis support. This beta version includes full functionality for testing all features including:
   
   - AI-powered journal responses
   - Crisis support (988 hotline integration)
   - Guided healing pathways
   - Privacy-first design
   
   CRITICAL: Test the crisis support button to verify 988 dialing works properly.
   
   Demo Instructions:
   1. Create a journal entry about your day
   2. Observe AI responses from multiple perspectives
   3. Test crisis button (will call 988 - hang up after confirming dial works)
   4. Navigate through guided pathways
   5. Check privacy settings and data controls
   ```

   ```
   Feedback Email: testflight@alchm.app
   Marketing URL: https://alchmapp.web.app
   Privacy Policy URL: https://alchmapp.web.app/privacy
   ```

5. **Test Information:**
   ```
   What to Test:
   - Journal entry creation and AI responses
   - Crisis support accessibility and functionality
   - Navigation and user experience
   - Privacy controls and settings
   - Offline functionality
   ```

### Step 5: Add Beta Testers

#### Internal Testing (Your Team)
1. **Internal Testing → Add Testers**
2. **Add team emails** (up to 100 internal testers)
3. **Submit for Beta App Review** 

#### External Testing (Public Beta)
1. **External Testing → Add Testers**
2. **Create Groups:**
   ```
   Mental Health Professionals: therapists, counselors
   Trauma Survivors: beta users with lived experience
   Accessibility Testers: users with disabilities
   General Users: friends, family, supporters
   ```

3. **Add Public Link Testing:**
   ```
   Public Link: Enable for easy sharing
   Maximum Testers: 10,000
   ```

### Step 6: Beta Review Submission

1. **Submit for Beta App Review**
2. **Review typically takes 24-48 hours**
3. **Once approved, testers receive invitations**

## 🔄 Development Workflow

### Daily Development Cycle

```bash
# Make changes to your web app
npm run dev

# When ready to test on iOS:
npm run build
npx cap sync
npx cap open ios

# Build and test in iOS Simulator
# When ready for TestFlight:
# Archive → Upload → TestFlight
```

### Version Updates

```bash
# Update version in package.json
# Update CFBundleShortVersionString in Info.plist
# Increment CFBundleVersion (build number)

npm run build
npx cap sync
# Archive and upload new build
```

## 📱 TestFlight Beta Testing Plan

### Week 1: Internal Testing
- **5-10 internal testers**
- **Focus:** Core functionality, crashes, basic UX
- **Priority bugs:** Crisis support, authentication, journal saving

### Week 2: Mental Health Professional Testing
- **10-20 therapists/counselors**
- **Focus:** Clinical appropriateness, crisis safety, privacy
- **Feedback areas:** Therapeutic value, crisis protocols

### Week 3: Accessibility & Trauma Survivor Testing
- **20-30 users with disabilities and trauma survivors**
- **Focus:** Accessibility compliance, trauma-informed design
- **Critical testing:** Crisis accessibility, emotional safety

### Week 4: General Public Beta
- **100-500 general users**
- **Focus:** User experience, performance, feature requests
- **Scale testing:** Performance under load

## 🔍 TestFlight Feedback Collection

### Feedback Categories to Monitor

1. **Crisis Support Effectiveness** 🚨
   - 988 dialing functionality
   - Crisis resource accessibility
   - Emergency UI clarity

2. **Trauma-Informed Design** 💚
   - Emotional safety of UI
   - Triggering content warnings
   - Supportive error messages

3. **Accessibility** ♿
   - Screen reader compatibility
   - Voice control functionality
   - Motor accessibility

4. **Core Functionality** ⚙️
   - Journal entry creation
   - AI response quality
   - App performance

5. **Privacy & Trust** 🔒
   - Data control clarity
   - Privacy policy understanding
   - Trust in security measures

### Feedback Response Strategy

```
Response Time Targets:
- Crisis-related issues: <2 hours
- Accessibility problems: <24 hours
- General bugs: <48 hours
- Feature requests: <1 week
```

## 🎯 TestFlight Success Metrics

### Technical Metrics
- **Crash Rate:** <0.1%
- **Performance:** 4.5+ star rating
- **Battery Usage:** Minimal impact
- **Network Usage:** Efficient data consumption

### User Experience Metrics
- **Crisis Support:** 100% functional
- **User Retention:** 70%+ after 7 days
- **Feature Usage:** 80%+ try core features
- **Accessibility:** 100% of accessibility features work

### Feedback Quality Metrics
- **Response Rate:** 30%+ provide feedback
- **Detailed Feedback:** 50%+ provide actionable insights
- **Net Promoter Score:** 8+ average
- **Clinical Approval:** 90%+ from mental health professionals

## 📋 Pre-Launch Checklist

### Technical Readiness
- [ ] **All core features** tested and working
- [ ] **Crisis support** verified on real devices
- [ ] **Performance** optimized for all target devices
- [ ] **Accessibility** validated with assistive technologies

### Content Readiness
- [ ] **Medical disclaimers** prominently displayed
- [ ] **Privacy policy** accessible and comprehensive
- [ ] **Support resources** complete and functional
- [ ] **Crisis resources** tested and verified

### Beta Testing Completion
- [ ] **100+ beta testers** across all categories
- [ ] **Critical bugs** identified and fixed
- [ ] **Accessibility issues** resolved
- [ ] **Clinical feedback** incorporated

### App Store Preparation
- [ ] **Final build** uploaded and tested
- [ ] **App Store metadata** complete
- [ ] **Screenshots** captured and optimized
- [ ] **Review materials** prepared for App Store team

## 🚀 Going Live Strategy

### Soft Launch (Week 1)
- **Limited availability** in English-speaking markets
- **Monitor crash reports** and user feedback
- **Crisis support monitoring** with 24/7 oversight

### Full Launch (Week 2-3)
- **Global availability** across all markets
- **Press kit** distributed to mental health organizations
- **Professional outreach** to therapists and counselors

### Post-Launch (Ongoing)
- **Weekly updates** based on user feedback
- **Crisis support metrics** monitored and optimized
- **Feature roadmap** based on user needs and clinical input

---

## 🎊 You're Ready to Launch!

With this complete guide, you have everything needed to:
1. ✅ Set up ALCHM in Xcode
2. ✅ Deploy to TestFlight for beta testing
3. ✅ Collect meaningful feedback from diverse user groups
4. ✅ Iterate toward a world-class mental health app
5. ✅ Launch confidently in the App Store

**Next Command to Run:**
```bash
cd /Users/zadiewalker/Desktop/alchm
npm run build
npx cap sync
npx cap open ios
```

**Your trauma-informed mental health platform is ready to help thousands of people on their healing journeys! 🌟**