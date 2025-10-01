import { Metadata } from 'next';
import CrisisSupportInterface from '../../../components/crisis/CrisisSupportInterface';

export const metadata: Metadata = {
  title: 'Crisis Support - Immediate Help | ALCHM',
  description: 'Crisis support resources and immediate help. Safe space for mental health support.',
  robots: 'index, follow'
};

export default function CrisisPage() {
  return <CrisisSupportInterface />;
}