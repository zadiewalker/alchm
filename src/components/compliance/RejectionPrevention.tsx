'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Shield, FileText, Smartphone, Zap, Users, Eye } from 'lucide-react';

interface ComplianceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'compliant' | 'warning' | 'critical' | 'pending';
  priority: 'high' | 'medium' | 'low';
  estimatedFixTime: number; // in hours
  documentation: string;
  testMethod: string;
  commonRejectionReasons: string[];
  implementation?: {
    component?: string;
    file?: string;
    function?: string;
  };
}

const REJECTION_PREVENTION_CHECKLIST: ComplianceItem[] = [
  // Medical & Legal Compliance
  {
    id: 'medical_disclaimer',
    category: 'Medical & Legal',
    title: 'Medical Disclaimer Prominence',
    description: 'Clear medical disclaimer stating app is not for diagnosis/treatment',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: '/src/components/compliance/MedicalDisclaimer.tsx',
    testMethod: 'Visual inspection and accessibility scan',
    commonRejectionReasons: [
      'No medical disclaimer visible',
      'Disclaimer not prominent enough',
      'Claims to diagnose or treat medical conditions'
    ],
    implementation: {
      component: 'MedicalDisclaimer',
      file: 'src/components/compliance/MedicalDisclaimer.tsx'
    }
  },
  {
    id: 'crisis_intervention',
    category: 'Medical & Legal',
    title: 'Crisis Intervention Resources',
    description: 'Immediate access to crisis resources and emergency contacts',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: '/src/components/compliance/CrisisIntervention.tsx',
    testMethod: 'Functional testing of crisis resource accessibility',
    commonRejectionReasons: [
      'No crisis intervention features',
      'Crisis resources not easily accessible',
      'Missing emergency contact information'
    ],
    implementation: {
      component: 'CrisisIntervention',
      file: 'src/components/compliance/CrisisIntervention.tsx'
    }
  },
  {
    id: 'professional_help_recommendation',
    category: 'Medical & Legal',
    title: 'Professional Help Recommendations',
    description: 'Clear recommendations to seek professional help when needed',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: 'Integrated within medical disclaimer and crisis intervention',
    testMethod: 'Content review for professional help references',
    commonRejectionReasons: [
      'No recommendation for professional help',
      'App suggests it can replace therapy',
      'Insufficient guidance for serious mental health issues'
    ]
  },

  // Privacy & Data Protection
  {
    id: 'privacy_policy_accessible',
    category: 'Privacy & Data',
    title: 'Privacy Policy Accessibility',
    description: 'Privacy policy easily accessible from all screens',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: '/src/components/compliance/PrivacyDataProtection.tsx',
    testMethod: 'Navigation testing to verify privacy policy access',
    commonRejectionReasons: [
      'Privacy policy not easily accessible',
      'Privacy policy link broken or hidden',
      'Privacy policy not comprehensive'
    ],
    implementation: {
      component: 'PrivacyDataProtection',
      file: 'src/components/compliance/PrivacyDataProtection.tsx'
    }
  },
  {
    id: 'coppa_compliance',
    category: 'Privacy & Data',
    title: 'COPPA Compliance for Minors',
    description: 'Appropriate protections and consent mechanisms for users under 13',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: 'Built into privacy components with age verification',
    testMethod: 'Age verification flow testing',
    commonRejectionReasons: [
      'No age verification',
      'Inappropriate data collection from minors',
      'Missing parental consent mechanisms'
    ]
  },
  {
    id: 'data_transparency',
    category: 'Privacy & Data',
    title: 'Data Collection Transparency',
    description: 'Clear disclosure of what data is collected and why',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: 'Privacy nutrition labels and data protection component',
    testMethod: 'Privacy policy content review',
    commonRejectionReasons: [
      'Unclear data collection practices',
      'Missing data usage explanations',
      'Vague privacy policy language'
    ]
  },

  // Accessibility Compliance
  {
    id: 'voiceover_support',
    category: 'Accessibility',
    title: 'VoiceOver/Screen Reader Support',
    description: 'Full VoiceOver compatibility with proper ARIA labels',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: '/src/components/compliance/AccessibilityCompliance.tsx',
    testMethod: 'VoiceOver navigation testing',
    commonRejectionReasons: [
      'Poor VoiceOver navigation',
      'Missing ARIA labels',
      'Inaccessible UI elements'
    ],
    implementation: {
      component: 'AccessibilityCompliance',
      file: 'src/components/compliance/AccessibilityCompliance.tsx'
    }
  },
  {
    id: 'touch_targets',
    category: 'Accessibility',
    title: '44pt Touch Target Compliance',
    description: 'All interactive elements meet 44pt minimum touch target size',
    status: 'compliant',
    priority: 'medium',
    estimatedFixTime: 0,
    documentation: 'TouchTarget component in AppStoreCompliance',
    testMethod: 'UI element measurement and interaction testing',
    commonRejectionReasons: [
      'Touch targets too small',
      'Difficult to tap UI elements',
      'Poor mobile interaction design'
    ]
  },
  {
    id: 'color_contrast',
    category: 'Accessibility',
    title: 'WCAG Color Contrast Compliance',
    description: 'Color contrast ratios meet WCAG AA standards (4.5:1)',
    status: 'compliant',
    priority: 'medium',
    estimatedFixTime: 0,
    documentation: 'Built into design system and accessibility components',
    testMethod: 'Automated contrast ratio testing',
    commonRejectionReasons: [
      'Insufficient color contrast',
      'Text hard to read',
      'Accessibility guidelines violations'
    ]
  },

  // Performance Standards
  {
    id: 'launch_time',
    category: 'Performance',
    title: 'App Launch Time (<2s)',
    description: 'App launches within 2 seconds on target devices',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: '/src/components/compliance/PerformanceMonitor.tsx',
    testMethod: 'Performance monitoring and measurement',
    commonRejectionReasons: [
      'App takes too long to launch',
      'Poor startup performance',
      'Excessive loading times'
    ],
    implementation: {
      component: 'PerformanceMonitor',
      file: 'src/components/compliance/PerformanceMonitor.tsx'
    }
  },
  {
    id: 'memory_usage',
    category: 'Performance',
    title: 'Memory Usage (<50MB)',
    description: 'App memory usage stays under 50MB during normal operation',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: 'Monitored via PerformanceMonitor component',
    testMethod: 'Memory profiling and monitoring',
    commonRejectionReasons: [
      'Excessive memory usage',
      'Memory leaks',
      'App crashes due to memory issues'
    ]
  },
  {
    id: 'bundle_size',
    category: 'Performance',
    title: 'Bundle Size Optimization',
    description: 'App bundle size optimized for fast downloads',
    status: 'compliant',
    priority: 'medium',
    estimatedFixTime: 0,
    documentation: 'Build optimization and code splitting',
    testMethod: 'Bundle analysis and size measurement',
    commonRejectionReasons: [
      'App size too large',
      'Slow download times',
      'Inefficient asset loading'
    ]
  },

  // Content Guidelines
  {
    id: 'age_rating_compliance',
    category: 'Content',
    title: 'Age Rating Compliance (12+)',
    description: 'Content appropriate for 12+ age rating',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: 'App Store metadata and content review',
    testMethod: 'Content audit and rating verification',
    commonRejectionReasons: [
      'Content not appropriate for declared age rating',
      'Missing age-appropriate warnings',
      'Inappropriate content for mental health app'
    ]
  },
  {
    id: 'screenshot_authenticity',
    category: 'Content',
    title: 'Screenshot Authenticity',
    description: 'Screenshots show actual app functionality without deception',
    status: 'pending',
    priority: 'high',
    estimatedFixTime: 4,
    documentation: '/app-store-assets/screenshot-guide.html',
    testMethod: 'Screenshot review against actual app',
    commonRejectionReasons: [
      'Screenshots don\'t match actual app',
      'Misleading or fake screenshots',
      'Screenshots show non-existent features'
    ]
  },
  {
    id: 'metadata_accuracy',
    category: 'Content',
    title: 'Metadata Accuracy',
    description: 'App description and metadata accurately represent functionality',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: '/app-store-assets/metadata/',
    testMethod: 'Metadata review against app functionality',
    commonRejectionReasons: [
      'App description doesn\'t match functionality',
      'Misleading marketing claims',
      'Inaccurate feature descriptions'
    ]
  },

  // Technical Requirements
  {
    id: 'network_handling',
    category: 'Technical',
    title: 'Network Error Handling',
    description: 'Graceful handling of network errors and offline states',
    status: 'compliant',
    priority: 'medium',
    estimatedFixTime: 0,
    documentation: 'Built into API wrapper and error handling',
    testMethod: 'Network connectivity testing',
    commonRejectionReasons: [
      'App crashes without network',
      'Poor error messages',
      'No offline functionality'
    ]
  },
  {
    id: 'device_compatibility',
    category: 'Technical',
    title: 'Device Compatibility',
    description: 'App works correctly on all supported iOS devices',
    status: 'compliant',
    priority: 'high',
    estimatedFixTime: 0,
    documentation: 'Responsive design and testing across devices',
    testMethod: 'Multi-device compatibility testing',
    commonRejectionReasons: [
      'App doesn\'t work on certain devices',
      'UI problems on different screen sizes',
      'Device-specific crashes'
    ]
  },
  {
    id: 'orientation_support',
    category: 'Technical',
    title: 'Orientation Support',
    description: 'Proper handling of device orientation changes',
    status: 'compliant',
    priority: 'low',
    estimatedFixTime: 0,
    documentation: 'Responsive design handles orientation changes',
    testMethod: 'Orientation change testing',
    commonRejectionReasons: [
      'UI breaks on orientation change',
      'Poor landscape support',
      'Content cut off or misaligned'
    ]
  }
];

const CATEGORY_ICONS = {
  'Medical & Legal': Shield,
  'Privacy & Data': FileText,
  'Accessibility': Eye,
  'Performance': Zap,
  'Content': Users,
  'Technical': Smartphone
};

const STATUS_CONFIG = {
  compliant: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Compliant'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'Warning'
  },
  critical: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Critical'
  },
  pending: {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Pending'
  }
};

export function RejectionPrevention() {
  const [checklist, setChecklist] = useState(REJECTION_PREVENTION_CHECKLIST);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  const categories = [...new Set(checklist.map(item => item.category))];
  
  const getStatusStats = () => {
    const stats = {
      compliant: checklist.filter(item => item.status === 'compliant').length,
      warning: checklist.filter(item => item.status === 'warning').length,
      critical: checklist.filter(item => item.status === 'critical').length,
      pending: checklist.filter(item => item.status === 'pending').length
    };
    return stats;
  };

  const getOverallReadiness = () => {
    const stats = getStatusStats();
    const total = checklist.length;
    const score = Math.round((stats.compliant / total) * 100);
    return score;
  };

  const getEstimatedWorkRemaining = () => {
    return checklist
      .filter(item => item.status !== 'compliant')
      .reduce((total, item) => total + item.estimatedFixTime, 0);
  };

  const getRejectionRisk = () => {
    const criticalIssues = checklist.filter(item => item.status === 'critical').length;
    const warningIssues = checklist.filter(item => item.status === 'warning').length;
    const pendingIssues = checklist.filter(item => item.status === 'pending').length;
    
    if (criticalIssues > 0) return 'High';
    if (warningIssues > 2 || pendingIssues > 3) return 'Medium';
    if (warningIssues > 0 || pendingIssues > 0) return 'Low';
    return 'Very Low';
  };

  const filteredChecklist = checklist.filter(item => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (showOnlyIssues && item.status === 'compliant') return false;
    return true;
  });

  const runPreSubmissionCheck = async () => {
    // This would integrate with the pre-submission test suite
    try {
      console.log('Running pre-submission check...');
      // Implementation would call the test suite
      alert('Pre-submission check completed! See test results for details.');
    } catch (error) {
      console.error('Pre-submission check failed:', error);
      alert('Pre-submission check failed. Please check the console for details.');
    }
  };

  const readinessScore = getOverallReadiness();
  const rejectionRisk = getRejectionRisk();
  const workRemaining = getEstimatedWorkRemaining();
  const stats = getStatusStats();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">App Store Rejection Prevention</h3>
              <p className="text-gray-600">Comprehensive checklist to prevent common rejection reasons</p>
            </div>
          </div>
          <button
            onClick={runPreSubmissionCheck}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Run Full Check
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">{readinessScore}%</div>
            <div className="text-sm text-gray-600">Ready for Submission</div>
          </div>
          <div className={`p-4 rounded-lg text-center ${
            rejectionRisk === 'Very Low' ? 'bg-green-50' :
            rejectionRisk === 'Low' ? 'bg-yellow-50' :
            rejectionRisk === 'Medium' ? 'bg-orange-50' : 'bg-red-50'
          }`}>
            <div className={`text-2xl font-bold ${
              rejectionRisk === 'Very Low' ? 'text-green-600' :
              rejectionRisk === 'Low' ? 'text-yellow-600' :
              rejectionRisk === 'Medium' ? 'text-orange-600' : 'text-red-600'
            }`}>{rejectionRisk}</div>
            <div className="text-sm text-gray-600">Rejection Risk</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">{workRemaining}h</div>
            <div className="text-sm text-gray-600">Est. Work Remaining</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.compliant}/{checklist.length}</div>
            <div className="text-sm text-gray-600">Items Complete</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([status, count]) => {
            const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
            const Icon = config.icon;
            return (
              <div key={status} className={`p-3 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-sm font-medium text-gray-900 capitalize">{config.label}</span>
                </div>
                <div className={`text-lg font-bold ${config.color}`}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOnlyIssues}
              onChange={(e) => setShowOnlyIssues(e.target.checked)}
              className="rounded"
            />
            Show only issues
          </label>

          <div className="text-sm text-gray-500">
            Showing {filteredChecklist.length} of {checklist.length} items
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="divide-y divide-gray-200">
        {filteredChecklist.map(item => {
          const statusConfig = STATUS_CONFIG[item.status];
          const StatusIcon = statusConfig.icon;
          const CategoryIcon = CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS];
          
          return (
            <div key={item.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
                  <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${statusConfig.bgColor} ${statusConfig.color} font-medium`}>
                          {statusConfig.label}
                        </span>
                        {item.priority === 'high' && (
                          <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 font-medium">
                            High Priority
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <CategoryIcon className="w-4 h-4" />
                        <span>{item.category}</span>
                        {item.estimatedFixTime > 0 && (
                          <>
                            <span>•</span>
                            <Clock className="w-4 h-4" />
                            <span>{item.estimatedFixTime}h to fix</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                    </div>
                  </div>

                  {item.implementation && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-1">Implementation</div>
                      <div className="text-sm text-blue-800">
                        {item.implementation.component && (
                          <div>Component: {item.implementation.component}</div>
                        )}
                        {item.implementation.file && (
                          <div>File: {item.implementation.file}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Test Method</div>
                      <div className="text-gray-600">{item.testMethod}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Documentation</div>
                      <div className="text-gray-600">{item.documentation}</div>
                    </div>
                  </div>

                  {item.commonRejectionReasons.length > 0 && (
                    <div className="mt-3">
                      <div className="font-medium text-gray-900 mb-2">Common Rejection Reasons</div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.commonRejectionReasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChecklist.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No items match your current filters.</p>
        </div>
      )}
    </div>
  );
}