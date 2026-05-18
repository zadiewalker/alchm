'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';

export default function PrivacyPolicy() {
  const [lastUpdated] = useState(new Date().toLocaleDateString());

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Privacy Policy" showBack />}>
      <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col">
        {/* Radial Overlay - LOCKDOWN SPEC */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-white text-3xl font-light mb-4">Privacy Policy</h1>
          <div className="text-white/60">
            <p className="mb-2">ALCHM - Private Reflection Space</p>
            <p className="font-medium">Last Updated: {lastUpdated}</p>
            <p className="text-sm">Effective Date: January 26, 2026</p>
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard" 
              className="bg-[#E5C97D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#F2D99D] transition-all 300ms ease-out active:scale-[0.98] min-h-[44px] flex items-center justify-center"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <a href="#data-collection" className="text-blue-700 hover:underline">What We Collect</a>
            <a href="#data-use" className="text-blue-700 hover:underline">How We Use Data</a>
            <a href="#your-rights" className="text-blue-700 hover:underline">Your Rights</a>
            <a href="#data-security" className="text-blue-700 hover:underline">Data Security</a>
            <a href="#consent" className="text-blue-700 hover:underline">Consent Management</a>
            <a href="#retention" className="text-blue-700 hover:underline">Data Retention</a>
            <a href="#sharing" className="text-blue-700 hover:underline">Data Sharing</a>
            <a href="#contact" className="text-blue-700 hover:underline">Contact Us</a>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-12">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Commitment to Your Privacy</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                ALCHM is a trauma-informed digital sanctuary designed for private reflection through
                AI-supported journaling. We understand the deeply personal nature of journal data and are committed
                to protecting your privacy with the highest standards of security and transparency.
              </p>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <h3 className="font-semibold text-green-900">Privacy-by-Design Principles</h3>
                <ul className="text-green-800 mt-2 space-y-1">
                  <li>• <strong>Data minimization:</strong> We collect only what is necessary to provide the service</li>
                  <li>• <strong>Purpose limitation:</strong> Your data is used only for specified, legitimate purposes</li>
                  <li>• <strong>Transparency:</strong> Clear, understandable information about all data practices</li>
                  <li>• <strong>User control:</strong> You have complete control over your personal data</li>
                  <li>• <strong>Security by default:</strong> Advanced encryption and security measures protect your data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Collection */}
          <section id="data-collection">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">What Personal Data We Collect</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Essential Account Information</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Email address (for authentication and important communications)</li>
                  <li>• Encrypted password (never stored in plain text)</li>
                  <li>• Account creation date and last login timestamp</li>
                  <li>• Basic technical information (IP address for security, device type for optimization)</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Legal basis:</strong> Contractual necessity (GDPR Article 6(1)(b))
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Journal Content & Mental Health Data</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Your written journal entries and personal reflections</li>
                  <li>• Timestamps and metadata (word count, entry frequency)</li>
                  <li>• Khepera reflections generated from entries you submit for reflection</li>
                  <li>• Crisis detection results for safety monitoring (with consent)</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Legal basis:</strong> Explicit consent (GDPR Article 6(1)(a) & Article 9(2)(a) for health data)
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Operational Diagnostics</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Minimal operational events needed to keep the app reliable</li>
                  <li>• Performance metrics (page load times, error rates)</li>
                  <li>• Crash and failure signals with journal text excluded</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Legal basis:</strong> Legitimate interest (GDPR Article 6(1)(f)) or consent
                </p>
              </div>
            </div>
          </section>

          {/* Data Use */}
          <section id="data-use">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Use Your Personal Data</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">AI-Supported Reflection</h3>
                <p className="text-green-800 text-sm mb-2">
                  When you submit an entry for reflection, Khepera may return:
                </p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• A restrained reflection of what was written</li>
                  <li>• A non-directive perspective</li>
                  <li>• One open seed for further writing</li>
                </ul>
                <div className="text-xs text-green-600 mt-2 p-2 bg-green-100 rounded">
                  <strong>Your control:</strong> You choose when to submit writing for reflection.
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-3">🚨 Crisis Detection & Safety</h3>
                <p className="text-red-800 text-sm mb-2">
                  To protect immediate safety, entries are checked for crisis language before AI reflection:
                </p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Detect potential self-harm indicators</li>
                  <li>• Provide immediate crisis resources</li>
                  <li>• Crisis resources are shown when needed</li>
                  <li>• Crisis checks are not used for emotional scoring</li>
                </ul>
                <div className="text-xs text-red-600 mt-2 p-2 bg-red-100 rounded">
                  <strong>Legal basis:</strong> Vital interests (GDPR Article 6(1)(d)) - Your safety is paramount
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">🔧 Service Improvement</h3>
                <p className="text-blue-800 text-sm mb-2">
                  We use aggregated, anonymized data to enhance ALCHM:
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Maintain reflection quality and reliability</li>
                  <li>• Improve app performance and accessibility</li>
                  <li>• Maintain privacy, safety, and security controls</li>
                  <li>• Ensure platform reliability and security</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-3">📧 Essential Communications</h3>
                <p className="text-purple-800 text-sm mb-2">
                  We may contact you for:
                </p>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Account security and privacy updates</li>
                  <li>• Service disruption notifications</li>
                  <li>• Important policy changes</li>
                  <li>• Data breach notifications (if required)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section id="your-rights">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Privacy Rights</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Under GDPR, CCPA, and other privacy laws, you have comprehensive rights:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🔍 Right to Access</h4>
                  <p className="text-gray-700 text-sm">
                    Request a complete copy of all personal data we hold about you, including entries and Khepera reflections.
                  </p>
                  <Link href="/privacy" className="text-blue-600 text-sm hover:underline mt-1 block">
                    → Request data export
                  </Link>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">✏️ Right to Rectification</h4>
                  <p className="text-gray-700 text-sm">
                    Correct any inaccurate personal information or complete incomplete data.
                  </p>
                  <Link href="/dashboard" className="text-blue-600 text-sm hover:underline mt-1 block">
                    → Update account info
                  </Link>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">🗑️ Right to Erasure</h4>
                  <p className="text-gray-700 text-sm">
                    Request deletion of your personal data ('right to be forgotten') with 30-day grace period.
                  </p>
                  <Link href="/privacy" className="text-blue-600 text-sm hover:underline mt-1 block">
                    → Delete account
                  </Link>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">📦 Right to Data Portability</h4>
                  <p className="text-gray-700 text-sm">
                    Export your data in standard formats (JSON, CSV) for use with other services.
                  </p>
                  <Link href="/privacy" className="text-blue-600 text-sm hover:underline mt-1 block">
                    → Export data
                  </Link>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">✋ Right to Object</h4>
                  <p className="text-gray-700 text-sm">
                    Object to processing based on legitimate interests or for direct marketing.
                  </p>
                  <Link href="/privacy" className="text-blue-600 text-sm hover:underline mt-1 block">
                    → Manage consent
                  </Link>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">⏸️ Right to Restrict Processing</h4>
                  <p className="text-gray-700 text-sm">
                    Limit how we process your data while maintaining your account.
                  </p>
                  <Link href="/privacy" className="text-blue-600 text-sm hover:underline mt-1 block">
                    → Restrict processing
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">⚖️ Right to Lodge a Complaint</h4>
              <p className="text-yellow-800 text-sm">
                If you believe we've mishandled your personal data, you can file a complaint with your local data protection authority. 
                We encourage you to contact us first at <a href="mailto:privacy@alchm.app" className="underline">privacy@alchm.app</a> 
                so we can address your concerns directly.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section id="data-security">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Protect Your Data</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">🔐 Encryption & Security</h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• AES-256 encryption for all data at rest</li>
                    <li>• TLS 1.3 encryption for data in transit</li>
                    <li>• End-to-end encryption for sensitive journal content</li>
                    <li>• Regular security audits and penetration testing</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">👥 Access Controls</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Multi-factor authentication for admin access</li>
                    <li>• Role-based permissions with least privilege</li>
                    <li>• Complete audit logs of all data access</li>
                    <li>• Regular access reviews and deprovisioning</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2">🏢 Infrastructure Security</h3>
                  <ul className="text-purple-800 text-sm space-y-1">
                    <li>• SOC 2 Type II certified cloud infrastructure</li>
                    <li>• Automated intrusion detection and response</li>
                    <li>• Regular backups with encryption</li>
                    <li>• Disaster recovery and business continuity plans</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">📱 Application Security</h3>
                  <ul className="text-orange-800 text-sm space-y-1">
                    <li>• Secure coding practices and code reviews</li>
                    <li>• Regular dependency updates and vulnerability scans</li>
                    <li>• Input validation and sanitization</li>
                    <li>• Rate limiting and abuse prevention</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Consent Management */}
          <section id="consent">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Consent Management</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Granular Consent Controls</h3>
              <p className="text-blue-800 mb-4">
                ALCHM uses granular consent management, allowing you to control exactly how your data is used:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <strong className="text-gray-900">Khepera Reflection:</strong>
                    <span className="text-gray-700"> Choose when to submit writing for a restrained AI-generated reflection.</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <strong className="text-gray-900">Crisis Monitoring:</strong>
                    <span className="text-gray-700"> Opt into safety monitoring for crisis detection (highly recommended).</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <strong className="text-gray-900">Operational Diagnostics:</strong>
                    <span className="text-gray-700"> Choose whether crash reporting can support app reliability.</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <div>
                    <strong className="text-gray-900">Research Participation:</strong>
                    <span className="text-gray-700"> ALCHM does not currently offer research-data participation.</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-900 text-sm">
                  <strong>Easy Withdrawal:</strong> You can withdraw consent at any time through your privacy dashboard. 
                  Consent withdrawal is processed immediately and affects future data processing.
                </p>
                <Link href="/privacy" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Manage Consent Settings
                </Link>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section id="retention">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Retention & Automatic Deletion</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Flexible Retention Periods</h3>
                <p className="text-gray-700 mb-4">
                  You control how long we keep your data. Choose retention periods that match your needs:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-medium text-gray-900">Journal Entries</h4>
                    <ul className="text-gray-700 text-sm mt-2 space-y-1">
                      <li>• Keep indefinitely (default)</li>
                      <li>• Auto-delete after 12 months</li>
                      <li>• Auto-delete after 24 months</li>
                      <li>• Auto-delete after 36 months</li>
                      <li>• Auto-delete after 60 months (maximum)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-medium text-gray-900">Khepera Reflection Data</h4>
                    <ul className="text-gray-700 text-sm mt-2 space-y-1">
                      <li>• Delete after 12 months</li>
                      <li>• Delete after 24 months (recommended)</li>
                      <li>• Delete after 36 months (maximum)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">🕐 Inactive Account Management</h3>
                <p className="text-yellow-800 text-sm">
                  Accounts inactive for more than 12 months will receive warnings. 
                  After 15 months of inactivity, we may begin account deletion procedures 
                  with final notification and grace period for reactivation.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section id="sharing">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Sharing & Third Parties</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-3">❌ What We DON'T Share</h3>
                <ul className="text-red-800 space-y-2">
                  <li>• Your journal entries or personal content</li>
                  <li>• Individual AI analysis results</li>
                  <li>• Personal identifiable information</li>
                  <li>• Data for advertising or marketing</li>
                  <li>• Information to data brokers</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">✅ Limited, Ethical Sharing</h3>
                <ul className="text-green-800 space-y-2">
                  <li>• Minimal operational diagnostics when enabled</li>
                  <li>• Required infrastructure processing for app reliability</li>
                  <li>• Required legal compliance (with court orders)</li>
                  <li>• Essential service providers (with data processing agreements)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🤝 Trusted Service Providers</h3>
              <p className="text-blue-800 text-sm">
                We work with carefully vetted providers for essential services (cloud hosting, AI processing, security monitoring). 
                All providers sign strict data processing agreements and can only process data as instructed by ALCHM.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">International Data Transfers</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                ALCHM primarily stores data within your region to minimize latency and comply with local regulations. 
                When international transfers are necessary for service provision:
              </p>
              
              <ul className="text-gray-700 space-y-2 mb-4">
                <li>• We use Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>• All transfers include additional security measures and access controls</li>
                <li>• We assess the legal landscape of destination countries</li>
                <li>• Users in the EU can object to transfers to specific countries</li>
              </ul>
              
              <p className="text-gray-700 text-sm">
                Current international service providers: Google Cloud (global infrastructure with EU data residency), 
                OpenAI (US, for AI processing with contractual protections).
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Children's Privacy (COPPA Compliance)</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 mb-3">Special Protection for Minors</h3>
              <p className="text-yellow-800 mb-4">
                ALCHM provides enhanced privacy protection for users under 18, including:
              </p>
              
              <ul className="text-yellow-700 space-y-2 mb-4">
                <li>• <strong>Under 13:</strong> Requires verifiable parental consent before any data collection</li>
                <li>• <strong>Ages 13-17:</strong> Enhanced privacy notices and parental notification options</li>
                <li>• <strong>All minors:</strong> No behavioral advertising, restricted data sharing, enhanced deletion rights</li>
                <li>• <strong>Educational use:</strong> FERPA-compliant handling of educational records</li>
              </ul>
              
              <p className="text-yellow-800 text-sm">
                Parents and guardians can request information about their child's data or request deletion by contacting 
                <a href="mailto:privacy@alchm.app" className="underline">privacy@alchm.app</a>.
              </p>
            </div>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Policy Updates</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                We may update this privacy policy to reflect changes in our practices or applicable laws. 
                When we make significant changes:
              </p>
              
              <ul className="text-blue-700 space-y-2 mb-4">
                <li>• We'll notify you via email at least 30 days before changes take effect</li>
                <li>• We'll update the "Last Updated" date at the top of this policy</li>
                <li>• We'll maintain previous versions for your reference</li>
                <li>• For material changes affecting consent, we'll seek fresh consent</li>
              </ul>
              
              <p className="text-blue-800 text-sm">
                Continued use of ALCHM after notification constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Privacy Team</h3>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <strong>Email:</strong> <a href="mailto:privacy@alchm.app" className="text-blue-600 hover:underline">privacy@alchm.app</a>
                  </div>
                  <div>
                    <strong>Data Protection Officer:</strong> <a href="mailto:dpo@alchm.app" className="text-blue-600 hover:underline">dpo@alchm.app</a>
                  </div>
                  <div>
                    <strong>Legal Requests:</strong> <a href="mailto:legal@alchm.app" className="text-blue-600 hover:underline">legal@alchm.app</a>
                  </div>
                  <div>
                    <strong>Response Time:</strong> We respond to privacy inquiries within 72 hours
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/privacy" className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center">
                    Privacy Settings
                  </Link>
                  <Link href="/transparency" className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">
                    Transparency Report
                  </Link>
                  <a href="mailto:privacy@alchm.app" className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center">
                    Contact Privacy Team
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-white/40 border-t border-white/10 pt-8">
          <p className="mb-4 text-white/60">
            This privacy policy demonstrates ALCHM&apos;s commitment to protecting your reflection data
            with the highest standards of privacy and security.
          </p>
          <div className="flex justify-center space-x-6 text-[#E5C97D]">
            <Link href="/privacy" className="hover:underline">Privacy Settings</Link>
            <Link href="/transparency" className="hover:underline">Transparency Report</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <a href="mailto:privacy@alchm.app" className="hover:underline">Privacy Questions</a>
          </div>
          <p className="mt-4 text-white/30">
            © 2026 ALCHM. All rights reserved. | Privacy Policy Version 1.1
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
    </SanctuaryLayout>
  );
}
