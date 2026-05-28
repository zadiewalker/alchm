import { useState } from 'react';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { clientStorageService } from '@/services/storage/clientStorageService';

export function useFirstEntryExperience(): boolean {
  const [isFirstEntry] = useState(
    () => clientStorageService.get(STORAGE_KEYS.FIRST_ENTRY_COMPLETED) !== 'true',
  );
  return isFirstEntry;
}
