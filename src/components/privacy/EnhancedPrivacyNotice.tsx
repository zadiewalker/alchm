'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EnhancedPrivacyNoticeProps {
  variant?: 'banner' | 'modal' | 'inline';
  userAgeStatus?: 'adult' | 'teen' | 'minor';
  onAccept?: () => void;
  onDecline?: () => void;
  showGoogleSpecific?: boolean;
}

export default function EnhancedPrivacyNotice({
  variant = 'banner',
  userAgeStatus = 'adult',
  onAccept,
  onDecline,
  showGoogleSpecific = false
}: EnhancedPrivacyNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged privacy notice
    const acknowledged = localStorage.getItem('alchm_privacy_acknowledged');
    const acknowledgedDate = acknowledged ? new Date(acknowledged) : null;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Show if not acknowledged or if acknowledgment is older than 30 days
    if (!acknowledged || !acknowledgedDate || acknowledgedDate < thirtyDaysAgo) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('alchm_privacy_acknowledged', new Date().toISOString());
    localStorage.setItem('alchm_privacy_version', '2025-01-15');
    setHasInteracted(true);
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    setHasInteracted(true);
    setIsVisible(false);
    onDecline?.();
  };

  if (!isVisible && variant !== 'inline') return null;

  const getAgeSpecificMessage = () => {
    switch (userAgeStatus) {
      case 'teen':
        return {
          title: "🌟 Teen Privacy Protection Notice",
          description: "As a teen user (17-18), you have enhanced privacy protections under ALCHM's youth safety policies.",
          highlights: [
            "✅ Enhanced crisis detection and support specifically designed for teens",
            "✅ Stricter data retention limits (automatic deletion after 12 months)",
            "✅ Optional family involvement in crisis situations (with your consent)",
            "✅ Educational resource prioritization over advertising",
            "✅ No behavioral profiling or targeted advertising"
          ]
        };
      case 'minor':
        return {
          title: "⚠️ COPPA Protection Required",
          description: "Children under 13 require verifiable parental consent under federal law.",
          highlights: [
            "❌ ALCHM is not designed for users under 13",
            "⚖️ COPPA compliance requires parental consent for data collection",
            "🔒 No personal information collected without verified parental permission",
            "🌐 Redirecting to age-appropriate mental health resources"
          ]
        };
      default:
        return {
          title: "🛡️ Privacy & Data Protection",
          description: "Your privacy rights and how we protect your sensitive mental health data.",
          highlights: [
            "✅ End-to-end encryption for all personal journal content",
            "✅ No sharing of personal data with third parties",
            "✅ You own and control all your data",
            "✅ Complete data export and deletion rights",
            "✅ GDPR, CCPA, and HIPAA-aligned privacy practices"
          ]
        };
    }
  };

  const ageContent = getAgeSpecificMessage();

  if (variant === 'banner') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-900 text-white p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-medium text-lg mb-1">{ageContent.title}</h3>
            <p className="text-blue-100 text-sm">
              {ageContent.description} {' '}
              <Link href="/privacy-policy.html" className="underline hover:text-white">
                Read our full privacy policy
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 bg-transparent border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-white text-blue-900 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl max-h-screen overflow-y-auto">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h2 className="text-2xl font-medium text-gray-900 mb-2">{ageContent.title}</h2>
              <p className="text-blue-600">{ageContent.description}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-medium text-gray-800 mb-3">Your Privacy Rights & Protections</h3>
              <ul className="space-y-2">
                {ageContent.highlights.map((highlight, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {showGoogleSpecific && (
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="font-medium text-red-800 mb-3">🔍 Google Authentication Data Collection</h3>
                <div className="space-y-2 text-sm text-red-800">
                  <p><strong>What Google collects during sign-in:</strong></p>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>Your email address and display name</li>
                    <li>Profile photo (if you have one)</li>
                    <li>Google account ID for authentication</li>
                    <li>Device and browser information</li>
                    <li>IP address and approximate location</li>
                  </ul>
                  <p className="font-medium mt-3">
                    ⚠️ Google's privacy policy also applies. Review at{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" className="underline">
                      policies.google.com/privacy
                    </a>
                  </p>
                </div>
              </div>
            )}

            {userAgeStatus === 'teen' && (
              <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-3">🌟 Special Protections for Teen Users</h3>
                <div className="space-y-2 text-sm text-yellow-800">
                  <p><strong>Enhanced Privacy Measures:</strong></p>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>Automatic data deletion after 12 months (vs 24 months for adults)</li>
                    <li>No behavioral advertising or profiling</li>
                    <li>Enhanced crisis detection with youth-specific resources</li>
                    <li>Optional family notification in crisis situations (your choice)</li>
                    <li>Educational content prioritization</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="font-medium text-green-800 mb-3">✅ Regulatory Compliance</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                <div>
                  <p className="font-medium">🇺🇸 United States</p>
                  <ul className="ml-4 list-disc">
                    <li>COPPA (Children's Privacy)</li>
                    <li>CCPA (California Privacy Rights)</li>
                    <li>FERPA (Educational Records)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">🌍 International</p>
                  <ul className="ml-4 list-disc">
                    <li>GDPR (European Union)</li>
                    <li>PIPEDA (Canada)</li>
                    <li>Data Protection Laws</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAccept}
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                ✅ I Understand and Accept These Privacy Terms
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('/privacy-policy.html', '_blank')}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  📖 Read Full Privacy Policy
                </button>
                
                <button
                  onClick={handleDecline}
                  className="flex-1 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors"
                >
                  ❌ Decline - Exit ALCHM
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
              <p>Last updated: January 15, 2025 | Version 3.2</p>
              <p>Questions? Contact privacy@alchm.com | Response within 48 hours guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🛡️</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-blue-800 mb-2">{ageContent.title}</h3>
          <p className="text-blue-700 text-sm mb-3">{ageContent.description}</p>
          <ul className="space-y-1 text-xs text-blue-600 mb-4">
            {ageContent.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/privacy-policy.html"
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            Read our complete privacy policy →
          </Link>
        </div>
      </div>
    </div>
  );
}