import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — ALCHM',
  description: 'Get help with ALCHM. Contact our support team for assistance with your healing journey.',
};

export default function SupportPage() {
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
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-light text-sage-900 mb-4">We're Here to Help</h1>
            <p className="text-sage-700 text-lg max-w-2xl mx-auto">
              Your healing journey is important to us. Get support when you need it most.
            </p>
          </header>

          {/* Emergency Support */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center">
              🚨 Crisis Support
            </h2>
            <p className="text-red-800 mb-4">
              If you're experiencing a mental health crisis or having thoughts of self-harm, 
              please reach out for immediate help:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="tel:988"
                className="flex items-center gap-3 bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <span className="text-xl">📞</span>
                <div>
                  <div className="font-semibold">Call 988</div>
                  <div className="text-sm">Suicide & Crisis Lifeline</div>
                </div>
              </a>
              <a
                href="sms:741741&body=HOME"
                className="flex items-center gap-3 bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <span className="text-xl">💬</span>
                <div>
                  <div className="font-semibold">Text HOME to 741741</div>
                  <div className="text-sm">Crisis Text Line</div>
                </div>
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <details className="bg-sage-50 rounded-lg p-6">
                <summary className="cursor-pointer text-lg font-medium text-sage-900 mb-2">
                  How do I get started with ALCHM?
                </summary>
                <p className="text-sage-700">
                  Simply create an account with your email or Apple ID, and you can start journaling immediately. 
                  Your first AI response is free, and you can explore our guided pathways to begin your healing journey.
                </p>
              </details>

              <details className="bg-sage-50 rounded-lg p-6">
                <summary className="cursor-pointer text-lg font-medium text-sage-900 mb-2">
                  Is my journal private and secure?
                </summary>
                <p className="text-sage-700">
                  Yes, absolutely. All your journal entries are encrypted and stored securely. We never share your 
                  personal content with anyone. Only you can access your journal, and you can delete your data at any time.
                </p>
              </details>

              <details className="bg-sage-50 rounded-lg p-6">
                <summary className="cursor-pointer text-lg font-medium text-sage-900 mb-2">
                  How does the AI analysis work?
                </summary>
                <p className="text-sage-700">
                  Our AI processes your journal entries to provide insights from seven different healing perspectives: 
                  Therapist, Body, Healer, Nurturer, Coach, Shadow, and Sage. The AI helps you see patterns and offers 
                  gentle guidance, but it's not a replacement for professional therapy.
                </p>
              </details>

              <details className="bg-sage-50 rounded-lg p-6">
                <summary className="cursor-pointer text-lg font-medium text-sage-900 mb-2">
                  Can I export my journal entries?
                </summary>
                <p className="text-sage-700">
                  Yes! You own your journal content and can export it at any time through your account settings. 
                  We believe your healing journey belongs to you.
                </p>
              </details>

              <details className="bg-sage-50 rounded-lg p-6">
                <summary className="cursor-pointer text-lg font-medium text-sage-900 mb-2">
                  What if I'm under 18?
                </summary>
                <p className="text-sage-700">
                  ALCHM is designed for users 17 and older. If you're younger, we recommend speaking with a trusted 
                  adult about mental health resources appropriate for your age.
                </p>
              </details>

              <details className="bg-sage-50 rounded-lg p-6">
                <summary className="cursor-pointer text-lg font-medium text-sage-900 mb-2">
                  How do I cancel my subscription?
                </summary>
                <p className="text-sage-700">
                  You can manage your subscription through your app store account (Apple App Store or Google Play). 
                  Go to Settings → Subscriptions and select ALCHM to modify or cancel.
                </p>
              </details>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-sage-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-sage-900 mb-4">📧 Email Support</h3>
              <p className="text-sage-700 mb-4">
                For non-urgent questions and technical support:
              </p>
              <div className="space-y-2">
                <div>
                  <strong>General Support:</strong>
                  <br />
                  <a href="mailto:support@alchm.app" className="text-sage-600 hover:text-sage-800">
                    support@alchm.app
                  </a>
                </div>
                <div>
                  <strong>Privacy Questions:</strong>
                  <br />
                  <a href="mailto:privacy@alchm.app" className="text-sage-600 hover:text-sage-800">
                    privacy@alchm.app
                  </a>
                </div>
                <div>
                  <strong>Business Inquiries:</strong>
                  <br />
                  <a href="mailto:hello@alchm.app" className="text-sage-600 hover:text-sage-800">
                    hello@alchm.app
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-sage-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-sage-900 mb-4">⏱️ Response Times</h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-red-700">Crisis Support:</strong>
                  <br />
                  <span className="text-sage-700">Immediate (Call 988)</span>
                </div>
                <div>
                  <strong className="text-sage-800">Technical Issues:</strong>
                  <br />
                  <span className="text-sage-700">Within 24 hours</span>
                </div>
                <div>
                  <strong className="text-sage-800">General Questions:</strong>
                  <br />
                  <span className="text-sage-700">Within 48 hours</span>
                </div>
                <div>
                  <strong className="text-sage-800">Business Inquiries:</strong>
                  <br />
                  <span className="text-sage-700">Within 1 week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-8 bg-gradient-to-r from-sage-500 to-sage-600 rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">💝 Share Your Feedback</h3>
            <p className="mb-4">
              Your experience helps us improve ALCHM for everyone. We'd love to hear from you!
            </p>
            <a
              href="mailto:feedback@alchm.app?subject=App Feedback"
              className="inline-flex items-center gap-2 bg-white text-sage-600 px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors font-medium"
            >
              Send Feedback →
            </a>
          </div>

          {/* Resources */}
          <div className="mt-8 pt-8 border-t border-sage-200">
            <h3 className="text-xl font-semibold text-sage-900 mb-4">📚 Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/privacy" className="text-sage-600 hover:text-sage-800 underline">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sage-600 hover:text-sage-800 underline">
                Terms of Service
              </a>
              <a href="/crisis-resources" className="text-sage-600 hover:text-sage-800 underline">
                Crisis Resources
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Crisis Support Button */}
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