'use client';
import { ReactNode } from 'react';

interface LocalizationProviderProps {
  children: ReactNode;
}

export default function LocalizationProvider({ children }: LocalizationProviderProps) {
  return <>{children}</>;
}