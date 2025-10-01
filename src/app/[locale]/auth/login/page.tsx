import { Metadata } from 'next';
import LoginClientOptimized from './LoginClientOptimized';

// Generate static params for supported locales
export async function generateStaticParams() {
  const locales = ['en', 'es', 'pt', 'sw', 'ar', 'hi', 'zh', 'fr', 'yo', 'ko', 'de'];
  
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export const metadata: Metadata = {
  title: 'Login - ALCHM',
  description: 'Sign in to your ALCHM trauma-informed journaling sanctuary',
};

export default function LoginPage() {
  return <LoginClientOptimized />;
}