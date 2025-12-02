import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — ALCHM',
  description: 'ALCHM Terms of Service: Legal terms for using our trauma-informed journaling platform.',
};

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl font-light text-sage-900 mb-4">Terms of Service</h1>
            <p className="text-sage-600 text-lg">
              Last updated: November 30, 2025
            </p>
          </header>

          <div className="prose prose-lg max-w-none text-sage-800 leading-relaxed space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Acceptance of Terms</h2>
              <p>
                By accessing or using ALCHM (the "Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Description of Service</h2>
              <p>
                ALCHM is a trauma-informed journaling application that provides AI-powered insights for emotional 
                wellness and personal growth. Our Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Digital journaling platform with AI-generated responses</li>
                <li>Guided healing pathways and lessons</li>
                <li>Emotional tracking and progress insights</li>
                <li>Crisis support resources and emergency contacts</li>
                <li>Community features and peer support</li>
              </ul>
            </section>

            <section className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h2 className="text-2xl font-semibold text-amber-900 mb-4">⚠️ Important Medical Disclaimer</h2>
              <div className="text-amber-800">
                <p className="font-semibold mb-2">
                  ALCHM is not a medical device and does not provide medical advice, diagnosis, or treatment.
                </p>
                <p>
                  Our Service is designed for educational and emotional support purposes only. It is not a substitute 
                  for professional mental health treatment, therapy, or medical care. If you are experiencing a mental 
                  health crisis, suicidal thoughts, or any medical emergency, please contact:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2 font-medium">
                  <li>Emergency Services: 911</li>
                  <li>Suicide & Crisis Lifeline: 988</li>
                  <li>Crisis Text Line: Text HOME to 741741</li>
                  <li>Your healthcare provider</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">User Requirements & Responsibilities</h2>
              
              <h3 className="text-xl font-medium text-sage-800 mb-3">Age Requirement</h3>
              <p>
                You must be at least 17 years old to use ALCHM. By using our Service, you represent and warrant 
                that you are 17 years of age or older.
              </p>

              <h3 className="text-xl font-medium text-sage-800 mb-3 mt-6">Account Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You agree to notify us immediately of any unauthorized use of your account</li>
                <li>You are fully responsible for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-medium text-sage-800 mb-3 mt-6">Acceptable Use</h3>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Share content that is harmful, abusive, or violates others' rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users' use of the Service</li>
                <li>Use the Service for any commercial purposes without authorization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Content & Intellectual Property</h2>
              
              <h3 className="text-xl font-medium text-sage-800 mb-3">Your Content</h3>
              <p>
                You retain ownership of all content you create or upload to ALCHM, including journal entries, 
                reflections, and other personal content. By using our Service, you grant us a limited license to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Store and process your content to provide our services</li>
                <li>Generate AI insights and responses based on your content</li>
                <li>Backup your data for security and recovery purposes</li>
              </ul>

              <h3 className="text-xl font-medium text-sage-800 mb-3 mt-6">ALCHM's Content</h3>
              <p>
                All content provided by ALCHM, including the app design, AI responses, pathways, and educational 
                materials, is protected by copyright and other intellectual property laws. You may not copy, 
                distribute, or create derivative works without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Subscriptions & Payments</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Free Features:</strong> Basic journaling and limited AI responses are free</li>
                <li><strong>Premium Subscriptions:</strong> Advanced features require a paid subscription</li>
                <li><strong>Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled</li>
                <li><strong>Refund Policy:</strong> Refunds are subject to Apple App Store or Google Play policies</li>
                <li><strong>Price Changes:</strong> We may change subscription prices with advance notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Privacy & Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our 
                <a href="/privacy" className="text-sage-600 underline hover:text-sage-800">Privacy Policy</a>, 
                which is incorporated into these Terms by reference.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Service Availability & Modifications</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We strive to maintain Service availability but do not guarantee uninterrupted access</li>
                <li>We may modify, update, or discontinue features with or without notice</li>
                <li>Emergency maintenance may require temporary Service interruptions</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, ALCHM and its affiliates shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
              </p>
              <p className="mt-4">
                Our total liability to you for any claims arising from these Terms or your use of the Service 
                shall not exceed the amount you paid to us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless ALCHM and its employees, agents, and affiliates from any 
                claims, damages, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Account Termination</h2>
              
              <h3 className="text-xl font-medium text-sage-800 mb-3">Termination by You</h3>
              <p>
                You may delete your account at any time through the app settings. Upon deletion, we will remove 
                your personal data as described in our Privacy Policy.
              </p>

              <h3 className="text-xl font-medium text-sage-800 mb-3 mt-4">Termination by Us</h3>
              <p>
                We may terminate or suspend your account if you violate these Terms, engage in harmful behavior, 
                or for any reason with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Governing Law</h2>
              <p>
                These Terms are governed by the laws of the United States and the state of [State to be determined]. 
                Any disputes will be resolved through binding arbitration or in courts of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Changes to Terms</h2>
              <p>
                We may modify these Terms from time to time. Material changes will be communicated through the app 
                or by email. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Contact Information</h2>
              <p>
                Questions about these Terms? Contact us at:
              </p>
              <div className="bg-sage-50 p-6 rounded-lg mt-4">
                <p><strong>Legal:</strong> legal@alchm.app</p>
                <p><strong>Support:</strong> support@alchm.app</p>
                <p><strong>General:</strong> hello@alchm.app</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-sage-900 mb-4">Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions will 
                remain in full force and effect.
              </p>
            </section>

            <div className="border-t border-sage-200 pt-8 mt-8">
              <p className="text-center text-sage-600">
                Thank you for being part of the ALCHM community. Your healing journey matters.
              </p>
            </div>
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