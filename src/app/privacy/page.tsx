import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ALCHM',
  description: 'ALCHM Privacy Policy: How we protect your personal information and journal entries.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
            >
              ← Back to ALCHM
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-sage-200">
          <header className="mb-8">
            <h1 className="text-4xl font-light text-sage-900 mb-4">Privacy Policy</h1>
            <p className="text-sage-600 text-lg">
              Last updated: November 30, 2025
            </p>
          </header>

          <div className="prose prose-lg max-w-none text-sage-800 leading-relaxed space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Introduction</h2>
              <p>
                ALCHM ("we", "our", or "us") is committed to protecting your privacy and personal information. 
                This Privacy Policy explains how we collect, use, protect, and handle your information when you 
                use our mobile application and web service (the "Service").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-sage-800 mb-3">Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email address for account creation and authentication</li>
                <li><strong>Journal Content:</strong> Your journal entries, reflections, and personal thoughts</li>
                <li><strong>Mood Data:</strong> Mood selections and emotional check-ins you provide</li>
                <li><strong>Pathway Progress:</strong> Your progress through guided healing pathways</li>
                <li><strong>Preferences:</strong> App settings, notification preferences, and customization choices</li>
              </ul>

              <h3 className="text-xl font-medium text-sage-800 mb-3 mt-6">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Device Information:</strong> Device type, operating system, browser version</li>
                <li><strong>Usage Analytics:</strong> Features used, time spent in app, interaction patterns</li>
                <li><strong>Performance Data:</strong> App crashes, load times, and error reports</li>
                <li><strong>Location Data:</strong> General region for crisis resource recommendations (if permitted)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and operate our journaling and AI response services</li>
                <li>Generate personalized insights from your journal entries using AI</li>
                <li>Track your progress and maintain streak counters</li>
                <li>Recommend relevant pathways and healing resources</li>
                <li>Detect potential crisis situations and provide appropriate resources</li>
                <li>Improve our service through usage analytics and feedback</li>
                <li>Communicate with you about your account and service updates</li>
                <li>Provide customer support when requested</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Data Security & Protection</h2>
              <p>
                Your privacy and security are paramount. We implement multiple layers of protection:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard encryption</li>
                <li><strong>Access Controls:</strong> Strict access controls limit who can view your data</li>
                <li><strong>Firebase Security:</strong> We use Google Firebase with enterprise-grade security measures</li>
                <li><strong>Regular Audits:</strong> Regular security assessments and vulnerability testing</li>
                <li><strong>Privacy by Design:</strong> Built with privacy considerations from the ground up</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Data Sharing & Disclosure</h2>
              <p><strong>We do not sell your personal information to anyone.</strong></p>
              
              <p className="mt-4">We may share data only in these limited circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Service Providers:</strong> Firebase (Google), Anthropic AI for journal analysis</li>
                <li><strong>Crisis Intervention:</strong> If we detect imminent danger, we may contact emergency services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect safety</li>
                <li><strong>Business Transfer:</strong> In case of merger or acquisition (with notice)</li>
              </ul>

              <p className="mt-4 text-sm bg-sage-50 p-4 rounded-lg">
                <strong>AI Processing:</strong> Your journal entries are processed by Anthropic's Claude AI to generate 
                insights. This processing is done securely and Anthropic does not retain your data after processing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Your Privacy Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Access:</strong> Request a copy of all personal data we have about you</li>
                <li><strong>Correct:</strong> Update or correct any inaccurate information</li>
                <li><strong>Delete:</strong> Request deletion of your account and all associated data</li>
                <li><strong>Export:</strong> Download your journal entries and data</li>
                <li><strong>Opt-out:</strong> Disable analytics or AI processing features</li>
                <li><strong>Portability:</strong> Transfer your data to another service</li>
              </ul>

              <p className="mt-4">
                To exercise these rights, contact us at <strong>privacy@alchm.app</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Children's Privacy</h2>
              <p>
                ALCHM is intended for users aged 17 and older. We do not knowingly collect personal information 
                from children under 17. If we discover that we have collected information from a child under 17, 
                we will delete that information immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">International Users</h2>
              <p>
                ALCHM is operated from the United States. If you are accessing our service from outside the United States, 
                please be aware that your information may be transferred to, stored, and processed in the United States 
                where our servers are located and our central database is operated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
                updated policy in the app and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-sage-50 p-6 rounded-lg mt-4">
                <p><strong>Email:</strong> privacy@alchm.app</p>
                <p><strong>Support:</strong> support@alchm.app</p>
                <p><strong>Address:</strong> [Company Address to be Added]</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Crisis Support */}
      <div className="fixed bottom-6 right-6">
        <a 
          href="tel:988" 
          className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Crisis support - Call 988"
        >
          📞
        </a>
      </div>
    </div>
  );
}