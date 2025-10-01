# Android Google Play Store Submission Configuration

## App Information
- **App Name:** ALCHM - Identity Operating System
- **Package Name:** com.thirtythree6.alchm
- **Version Name:** 1.0.0
- **Version Code:** 1
- **Category:** Health & Fitness

## Google Play Console Configuration

### **Store Listing**
- **App Title:** ALCHM - Identity Operating System
- **Short Description:** Revolutionary AI-powered journaling platform with quantum emotional intelligence and trauma-informed design for deep personal transformation.
- **Full Description:** [As provided in google-play-store-description.md]

### **Contact Details**
- **Website:** https://alchmapp.com
- **Email:** support@alchmapp.com
- **Privacy Policy URL:** https://alchmapp.com/privacy.html
- **Terms of Service URL:** https://alchmapp.com/terms.html

## Content Rating

### **IARC Questionnaire Responses**
- **Overall Rating:** Mature 17+
- **Content Categories:**
  - Violence: None
  - Sexual Content: None  
  - Language: Mild
  - Controlled Substances: References Only
  - Mature Themes: Yes (mental health content)
  - Simulated Gambling: None

### **Content Warnings**
- Mental health and trauma recovery themes
- Crisis intervention and suicide prevention
- Identity exploration including LGBTQ+ topics
- Mature psychological content

## Data Safety Section

### **Data Collection**
**Personal Info Collected:**
- Name and email address
- User IDs and device identifiers

**Health and Fitness Data:**
- Health info (emotional states, mood data)
- Fitness info (wellness tracking)

**App Activity:**
- App interactions
- In-app search history
- Other user-generated content

### **Data Usage**
- **App functionality** - Essential for core features
- **Analytics** - Improve app performance (anonymized)
- **Developer communications** - Support and updates
- **Fraud prevention** - Account security
- **Personalization** - Customized AI insights

### **Data Sharing**
- **No data shared with third parties** except:
  - Emergency services (crisis intervention only)
  - Analytics providers (anonymized data only)
  - Cloud services (encrypted data only)

### **Security Practices**
- **Data encrypted in transit:** Yes
- **Data encrypted at rest:** Yes
- **Users can request data deletion:** Yes
- **Data handling follows Play Families Policy:** Yes
- **Independent security review:** Yes

## Required Graphics Assets

### **App Icon**
- **512 x 512 px:** High-resolution app icon
- **Format:** PNG with transparency
- **Content:** ALCHM logo with botanical/growth theme

### **Feature Graphic**
- **1024 x 500 px:** Main promotional banner
- **Content:** "The World's First Identity OS" with app UI preview
- **Text:** Minimal, as Play Store adds app title

### **Screenshots**

#### **Phone Screenshots (16:9 ratio)**
1. **Onboarding Screen** - Welcome and privacy promise
2. **Writing Interface** - Clean, trauma-informed journal editor  
3. **AI Insights Dashboard** - Quantum emotional intelligence analysis
4. **Crisis Support** - Safety resources and emergency contacts
5. **Privacy Controls** - Zero-knowledge architecture features
6. **Community Features** - Privacy-preserving peer support
7. **Pathways** - Guided reflection journeys
8. **Analytics** - Personal growth tracking

#### **7-inch Tablet Screenshots (Optional)**
Same content optimized for tablet display

#### **10-inch Tablet Screenshots (Optional)**
Same content optimized for large tablet display

### **Promotional Video (Optional)**
- **Length:** 30 seconds maximum
- **Format:** MP4, MOV, or AVI
- **Content:** App overview showing key features
- **Captions:** Required for accessibility

## App Bundle Configuration

### **Android App Bundle (AAB)**
```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.thirtythree6.alchm"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    
    bundle {
        language {
            enableSplit = true
        }
        density {
            enableSplit = true
        }
        abi {
            enableSplit = true
        }
    }
}
```

### **Required Permissions**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.CAMERA" android:required="false" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:required="false" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:required="false" />
```

### **Permission Justifications**
- **INTERNET:** Required for AI processing and sync
- **ACCESS_NETWORK_STATE:** Check connectivity for sync
- **VIBRATE:** Haptic feedback for user experience
- **CAMERA:** Optional photo attachments to journal entries
- **STORAGE:** Optional backup and export features

## Pricing and Distribution

### **Pricing Model**
- **Base App:** Free
- **In-App Products:**
  - Deep Cut Monthly: $9.99/month
  - Oracle Monthly: $24.99/month
- **Free Trial:** 7 days for premium tiers

### **Distribution**
- **Countries:** All countries except restricted regions
- **Device Categories:** Phone and Tablet
- **Android Versions:** Android 5.0+ (API level 21+)

## App Signing

### **Play App Signing**
- **Enabled:** Yes (Google manages release signing key)
- **Upload Key:** Developer-managed signing key
- **Key Security:** Stored in secure keystore

### **Build Process**
```bash
# Generate signed AAB
./gradlew bundleRelease

# Upload to Play Console
# Use Play Console GUI or Google Play Developer API
```

## Testing

### **Internal Testing**
- **Track:** Internal
- **Testers:** Development team and mental health consultants
- **Duration:** 2 weeks minimum

### **Closed Testing (Alpha)**
- **Track:** Closed testing
- **Testers:** 50+ trauma survivors and mental health professionals
- **Duration:** 4 weeks
- **Feedback Integration:** Based on therapeutic effectiveness

### **Open Testing (Beta)**
- **Track:** Open testing
- **Users:** 1000+ public beta testers
- **Duration:** 2 weeks
- **Focus:** Performance, usability, crisis features

### **Production Release**
- **Rollout:** Staged rollout starting at 5%
- **Monitoring:** Crash rates, ANRs, user feedback
- **Full Release:** After 48 hours of stable performance

## Compliance Requirements

### **Google Play Policies**
- **Health Claims:** No medical diagnosis or treatment claims
- **Crisis Content:** Appropriate crisis resource integration
- **Privacy:** Full compliance with privacy policy
- **Subscription:** Clear terms and easy cancellation

### **Target Audience**
- **Age Group:** 17+ (Mature audience)
- **Interest Categories:** 
  - Mental Health
  - Personal Development
  - Wellness & Fitness
  - Identity & Self-Discovery

### **Content Guidelines**
- **Sensitive Content:** Trauma and mental health themes handled appropriately
- **Crisis Resources:** Professional crisis support integration
- **Medical Disclaimer:** Clear non-medical-advice statements
- **Age Appropriateness:** Content suitable for mature audiences

## Pre-Launch Checklist

### **Technical Requirements**
- [ ] App targets latest SDK version (API 34)
- [ ] 64-bit architecture support
- [ ] App bundle optimized and tested
- [ ] All features tested on multiple devices
- [ ] Crash reporting implemented
- [ ] Performance metrics collected

### **Policy Compliance**
- [ ] Privacy policy accessible and compliant
- [ ] Data safety form completed accurately
- [ ] Content rating questionnaire submitted
- [ ] Medical disclaimers prominently displayed
- [ ] Crisis resources easily accessible

### **Store Assets**
- [ ] All screenshots captured at required dimensions
- [ ] Feature graphic designed and optimized
- [ ] App icon meets design requirements
- [ ] Promotional video created (if applicable)
- [ ] Store listing text optimized

### **Monetization**
- [ ] Subscription products configured
- [ ] Pricing verified across regions
- [ ] Free trial periods set correctly
- [ ] Refund policy clearly stated
- [ ] Billing integration tested

## Post-Launch Monitoring

### **Key Metrics**
- **Installation Rate:** Downloads vs. store page views
- **Retention Rate:** Day 1, 7, and 30 retention
- **Conversion Rate:** Free to paid subscription conversion
- **Crash Rate:** < 0.1% crash rate target
- **ANR Rate:** < 0.1% application not responding rate

### **User Feedback**
- **Review Monitoring:** Daily review of user feedback
- **Crisis Support Metrics:** Response time and effectiveness
- **Feature Usage:** Most and least used features
- **Support Requests:** Common issues and resolutions

### **Continuous Improvement**
- **A/B Testing:** Store listing optimization
- **Feature Updates:** Based on user feedback
- **Performance Optimization:** Based on metrics
- **Content Updates:** Keeping crisis resources current

## Contact Information
- **Technical Support:** dev@alchmapp.com
- **Policy Questions:** support@alchmapp.com  
- **Legal Issues:** legal@alchmapp.com
- **Press Inquiries:** press@alchmapp.com
- **Crisis Support:** Available 24/7 in-app