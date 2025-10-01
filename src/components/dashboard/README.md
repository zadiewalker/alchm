# Sanctuary Analytics Dashboard

A trauma-informed, privacy-preserving emotional analytics system that transforms traditional data visualization into compassionate, organic shapes that honor the user's healing journey.

## Philosophy

This system embodies the ALCHM Digital Sanctuary philosophy:
- **Privacy is non-negotiable** - All analytics use differential privacy and federated learning
- **Insights empower, never exploit** - Language focuses on growth and compassion
- **Data serves healing, not surveillance** - Every visualization honors the healing journey
- **Transparency in methodology** - Users understand how their data is processed

## Components Overview

### 1. EmotionalReportCard
The main sanctuary-style report card that presents emotional insights with organic visualizations.

```tsx
import EmotionalReportCard from '@/components/dashboard/EmotionalReportCard';

<EmotionalReportCard 
  timeframe="month" 
  showPrivacyIndicator={true} 
/>
```

**Features:**
- Organic progress shapes instead of harsh bar charts
- Compassionate insights language: "You've been incredibly resilient..."
- Tabbed interface: Overview, Patterns, Growth
- Heart-sparkle motif for positive milestones
- Mobile-optimized with trauma-informed touch targets

### 2. SanctuaryAnalyticsDashboard
The complete dashboard that combines all visualization components into a cohesive healing-focused experience.

```tsx
import SanctuaryAnalyticsDashboard from '@/components/dashboard/SanctuaryAnalyticsDashboard';

<SanctuaryAnalyticsDashboard />
```

**Features:**
- Mood flow visualization with organic curves
- Growth rings showing emotional dimensions
- Insight garden with growing insights
- Privacy protection indicators
- Responsive design for all devices

### 3. Privacy-Preserving Analytics Engine
The ethical data processing system that powers all visualizations.

```tsx
import { emotionalAnalytics } from '@/lib/privacy-preserving-emotional-analytics';

// Generate healing insights
const insights = await emotionalAnalytics.generateHealingInsights(userId, 30);

// Analyze emotional patterns
const patterns = await emotionalAnalytics.analyzeEmotionalPatterns(userId, 30);
```

## Key Design Principles

### Organic Visualizations
- **Soft curves** instead of angular charts
- **Growing shapes** that suggest healing and renewal
- **Botanical metaphors** for progress indicators
- **Flowing animations** that breathe with gentle motion

### Compassionate Language
- **"You've been incredibly resilient"** instead of clinical assessments
- **Growth-focused insights** that celebrate progress
- **Gentle observations** rather than judgmental metrics
- **Empowering descriptions** that build self-awareness

### Privacy-First Design
- **Differential privacy** adds calibrated noise to protect individual records
- **Federated learning** analyzes patterns without centralized storage
- **Anonymized signatures** preserve patterns without storing content
- **User consent** required for all analytics processing

## Integration Guide

### Step 1: Install Dependencies
```bash
npm install @firebase/firestore
```

### Step 2: Import Components
```tsx
import EmotionalReportCard from '@/components/dashboard/EmotionalReportCard';
import SanctuaryAnalyticsDashboard from '@/components/dashboard/SanctuaryAnalyticsDashboard';
```

### Step 3: Add to Your Dashboard
```tsx
export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Quick overview */}
      <EmotionalReportCard timeframe="week" />
      
      {/* Full analytics experience */}
      <SanctuaryAnalyticsDashboard />
    </div>
  );
}
```

### Step 4: Customize CSS (Optional)
The components use the existing ALCHM design system. Add custom animations:

```css
/* Custom sanctuary animations */
.my-custom-flow {
  animation: emotional-flow 8s ease-in-out infinite;
}

.my-gentle-growth {
  animation: organic-grow 4s ease-in-out infinite;
}
```

## Visualization Types

### 1. Organic Progress Shapes
Replace traditional progress bars with flowing, organic shapes that suggest natural growth.

```tsx
const MetricVisualization = ({ label, value, description }) => (
  <div className="relative h-20 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-sage-50/30 to-sage-100/20">
    <div 
      className="absolute bottom-0 left-0 h-full rounded-2xl bg-gradient-to-t from-sage-300/40 to-sage-200/30"
      style={{ 
        width: `${value * 100}%`,
        clipPath: `polygon(0 100%, ${value * 100}% 100%, ${Math.min(value * 100 + 10, 100)}% 0, 0 ${100 - value * 20}%)`
      }}
    />
  </div>
);
```

### 2. Mood Flow Curves
Emotional trajectories visualized as gentle, breathing curves rather than jagged line charts.

```tsx
const createPath = (values) => {
  let path = `M ${xScale(0)} ${yScale(values[0])}`;
  
  for (let i = 1; i < values.length; i++) {
    const x = xScale(i);
    const y = yScale(values[i]);
    const prevX = xScale(i - 1);
    const prevY = yScale(values[i - 1]);
    
    // Create smooth curves
    const cpX1 = prevX + (x - prevX) * 0.3;
    const cpY1 = prevY;
    const cpX2 = prevX + (x - prevX) * 0.7;
    const cpY2 = y;
    
    path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
  }
  
  return path;
};
```

### 3. Growth Rings
Personal development visualized as organic growth rings, similar to tree rings showing the passage of time and growth.

```tsx
const GrowthRings = ({ categories }) => (
  <svg width={160} height={160}>
    {categories.map((category, index) => {
      const radius = 30 + (index * 15) + (category.value * 30);
      return (
        <circle
          key={category.name}
          cx={80}
          cy={80}
          r={radius}
          fill="none"
          stroke={category.color}
          strokeWidth="3"
          strokeOpacity="0.6"
        />
      );
    })}
  </svg>
);
```

### 4. Insight Garden
Personal insights visualized as a growing garden, with different stages from seeds to full bloom.

```tsx
const InsightGarden = ({ insights }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {insights.map((insight) => (
      <div className={`p-4 rounded-2xl ${getInsightColor(insight.type)}`}>
        <div className="text-2xl mb-2">{getInsightIcon(insight.type)}</div>
        <h3 className="font-semibold text-sm">{insight.title}</h3>
        <div className="text-xs text-sage-600">
          {insight.daysGrowing}d • {Math.round(insight.confidence * 100)}%
        </div>
      </div>
    ))}
  </div>
);
```

## Privacy Implementation

### Differential Privacy
All metrics include calibrated noise to protect individual privacy:

```typescript
private addDifferentialPrivacyNoise(value: number, sensitivity: number = 1): number {
  const noise = this.generateLaplaceNoise(sensitivity / this.NOISE_SCALE);
  return Math.max(0, Math.min(1, value + noise));
}
```

### Federated Learning
Analysis happens on aggregated patterns without storing personal content:

```typescript
private anonymizeEntry(content: string, mood: any): PrivacyProtectedEntry {
  const emotionalSignature = this.extractEmotionalSignature(content);
  const hashedContent = this.createSemanticHash(content);
  
  return {
    emotionalSignature: emotionalSignature.map(val => 
      this.addDifferentialPrivacyNoise(val, 0.1)
    ),
    hashedContent, // No personal content stored
    // ... other anonymized metrics
  };
}
```

### User Consent
All analytics require explicit user consent and provide transparent controls:

```typescript
const privacyMetrics = emotionalAnalytics.validatePrivacyCompliance();
// Returns: { dataMinimization: true, anonymizationLevel: 'full', ... }
```

## Responsive Design

### Mobile Optimization
- **Larger touch targets** (min 48px) for trauma-informed design
- **Reduced animation intensity** for battery conservation
- **Simplified visualizations** that remain meaningful on small screens

### Accessibility
- **High contrast mode** support with enhanced borders and shadows
- **Reduced motion** alternatives for users with vestibular disorders
- **Screen reader** friendly with proper ARIA labels and descriptions

## Performance Considerations

### Lazy Loading
Analytics components load progressively to maintain fast initial render:

```typescript
// Load lightweight insights first
const quickInsights = generateLightweightInsights();
setInsights(quickInsights);

// Enhance with advanced systems asynchronously
if (typeof window !== 'undefined') {
  enhanceWithAdvancedSystems(quickInsights);
}
```

### Bundle Splitting
Heavy analytics computations are split into separate chunks:

```typescript
// Lightweight emotional intelligence facade
import { LightweightEmotionalIntelligence } from '@/lib/lightweight-emotional-intelligence';

// Heavy systems loaded on demand
const enhancedEngine = await import('@/lib/advanced-emotional-intelligence');
```

## Ethical Guidelines

### Data Minimization
- Only collect what's necessary for generating healing insights
- Automatically delete processed data after analysis
- Use one-way hashes for pattern recognition without content storage

### Bias Prevention
- Regular audits to ensure insights don't discriminate against vulnerable populations
- Inclusive design that honors diverse healing journeys
- Cultural competency in insight generation and language

### User Agency
- Clear opt-out mechanisms for any analytics processing
- Granular controls over what insights to display
- Transparent explanations of how insights are generated

## Customization Options

### Color Themes
Customize the sanctuary color palette:

```css
:root {
  --sage-primary: #a4b792;        /* Main sanctuary color */
  --sage-hover: #93a682;          /* Interactive states */
  --sage-light: #f6f8f4;          /* Light backgrounds */
  --sanctuary-glass: rgba(254, 252, 251, 0.85); /* Glass morphism */
}
```

### Animation Timing
Adjust animation speeds for different sensitivity levels:

```css
/* Gentle option */
.animate-gentle-pulse { animation-duration: 3s; }

/* Minimal motion option */
.animate-gentle-pulse { animation-duration: 6s; }

/* Static option */
@media (prefers-reduced-motion: reduce) {
  .animate-gentle-pulse { animation: none; opacity: 0.8; }
}
```

### Insight Language
Customize the compassionate language system:

```typescript
const generateInsightDescription = (category: string, score: number): string => {
  const descriptions = {
    emotional_intelligence: {
      high: "Your emotional awareness is beautifully sophisticated...",
      medium: "You're developing a nuanced understanding...",
      low: "You're in the early stages of emotional exploration..."
    }
    // ... customize for your user population
  };
};
```

## Testing Guidelines

### Visual Regression Testing
Test organic visualizations across different data scenarios:

```typescript
// Test edge cases
const testCases = [
  { mood: 0, energy: 0 },      // All low values
  { mood: 1, energy: 1 },      // All high values
  { mood: 0.5, energy: 0.8 },  // Mixed values
];

testCases.forEach(data => {
  render(<MoodFlowVisualization data={[data]} />);
  // Verify organic shapes render correctly
});
```

### Privacy Compliance Testing
Verify differential privacy implementation:

```typescript
const testPrivacyCompliance = () => {
  const originalValue = 0.7;
  const noisyValues = Array.from({ length: 100 }, () => 
    addDifferentialPrivacyNoise(originalValue)
  );
  
  // Verify noise distribution
  const mean = noisyValues.reduce((sum, val) => sum + val, 0) / 100;
  expect(Math.abs(mean - originalValue)).toBeLessThan(0.1);
};
```

### Accessibility Testing
Ensure components work with assistive technologies:

```typescript
// Test with screen readers
await expect(page.getByRole('heading', { name: /emotional landscape/i })).toBeVisible();

// Test keyboard navigation
await page.keyboard.press('Tab');
await expect(page.getByRole('button', { name: /overview/i })).toBeFocused();

// Test high contrast mode
await page.emulateMedia({ colorScheme: 'high-contrast' });
```

## Future Enhancements

### Planned Features
- **Community anonymized insights** showing healing patterns across user base
- **Seasonal emotional cycles** detection and support
- **Trauma-informed intervention timing** based on emotional patterns
- **Cultural healing traditions** integration for diverse user populations

### Research Opportunities
- **Digital therapeutics efficacy** studies using anonymized data
- **Trauma recovery trajectories** research for clinical partnerships
- **AI bias auditing** in emotional intelligence systems
- **Cross-cultural healing patterns** analysis for global mental health

## Support

For questions or contributions to the Sanctuary Analytics system:

- **Technical Documentation**: See `/docs/analytics/` for detailed API references
- **Privacy Questions**: Review `/legal/privacy-policy.md` for data handling details
- **Accessibility Issues**: Report via the accessibility feedback form
- **Cultural Sensitivity**: Contact the cultural competency team for insights review

Remember: Every visualization in this system represents a human being on their healing journey. Honor their trust with compassionate design and ethical data practices.