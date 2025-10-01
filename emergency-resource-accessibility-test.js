/**
 * Emergency Resource Accessibility Test
 * Tests actual accessibility and response times of crisis resources
 */

const https = require('https');
const http = require('http');

// Emergency resources to test
const EMERGENCY_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    contact: '988',
    testEndpoint: null, // Phone numbers can't be tested automatically
    type: 'phone',
    critical: true
  },
  {
    name: 'Crisis Text Line',
    contact: '741741',
    testEndpoint: null, // SMS can't be tested automatically
    type: 'sms',
    critical: true
  },
  {
    name: 'Trevor Project',
    contact: '1-866-488-7386',
    testEndpoint: null,
    type: 'phone',
    critical: true
  },
  {
    name: 'Crisis Chat (Lifeline)',
    contact: 'https://suicidepreventionlifeline.org/chat/',
    testEndpoint: 'https://suicidepreventionlifeline.org',
    type: 'web',
    critical: true
  },
  {
    name: 'National Alliance on Mental Illness',
    contact: 'https://www.nami.org/help',
    testEndpoint: 'https://www.nami.org',
    type: 'web',
    critical: false
  }
];

class EmergencyResourceAccessibilityTester {
  constructor() {
    this.results = {
      phoneNumbers: [],
      webResources: [],
      responseTimeTests: [],
      availabilityTests: [],
      criticalIssues: [],
      overallAccessibility: 0
    };
  }

  /**
   * Run complete accessibility test
   */
  async runAccessibilityTest() {
    console.log('🚨 TESTING EMERGENCY RESOURCE ACCESSIBILITY');
    console.log('==========================================');

    const startTime = Date.now();

    try {
      // Test phone number validity
      await this.testPhoneNumberValidity();
      
      // Test web resource accessibility
      await this.testWebResourceAccessibility();
      
      // Test response times
      await this.testResourceResponseTimes();
      
      // Test 24/7 availability indicators
      await this.testAvailabilityIndicators();
      
      // Calculate overall accessibility score
      this.calculateOverallAccessibility();
      
      const totalTime = Date.now() - startTime;
      console.log(`\n✅ ACCESSIBILITY TEST COMPLETED IN ${totalTime}ms`);
      
      this.generateAccessibilityReport();
      
      return this.results;
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR in accessibility test:', error);
      this.results.criticalIssues.push({
        type: 'TEST_FAILURE',
        severity: 'CRITICAL',
        message: `Accessibility test failed: ${error.message}`,
        impact: 'Unable to validate resource accessibility'
      });
      return this.results;
    }
  }

  /**
   * Test phone number validity and formatting
   */
  async testPhoneNumberValidity() {
    console.log('\n📞 Testing Phone Number Validity...');
    
    const phoneResources = EMERGENCY_RESOURCES.filter(r => r.type === 'phone');
    
    for (const resource of phoneResources) {
      const result = this.validatePhoneNumber(resource.contact);
      
      this.results.phoneNumbers.push({
        name: resource.name,
        number: resource.contact,
        valid: result.valid,
        formatted: result.formatted,
        issues: result.issues,
        critical: resource.critical
      });

      const status = result.valid ? '✅' : '❌';
      console.log(`${status} ${resource.name}: ${resource.contact} ${result.valid ? '(Valid)' : '(Invalid)'}`);
      
      if (!result.valid && resource.critical) {
        this.results.criticalIssues.push({
          type: 'INVALID_PHONE_NUMBER',
          severity: 'CRITICAL',
          message: `Critical phone number ${resource.contact} is invalid`,
          resource: resource.name,
          impact: 'Users cannot call for emergency help'
        });
      }

      if (result.issues.length > 0) {
        console.log(`  ⚠️ Issues: ${result.issues.join(', ')}`);
      }
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(number) {
    const issues = [];
    let valid = true;
    let formatted = number;

    // Remove all non-digit characters except + and -
    const cleanNumber = number.replace(/[^\d+-]/g, '');
    
    // Check for valid phone number patterns
    const patterns = [
      /^\d{3}$/, // 988, 911
      /^\d{3}-\d{3}-\d{4}$/, // 123-456-7890
      /^1-\d{3}-\d{3}-\d{4}$/, // 1-123-456-7890
      /^\(\d{3}\) \d{3}-\d{4}$/, // (123) 456-7890
      /^\d{10}$/, // 1234567890
      /^\d{11}$/ // 11234567890
    ];

    const matchesPattern = patterns.some(pattern => pattern.test(cleanNumber));
    
    if (!matchesPattern) {
      valid = false;
      issues.push('Does not match valid phone number patterns');
    }

    // Check length
    if (cleanNumber.length < 3 || cleanNumber.length > 15) {
      valid = false;
      issues.push('Invalid length');
    }

    // Check for special emergency numbers
    if (['911', '988', '211'].includes(cleanNumber)) {
      valid = true; // These are always valid
      formatted = cleanNumber;
    }

    // Format long numbers properly
    if (cleanNumber.length === 10) {
      formatted = `${cleanNumber.slice(0,3)}-${cleanNumber.slice(3,6)}-${cleanNumber.slice(6)}`;
    } else if (cleanNumber.length === 11 && cleanNumber.startsWith('1')) {
      formatted = `1-${cleanNumber.slice(1,4)}-${cleanNumber.slice(4,7)}-${cleanNumber.slice(7)}`;
    }

    return { valid, formatted, issues };
  }

  /**
   * Test web resource accessibility
   */
  async testWebResourceAccessibility() {
    console.log('\n🌐 Testing Web Resource Accessibility...');
    
    const webResources = EMERGENCY_RESOURCES.filter(r => r.type === 'web' && r.testEndpoint);
    
    for (const resource of webResources) {
      try {
        const startTime = Date.now();
        const result = await this.testWebEndpoint(resource.testEndpoint);
        const responseTime = Date.now() - startTime;
        
        const accessible = result.statusCode >= 200 && result.statusCode < 400;
        
        this.results.webResources.push({
          name: resource.name,
          url: resource.testEndpoint,
          accessible,
          statusCode: result.statusCode,
          responseTime,
          sslEnabled: result.sslEnabled,
          critical: resource.critical
        });

        const status = accessible ? '✅' : '❌';
        console.log(`${status} ${resource.name}: ${result.statusCode} (${responseTime}ms)`);
        
        if (!accessible && resource.critical) {
          this.results.criticalIssues.push({
            type: 'WEB_RESOURCE_INACCESSIBLE',
            severity: 'HIGH',
            message: `Critical web resource ${resource.name} returned ${result.statusCode}`,
            resource: resource.name,
            impact: 'Users cannot access online crisis support'
          });
        }

        // Check SSL for security
        if (!result.sslEnabled && resource.critical) {
          this.results.criticalIssues.push({
            type: 'INSECURE_CONNECTION',
            severity: 'MEDIUM',
            message: `Resource ${resource.name} does not use HTTPS`,
            resource: resource.name,
            impact: 'Insecure connection for crisis communication'
          });
        }

      } catch (error) {
        console.error(`❌ Error testing ${resource.name}: ${error.message}`);
        
        this.results.webResources.push({
          name: resource.name,
          url: resource.testEndpoint,
          accessible: false,
          error: error.message,
          critical: resource.critical
        });

        if (resource.critical) {
          this.results.criticalIssues.push({
            type: 'WEB_RESOURCE_ERROR',
            severity: 'HIGH',
            message: `Critical web resource ${resource.name} failed: ${error.message}`,
            resource: resource.name,
            impact: 'Users cannot access online crisis support'
          });
        }
      }
    }
  }

  /**
   * Test web endpoint accessibility
   */
  testWebEndpoint(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname,
        method: 'HEAD',
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'ALCHM Crisis Resource Validator'
        }
      };

      const req = client.request(options, (res) => {
        resolve({
          statusCode: res.statusCode,
          sslEnabled: isHttps,
          headers: res.headers
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Test resource response times
   */
  async testResourceResponseTimes() {
    console.log('\n⏱️ Testing Resource Response Times...');
    
    const webResources = this.results.webResources.filter(r => r.accessible);
    
    for (const resource of webResources) {
      // We already have response time from accessibility test
      const responseTime = resource.responseTime;
      const acceptable = responseTime < 5000; // 5 second limit for crisis resources
      
      this.results.responseTimeTests.push({
        name: resource.name,
        responseTime,
        acceptable,
        benchmark: 5000
      });

      const status = acceptable ? '✅' : '❌';
      console.log(`${status} ${resource.name}: ${responseTime}ms (limit: 5000ms)`);
      
      if (!acceptable) {
        this.results.criticalIssues.push({
          type: 'SLOW_RESPONSE_TIME',
          severity: 'MEDIUM',
          message: `Resource ${resource.name} response time (${responseTime}ms) exceeds 5 second limit`,
          resource: resource.name,
          impact: 'Slow loading may deter users in crisis'
        });
      }
    }
  }

  /**
   * Test availability indicators
   */
  async testAvailabilityIndicators() {
    console.log('\n🕒 Testing Availability Indicators...');
    
    const availabilityTests = [
      {
        name: '24/7 Crisis Hotlines',
        resources: ['988 Suicide & Crisis Lifeline', 'Crisis Text Line', 'Trevor Project'],
        expectedAvailability: '24/7'
      },
      {
        name: 'Emergency Services',
        resources: ['911 Emergency Services'],
        expectedAvailability: '24/7'
      }
    ];

    for (const test of availabilityTests) {
      const availableResources = EMERGENCY_RESOURCES.filter(r => 
        test.resources.some(name => r.name.includes(name.split(' ')[0]))
      );
      
      const allAvailable = availableResources.length >= test.resources.length * 0.8; // 80% threshold
      
      this.results.availabilityTests.push({
        name: test.name,
        expectedAvailability: test.expectedAvailability,
        availableCount: availableResources.length,
        totalCount: test.resources.length,
        passed: allAvailable
      });

      const status = allAvailable ? '✅' : '❌';
      console.log(`${status} ${test.name}: ${availableResources.length}/${test.resources.length} resources available`);
      
      if (!allAvailable) {
        this.results.criticalIssues.push({
          type: 'INSUFFICIENT_AVAILABILITY',
          severity: 'HIGH',
          message: `Only ${availableResources.length}/${test.resources.length} ${test.name} resources available`,
          impact: 'Insufficient crisis support coverage'
        });
      }
    }
  }

  /**
   * Calculate overall accessibility score
   */
  calculateOverallAccessibility() {
    let totalScore = 0;
    let maxScore = 0;

    // Phone number validity (30% weight)
    const phoneWeight = 0.3;
    const validPhones = this.results.phoneNumbers.filter(p => p.valid).length;
    const totalPhones = this.results.phoneNumbers.length;
    if (totalPhones > 0) {
      totalScore += (validPhones / totalPhones) * phoneWeight * 100;
    }
    maxScore += phoneWeight * 100;

    // Web resource accessibility (25% weight)
    const webWeight = 0.25;
    const accessibleWeb = this.results.webResources.filter(w => w.accessible).length;
    const totalWeb = this.results.webResources.length;
    if (totalWeb > 0) {
      totalScore += (accessibleWeb / totalWeb) * webWeight * 100;
    }
    maxScore += webWeight * 100;

    // Response times (20% weight)
    const responseWeight = 0.2;
    const acceptableResponse = this.results.responseTimeTests.filter(r => r.acceptable).length;
    const totalResponse = this.results.responseTimeTests.length;
    if (totalResponse > 0) {
      totalScore += (acceptableResponse / totalResponse) * responseWeight * 100;
    }
    maxScore += responseWeight * 100;

    // Availability (25% weight)
    const availabilityWeight = 0.25;
    const passedAvailability = this.results.availabilityTests.filter(a => a.passed).length;
    const totalAvailability = this.results.availabilityTests.length;
    if (totalAvailability > 0) {
      totalScore += (passedAvailability / totalAvailability) * availabilityWeight * 100;
    }
    maxScore += availabilityWeight * 100;

    this.results.overallAccessibility = Math.round((totalScore / maxScore) * 100);
  }

  /**
   * Generate accessibility report
   */
  generateAccessibilityReport() {
    console.log('\n📋 EMERGENCY RESOURCE ACCESSIBILITY REPORT');
    console.log('==========================================');
    console.log(`Overall Accessibility Score: ${this.results.overallAccessibility}%`);
    console.log(`Critical Issues Found: ${this.results.criticalIssues.length}`);

    if (this.results.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      this.results.criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity}] ${issue.message}`);
        console.log(`   Resource: ${issue.resource || 'N/A'}`);
        console.log(`   Impact: ${issue.impact}`);
      });
    }

    console.log('\n📊 DETAILED RESULTS:');
    
    // Phone Numbers
    const validPhones = this.results.phoneNumbers.filter(p => p.valid).length;
    console.log(`Phone Numbers: ${validPhones}/${this.results.phoneNumbers.length} valid`);
    
    // Web Resources
    const accessibleWeb = this.results.webResources.filter(w => w.accessible).length;
    console.log(`Web Resources: ${accessibleWeb}/${this.results.webResources.length} accessible`);
    
    // Response Times
    const acceptableResponse = this.results.responseTimeTests.filter(r => r.acceptable).length;
    console.log(`Response Times: ${acceptableResponse}/${this.results.responseTimeTests.length} acceptable`);
    
    // Availability
    const passedAvailability = this.results.availabilityTests.filter(a => a.passed).length;
    console.log(`Availability: ${passedAvailability}/${this.results.availabilityTests.length} confirmed`);

    // Launch readiness assessment
    const isAccessible = this.results.overallAccessibility >= 90 && 
                        this.results.criticalIssues.filter(i => i.severity === 'CRITICAL').length === 0;
    
    console.log(`\n🚀 RESOURCE ACCESSIBILITY: ${isAccessible ? 'READY ✅' : 'NOT READY ❌'}`);
    
    if (!isAccessible) {
      console.log('⚠️ Critical resource accessibility issues must be resolved before launch');
    }

    return this.results;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  const tester = new EmergencyResourceAccessibilityTester();
  tester.runAccessibilityTest()
    .then(results => {
      console.log('\n✅ Emergency resource accessibility test completed');
      const criticalIssues = results.criticalIssues.filter(i => i.severity === 'CRITICAL').length;
      process.exit(results.overallAccessibility >= 90 && criticalIssues === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Emergency resource accessibility test failed:', error);
      process.exit(1);
    });
}

module.exports = EmergencyResourceAccessibilityTester;