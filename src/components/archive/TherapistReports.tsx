'use client';

import React, { useMemo, useState } from 'react';
import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  Heart, 
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Brain,
  Activity,
  Settings,
  Lock,
  Unlock,
  Share2,
  Printer
} from 'lucide-react';

interface TherapistReport {
  id: string;
  title: string;
  description: string;
  reportType: 'progress' | 'clinical' | 'outcome' | 'crisis' | 'growth';
  generatedAt: Date;
  periodCovered: {
    start: Date;
    end: Date;
  };
  sections: ReportSection[];
  privacyLevel: 'full' | 'summary' | 'anonymized';
  consentRequired: boolean;
  isGenerated: boolean;
}

interface ReportSection {
  title: string;
  type: 'summary' | 'chart' | 'timeline' | 'insights' | 'recommendations';
  content: any;
  confidential: boolean;
}

interface TherapistReportsProps {
  entries: JournalEntry[];
}

interface ConsentSettings {
  shareProgressReports: boolean;
  includeMoodData: boolean;
  includeContentSummaries: boolean;
  includeBreakthroughs: boolean;
  anonymizeData: boolean;
  autoGenerate: boolean;
}

export function TherapistReports({ entries }: TherapistReportsProps) {
  const [selectedReport, setSelectedReport] = useState<TherapistReport | null>(null);
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    shareProgressReports: false,
    includeMoodData: false,
    includeContentSummaries: false,
    includeBreakthroughs: false,
    anonymizeData: true,
    autoGenerate: false
  });
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);

  // Generate comprehensive reports based on journal entries
  const availableReports = useMemo(() => {
    if (!entries.length) return [];

    const now = new Date();
    const sortedEntries = [...entries].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const earliestEntry = new Date(sortedEntries[0].createdAt);
    const latestEntry = new Date(sortedEntries[sortedEntries.length - 1].createdAt);

    const reports: TherapistReport[] = [];

    // Progress Summary Report
    const progressSummary = generateProgressSummary(entries);
    reports.push({
      id: 'progress-summary',
      title: 'Progress Summary Report',
      description: 'Comprehensive overview of emotional and behavioral patterns over time',
      reportType: 'progress',
      generatedAt: now,
      periodCovered: { start: earliestEntry, end: latestEntry },
      sections: [
        {
          title: 'Executive Summary',
          type: 'summary',
          content: progressSummary.executive,
          confidential: false
        },
        {
          title: 'Mood Trends',
          type: 'chart',
          content: progressSummary.moodTrends,
          confidential: false
        },
        {
          title: 'Key Insights',
          type: 'insights',
          content: progressSummary.insights,
          confidential: true
        },
        {
          title: 'Therapeutic Recommendations',
          type: 'recommendations',
          content: progressSummary.recommendations,
          confidential: true
        }
      ],
      privacyLevel: 'summary',
      consentRequired: true,
      isGenerated: true
    });

    // Clinical Assessment Report
    const clinicalAssessment = generateClinicalAssessment(entries);
    reports.push({
      id: 'clinical-assessment',
      title: 'Clinical Assessment Overview',
      description: 'Professional assessment of emotional patterns and therapeutic progress',
      reportType: 'clinical',
      generatedAt: now,
      periodCovered: { start: earliestEntry, end: latestEntry },
      sections: [
        {
          title: 'Assessment Summary',
          type: 'summary',
          content: clinicalAssessment.summary,
          confidential: true
        },
        {
          title: 'Risk Factors',
          type: 'insights',
          content: clinicalAssessment.riskFactors,
          confidential: true
        },
        {
          title: 'Protective Factors',
          type: 'insights',
          content: clinicalAssessment.protectiveFactors,
          confidential: true
        },
        {
          title: 'Treatment Recommendations',
          type: 'recommendations',
          content: clinicalAssessment.treatment,
          confidential: true
        }
      ],
      privacyLevel: 'full',
      consentRequired: true,
      isGenerated: true
    });

    // Outcome Measurement Report
    const outcomeMeasurement = generateOutcomeMeasurement(entries);
    reports.push({
      id: 'outcome-measurement',
      title: 'Outcome Measurement Report',
      description: 'Quantitative assessment of therapeutic outcomes and progress metrics',
      reportType: 'outcome',
      generatedAt: now,
      periodCovered: { start: earliestEntry, end: latestEntry },
      sections: [
        {
          title: 'Outcome Metrics',
          type: 'chart',
          content: outcomeMeasurement.metrics,
          confidential: false
        },
        {
          title: 'Progress Indicators',
          type: 'summary',
          content: outcomeMeasurement.indicators,
          confidential: false
        },
        {
          title: 'Goal Achievement',
          type: 'insights',
          content: outcomeMeasurement.goals,
          confidential: true
        }
      ],
      privacyLevel: 'summary',
      consentRequired: false,
      isGenerated: true
    });

    // Crisis Assessment Report (if applicable)
    const crisisIndicators = entries.filter(entry => 
      entry.mood === 'negative' || 
      entry.content.toLowerCase().includes('crisis') ||
      entry.content.toLowerCase().includes('emergency')
    );

    if (crisisIndicators.length > 0) {
      const crisisAssessment = generateCrisisAssessment(crisisIndicators);
      reports.push({
        id: 'crisis-assessment',
        title: 'Crisis Safety Assessment',
        description: 'Assessment of crisis indicators and safety planning recommendations',
        reportType: 'crisis',
        generatedAt: now,
        periodCovered: { start: earliestEntry, end: latestEntry },
        sections: [
          {
            title: 'Crisis Indicators',
            type: 'insights',
            content: crisisAssessment.indicators,
            confidential: true
          },
          {
            title: 'Safety Recommendations',
            type: 'recommendations',
            content: crisisAssessment.safety,
            confidential: true
          },
          {
            title: 'Support Resources',
            type: 'summary',
            content: crisisAssessment.resources,
            confidential: false
          }
        ],
        privacyLevel: 'full',
        consentRequired: true,
        isGenerated: true
      });
    }

    // Growth and Development Report
    const growthAssessment = generateGrowthAssessment(entries);
    reports.push({
      id: 'growth-development',
      title: 'Growth & Development Report',
      description: 'Assessment of personal growth, resilience building, and developmental progress',
      reportType: 'growth',
      generatedAt: now,
      periodCovered: { start: earliestEntry, end: latestEntry },
      sections: [
        {
          title: 'Growth Patterns',
          type: 'timeline',
          content: growthAssessment.patterns,
          confidential: false
        },
        {
          title: 'Resilience Factors',
          type: 'insights',
          content: growthAssessment.resilience,
          confidential: true
        },
        {
          title: 'Development Goals',
          type: 'recommendations',
          content: growthAssessment.goals,
          confidential: true
        }
      ],
      privacyLevel: 'summary',
      consentRequired: true,
      isGenerated: true
    });

    return reports;
  }, [entries]);

  // Report generation functions
  function generateProgressSummary(entries: JournalEntry[]) {
    const moodDistribution = entries.reduce((acc, entry) => {
      const mood = entry.mood || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalWords = entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
    const averageWords = Math.round(totalWords / entries.length);

    return {
      executive: {
        totalEntries: entries.length,
        averageWords,
        writingConsistency: entries.length > 20 ? 'High' : entries.length > 10 ? 'Moderate' : 'Building',
        emotionalRange: Object.keys(moodDistribution).length,
        overallTrend: moodDistribution.positive > moodDistribution.negative ? 'Positive' : 'Processing'
      },
      moodTrends: Object.entries(moodDistribution).map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / entries.length) * 100)
      })),
      insights: [
        'Consistent engagement with self-reflection practice',
        'Developing emotional vocabulary and awareness',
        'Processing experiences through written expression',
        'Building therapeutic writing habits'
      ],
      recommendations: [
        'Continue regular journaling practice',
        'Explore specific themes that emerge frequently',
        'Consider themed writing prompts for deeper exploration',
        'Maintain focus on emotional processing and growth'
      ]
    };
  }

  function generateClinicalAssessment(entries: JournalEntry[]) {
    const negativeEntries = entries.filter(e => e.mood === 'negative');
    const positiveEntries = entries.filter(e => e.mood === 'positive');
    
    return {
      summary: {
        engagementLevel: 'Active and consistent',
        emotionalProcessing: 'Appropriate depth and reflection',
        copingStrategies: 'Developing through writing practice',
        riskLevel: negativeEntries.length > entries.length * 0.6 ? 'Elevated' : 'Manageable'
      },
      riskFactors: [
        'Extended periods of challenging emotions (if applicable)',
        'Isolation themes in writing',
        'Recurring negative thought patterns'
      ].filter(factor => 
        negativeEntries.length > 3 || 
        entries.some(e => e.content.toLowerCase().includes('alone')) ||
        entries.some(e => e.content.toLowerCase().includes('always'))
      ),
      protectiveFactors: [
        'Regular self-reflection practice',
        'Written emotional expression',
        'Awareness of emotional patterns',
        'Commitment to personal growth'
      ],
      treatment: [
        'Continue therapeutic journaling practice',
        'Explore cognitive behavioral techniques',
        'Consider mindfulness-based interventions',
        'Regular check-ins on emotional patterns'
      ]
    };
  }

  function generateOutcomeMeasurement(entries: JournalEntry[]) {
    const recentEntries = entries.slice(-10);
    const earlierEntries = entries.slice(0, 10);
    
    const recentPositive = recentEntries.filter(e => e.mood === 'positive').length;
    const earlierPositive = earlierEntries.filter(e => e.mood === 'positive').length;
    
    return {
      metrics: {
        writingFrequency: entries.length,
        emotionalStability: recentPositive / recentEntries.length,
        progressTrend: recentPositive > earlierPositive ? 'Improving' : 'Stable',
        engagementQuality: recentEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0) / recentEntries.length
      },
      indicators: [
        'Increased emotional vocabulary',
        'Greater self-awareness',
        'Improved emotional regulation',
        'Enhanced coping strategies'
      ],
      goals: [
        'Maintain regular writing practice',
        'Develop specific coping strategies',
        'Build emotional resilience',
        'Strengthen self-awareness skills'
      ]
    };
  }

  function generateCrisisAssessment(crisisEntries: JournalEntry[]) {
    return {
      indicators: [
        'Expressions of emotional distress',
        'References to challenging life events',
        'Seeking support and understanding',
        'Active coping through writing'
      ],
      safety: [
        'Continue regular therapeutic support',
        'Maintain safety plan if applicable',
        'Use crisis resources when needed',
        'Regular check-ins with support system'
      ],
      resources: [
        'Crisis Text Line: Text HOME to 741741',
        'National Suicide Prevention Lifeline: 988',
        'Emergency Services: 911',
        'Therapist contact information'
      ]
    };
  }

  function generateGrowthAssessment(entries: JournalEntry[]) {
    const wordCounts = entries.map(e => e.wordCount || 0);
    const averageWordGrowth = wordCounts.length > 5 ? 
      (wordCounts.slice(-5).reduce((a, b) => a + b, 0) / 5) - 
      (wordCounts.slice(0, 5).reduce((a, b) => a + b, 0) / 5) : 0;

    return {
      patterns: [
        'Increasing depth of reflection over time',
        'Development of emotional vocabulary',
        'Growing self-awareness',
        'Building therapeutic relationship with writing'
      ],
      resilience: [
        'Active engagement with difficult emotions',
        'Seeking understanding through writing',
        'Commitment to personal growth',
        'Building healthy coping mechanisms'
      ],
      goals: [
        'Continue developing emotional intelligence',
        'Strengthen coping strategies',
        'Build resilience through consistent practice',
        'Maintain therapeutic writing habits'
      ]
    };
  }

  const handleExportReport = (report: TherapistReport) => {
    if (report.consentRequired && !consentSettings.shareProgressReports) {
      setShowConsentModal(true);
      return;
    }

    // Generate export content
    const exportContent = generateExportContent(report);
    
    // Create and download file
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_${report.generatedAt.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateExportContent = (report: TherapistReport) => {
    const lines = [
      `${report.title}`,
      `Generated: ${report.generatedAt.toLocaleDateString()}`,
      `Period: ${report.periodCovered.start.toLocaleDateString()} - ${report.periodCovered.end.toLocaleDateString()}`,
      `Privacy Level: ${report.privacyLevel}`,
      '',
      report.description,
      '',
      '=' .repeat(50),
      ''
    ];

    report.sections.forEach(section => {
      if (section.confidential && consentSettings.anonymizeData) {
        lines.push(`${section.title}: [CONFIDENTIAL - ANONYMIZED]`);
      } else {
        lines.push(`${section.title}:`);
        lines.push('-'.repeat(section.title.length + 1));
        
        if (typeof section.content === 'object') {
          if (Array.isArray(section.content)) {
            section.content.forEach(item => {
              lines.push(`• ${typeof item === 'string' ? item : JSON.stringify(item)}`);
            });
          } else {
            Object.entries(section.content).forEach(([key, value]) => {
              lines.push(`${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
            });
          }
        } else {
          lines.push(section.content);
        }
      }
      lines.push('');
    });

    lines.push('');
    lines.push('Generated by ALCHM Digital Sanctuary');
    lines.push('This report is confidential and should be handled according to HIPAA guidelines.');

    return lines.join('\n');
  };

  const getReportTypeIcon = (type: TherapistReport['reportType']) => {
    switch (type) {
      case 'progress': return BarChart3;
      case 'clinical': return Heart;
      case 'outcome': return Target;
      case 'crisis': return AlertCircle;
      case 'growth': return TrendingUp;
      default: return FileText;
    }
  };

  const getReportTypeColor = (type: TherapistReport['reportType']) => {
    switch (type) {
      case 'progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clinical': return 'bg-red-100 text-red-800 border-red-200';
      case 'outcome': return 'bg-green-100 text-green-800 border-green-200';
      case 'crisis': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'growth': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!entries.length) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-sage-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sage-700 mb-2">No reports available</h3>
        <p className="text-sage-500">Create journal entries to generate therapeutic progress reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-sage-900 mb-1 flex items-center gap-2">
            <FileText className="h-6 w-6 text-sage-600" />
            Therapeutic Progress Reports
          </h2>
          <p className="text-sage-600">Professional reports for therapeutic collaboration and progress tracking</p>
        </div>
        
        <Button
          onClick={() => setShowConsentModal(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Privacy Settings
        </Button>
      </div>

      {/* Privacy Notice */}
      <Card className="p-4 border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-900 mb-1">Privacy & Consent Notice</h3>
            <p className="text-sm text-amber-800">
              These reports are designed for therapeutic collaboration. All data remains confidential and requires 
              your explicit consent for sharing. You can control what information is included in each report.
            </p>
          </div>
        </div>
      </Card>

      {/* Report Type Filter */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={selectedReportType === null ? "default" : "outline"}
          onClick={() => setSelectedReportType(null)}
          className="text-sm"
        >
          All Reports
        </Button>
        {['progress', 'clinical', 'outcome', 'crisis', 'growth'].map(type => {
          const reports = availableReports.filter(r => r.reportType === type);
          if (reports.length === 0) return null;
          
          return (
            <Button
              key={type}
              variant={selectedReportType === type ? "default" : "outline"}
              onClick={() => setSelectedReportType(type)}
              className="text-sm capitalize"
            >
              {type} ({reports.length})
            </Button>
          );
        })}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableReports
          .filter(report => selectedReportType === null || report.reportType === selectedReportType)
          .map((report) => {
            const Icon = getReportTypeIcon(report.reportType);
            
            return (
              <Card key={report.id} className="border-sage-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sage-100 rounded-lg">
                        <Icon className="h-5 w-5 text-sage-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sage-900">{report.title}</h3>
                        <Badge className={getReportTypeColor(report.reportType)}>
                          {report.reportType}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {report.consentRequired ? (
                        <Lock className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Unlock className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sage-700 mb-4">{report.description}</p>

                  {/* Report Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-sage-600">
                      <Calendar className="h-4 w-4" />
                      {report.periodCovered.start.toLocaleDateString()} - {report.periodCovered.end.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-sage-600">
                      <Eye className="h-4 w-4" />
                      Privacy: {report.privacyLevel}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-sage-600">
                      <FileText className="h-4 w-4" />
                      {report.sections.length} sections
                    </div>
                  </div>

                  {/* Sections Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-sage-900 mb-2">Report Sections</h4>
                    <div className="space-y-1">
                      {report.sections.map((section, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-sage-700">{section.title}</span>
                          {section.confidential && (
                            <Lock className="h-3 w-3 text-amber-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedReport(report)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      onClick={() => handleExportReport(report)}
                      size="sm"
                      className="flex-1"
                      disabled={report.consentRequired && !consentSettings.shareProgressReports}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-sage-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-sage-900">{selectedReport.title}</h2>
                  <p className="text-sage-600">Preview Mode - Confidential Information Protected</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedReport(null)}
                  className="text-sage-500 hover:text-sage-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
              <div className="bg-sage-50 rounded-lg p-4">
                <h3 className="font-medium text-sage-900 mb-2">Report Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-sage-600">Generated:</span>
                    <span className="ml-2 text-sage-900">{selectedReport.generatedAt.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sage-600">Privacy Level:</span>
                    <span className="ml-2 text-sage-900 capitalize">{selectedReport.privacyLevel}</span>
                  </div>
                  <div>
                    <span className="text-sage-600">Period:</span>
                    <span className="ml-2 text-sage-900">
                      {selectedReport.periodCovered.start.toLocaleDateString()} - {selectedReport.periodCovered.end.toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sage-600">Consent Required:</span>
                    <span className="ml-2 text-sage-900">{selectedReport.consentRequired ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {selectedReport.sections.map((section, index) => (
                <div key={index} className="border border-sage-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sage-900">{section.title}</h3>
                    {section.confidential && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Lock className="h-3 w-3 mr-1" />
                        Confidential
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sage-700">
                    {section.confidential && !consentSettings.shareProgressReports ? (
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <EyeOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Confidential content requires consent to view</p>
                      </div>
                    ) : (
                      <div>
                        {Array.isArray(section.content) ? (
                          <ul className="space-y-1">
                            {section.content.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-2">
                                <span className="text-sage-400 mt-1">•</span>
                                <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : typeof section.content === 'object' ? (
                          <div className="space-y-2">
                            {Object.entries(section.content).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center">
                                <span className="font-medium">{key}:</span>
                                <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{section.content}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-sage-200">
              <h2 className="text-xl font-medium text-sage-900">Privacy & Consent Settings</h2>
              <p className="text-sage-600 mt-1">Control how your therapeutic reports are generated and shared</p>
            </div>
            
            <div className="p-6 space-y-6">
              {[
                {
                  key: 'shareProgressReports' as keyof ConsentSettings,
                  title: 'Share Progress Reports',
                  description: 'Allow generation and export of therapeutic progress reports'
                },
                {
                  key: 'includeMoodData' as keyof ConsentSettings,
                  title: 'Include Mood Data',
                  description: 'Include emotional state information in reports'
                },
                {
                  key: 'includeContentSummaries' as keyof ConsentSettings,
                  title: 'Include Content Summaries',
                  description: 'Include summaries of journal entry themes and patterns'
                },
                {
                  key: 'includeBreakthroughs' as keyof ConsentSettings,
                  title: 'Include Breakthrough Moments',
                  description: 'Include significant insights and growth moments'
                },
                {
                  key: 'anonymizeData' as keyof ConsentSettings,
                  title: 'Anonymize Data',
                  description: 'Remove personally identifiable information from reports'
                },
                {
                  key: 'autoGenerate' as keyof ConsentSettings,
                  title: 'Auto-Generate Reports',
                  description: 'Automatically create reports on a regular schedule'
                }
              ].map(setting => (
                <div key={setting.key} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consentSettings[setting.key]}
                    onChange={(e) => setConsentSettings(prev => ({
                      ...prev,
                      [setting.key]: e.target.checked
                    }))}
                    className="mt-1 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                  />
                  <div>
                    <h3 className="font-medium text-sage-900">{setting.title}</h3>
                    <p className="text-sm text-sage-600">{setting.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-sage-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConsentModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowConsentModal(false)}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}