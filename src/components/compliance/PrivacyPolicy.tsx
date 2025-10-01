'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface PrivacyPolicyProps {
  variant?: 'full' | 'summary' | 'modal';
  showExportOptions?: boolean;
}

export function PrivacyPolicy({ variant = 'full', showExportOptions = true }: PrivacyPolicyProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const privacyData = {
    lastUpdated: '2025-09-21',
    effectiveDate: '2025-09-21',
    companyInfo: {
      name: 'ALCHM',
      contact: 'privacy@alchm.app',
      address: 'Contact via app support'
    },
    dataCollection: {
      collected: [
        {
          type: 'Journal Entries',
          description: 'Your personal writing and reflections',
          storage: 'Stored locally on your device with optional encrypted cloud backup',
          purpose: 'To provide journaling functionality and insights',
          retention: 'Until you delete them or deactivate your account'
        },
        {
          type: 'Account Information',
          description: 'Email address for account management',
          storage: 'Securely stored in our database',
          purpose: 'Account management, password resets, important updates',
          retention: 'Until account deletion'
        },
        {
          type: 'Usage Analytics',
          description: 'How you use the app (anonymized)',
          storage: 'Aggregated analytics database',
          purpose: 'Improve app performance and user experience',
          retention: '24 months maximum'
        },
        {
          type: 'Crash Reports',
          description: 'Technical error information (no personal content)',
          storage: 'Error logging service',
          purpose: 'Fix bugs and improve app stability',
          retention: '90 days'
        }
      ],
      notCollected: [
        'Location data',
        'Camera or microphone access',
        'Contacts or social connections',
        'Third-party tracking data',
        'Advertising identifiers',
        'Background app activity',
        'Device fingerprinting'
      ]
    },
    userRights: [
      {
        right: 'Access Your Data',
        description: 'View all data we have about you',
        action: 'Export from Settings > Privacy > Download My Data'
      },
      {
        right: 'Delete Your Data',
        description: 'Permanently remove all your information',
        action: 'Settings > Account > Delete Account'
      },
      {
        right: 'Control Data Sharing',
        description: 'Opt out of analytics and insights',
        action: 'Settings > Privacy > Data Controls'
      },
      {
        right: 'Portable Data',
        description: 'Download your data in a standard format',
        action: 'Settings > Privacy > Export Data'
      }
    ]
  };

  const TableOfContents = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="font-semibold text-gray-800 mb-3">Privacy Policy Contents</h3>
      <ul className="space-y-2 text-sm">
        {[
          { id: 'overview', title: 'Privacy Overview' },
          { id: 'collection', title: 'What We Collect' },
          { id: 'usage', title: 'How We Use Your Data' },
          { id: 'storage', title: 'Data Storage & Security' },
          { id: 'sharing', title: 'Data Sharing Policy' },
          { id: 'rights', title: 'Your Privacy Rights' },
          { id: 'children', title: 'Children's Privacy' },
          { id: 'changes', title: 'Policy Updates' },
          { id: 'contact', title: 'Contact Information' }
        ].map(section => (
          <li key={section.id}>
            <button
              onClick={() => setSelectedSection(section.id)}
              className="text-blue-600 hover:text-blue-800 hover:underline"
              aria-label={`Jump to ${section.title} section`}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const PrivacyOverview = () => (
    <section id="overview" className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Overview</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-green-800 mb-3">🛡️ Privacy-First Design</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div>
            <h4 className="font-medium">✅ What We Do:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Store your journal entries locally on your device</li>
              <li>Encrypt all data with industry-standard protection</li>
              <li>Give you complete control over your information</li>
              <li>Minimize data collection to essential functions only</li>
              <li>Comply with GDPR, CCPA, and COPPA regulations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">❌ What We Don't Do:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Read your private journal entries</li>
              <li>Share your data with third parties</li>
              <li>Use your content for advertising</li>
              <li>Track your location or device usage</li>
              <li>Require social media connections</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-gray-700">
        ALCHM is designed with trauma-informed principles, which means your privacy and safety 
        are our highest priorities. This policy explains exactly what data we collect, how we 
        use it, and how you can control it.
      </p>
    </section>
  );

  const DataCollection = () => (
    <section id="collection" className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">What We Collect</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Information We Collect</h3>
          <div className="grid grid-cols-1 gap-4">
            {privacyData.dataCollection.collected.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{item.type}</h4>
                <p className="text-gray-700 mb-3">{item.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Storage:</span>
                    <p className="text-gray-600">{item.storage}</p>
                  </div>
                  <div>
                    <span className="font-medium">Purpose:</span>
                    <p className="text-gray-600">{item.purpose}</p>
                  </div>
                  <div>
                    <span className="font-medium">Retention:</span>
                    <p className="text-gray-600">{item.retention}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Information We DON'T Collect</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {privacyData.dataCollection.notCollected.map((item, index) => (
                <div key={index} className="flex items-center text-sm text-blue-700">
                  <span className="text-blue-600 mr-2">❌</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const UserRights = () => (
    <section id="rights" className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
      <p className="text-gray-700 mb-6">
        You have complete control over your data in ALCHM. Here are your rights and how to exercise them:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {privacyData.userRights.map((right, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{right.right}</h3>
            <p className="text-gray-700 mb-3">{right.description}</p>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <span className="font-medium">How to:</span>
              <p className="text-gray-600">{right.action}</p>
            </div>
          </div>
        ))}
      </div>

      {showExportOptions && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3">Exercise Your Rights Now</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              📥 Download My Data
            </Button>
            <Button variant="outline" size="sm">
              🔒 Privacy Settings
            </Button>
            <Button variant="outline" size="sm">
              🗑️ Delete Account
            </Button>
            <Button variant="outline" size="sm">
              📧 Contact Privacy Team
            </Button>
          </div>
        </div>
      )}
    </section>
  );

  const ChildrensPrivacy = () => (
    <section id="children" className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Children's Privacy (COPPA Compliance)</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-3">Important Information for Parents</h3>
        <div className="space-y-4 text-yellow-700">
          <p>
            <strong>Age Requirement:</strong> ALCHM is designed for users 13 years and older. 
            We do not knowingly collect personal information from children under 13.
          </p>
          <p>
            <strong>Parental Controls:</strong> If you are a parent and believe your child 
            under 13 has provided us with personal information, please contact us immediately 
            at {privacyData.companyInfo.contact}.
          </p>
          <p>
            <strong>Teen Safety:</strong> For users 13-17, we encourage parental involvement 
            in digital wellness decisions while respecting teen privacy and autonomy.
          </p>
          <div className="bg-white p-4 rounded border border-yellow-300">
            <h4 className="font-medium text-yellow-800 mb-2">Safety Features for Young Users:</h4>
            <ul className="text-sm space-y-1">
              <li>• Extra privacy protections for users under 18</li>
              <li>• Enhanced crisis detection and resource provision</li>
              <li>• Clear, age-appropriate language in all interfaces</li>
              <li>• No social features or data sharing capabilities</li>
              <li>• Easy account deletion and data removal</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );

  if (variant === 'summary') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-xl font-bold">Privacy Summary</h2>
        </CardHeader>
        <CardContent>
          <PrivacyOverview />
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              Read Full Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Privacy Policy</h2>
              <Button variant="outline" size="sm">Close</Button>
            </div>
          </div>
          <div className="p-6">
            <PrivacyOverview />
            <DataCollection />
            <UserRights />
            <ChildrensPrivacy />
          </div>
        </div>
      </div>
    );
  }

  // Full policy
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600">
          Last updated: {new Date(privacyData.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      <TableOfContents />
      <PrivacyOverview />
      <DataCollection />
      <UserRights />
      <ChildrensPrivacy />

      {/* Contact Information */}
      <section id="contact" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> {privacyData.companyInfo.contact}</p>
            <p><strong>App:</strong> Settings → Support → Privacy Questions</p>
            <p><strong>Response Time:</strong> We respond to privacy inquiries within 48 hours</p>
          </div>
        </div>
      </section>

      {/* Legal Footer */}
      <div className="border-t pt-6 text-xs text-gray-500">
        <p>
          This Privacy Policy is effective as of {new Date(privacyData.effectiveDate).toLocaleDateString()} 
          and complies with GDPR, CCPA, COPPA, and other applicable privacy regulations.
        </p>
      </div>
    </div>
  );
}