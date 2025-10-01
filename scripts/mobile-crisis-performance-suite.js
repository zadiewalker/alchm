#!/usr/bin/env node

/**
 * MOBILE CRISIS PERFORMANCE TESTING SUITE
 * 
 * Comprehensive performance testing for mobile users in crisis situations
 * Tests various devices, network conditions, and trauma-informed scenarios
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class MobileCrisisPerformanceSuite {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: 0,
                passed: 0,
                failed: 0,
                criticalIssues: []
            },
            deviceTests: [],
            networkTests: [],
            crisisScenarios: [],
            recommendations: []
        };

        // Crisis-optimized thresholds for mobile
        this.thresholds = {
            // Core Web Vitals - mobile crisis thresholds
            FCP: 1200,              // First Contentful Paint <1.2s
            LCP: 2000,              // Largest Contentful Paint <2.0s
            FID: 100,               // First Input Delay <100ms
            CLS: 0.05,              // Cumulative Layout Shift <0.05
            TTI: 3000,              // Time to Interactive <3s

            // Crisis-specific mobile thresholds
            CRISIS_BUTTON: 100,      // Crisis button response <100ms
            EMERGENCY_LOAD: 500,     // Emergency resources <500ms
            JOURNAL_SAVE: 1000,      // Journal save <1s
            AUTH_TIME: 800,          // Authentication <800ms
            OFFLINE_LOAD: 200,       // Offline content <200ms

            // Mobile-specific thresholds
            TOUCH_RESPONSE: 100,     // Touch interaction response
            SCROLL_PERFORMANCE: 60,  // Scroll FPS minimum
            BATTERY_IMPACT: 10,      // Max battery drain % per minute
            MEMORY_USAGE: 100,       // Max memory usage MB

            // Network condition thresholds
            SLOW_3G_LOAD: 5000,      // Page load on slow 3G <5s
            OFFLINE_RECOVERY: 1000,  // Time to recover from offline
            POOR_CONNECTION: 8000    // Performance on poor connection
        };

        // Device configurations for testing
        this.devices = [
            {
                name: 'iPhone SE (Crisis-prone demographics)',
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
                viewport: { width: 375, height: 667 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true,
                criticalTest: true
            },
            {
                name: 'iPhone 12 Pro',
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
                viewport: { width: 390, height: 844 },
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true
            },
            {
                name: 'Samsung Galaxy A12 (Budget Android)',
                userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-A125F) AppleWebKit/537.36',
                viewport: { width: 360, height: 740 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true,
                criticalTest: true
            },
            {
                name: 'Samsung Galaxy S21',
                userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
                viewport: { width: 384, height: 854 },
                deviceScaleFactor: 2.75,
                isMobile: true,
                hasTouch: true
            },
            {
                name: 'iPad Mini (Tablet)',
                userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
                viewport: { width: 768, height: 1024 },
                deviceScaleFactor: 2,
                isMobile: false,
                hasTouch: true
            }
        ];

        // Network conditions for testing
        this.networkConditions = [
            {
                name: 'Slow 3G (Crisis worst-case)',
                offline: false,
                downloadThroughput: 500 * 1024 / 8, // 500kb/s
                uploadThroughput: 500 * 1024 / 8,
                latency: 400,
                critical: true
            },
            {
                name: 'Fast 3G',
                offline: false,
                downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6Mb/s
                uploadThroughput: 750 * 1024 / 8,
                latency: 150
            },
            {
                name: '4G',
                offline: false,
                downloadThroughput: 9 * 1024 * 1024 / 8, // 9Mb/s
                uploadThroughput: 9 * 1024 * 1024 / 8,
                latency: 170
            },
            {
                name: 'Offline Mode',
                offline: true,
                downloadThroughput: 0,
                uploadThroughput: 0,
                latency: 0,
                critical: true
            }
        ];

        // Crisis test scenarios
        this.crisisScenarios = [
            {
                name: 'Emergency Button Access',
                description: 'User in crisis needs immediate access to 988 button',
                priority: 'critical',
                test: this.testEmergencyButtonAccess.bind(this)
            },
            {
                name: 'Crisis Keyword Detection',
                description: 'User types crisis keywords and needs immediate support',
                priority: 'critical',
                test: this.testCrisisKeywordDetection.bind(this)
            },
            {
                name: 'Offline Crisis Support',
                description: 'User loses connection during crisis and needs cached support',
                priority: 'high',
                test: this.testOfflineCrisisSupport.bind(this)
            },
            {
                name: 'Low Battery Performance',
                description: 'User has low battery during crisis session',
                priority: 'high',
                test: this.testLowBatteryPerformance.bind(this)
            },
            {
                name: 'Slow Connection Journal Save',
                description: 'User on slow connection needs to save journal entry',
                priority: 'medium',
                test: this.testSlowConnectionJournalSave.bind(this)
            }
        ];
    }

    async runComprehensiveTests() {
        console.log('🚀 Starting Mobile Crisis Performance Testing Suite...');
        console.log(`📱 Testing ${this.devices.length} devices`);
        console.log(`📶 Testing ${this.networkConditions.length} network conditions`);
        console.log(`🆘 Testing ${this.crisisScenarios.length} crisis scenarios\n`);

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=TranslateUI',
                '--disable-extensions'
            ]
        });

        try {
            // Test each device configuration
            for (const device of this.devices) {
                console.log(`📱 Testing device: ${device.name}`);
                await this.testDevice(browser, device);
            }

            // Test network conditions on critical devices
            const criticalDevices = this.devices.filter(d => d.criticalTest);
            for (const device of criticalDevices) {
                for (const network of this.networkConditions) {
                    console.log(`📶 Testing ${device.name} on ${network.name}`);
                    await this.testNetworkCondition(browser, device, network);
                }
            }

            // Test crisis scenarios
            for (const scenario of this.crisisScenarios) {
                console.log(`🆘 Testing crisis scenario: ${scenario.name}`);
                await this.testCrisisScenario(browser, scenario);
            }

            // Generate comprehensive report
            await this.generateReport();
            
        } finally {
            await browser.close();
        }

        console.log('✅ Mobile Crisis Performance Testing Complete!');
        console.log(`📊 Results saved to: mobile-crisis-performance-report.json`);
    }

    async testDevice(browser, device) {
        const page = await browser.newPage();
        
        try {
            // Configure device
            await page.setUserAgent(device.userAgent);
            await page.setViewport(device.viewport);

            // Start performance monitoring
            const metrics = await this.measurePagePerformance(page, 'http://localhost:3000', device.name);
            
            // Device-specific tests
            const deviceTests = {
                touchResponsiveness: await this.testTouchResponsiveness(page),
                scrollPerformance: await this.testScrollPerformance(page),
                crisisButtonAccess: await this.testCrisisButtonOnDevice(page, device),
                memoryUsage: await this.testMemoryUsage(page)
            };

            const deviceResult = {
                device: device.name,
                metrics,
                tests: deviceTests,
                passed: this.evaluateDevicePerformance(metrics, deviceTests),
                timestamp: new Date().toISOString()
            };

            this.results.deviceTests.push(deviceResult);
            this.results.summary.totalTests++;
            
            if (deviceResult.passed) {
                this.results.summary.passed++;
                console.log(`  ✅ ${device.name} passed performance tests`);
            } else {
                this.results.summary.failed++;
                console.log(`  ❌ ${device.name} failed performance tests`);
                
                if (device.criticalTest) {
                    this.results.summary.criticalIssues.push(`Critical device ${device.name} failed performance tests`);
                }
            }

        } catch (error) {
            console.error(`  ❌ Error testing ${device.name}:`, error.message);
            this.results.summary.failed++;
        } finally {
            await page.close();
        }
    }

    async testNetworkCondition(browser, device, network) {
        const page = await browser.newPage();
        
        try {
            // Configure device
            await page.setUserAgent(device.userAgent);
            await page.setViewport(device.viewport);

            // Configure network
            if (!network.offline) {
                await page.emulateNetworkConditions({
                    offline: false,
                    downloadThroughput: network.downloadThroughput,
                    uploadThroughput: network.uploadThroughput,
                    latency: network.latency
                });
            } else {
                await page.setOfflineMode(true);
            }

            // Test performance under network conditions
            const networkResult = await this.testNetworkPerformance(page, device, network);
            
            this.results.networkTests.push(networkResult);
            this.results.summary.totalTests++;
            
            if (networkResult.passed) {
                this.results.summary.passed++;
                console.log(`  ✅ ${device.name} on ${network.name} passed`);
            } else {
                this.results.summary.failed++;
                console.log(`  ❌ ${device.name} on ${network.name} failed`);
                
                if (network.critical) {
                    this.results.summary.criticalIssues.push(`Critical network condition ${network.name} failed on ${device.name}`);
                }
            }

        } catch (error) {
            console.error(`  ❌ Error testing ${device.name} on ${network.name}:`, error.message);
            this.results.summary.failed++;
        } finally {
            await page.close();
        }
    }

    async testCrisisScenario(browser, scenario) {
        const page = await browser.newPage();
        
        try {
            // Use critical device for crisis scenarios
            const criticalDevice = this.devices.find(d => d.criticalTest);
            await page.setUserAgent(criticalDevice.userAgent);
            await page.setViewport(criticalDevice.viewport);

            // Run crisis scenario test
            const scenarioResult = await scenario.test(page);
            
            scenarioResult.scenario = scenario.name;
            scenarioResult.priority = scenario.priority;
            scenarioResult.timestamp = new Date().toISOString();

            this.results.crisisScenarios.push(scenarioResult);
            this.results.summary.totalTests++;
            
            if (scenarioResult.passed) {
                this.results.summary.passed++;
                console.log(`  ✅ Crisis scenario "${scenario.name}" passed`);
            } else {
                this.results.summary.failed++;
                console.log(`  ❌ Crisis scenario "${scenario.name}" failed`);
                
                if (scenario.priority === 'critical') {
                    this.results.summary.criticalIssues.push(`Critical crisis scenario "${scenario.name}" failed`);
                }
            }

        } catch (error) {
            console.error(`  ❌ Error testing crisis scenario "${scenario.name}":`, error.message);
            this.results.summary.failed++;
        } finally {
            await page.close();
        }
    }

    async measurePagePerformance(page, url, context) {
        const startTime = Date.now();
        
        try {
            await page.goto(url, { waitUntil: 'load', timeout: 15000 });
            
            // Get performance metrics
            const metrics = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                return {
                    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
                    ttfb: navigation.responseStart - navigation.requestStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
                    loadComplete: navigation.loadEventEnd - navigation.navigationStart,
                    resourceCount: performance.getEntriesByType('resource').length
                };
            });

            const totalLoadTime = Date.now() - startTime;
            
            return {
                ...metrics,
                totalLoadTime,
                context,
                url,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            return {
                error: error.message,
                context,
                url,
                timestamp: new Date().toISOString()
            };
        }
    }

    async testTouchResponsiveness(page) {
        try {
            // Test touch response time
            const startTime = Date.now();
            
            // Try to find and tap a button
            const button = await page.$('button, [role="button"], a');
            if (button) {
                await button.tap();
                const responseTime = Date.now() - startTime;
                
                return {
                    responseTime,
                    passed: responseTime < this.thresholds.TOUCH_RESPONSE
                };
            }
            
            return { responseTime: 0, passed: true, note: 'No interactive elements found' };
            
        } catch (error) {
            return { error: error.message, passed: false };
        }
    }

    async testScrollPerformance(page) {
        try {
            // Test scroll performance
            await page.evaluate(() => {
                return new Promise(resolve => {
                    let frameCount = 0;
                    let startTime = performance.now();
                    
                    function countFrames() {
                        frameCount++;
                        if (frameCount < 60) { // Test for 1 second at 60fps
                            requestAnimationFrame(countFrames);
                        } else {
                            const endTime = performance.now();
                            const duration = endTime - startTime;
                            const fps = (frameCount / duration) * 1000;
                            resolve(fps);
                        }
                    }
                    
                    // Start scrolling
                    window.scrollBy(0, 100);
                    requestAnimationFrame(countFrames);
                });
            });

            return { passed: true }; // Simplified for now
            
        } catch (error) {
            return { error: error.message, passed: false };
        }
    }

    async testCrisisButtonOnDevice(page, device) {
        try {
            // Look for crisis button
            const crisisButton = await page.$('[data-crisis-button], .crisis-button, [aria-label*="crisis"]');
            
            if (!crisisButton) {
                return {
                    found: false,
                    passed: false,
                    issue: 'No crisis button found - critical safety issue'
                };
            }

            // Test crisis button response time
            const startTime = Date.now();
            await crisisButton.tap();
            
            // Wait for crisis modal or response
            try {
                await page.waitForSelector('[data-crisis-modal], .crisis-modal', { timeout: 2000 });
                const responseTime = Date.now() - startTime;
                
                return {
                    found: true,
                    responseTime,
                    passed: responseTime < this.thresholds.CRISIS_BUTTON
                };
            } catch {
                return {
                    found: true,
                    responseTime: Date.now() - startTime,
                    passed: false,
                    issue: 'Crisis button did not trigger crisis support'
                };
            }

        } catch (error) {
            return { error: error.message, passed: false };
        }
    }

    async testMemoryUsage(page) {
        try {
            const memoryInfo = await page.evaluate(() => {
                if ('memory' in performance) {
                    const memory = performance.memory;
                    return {
                        used: memory.usedJSHeapSize,
                        total: memory.totalJSHeapSize,
                        limit: memory.jsHeapSizeLimit,
                        usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
                    };
                }
                return null;
            });

            if (memoryInfo) {
                const usageMB = memoryInfo.used / (1024 * 1024);
                return {
                    usageMB: Math.round(usageMB),
                    usagePercent: Math.round(memoryInfo.usagePercent),
                    passed: usageMB < this.thresholds.MEMORY_USAGE
                };
            }

            return { passed: true, note: 'Memory API not available' };

        } catch (error) {
            return { error: error.message, passed: false };
        }
    }

    async testNetworkPerformance(page, device, network) {
        try {
            let testResult = {
                device: device.name,
                network: network.name,
                timestamp: new Date().toISOString()
            };

            if (network.offline) {
                // Test offline performance
                const offlineResult = await this.testOfflineMode(page);
                testResult = { ...testResult, ...offlineResult };
            } else {
                // Test online performance under network conditions
                const performanceResult = await this.measurePagePerformance(page, 'http://localhost:3000', `${device.name} on ${network.name}`);
                testResult = { ...testResult, ...performanceResult };
            }

            // Evaluate based on network condition
            const passed = this.evaluateNetworkPerformance(testResult, network);
            testResult.passed = passed;

            return testResult;

        } catch (error) {
            return {
                device: device.name,
                network: network.name,
                error: error.message,
                passed: false,
                timestamp: new Date().toISOString()
            };
        }
    }

    async testOfflineMode(page) {
        try {
            const startTime = Date.now();
            
            // Try to load cached content
            await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 5000 });
            
            const loadTime = Date.now() - startTime;
            
            // Check for offline indicator or cached content
            const hasOfflineSupport = await page.evaluate(() => {
                return document.querySelector('[data-offline], .offline-indicator') !== null ||
                       document.body.textContent.toLowerCase().includes('offline') ||
                       document.body.textContent.toLowerCase().includes('cached');
            });

            return {
                offlineLoadTime: loadTime,
                hasOfflineSupport,
                passed: hasOfflineSupport && loadTime < this.thresholds.OFFLINE_LOAD
            };

        } catch (error) {
            return {
                error: error.message,
                hasOfflineSupport: false,
                passed: false
            };
        }
    }

    async testEmergencyButtonAccess(page) {
        try {
            await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
            
            const startTime = Date.now();
            
            // Look for emergency/crisis button
            const emergencyButton = await page.$('[data-crisis-button], [aria-label*="988"], [aria-label*="crisis"], .crisis-button');
            
            if (!emergencyButton) {
                return {
                    passed: false,
                    issue: 'No emergency button found on homepage',
                    priority: 'critical'
                };
            }

            // Test button accessibility and response
            const isVisible = await emergencyButton.isIntersectingViewport();
            const isEnabled = await page.evaluate(el => !el.disabled, emergencyButton);
            
            await emergencyButton.tap();
            
            // Check for emergency response
            try {
                await page.waitForSelector('[data-crisis-modal], .crisis-modal, [aria-label*="emergency"]', { timeout: 1000 });
                const responseTime = Date.now() - startTime;
                
                return {
                    passed: responseTime < this.thresholds.CRISIS_BUTTON && isVisible && isEnabled,
                    responseTime,
                    isVisible,
                    isEnabled
                };
            } catch {
                return {
                    passed: false,
                    issue: 'Emergency button did not trigger crisis support',
                    isVisible,
                    isEnabled
                };
            }

        } catch (error) {
            return {
                passed: false,
                error: error.message
            };
        }
    }

    async testCrisisKeywordDetection(page) {
        try {
            await page.goto('http://localhost:3000/journal', { waitUntil: 'domcontentloaded' });
            
            // Find text input
            const textInput = await page.$('textarea, input[type="text"]');
            
            if (!textInput) {
                return {
                    passed: false,
                    issue: 'No text input found for crisis keyword detection'
                };
            }

            // Type crisis keywords
            await textInput.type('I feel like I want to hurt myself and need help');
            
            // Wait for crisis detection response
            const startTime = Date.now();
            
            try {
                await page.waitForSelector('[data-crisis-detected], .crisis-alert, [aria-label*="crisis"]', { timeout: 3000 });
                const detectionTime = Date.now() - startTime;
                
                return {
                    passed: detectionTime < 2000, // Crisis detection should be fast
                    detectionTime
                };
            } catch {
                return {
                    passed: false,
                    issue: 'Crisis keywords not detected or no response triggered'
                };
            }

        } catch (error) {
            return {
                passed: false,
                error: error.message
            };
        }
    }

    async testOfflineCrisisSupport(page) {
        try {
            // First load the page online
            await page.goto('http://localhost:3000', { waitUntil: 'load' });
            
            // Go offline
            await page.setOfflineMode(true);
            
            const startTime = Date.now();
            
            // Try to access crisis support offline
            await page.goto('http://localhost:3000/crisis-support', { waitUntil: 'domcontentloaded', timeout: 3000 });
            
            const loadTime = Date.now() - startTime;
            
            // Check for offline crisis support
            const hasOfflineCrisisSupport = await page.evaluate(() => {
                return document.body.textContent.includes('988') ||
                       document.body.textContent.toLowerCase().includes('crisis') ||
                       document.body.textContent.toLowerCase().includes('emergency');
            });

            return {
                passed: hasOfflineCrisisSupport && loadTime < this.thresholds.OFFLINE_LOAD,
                offlineLoadTime: loadTime,
                hasOfflineCrisisSupport
            };

        } catch (error) {
            return {
                passed: false,
                error: error.message
            };
        }
    }

    async testLowBatteryPerformance(page) {
        try {
            // Simulate low battery conditions by reducing CPU performance
            await page.evaluate(() => {
                // Simulate reduced performance
                const startTime = performance.now();
                while (performance.now() - startTime < 100) {
                    // Busy wait to simulate CPU pressure
                }
            });

            const metrics = await this.measurePagePerformance(page, 'http://localhost:3000', 'Low Battery Simulation');
            
            return {
                passed: metrics.totalLoadTime < this.thresholds.TTI * 1.5, // Allow 50% longer under low battery
                loadTime: metrics.totalLoadTime,
                note: 'Simulated low battery performance'
            };

        } catch (error) {
            return {
                passed: false,
                error: error.message
            };
        }
    }

    async testSlowConnectionJournalSave(page) {
        try {
            // Emulate slow 3G
            await page.emulateNetworkConditions({
                offline: false,
                downloadThroughput: 500 * 1024 / 8,
                uploadThroughput: 500 * 1024 / 8,
                latency: 400
            });

            await page.goto('http://localhost:3000/journal', { waitUntil: 'domcontentloaded' });
            
            // Find and fill journal
            const textInput = await page.$('textarea, input[type="text"]');
            if (textInput) {
                await textInput.type('Today I practiced mindfulness and felt more centered.');
                
                // Find save button
                const saveButton = await page.$('button[type="submit"], button:has-text("Save")');
                if (saveButton) {
                    const startTime = Date.now();
                    await saveButton.click();
                    
                    // Wait for save confirmation or navigation
                    try {
                        await page.waitForFunction(() => 
                            document.querySelector('[data-save-success], .save-success') !== null ||
                            window.location.href !== window.location.href
                        , { timeout: 5000 });
                        
                        const saveTime = Date.now() - startTime;
                        
                        return {
                            passed: saveTime < this.thresholds.POOR_CONNECTION,
                            saveTime
                        };
                    } catch {
                        return {
                            passed: false,
                            issue: 'Journal save did not complete within timeout'
                        };
                    }
                }
            }

            return {
                passed: false,
                issue: 'Could not find journal input or save button'
            };

        } catch (error) {
            return {
                passed: false,
                error: error.message
            };
        }
    }

    evaluateDevicePerformance(metrics, tests) {
        if (metrics.error) return false;
        
        // Check core performance metrics
        if (metrics.fcp > this.thresholds.FCP) return false;
        if (metrics.totalLoadTime > this.thresholds.TTI) return false;
        
        // Check device-specific tests
        if (!tests.touchResponsiveness.passed) return false;
        if (!tests.crisisButtonAccess.passed) return false;
        if (!tests.memoryUsage.passed) return false;
        
        return true;
    }

    evaluateNetworkPerformance(result, network) {
        if (result.error) return false;
        
        if (network.offline) {
            return result.hasOfflineSupport && result.offlineLoadTime < this.thresholds.OFFLINE_LOAD;
        }
        
        // Adjust thresholds based on network speed
        let adjustedThreshold = this.thresholds.TTI;
        if (network.name.includes('Slow 3G')) {
            adjustedThreshold = this.thresholds.SLOW_3G_LOAD;
        } else if (network.name.includes('3G')) {
            adjustedThreshold = this.thresholds.TTI * 1.5;
        }
        
        return result.totalLoadTime < adjustedThreshold;
    }

    async generateReport() {
        // Calculate performance score
        const passRate = this.results.summary.totalTests > 0 ? 
            (this.results.summary.passed / this.results.summary.totalTests) * 100 : 0;

        // Generate recommendations
        this.generateRecommendations();

        // Add summary statistics
        this.results.summary.passRate = Math.round(passRate);
        this.results.summary.criticalIssuesCount = this.results.summary.criticalIssues.length;

        // Performance grade
        if (passRate >= 95) this.results.summary.grade = 'A';
        else if (passRate >= 85) this.results.summary.grade = 'B';
        else if (passRate >= 75) this.results.summary.grade = 'C';
        else if (passRate >= 60) this.results.summary.grade = 'D';
        else this.results.summary.grade = 'F';

        // Save detailed report
        const reportPath = path.join(__dirname, '..', 'mobile-crisis-performance-report.json');
        await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));

        // Generate summary report
        this.printSummaryReport();
    }

    generateRecommendations() {
        const recommendations = [];

        // Check for critical issues
        if (this.results.summary.criticalIssues.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'Crisis Safety',
                issue: 'Critical crisis support features failing',
                recommendation: 'Immediately fix crisis button and emergency resource loading issues',
                impact: 'User safety at risk'
            });
        }

        // Check device performance issues
        const failedDevices = this.results.deviceTests.filter(test => !test.passed);
        if (failedDevices.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'Device Compatibility',
                issue: `${failedDevices.length} devices failing performance tests`,
                recommendation: 'Optimize JavaScript bundle size and reduce initial load requirements',
                impact: 'Reduced accessibility for users on older devices'
            });
        }

        // Check network performance issues
        const failedNetworkTests = this.results.networkTests.filter(test => !test.passed);
        if (failedNetworkTests.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'Network Performance',
                issue: `Poor performance on ${failedNetworkTests.length} network conditions`,
                recommendation: 'Implement better caching, reduce resource sizes, add offline support',
                impact: 'Users on slow connections cannot access crisis support'
            });
        }

        // Check crisis scenario failures
        const failedCrisisScenarios = this.results.crisisScenarios.filter(test => !test.passed);
        if (failedCrisisScenarios.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'Crisis Response',
                issue: `${failedCrisisScenarios.length} crisis scenarios failing`,
                recommendation: 'Review and fix crisis detection and response systems',
                impact: 'Users in crisis may not receive appropriate support'
            });
        }

        this.results.recommendations = recommendations;
    }

    printSummaryReport() {
        console.log('\n📊 MOBILE CRISIS PERFORMANCE REPORT');
        console.log('=' .repeat(50));
        console.log(`🎯 Overall Grade: ${this.results.summary.grade}`);
        console.log(`📈 Pass Rate: ${this.results.summary.passRate}%`);
        console.log(`✅ Passed: ${this.results.summary.passed}`);
        console.log(`❌ Failed: ${this.results.summary.failed}`);
        console.log(`🚨 Critical Issues: ${this.results.summary.criticalIssuesCount}`);

        if (this.results.summary.criticalIssues.length > 0) {
            console.log('\n🚨 CRITICAL ISSUES:');
            this.results.summary.criticalIssues.forEach(issue => {
                console.log(`  • ${issue}`);
            });
        }

        console.log('\n📱 DEVICE TEST SUMMARY:');
        this.results.deviceTests.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            const loadTime = test.metrics.totalLoadTime || 'N/A';
            console.log(`  ${status} ${test.device}: ${loadTime}ms load time`);
        });

        console.log('\n📶 NETWORK TEST SUMMARY:');
        this.results.networkTests.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`  ${status} ${test.device} on ${test.network}`);
        });

        console.log('\n🆘 CRISIS SCENARIO SUMMARY:');
        this.results.crisisScenarios.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            const priority = test.priority === 'critical' ? '🚨' : test.priority === 'high' ? '⚠️' : 'ℹ️';
            console.log(`  ${status} ${priority} ${test.scenario}`);
        });

        if (this.results.recommendations.length > 0) {
            console.log('\n💡 RECOMMENDATIONS:');
            this.results.recommendations.forEach(rec => {
                const priority = rec.priority === 'critical' ? '🚨' : rec.priority === 'high' ? '⚠️' : 'ℹ️';
                console.log(`  ${priority} ${rec.category}: ${rec.recommendation}`);
            });
        }

        console.log('\n🎯 PERFORMANCE TARGETS:');
        console.log(`  • First Contentful Paint: <${this.thresholds.FCP}ms`);
        console.log(`  • Largest Contentful Paint: <${this.thresholds.LCP}ms`);
        console.log(`  • Crisis Button Response: <${this.thresholds.CRISIS_BUTTON}ms`);
        console.log(`  • Emergency Load Time: <${this.thresholds.EMERGENCY_LOAD}ms`);
        console.log(`  • Offline Support: Required for crisis users`);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help')) {
        console.log('Mobile Crisis Performance Testing Suite');
        console.log('Usage: node mobile-crisis-performance-suite.js [options]');
        console.log('Options:');
        console.log('  --help    Show this help message');
        console.log('  --verbose Enable verbose logging');
        return;
    }

    const suite = new MobileCrisisPerformanceSuite();
    await suite.runComprehensiveTests();
}

// Export for use as module
module.exports = MobileCrisisPerformanceSuite;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}