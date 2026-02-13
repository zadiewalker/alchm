# 📖 ALCHM PROJECT BIBLE
## The Sacred Guide to Our Digital Sanctuary

*Version: 1.0 - Design Locked*  
*Updated: January 31, 2026*  
*Status: **CANONICAL REFERENCE***

---

## 🎯 MISSION & VISION

### Our Sacred Mission
ALCHM is a **digital sanctuary for healing and transformation** - a safe, beautiful space where individuals can journal, reflect, and grow through their healing journey with the gentle guidance of AI and meaningful pathways.

### Core Values
- **Healing First**: Every feature prioritizes emotional well-being and safety
- **Sacred Privacy**: User data is treated with the utmost respect and protection
- **Gentle Guidance**: AI assistance that supports without overwhelming
- **Accessible Sanctuary**: Beautiful design that welcomes all users
- **Transformative Growth**: Tools that enable deep, meaningful personal change

---

## 🎨 LOCKED DESIGN SYSTEM

### Visual Identity - **PROTECTED**
Our design creates a **healing sanctuary** through:

**Sacred Color Palette:**
- **Sage Green** (`#8B9A7C` → `#A8B5A0`): The foundation - earthy, grounding, safe
- **Pale Gold** (`#E5C97D` → `#F2D99D`): The light - warm, hopeful, transformative
- **Glass Transparency**: Creating depth and ethereal beauty

**Typography Hierarchy:**
- **Brand Title**: Extralight, spacious letter-spacing (0.3em) - sacred and serene
- **Headers**: Light weight (300) - gentle authority
- **Body**: Normal weight (400) with generous line-height (1.6) - readable and spacious

**Glass Card Architecture:**
- **Backdrop blur** + **white transparency** = Ethereal depth
- **Rounded corners** (1rem-1.5rem) = Soft, non-threatening
- **Subtle borders** = Definition without harshness

### Component Patterns - **LOCKED**
1. **Gradient Background**: Always sage to pale sage
2. **Radial Overlay**: Subtle highlight at top for dimensionality  
3. **Golden Buttons**: Primary actions in warm, inviting gold
4. **Glass Cards**: All content containers use transparency system
5. **Crisis Footer**: Always present, always accessible

---

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack - **STABLE**
```
Frontend: Next.js 15.5.9 + TypeScript + Tailwind CSS
Backend: Firebase Functions + Firestore
Authentication: Firebase Auth
Payments: Stripe
AI: OpenAI GPT-4
Mobile: Capacitor (iOS)
Hosting: Firebase Hosting
```

### Key Directories
```
src/
├── app/                  # Next.js 13+ app directory
│   ├── (pages)/         # Route pages
│   ├── api.disabled/    # API routes (currently disabled)
│   └── globals.css      # Global styles
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── admin/          # Admin dashboard components  
│   └── crisis/         # Crisis intervention components
├── lib/                # Utilities and services
│   ├── firebase.ts     # Firebase configuration
│   ├── stripe.ts       # Payment processing
│   ├── aiService.ts    # AI integration
│   └── dataService.ts  # Data management
└── hooks/              # Custom React hooks

functions/              # Firebase Functions
├── src/                # TypeScript source
└── lib/                # Compiled JavaScript

ios/                    # Capacitor iOS app
└── App/                # Native iOS project
```

---

## 🛣️ USER JOURNEY MAP

### 1. Discovery & Welcome
```
Landing Page → Welcome Screen → Sign Up/Sign In
```
- **First Impression**: Peaceful sage gradient with sacred ALCHM logo
- **Value Prop**: "Your digital sanctuary for healing and transformation"
- **CTA**: "Begin Your Journey" (golden button)

### 2. Onboarding Flow
```
Dashboard → Choose Pathway → Start Journaling
```
- **Immediate Safety**: Crisis support always visible
- **Gentle Introduction**: Two free pathways to explore
- **No Pressure**: Can start journaling immediately

### 3. Core Experience Loop
```
Journal Entry → AI Analysis → Insights → Pathway Work → Reflection
```
- **Safe Expression**: Private journaling space
- **Gentle AI**: Khepera provides supportive insights
- **Guided Growth**: Pathway exercises for specific healing areas
- **Crisis Safety**: Automatic crisis detection with resource provision

### 4. Growth & Premium
```
Free Experience → Upgrade Decision → Enhanced Features
```
- **Value Proven**: User experiences benefit before paying
- **Clear Tiers**: Sanctuary (free) → Transformation ($4.99/month)
- **Enhanced AI**: Memory and deeper insights for premium users

---

## 📱 FEATURE ECOSYSTEM

### Core Features (Free - Sanctuary Tier)
- **Unlimited Journaling**: Private, secure journal entries
- **Khepera AI Companion**: Basic insights and emotional support
- **Two Healing Pathways**: Foundation + one specialized pathway
- **Basic Insights**: Emotional themes and gentle suggestions
- **Crisis Support**: 24/7 automatic crisis detection and resources

### Premium Features (Transformation Tier - $4.99/month)
- **All Five Pathways**: Complete healing journey options
- **Enhanced Khepera**: AI remembers your history and patterns
- **Deeper Analytics**: Advanced pattern recognition and insights
- **Journal Export**: Download your complete healing journey
- **Priority Support**: Enhanced crisis monitoring

### Future Vision Features
- **Community Healing**: Anonymous story sharing and support
- **Voice Processing**: Speak-to-journal functionality
- **Predictive Wellness**: Proactive check-ins during difficult patterns
- **Integration Tools**: Connect with therapists and support systems

---

## 🎪 PATHWAY SYSTEM

### Our Five Sacred Pathways
Each pathway is a **structured healing journey** with multiple stages:

1. **Foundation** (Free)
   - Core emotional regulation
   - Basic mindfulness and grounding
   - Essential coping strategies

2. **Shadow Work** (Premium)  
   - Exploring hidden aspects of self
   - Integrating difficult emotions
   - Breaking unconscious patterns

3. **Honoring Loss** (Premium)
   - Grief processing and integration
   - Finding meaning in difficult experiences
   - Building resilience through loss

4. **Calm the Storm** (Premium)
   - Anxiety and overwhelm management
   - Nervous system regulation
   - Building inner peace

5. **Enough as You Are** (Free)
   - Self-compassion cultivation
   - Overcoming perfectionism
   - Embracing authentic self-worth

### Pathway Structure
```
Each Pathway:
├── Welcome & Assessment
├── 5-7 Core Stages
│   ├── Guided Reflection
│   ├── Journaling Prompts  
│   ├── Practical Exercises
│   └── Integration Activities
└── Completion & Next Steps
```

---

## 🤖 AI SYSTEM (KHEPERA)

### Our AI Philosophy
**Khepera** (named after the Egyptian god of transformation) is designed to be:
- **Supportive, not directive**: Offers insights, never commands
- **Trauma-informed**: Recognizes and responds appropriately to crisis
- **Privacy-first**: Processes locally when possible, encrypts when not
- **Culturally sensitive**: Respects diverse backgrounds and beliefs

### AI Capabilities
```
Current:
├── Emotional tone analysis
├── Theme identification  
├── Crisis detection (high accuracy)
├── Gentle suggestion generation
└── Pattern recognition (basic)

Premium Enhancement:
├── Historical memory
├── Long-term pattern tracking
├── Personalized interventions
└── Progress celebration
```

### Crisis Detection System
- **Multi-layered analysis** using natural language processing
- **Immediate resource provision** with local crisis numbers
- **Gentle escalation** - never alarming, always supportive
- **Privacy protection** - crisis events are anonymized for monitoring

---

## 💰 BUSINESS MODEL

### Freemium Philosophy
**Healing shouldn't be locked behind a paywall** - our free tier provides genuine value:

### Pricing Strategy - **LOCKED AT $4.99/month**
- **Sanctuary (Free)**: Complete basic healing toolkit
- **Transformation ($4.99/month)**: Enhanced AI + all pathways + advanced features

### Value Proposition
- **Lower than therapy**: $4.99 vs $100+ per session
- **Always available**: 24/7 support vs limited appointment times  
- **Cumulative benefit**: Builds on previous sessions vs starting fresh each time
- **Privacy guaranteed**: No judgment, complete confidentiality

### Revenue Goals
- **Sustainable growth** over aggressive expansion
- **Long-term user relationships** over quick conversions
- **Mission alignment** - profitability supports better healing tools

---

## 🛡️ PRIVACY & SAFETY

### Privacy-First Design
- **Local-first processing** when possible
- **End-to-end encryption** for sensitive data
- **GDPR compliance** with user data rights
- **Transparent data practices** - users know exactly what we collect

### Crisis Safety Protocol
1. **Automatic detection** during journaling and AI analysis
2. **Immediate resources** - 988, local crisis lines, emergency numbers
3. **Gentle guidance** - never alarming, always supportive
4. **Professional boundaries** - AI is not therapy, clearly communicated
5. **Escalation procedures** for imminent danger (with user consent)

### Data Security
- **Firebase security rules** limiting data access
- **Regular security audits** and penetration testing
- **Staff training** on privacy and crisis response
- **Incident response plan** for data breaches

---

## 🎭 BRAND VOICE & TONE

### Our Voice Characteristics
- **Gentle but not condescending**: Warm support without talking down
- **Wise but not preachy**: Insights without judgment
- **Hopeful but not toxic positive**: Acknowledges pain while encouraging growth
- **Professional but not clinical**: Knowledgeable without being cold

### Writing Guidelines
```
Do:
✅ "Your feelings are valid and worthy of attention"
✅ "This is a safe space to explore difficult emotions"
✅ "Healing isn't linear - progress comes in many forms"
✅ "You're not alone in this journey"

Don't:  
❌ "You should feel grateful"
❌ "Just think positive thoughts"
❌ "Others have it worse"
❌ "Get over it"
```

### Crisis Communication
- **Never minimize**: All crisis expressions are taken seriously
- **Immediate resources**: Always provide concrete next steps
- **Professional boundaries**: Clear about AI limitations
- **Gentle escalation**: Suggest professional help without pressure

---

## 🎯 SUCCESS METRICS

### User Well-being Indicators
- **Engagement depth**: Time spent in meaningful reflection
- **Crisis safety**: Successful resource connection rates
- **Journey progression**: Pathway completion and return engagement
- **Emotional trajectory**: Self-reported mood improvements over time

### Business Health Metrics  
- **User retention**: Monthly and annual retention rates
- **Conversion rates**: Free to premium upgrade percentage
- **Support quality**: Crisis response effectiveness
- **User satisfaction**: Net Promoter Score and qualitative feedback

### Technical Performance
- **App responsiveness**: Load times and interaction smoothness
- **AI accuracy**: Crisis detection and insight relevance
- **System reliability**: Uptime and error rates
- **Security posture**: Successful privacy audits

---

## 🔮 FUTURE VISION

### Short-term (3-6 months)
- **Enhanced AI memory** for premium users
- **Voice journaling** capability
- **Improved crisis detection** with better resource matching
- **Therapist integration** tools for professional collaboration

### Medium-term (6-12 months)  
- **Community features** for anonymous peer support
- **Advanced analytics** for pattern recognition
- **Accessibility improvements** for diverse user needs
- **International expansion** with localized crisis resources

### Long-term (1-2 years)
- **Predictive wellness** interventions
- **Integration ecosystem** with health and wellness apps
- **Research partnerships** for healing methodology validation
- **AI advancement** toward more nuanced emotional understanding

---

## 🔐 PROTECTION & GOVERNANCE

### Design System Protection
**The visual identity documented in ALCHM_LOCKDOWN.md is PROTECTED**
- Changes require explicit approval and documentation
- New features must follow established patterns
- Color palette and typography are sacred and unchanging

### Development Standards
- **Code reviews** required for all changes
- **Accessibility testing** for all new features  
- **Crisis safety validation** for AI changes
- **Privacy impact assessment** for data handling changes

### Quality Assurance
- **User testing** before major feature releases
- **Crisis simulation** testing for safety systems
- **Performance monitoring** for technical health
- **Security auditing** for privacy protection

---

## 📞 CRISIS RESOURCES

### Always Available
- **988 Suicide & Crisis Lifeline** (Primary US resource)
- **Crisis Text Line**: Text HOME to 741741
- **911** for immediate emergency
- **International crisis lines** (for global users)

### Integration Points
- **AI crisis detection** triggers immediate resource display
- **Footer presence** on every page for constant availability
- **Emergency contacts** customizable in user settings
- **Safe words** that trigger immediate resource access

---

**This Project Bible serves as the canonical reference for ALCHM development. All team members must familiarize themselves with this document and refer to it for decision-making. Updates require team approval and version control.**

*🔒 Locked Design System - See ALCHM_LOCKDOWN.md for visual specifications*

---

*Last Updated: January 31, 2026*  
*Next Review: Quarterly*  
*Document Owner: ALCHM Development Team*