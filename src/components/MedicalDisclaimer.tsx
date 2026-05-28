'use client';

import { useState } from 'react';

export default function MedicalDisclaimer({ onAccept }: { onAccept: () => void }) {
  const [hasAccepted, setHasAccepted] = useState(false);

  const handleAccept = () => {
    setHasAccepted(true);
    onAccept();
  };

  if (hasAccepted) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">⚕️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Important Medical Disclaimer
            </h2>
            <p className="text-gray-600">Please read carefully before continuing</p>
          </div>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                🚨 This is not medical treatment
              </h3>
              <p>
                ALCHM is a private journaling space that can offer AI-generated reflections. It is <strong>not</strong> a
                substitute for professional medical care, therapy, or psychiatric treatment.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">By using ALCHM, you understand that:</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>This app does not provide medical advice or diagnoses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Khepera reflections are for reflection purposes only, not medical guidance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>You should consult qualified healthcare professionals for mental health concerns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Emergency services (911, 988) should be contacted for immediate crisis situations</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">
                🆘 If you're experiencing a mental health crisis:
              </h3>
              <p className="text-red-800">
                Please contact emergency services immediately at 911 or call the 
                988 Suicide & Crisis Lifeline. ALCHM's crisis detection is a supportive 
                feature but should not be relied upon as your sole safety resource.
              </p>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              <p>
                By proceeding, you acknowledge that you have read and understood this disclaimer. 
                You agree to use ALCHM as a wellness tool alongside, not instead of, 
                professional medical care when needed.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleAccept}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              I Understand & Accept
            </button>
            <p className="text-center text-xs text-gray-500">
              This disclaimer helps ensure you use ALCHM safely and appropriately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
