# ALCHM Crisis Monitoring System Documentation

## Overview

The ALCHM Crisis Monitoring System is a comprehensive, privacy-preserving platform designed to monitor and respond to mental health crisis events in real-time. This system operates with the understanding that every detection could potentially save a life, while maintaining strict privacy protections for all users.

## Architecture

### Core Components

1. **Crisis Detection Engine** (`functions/src/aiService.ts`)
   - Real-time analysis of journal entries for crisis indicators
   - Multi-layered AI assessment with confidence scoring
   - Privacy-first processing (works only with AI summaries, not raw text)

2. **Admin Authentication System** (`functions/src/adminAuth.ts`)
   - Role-based access control (Monitor, Supervisor, System Admin)
   - Secure token verification with Firebase Authentication
   - Comprehensive audit logging for all admin actions

3. **Crisis Monitoring Service** (`functions/src/crisisMonitoring.ts`)
   - Real-time crisis event processing and analytics
   - Automated alert system with customizable rules
   - Privacy-preserving data anonymization

4. **Admin Dashboard** (`src/app/admin/`)
   - Real-time crisis event monitoring
   - Analytics and trend analysis
   - System health monitoring
   - Data export capabilities with privacy protection

### Data Flow

```
Journal Entry → AI Analysis → Crisis Detection → [If Crisis] → Anonymized Logging → Admin Dashboard → Crisis Response
```

## Security & Privacy Framework

### Privacy Protection Measures

1. **Data Anonymization**
   - All user IDs are hashed using SHA-256 with salt
   - No personally identifiable information stored in crisis logs
   - Only demographic metadata (age range, language) retained

2. **Access Control**
   - Three-tier admin role system with granular permissions
   - All admin actions logged and audited
   - Time-based session management

3. **Data Minimization**
   - Only crisis-relevant data stored in monitoring system
   - Automatic data retention policies
   - Secure deletion of resolved crisis events

### Role-Based Permissions

#### Crisis Monitor
- `view_crisis_events`: View anonymized crisis events
- `view_analytics`: Access trend and performance data
- `export_anonymized_data`: Export crisis data for reporting

#### Crisis Supervisor
- All Crisis Monitor permissions plus:
- `manage_alerts`: Configure alert rules and thresholds
- `escalate_crisis`: Mark events for higher-level intervention
- `resolve_crisis`: Close resolved crisis events

#### System Admin
- All Supervisor permissions plus:
- `manage_admin_users`: Add/remove admin accounts
- `system_configuration`: Modify system settings

## Technical Implementation

### Firebase Functions

#### Crisis Detection Pipeline
```typescript
// Enhanced crisis logging with anonymization
if (analysis.crisisAssessment.isCrisis) {
  await db.collection("crisisEvents").doc().set({
    anonymizedId: anonymizeUserId(userId),
    confidenceLevel: analysis.crisisAssessment.confidenceLevel,
    reasoning: analysis.crisisAssessment.reasoning,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    escalated: false,
    resolved: false
  });
}
```

#### Admin Endpoints
- `GET /admin/crisis-events` - Retrieve anonymized crisis events
- `GET /admin/crisis-analytics` - Generate trend analytics
- `PUT /admin/crisis/:id/escalate` - Escalate crisis event
- `PUT /admin/crisis/:id/resolve` - Mark crisis as resolved
- `GET /admin/crisis-export` - Export anonymized data

#### Scheduled Functions
- `scheduledAlertCheck` - Automated alert monitoring (every 15 minutes)
- `systemHealthMonitor` - Health metrics collection (every 5 minutes)
- `dailyAnalyticsAggregation` - Daily summary generation (midnight UTC)

### Dashboard Components

#### Real-Time Monitoring (`CrisisEventsList.tsx`)
- Live feed of crisis events with 30-second auto-refresh
- Filtering by confidence level, resolution status, time range
- Action buttons for escalation and resolution
- Modal detail view for comprehensive event information

#### Analytics Engine (`CrisisAnalytics.tsx`)
- 24h/7d/30d trend analysis
- Confidence level distribution charts
- System performance metrics
- Response time tracking

#### System Health (`SystemHealthMonitor.tsx`)
- AI service uptime monitoring
- Processing speed metrics
- Component status dashboard
- Performance trend tracking

#### Alert Management (`AlertsPanel.tsx`)
- Configurable alert rules for crisis spikes
- Response time threshold monitoring
- System failure detection
- Email notification management

#### Data Export (`ExportPanel.tsx`)
- Privacy-compliant data exports (CSV/JSON)
- Date range selection with 90-day limit
- Automated anonymization
- Export history and audit trail

## Crisis Response Protocols

### Detection Levels

#### High Confidence (Immediate Response)
- Automatic alert generation
- Supervisor notification within 5 minutes
- Escalation tracking required
- 24/7 monitoring priority

#### Medium Confidence (Monitored Response)
- Dashboard notification
- Review within 30 minutes during business hours
- Optional escalation based on assessment
- Standard monitoring protocols

#### Low Confidence (Logged for Patterns)
- Dashboard logging only
- Weekly review for trend analysis
- No immediate action required
- Pattern recognition for early intervention

### Escalation Procedures

1. **Initial Detection** - Crisis event logged automatically
2. **Triage Assessment** - Crisis Monitor reviews within defined timeframe
3. **Escalation Decision** - Supervisor determines intervention level
4. **Resource Deployment** - Appropriate crisis resources activated
5. **Follow-up Monitoring** - Continued observation until resolution
6. **Documentation** - Complete audit trail maintained

## Performance Standards

### Response Time Targets
- Crisis detection: < 3 seconds
- Dashboard loading: < 1 second
- Alert notifications: < 5 minutes
- System uptime: ≥ 99.5%

### Accuracy Requirements
- Crisis detection accuracy: ≥ 95%
- False positive rate: ≤ 5%
- False negative rate: ≤ 2%
- Data anonymization integrity: 100%

## Compliance & Audit

### Data Protection Compliance
- HIPAA-aligned data handling procedures
- GDPR-compliant privacy protections
- SOC 2 security framework adherence
- Regular security assessments

### Audit Capabilities
- Complete admin action logging
- Data access trail monitoring
- Export activity tracking
- System health recording

### Quality Assurance
- Automated testing of crisis detection algorithms
- Regular accuracy assessments
- Performance monitoring and alerting
- Privacy protection verification

## Deployment & Maintenance

### Deployment Requirements
```bash
# Environment Variables Required
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=your_functions_url
CRISIS_ANONYMIZATION_SALT=your_secure_salt
```

### Firebase Configuration
```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### Monitoring Setup
- Firebase Functions monitoring enabled
- Performance alerts configured
- Error tracking and logging active
- Uptime monitoring in place

## Future Enhancements

### Planned Features
1. **Multi-language Crisis Detection** - Support for 10+ languages
2. **Machine Learning Improvements** - Enhanced pattern recognition
3. **Integration Capabilities** - Crisis hotline API connections
4. **Mobile Admin App** - iOS/Android crisis monitoring
5. **Predictive Analytics** - Early warning system development

### Scalability Considerations
- Horizontal scaling for increased user base
- Regional deployment for global coverage
- Advanced caching for dashboard performance
- Real-time notification systems

## Support & Contact

For technical support or questions about the Crisis Monitoring System:
- **Emergency Crisis Issues**: Contact your designated crisis supervisor immediately
- **Technical Support**: Submit tickets through the admin dashboard
- **System Administration**: Contact the development team

## Changelog

### Version 1.0.0 (Current)
- Initial crisis monitoring dashboard implementation
- Privacy-preserving analytics engine
- Role-based admin authentication
- Real-time alert system
- Comprehensive audit logging

---

**Critical Note**: This system handles life-critical information. All modifications must be thoroughly tested and reviewed by qualified personnel before deployment. User privacy and safety are the highest priorities.