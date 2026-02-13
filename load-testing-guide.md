# Load Testing Guide for ALCHM

## 1. Load Testing Tools Setup

### A. Artillery.io (Recommended)

```bash
npm install -g artillery
```

### B. Create Load Test Scripts

```yaml
# load-tests/basic-flow.yml
config:
  target: 'https://alchmapp.web.app'
  phases:
    - duration: 60
      arrivalRate: 5
      name: Warm up
    - duration: 300  
      arrivalRate: 20
      name: Sustained load
    - duration: 60
      arrivalRate: 50
      name: Peak load
  defaults:
    headers:
      User-Agent: 'ALCHM Load Test'

scenarios:
  - name: 'User Journey - New User'
    weight: 30
    flow:
      - get:
          url: '/'
          capture:
            - json: '$.sessionId'
              as: 'sessionId'
      - get:
          url: '/auth/signup/'
      - post:
          url: '/api/auth/signup'
          json:
            email: 'test+{{ $randomString() }}@example.com'
            password: 'testpassword123'
      - get:
          url: '/welcome/'
      - get:
          url: '/dashboard/'

  - name: 'User Journey - Existing User'
    weight: 50
    flow:
      - get:
          url: '/'
      - get:
          url: '/auth/login/'
      - post:
          url: '/api/auth/login'
          json:
            email: 'existing.user@example.com'
            password: 'password123'
      - get:
          url: '/dashboard/'
      - get:
          url: '/journal/'
      - get:
          url: '/journal/new/'
      - post:
          url: '/api/journal/create'
          json:
            content: 'Test journal entry {{ $randomString() }}'
            mood: 'calm'
            emotions: ['peaceful', 'reflective']

  - name: 'API Load Test - Journal Analysis'
    weight: 20
    flow:
      - post:
          url: '/api/ai/analyze-journal'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            content: 'This is a test journal entry for load testing purposes. {{ $randomString() }}'
            userId: 'test-user-{{ $randomInt(1, 100) }}'
```

### C. Firebase Functions Load Test

```yaml
# load-tests/firebase-functions.yml
config:
  target: 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Function warm-up
    - duration: 300
      arrivalRate: 30
      name: Sustained function load
    - duration: 60
      arrivalRate: 100
      name: Peak function load

scenarios:
  - name: 'AI Analysis Function'
    weight: 60
    flow:
      - post:
          url: '/aiAnalysis'
          headers:
            Content-Type: 'application/json'
            Authorization: 'Bearer {{ authToken }}'
          json:
            content: 'Load testing journal entry {{ $randomString() }}'
            analysisType: 'emotion'
            userId: 'load-test-user-{{ $randomInt(1, 50) }}'

  - name: 'Crisis Monitoring'
    weight: 30
    flow:
      - post:
          url: '/crisisMonitoringDashboard/admin/crisis-events'
          headers:
            Authorization: 'Bearer {{ adminToken }}'
          capture:
            - json: '$.events.length'
              as: 'eventCount'

  - name: 'System Health Check'
    weight: 10
    flow:
      - get:
          url: '/healthCheck'
```

## 2. Performance Monitoring During Load Tests

### A. Custom Monitoring Script

```javascript
// load-tests/monitor.js
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

class LoadTestMonitor {
  constructor() {
    this.startTime = Date.now();
    this.metrics = [];
  }

  async startMonitoring() {
    console.log('Starting load test monitoring...');
    
    // Monitor every 10 seconds during test
    this.interval = setInterval(async () => {
      const metrics = await this.collectMetrics();
      this.metrics.push(metrics);
      console.log('Metrics:', metrics);
    }, 10000);
  }

  async collectMetrics() {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    // Collect real-time metrics
    const activeUsersSnapshot = await db
      .collection('userSessions')
      .where('lastActivity', '>=', oneMinuteAgo)
      .get();

    const recentErrorsSnapshot = await db
      .collection('systemAlerts')
      .where('timestamp', '>=', oneMinuteAgo)
      .where('resolved', '==', false)
      .get();

    const healthSnapshot = await db
      .collection('systemHealth')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    return {
      timestamp: now.toISOString(),
      activeSessions: activeUsersSnapshot.size,
      recentErrors: recentErrorsSnapshot.size,
      systemHealth: healthSnapshot.empty ? null : healthSnapshot.docs[0].data(),
      testDuration: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    console.log('Load test monitoring stopped');
    return this.metrics;
  }

  generateReport() {
    return {
      testDuration: Math.floor((Date.now() - this.startTime) / 1000),
      totalMetrics: this.metrics.length,
      peakActiveSessions: Math.max(...this.metrics.map(m => m.activeSessions)),
      avgActiveSessions: this.metrics.reduce((sum, m) => sum + m.activeSessions, 0) / this.metrics.length,
      totalErrors: this.metrics.reduce((sum, m) => sum + m.recentErrors, 0),
      metrics: this.metrics,
    };
  }
}

module.exports = LoadTestMonitor;
```

## 3. Load Testing Scenarios

### A. Gradual Load Increase

```bash
# Test 1: Basic functionality
artillery run load-tests/basic-flow.yml --output basic-load-report.json

# Test 2: API stress test
artillery run load-tests/firebase-functions.yml --output api-stress-report.json

# Test 3: Spike test (sudden traffic increase)
artillery quick --duration 60 --rate 100 https://alchmapp.web.app
```

### B. Realistic User Patterns

```yaml
# load-tests/realistic-patterns.yml
config:
  target: 'https://alchmapp.web.app'
  phases:
    # Morning rush (8-10 AM)
    - duration: 120
      arrivalRate: 25
      name: Morning rush
    # Midday steady (10 AM - 2 PM)  
    - duration: 240
      arrivalRate: 15
      name: Midday steady
    # Evening peak (6-8 PM)
    - duration: 120
      arrivalRate: 40
      name: Evening peak
    # Night wind down (8-11 PM)
    - duration: 180
      arrivalRate: 10
      name: Night wind down

scenarios:
  - name: 'Quick Check-in'
    weight: 40
    flow:
      - get:
          url: '/dashboard/'
      - get:
          url: '/journal/new/'
      - think: 30 # User thinking time
      - post:
          url: '/api/journal/create'
          json:
            content: 'Quick check-in: feeling {{ randomMood() }}'

  - name: 'Deep Journal Session'
    weight: 25
    flow:
      - get:
          url: '/journal/new/'
      - think: 120 # Longer writing session
      - post:
          url: '/api/journal/create'
          json:
            content: 'Deep reflection entry...'
      - get:
          url: '/api/ai/analyze'

  - name: 'Browse and Explore'
    weight: 25
    flow:
      - get:
          url: '/dashboard/'
      - get:
          url: '/pathways/'
      - get:
          url: '/insights/'
      - get:
          url: '/journal/'

  - name: 'Crisis Support Access'
    weight: 10
    flow:
      - get:
          url: '/emergency/'
      - post:
          url: '/api/crisis/check'
```

## 4. Firestore Load Testing

### A. Database Stress Test

```javascript
// load-tests/firestore-stress.js
const admin = require('firebase-admin');
const { performance } = require('perf_hooks');

admin.initializeApp({
  credential: admin.credential.cert(require('./service-account-key.json'))
});

const db = admin.firestore();

async function firestoreStressTest() {
  const testUsers = [];
  const batchSize = 100;
  const totalOperations = 1000;

  console.log('Starting Firestore stress test...');
  
  // Create test users
  for (let i = 0; i < 50; i++) {
    testUsers.push(`stress-test-user-${i}`);
  }

  const results = {
    writes: [],
    reads: [],
    queries: [],
  };

  // Test concurrent writes
  console.log('Testing concurrent writes...');
  const writePromises = [];
  
  for (let i = 0; i < totalOperations; i++) {
    const userId = testUsers[i % testUsers.length];
    const start = performance.now();
    
    const writePromise = db.collection('journal-entries').add({
      userId,
      content: `Stress test entry ${i}`,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      mood: 'testing',
      emotions: ['stress', 'testing'],
    }).then(() => {
      results.writes.push(performance.now() - start);
    });
    
    writePromises.push(writePromise);
    
    // Batch writes to avoid overwhelming
    if (writePromises.length >= batchSize) {
      await Promise.all(writePromises);
      writePromises.length = 0;
    }
  }
  
  await Promise.all(writePromises);
  
  // Test concurrent reads
  console.log('Testing concurrent reads...');
  const readPromises = testUsers.map(async (userId) => {
    const start = performance.now();
    
    const snapshot = await db.collection('journal-entries')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();
    
    results.reads.push(performance.now() - start);
    return snapshot.size;
  });
  
  await Promise.all(readPromises);
  
  // Test complex queries
  console.log('Testing complex queries...');
  const queryPromises = [];
  
  for (let i = 0; i < 20; i++) {
    const start = performance.now();
    
    const queryPromise = db.collection('journal-entries')
      .where('emotions', 'array-contains', 'testing')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get()
      .then(() => {
        results.queries.push(performance.now() - start);
      });
    
    queryPromises.push(queryPromise);
  }
  
  await Promise.all(queryPromises);
  
  // Calculate statistics
  const stats = {
    writes: calculateStats(results.writes),
    reads: calculateStats(results.reads),
    queries: calculateStats(results.queries),
  };
  
  console.log('Firestore stress test results:', stats);
  return stats;
}

function calculateStats(times) {
  times.sort((a, b) => a - b);
  
  return {
    count: times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    avg: times.reduce((sum, time) => sum + time, 0) / times.length,
    p50: times[Math.floor(times.length * 0.5)],
    p95: times[Math.floor(times.length * 0.95)],
    p99: times[Math.floor(times.length * 0.99)],
  };
}

firestoreStressTest().catch(console.error);
```

## 5. Load Test Execution Plan

### A. Pre-Test Preparation

```bash
# 1. Enable monitoring
node load-tests/monitor.js &

# 2. Clear test data
firebase firestore:delete --all-collections --force

# 3. Deploy latest functions
firebase deploy --only functions
```

### B. Test Execution Sequence

```bash
# Phase 1: Baseline (50 users)
artillery run load-tests/basic-flow.yml --config '{"phases": [{"duration": 300, "arrivalRate": 10}]}'

# Phase 2: Normal Load (200 users)
artillery run load-tests/basic-flow.yml --config '{"phases": [{"duration": 600, "arrivalRate": 20}]}'

# Phase 3: High Load (500 users)
artillery run load-tests/realistic-patterns.yml

# Phase 4: Stress Test (1000+ users)
artillery run load-tests/basic-flow.yml --config '{"phases": [{"duration": 300, "arrivalRate": 100}]}'

# Phase 5: Database Stress
node load-tests/firestore-stress.js
```

### C. Post-Test Analysis

```bash
# Generate reports
artillery report basic-load-report.json
artillery report api-stress-report.json

# Analyze results
node -e "
  const report = require('./basic-load-report.json');
  console.log('Success Rate:', report.aggregate.counters['http.codes.200'] / report.aggregate.counters['http.requests'] * 100 + '%');
  console.log('Avg Response Time:', report.aggregate.latency.mean + 'ms');
  console.log('95th Percentile:', report.aggregate.latency.p95 + 'ms');
"
```

## 6. Performance Targets

### A. Acceptance Criteria

- **Response Time**: 95% of requests < 2 seconds
- **Throughput**: Handle 1000 concurrent users
- **Error Rate**: < 1% for normal operations
- **Database**: Query response time < 500ms for 95% of queries
- **Availability**: 99.9% uptime during test

### B. Scaling Thresholds

- **Warning**: 500+ concurrent users
- **Critical**: 1000+ concurrent users
- **Auto-scaling**: Trigger at 80% capacity
- **Circuit Breaker**: Activate at 5% error rate

This comprehensive load testing strategy ensures ALCHM can handle thousands of users reliably.