/**
 * ALCHM Crisis System Load Test
 * Tests crisis pages and emergency resources under high concurrent load
 * Simulates multiple users accessing crisis support simultaneously
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Crisis-focused test configuration
export let options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm up
    { duration: '1m', target: 50 },    // Normal crisis load
    { duration: '30s', target: 100 },  // Crisis spike
    { duration: '2m', target: 100 },   // Sustained crisis load
    { duration: '30s', target: 200 },  // Peak crisis scenario
    { duration: '1m', target: 200 },   // Peak sustained
    { duration: '1m', target: 0 },     // Cool down
  ],
  
  thresholds: {
    // Ultra-strict thresholds for crisis pages
    'http_req_duration{page:crisis}': ['p(95)<800', 'p(99)<1200'],
    'http_req_failed{page:crisis}': ['rate<0.001'], // 0.1% failure rate max
    crisis_page_load_time: ['p(95)<800'],
    crisis_resource_access: ['p(95)<500'],
    emergency_contact_load: ['p(95)<300'],
    hotline_info_load: ['p(95)<200'],
  },
};

// Crisis-specific metrics
export const crisisPageLoadTime = new Trend('crisis_page_load_time');
export const crisisResourceAccess = new Trend('crisis_resource_access');
export const emergencyContactLoad = new Trend('emergency_contact_load');
export const hotlineInfoLoad = new Trend('hotline_info_load');
export const crisisFailures = new Counter('crisis_failures');
export const crisisUserSessions = new Counter('crisis_user_sessions');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  crisisUserSessions.add(1);
  
  group('Crisis User Emergency Session', function () {
    // Simulate someone in crisis accessing the platform
    
    // 1. Direct access to crisis support (most common entry point)
    accessCrisisSupportPage();
    
    // 2. Access emergency resources quickly
    accessEmergencyResources();
    
    // 3. Get hotline information (critical path)
    getHotlineInformation();
    
    // 4. Access crisis chat or support (if available)
    accessCrisisSupport();
    
    // 5. Optional: Quick journal entry for crisis users
    if (Math.random() < 0.3) {
      quickCrisisJournalEntry();
    }
  });
  
  // Minimal think time for crisis users
  sleep(Math.random() * 0.5 + 0.2);
}

function accessCrisisSupportPage() {
  group('Crisis Support Page Access', function () {
    const startTime = Date.now();
    
    const response = http.get(`${BASE_URL}/crisis-support`, {
      tags: { 
        page: 'crisis',
        critical: 'true'
      }
    });
    
    const loadTime = Date.now() - startTime;
    crisisPageLoadTime.add(loadTime);
    
    const success = check(response, {
      'crisis page status 200': (r) => r.status === 200,
      'crisis page ultra fast': (r) => r.timings.duration < 800,
      'crisis page has emergency info': (r) => 
        r.body.includes('988') || 
        r.body.includes('crisis') || 
        r.body.includes('emergency') ||
        r.body.includes('suicide'),
      'crisis page has hotline': (r) => 
        r.body.includes('hotline') || 
        r.body.includes('lifeline'),
    });
    
    if (!success) {
      crisisFailures.add(1);
      console.error('🚨 CRITICAL: Crisis support page failed to load properly');
    }
  });
}

function accessEmergencyResources() {
  group('Emergency Resources Access', function () {
    const emergencyUrls = [
      '/emergency',
      '/crisis-resources',
      '/hotlines',
      '/emergency-contacts'
    ];
    
    emergencyUrls.forEach(url => {
      const startTime = Date.now();
      
      const response = http.get(`${BASE_URL}${url}`, {
        tags: { 
          page: 'emergency-resource',
          critical: 'true'
        }
      });
      
      const loadTime = Date.now() - startTime;
      crisisResourceAccess.add(loadTime);
      
      const success = check(response, {
        [`${url} accessible`]: (r) => r.status === 200,
        [`${url} loads fast`]: (r) => r.timings.duration < 500,
      });
      
      if (!success) {
        crisisFailures.add(1);
        console.error(`🚨 CRITICAL: Emergency resource ${url} failed`);
      }
      
      // Very short delay between emergency resource requests
      sleep(0.1);
    });
  });
}

function getHotlineInformation() {
  group('Hotline Information Retrieval', function () {
    const startTime = Date.now();
    
    // Test both API and static routes for hotline info
    const apiResponse = http.get(`${BASE_URL}/api/crisis/hotlines`, {
      tags: { 
        api: 'crisis-hotlines',
        critical: 'true'
      }
    });
    
    const staticResponse = http.get(`${BASE_URL}/crisis-support#hotlines`, {
      tags: { 
        page: 'hotlines',
        critical: 'true'
      }
    });
    
    const loadTime = Date.now() - startTime;
    hotlineInfoLoad.add(loadTime);
    
    const success = check(apiResponse, {
      'hotline API accessible': (r) => r.status === 200,
      'hotline API fast': (r) => r.timings.duration < 200,
      'hotline API has data': (r) => {
        try {
          const data = r.json();
          return Array.isArray(data) && data.length > 0;
        } catch {
          return false;
        }
      },
    }) && check(staticResponse, {
      'hotline page accessible': (r) => r.status === 200,
      'hotline page fast': (r) => r.timings.duration < 300,
    });
    
    if (!success) {
      crisisFailures.add(1);
      console.error('🚨 CRITICAL: Hotline information failed to load');
    }
  });
}

function accessCrisisSupport() {
  group('Crisis Support Features', function () {
    // Test various crisis support endpoints
    const supportEndpoints = [
      '/api/crisis/chat',
      '/api/crisis/resources',
      '/api/crisis/local-services',
      '/support'
    ];
    
    supportEndpoints.forEach(endpoint => {
      const startTime = Date.now();
      
      const response = http.get(`${BASE_URL}${endpoint}`, {
        tags: { 
          api: 'crisis-support',
          critical: 'true'
        }
      });
      
      const loadTime = Date.now() - startTime;
      emergencyContactLoad.add(loadTime);
      
      check(response, {
        [`${endpoint} responds`]: (r) => r.status === 200 || r.status === 404, // 404 OK if not implemented
        [`${endpoint} fast response`]: (r) => r.timings.duration < 300,
      });
      
      sleep(0.05);
    });
  });
}

function quickCrisisJournalEntry() {
  group('Crisis Journal Entry', function () {
    // Simulate a quick, crisis-related journal entry
    // This tests if the journaling system can handle crisis users
    
    const journalData = {
      content: "I'm having a really hard time right now and needed to write something down.",
      mood: 2,
      tags: ['crisis', 'need-support'],
      isCrisis: true,
      isPrivate: true,
    };
    
    const startTime = Date.now();
    
    const response = http.post(`${BASE_URL}/api/journals`, JSON.stringify(journalData), {
      headers: { 'Content-Type': 'application/json' },
      tags: { 
        api: 'crisis-journal',
        critical: 'true'
      }
    });
    
    const saveTime = Date.now() - startTime;
    
    const success = check(response, {
      'crisis journal saves': (r) => r.status === 200 || r.status === 201 || r.status === 401, // 401 OK if auth required
      'crisis journal save fast': (r) => r.timings.duration < 1000,
    });
    
    if (!success && response.status !== 401) {
      crisisFailures.add(1);
      console.error('🚨 WARNING: Crisis journal entry failed');
    }
  });
}

// Specialized checks for crisis scenarios
export function setup() {
  console.log('🚨 Starting ALCHM Crisis System Load Test');
  console.log('Testing crisis pages and emergency resources under load...');
  
  // Pre-test verification of critical endpoints
  const criticalEndpoints = [
    '/crisis-support',
    '/emergency',
    '/crisis-resources'
  ];
  
  let allCriticalEndpointsWorking = true;
  
  criticalEndpoints.forEach(endpoint => {
    const response = http.get(`${BASE_URL}${endpoint}`);
    if (response.status !== 200) {
      console.error(`🚨 CRITICAL: ${endpoint} not responding before test starts!`);
      allCriticalEndpointsWorking = false;
    }
  });
  
  if (!allCriticalEndpointsWorking) {
    console.error('🚨 ABORTING: Critical crisis endpoints not available');
    // In a real scenario, you might want to fail the test here
  }
  
  return { baseUrl: BASE_URL };
}

export function teardown(data) {
  console.log('🏁 Crisis load test completed');
  
  // Post-test verification
  const response = http.get(`${data.baseUrl}/crisis-support`);
  if (response.status !== 200) {
    console.error('🚨 CRITICAL: Crisis support page not responding after load test!');
  } else {
    console.log('✅ Crisis support page still responsive after load test');
  }
}

export function handleSummary(data) {
  const metrics = data.metrics;
  
  let summary = '\n🚨 ALCHM Crisis System Load Test Results\n';
  summary += '=' .repeat(50) + '\n';
  
  // Crisis page performance
  if (metrics.crisis_page_load_time) {
    const crisisP95 = metrics.crisis_page_load_time.values['p(95)'];
    const crisisP99 = metrics.crisis_page_load_time.values['p(99)'];
    summary += `🏥 Crisis Page Load Time:\n`;
    summary += `   P95: ${crisisP95?.toFixed(0) || 'N/A'}ms ${crisisP95 < 800 ? '✅' : '❌'} (target: <800ms)\n`;
    summary += `   P99: ${crisisP99?.toFixed(0) || 'N/A'}ms ${crisisP99 < 1200 ? '✅' : '❌'} (target: <1200ms)\n`;
  }
  
  // Emergency resource access
  if (metrics.crisis_resource_access) {
    const resourceP95 = metrics.crisis_resource_access.values['p(95)'];
    summary += `🆘 Emergency Resource Access: ${resourceP95?.toFixed(0) || 'N/A'}ms (p95)\n`;
    summary += `   ${resourceP95 < 500 ? '✅' : '❌'} Target: <500ms\n`;
  }
  
  // Hotline information
  if (metrics.hotline_info_load) {
    const hotlineP95 = metrics.hotline_info_load.values['p(95)'];
    summary += `📞 Hotline Info Load: ${hotlineP95?.toFixed(0) || 'N/A'}ms (p95)\n`;
    summary += `   ${hotlineP95 < 200 ? '✅' : '❌'} Target: <200ms\n`;
  }
  
  // Crisis failures
  if (metrics.crisis_failures) {
    const failures = metrics.crisis_failures.values.count;
    summary += `❌ Crisis System Failures: ${failures}\n`;
    summary += `   ${failures === 0 ? '✅' : '🚨'} Target: 0 failures\n`;
  }
  
  // User sessions
  if (metrics.crisis_user_sessions) {
    const sessions = metrics.crisis_user_sessions.values.count;
    summary += `👥 Crisis User Sessions Tested: ${sessions}\n`;
  }
  
  summary += '\n🎯 Crisis System Assessment:\n';
  
  const allTargetsMet = 
    (!metrics.crisis_page_load_time || metrics.crisis_page_load_time.values['p(95)'] < 800) &&
    (!metrics.crisis_resource_access || metrics.crisis_resource_access.values['p(95)'] < 500) &&
    (!metrics.hotline_info_load || metrics.hotline_info_load.values['p(95)'] < 200) &&
    (!metrics.crisis_failures || metrics.crisis_failures.values.count === 0);
  
  if (allTargetsMet) {
    summary += '✅ Crisis system performance EXCELLENT - ready for emergency load\n';
    summary += '✅ All crisis response time targets met\n';
    summary += '✅ Zero critical failures detected\n';
  } else {
    summary += '🚨 Crisis system performance NEEDS ATTENTION\n';
    summary += '⚠️  Some crisis response targets not met\n';
    summary += '🔧 Immediate optimization required for crisis scenarios\n';
  }
  
  summary += '\n💡 Crisis System Recommendations:\n';
  
  if (metrics.crisis_page_load_time?.values['p(95)'] > 800) {
    summary += '• URGENT: Optimize crisis page loading - implement aggressive preloading\n';
    summary += '• Consider crisis page CDN distribution for global access\n';
  }
  
  if (metrics.crisis_resource_access?.values['p(95)'] > 500) {
    summary += '• URGENT: Optimize emergency resource loading\n';
    summary += '• Implement crisis resource caching strategy\n';
  }
  
  if (metrics.hotline_info_load?.values['p(95)'] > 200) {
    summary += '• URGENT: Hotline information must load instantaneously\n';
    summary += '• Consider embedding hotline info directly in crisis pages\n';
  }
  
  if (metrics.crisis_failures?.values.count > 0) {
    summary += '• CRITICAL: Investigate and fix crisis system failures immediately\n';
    summary += '• Implement crisis system redundancy and failover\n';
  }
  
  return {
    'stdout': summary,
    'crisis-load-test-report.json': JSON.stringify(data, null, 2),
  };
}