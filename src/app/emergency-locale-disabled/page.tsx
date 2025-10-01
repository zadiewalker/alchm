import { Metadata } from 'next';
import EmergencySafeInterface from '@/components/crisis/EmergencySafeInterface';

export const metadata: Metadata = {
  title: 'Emergency Help - Crisis Support | ALCHM',
  description: 'Immediate crisis support and emergency resources. You are not alone.',
  robots: 'index, follow'
};

export default function EmergencyPage() {
  return <EmergencySafeInterface />;
}