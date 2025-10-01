'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface ParentalConsentManagerProps {
  userId: string;
  userAge: number;
  onConsentStatusChange: (status: 'required' | 'pending' | 'verified' | 'not_required') => void;
}

interface ParentalConsentRecord {
  status: 'required' | 'pending' | 'verified' | 'not_required';
  consentMethod?: 'digital_signature' | 'video_verification' | 'notarized_form' | 'credit_card_verification';
  consentDate?: string;
  parentEmail?: string;
  parentName?: string;
  verificationAttempts: number;
  lastVerificationAttempt?: string;
  consentWithdrawnDate?: string;
  educationalContext?: boolean;
  specialCircumstances?: string;
  complianceNotes: string[];
}

export default function EnhancedParentalConsentManager({ 
  userId, 
  userAge, 
  onConsentStatusChange 
}: ParentalConsentManagerProps) {
  const [consentRecord, setConsentRecord] = useState<ParentalConsentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced COPPA compliance check
  const requiresParentalConsent = (age: number, context?: any) => {
    // Standard COPPA: Under 13 requires parental consent
    if (age < 13) return true;
    
    // Enhanced protection for 17-18 year olds in certain contexts:
    if (age >= 17 && age < 18) {
      // Educational context may require parental notification/consent
      // Crisis intervention context may require emergency contact
      // Depends on state laws and institutional policies
      return context?.educationalContext || context?.parentalNotificationRequired;
    }
    
    return false;
  };

  useEffect(() => {
    loadConsentRecord();
  }, [userId]);

  const loadConsentRecord = async () => {
    try {
      setLoading(true);
      const consentDocRef = doc(db, 'parental_consent', userId);
      const consentDoc = await getDoc(consentDocRef);

      if (consentDoc.exists()) {
        const data = consentDoc.data() as ParentalConsentRecord;
        setConsentRecord(data);
        onConsentStatusChange(data.status);
      } else {
        // Create initial consent record
        const initialRecord: ParentalConsentRecord = {
          status: requiresParentalConsent(userAge) ? 'required' : 'not_required',
          verificationAttempts: 0,
          complianceNotes: [
            `Initial assessment: User age ${userAge}`,
            `COPPA requirement: ${requiresParentalConsent(userAge) ? 'Yes' : 'No'}`,
            `Created: ${new Date().toISOString()}`
          ]
        };

        await setDoc(consentDocRef, initialRecord);
        setConsentRecord(initialRecord);
        onConsentStatusChange(initialRecord.status);
      }
    } catch (err) {
      console.error('Error loading consent record:', err);
      setError('Failed to load consent information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initiateParentalConsentFlow = async (method: ParentalConsentRecord['consentMethod']) => {
    if (!consentRecord) return;

    try {
      setLoading(true);
      
      const updatedRecord: ParentalConsentRecord = {
        ...consentRecord,
        status: 'pending',
        consentMethod: method,
        verificationAttempts: consentRecord.verificationAttempts + 1,
        lastVerificationAttempt: new Date().toISOString(),
        complianceNotes: [
          ...consentRecord.complianceNotes,
          `Consent verification initiated: ${method}`,
          `Attempt #${consentRecord.verificationAttempts + 1}: ${new Date().toISOString()}`
        ]
      };

      await updateDoc(doc(db, 'parental_consent', userId), updatedRecord);
      setConsentRecord(updatedRecord);
      onConsentStatusChange('pending');

      // Trigger appropriate verification flow based on method
      await triggerVerificationFlow(method);

    } catch (err) {
      console.error('Error initiating consent flow:', err);
      setError('Failed to initiate parental consent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerVerificationFlow = async (method: ParentalConsentRecord['consentMethod']) => {
    switch (method) {
      case 'digital_signature':
        // Redirect to digital signature service
        window.open('https://forms.gle/parental-consent-signature', '_blank');
        break;
      
      case 'video_verification':
        // Schedule video verification call
        window.open('https://calendly.com/alchm-parental-verification', '_blank');
        break;
      
      case 'credit_card_verification':
        // Small charge verification (refunded)
        window.open('/verify-parental-consent-payment', '_blank');
        break;
      
      case 'notarized_form':
        // Download notarized form
        const link = document.createElement('a');
        link.href = '/legal/ALCHM_Parental_Consent_Form.pdf';
        link.download = 'ALCHM_Parental_Consent_Form.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
    }
  };

  const handleConsentWithdrawal = async () => {
    if (!consentRecord) return;

    try {
      setLoading(true);
      
      const updatedRecord: ParentalConsentRecord = {
        ...consentRecord,
        status: 'required',
        consentWithdrawnDate: new Date().toISOString(),
        complianceNotes: [
          ...consentRecord.complianceNotes,
          `Parental consent withdrawn: ${new Date().toISOString()}`,
          'User account restricted until new consent obtained'
        ]
      };

      await updateDoc(doc(db, 'parental_consent', userId), updatedRecord);
      setConsentRecord(updatedRecord);
      onConsentStatusChange('required');

      // Notify user of account restrictions
      alert('Parental consent has been withdrawn. Account features will be restricted until new consent is obtained.');

    } catch (err) {
      console.error('Error withdrawing consent:', err);
      setError('Failed to withdraw consent. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading parental consent information...</p>
        </div>
      </div>
    );
  }

  if (!consentRecord || consentRecord.status === 'not_required') {
    return (
      <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="text-lg font-bold text-green-800">No Parental Consent Required</h3>
            <p className="text-sm text-green-700">
              Based on your age ({userAge} years), parental consent is not required for using ALCHM.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* COPPA Compliance Notice */}
      <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">👨‍👩‍👧‍👦</span>
          <div>
            <h3 className="text-lg font-bold text-blue-800">COPPA Parental Consent Required</h3>
            <p className="text-sm text-blue-700">
              The Children's Online Privacy Protection Act (COPPA) requires verifiable parental consent 
              for users under 13, and our enhanced protection extends this to certain circumstances for users 17-18.
            </p>
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-blue-800 mb-2">Current Status:</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
              {consentRecord.status.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>User Age:</strong> {userAge} years</p>
            <p><strong>Verification Attempts:</strong> {consentRecord.verificationAttempts}</p>
            {consentRecord.lastVerificationAttempt && (
              <p><strong>Last Attempt:</strong> {new Date(consentRecord.lastVerificationAttempt).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {consentRecord.status === 'required' && (
          <div className="space-y-4">
            <h4 className="font-bold text-blue-800">Choose Verification Method:</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => initiateParentalConsentFlow('digital_signature')}
                className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-left transition-colors"
                disabled={loading}
              >
                <div className="font-bold mb-1">📝 Digital Signature</div>
                <div className="text-sm">Secure online form with digital signature verification</div>
              </button>

              <button
                onClick={() => initiateParentalConsentFlow('video_verification')}
                className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-left transition-colors"
                disabled={loading}
              >
                <div className="font-bold mb-1">📹 Video Verification</div>
                <div className="text-sm">Schedule a brief video call with ID verification</div>
              </button>

              <button
                onClick={() => initiateParentalConsentFlow('credit_card_verification')}
                className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-left transition-colors"
                disabled={loading}
              >
                <div className="font-bold mb-1">💳 Credit Card Verification</div>
                <div className="text-sm">Small charge verification (immediately refunded)</div>
              </button>

              <button
                onClick={() => initiateParentalConsentFlow('notarized_form')}
                className="p-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-left transition-colors"
                disabled={loading}
              >
                <div className="font-bold mb-1">📋 Notarized Form</div>
                <div className="text-sm">Download and return notarized consent form</div>
              </button>
            </div>
          </div>
        )}

        {consentRecord.status === 'pending' && (
          <div className="bg-yellow-100 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⏳ Verification In Progress</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Your parental consent verification is being processed. This typically takes 1-2 business days.
            </p>
            <p className="text-sm text-yellow-700">
              <strong>Method:</strong> {consentRecord.consentMethod?.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        )}

        {consentRecord.status === 'verified' && (
          <div className="bg-green-100 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">✅ Parental Consent Verified</h4>
            <p className="text-sm text-green-700 mb-3">
              Parental consent has been successfully verified. You have full access to ALCHM features.
            </p>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Verified:</strong> {consentRecord.consentDate ? new Date(consentRecord.consentDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Method:</strong> {consentRecord.consentMethod?.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Parent Contact:</strong> {consentRecord.parentEmail || 'On file'}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-green-200">
              <h5 className="font-bold text-green-800 mb-2">Parental Rights:</h5>
              <div className="space-y-2">
                <button
                  onClick={handleConsentWithdrawal}
                  className="block w-full text-left p-2 text-sm text-green-700 hover:bg-green-200 rounded transition-colors"
                >
                  🚫 Withdraw Consent (will restrict account access)
                </button>
                <button
                  onClick={() => window.open('mailto:privacy@alchm.com?subject=Parental Rights Inquiry')}
                  className="block w-full text-left p-2 text-sm text-green-700 hover:bg-green-200 rounded transition-colors"
                >
                  📧 Request Data Access/Deletion
                </button>
                <button
                  onClick={() => window.open('/privacy-policy#parental-rights', '_blank')}
                  className="block w-full text-left p-2 text-sm text-green-700 hover:bg-green-200 rounded transition-colors"
                >
                  📋 Review Parental Rights
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Audit Trail */}
      {consentRecord.complianceNotes.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2">📜 Compliance Audit Trail</h4>
          <div className="space-y-1 text-sm text-gray-600">
            {consentRecord.complianceNotes.map((note, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline mt-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* COPPA Information */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h4 className="font-bold text-purple-800 mb-2">ℹ️ About COPPA Compliance</h4>
        <div className="text-sm text-purple-700 space-y-2">
          <p>
            The Children's Online Privacy Protection Act (COPPA) requires verifiable parental consent 
            before collecting personal information from children under 13.
          </p>
          <p>
            ALCHM goes beyond COPPA requirements by providing additional protections for users 17-18 
            in certain contexts, ensuring the highest level of privacy protection for young users.
          </p>
          <p>
            <strong>Your Privacy Rights:</strong>
          </p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Parents can review, modify, or delete their child's personal information</li>
            <li>Parents can withdraw consent at any time</li>
            <li>We collect only the minimum information necessary for our services</li>
            <li>We never share personal information with third parties for marketing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}