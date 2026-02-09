'use client';

import { useState, useEffect } from 'react';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { safeLocalStorage } from '@/utils/browser';

export default function ClientHomepage() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    
    // Check localStorage only on client side - with iOS WebView error handling
    const hasAccepted = safeLocalStorage.getItem('alchm_medical_disclaimer_accepted');
    if (!hasAccepted) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    // Safely store acceptance for iOS WebView
    safeLocalStorage.setItem('alchm_medical_disclaimer_accepted', 'true');
  };

  // Only render client-side components after hydration
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Medical Disclaimer Modal */}
      {showDisclaimer && (
        <MedicalDisclaimer onAccept={handleDisclaimerAccept} />
      )}
    </>
  );
}