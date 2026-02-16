'use client';

import { useEffect } from 'react';
import { migrateLegacyStorageKeys } from '@/lib/storageKeys';

export default function StorageMigrationBootstrap() {
  useEffect(() => {
    migrateLegacyStorageKeys();
  }, []);

  return null;
}
