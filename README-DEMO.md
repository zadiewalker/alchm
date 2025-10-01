# ALCHM Firebase Studio Demo Environment

**🏺 Trauma-informed AI Journaling OS built for DevHunt showcase**

This demo environment is specifically designed to handle 1000+ concurrent DevHunt visitors while showcasing ALCHM's Firebase Studio architecture, cultural AI capabilities, and privacy-first design.

## 🚀 Quick Demo Access

- **Live Demo**: [https://alchm-demo-devhunt.web.app/demo](https://alchm-demo-devhunt.web.app/demo)
- **Performance Dashboard**: [https://alchm-demo-devhunt.web.app/demo-dashboard](https://alchm-demo-devhunt.web.app/demo-dashboard)
- **Developer Testing**: [/api/demo/developer-testing](https://alchm-demo-devhunt.web.app/api/demo/developer-testing)

## 📊 Live Demo Metrics

- **Capacity**: 1000 concurrent users
- **Auto-scaling**: 5-2000 Firebase Function instances
- **Response Time**: <500ms under full load
- **Cultural AI**: 6 languages (English, Spanish, Portuguese, Korean, Hindi, German)
- **Privacy**: Zero-knowledge data storage
- **Safety**: Real-time crisis prevention with demo-safe mode

## 🏗️ Firebase Studio Architecture

### Core Stack
- **Framework**: Next.js 15 + TypeScript
- **Database**: Firestore with privacy-first security rules
- **Functions**: Cloud Functions (Node.js 20, auto-scaling)
- **AI**: Gemini Pro with trauma-informed prompts
- **Hosting**: Firebase Hosting + Global CDN
- **Auth**: Firebase Auth with demo session management

### Demo-Specific Features
- **Rate Limiting**: 100 requests/minute per user
- **Session Management**: 1-hour demo sessions with auto-cleanup
- **Real-time Metrics**: Live performance dashboard
- **Developer Tools**: Comprehensive API testing suite
- **Privacy Compliance**: COPPA/FERPA-ready architecture

## 🧪 Developer Experience

### API Endpoints

```bash
# Demo Authentication
POST /api/demo/auth
Headers: X-Demo-User-Id: demo_12345_abc

# Journal Submission
POST /api/demo/journal
{
  "text": "Today I'm reflecting on growth...",
  "mood": 7,
  "cultural_context": "en"
}

# AI-Powered Response
POST /api/demo/ai-response
{
  "text": "Journal content...",
  "mood": 7,
  "culturalContext": "es"
}

# Real-time Metrics
GET /api/demo/metrics

# Crisis Resources (Always Available)
POST /api/demo/crisis-demo

# Developer Testing Suite
GET /api/demo/developer-testing?scenario=performance
POST /api/demo/developer-testing
{
  "test_type": "load_test",
  "parameters": { "concurrent_users": 100 }
}
```

### Load Testing

```bash
# Run performance tests
curl -X POST /api/demo/developer-testing \
  -H "Content-Type: application/json" \
  -d '{
    "test_type": "load_test",
    "parameters": {
      "concurrent_users": 500,
      "duration": 60
    }
  }'
```

## 🌍 Cultural AI Intelligence

ALCHM's AI adapts responses based on cultural context:

- **English**: Direct, encouraging, individual empowerment
- **Spanish**: Warm, family-aware, relationship-focused
- **Korean**: Respectful, harmony-focused, collective well-being
- **Hindi**: Holistic, spiritual awareness, family context
- **Portuguese**: Community-oriented, holistic healing
- **German**: Systematic, thorough, structured approach

### Testing Cultural Features

```bash
# Test Spanish cultural adaptation
POST /api/demo/ai-response
{
  "text": "Me siento abrumado con el trabajo",
  "mood": 4,
  "culturalContext": "es"
}
```

## 🛡️ Privacy-First Architecture

### Zero-Knowledge Design
1. **Client-side Encryption**: AES-GCM encryption before transmission
2. **Server Processing**: Encrypted data only, AI works on summaries
3. **Demo Safety**: All demo content auto-deletes after 1 hour
4. **Crisis Privacy**: Crisis interactions never stored

### Compliance Features
- **COPPA Ready**: Children's privacy protection built-in
- **FERPA Compliant**: Educational data privacy standards
- **GDPR Compliant**: European privacy rights respected
- **Anonymous Metrics**: All performance data anonymized

## 🚨 Crisis Prevention System

### Demo-Safe Crisis Features
- **Real Resources**: Always provides actual crisis support numbers
- **Cultural Matching**: Crisis resources matched to user's language/culture
- **No Storage**: Crisis interactions never permanently stored
- **Professional Emphasis**: Always recommends professional help

### Global Crisis Resources
- **US**: 988 Suicide & Crisis Lifeline
- **International**: Befrienders.org, Crisis.chat
- **Cultural**: Spanish, Korean, Hindi, German crisis lines
- **Specialized**: LGBTQ+, Veterans, Youth, Elder support

## 📈 Performance Monitoring

### Real-time Metrics Available
- Active concurrent users
- Requests per minute
- AI response processing times
- Auto-scaling instance count
- Database performance
- CDN cache hit rates
- Error rates and uptime

### Auto-scaling Configuration
```javascript
{
  minInstances: 5,
  maxInstances: 2000,
  concurrency: 1000, // requests per instance
  memory: "2GB",
  timeout: "60s",
  cpu: 2
}
```

## 🧑‍💻 Running Demo Locally

### Prerequisites
- Node.js 18+
- Firebase CLI
- Demo Firebase project setup

### Setup
```bash
# Clone and install
git clone [repo]
cd alchm
npm install

# Configure demo environment
cp .env.demo .env.local

# Start Firebase emulators
npm run firebase:emulators

# Run demo build
npm run build
npm start
```

### Deploy Demo Environment
```bash
# Use demo deployment script
chmod +x scripts/demo-deployment.sh
./scripts/demo-deployment.sh

# Or deploy manually
firebase use demo-project-id
firebase deploy --project demo-project-id
```

## 🎯 Demo Scenarios for DevHunt

### 1. Basic Journaling Flow
1. Visit `/demo`
2. Select language and mood
3. Write journal entry
4. Receive AI reflection
5. View mood improvement prediction

### 2. Performance Testing
1. Visit `/demo-dashboard` 
2. Navigate to "Load Testing" tab
3. Run concurrent user simulation
4. Observe auto-scaling in real-time

### 3. Cultural AI Testing
1. Switch languages in demo
2. Submit same journal content
3. Compare cultural adaptations
4. Test crisis resources in different languages

### 4. Developer API Testing
1. Use `/api/demo/developer-testing`
2. Run API performance benchmarks
3. Test cultural AI accuracy
4. Validate privacy compliance

## 🔧 Configuration

### Demo Limits
- **Max Users**: 1000 concurrent
- **Session Duration**: 1 hour
- **Rate Limit**: 100 requests/minute per user
- **Entry Length**: 500 characters
- **AI Responses**: 15 per minute per user

### Safety Features
- Automatic content sanitization
- Real crisis resource provision
- Privacy-compliant metrics
- Graceful error handling
- Offline fallback modes

## 📊 Success Metrics

The demo tracks these key metrics for DevHunt:
- **Concurrent User Capacity**: Target 1000+
- **Response Time P95**: Target <500ms
- **Uptime**: Target 99.99%
- **Cultural Accuracy**: Target >95%
- **Privacy Compliance**: 100%
- **Crisis Resource Availability**: 100%

## 🎉 What Makes This Demo Special

1. **Real Firebase Studio Architecture**: Not just a mockup, but actual production-ready Firebase infrastructure
2. **Trauma-Informed AI**: Culturally-sensitive AI that respects mental health best practices
3. **Privacy-First**: Demonstrates zero-knowledge architecture with client-side encryption
4. **Crisis Safety**: Real crisis resources always available, never just demo content
5. **Performance at Scale**: Auto-scaling that handles viral traffic gracefully
6. **Developer Experience**: Comprehensive APIs and testing tools
7. **Cultural Intelligence**: 6-language support with cultural adaptation

## 🤝 Contributing to Demo

The demo environment is designed to showcase ALCHM's capabilities. For the full development experience:

- **Production Repo**: [Link to main repo]
- **Documentation**: [Link to full docs]
- **API Reference**: [Link to API docs]

## 📝 Demo Feedback

Found an issue or have suggestions? The demo includes feedback mechanisms:
- Real-time error reporting
- Performance monitoring
- Anonymous usage analytics
- Developer testing results

---

**🏺 ALCHM - Trauma-informed AI Journaling OS**

*Built with Firebase Studio • Designed for DevHunt • Ready for production*

**Live Demo**: https://alchm-demo-devhunt.web.app/demo