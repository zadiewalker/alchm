/**
 * ALCHM Comprehensive Load Testing Suite
 * Simulates real-world usage patterns with crisis-aware testing
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

// Test configuration based on ALCHM's expected traffic patterns
export let options = {
  stages: [
    // Warm-up phase
    { duration: '2m', target: 20 },    // Ramp up to 20 users
    
    // Normal load testing
    { duration: '5m', target: 50 },    // Stay at 50 users (normal load)
    { duration: '2m', target: 100 },   // Ramp to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    
    // Stress testing - simulating viral growth
    { duration: '2m', target: 300 },   // Rapid scale to 300 users
    { duration: '5m', target: 300 },   // Maintain stress load
    
    // Peak crisis scenario - many users seeking help simultaneously
    { duration: '1m', target: 500 },   // Crisis spike
    { duration: '3m', target: 500 },   // Sustained crisis load
    
    // Recovery testing
    { duration: '2m', target: 100 },   // Scale down
    { duration: '2m', target: 0 },     // Cool down
  ],
  
  thresholds: {
    // Performance requirements
    http_req_duration: ['p(95)<2000', 'p(99)<5000'], // 95% under 2s, 99% under 5s
    'http_req_duration{crisis:true}': ['p(95)<1000'], // Crisis pages under 1s
    http_req_failed: ['rate<0.05'], // Less than 5% failure rate
    'http_req_failed{crisis:true}': ['rate<0.01'], // Crisis pages <1% failure
    
    // Crisis-specific thresholds
    crisis_response_time: ['p(95)<1000'],
    auth_response_time: ['p(95)<1500'],
    journal_save_time: ['p(95)<2000'],
    
    // Concurrent user limits
    concurrent_users: ['value<=500'],
  },
  
  // Test environment settings
  noConnectionReuse: false,
  insecureSkipTLSVerify: true,
  batchPerHost: 10,
};

// Custom metrics for ALCHM-specific monitoring
export const crisisResponseTime = new Trend('crisis_response_time');
export const authResponseTime = new Trend('auth_response_time');
export const journalSaveTime = new Trend('journal_save_time');
export const errorRate = new Rate('error_rate');
export const crisisFailures = new Counter('crisis_failures');
export const concurrentUsers = new Counter('concurrent_users');

// Test data - realistic user scenarios
const userScenarios = new SharedArray('user_scenarios', function () {
  return [
    { type: 'new_user', weight: 30 },
    { type: 'returning_user', weight: 50 },
    { type: 'crisis_user', weight: 15 },
    { type: 'power_user', weight: 5 },
  ];
});

const journalPrompts = new SharedArray('journal_prompts', function () {
  return [
    "How are you feeling today?",
    "What are three things you're grateful for?",
    "What's one challenge you faced today and how did you handle it?",
    "Describe a moment of peace or joy from today.",
    "What's one thing you learned about yourself recently?",
    "How can you show yourself compassion today?",
    "What's one goal you're working toward?",
    "Write about someone who made you smile today.",
    "What does self-care mean to you right now?",
    "What's one thing you're looking forward to?"
  ];
});

// Base URL configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api`;

// Test session state
let sessionState = {
  userId: null,
  sessionToken: null,
  journalId: null,
};

export default function () {
  // Determine user scenario based on weights
  const scenario = selectScenario();
  concurrentUsers.add(1);
  
  group('ALCHM Load Test Session', function () {
    switch (scenario.type) {
      case 'new_user':
        runNewUserScenario();
        break;
      case 'returning_user':
        runReturningUserScenario();
        break;
      case 'crisis_user':
        runCrisisUserScenario();
        break;
      case 'power_user':
        runPowerUserScenario();
        break;
    }
  });
  
  // Random think time between 1-3 seconds
  sleep(Math.random() * 2 + 1);
}

function selectScenario() {
  const scenarios = userScenarios;
  const random = Math.random() * 100;
  let weightSum = 0;
  
  for (const scenario of scenarios) {
    weightSum += scenario.weight;
    if (random <= weightSum) {
      return scenario;
    }
  }
  
  return scenarios[0]; // Fallback
}

function runNewUserScenario() {
  group('New User Journey', function () {
    // 1. Visit landing page
    visitLandingPage();
    
    // 2. Sign up process
    const signupSuccess = performSignup();
    if (!signupSuccess) return;
    
    // 3. Onboarding flow
    completeOnboarding();
    
    // 4. First journal entry
    createFirstJournalEntry();
    
    // 5. Explore dashboard
    exploreDashboard();
  });
}

function runReturningUserScenario() {
  group('Returning User Journey', function () {
    // 1. Visit landing page
    visitLandingPage();
    
    // 2. Login
    const loginSuccess = performLogin();
    if (!loginSuccess) return;
    
    // 3. Check dashboard
    visitDashboard();
    
    // 4. Write journal entry
    createJournalEntry();
    
    // 5. Review past entries (30% chance)
    if (Math.random() < 0.3) {
      reviewPastEntries();
    }
    
    // 6. Logout (50% chance)
    if (Math.random() < 0.5) {
      performLogout();
    }
  });
}

function runCrisisUserScenario() {
  group('Crisis User Journey - PRIORITY', function () {
    // Crisis scenarios need fastest response times
    
    // 1. Direct crisis page access (common in crisis)
    const crisisStart = Date.now();
    const response = visitCrisisPage();
    const crisisTime = Date.now() - crisisStart;
    
    crisisResponseTime.add(crisisTime);
    
    if (!check(response, {
      'crisis page loads': (r) => r.status === 200,
      'crisis page fast': (r) => crisisTime < 1000,
    })) {
      crisisFailures.add(1);
      return;
    }
    
    // 2. Access crisis resources
    accessCrisisResources();
    
    // 3. Emergency journaling (if user chooses to)
    if (Math.random() < 0.4) {
      createEmergencyJournalEntry();
    }
    
    // 4. Access support contact info
    accessSupportContacts();
  });
}

function runPowerUserScenario() {
  group('Power User Journey', function () {
    // Power users perform multiple actions
    
    const loginSuccess = performLogin();
    if (!loginSuccess) return;
    
    // Multiple journal entries
    for (let i = 0; i < 3; i++) {
      createJournalEntry();
      sleep(0.5);
    }
    
    // Dashboard analytics
    visitDashboard();
    
    // Settings and profile
    visitProfile();
    
    // Export data (10% chance)
    if (Math.random() < 0.1) {
      exportUserData();
    }
  });
}

// Individual test functions

function visitLandingPage() {
  group('Landing Page', function () {
    const response = http.get(BASE_URL, {
      tags: { page: 'landing' }
    });
    
    check(response, {
      'landing page status 200': (r) => r.status === 200,
      'landing page load time ok': (r) => r.timings.duration < 2000,
      'landing page has content': (r) => r.body.includes('ALCHM'),
    });
  });
}

function visitCrisisPage() {
  const response = http.get(`${BASE_URL}/crisis-support`, {
    tags: { 
      page: 'crisis',
      crisis: 'true'
    }
  });
  
  check(response, {
    'crisis page status 200': (r) => r.status === 200,
    'crisis page ultra fast': (r) => r.timings.duration < 800,
    'crisis page has hotline': (r) => r.body.includes('988') || r.body.includes('crisis'),
  });
  
  return response;
}

function performSignup() {
  group('User Signup', function () {
    const signupData = {
      email: `test${Date.now()}${Math.random().toString(36).substr(2, 5)}@example.com`,
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
      acceptTerms: true,
    };
    
    const response = http.post(`${API_BASE}/auth/signup`, JSON.stringify(signupData), {
      headers: { 'Content-Type': 'application/json' },
      tags: { api: 'auth', action: 'signup' }
    });
    
    const success = check(response, {
      'signup status 200': (r) => r.status === 200 || r.status === 201,
      'signup response time ok': (r) => r.timings.duration < 3000,
    });
    
    if (success && response.json('token')) {
      sessionState.sessionToken = response.json('token');
      sessionState.userId = response.json('userId');
    }
    
    return success;
  });
}

function performLogin() {
  group('User Login', function () {
    const loginStart = Date.now();
    
    const loginData = {
      email: 'testuser@example.com',
      password: 'TestPassword123!',
    };
    
    const response = http.post(`${API_BASE}/auth/login`, JSON.stringify(loginData), {
      headers: { 'Content-Type': 'application/json' },
      tags: { api: 'auth', action: 'login' }
    });
    
    const loginTime = Date.now() - loginStart;
    authResponseTime.add(loginTime);
    
    const success = check(response, {
      'login status 200': (r) => r.status === 200,
      'login response time ok': (r) => r.timings.duration < 1500,
      'login returns token': (r) => r.json('token') !== undefined,
    });
    
    if (success) {
      sessionState.sessionToken = response.json('token');
      sessionState.userId = response.json('userId');
    }
    
    return success;
  });
}

function createJournalEntry() {
  group('Create Journal Entry', function () {
    if (!sessionState.sessionToken) return false;
    
    const saveStart = Date.now();
    
    const journalData = {
      content: `Test journal entry: ${journalPrompts[Math.floor(Math.random() * journalPrompts.length)]} ${generateJournalContent()}`,
      mood: Math.floor(Math.random() * 10) + 1,
      tags: ['test', 'load-test'],
      isPrivate: true,
    };
    
    const response = http.post(`${API_BASE}/journals`, JSON.stringify(journalData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionState.sessionToken}`,
      },
      tags: { api: 'journals', action: 'create' }
    });
    
    const saveTime = Date.now() - saveStart;
    journalSaveTime.add(saveTime);
    
    const success = check(response, {
      'journal create status 200': (r) => r.status === 200 || r.status === 201,
      'journal save time ok': (r) => r.timings.duration < 2000,
      'journal returns id': (r) => r.json('id') !== undefined,
    });
    
    if (success) {
      sessionState.journalId = response.json('id');
    }
    
    return success;
  });
}

function createFirstJournalEntry() {
  group('First Journal Entry', function () {
    const journalData = {
      content: "This is my first journal entry! I'm excited to start my wellness journey with ALCHM.",
      mood: 7,
      tags: ['first-entry', 'excited'],
      isPrivate: true,
    };
    
    createJournalEntryWithData(journalData);
  });
}

function createEmergencyJournalEntry() {
  group('Emergency Journal Entry', function () {
    const journalData = {
      content: "I'm going through a difficult time right now and needed to write something down.",
      mood: 3,
      tags: ['crisis', 'support-needed'],
      isPrivate: true,
      isCrisis: true,
    };
    
    createJournalEntryWithData(journalData);
  });
}

function createJournalEntryWithData(journalData) {
  if (!sessionState.sessionToken) return false;
  
  const response = http.post(`${API_BASE}/journals`, JSON.stringify(journalData), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionState.sessionToken}`,
    },
    tags: { 
      api: 'journals', 
      action: 'create',
      crisis: journalData.isCrisis ? 'true' : 'false'
    }
  });
  
  return check(response, {
    'journal entry created': (r) => r.status === 200 || r.status === 201,
    'journal save fast': (r) => r.timings.duration < (journalData.isCrisis ? 1000 : 2000),
  });
}

function visitDashboard() {
  group('Dashboard Visit', function () {
    const response = http.get(`${BASE_URL}/dashboard`, {
      headers: sessionState.sessionToken ? {
        'Authorization': `Bearer ${sessionState.sessionToken}`,
      } : {},
      tags: { page: 'dashboard' }
    });
    
    check(response, {
      'dashboard status 200': (r) => r.status === 200,
      'dashboard load time ok': (r) => r.timings.duration < 2000,
    });
  });
}

function exploreDashboard() {
  visitDashboard();
  
  // Simulate exploring different dashboard sections
  if (sessionState.sessionToken) {
    const sections = ['stats', 'recent-entries', 'mood-trends'];
    const section = sections[Math.floor(Math.random() * sections.length)];
    
    http.get(`${API_BASE}/dashboard/${section}`, {
      headers: { 'Authorization': `Bearer ${sessionState.sessionToken}` },
      tags: { api: 'dashboard', section }
    });
  }
}

function completeOnboarding() {
  group('Onboarding Flow', function () {
    if (!sessionState.sessionToken) return;
    
    // Simulate onboarding steps
    const onboardingData = {
      preferences: {
        journalReminders: true,
        reminderTime: '19:00',
        privateMode: true,
      },
      demographics: {
        ageRange: '25-34',
        pronouns: 'they/them',
      },
    };
    
    const response = http.post(`${API_BASE}/user/onboarding`, JSON.stringify(onboardingData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionState.sessionToken}`,
      },
      tags: { api: 'onboarding' }
    });
    
    check(response, {
      'onboarding completion ok': (r) => r.status === 200,
    });
  });
}

function accessCrisisResources() {
  group('Crisis Resources Access', function () {
    const resources = [
      '/crisis-support',
      '/emergency-contacts',
      '/crisis-resources',
      '/support'
    ];
    
    resources.forEach(resource => {
      const response = http.get(`${BASE_URL}${resource}`, {
        tags: { 
          page: 'crisis-resource',
          crisis: 'true'
        }
      });
      
      check(response, {
        [`${resource} accessible`]: (r) => r.status === 200,
        [`${resource} fast load`]: (r) => r.timings.duration < 1000,
      });
    });
  });
}

function accessSupportContacts() {
  group('Support Contacts', function () {
    const response = http.get(`${API_BASE}/crisis/contacts`, {
      tags: { 
        api: 'crisis',
        action: 'contacts',
        crisis: 'true'
      }
    });
    
    check(response, {
      'support contacts available': (r) => r.status === 200,
      'support contacts fast': (r) => r.timings.duration < 500,
    });
  });
}

function reviewPastEntries() {
  group('Review Past Entries', function () {
    if (!sessionState.sessionToken) return;
    
    const response = http.get(`${API_BASE}/journals?limit=10`, {
      headers: { 'Authorization': `Bearer ${sessionState.sessionToken}` },
      tags: { api: 'journals', action: 'list' }
    });
    
    check(response, {
      'past entries loaded': (r) => r.status === 200,
      'past entries load time ok': (r) => r.timings.duration < 2000,
    });
  });
}

function visitProfile() {
  group('Profile Management', function () {
    if (!sessionState.sessionToken) return;
    
    const response = http.get(`${API_BASE}/user/profile`, {
      headers: { 'Authorization': `Bearer ${sessionState.sessionToken}` },
      tags: { api: 'user', action: 'profile' }
    });
    
    check(response, {
      'profile loaded': (r) => r.status === 200,
    });
  });
}

function exportUserData() {
  group('Data Export', function () {
    if (!sessionState.sessionToken) return;
    
    const response = http.get(`${API_BASE}/user/export`, {
      headers: { 'Authorization': `Bearer ${sessionState.sessionToken}` },
      tags: { api: 'user', action: 'export' }
    });
    
    check(response, {
      'data export initiated': (r) => r.status === 200 || r.status === 202,
    });
  });
}

function performLogout() {
  group('User Logout', function () {
    if (!sessionState.sessionToken) return;
    
    const response = http.post(`${API_BASE}/auth/logout`, null, {
      headers: { 'Authorization': `Bearer ${sessionState.sessionToken}` },
      tags: { api: 'auth', action: 'logout' }
    });
    
    check(response, {
      'logout successful': (r) => r.status === 200,
    });
    
    // Clear session state
    sessionState.sessionToken = null;
    sessionState.userId = null;
  });
}

// Utility functions

function generateJournalContent() {
  const thoughts = [
    "Today was a good day overall. I managed to complete my tasks and felt productive.",
    "I'm feeling a bit overwhelmed with everything going on, but I'm taking it one step at a time.",
    "Grateful for the small moments of joy today - a good cup of coffee and a text from a friend.",
    "Reflecting on my goals and where I want to be in the coming months.",
    "Had some challenges today but I'm proud of how I handled them.",
    "Taking time for self-care and mindfulness. It really makes a difference.",
    "Thinking about what I've learned about myself recently.",
    "Focusing on the positive aspects of my day and practicing gratitude.",
  ];
  
  return thoughts[Math.floor(Math.random() * thoughts.length)];
}

// Custom summary report
export function handleSummary(data) {
  const summary = textSummary(data, { indent: ' ', enableColors: true });
  
  // Add ALCHM-specific summary information
  const alchmSummary = generateAlchmSummary(data);
  
  return {
    'stdout': summary + '\n\n' + alchmSummary,
    'load-test-report.json': JSON.stringify(data, null, 2),
    'load-test-summary.html': generateHTMLReport(data, alchmSummary),
  };
}

function generateAlchmSummary(data) {
  const metrics = data.metrics;
  
  let summary = '\n🏥 ALCHM Load Test Summary\n';
  summary += '=' .repeat(40) + '\n';
  
  // Crisis performance
  if (metrics.crisis_response_time) {
    const crisisP95 = metrics.crisis_response_time.values['p(95)'];
    summary += `🚨 Crisis Page Performance: ${crisisP95?.toFixed(0) || 'N/A'}ms (p95)\n`;
    summary += `   ${crisisP95 < 1000 ? '✅' : '❌'} Target: <1000ms\n`;
  }
  
  // Authentication performance
  if (metrics.auth_response_time) {
    const authP95 = metrics.auth_response_time.values['p(95)'];
    summary += `🔐 Auth Performance: ${authP95?.toFixed(0) || 'N/A'}ms (p95)\n`;
    summary += `   ${authP95 < 1500 ? '✅' : '❌'} Target: <1500ms\n`;
  }
  
  // Journal save performance
  if (metrics.journal_save_time) {
    const journalP95 = metrics.journal_save_time.values['p(95)'];
    summary += `📝 Journal Save: ${journalP95?.toFixed(0) || 'N/A'}ms (p95)\n`;
    summary += `   ${journalP95 < 2000 ? '✅' : '❌'} Target: <2000ms\n`;
  }
  
  // Error rates
  if (metrics.http_req_failed) {
    const errorRate = metrics.http_req_failed.values.rate * 100;
    summary += `❌ Error Rate: ${errorRate.toFixed(2)}%\n`;
    summary += `   ${errorRate < 5 ? '✅' : '❌'} Target: <5%\n`;
  }
  
  // Crisis failures
  if (metrics.crisis_failures) {
    const crisisFailures = metrics.crisis_failures.values.count;
    summary += `🚨 Crisis Failures: ${crisisFailures}\n`;
    summary += `   ${crisisFailures === 0 ? '✅' : '❌'} Target: 0\n`;
  }
  
  summary += '\n💡 Recommendations:\n';
  summary += generateRecommendations(data);
  
  return summary;
}

function generateRecommendations(data) {
  const metrics = data.metrics;
  let recommendations = '';
  
  // Crisis performance recommendations
  if (metrics.crisis_response_time?.values['p(95)'] > 1000) {
    recommendations += '• Optimize crisis page loading - consider preloading critical resources\n';
    recommendations += '• Implement aggressive caching for crisis content\n';
  }
  
  // Auth performance recommendations
  if (metrics.auth_response_time?.values['p(95)'] > 1500) {
    recommendations += '• Optimize authentication flow - consider session caching\n';
    recommendations += '• Review database queries in auth endpoints\n';
  }
  
  // Journal performance recommendations
  if (metrics.journal_save_time?.values['p(95)'] > 2000) {
    recommendations += '• Optimize journal save operations - consider async processing\n';
    recommendations += '• Implement client-side caching for journal drafts\n';
  }
  
  // Error rate recommendations
  if (metrics.http_req_failed?.values.rate > 0.05) {
    recommendations += '• Investigate and fix high error rate issues\n';
    recommendations += '• Implement better error handling and retry logic\n';
  }
  
  if (recommendations === '') {
    recommendations = '• All performance targets met! Consider increasing load test intensity.\n';
  }
  
  return recommendations;
}

function generateHTMLReport(data, alchmSummary) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>ALCHM Load Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; }
        .metric { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .success { border-left: 4px solid #22c55e; }
        .warning { border-left: 4px solid #f59e0b; }
        .error { border-left: 4px solid #ef4444; }
        pre { background: #1f2937; color: #f9fafb; padding: 20px; border-radius: 8px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🚀 ALCHM Load Test Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    <h2>Performance Summary</h2>
    <pre>${alchmSummary}</pre>
    
    <h2>Detailed Metrics</h2>
    <div id="metrics">
        ${Object.entries(data.metrics).map(([name, metric]) => `
            <div class="metric">
                <h3>${name}</h3>
                <p>Average: ${metric.values.avg?.toFixed(2) || 'N/A'}</p>
                <p>95th percentile: ${metric.values['p(95)']?.toFixed(2) || 'N/A'}</p>
                <p>Max: ${metric.values.max?.toFixed(2) || 'N/A'}</p>
            </div>
        `).join('')}
    </div>
    
    <h2>Test Configuration</h2>
    <pre>${JSON.stringify(options, null, 2)}</pre>
</body>
</html>`;
}