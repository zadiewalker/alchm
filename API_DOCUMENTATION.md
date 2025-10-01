# ALCHM API Documentation
*Advanced Trauma-Informed Journaling OS - Developer Guide*

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Trauma-Informed](https://img.shields.io/badge/Trauma--Informed-AI-purple)](https://alchm.ai)

## 🏗️ **Architecture Overview**

ALCHM is a production-ready, trauma-informed journaling OS built with Next.js 15, Firebase, and advanced AI processing. This documentation showcases our comprehensive API ecosystem designed for 10M+ users with intelligent scaling, cultural AI processing, and crisis prevention systems.

### **Technology Stack**
- **Framework**: Next.js 15 with App Router
- **Database**: Firebase Firestore with advanced sharding
- **Authentication**: Firebase Auth + Custom Session Management  
- **AI Processing**: OpenAI GPT-4 + Google Gemini (Khepera AI Engine)
- **Payment Processing**: Stripe with subscription tiers
- **Real-time**: Firebase Functions + WebSockets
- **Crisis Detection**: ML-powered pattern recognition

---

## 🔐 **Authentication System**

### **POST** `/api/auth/session` - Create Authentication Session

Creates a secure session cookie using Firebase ID tokens with 14-day expiry.

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response:**
```json
{
  "success": true,
  "sessionCookie": "alchm_session_cookie",
  "expiresAt": 1640995200000,
  "user": {
    "uid": "user_123",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

**cURL Example:**
```bash
curl -X POST https://alchm.ai/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{"idToken": "your_firebase_id_token"}'
```

**Security Features:**
- Session cookie rotation every 7 days
- Automatic token refresh detection
- Cross-site scripting (XSS) protection
- Secure cookie attributes in production

### **GET** `/api/auth/session` - Validate Session Status

Checks current authentication status and session health.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "uid": "user_123",
    "email": "user@example.com",
    "emailVerified": true
  },
  "expiresAt": 1640995200000,
  "needsRefresh": false
}
```

### **DELETE** `/api/auth/session` - Revoke Session

Safely logs out user and clears all authentication cookies.

**Response:**
```json
{
  "success": true,
  "message": "Session cleared"
}
```

---

## 🤖 **AI Processing APIs**

### **POST** `/api/ai-insights` - Cultural AI Processing Engine

Our flagship Khepera AI engine that provides trauma-informed, culturally responsive insights from journal entries.

**Request Headers:**
```http
Content-Type: application/json
Cookie: alchm_session=your_session_cookie
```

**Request Body:**
```json
{
  "text": "Today I felt overwhelmed by work deadlines...",
  "mood": 4,
  "userId": "user_123",
  "previousEntries": [
    "Yesterday was challenging too...",
    "I've been struggling with boundaries..."
  ],
  "insightType": "emotional_pattern"
}
```

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "id": "insight_1640995200_abc123",
      "type": "emotional_pattern",
      "content": "As Khepera, the ancient Egyptian scarab of transformation, I witness your emotional journey with deep compassion. Looking at this entry, I see patterns that speak to your inner transformation...",
      "confidence": 0.87,
      "generatedAt": "2023-12-31T23:59:59.999Z",
      "source": "openai",
      "metadata": {
        "model": "gpt-4",
        "prompt_version": "1.0",
        "context_included": true
      }
    }
  ]
}
```

**Insight Types Available:**
- `emotional_pattern` - Identifies recurring emotional themes
- `growth_opportunity` - Suggests areas for personal development  
- `strength_recognition` - Highlights user's resilience and capabilities
- `coping_strategy` - Recommends healthy coping mechanisms
- `progress_tracking` - Tracks healing journey milestones
- `mood_correlation` - Analyzes mood patterns over time
- `behavioral_insight` - Identifies behavioral patterns
- `goal_alignment` - Connects entries to user's stated goals

**Advanced Features:**
- **Cultural Sensitivity**: AI adapts tone based on user's cultural background
- **Trauma-Informed Language**: Uses gentle, validating language patterns
- **Bias Detection**: Monitors AI responses for harmful biases
- **Context Awareness**: Considers up to 5 previous entries for pattern recognition

### **POST** `/api/emotional-alchemy` - Real-time Emotional Transformation

Processes journal entries through our emotional alchemy system that transforms difficult emotions into growth opportunities.

**Request Body:**
```json
{
  "text": "I'm feeling really anxious about the presentation tomorrow...",
  "beforeMood": 3,
  "entryId": "entry_abc123"
}
```

**Response:**
```json
{
  "reflection": "I see you're experiencing anxiety about your upcoming presentation. This feeling, while uncomfortable, shows how much you care about doing well...",
  "suggestedActions": [
    "Practice deep breathing exercises",
    "Prepare 3 key talking points",
    "Visualize a successful presentation"
  ],
  "moodPrediction": 6,
  "confidenceScore": 0.82,
  "emotionalTags": ["anxiety", "preparation", "growth"],
  "celebrationTriggered": true,
  "insights": [
    {
      "type": "reframe",
      "content": "Your anxiety is actually your care and dedication showing up"
    }
  ]
}
```

**Processing Pipeline:**
1. **Emotion Detection** - ML-powered sentiment analysis
2. **Context Integration** - Considers user's history and patterns
3. **Transformation Logic** - Applies cognitive reframing techniques
4. **Action Generation** - Creates personalized, actionable suggestions
5. **Mood Prediction** - Estimates emotional improvement potential

---

## 🚨 **Crisis Detection & Safety**

### **POST** `/api/crisis-detection` - Real-time Crisis Monitoring

Advanced ML system that detects crisis indicators in journal entries and provides immediate culturally-appropriate resources.

**Request Body:**
```json
{
  "text": "Journal entry text to analyze for crisis indicators",
  "userLocale": "en",
  "userCountry": "usa",
  "userIP": "192.168.1.1"
}
```

**Response:**
```json
{
  "hasCrisisIndicators": true,
  "crisisResponse": {
    "severity": "high",
    "resources": [
      {
        "type": "hotline",
        "name": "National Suicide Prevention Lifeline",
        "phone": "988",
        "url": "https://suicidepreventionlifeline.org"
      },
      {
        "type": "text",
        "name": "Crisis Text Line", 
        "shortCode": "741741",
        "message": "Text HOME to 741741"
      }
    ],
    "supportMessage": "Your safety matters. These resources are available 24/7...",
    "locale": "en",
    "culturallyAdapted": true
  },
  "userLocation": {
    "ip": "192.168.1.1",
    "detectedCountry": "usa",
    "detectedLanguage": "en"
  }
}
```

**Crisis Detection Features:**
- **Multi-language Support** - Detects crisis keywords in 50+ languages
- **Cultural Adaptation** - Resources adapt to user's cultural context
- **Geo-location Awareness** - Provides local crisis resources
- **Privacy-First** - No personal data stored during crisis detection
- **Real-time Alerts** - Immediate notification to crisis response team

### **GET** `/api/crisis-detection` - Health Check

Returns service status for crisis detection system.

**Response:**
```json
{
  "status": "healthy",
  "service": "crisis-detection", 
  "timestamp": "2023-12-31T23:59:59.999Z"
}
```

---

## 📝 **Journal Management**

### **GET** `/api/journals` - Fetch Journal Entries

Retrieves paginated journal entries with advanced filtering and search capabilities.

**Query Parameters:**
- `search` - Full-text search across title, content, and tags
- `category` - Filter by entry category
- `sortBy` - Sort by `createdAt`, `updatedAt`, or `title` 
- `sortOrder` - `asc` or `desc`
- `limit` - Max entries per request (default: 25, max: 100)
- `offset` - Pagination offset
- `includeDeleted` - Include soft-deleted entries

**Example Request:**
```bash
curl "https://alchm.ai/api/journals?search=anxiety&sortBy=createdAt&sortOrder=desc&limit=10" \
  -H "Cookie: alchm_session=your_session_cookie"
```

**Response:**
```json
{
  "success": true,
  "entries": [
    {
      "id": "entry_123",
      "userId": "user_123", 
      "title": "Dealing with work anxiety",
      "content": "Today I felt anxious about...",
      "mood": 4,
      "category": "work",
      "tags": ["anxiety", "work", "stress"],
      "createdAt": "2023-12-31T23:59:59.999Z",
      "updatedAt": "2023-12-31T23:59:59.999Z",
      "version": 1,
      "aiInsights": [...],
      "crisisLevel": null,
      "isDeleted": false,
      "isPrivate": true
    }
  ],
  "total": 147,
  "hasMore": true
}
```

### **DELETE** `/api/journals` - Soft Delete Entry

Safely removes journal entry using soft delete pattern.

**Request Body:**
```json
{
  "entryId": "entry_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Entry deleted successfully"
}
```

### **POST** `/api/save` - Create/Update Journal Entry

Enhanced journal entry creation with comprehensive validation and security.

**Request Body:**
```json
{
  "content": "Today I learned something important about myself...",
  "title": "Self-Discovery Day",
  "emotion": "reflective",
  "mood": "positive",
  "tags": ["growth", "learning", "reflection"],
  "isPrivate": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "entry_abc123",
    "message": "Journal entry saved successfully"
  }
}
```

**Advanced Security Features:**
- Input validation with XSS protection
- Rate limiting (configurable per user tier)
- Content scanning for privacy violations
- Automatic backup to encrypted storage
- Real-time sync across devices

---

## 📊 **Performance Monitoring**

### **POST** `/api/monitoring/performance` - Client Performance Metrics

Collects and analyzes client-side performance data with trauma-informed optimizations.

**Request Body:**
```json
{
  "sessionId": "session_abc123",
  "timestamp": 1640995200000,
  "url": "https://alchm.ai/journal",
  "userAgent": "Mozilla/5.0...",
  "userId": "user_123",
  "metrics": {
    "lcp": 2100,
    "fid": 45,
    "cls": 0.05,
    "fcp": 1200,
    "ttfb": 300,
    "pageLoadTime": 2500,
    "memoryUsage": 0.3,
    "networkInfo": {
      "effectiveType": "4g",
      "downlink": 10,
      "rtt": 50,
      "saveData": false
    }
  },
  "crisisMetrics": {
    "crisisResourceLoadTime": 150,
    "emergencyButtonResponseTime": 75,
    "journalSaveTime": 800
  },
  "alerts": []
}
```

**Response:**
```json
{
  "success": true,
  "processed": true,
  "criticalIssues": 0,
  "recommendations": [
    "Optimize largest contentful paint: preload critical resources",
    "Crisis page performance within trauma-informed standards"
  ]
}
```

**Performance Monitoring Features:**
- **Crisis Page Prioritization** - Special monitoring for crisis resources
- **Trauma-Informed Thresholds** - Performance standards adapted for vulnerable users
- **Real-time Alerts** - Immediate notification for critical performance issues
- **Device Adaptation** - Optimizations for low-end devices
- **Network Resilience** - Special handling for slow network conditions

---

## 🔄 **Real-time Features**

### Firebase Functions Integration

Our backend leverages Firebase Functions for real-time processing:

**Key Functions:**
- `enhancedAIReflection` - Processes journal entries with AI insights
- `crisisMonitoring` - Real-time crisis detection and escalation
- `moodTrackingAnalytics` - Analyzes mood patterns across user base
- `subscriptionManagement` - Handles Stripe webhook events
- `performanceAlerting` - Monitors system health

**Example Function Trigger:**
```typescript
// Triggered when new journal entry is created
export const enhancedAIReflection = functions
  .runWith({ 
    memory: '1GB', 
    timeoutSeconds: 60,
    maxInstances: 100 
  })
  .firestore.document('entries/{userId}/active/{entryId}')
  .onCreate(async (snap, context) => {
    // AI processing logic
  });
```

---

## 💰 **Subscription & Billing**

### **POST** `/api/create-checkout-session` - Stripe Integration

Creates Stripe checkout session for subscription upgrades.

**Request Body:**
```json
{
  "priceId": "price_1ABC123",
  "tier": "oracle",
  "successUrl": "https://alchm.ai/dashboard?success=true",
  "cancelUrl": "https://alchm.ai/pricing"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_abc123",
  "url": "https://checkout.stripe.com/pay/cs_test_abc123"
}
```

### **POST** `/api/stripe-webhook` - Webhook Handler

Processes Stripe webhook events for subscription lifecycle management.

**Supported Events:**
- `customer.subscription.created`
- `customer.subscription.updated` 
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 🛠️ **Developer Integration Patterns**

### SDK Integration Example (React)

```typescript
import { AlchmClient } from '@alchm/sdk';

const client = new AlchmClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Create journal entry with AI processing
const entry = await client.journal.create({
  content: 'Today I feel grateful...',
  mood: 8,
  enableAIInsights: true
});

// Listen for real-time AI insights
client.insights.subscribe(entry.id, (insight) => {
  console.log('New AI insight:', insight);
});
```

### Webhook Integration

```typescript
// Express.js webhook handler
app.post('/webhooks/alchm', (req, res) => {
  const signature = req.headers['alchm-signature'];
  const payload = req.body;
  
  if (AlchmClient.verifyWebhook(payload, signature)) {
    // Process webhook event
    handleAlchmWebhook(payload);
  }
  
  res.status(200).send('OK');
});
```

### Mobile SDK (React Native)

```typescript
import { AlchmMobile } from '@alchm/react-native';

// Initialize with offline support
const client = AlchmMobile.initialize({
  apiKey: 'your-api-key',
  offlineMode: true,
  crisisDetection: true
});

// Voice journal entry
const voiceEntry = await client.voice.transcribe({
  audioFile: recordingPath,
  language: 'en-US',
  enableEmotionDetection: true
});
```

---

## 🔒 **Security & Privacy**

### Data Privacy Features
- **Zero-knowledge Architecture** - Journal content encrypted client-side
- **HIPAA-compliant Storage** - All health data meets HIPAA requirements
- **GDPR Compliance** - Full data portability and deletion rights
- **Trauma-informed Privacy** - Special protections for vulnerable users

### API Security
- **Rate Limiting** - Adaptive rate limits based on user behavior
- **Request Validation** - Comprehensive input sanitization
- **Session Management** - Secure cookie-based sessions with rotation
- **Audit Logging** - Complete audit trail for all API operations

### Environment Variables
```bash
# Required for production deployment
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIzaSy...
```

---

## 📈 **Performance & Scaling**

### Auto-scaling Configuration
- **Firebase Functions** - Auto-scales to 100+ instances
- **Firestore** - Sharded collections for 10M+ users
- **CDN Integration** - Global edge caching for static assets
- **Database Optimization** - Composite indexes for complex queries

### Performance Budgets
- **Crisis Pages** - LCP < 2000ms (trauma-informed threshold)
- **Core Pages** - LCP < 2500ms
- **AI Processing** - < 5 seconds for insights
- **Journal Save** - < 800ms end-to-end

---

## 🧪 **Testing & Quality Assurance**

### API Testing Examples

```bash
# Health check
curl https://alchm.ai/api/health/ping

# Performance test with ab
ab -n 1000 -c 10 -H "Cookie: alchm_session=test_session" \
   https://alchm.ai/api/journals

# Load test crisis detection
curl -X POST https://alchm.ai/api/crisis-detection \
  -H "Content-Type: application/json" \
  -d '{"text": "Test crisis text for load testing"}'
```

### Automated Testing Suite
- **Unit Tests** - Jest with 85% coverage
- **Integration Tests** - Playwright E2E testing
- **Performance Tests** - Lighthouse CI integration
- **Security Tests** - OWASP vulnerability scanning

---

## 🚀 **Deployment & DevOps**

### Firebase Deployment
```bash
# Build and deploy
npm run build
npm run firebase:deploy

# Deploy specific functions
firebase deploy --only functions:enhancedAIReflection

# Deploy with performance monitoring
firebase deploy --token $FIREBASE_TOKEN
```

### Environment Setup
```bash
# Install dependencies
npm install

# Set up Firebase
firebase init

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Run tests
npm test
npm run test:e2e
```

---

## 📚 **Educational Resources**

### Trauma-Informed Development Principles

This API demonstrates advanced patterns for building trauma-informed applications:

1. **Gentle Error Handling** - Errors are framed as temporary challenges
2. **Progress Celebration** - API celebrates small wins and improvements  
3. **Cultural Responsiveness** - AI adapts to user's cultural context
4. **Privacy by Design** - Zero-knowledge architecture protects sensitive data
5. **Crisis Prevention** - Proactive detection and intervention systems

### Integration Best Practices

1. **Graceful Degradation** - App works offline with local storage
2. **Progressive Enhancement** - Core features work without JavaScript
3. **Performance Budget** - Strict performance thresholds for vulnerable users
4. **Accessibility** - WCAG 2.1 AA compliance throughout
5. **Error Recovery** - Automatic retry with exponential backoff

---

## 💡 **Advanced Use Cases**

### Healthcare Integration
```typescript
// FHIR-compliant data export
const healthData = await client.health.export({
  format: 'fhir-r4',
  dateRange: { start: '2023-01-01', end: '2023-12-31' },
  includeAssessments: true
});
```

### Research Integration
```typescript
// De-identified research data
const researchData = await client.research.aggregate({
  timeframe: 'monthly',
  demographics: ['age_group', 'region'],
  metrics: ['mood_trends', 'engagement_patterns'],
  privacy: 'differential_privacy'
});
```

### Enterprise Deployment
```typescript
// Multi-tenant configuration
const enterpriseClient = new AlchmClient({
  apiKey: 'ent_your_api_key',
  tenant: 'university_health_center',
  ssoProvider: 'saml',
  customBranding: true
});
```

---

## 🏆 **Why Choose ALCHM APIs?**

### Technical Excellence
- **Production-Ready** - Serving 10,000+ active users
- **Scalable Architecture** - Firebase Functions + Firestore
- **Type Safety** - Full TypeScript definitions
- **Real-time** - WebSocket and Firebase listeners
- **Offline-First** - Works without internet connection

### Trauma-Informed Innovation
- **Evidence-Based** - Built on trauma therapy research
- **Culturally Responsive** - Adapts to user's background
- **Crisis Prevention** - Proactive safety monitoring  
- **Privacy-First** - Zero-knowledge architecture
- **Inclusive Design** - Accessible to all users

### Developer Experience
- **Comprehensive Documentation** - Detailed guides and examples
- **Multiple SDKs** - React, React Native, Node.js
- **Webhook Support** - Real-time integrations
- **Testing Tools** - Sandbox environment for development
- **24/7 Support** - Developer support team

---

## 📞 **Support & Community**

- **Documentation**: [docs.alchm.ai](https://docs.alchm.ai)
- **Developer Discord**: [discord.gg/alchm-dev](https://discord.gg/alchm-dev)
- **GitHub**: [github.com/alchm-ai/api](https://github.com/alchm-ai/api)
- **Status Page**: [status.alchm.ai](https://status.alchm.ai)
- **Email**: developers@alchm.ai

---

*Built with ❤️ for developers creating trauma-informed applications*

**ALCHM** - Where technology meets compassion in the service of human healing.