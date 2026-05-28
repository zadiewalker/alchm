import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { clientStorageService } from '@/services/storage/clientStorageService';

export interface MedicalDisclaimerState {
  showDisclaimer: boolean;
  accept: () => void;
}

export function useMedicalDisclaimer(): MedicalDisclaimerState {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    setShowDisclaimer(clientStorageService.get(STORAGE_KEYS.MEDICAL_DISCLAIMER_ACCEPTED) !== 'true');
  }, []);

  const accept = useCallback((): void => {
    clientStorageService.set(STORAGE_KEYS.MEDICAL_DISCLAIMER_ACCEPTED, 'true');
    setShowDisclaimer(false);
  }, []);

  return { showDisclaimer, accept };
}
