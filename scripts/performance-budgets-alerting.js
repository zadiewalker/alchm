#!/usr/bin/env node

/**
 * PERFORMANCE BUDGETS & ALERTING SYSTEM
 * 
 * Comprehensive performance monitoring with crisis-critical alerting
 * Enforces performance budgets and provides immediate alerts for degradations
 */

const fs = require('fs').promises;
const path = require('path');

class PerformanceBudgetEnforcer {
    constructor() {
        // Crisis-optimized performance budgets
        this.budgets = {
            // Core Web Vitals - Crisis Critical Thresholds
            coreWebVitals: {
                fcp: {
                    good: 800,        // <800ms for crisis users
                    warning: 1200,    // <1.2s warning threshold
                    critical: 1800,   // >1.8s critical alert
                    unit: 'ms'
                },
                lcp: {
                    good: 1500,       // <1.5s for crisis content
                    warning: 2000,    // <2.0s warning threshold
                    critical: 2500,   // >2.5s critical alert
                    unit: 'ms'
                },
                cls: {
                    good: 0.03,       // <0.03 for trauma-informed stability
                    warning: 0.05,    // <0.05 warning threshold
                    critical: 0.1,    // >0.1 critical alert
                    unit: 'score'
                },
                fid: {
                    good: 50,         // <50ms for immediate interaction
                    warning: 100,     // <100ms warning threshold
                    critical: 300,    // >300ms critical alert
                    unit: 'ms'
                },
                tbt: {
                    good: 200,        // <200ms for mobile crisis users
                    warning: 300,     // <300ms warning threshold
                    critical: 600,    // >600ms critical alert
                    unit: 'ms'
                },
                tti: {
                    good: 2000,       // <2s for crisis interactivity
                    warning: 3000,    // <3s warning threshold
                    critical: 5000,   // >5s critical alert
                    unit: 'ms'
                },
                speedIndex: {
                    good: 2000,       // <2s for visual completeness
                    warning: 2500,    // <2.5s warning threshold
                    critical: 4000,   // >4s critical alert
                    unit: 'ms'
                }
            },

            // Resource Budgets - Mobile Crisis Optimized
            resources: {
                totalSize: {
                    good: 500000,     // <500KB total for crisis users
                    warning: 800000,  // <800KB warning threshold
                    critical: 1200000, // >1.2MB critical alert
                    unit: 'bytes'
                },
                scriptSize: {
                    good: 100000,     // <100KB JS for mobile crisis
                    warning: 150000,  // <150KB warning threshold
                    critical: 250000, // >250KB critical alert
                    unit: 'bytes'
                },
                cssSize: {
                    good: 30000,      // <30KB CSS
                    warning: 50000,   // <50KB warning threshold
                    critical: 100000, // >100KB critical alert
                    unit: 'bytes'
                },
                fontSize: {
                    good: 50000,      // <50KB fonts
                    warning: 100000,  // <100KB warning threshold
                    critical: 200000, // >200KB critical alert
                    unit: 'bytes'
                },
                imageSize: {
                    good: 200000,     // <200KB images
                    warning: 500000,  // <500KB warning threshold
                    critical: 1000000, // >1MB critical alert
                    unit: 'bytes'
                },
                requestCount: {
                    good: 30,         // <30 requests for crisis
                    warning: 50,      // <50 warning threshold
                    critical: 100,    // >100 critical alert
                    unit: 'count'
                },
                scriptCount: {
                    good: 6,          // <6 script files
                    warning: 10,      // <10 warning threshold
                    critical: 20,     // >20 critical alert
                    unit: 'count'
                },
                thirdPartyCount: {
                    good: 3,          // <3 third-party requests
                    warning: 5,       // <5 warning threshold
                    critical: 10,     // >10 critical alert
                    unit: 'count'
                }
            },

            // Crisis-Specific Budgets
            crisisSpecific: {
                crisisButtonResponse: {
                    good: 50,         // <50ms for 988 button
                    warning: 100,     // <100ms warning
                    critical: 200,    // >200ms critical
                    unit: 'ms'
                },
                emergencyResourceLoad: {
                    good: 300,        // <300ms for crisis resources
                    warning: 500,     // <500ms warning
                    critical: 1000,   // >1s critical
                    unit: 'ms'
                },
                journalSaveTime: {
                    good: 500,        // <500ms for journal saves
                    warning: 1000,    // <1s warning
                    critical: 2000,   // >2s critical
                    unit: 'ms'
                },
                offlineLoadTime: {
                    good: 100,        // <100ms for offline content
                    warning: 200,     // <200ms warning
                    critical: 500,    // >500ms critical
                    unit: 'ms'
                }
            },

            // Accessibility Performance Budgets
            accessibility: {
                colorContrast: {
                    good: 0,          // 0 failures required
                    warning: 1,       // 1 failure warning
                    critical: 3,      // >3 failures critical
                    unit: 'failures'
                },
                tapTargetSize: {
                    good: 0,          // 0 failures required
                    warning: 1,       // 1 failure warning
                    critical: 3,      // >3 failures critical
                    unit: 'failures'
                },
                ariaLabels: {
                    good: 0,          // 0 failures required
                    warning: 2,       // 2 failures warning
                    critical: 5,      // >5 failures critical
                    unit: 'failures'
                }
            }
        };

        this.alertChannels = {
            console: true,
            file: true,
            webhook: process.env.PERFORMANCE_WEBHOOK_URL || null,
            email: process.env.PERFORMANCE_EMAIL || null
        };

        this.alerts = [];
        this.budgetViolations = [];
    }

    // Main budget enforcement function
    async enforceBudgets(lighthouseReport) {
        console.log('🎯 Enforcing Performance Budgets...');
        
        const results = {
            timestamp: new Date().toISOString(),
            overallScore: 0,
            budgetViolations: [],
            alerts: [],
            recommendations: [],
            crisisReadiness: 'unknown'
        };

        try {
            // Analyze Core Web Vitals
            const coreWebVitalsResult = this.analyzeCoreWebVitals(lighthouseReport);
            results.coreWebVitals = coreWebVitalsResult;

            // Analyze Resource Budgets
            const resourceResult = this.analyzeResourceBudgets(lighthouseReport);
            results.resources = resourceResult;

            // Analyze Accessibility Performance
            const accessibilityResult = this.analyzeAccessibilityBudgets(lighthouseReport);
            results.accessibility = accessibilityResult;

            // Calculate overall performance score
            results.overallScore = this.calculateOverallScore(results);

            // Determine crisis readiness
            results.crisisReadiness = this.determineCrisisReadiness(results);

            // Generate alerts for violations
            await this.generateAlerts(results);

            // Generate optimization recommendations
            results.recommendations = this.generateRecommendations(results);

            // Save results
            await this.saveBudgetResults(results);

            // Print summary
            this.printBudgetSummary(results);

            return results;

        } catch (error) {
            console.error('❌ Error enforcing performance budgets:', error);
            await this.sendCriticalAlert('BUDGET_ENFORCEMENT_FAILED', error.message);
            throw error;
        }
    }

    analyzeCoreWebVitals(report) {
        console.log('⚡ Analyzing Core Web Vitals...');
        
        const results = {
            violations: [],
            metrics: {},
            score: 0
        };

        const vitals = {
            fcp: report.audits['first-contentful-paint']?.numericValue || 0,
            lcp: report.audits['largest-contentful-paint']?.numericValue || 0,
            cls: report.audits['cumulative-layout-shift']?.numericValue || 0,
            fid: report.audits['max-potential-fid']?.numericValue || 0,
            tbt: report.audits['total-blocking-time']?.numericValue || 0,
            tti: report.audits['interactive']?.numericValue || 0,
            speedIndex: report.audits['speed-index']?.numericValue || 0
        };

        let passedVitals = 0;
        const totalVitals = Object.keys(vitals).length;

        for (const [metric, value] of Object.entries(vitals)) {
            const budget = this.budgets.coreWebVitals[metric];
            if (!budget) continue;

            results.metrics[metric] = {
                value,
                budget,
                status: 'good'
            };

            if (value > budget.critical) {
                results.metrics[metric].status = 'critical';
                results.violations.push({
                    type: 'CORE_WEB_VITAL_CRITICAL',
                    metric,
                    value,
                    threshold: budget.critical,
                    severity: 'critical',
                    impact: 'User safety at risk - immediate action required'
                });
            } else if (value > budget.warning) {
                results.metrics[metric].status = 'warning';
                results.violations.push({
                    type: 'CORE_WEB_VITAL_WARNING',
                    metric,
                    value,
                    threshold: budget.warning,
                    severity: 'warning',
                    impact: 'Performance degradation detected'
                });
            } else if (value <= budget.good) {
                passedVitals++;
                results.metrics[metric].status = 'good';
            }
        }

        results.score = Math.round((passedVitals / totalVitals) * 100);
        
        console.log(`⚡ Core Web Vitals Score: ${results.score}% (${passedVitals}/${totalVitals} passed)`);
        
        return results;
    }

    analyzeResourceBudgets(report) {
        console.log('📦 Analyzing Resource Budgets...');
        
        const results = {
            violations: [],
            metrics: {},
            score: 0
        };

        const resourceSummary = report.audits['resource-summary']?.details?.items || [];
        const resources = {};

        // Process resource summary
        resourceSummary.forEach(item => {
            switch (item.resourceType) {
                case 'total':
                    resources.totalSize = item.transferSize;
                    resources.requestCount = item.requestCount;
                    break;
                case 'script':
                    resources.scriptSize = item.transferSize;
                    resources.scriptCount = item.requestCount;
                    break;
                case 'stylesheet':
                    resources.cssSize = item.transferSize;
                    break;
                case 'font':
                    resources.fontSize = item.transferSize;
                    break;
                case 'image':
                    resources.imageSize = item.transferSize;
                    break;
                case 'third-party':
                    resources.thirdPartyCount = item.requestCount;
                    break;
            }
        });

        let passedBudgets = 0;
        const totalBudgets = Object.keys(this.budgets.resources).length;

        for (const [metric, value] of Object.entries(resources)) {
            const budget = this.budgets.resources[metric];
            if (!budget || value === undefined) continue;

            results.metrics[metric] = {
                value,
                budget,
                status: 'good'
            };

            if (value > budget.critical) {
                results.metrics[metric].status = 'critical';
                results.violations.push({
                    type: 'RESOURCE_BUDGET_CRITICAL',
                    metric,
                    value,
                    threshold: budget.critical,
                    severity: 'critical',
                    impact: 'Excessive resource usage impacting crisis users'
                });
            } else if (value > budget.warning) {
                results.metrics[metric].status = 'warning';
                results.violations.push({
                    type: 'RESOURCE_BUDGET_WARNING',
                    metric,
                    value,
                    threshold: budget.warning,
                    severity: 'warning',
                    impact: 'Resource budget exceeded'
                });
            } else if (value <= budget.good) {
                passedBudgets++;
                results.metrics[metric].status = 'good';
            }
        }

        results.score = Math.round((passedBudgets / totalBudgets) * 100);
        
        console.log(`📦 Resource Budget Score: ${results.score}% (${passedBudgets}/${totalBudgets} passed)`);
        
        return results;
    }

    analyzeAccessibilityBudgets(report) {
        console.log('♿ Analyzing Accessibility Performance...');
        
        const results = {
            violations: [],
            metrics: {},
            score: 0
        };

        // Check color contrast
        const colorContrastAudit = report.audits['color-contrast'];
        const colorContrastFailures = colorContrastAudit?.details?.items?.length || 0;

        // Check tap targets
        const tapTargetsAudit = report.audits['tap-targets'];
        const tapTargetFailures = tapTargetsAudit?.details?.items?.length || 0;

        // Check ARIA labels
        const ariaLabelsAudit = report.audits['aria-required-attr'];
        const ariaFailures = ariaLabelsAudit?.details?.items?.length || 0;

        const accessibilityMetrics = {
            colorContrast: colorContrastFailures,
            tapTargetSize: tapTargetFailures,
            ariaLabels: ariaFailures
        };

        let passedA11y = 0;
        const totalA11y = Object.keys(accessibilityMetrics).length;

        for (const [metric, value] of Object.entries(accessibilityMetrics)) {
            const budget = this.budgets.accessibility[metric];
            if (!budget) continue;

            results.metrics[metric] = {
                value,
                budget,
                status: 'good'
            };

            if (value > budget.critical) {
                results.metrics[metric].status = 'critical';
                results.violations.push({
                    type: 'ACCESSIBILITY_CRITICAL',
                    metric,
                    value,
                    threshold: budget.critical,
                    severity: 'critical',
                    impact: 'Critical accessibility issues blocking crisis users'
                });
            } else if (value > budget.warning) {
                results.metrics[metric].status = 'warning';
                results.violations.push({
                    type: 'ACCESSIBILITY_WARNING',
                    metric,
                    value,
                    threshold: budget.warning,
                    severity: 'warning',
                    impact: 'Accessibility issues may impact users with disabilities'
                });
            } else if (value <= budget.good) {
                passedA11y++;
                results.metrics[metric].status = 'good';
            }
        }

        results.score = Math.round((passedA11y / totalA11y) * 100);
        
        console.log(`♿ Accessibility Score: ${results.score}% (${passedA11y}/${totalA11y} passed)`);
        
        return results;
    }

    calculateOverallScore(results) {
        // Weighted scoring for crisis readiness
        const weights = {
            coreWebVitals: 0.4,  // 40% - Most critical for user experience
            resources: 0.3,      // 30% - Critical for mobile/slow connections
            accessibility: 0.3   // 30% - Critical for inclusive crisis support
        };

        let weightedScore = 0;
        weightedScore += (results.coreWebVitals?.score || 0) * weights.coreWebVitals;
        weightedScore += (results.resources?.score || 0) * weights.resources;
        weightedScore += (results.accessibility?.score || 0) * weights.accessibility;

        return Math.round(weightedScore);
    }

    determineCrisisReadiness(results) {
        const score = results.overallScore;
        const criticalViolations = results.coreWebVitals?.violations?.filter(v => v.severity === 'critical').length || 0;
        const accessibilityCritical = results.accessibility?.violations?.filter(v => v.severity === 'critical').length || 0;

        if (criticalViolations > 0 || accessibilityCritical > 0) {
            return 'NOT_READY'; // Critical issues block crisis users
        } else if (score >= 90) {
            return 'EXCELLENT'; // Ready for crisis users
        } else if (score >= 75) {
            return 'GOOD';      // Acceptable for crisis users
        } else if (score >= 60) {
            return 'FAIR';      // Needs improvement
        } else {
            return 'POOR';      // Major performance issues
        }
    }

    async generateAlerts(results) {
        console.log('🚨 Generating Performance Alerts...');

        const allViolations = [
            ...(results.coreWebVitals?.violations || []),
            ...(results.resources?.violations || []),
            ...(results.accessibility?.violations || [])
        ];

        // Critical alerts
        const criticalViolations = allViolations.filter(v => v.severity === 'critical');
        if (criticalViolations.length > 0) {
            await this.sendCriticalAlert('PERFORMANCE_CRITICAL_VIOLATIONS', {
                count: criticalViolations.length,
                violations: criticalViolations,
                crisisReadiness: results.crisisReadiness,
                score: results.overallScore
            });
        }

        // Warning alerts
        const warningViolations = allViolations.filter(v => v.severity === 'warning');
        if (warningViolations.length > 0) {
            await this.sendWarningAlert('PERFORMANCE_WARNING_VIOLATIONS', {
                count: warningViolations.length,
                violations: warningViolations,
                score: results.overallScore
            });
        }

        // Crisis readiness alert
        if (results.crisisReadiness === 'NOT_READY') {
            await this.sendCriticalAlert('CRISIS_READINESS_FAILED', {
                reason: 'Critical performance issues detected',
                score: results.overallScore,
                violations: criticalViolations
            });
        }

        results.alerts = {
            critical: criticalViolations.length,
            warning: warningViolations.length,
            total: allViolations.length
        };
    }

    generateRecommendations(results) {
        const recommendations = [];

        // Core Web Vitals recommendations
        if (results.coreWebVitals?.violations?.length > 0) {
            results.coreWebVitals.violations.forEach(violation => {
                switch (violation.metric) {
                    case 'fcp':
                        recommendations.push({
                            priority: violation.severity,
                            category: 'Core Web Vitals',
                            issue: `First Contentful Paint too slow: ${Math.round(violation.value)}ms`,
                            recommendation: 'Optimize critical rendering path, reduce render-blocking resources',
                            expectedImprovement: '30-50% FCP improvement'
                        });
                        break;
                    case 'lcp':
                        recommendations.push({
                            priority: violation.severity,
                            category: 'Core Web Vitals',
                            issue: `Largest Contentful Paint too slow: ${Math.round(violation.value)}ms`,
                            recommendation: 'Optimize images, preload LCP element, reduce server response time',
                            expectedImprovement: '25-40% LCP improvement'
                        });
                        break;
                    case 'cls':
                        recommendations.push({
                            priority: violation.severity,
                            category: 'Core Web Vitals',
                            issue: `Cumulative Layout Shift too high: ${violation.value.toFixed(3)}`,
                            recommendation: 'Add explicit dimensions to images, reserve space for ads, use CSS transforms',
                            expectedImprovement: 'Eliminate layout shifts'
                        });
                        break;
                    case 'tbt':
                        recommendations.push({
                            priority: violation.severity,
                            category: 'Core Web Vitals',
                            issue: `Total Blocking Time too high: ${Math.round(violation.value)}ms`,
                            recommendation: 'Code split JavaScript, defer non-critical code, optimize third-party scripts',
                            expectedImprovement: '40-60% TBT reduction'
                        });
                        break;
                }
            });
        }

        // Resource budget recommendations
        if (results.resources?.violations?.length > 0) {
            results.resources.violations.forEach(violation => {
                switch (violation.metric) {
                    case 'totalSize':
                        recommendations.push({
                            priority: violation.severity,
                            category: 'Resource Optimization',
                            issue: `Total page size too large: ${Math.round(violation.value / 1024)}KB`,
                            recommendation: 'Implement compression, optimize images, remove unused code',
                            expectedImprovement: '30-50% size reduction'
                        });
                        break;
                    case 'scriptSize':
                        recommendations.push({
                            priority: violation.severity,
                            category: 'JavaScript Optimization',
                            issue: `JavaScript bundle too large: ${Math.round(violation.value / 1024)}KB`,
                            recommendation: 'Code splitting, tree shaking, dynamic imports for crisis features',
                            expectedImprovement: '40-60% JS size reduction'
                        });
                        break;
                    case 'requestCount':
                        recommendations.push({
                            priority: violation.severity,
                            category: 'Network Optimization',
                            issue: `Too many requests: ${violation.value}`,
                            recommendation: 'Bundle resources, implement HTTP/2 push, use service worker caching',
                            expectedImprovement: '50% request reduction'
                        });
                        break;
                }
            });
        }

        // Accessibility recommendations
        if (results.accessibility?.violations?.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'Crisis Accessibility',
                issue: 'Accessibility failures detected',
                recommendation: 'Fix color contrast, ensure proper tap targets, add ARIA labels for crisis features',
                expectedImprovement: 'Full accessibility compliance'
            });
        }

        // Crisis-specific recommendations
        if (results.crisisReadiness !== 'EXCELLENT') {
            recommendations.push({
                priority: 'critical',
                category: 'Crisis Readiness',
                issue: 'Performance not optimized for crisis users',
                recommendation: 'Implement crisis-mode performance optimizations, prioritize 988 button loading',
                expectedImprovement: 'Crisis-ready performance'
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { critical: 0, warning: 1, info: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    async sendCriticalAlert(type, data) {
        const alert = {
            type,
            severity: 'critical',
            timestamp: new Date().toISOString(),
            data
        };

        console.error(`🚨 CRITICAL ALERT: ${type}`);
        console.error(JSON.stringify(data, null, 2));

        // Save to alerts array
        this.alerts.push(alert);

        // Send to webhook if configured
        if (this.alertChannels.webhook) {
            try {
                const fetch = require('node-fetch');
                await fetch(this.alertChannels.webhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alert)
                });
            } catch (error) {
                console.warn('Failed to send webhook alert:', error.message);
            }
        }

        // Log to file
        if (this.alertChannels.file) {
            try {
                const alertFile = path.join(__dirname, '..', 'performance-alerts.log');
                await fs.appendFile(alertFile, JSON.stringify(alert) + '\n');
            } catch (error) {
                console.warn('Failed to log alert to file:', error.message);
            }
        }
    }

    async sendWarningAlert(type, data) {
        const alert = {
            type,
            severity: 'warning',
            timestamp: new Date().toISOString(),
            data
        };

        console.warn(`⚠️ WARNING ALERT: ${type}`);
        
        this.alerts.push(alert);
        
        // Log warnings to file
        if (this.alertChannels.file) {
            try {
                const alertFile = path.join(__dirname, '..', 'performance-alerts.log');
                await fs.appendFile(alertFile, JSON.stringify(alert) + '\n');
            } catch (error) {
                console.warn('Failed to log warning to file:', error.message);
            }
        }
    }

    async saveBudgetResults(results) {
        try {
            const reportPath = path.join(__dirname, '..', 'performance-budget-report.json');
            await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
            console.log(`📊 Budget report saved: ${reportPath}`);
        } catch (error) {
            console.error('Failed to save budget results:', error);
        }
    }

    printBudgetSummary(results) {
        console.log('\n🎯 PERFORMANCE BUDGET ENFORCEMENT SUMMARY');
        console.log('=' .repeat(60));
        console.log(`📊 Overall Score: ${results.overallScore}/100`);
        console.log(`🆘 Crisis Readiness: ${results.crisisReadiness}`);
        console.log(`🚨 Critical Alerts: ${results.alerts?.critical || 0}`);
        console.log(`⚠️ Warning Alerts: ${results.alerts?.warning || 0}`);

        // Core Web Vitals Summary
        console.log('\n⚡ CORE WEB VITALS:');
        if (results.coreWebVitals?.metrics) {
            Object.entries(results.coreWebVitals.metrics).forEach(([metric, data]) => {
                const status = data.status === 'good' ? '✅' : data.status === 'warning' ? '⚠️' : '❌';
                const value = metric === 'cls' ? data.value.toFixed(3) : Math.round(data.value);
                const unit = data.budget.unit;
                console.log(`  ${status} ${metric.toUpperCase()}: ${value}${unit} (target: <${data.budget.good}${unit})`);
            });
        }

        // Resource Budget Summary
        console.log('\n📦 RESOURCE BUDGETS:');
        if (results.resources?.metrics) {
            Object.entries(results.resources.metrics).forEach(([metric, data]) => {
                const status = data.status === 'good' ? '✅' : data.status === 'warning' ? '⚠️' : '❌';
                const value = data.budget.unit === 'bytes' ? 
                    Math.round(data.value / 1024) + 'KB' : 
                    data.value + data.budget.unit;
                const target = data.budget.unit === 'bytes' ? 
                    Math.round(data.budget.good / 1024) + 'KB' : 
                    data.budget.good + data.budget.unit;
                console.log(`  ${status} ${metric}: ${value} (target: <${target})`);
            });
        }

        // Top Recommendations
        console.log('\n💡 TOP RECOMMENDATIONS:');
        const topRecs = results.recommendations?.slice(0, 5) || [];
        topRecs.forEach((rec, index) => {
            const priority = rec.priority === 'critical' ? '🚨' : rec.priority === 'warning' ? '⚠️' : 'ℹ️';
            console.log(`  ${index + 1}. ${priority} ${rec.issue}`);
            console.log(`     → ${rec.recommendation}`);
            console.log(`     → Expected: ${rec.expectedImprovement}`);
        });

        // Crisis Readiness Assessment
        console.log('\n🆘 CRISIS READINESS ASSESSMENT:');
        switch (results.crisisReadiness) {
            case 'EXCELLENT':
                console.log('  ✅ READY - Performance optimized for crisis users');
                break;
            case 'GOOD':
                console.log('  ✅ READY - Good performance for crisis scenarios');
                break;
            case 'FAIR':
                console.log('  ⚠️ NEEDS IMPROVEMENT - Some performance issues detected');
                break;
            case 'POOR':
                console.log('  ❌ NOT READY - Major performance issues require immediate attention');
                break;
            case 'NOT_READY':
                console.log('  🚨 CRITICAL - Performance issues blocking crisis users');
                break;
        }

        console.log('\n📋 Report Details: performance-budget-report.json');
    }

    // Utility method for running budget enforcement on Lighthouse report
    static async enforceFromLighthouseReport(reportPath) {
        try {
            const reportData = await fs.readFile(reportPath, 'utf8');
            const report = JSON.parse(reportData);
            
            const enforcer = new PerformanceBudgetEnforcer();
            return await enforcer.enforceBudgets(report);
        } catch (error) {
            console.error('Failed to enforce budgets from Lighthouse report:', error);
            throw error;
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help')) {
        console.log('Performance Budgets & Alerting System');
        console.log('Usage: node performance-budgets-alerting.js [lighthouse-report.json]');
        console.log('Options:');
        console.log('  --help    Show this help message');
        console.log('  --webhook URL  Set webhook URL for alerts');
        return;
    }

    const reportPath = args[0] || './lighthouse-report.json';
    
    if (!await fs.access(reportPath).then(() => true).catch(() => false)) {
        console.error(`❌ Lighthouse report not found: ${reportPath}`);
        console.log('Run: npx lighthouse http://localhost:3000 --output=json --output-path=lighthouse-report.json');
        process.exit(1);
    }

    try {
        console.log(`🎯 Enforcing performance budgets from: ${reportPath}`);
        const results = await PerformanceBudgetEnforcer.enforceFromLighthouseReport(reportPath);
        
        // Exit with error code if critical issues found
        if (results.crisisReadiness === 'NOT_READY' || results.alerts?.critical > 0) {
            console.log('\n❌ PERFORMANCE BUDGET ENFORCEMENT FAILED');
            process.exit(1);
        } else {
            console.log('\n✅ PERFORMANCE BUDGETS ENFORCED SUCCESSFULLY');
            process.exit(0);
        }
    } catch (error) {
        console.error('❌ Budget enforcement failed:', error);
        process.exit(1);
    }
}

// Export for use as module
module.exports = PerformanceBudgetEnforcer;

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}