#!/bin/bash

# ALCHM App Store Screenshot Generation Script
# Generates required screenshots for iOS App Store and Google Play Store

echo "📱 Generating ALCHM App Store Screenshots..."

# Create screenshots directory
mkdir -p app-store/screenshots/{ios,android}

# iOS Screenshot Requirements
echo "🍎 iOS Screenshots Required:"
echo "- iPhone 6.7\" (1290x2796) - iPhone 14 Pro Max, 15 Pro Max"
echo "- iPhone 6.5\" (1242x2688) - iPhone XS Max, 11 Pro Max, 12 Pro Max, 13 Pro Max"  
echo "- iPhone 5.5\" (1242x2208) - iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus"
echo "- iPad Pro 12.9\" (2048x2732)"
echo "- iPad Pro 11\" (1668x2388)"

# Android Screenshot Requirements  
echo "🤖 Android Screenshots Required:"
echo "- Phone (1080x1920)"
echo "- 7\" Tablet (1200x1920)"
echo "- 10\" Tablet (1920x1200)"
echo "- Feature Graphic (1024x500)"

# Generate screenshot templates
cat > app-store/screenshots/screenshot-guide.md << 'EOF'
# ALCHM App Store Screenshots Guide

## Required Screenshots

### Apple App Store (iOS)
1. **iPhone 6.7"** (1290x2796) - 3-10 screenshots
2. **iPhone 6.5"** (1242x2688) - 3-10 screenshots  
3. **iPhone 5.5"** (1242x2208) - 3-10 screenshots
4. **iPad Pro 12.9"** (2048x2732) - 3-10 screenshots
5. **iPad Pro 11"** (1668x2388) - 3-10 screenshots

### Google Play Store (Android)
1. **Phone** (1080x1920) - 2-8 screenshots
2. **7" Tablet** (1200x1920) - 1-8 screenshots
3. **10" Tablet** (1920x1200) - 1-8 screenshots
4. **Feature Graphic** (1024x500) - Required promotional banner

## Screenshot Content Strategy

### Screenshot 1: Welcome/Sanctuary Screen
- Show ALCHM's trauma-informed design
- Highlight "Your Digital Sanctuary" messaging
- Display age verification: "17+"

### Screenshot 2: Journaling Interface
- Show the main writing interface
- Include Khepera AI guidance
- Demonstrate crisis safety features

### Screenshot 3: AI Insights Dashboard
- Display emotional pattern recognition
- Show mood tracking and analytics
- Highlight privacy-first AI processing

### Screenshot 4: Crisis Support System
- Show crisis detection in action
- Display 988 Lifeline integration
- Demonstrate immediate safety resources

### Screenshot 5: Growth & Progress
- Show streak tracking and badges
- Display healing pathway progress
- Highlight community features (if applicable)

## Content Guidelines

### ✅ Required Elements
- Age rating: "17+" prominently displayed
- Medical disclaimer: "Not medical advice"
- Crisis resources: "988 Suicide & Crisis Lifeline"
- Privacy messaging: "End-to-end encryption"

### ❌ Avoid
- Graphic crisis content
- Medical claims or diagnosis language
- Content that could be triggering
- Promises of cure or treatment

## Accessibility Requirements
- High contrast text
- Readable fonts (minimum 14pt)
- Clear UI elements
- Trauma-informed color choices

## Localization Notes
- Create English versions first
- Consider Spanish localization for broader reach
- Ensure cultural sensitivity in all versions
EOF

echo "✅ Screenshot guide created at app-store/screenshots/screenshot-guide.md"

# Create HTML screenshot generator for consistent branding
cat > app-store/screenshots/screenshot-generator.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALCHM Screenshot Generator</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #a4b792 0%, #7a8471 100%);
            color: #2c3e50;
        }
        
        .device-frame {
            margin: 20px auto;
            border: 8px solid #333;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .iphone-67 {
            width: 390px;
            height: 844px;
        }
        
        .android-phone {
            width: 360px;
            height: 640px;
        }
        
        .app-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: #f7f7f2;
        }
        
        .header {
            background: rgba(164, 183, 146, 0.1);
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid rgba(164, 183, 146, 0.3);
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        .tagline {
            font-size: 12px;
            color: #666;
            font-style: italic;
        }
        
        .age-rating {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }
        
        .main-content {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        
        .feature-highlight {
            background: white;
            padding: 20px;
            border-radius: 16px;
            margin: 10px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 280px;
        }
        
        .crisis-notice {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            border-radius: 12px;
            margin: 10px 0;
            font-size: 12px;
        }
        
        .footer {
            background: rgba(164, 183, 146, 0.1);
            padding: 15px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="instructions">
        <h1>ALCHM Screenshot Generator</h1>
        <p>Use browser developer tools to screenshot each device frame at exact dimensions.</p>
        
        <h2>Instructions:</h2>
        <ol>
            <li>Open browser developer tools (F12)</li>
            <li>Toggle device simulation</li>
            <li>Set exact dimensions for each device</li>
            <li>Take screenshots of each frame</li>
            <li>Save as PNG files with descriptive names</li>
        </ol>
    </div>

    <!-- iPhone 6.7" Screenshot (1290x2796) -->
    <div class="device-frame iphone-67" id="iphone-67">
        <div class="app-content">
            <div class="age-rating">17+</div>
            <div class="header">
                <div class="logo">ALCHM</div>
                <div class="tagline">Your Digital Sanctuary</div>
            </div>
            
            <div class="main-content">
                <div class="feature-highlight">
                    <h3>🌿 Trauma-Informed Design</h3>
                    <p>Safe space for healing through AI-powered journaling</p>
                </div>
                
                <div class="feature-highlight">
                    <h3>🤖 Privacy-First AI</h3>
                    <p>Intelligent insights that understand trauma responses</p>
                </div>
                
                <div class="feature-highlight">
                    <h3>🆘 Crisis Support</h3>
                    <p>Immediate access to 988 Lifeline and emergency resources</p>
                </div>
                
                <div class="crisis-notice">
                    <strong>⚠️ Important:</strong> This app is not medical advice. For emergencies, call 988 or 911.
                </div>
            </div>
            
            <div class="footer">
                End-to-end encrypted • Ages 17+ only • Not medical treatment
            </div>
        </div>
    </div>

    <script>
        // Generate multiple screenshot variations
        const screenshots = [
            {
                title: "Welcome Screen",
                content: "Your Digital Sanctuary for Healing"
            },
            {
                title: "AI Journaling",
                content: "Intelligent prompts that understand trauma"
            },
            {
                title: "Crisis Support",
                content: "Immediate safety resources when you need them"
            },
            {
                title: "Progress Tracking",
                content: "Celebrate your healing journey milestones"
            }
        ];

        console.log("ALCHM Screenshot Generator Ready");
        console.log("Required iOS Sizes:");
        console.log("- iPhone 6.7\": 1290x2796");
        console.log("- iPhone 6.5\": 1242x2688"); 
        console.log("- iPhone 5.5\": 1242x2208");
        console.log("- iPad Pro 12.9\": 2048x2732");
        console.log("- iPad Pro 11\": 1668x2388");
        console.log("\nRequired Android Sizes:");
        console.log("- Phone: 1080x1920");
        console.log("- 7\" Tablet: 1200x1920");
        console.log("- 10\" Tablet: 1920x1200");
    </script>
</body>
</html>
EOF

echo "✅ HTML screenshot generator created"

# Create metadata templates for both stores
cat > app-store/ios-app-store-connect.json << 'EOF'
{
    "app_information": {
        "name": "ALCHM - Your Digital Sanctuary",
        "subtitle": "Trauma-Informed AI Journaling",
        "category": "Health & Fitness",
        "secondary_category": "Lifestyle"
    },
    "app_review_information": {
        "contact": {
            "first_name": "ALCHM",
            "last_name": "Support Team", 
            "phone": "+1-555-ALCHM-17",
            "email": "support@alchmapp.com"
        },
        "demo_account": {
            "username": "reviewer@alchmapp.com",
            "password": "AppStore2025!",
            "required": true
        },
        "notes": "ALCHM is a trauma-informed mental health journaling app with crisis detection features. The app includes comprehensive safety measures including direct access to 988 Suicide & Crisis Lifeline and crisis intervention resources. Age restriction (17+) is enforced due to mature mental health content. The app is designed to supplement, not replace, professional mental health care. Demo account provides access to all features for review purposes."
    },
    "version_release_type": "manual",
    "price_and_availability": {
        "price_tier": "Free with In-App Purchases",
        "availability": "All territories",
        "educational_discount": false
    },
    "app_privacy": {
        "privacy_policy_url": "https://alchm-digital-sanctuary.web.app/privacy-policy.html",
        "privacy_policy_text": "Required - See URL above"
    }
}
EOF

echo "✅ iOS App Store Connect metadata template created"

# Create Google Play Console template
cat > app-store/google-play-console.json << 'EOF'
{
    "store_listing": {
        "app_name": "ALCHM - Trauma-Informed AI Journaling",
        "short_description": "Your digital sanctuary for healing through AI-powered journaling. Designed for trauma survivors.",
        "full_description": "ALCHM is a trauma-informed, AI-powered journaling platform that provides a safe space for healing, reflection, and personal growth.\n\n🌿 TRAUMA-INFORMED APPROACH\nBuilt specifically for trauma survivors with gentle, non-triggering design principles. Features crisis detection, safety resources, and respect for your healing journey.\n\n🤖 INTELLIGENT AI COMPANION\nOur AI understands trauma responses and provides personalized insights, pattern recognition, and growth tracking while maintaining your privacy.\n\n🛡️ PRIVACY & SECURITY FIRST\n• End-to-end encryption for all journal entries\n• No data sharing with third parties\n• Local processing when possible\n• Complete control over your information\n\n🆘 INTEGRATED CRISIS SUPPORT\n• Automatic crisis detection system\n• Direct access to 988 Suicide & Crisis Lifeline\n• Crisis Text Line integration\n• Professional mental health referrals\n\n✨ KEY FEATURES:\n• Intelligent journaling prompts\n• Mood tracking and emotional patterns\n• Healing pathway recommendations\n• Goal setting and progress visualization\n• Gamified recovery elements\n• Offline functionality\n• Cross-device synchronization\n\n🔒 SAFETY & COMPLIANCE\nDesigned for ages 17+ with mature mental health content. Includes comprehensive medical disclaimers and clear statements that the app is not a substitute for professional care.\n\nALCHM encourages users to work with qualified mental health professionals and provides easy access to crisis resources when needed.\n\nIf you're experiencing a mental health crisis, please contact emergency services or the 988 Lifeline immediately."
    },
    "content_rating": "Mature 17+",
    "target_audience": "17+",
    "privacy_policy": "https://alchm-digital-sanctuary.web.app/privacy-policy.html",
    "contact_details": {
        "website": "https://alchm-digital-sanctuary.web.app",
        "email": "support@alchmapp.com",
        "privacy_policy": "https://alchm-digital-sanctuary.web.app/privacy-policy.html"
    }
}
EOF

echo "✅ Google Play Console metadata template created"

echo "📋 Next Steps:"
echo "1. Use screenshot-generator.html to create all required screenshots"
echo "2. Upload screenshots to respective app store consoles"
echo "3. Complete metadata forms using the JSON templates"
echo "4. Submit for review"

echo ""
echo "🚨 Critical Compliance Reminders:"
echo "• Age restriction: 17+ ONLY (now fixed in age verification)"
echo "• Medical disclaimer must be prominent in all screenshots"
echo "• Crisis resources (988) must be visible"
echo "• 'Not medical advice' messaging required"
echo "• Privacy-first messaging should be highlighted"

echo "✅ App store asset generation complete!"