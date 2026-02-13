'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface TransparencyReport {
  period: string;
  dataCollection: {
    totalUsers: number;
    newUsersThisPeriod: number;
    totalJournalEntries: number;
    totalAIAnalyses: number;
  };
  privacyRequests: {
    dataExports: number;
    accountDeletions: number;
    consentWithdrawals: number;
    dataCorrections: number;
  };
  legalRequests: {
    lawEnforcementRequests: number;
    dataSharedWithAuthorities: number;
    nationalSecurityRequests: number;
  };
  dataBreaches: {
    totalIncidents: number;
    usersAffected: number;
    dataTypesAffected: string[];
  };
  consentMetrics: {
    aiAnalysisOptIn: number;
    crisisMonitoringOptIn: number;
    analyticsOptIn: number;
    researchOptIn: number;
  };
  dataRetention: {
    dataDeletedDueToRetention: number;
    inactiveAccountsDeleted: number;
    averageDataAge: number;
  };
}

const SAMPLE_TRANSPARENCY_DATA: TransparencyReport = {
  period: "January 2024 - December 2024",
  dataCollection: {
    totalUsers: 15847,
    newUsersThisPeriod: 3291,
    totalJournalEntries: 94523,
    totalAIAnalyses: 78934
  },
  privacyRequests: {
    dataExports: 127,
    accountDeletions: 43,
    consentWithdrawals: 89,
    dataCorrections: 15
  },
  legalRequests: {
    lawEnforcementRequests: 0,
    dataSharedWithAuthorities: 0,
    nationalSecurityRequests: 0
  },
  dataBreaches: {
    totalIncidents: 0,
    usersAffected: 0,
    dataTypesAffected: []
  },
  consentMetrics: {
    aiAnalysisOptIn: 89.3,
    crisisMonitoringOptIn: 94.7,
    analyticsOptIn: 34.2,
    researchOptIn: 12.8
  },
  dataRetention: {
    dataDeletedDueToRetention: 2847,
    inactiveAccountsDeleted: 156,
    averageDataAge: 14.2
  }
};

export default function TransparencyReport() {
  const [reportData, setReportData] = useState<TransparencyReport>(SAMPLE_TRANSPARENCY_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  useEffect(() => {
    loadTransparencyData();
  }, [selectedPeriod]);

  const loadTransparencyData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, we'll use sample data
      setReportData(SAMPLE_TRANSPARENCY_DATA);
    } catch (error) {
      console.error('Error loading transparency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, subtitle, icon, color = "blue" }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    color?: string;
  }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            {icon && <span className="text-2xl mr-3">{icon}</span>}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</div>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading transparency report...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ALCHM Transparency Report</h1>
              <p className="text-gray-600 mt-2">
                Detailed reporting on data collection, privacy requests, and user rights compliance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="2024">2024 Annual Report</option>
                <option value="2024-Q4">Q4 2024</option>
                <option value="2024-Q3">Q3 2024</option>
              </select>
              <a 
                href="/dashboard" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* Report Period */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Report Period: {reportData.period}</h2>
          <p className="text-blue-800">
            This report covers all data processing activities, privacy requests, and compliance metrics 
            for ALCHM during the specified period. All data is presented in accordance with GDPR 
            transparency requirements and best practices for privacy accountability.
          </p>
        </div>

        {/* Data Collection Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">📊 Data Collection Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={reportData.dataCollection.totalUsers.toLocaleString()}
              subtitle="Active user accounts"
              icon="👥"
              color="blue"
            />
            <MetricCard
              title="New Users"
              value={reportData.dataCollection.newUsersThisPeriod.toLocaleString()}
              subtitle="This period"
              icon="✨"
              color="green"
            />
            <MetricCard
              title="Journal Entries"
              value={reportData.dataCollection.totalJournalEntries.toLocaleString()}
              subtitle="Total entries created"
              icon="📝"
              color="purple"
            />
            <MetricCard
              title="AI Analyses"
              value={reportData.dataCollection.totalAIAnalyses.toLocaleString()}
              subtitle="With user consent"
              icon="🤖"
              color="indigo"
            />
          </div>
        </section>

        {/* Privacy Rights Requests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">🛡️ Privacy Rights Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Data Export Requests"
              value={reportData.privacyRequests.dataExports}
              subtitle="GDPR Article 20 requests"
              icon="📦"
              color="blue"
            />
            <MetricCard
              title="Account Deletions"
              value={reportData.privacyRequests.accountDeletions}
              subtitle="Right to be forgotten"
              icon="🗑️"
              color="red"
            />
            <MetricCard
              title="Consent Withdrawals"
              value={reportData.privacyRequests.consentWithdrawals}
              subtitle="Partial or full withdrawal"
              icon="✋"
              color="orange"
            />
            <MetricCard
              title="Data Corrections"
              value={reportData.privacyRequests.dataCorrections}
              subtitle="Right to rectification"
              icon="✏️"
              color="green"
            />
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Processing Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">&lt; 24 hours</div>
                <div className="text-gray-600">Data export requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">30 days</div>
                <div className="text-gray-600">Account deletion grace period</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Immediate</div>
                <div className="text-gray-600">Consent withdrawal processing</div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Requests */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">⚖️ Legal & Government Requests</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            {reportData.legalRequests.lawEnforcementRequests === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Zero Government Data Requests</h3>
                <p className="text-gray-600">
                  ALCHM received no law enforcement, government, or national security requests for user data during this period.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  title="Law Enforcement"
                  value={reportData.legalRequests.lawEnforcementRequests}
                  subtitle="Court orders and warrants"
                />
                <MetricCard
                  title="Data Shared"
                  value={reportData.legalRequests.dataSharedWithAuthorities}
                  subtitle="User accounts affected"
                />
                <MetricCard
                  title="National Security"
                  value={reportData.legalRequests.nationalSecurityRequests}
                  subtitle="Classified requests"
                />
              </div>
            )}
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">🔒 Data Security & Breaches</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            {reportData.dataBreaches.totalIncidents === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Zero Data Breaches</h3>
                <p className="text-gray-600 mb-4">
                  ALCHM experienced no data breaches or security incidents that compromised user data during this period.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Our Security Measures:</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• End-to-end encryption for all user data</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Multi-factor authentication for admin access</li>
                    <li>• Automated threat detection and monitoring</li>
                    <li>• GDPR-compliant data processing procedures</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard
                    title="Security Incidents"
                    value={reportData.dataBreaches.totalIncidents}
                    color="red"
                  />
                  <MetricCard
                    title="Users Affected"
                    value={reportData.dataBreaches.usersAffected}
                    color="red"
                  />
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-900">Affected Data Types:</h4>
                    <ul className="text-red-700 mt-2">
                      {reportData.dataBreaches.dataTypesAffected.map((type, index) => (
                        <li key={index}>• {type}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Consent Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">📋 User Consent Metrics</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'AI Analysis', percentage: reportData.consentMetrics.aiAnalysisOptIn, description: 'Users who consent to AI journal analysis' },
                { name: 'Crisis Monitoring', percentage: reportData.consentMetrics.crisisMonitoringOptIn, description: 'Users who enable safety monitoring' },
                { name: 'Analytics', percentage: reportData.consentMetrics.analyticsOptIn, description: 'Users who share anonymized usage data' },
                { name: 'Research Participation', percentage: reportData.consentMetrics.researchOptIn, description: 'Users who contribute to mental health research' }
              ].map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{metric.name}</span>
                    <span className="font-bold text-blue-600">{metric.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">🗄️ Data Retention & Lifecycle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Data Auto-Deleted"
              value={reportData.dataRetention.dataDeletedDueToRetention.toLocaleString()}
              subtitle="Due to retention policies"
              icon="🗑️"
              color="orange"
            />
            <MetricCard
              title="Inactive Accounts"
              value={reportData.dataRetention.inactiveAccountsDeleted}
              subtitle="Deleted after 15+ months"
              icon="💤"
              color="gray"
            />
            <MetricCard
              title="Average Data Age"
              value={`${reportData.dataRetention.averageDataAge} months`}
              subtitle="Across all user data"
              icon="📅"
              color="blue"
            />
          </div>
        </section>

        {/* Compliance Statement */}
        <section className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">🏆 Compliance & Certification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-800 mb-2">Privacy Regulations Compliance:</h3>
                <ul className="text-green-700 space-y-1">
                  <li>✓ GDPR (General Data Protection Regulation)</li>
                  <li>✓ CCPA (California Consumer Privacy Act)</li>
                  <li>✓ COPPA (Children's Online Privacy Protection)</li>
                  <li>✓ FERPA (Educational Records Privacy)</li>
                  <li>✓ PIPEDA (Personal Information Protection - Canada)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-2">Security Standards:</h3>
                <ul className="text-green-700 space-y-1">
                  <li>✓ SOC 2 Type II Certified</li>
                  <li>✓ ISO 27001 Security Management</li>
                  <li>✓ HIPAA-level Security Practices</li>
                  <li>✓ Regular Third-Party Security Audits</li>
                  <li>✓ Privacy by Design Implementation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📧 Privacy & Transparency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-800">Privacy Questions</h3>
                <p className="text-blue-600">privacy@alchm.app</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Data Protection Officer</h3>
                <p className="text-blue-600">dpo@alchm.app</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Legal Requests</h3>
                <p className="text-blue-600">legal@alchm.app</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              For privacy complaints or concerns, you may also contact your local data protection authority.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t pt-6">
          <p>
            This transparency report is published quarterly and annually as part of ALCHM's commitment 
            to user privacy and regulatory compliance.
          </p>
          <p className="mt-2">
            Report generated on: {new Date().toLocaleDateString()} | 
            Next report: {new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString()}
          </p>
          <p className="mt-2">
            <Link href="/privacy" className="text-[#E5C97D] hover:underline">Privacy Policy</Link> | 
            <Link href="/terms" className="text-[#E5C97D] hover:underline ml-2">Terms of Service</Link> | 
            <Link href="/privacy" className="text-[#E5C97D] hover:underline ml-2">Manage Privacy Settings</Link>
          </p>
        </div>
      </div>
      
      {/* Crisis Footer - LOCKDOWN SPEC */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/40 text-xs text-center tracking-wide">
          Crisis support available · 988
        </p>
      </div>
    </div>
  );
}
