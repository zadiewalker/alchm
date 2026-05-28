'use client';

import MedicalDisclaimer from '@/components/MedicalDisclaimer';
import { useMedicalDisclaimer } from '@/hooks/useMedicalDisclaimer';

export default function ClientHomepage() {
  const { showDisclaimer, accept } = useMedicalDisclaimer();

  return (
    <>
      {/* Medical Disclaimer Modal */}
      {showDisclaimer && (
        <MedicalDisclaimer onAccept={accept} />
      )}
    </>
  );
}
