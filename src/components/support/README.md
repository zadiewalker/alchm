# ALCHM Technical Support Chatbot System

A healing-centered technical support chatbot designed with Jony Ive's philosophy of radical simplicity and trauma-informed user experience principles.

## 🌿 Design Philosophy

> "Every pixel serves healing" - This chatbot system creates a sanctuary for users seeking technical help, ensuring that the interface itself becomes part of the healing journey rather than a source of additional stress.

### Core Principles

- **Sanctuary in Every Interaction**: Using sage green (#a4b792) and translucent containers to maintain visual harmony
- **Trauma-Informed Design**: 72px+ touch targets, gentle animations, crisis detection
- **Mobile-First Accessibility**: Optimized for users in vulnerable states using mobile devices
- **Jony Ive Minimalism**: Radical simplicity with obsessive attention to emotional well-being

## 🎨 Visual Design System

### Color Palette
```css
--sage-primary: #a4b792    /* Primary sage green */
--sage-hover: #93a682      /* Hover state */
--sage-active: #7a8c6a     /* Active/focused state */
--sage-light: #f6f8f4      /* Light background */
--sanctuary: #fefcfb       /* Pure sanctuary white */
--sanctuary-glass: rgba(254, 252, 251, 0.95)  /* Translucent containers */
```

### Typography
- **Font Stack**: System fonts for performance and familiarity
- **Base Size**: 16px (prevents iOS zoom)
- **Line Height**: 1.6 for comfortable reading during distress
- **Letter Spacing**: 0.01em for enhanced readability

### Spacing
- **Grid System**: 8px mathematical harmony
- **Touch Targets**: Minimum 44px, Crisis 72px+
- **Breathing Room**: Generous whitespace as a design element

## 🚀 Components Overview

### 1. TechnicalSupportChatbot
The main chatbot interface with comprehensive support features.

**Features:**
- Floating action button positioned to avoid crisis button conflict
- Expandable chat window with mobile-optimized design
- Step-by-step guided troubleshooting with visual progress
- File upload with drag-and-drop support
- Voice input capability with visual indicators
- High contrast and reduced motion accessibility

### 2. CrisisAwareChatbot
Advanced crisis detection and response system.

**Features:**
- Multi-level crisis assessment (mild → moderate → severe → immediate)
- Natural language processing for crisis keyword detection
- Direct connection to 988 Crisis Lifeline
- Emergency contact integration
- Contextual analysis to prevent false positives
- Gentle escalation protocols

### 3. ChatbotShowcase
Interactive demonstration of all system capabilities.

**Features:**
- Live feature demonstration
- Design system token visualization
- Mobile and accessibility testing interface
- Performance metrics display

### 4. ChatbotIntegrationGuide
Comprehensive implementation documentation.

**Features:**
- Step-by-step integration instructions
- Environment configuration guide
- Analytics setup and monitoring
- Performance optimization guidelines

## 📱 Mobile Optimization

### Touch-Friendly Design
- **Crisis Situations**: 72px minimum touch targets
- **Standard Use**: 48px touch targets (ALCHM standard)
- **One-Handed Operation**: Thumb-zone optimization
- **Haptic Feedback**: Important action confirmation

### Performance
- **Lazy Loading**: Components load only when needed
- **Bundle Size**: Core chatbot < 50KB gzipped
- **Offline Support**: Essential crisis features work offline
- **Memory Management**: Automatic chat history cleanup

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance & Beyond
- **Screen Reader**: Comprehensive ARIA labels and roles
- **Keyboard Navigation**: Full functionality without mouse
- **High Contrast Mode**: Crisis-optimized visibility
- **Reduced Motion**: Respects user preferences
- **Voice Input**: Visual indicators and transcription
- **Large Text**: Options for users in emotional distress

### Trauma-Informed Accessibility
- **Gentle Focus States**: Supportive, never aggressive
- **Escape Routes**: Easy exit from any interaction
- **Predictable Interactions**: No sudden movements or surprises
- **Crisis-Safe Navigation**: Prevents accidental dismissal during crisis

## 🚨 Crisis Safety Features

### Detection Levels
1. **Mild**: Struggling, stressed, overwhelmed
2. **Moderate**: Depressed, hopeless, isolated
3. **Severe**: Suicidal thoughts, self-harm urges
4. **Immediate**: Active plans, means available

### Response Protocols
- **Immediate**: Direct 988/911 connection with haptic feedback
- **Severe**: Crisis counselor chat + resource compilation
- **Moderate**: Supportive resources + professional referrals
- **Mild**: Self-care resources + peer support options

### Safety Mechanisms
- **Contextual Analysis**: Prevents false positives from movies/books
- **Human Escalation**: Seamless transition to live support
- **Emergency Contacts**: User's personal crisis network
- **Resource Preloading**: Offline access to crisis information

## 🛠 Installation & Setup

### Basic Integration
```tsx
import { TechnicalSupportChatbot } from '@/components/support';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <TechnicalSupportChatbot />
    </>
  );
}
```

### With Crisis Detection
```tsx
import { 
  TechnicalSupportChatbot, 
  CrisisAwareChatbot 
} from '@/components/support';

export default function App() {
  const handleCrisisDetected = (detection) => {
    // Log for review and intervention
    analytics.track('crisis_detected', {
      level: detection.level,
      confidence: detection.confidence,
      timestamp: detection.timestamp
    });
  };

  return (
    <>
      <TechnicalSupportChatbot />
      <CrisisAwareChatbot 
        onCrisisDetected={handleCrisisDetected}
        emergencyContacts={userEmergencyContacts}
      />
    </>
  );
}
```

### Environment Configuration
```env
# Required
NEXT_PUBLIC_SUPPORT_API_URL=https://api.alchm.app/support
NEXT_PUBLIC_SUPPORT_WEBSOCKET_URL=wss://api.alchm.app/support/ws

# Optional Features
NEXT_PUBLIC_ENABLE_VOICE_SUPPORT=true
NEXT_PUBLIC_ENABLE_SCREEN_SHARING=true
NEXT_PUBLIC_ENABLE_FILE_UPLOAD=true
NEXT_PUBLIC_MAX_FILE_SIZE_MB=10

# Crisis Integration
NEXT_PUBLIC_CRISIS_DETECTION_ENABLED=true
NEXT_PUBLIC_CRISIS_CONFIDENCE_THRESHOLD=0.4
NEXT_PUBLIC_EMERGENCY_CONTACT_SYSTEM=true
```

### CSS Integration
```css
/* Add to your global CSS */
@import 'src/styles/jony-ive-sage-system.css';
@import 'src/styles/support-chatbot.css';
```

## 🎯 Usage Examples

### Quick Problem Categories
```tsx
const quickActions = [
  {
    id: 'login-help',
    label: 'Login Issues',
    icon: '🔐',
    category: 'account'
  },
  {
    id: 'app-crash',
    label: 'App Crashes',
    icon: '⚡',
    category: 'technical'
  },
  {
    id: 'sync-issues',
    label: 'Sync Problems',
    icon: '🔄',
    category: 'technical'
  }
];
```

### File Upload Support
```tsx
const supportedFileTypes = [
  'image/png',     // Screenshots
  'image/jpeg',    // Photos of issues
  'text/plain',    // Log files
  'application/json'  // Configuration files
];

const maxFileSize = 10 * 1024 * 1024; // 10MB
```

### Crisis Response Actions
```tsx
const crisisActions = [
  {
    type: 'call',
    phone: '988',
    label: 'Call Crisis Lifeline',
    urgent: true
  },
  {
    type: 'text',
    phone: '741741',
    label: 'Text Crisis Support',
    urgent: true
  },
  {
    type: 'chat',
    url: 'https://suicidepreventionlifeline.org/chat/',
    label: 'Online Crisis Chat',
    urgent: false
  }
];
```

## 📊 Analytics & Monitoring

### Key Metrics
- **Response Time**: Average time to resolution
- **User Satisfaction**: Post-interaction ratings
- **Crisis Detection**: Accuracy and false positive rates
- **File Upload**: Success rates and error patterns
- **Mobile Usage**: Performance and interaction patterns
- **Accessibility**: Feature adoption and usage

### Tracking Events
```tsx
// Crisis detection
analytics.track('crisis_detected', {
  level: 'severe',
  confidence: 0.85,
  response_time_ms: 1200
});

// Support interaction
analytics.track('support_interaction', {
  category: 'technical',
  resolution_method: 'guided_steps',
  satisfaction_score: 5
});

// File upload
analytics.track('file_upload', {
  file_type: 'screenshot',
  file_size_mb: 2.3,
  upload_success: true
});
```

## 🧪 Testing Guidelines

### Crisis Detection Testing
```tsx
const testCrisisMessages = [
  "I can't take it anymore",           // Moderate
  "I want to hurt myself",             // Severe
  "I have pills ready tonight",        // Immediate
  "The movie character killed himself" // False positive
];
```

### Accessibility Testing
- **Screen Reader**: NVDA, JAWS, VoiceOver compatibility
- **Keyboard**: Tab navigation and interaction
- **High Contrast**: Windows High Contrast Mode
- **Zoom**: 200% zoom functionality
- **Motion**: Reduced motion preference respect

### Mobile Testing
- **Touch Targets**: 72px minimum for crisis elements
- **One-Handed**: Thumb-zone reachability
- **Haptic Feedback**: Vibration pattern testing
- **Offline**: Crisis features without network
- **Performance**: 60fps animations, smooth scrolling

## 🔧 Customization Options

### Theme Configuration
```tsx
<TechnicalSupportChatbot
  theme="sage" | "sanctuary" | "high-contrast"
  position="bottom-right" | "bottom-left" | "center"
  crisisMode={boolean}
  voiceEnabled={boolean}
  fileUploadEnabled={boolean}
  maxFileSize={number}
  supportedLanguages={string[]}
  escalationEndpoint={string}
/>
```

### Crisis Sensitivity
```tsx
<CrisisAwareChatbot
  confidenceThreshold={0.4}      // 0.0 - 1.0
  escalationDelay={1000}         // milliseconds
  emergencyNumbers={{
    crisis: '988',
    text: '741741',
    emergency: '911'
  }}
  contextualAnalysis={true}      // Prevent false positives
/>
```

## 🚀 Performance Optimization

### Bundle Size Optimization
- **Core**: 45KB gzipped
- **Crisis Detection**: +15KB
- **Voice Features**: +8KB
- **File Upload**: +5KB

### Memory Management
- **Message History**: 50 message limit
- **File Cache**: 24-hour cleanup
- **WebSocket**: Auto-reconnection with backoff
- **Image Optimization**: WebP with fallbacks

### Network Efficiency
- **WebSocket**: Real-time chat
- **REST API**: File uploads
- **CDN**: Static assets
- **Compression**: Gzip/Brotli

## 🔒 Security & Privacy

### Data Protection
- **Encryption**: End-to-end for crisis conversations
- **Anonymization**: Personal data scrubbing
- **Retention**: Automatic deletion policies
- **Consent**: Explicit user permission for recordings

### Crisis Data Handling
- **Immediate Logging**: Crisis events for intervention
- **Professional Review**: Human oversight of AI decisions
- **Legal Compliance**: HIPAA considerations for health data
- **Emergency Override**: Direct human escalation protocols

## 🛣 Roadmap

### Phase 1 (Current)
- ✅ Core chatbot interface
- ✅ Crisis detection system
- ✅ Mobile optimization
- ✅ Basic file upload

### Phase 2 (Next)
- 🔄 Multi-language support
- 🔄 AI-powered diagnostics
- 🔄 Screen sharing capability
- 🔄 Voice transcription

### Phase 3 (Future)
- 📋 Integration with ALCHM journaling
- 📋 Peer support connections
- 📋 Emotional state tracking
- 📋 Advanced analytics dashboard

## 📞 Support & Contributing

### Getting Help
- **Documentation**: This README and integration guide
- **Issues**: GitHub issues for bugs and feature requests
- **Discussions**: Community discussions for questions
- **Security**: security@alchm.app for security issues

### Contributing Guidelines
1. **Design First**: Maintain trauma-informed principles
2. **Crisis Safety**: Never compromise safety features
3. **Accessibility**: Test with assistive technologies
4. **Mobile Focus**: Mobile-first, crisis-first development
5. **Testing**: Comprehensive test coverage required

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: ALCHM configuration
- **Prettier**: Consistent formatting
- **Comments**: Document trauma-informed decisions

## 📄 License

This chatbot system is part of ALCHM and follows the project's licensing terms. The design system and trauma-informed principles are open for educational and mental health applications.

---

**Remember**: This system handles vulnerable users in crisis situations. Every code change should be reviewed through the lens of user safety and emotional well-being. When in doubt, prioritize user safety over technical convenience.