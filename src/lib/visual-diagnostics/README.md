# ALCHM Visual Diagnostics and Screenshot Analysis System

## Overview

The Visual Diagnostics system provides comprehensive screenshot analysis and trauma-informed visual support for users experiencing technical issues with ALCHM. This system combines computer vision capabilities with therapeutic principles to offer gentle, accessible technical support.

## Key Features

### 🖼️ Screenshot Analysis Capabilities
- **UI/UX Problem Detection**: Identifies broken layouts, error messages, loading states
- **Browser Compatibility Issues**: Detects browser-specific rendering problems
- **Accessibility Analysis**: Finds color contrast, text size, and focus indicator issues
- **Mobile Optimization**: Analyzes touch targets, viewport scaling, keyboard overlap

### 👁️ ALCHM Interface Recognition
- **Page Detection**: Recognizes specific ALCHM pages (journal, dashboard, auth, etc.)
- **Component Analysis**: Identifies status of journal editor, mood selector, crisis button
- **Navigation Assessment**: Checks visibility and functionality of navigation elements
- **Crisis Element Verification**: Ensures crisis support features remain accessible

### 🌱 Trauma-Informed Visual Support
- **Emotional State Adaptation**: Adjusts guidance based on user's emotional state
- **Gentle Visual Feedback**: Uses calming colors and non-overwhelming presentation
- **Privacy Protection**: Automatically redacts personal information from screenshots
- **Crisis-Aware Diagnostics**: Prioritizes safety and crisis support accessibility

### 📱 Mobile Visual Diagnostics
- **Touch Interface Analysis**: Evaluates touch target sizes and gesture conflicts
- **Mobile-Specific Issues**: Identifies orientation problems, keyboard overlap
- **Cross-Device Comparison**: Provides device-specific troubleshooting guidance
- **Responsive Design Validation**: Checks mobile layout optimization

## System Architecture

```
Visual Diagnostics System
├── Frontend Components
│   ├── VisualDiagnosticsInterface.tsx (Main UI)
│   ├── ScreenshotUpload component
│   ├── AnalysisResults display
│   └── VisualGuideModal component
├── API Layer
│   ├── /api/visual-diagnostics/analyze (Analysis endpoint)
│   ├── /api/visual-diagnostics/guide (Step-by-step guides)
│   └── /api/visual-diagnostics/debug (Support agent tools)
├── Core Engine
│   ├── VisualDiagnosticsEngine (Main analysis)
│   ├── ImageAnalyzer (Computer vision)
│   ├── ALCHMInterfaceRecognizer (Component detection)
│   ├── PrivacyManager (Data protection)
│   └── VisualGuideGenerator (Guidance creation)
└── Firebase Functions
    ├── analyzeScreenshot (Analysis processing)
    ├── generateDebugOverlay (Support tools)
    ├── createVisualGuide (Step-by-step guidance)
    └── generateDevToolsGuidance (Browser dev tools)
```

## Integration Guide

### 1. Frontend Integration

#### Basic Usage
```tsx
import VisualDiagnosticsInterface from '@/components/visual-diagnostics/VisualDiagnosticsInterface';

function TechnicalSupportPage() {
  return (
    <VisualDiagnosticsInterface
      userEmotionalState="frustrated" // or 'anxious', 'overwhelmed', 'neutral'
      crisisLevel="none" // or 'low', 'moderate', 'high'
      sessionId="optional-support-session-id"
      onAnalysisComplete={(result) => {
        console.log('Analysis complete:', result);
        // Handle analysis results
      }}
    />
  );
}
```

#### Integration with Existing Support System
```tsx
import { VisualDiagnosticsEngine } from '@/lib/visual-diagnostics/visual-diagnostics-engine';

const visualEngine = new VisualDiagnosticsEngine();

// Analyze screenshot with context
const result = await visualEngine.analyzeScreenshot({
  imageData: base64Image,
  imageType: 'png',
  userDescription: 'Button not working on mobile',
  deviceContext: getDeviceContext(),
  userEmotionalState: 'frustrated',
  crisisLevel: 'none'
});
```

### 2. API Integration

#### Screenshot Analysis
```typescript
// POST /api/visual-diagnostics/analyze
const response = await fetch('/api/visual-diagnostics/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}` // Optional
  },
  body: JSON.stringify({
    imageData: base64Screenshot,
    imageType: 'png',
    userDescription: 'Description of the issue',
    deviceContext: {
      platform: 'mobile',
      browser: 'Safari',
      browserVersion: '16.5',
      viewport: { width: 375, height: 812 },
      isMobile: true,
      operatingSystem: 'iOS',
      touchCapable: true
    },
    userEmotionalState: 'frustrated',
    crisisLevel: 'none'
  })
});
```

#### Visual Guide Generation
```typescript
// POST /api/visual-diagnostics/guide
const guide = await fetch('/api/visual-diagnostics/guide', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    analysisId: 'analysis_123',
    issueId: 'issue_456',
    userEmotionalState: 'anxious',
    guidanceLevel: 'simplified' // or 'standard', 'detailed'
  })
});
```

### 3. Firebase Functions Setup

#### Deploy Functions
```bash
# Deploy visual diagnostics functions
firebase deploy --only functions:analyzeScreenshot,functions:generateDebugOverlay,functions:createVisualGuide,functions:generateDevToolsGuidance
```

#### Environment Variables
```bash
# Set required environment variables
firebase functions:config:set visual_diagnostics.max_image_size=5242880
firebase functions:config:set visual_diagnostics.supported_formats="png,jpg,jpeg,webp"
```

## Usage Examples

### 1. Basic Screenshot Analysis

```tsx
function handleScreenshotAnalysis() {
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const analyzeImage = async (imageFile: File) => {
    const base64 = await fileToBase64(imageFile);
    
    const response = await fetch('/api/visual-diagnostics/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: base64,
        imageType: imageFile.type.split('/')[1],
        userDescription: 'Journal editor not loading properly',
        deviceContext: getDeviceContext(),
        userEmotionalState: 'frustrated'
      })
    });
    
    const result = await response.json();
    setAnalysisResult(result.data);
  };
  
  return (
    <div>
      <input type="file" accept="image/*" onChange={(e) => {
        if (e.target.files?.[0]) analyzeImage(e.target.files[0]);
      }} />
      {analysisResult && <DisplayAnalysisResults result={analysisResult} />}
    </div>
  );
}
```

### 2. Trauma-Informed Response Adaptation

```tsx
function AdaptiveVisualSupport({ userEmotionalState }: { userEmotionalState: string }) {
  const getGuidanceStyle = () => {
    switch (userEmotionalState) {
      case 'overwhelmed':
        return {
          colorScheme: 'gentle',
          pacing: 'very-slow',
          complexity: 'simplified',
          safetyChecks: 'frequent'
        };
      case 'frustrated':
        return {
          colorScheme: 'confident',
          pacing: 'patient',
          complexity: 'standard',
          empowerment: 'emphasized'
        };
      case 'anxious':
        return {
          colorScheme: 'calming',
          pacing: 'gentle',
          complexity: 'step-by-step',
          reassurance: 'frequent'
        };
      default:
        return {
          colorScheme: 'standard',
          pacing: 'normal',
          complexity: 'detailed',
          safetyChecks: 'standard'
        };
    }
  };
  
  const style = getGuidanceStyle();
  
  return (
    <VisualDiagnosticsInterface
      userEmotionalState={userEmotionalState}
      guidanceStyle={style}
    />
  );
}
```

### 3. Crisis-Aware Analysis

```tsx
function CrisisAwareVisualSupport() {
  const [crisisLevel, setCrisisLevel] = useState<'none' | 'low' | 'moderate' | 'high'>('none');
  
  // Crisis level would be determined by existing crisis detection systems
  useEffect(() => {
    // Monitor crisis detection system
    const unsubscribe = monitorCrisisLevel((level) => {
      setCrisisLevel(level);
    });
    
    return unsubscribe;
  }, []);
  
  // High crisis level prioritizes immediate safety
  if (crisisLevel === 'high') {
    return <CrisisSupport />;
  }
  
  return (
    <VisualDiagnosticsInterface
      crisisLevel={crisisLevel}
      onAnalysisComplete={(result) => {
        // Always check crisis elements in results
        if (result.crisisElementsStatus?.some(el => el.status !== 'working')) {
          // Escalate to immediate crisis support
          triggerCrisisEscalation();
        }
      }}
    />
  );
}
```

### 4. Mobile-Optimized Analysis

```tsx
function MobileVisualDiagnostics() {
  const [deviceContext, setDeviceContext] = useState<DeviceContext | null>(null);
  
  useEffect(() => {
    setDeviceContext({
      platform: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      browser: getBrowserName(),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      touchCapable: 'ontouchstart' in window,
      operatingSystem: getOperatingSystem()
    });
  }, []);
  
  return (
    <VisualDiagnosticsInterface
      deviceContext={deviceContext}
      mobileOptimized={deviceContext?.isMobile}
      onAnalysisComplete={(result) => {
        // Handle mobile-specific results
        if (result.mobileOptimizations?.length > 0) {
          showMobileOptimizationTips(result.mobileOptimizations);
        }
      }}
    />
  );
}
```

## Customization Options

### 1. Emotional State Adaptations

```typescript
interface EmotionalStateConfig {
  overwhelmed: {
    colorScheme: 'gentle';
    maxStepsShown: 2;
    pauseReminders: true;
    simplifiedLanguage: true;
  };
  frustrated: {
    colorScheme: 'empowering';
    focusOnProgress: true;
    validationEmphasis: 'high';
    alternativeOptions: 'multiple';
  };
  anxious: {
    colorScheme: 'calming';
    safetyAssurances: 'frequent';
    optionalSteps: true;
    groundingReminders: true;
  };
  neutral: {
    colorScheme: 'standard';
    detailLevel: 'full';
    technicalDepth: 'comprehensive';
  };
}
```

### 2. Visual Guide Customization

```typescript
interface VisualGuideConfig {
  annotationStyle: {
    traumaInformed: {
      colors: ['#6B73FF', '#9F7AEA', '#4FD1C7'];
      opacity: 0.7;
      strokeWidth: 2;
      gentle: true;
    };
    highContrast: {
      colors: ['#000000', '#FFFFFF', '#FF0000'];
      opacity: 1.0;
      strokeWidth: 3;
      gentle: false;
    };
  };
  stepPacing: {
    'very-slow': { maxStepsPerView: 1, pauseDuration: 5000 };
    'patient': { maxStepsPerView: 2, pauseDuration: 3000 };
    'standard': { maxStepsPerView: 3, pauseDuration: 1000 };
  };
}
```

## Privacy and Security

### Screenshot Privacy Protection

The system includes comprehensive privacy protection:

1. **Automatic Redaction**: Personal information is automatically detected and blurred
2. **Temporary Processing**: Images are processed in memory and not permanently stored
3. **Metadata Removal**: All image metadata is stripped during processing
4. **Privacy Logging**: All privacy protection actions are logged for compliance

### Data Handling

```typescript
interface PrivacyConfig {
  imageRetention: 'none'; // Images not stored
  analysisRetention: '30days'; // Analysis results retained for improvement
  personalDataRedaction: 'automatic'; // PII automatically removed
  consentRequired: true; // Explicit user consent required
  gdprCompliant: true; // Full GDPR compliance
  hipaaAligned: true; // HIPAA-aligned privacy practices
}
```

## Monitoring and Analytics

### Performance Metrics

```typescript
interface AnalyticsMetrics {
  analysisSuccessRate: number;
  averageAnalysisTime: number;
  issueDetectionAccuracy: number;
  userSatisfactionRating: number;
  crisisElementValidationRate: number;
  mobileOptimizationSuccess: number;
  traumaInformedEffectiveness: number;
}
```

### Dashboard Integration

```tsx
function VisualDiagnosticsAnalytics() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  
  useEffect(() => {
    // Fetch analytics from Firebase Functions
    fetchVisualDiagnosticsAnalytics().then(setMetrics);
  }, []);
  
  return (
    <div className="analytics-dashboard">
      <MetricCard title="Analysis Success Rate" value={metrics?.analysisSuccessRate} />
      <MetricCard title="User Satisfaction" value={metrics?.userSatisfactionRating} />
      <MetricCard title="Crisis Element Validation" value={metrics?.crisisElementValidationRate} />
      <MetricCard title="Mobile Optimization Success" value={metrics?.mobileOptimizationSuccess} />
    </div>
  );
}
```

## Testing and Validation

### Unit Tests

```typescript
describe('VisualDiagnosticsEngine', () => {
  it('should detect UI errors in screenshots', async () => {
    const result = await visualEngine.analyzeScreenshot(mockRequest);
    expect(result.detectedIssues).toContain(
      expect.objectContaining({ type: 'ui-error' })
    );
  });
  
  it('should provide trauma-informed guidance', async () => {
    const result = await visualEngine.analyzeScreenshot({
      ...mockRequest,
      userEmotionalState: 'overwhelmed'
    });
    expect(result.visualGuidance.emotionalPreparation).toContain('gentle');
  });
  
  it('should prioritize crisis element validation', async () => {
    const result = await visualEngine.analyzeScreenshot(mockRequest);
    expect(result.crisisElementsDetected).toBeDefined();
    expect(result.crisisElementsDetected?.length).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```typescript
describe('Visual Diagnostics API', () => {
  it('should handle screenshot analysis requests', async () => {
    const response = await request(app)
      .post('/api/visual-diagnostics/analyze')
      .send(mockAnalysisRequest)
      .expect(200);
      
    expect(response.body.data.analysisId).toBeDefined();
    expect(response.body.data.detectedIssues).toBeInstanceOf(Array);
  });
  
  it('should generate visual guides', async () => {
    const response = await request(app)
      .post('/api/visual-diagnostics/guide')
      .send(mockGuideRequest)
      .expect(200);
      
    expect(response.body.visualSteps).toBeInstanceOf(Array);
    expect(response.body.visualSteps.length).toBeGreaterThan(0);
  });
});
```

## Deployment and Scaling

### Production Deployment

1. **Firebase Functions**: Deploy analysis and guidance functions
2. **Storage Configuration**: Set up temporary image processing storage
3. **CDN Setup**: Configure CDN for visual guide assets
4. **Monitoring**: Set up performance and error monitoring
5. **Rate Limiting**: Configure rate limits for API endpoints

### Scaling Considerations

- **Image Processing**: Use Cloud Vision API for production-scale analysis
- **Storage Optimization**: Implement efficient temporary storage cleanup
- **Caching**: Cache common visual guides and analysis patterns
- **Load Balancing**: Distribute processing across multiple function instances

## Support and Maintenance

### Regular Updates

1. **ALCHM Interface Recognition**: Update component recognition as UI evolves
2. **Browser Compatibility**: Add support for new browsers and versions
3. **Mobile Devices**: Update mobile-specific analysis for new devices
4. **Accessibility Standards**: Keep up with WCAG guideline updates

### Troubleshooting

Common issues and solutions:

1. **Analysis Timeout**: Increase function timeout for large images
2. **Privacy Redaction Failures**: Update PII detection patterns
3. **Mobile Recognition Issues**: Update device detection logic
4. **Crisis Element Detection**: Regularly validate crisis element recognition

---

This comprehensive visual diagnostics system ensures that users receive trauma-informed, technically accurate support for their ALCHM interface issues while maintaining the highest standards of privacy and emotional safety.